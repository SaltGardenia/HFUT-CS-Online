#!/usr/bin/env bash
# 逐个构建分支预览，产物落到 <dist>/preview/<slug>/。
# 由 .github/workflows/deploy.yml 调用：build-previews.sh <targets.json> <dist 目录>
# 依赖 preview-targets.mjs 的产物；单个分支构建失败只跳过该预览，不影响主站部署。
set -euo pipefail

targets_json="${1:?用法: build-previews.sh <targets.json> <dist 目录>}"
dist="${2:?用法: build-previews.sh <targets.json> <dist 目录>}"
site_base="${SITE_BASE:-/HFUT-CS-Online/}"
preview_root="$dist/preview"
tmp="${RUNNER_TEMP:-/tmp}"
built_file="$tmp/preview-built.txt"
out_root="$tmp/preview-out"
mkdir -p "$preview_root" "$tmp"
: >"$built_file"
rm -rf "$out_root"
mkdir -p "$out_root"
mapfile -t rows < <(node -e '
const { readFileSync } = require("node:fs");
for (const t of JSON.parse(readFileSync(process.argv[1], "utf8"))) {
  console.log([t.slug, t.ref].join("\t"));
}' "$targets_json")

# 当前 node_modules 是否对应 main 的依赖声明；分支之间依赖不一致时来回切换要重装
deps_state="main"

for row in "${rows[@]}"; do
  IFS=$'\t' read -r slug ref <<<"$row"
  echo "::group::预览 $slug（$ref）"

  git checkout -f --quiet --detach "$ref"

  # 只有依赖声明与当前安装状态不一致时才跑 npm ci
  if git diff --quiet origin/main "$ref" -- package.json package-lock.json; then
    want="main"
  else
    want="branch"
  fi
  if [ "$want" != "$deps_state" ]; then
    echo "依赖声明变化，重新 npm ci"
    if ! npm ci --no-audit --no-fund; then
      echo "::warning::预览 $slug 依赖安装失败，已跳过（主站不受影响）"
      deps_state="broken"
      echo "::endgroup::"
      continue
    fi
    deps_state="$want"
  fi

  # 预览只做打包（类型检查与测试在主站构建 / CI 里跑），
  # 用 --base 把整站搬到自己的子目录：站内资源与附件清单都走 BASE_URL，会一起迁移。
  # 走 CLI 而不是 vite.config 的 env，分支不需要先合入本功能也能正确预览。
  out="$out_root/$slug"
  if npx vite build --base="${site_base}preview/${slug}/" --outDir "$out" --emptyOutDir; then
    mkdir -p "$preview_root/$slug"
    cp -R "$out/." "$preview_root/$slug/"
    echo "$slug" >>"$built_file"
  else
    echo "::warning::预览 $slug 构建失败，已跳过（主站不受影响）"
  fi
  echo "::endgroup::"
done

echo "构建完成的预览：$(tr '\n' ' ' <"$built_file")"

# 循环把工作区留在了最后一个预览分支上（那里的 .github/scripts 可能还不存在），
# 后续索引页生成与产物整理都要回 main
git checkout -f --quiet --detach origin/main

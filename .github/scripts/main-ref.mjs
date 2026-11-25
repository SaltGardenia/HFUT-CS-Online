#!/usr/bin/env node
/* 决定主站要构建的 git 引用。
 *
 *   ① workflow 传入的 ref 优先（发版传 tag，手动运行可传 tag 回滚或传 main）；
 *   ② 否则取最近一次已发布 Release 的 tag；
 *   ③ 仓库还没有 Release 时退回 origin/main，保证首次接入也能部署。
 *
 * 产物：GITHUB_OUTPUT 的 ref（解析后的完整 SHA）、label、source。
 * 解析前会先 git fetch --tags：tag 可能是刚刚由 Release 事件创建的。 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const run = (cmd, args) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tryRun = (cmd, args) => {
  try {
    return run(cmd, args);
  } catch {
    return null;
  }
};

const input = (process.env.INPUT_REF ?? '').trim();
const repo = process.env.GITHUB_REPOSITORY ?? '';

const resolveRef = (ref) => {
  tryRun('git', ['fetch', '--tags', '--force', 'origin']);
  return tryRun('git', ['rev-parse', '--verify', `${ref}^{commit}`]) ?? '';
};

/* 最近一次 Release 的 tag；gh 不可用或没有 Release（404）时返回空串 */
const latestReleaseTag = () => {
  if (!repo) return '';
  const tag = tryRun('gh', ['api', `repos/${repo}/releases/latest`, '--jq', '.tag_name']);
  // gh 出错时偶有把错误信息写到 stdout 的情况，不像 tag 就丢掉
  return tag && !tag.startsWith('{') && !tag.includes(' ') ? tag : '';
};

let ref;
let label;
let source;

if (input) {
  ref = resolveRef(input);
  if (!ref) {
    console.error(`[main-ref] 找不到引用：${input}`);
    process.exit(1);
  }
  label = input;
  source = 'input';
} else {
  const tag = latestReleaseTag();
  ref = tag ? resolveRef(tag) : '';
  if (ref) {
    label = tag;
    source = 'release';
  } else {
    ref = tryRun('git', ['rev-parse', '--verify', 'origin/main^{commit}']) ?? '';
    label = 'origin/main（尚无 Release）';
    source = 'fallback';
  }
}

if (!ref) {
  console.error('[main-ref] 既没有 Release 也没有 origin/main，无法确定主站版本');
  process.exit(1);
}

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `ref=${ref}\nlabel=${label}\nsource=${source}\n`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `主站版本：${label}（${ref.slice(0, 7)}，来源 ${source}）\n`);
}
console.log(`[main-ref] 主站版本 ${label} → ${ref}`);

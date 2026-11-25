#!/usr/bin/env node
/* 计算本次部署要产出的分支预览清单。
 *
 * 预览对象（同仓库内）：
 *   ① 开着的 PR 的 head 分支（PR 关闭后下一次运行即消失）；
 *   ② 领先 main 且在 PREVIEW_TTL_DAYS 天内推送过的分支（无需开 PR）。
 * 按最近提交时间倒序、最多 PREVIEW_MAX 个，避免每次 push 都重建一堆陈旧分支。
 *
 * 产物：$RUNNER_TEMP/preview-targets.json + GITHUB_OUTPUT 的 count / file。
 * 每项 { slug, ref, branch, label, pr, sha, date }：slug 是 URL 段，ref 是 git 可检出的引用。 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const MAIN = 'origin/main';
const max = Number(process.env.PREVIEW_MAX ?? 8);
const ttlDays = Number(process.env.PREVIEW_TTL_DAYS ?? 14);

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

/* 分支名 → URL 段：斜杠换 --，其余非 ASCII 安全字符丢弃；丢弃过东西（中文分支名等）
 * 就补 6 位内容哈希，避免不同分支撞到同一个 slug。 */
function slugify(branch) {
  const flat = branch.replaceAll('/', '--');
  const ascii = flat.replace(/[^A-Za-z0-9._-]/g, '');
  const clean = ascii.replace(/^[.-]+/, '');
  if (ascii === flat) return clean || `branch-${createHash('sha1').update(branch).digest('hex').slice(0, 6)}`;
  const hash = createHash('sha1').update(branch).digest('hex').slice(0, 6);
  return `${clean || 'branch'}-${hash}`;
}

/* 开着的 PR：本仓库分支按分支名索引；fork 的 head 分支单独用 refs/pull/<n>/head 取 */
let prByBranch = new Map();
let forkPrs = [];
try {
  const json = execFileSync(
    'gh',
    ['pr', 'list', '--state', 'open', '--limit', '200', '--json', 'number,headRefName,isCrossRepository'],
    { encoding: 'utf8' },
  );
  const prs = JSON.parse(json);
  prByBranch = new Map(prs.filter((pr) => !pr.isCrossRepository).map((pr) => [pr.headRefName, pr.number]));
  // fork 的 head 分支不在本仓库 origin 上，用 base 仓库的 refs/pull/<n>/head 取。
  // 每个外部 PR 要一次 fetch，限制数量，避免一次部署拉几十个远端分支。
  forkPrs = prs.filter((pr) => pr.isCrossRepository).slice(0, 20);
} catch (err) {
  console.warn(`[preview-targets] 读取 PR 列表失败，本次只按分支规则生成预览：${err.message}`);
}

const now = Math.floor(Date.now() / 1000);
const ttl = ttlDays * 86400;

const candidates = [];
for (const line of git(
  'for-each-ref',
  '--sort=-committerdate',
  '--format=%(refname:strip=3)%09%(committerdate:unix)%09%(objectname:short)',
  'refs/remotes/origin',
).split('\n')) {
  const [branch, date, sha] = line.trim().split('\t');
  if (!branch || branch === 'HEAD' || branch === 'main') continue;

  const pr = prByBranch.get(branch) ?? null;
  const fresh = now - Number(date) <= ttl;
  if (!pr && !fresh) continue;

  // 已合并 / 与 main 无差异的分支没必要占位
  let ahead = 0;
  try {
    ahead = Number(git('rev-list', '--count', `${MAIN}..origin/${branch}`));
  } catch {
    continue;
  }
  if (!ahead) continue;

  candidates.push({
    branch,
    date: Number(date),
    sha,
    pr,
    ahead,
    ref: `origin/${branch}`,
    // 有 PR 的分支统一用 pr-<编号>：PR 评论里回贴的链接才能稳定对上（fork PR 也只有这个 slug）
    slugBase: pr ? `pr-${pr}` : slugify(branch),
  });
}

/* 外部 PR：fetch 到 origin/pr-<n>，构建时再合并到当前 main（GitHub 的 merge ref
 * 只在 PR 同步时更新，拿不到主站之后的修复，所以这里取 head、由构建脚本现合）。 */
for (const pr of forkPrs) {
  const ref = `origin/pr-${pr.number}`;
  try {
    execFileSync('git', ['fetch', '--no-tags', '--quiet', 'origin', `+refs/pull/${pr.number}/head:refs/remotes/${ref}`], {
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch (err) {
    console.warn(`[preview-targets] 取不到 PR #${pr.number} 的 head（fork 可能已删除）：${err.message.split('\n')[0]}`);
    continue;
  }
  try {
    const sha = git('rev-parse', '--short', ref);
    const date = Number(git('log', '-1', '--format=%ct', ref));
    const ahead = Number(git('rev-list', '--count', `${MAIN}..${ref}`));
    if (!ahead) continue;
    candidates.push({
      branch: pr.headRefName ?? `pr-${pr.number}`,
      date,
      sha,
      pr: pr.number,
      ahead,
      ref,
      slugBase: `pr-${pr.number}`,
      fork: true,
      merge: true,
    });
  } catch (err) {
    console.warn(`[preview-targets] 解析 PR #${pr.number} 失败：${err.message.split('\n')[0]}`);
  }
}

candidates.sort((a, b) => b.date - a.date);
const picked = candidates.slice(0, max);
if (candidates.length > picked.length) {
  console.warn(`[preview-targets] ${candidates.length} 个分支符合条件，按最近提交只保留 ${picked.length} 个（PREVIEW_MAX）`);
}

const used = new Set();
const targets = picked.map((c) => {
  let slug = c.slugBase;
  for (let i = 2; used.has(slug); i++) slug = `${c.slugBase}-${i}`;
  used.add(slug);
  return {
    slug,
    ref: c.ref,
    branch: c.branch,
    label: c.pr ? `#${c.pr} · ${c.branch}${c.fork ? '（fork）' : ''}` : c.branch,
    pr: c.pr,
    sha: c.sha,
    date: c.date,
    ahead: c.ahead,
    ...(c.fork ? { fork: true } : {}),
    ...(c.merge ? { merge: true } : {}),
  };
});

const file = join(process.env.RUNNER_TEMP ?? tmpdir(), 'preview-targets.json');
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(targets, null, 2));
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `count=${targets.length}\n`);
  appendFileSync(process.env.GITHUB_OUTPUT, `file=${file}\n`);
}
console.log(`[preview-targets] 预览 ${targets.length} 个分支：${targets.map((t) => t.branch).join(', ') || '（无）'}`);

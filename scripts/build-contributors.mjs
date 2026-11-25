/* 构建时聚合 5 个仓库（主仓库 + 4 个上游）的贡献者，生成 src/content/contributors.ts。
 * 页面因此零运行时 API 请求（浏览器端匿名 40/h 限流不可靠）；CI 中用 GITHUB_TOKEN（5k/h）。
 * 全部拉取失败时保留现有生成文件，不中断构建。 */
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, '..', 'src', 'content', 'contributors.ts');

const REPOS = [
  'SaltGardenia/HFUT-CS-Online', // 主仓库在前
  'sunmiao0301/HFUT-CS',
  'mox-hub/hfut-cs',
  'styitches/HFUT-CS',
  'Tuning-Luna/HFUT_XC_Study_Things',
];

const HEADERS = { 'User-Agent': 'hfut-cs-online-build' };
if (process.env.GITHUB_TOKEN) HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

/** 自动化账号不进头像墙：API 的 type 偶尔也会把 App 账号标成 User，按 login 再兜一层 */
const BOT_LOGINS = new Set([
  'github-actions',
  'dependabot',
  'release-please',
  'copilot',
  'renovate',
  'codecov',
  'github-pages',
]);
const isBot = (c) => c.type === 'Bot' || /\[bot\]$/i.test(c.login) || BOT_LOGINS.has(c.login.toLowerCase());

async function fetchContributors(repo) {
  const url = `https://api.github.com/repos/${repo}/contributors?per_page=100`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (res.status === 403 || res.status === 429) {
        console.warn(`[build-contributors] ${repo}: ${res.status}（限流），第 ${i + 1} 次重试`);
      } else if (!res.ok) {
        console.warn(`[build-contributors] ${repo}: HTTP ${res.status}`);
        return [];
      }
      if (res.ok) {
        const list = await res.json();
        return Array.isArray(list)
          ? list.filter((c) => c.login && !isBot(c)).map((c) => ({
              login: c.login,
              avatar_url: c.avatar_url,
              html_url: c.html_url,
              repo,
            }))
          : [];
      }
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e) {
      console.warn(`[build-contributors] ${repo}: ${e.message}，第 ${i + 1} 次重试`);
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return [];
}

const lists = [];
for (const repo of REPOS) lists.push(await fetchContributors(repo));

if (lists.every((l) => l.length === 0) && existsSync(OUT)) {
  console.warn('[build-contributors] 全部仓库拉取失败，保留现有 contributors.ts');
  process.exit(0);
}

const seen = new Set();
const merged = [];
for (const list of lists) {
  for (const c of list) {
    if (seen.has(c.login)) continue;
    seen.add(c.login);
    merged.push(c);
  }
}

const rows = merged
  .map(
    (c) =>
      `  { login: ${JSON.stringify(c.login)}, avatar_url: ${JSON.stringify(c.avatar_url)}, html_url: ${JSON.stringify(c.html_url)}, repo: ${JSON.stringify(c.repo)} },`,
  )
  .join('\n');

writeFileSync(
  OUT,
  `/* 【自动生成】由 scripts/build-contributors.mjs 在构建时聚合 5 个仓库的贡献者，请勿手改。
 * 主仓库贡献者在前，上游仓库随后；按 login 去重，共 ${merged.length} 人。 */

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  /** 贡献来自哪个仓库 */
  repo: string;
}

export const contributors: Contributor[] = [
${rows}
];
`,
  'utf8',
);
console.log(`[build-contributors] ${merged.length} 位贡献者 → ${OUT}`);

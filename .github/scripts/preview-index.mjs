#!/usr/bin/env node
/* 生成 <dist>/preview/index.html —— 分支预览索引页。
 * 用法：preview-index.mjs <targets.json> <built.txt> <dist 目录>
 * built.txt 是 build-previews.sh 记录的「真正构建成功」的 slug，失败的分支不列入。 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [targetsPath, builtPath, dist] = process.argv.slice(2);
if (!targetsPath || !builtPath || !dist) {
  console.error('用法: preview-index.mjs <targets.json> <built.txt> <dist 目录>');
  process.exit(1);
}

const targets = JSON.parse(readFileSync(targetsPath, 'utf8'));
const built = new Set(
  (existsSync(builtPath) ? readFileSync(builtPath, 'utf8') : '').split('\n').map((s) => s.trim()).filter(Boolean),
);
const rows = targets.filter((t) => built.has(t.slug));

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const day = (unix) => new Date(unix * 1000).toISOString().slice(0, 10);

const cards = rows
  .map(
    (t) => `      <a class="card" href="./${esc(t.slug)}/">
        <div class="head">
          <span class="branch">${esc(t.branch)}</span>
          ${t.pr ? `<span class="tag">#${t.pr}</span>` : ''}
        </div>
        <div class="meta">${esc(t.sha)} · ${day(t.date)} · 领先 main ${t.ahead} 个提交</div>
        <span class="go" aria-hidden="true">→</span>
      </a>`,
  )
  .join('\n');

const body = rows.length
  ? cards
  : '      <p class="empty">当前没有可预览的分支</p>';

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>分支预览 · HFUT-CS-Online</title>
    <style>
      :root {
        color-scheme: light dark;
        --bg: #f5f5f7;
        --panel: #ffffff;
        --ink: #1d1d1f;
        --ink-2: #6e6e73;
        --hairline: rgba(0, 0, 0, 0.12);
        --accent: #0071e3;
        --shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06);
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #000000;
          --panel: #1c1c1e;
          --ink: #f5f5f7;
          --ink-2: #a1a1a6;
          --hairline: rgba(255, 255, 255, 0.14);
          --accent: #2997ff;
          --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5);
        }
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background: var(--bg);
        color: var(--ink);
        font: 15px/1.5 -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC',
          'Microsoft YaHei', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      main { max-width: 880px; margin: 0 auto; padding: 64px 24px 80px; }
      h1 { margin: 0 0 4px; font-size: 32px; letter-spacing: -0.02em; }
      .sub { margin: 0 0 32px; color: var(--ink-2); font-size: 14px; }
      .sub a { color: var(--accent); text-decoration: none; }
      .sub a:hover { text-decoration: underline; }
      .list { display: grid; gap: 12px; }
      .card {
        position: relative;
        display: block;
        padding: 18px 52px 18px 20px;
        background: var(--panel);
        border: 1px solid var(--hairline);
        border-radius: 16px;
        color: inherit;
        text-decoration: none;
        box-shadow: var(--shadow);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }
      .card:hover { transform: scale(1.012); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 14px 36px rgba(0, 0, 0, 0.12); }
      .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      .head { display: flex; align-items: baseline; gap: 8px; }
      .branch {
        font: 600 16px/1.35 ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
        overflow-wrap: anywhere;
      }
      .tag {
        flex: none;
        padding: 1px 8px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--accent) 14%, transparent);
        color: var(--accent);
        font-size: 12px;
        font-weight: 600;
      }
      .meta { margin-top: 6px; color: var(--ink-2); font-size: 13px; }
      .go { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: var(--ink-2); font-size: 18px; }
      .card:hover .go { color: var(--accent); }
      .empty { color: var(--ink-2); }
      .foot { margin-top: 32px; color: var(--ink-2); font-size: 12px; }
    </style>
  </head>
  <body>
    <main>
      <h1>分支预览</h1>
      <p class="sub">${rows.length} 个分支 · <a href="../">回到主站</a></p>
      <div class="list">
${body}
      </div>
      <p class="foot">未开 PR 且 14 天未推送的分支自动下线；每次 push 重建。</p>
    </main>
  </body>
</html>
`;

mkdirSync(join(dist, 'preview'), { recursive: true });
writeFileSync(join(dist, 'preview', 'index.html'), html);
console.log(`[preview-index] 已生成索引页，收录 ${rows.length} 个预览`);

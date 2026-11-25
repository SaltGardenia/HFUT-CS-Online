#!/usr/bin/env node
/* 用显式版本号发布 Pages 产物。
 *
 * actions/deploy-pages 固定拿 GITHUB_SHA 当 pages_build_version，而同一提交的第二次部署
 * 会被 Pages 按版本去重（返回成功但内容不更新）。PR 预览需要在 workflow_run 里发布，
 * 那个运行的 SHA 恒为 main 的最新提交，所以这里直接调 Pages 部署 API，自己给版本号。
 *
 * 依赖（由调用方设置）：
 *   GITHUB_TOKEN        已声明的 token（需要 pages: write、actions: read）
 *   PAGES_VERSION       唯一的版本字符串，例如 PR head SHA
 *   GITHUB_RUN_ID       当前运行 id（用来查本次上传的 github-pages 产物）
 *   ACTIONS_ID_TOKEN_REQUEST_URL / ACTIONS_ID_TOKEN_REQUEST_TOKEN  （id-token: write）
 */
import { appendFileSync } from 'node:fs';

const API = 'https://api.github.com';
const REPO = process.env.GITHUB_REPOSITORY;
const TOKEN = process.env.GITHUB_TOKEN;
const VERSION = process.env.PAGES_VERSION;
const RUN_ID = process.env.GITHUB_RUN_ID;
const ARTIFACT_NAME = process.env.PAGES_ARTIFACT_NAME ?? 'github-pages';

if (!REPO || !TOKEN || !VERSION || !RUN_ID) {
  console.error('[pages-deploy] 缺少 GITHUB_REPOSITORY / GITHUB_TOKEN / PAGES_VERSION / GITHUB_RUN_ID');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'hfut-cs-online-pages-deploy',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  if (!res.ok) {
    throw new Error(`${init.method ?? 'GET'} ${url} → ${res.status} ${(await res.text()).slice(0, 400)}`);
  }
  return res.json();
}

/* 1) 取本次运行上传的 Pages 产物 id */
const list = await api(`${API}/repos/${REPO}/actions/runs/${RUN_ID}/artifacts?name=${encodeURIComponent(ARTIFACT_NAME)}`);
const artifact = list.artifacts?.find((a) => a.name === ARTIFACT_NAME);
if (!artifact) throw new Error(`本次运行里没有名为 ${ARTIFACT_NAME} 的产物`);
console.log(`[pages-deploy] 产物 #${artifact.id}，${artifact.size_in_bytes} 字节`);

/* 2) 取 OIDC token（与 actions/deploy-pages 的做法一致：用请求地址的默认 audience） */
const oidcUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
const oidcRequestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
if (!oidcUrl || !oidcRequestToken) {
  throw new Error('缺少 ACTIONS_ID_TOKEN_REQUEST_URL / TOKEN，请确认权限含 id-token: write');
}
const oidcRes = await fetch(oidcUrl, {
  headers: { Authorization: `Bearer ${oidcRequestToken}`, 'User-Agent': headers['User-Agent'] },
});
if (!oidcRes.ok) throw new Error(`获取 OIDC token 失败：${oidcRes.status} ${(await oidcRes.text()).slice(0, 300)}`);
const { value: idToken } = await oidcRes.json();

/* 3) 创建部署并等待结果。
 * `deployment_failed` 偶发但可重试（Pages 后端瞬时失败）；其余终态直接报错。 */
const FINAL_ERRORS = new Set([
  'deployment_failed',
  'deployment_content_failed',
  'deployment_cancelled',
  'deployment_lost',
  'artifact_expired',
  'artifact_invalid',
  'deployment_permissions_failed',
]);

async function deployOnce() {
  const created = await api(`${API}/repos/${REPO}/pages/deployments`, {
    method: 'POST',
    body: JSON.stringify({ artifact_id: artifact.id, pages_build_version: VERSION, oidc_token: idToken }),
  });
  const deploymentId = created.id ?? String(created.status_url ?? '').split('/').pop();
  console.log(`[pages-deploy] 已创建部署 ${deploymentId}，版本 ${VERSION}`);

  const deadline = Date.now() + 10 * 60 * 1000;
  let status = created.status ?? 'queued';
  let failures = 0;
  while (Date.now() < deadline) {
    if (status === 'succeed' || FINAL_ERRORS.has(status)) return status;
    await sleep(5000);
    try {
      const current = await api(`${API}/repos/${REPO}/pages/deployments/${deploymentId}`);
      status = current.status;
      console.log(`[pages-deploy] 状态：${status}`);
      failures = 0;
    } catch (err) {
      // 状态接口偶发 5xx 时重试几次再放弃
      if (++failures >= 6) throw err;
      console.warn(`[pages-deploy] 查询状态失败（第 ${failures} 次）：${err.message.split('\n')[0]}`);
    }
  }
  return status;
}

let status = 'queued';
for (let attempt = 1; attempt <= 3; attempt++) {
  status = await deployOnce();
  if (status === 'succeed') {
    console.log('[pages-deploy] 发布成功');
    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Pages 发布成功（版本 ${VERSION}）\n`);
    }
    process.exit(0);
  }
  if (status !== 'deployment_failed') break;
  console.warn(`[pages-deploy] 部署瞬时失败（第 ${attempt} 次），15 秒后重试`);
  await sleep(15000);
}
throw new Error(`Pages 发布失败：${status}`);

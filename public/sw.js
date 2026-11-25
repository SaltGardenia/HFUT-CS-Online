/* HFUT-CS-Online · 离线缓存 Service Worker
 *
 * 策略：
 * - 页面导航：network-first，在线一律用最新产物，只有网络失败才回退缓存。
 *   （旧版导航也走 stale-while-revalidate：部署后打开仍跑旧构建，
 *     账号入口、勘误这类新功能要强制刷新才出现）
 * - 静态资源：cache-first，文件名带内容哈希，天然不可变，命中即回。
 * - 缓存名带构建号：注册时在 sw.js?b=<构建号> 上带一版，activate 时清掉本作用域的旧缓存，
 *   顺带把历史遗留的 hb-offline-v1 一并回收。
 * - attachments/ 下载不进缓存：体积大、更新少，交给浏览器自己的 HTTP 缓存，
 *   免得把 Cache Storage 撑大、挤掉真正需要离线可用的产物。
 */
const SCOPE_ID =
  new URL(self.registration.scope).pathname
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'root';
const BUILD = new URL(self.location.href).searchParams.get('b') || 'dev';
const CACHE_PREFIX = `hb-offline-${SCOPE_ID}-`;
const CACHE = `${CACHE_PREFIX}${BUILD}`;
const LEGACY_CACHE = 'hb-offline-v1';
const MAX_CACHED_BYTES = 4 * 1024 * 1024;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n !== CACHE && (n === LEGACY_CACHE || n.startsWith(CACHE_PREFIX)))
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 页面本身：先问网络，拿到就回最新的
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(event));
    return;
  }

  // 附件下载体积大、更新少，交给浏览器自己的 HTTP 缓存
  if (url.pathname.includes('/attachments/')) return;

  event.respondWith(cacheFirst(event));
});

async function networkFirst(event) {
  const req = event.request;
  try {
    // no-store：绕开 HTTP 缓存，部署后立刻拿到新 HTML
    const res = await fetch(req, { cache: 'no-store' });
    if (res && res.status === 200) event.waitUntil(putSafe(req, res.clone()));
    return res;
  } catch {
    return (await matchSafe(req)) ?? offlineFallback();
  }
}

async function cacheFirst(event) {
  const req = event.request;
  const cached = await matchSafe(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) event.waitUntil(putSafe(req, res.clone()));
    return res;
  } catch {
    return Response.error();
  }
}

async function matchSafe(req) {
  try {
    const cache = await caches.open(CACHE);
    return await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
  } catch {
    return undefined;
  }
}

/** 写入失败（配额满 / 隐私模式）只影响离线能力，不能影响当前请求 */
async function putSafe(req, res) {
  try {
    const size = Number(res.headers.get('content-length') ?? 0);
    if (size > MAX_CACHED_BYTES) return;
    const cache = await caches.open(CACHE);
    await cache.put(req, res);
  } catch {
    /* 忽略：下次照常走网络 */
  }
}

function offlineFallback() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>离线</title><body style="font:16px/1.7 system-ui;padding:48px 24px;text-align:center">' +
      '当前网络不可用，这一页也还没有缓存过。<br>' +
      '<button style="margin-top:16px;padding:8px 20px" onclick="location.reload()">重试</button>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

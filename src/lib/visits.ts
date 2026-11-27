import { useEffect, useState } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, syncEnabled } from './sync/config';

export interface SiteVisits {
  total: number;
  today: number;
}

/** 本地访客 / 会话标识的存储键：只用于同日同会话去重，不含任何个人信息。 */
const VISITOR_KEY = 'hb-visitor-id';
const SESSION_KEY = 'hb-visit-session';
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

function randomId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `v-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function readStorage(kind: 'local' | 'session'): Storage | undefined {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    // 隐私模式 / 存储被禁用时连访问属性都可能抛错
    return undefined;
  }
}

function storedId(storage: Storage | undefined, key: string): string {
  try {
    const saved = storage?.getItem(key);
    if (saved && ID_RE.test(saved)) return saved;
    const id = randomId();
    storage?.setItem(key, id);
    return id;
  } catch {
    return randomId();
  }
}

/** 浏览器长期访客标识（localStorage），跨天仍保留。 */
export function visitorId(): string {
  return storedId(readStorage('local'), VISITOR_KEY);
}

/** 本次标签页会话标识（sessionStorage），用于避免刷新重复计数。 */
export function visitSessionId(): string {
  return storedId(readStorage('session'), SESSION_KEY);
}

/**
 * 调用 record_site_visit RPC：上报一次访问，并取回累计/今日计数。
 * 任何失败（未建表、断网、RPC 未部署）都返回 null，首页静默不显示这两项。
 */
export async function requestSiteVisit(
  url: string,
  anonKey: string,
  visitor = visitorId(),
  session = visitSessionId(),
): Promise<SiteVisits | null> {
  // 请求挂住也要有个头；放长到 8s，慢网也尽量让它跑完（计数会写进缓存兜底）
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${url}/rest/v1/rpc/record_site_visit`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_visitor: visitor, p_session: session }),
      // 用户可能上报后立刻关页；keepalive 让请求有机会完成
      keepalive: true,
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { total?: unknown; today?: unknown };
    const total = Number(data?.total);
    const today = Number(data?.today);
    if (!Number.isFinite(total) || !Number.isFinite(today)) return null;
    return { total, today };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

let visitRequest: Promise<SiteVisits | null> | null = null;
/** 请求结果缓存：首页晚于上报挂载时直接取用，不必先闪一帧骨架 */
let visitResult: SiteVisits | null | undefined;

/** 上一次成功拿到的计数：请求慢或失败时先用它兜底，别让首页两项忽然消失 */
const VISITS_CACHE_KEY = 'hb-site-visits';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 读缓存；只认同一天的计数（「今日访问量」跨天就作废） */
export function readVisitsCache(): SiteVisits | null {
  try {
    const raw = readStorage('local')?.getItem(VISITS_CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { total?: unknown; today?: unknown; day?: unknown };
    const total = Number(data.total);
    const today = Number(data.today);
    if (data.day !== todayKey()) return null;
    if (!Number.isFinite(total) || !Number.isFinite(today)) return null;
    return { total, today };
  } catch {
    return null;
  }
}

function writeVisitsCache(visits: SiteVisits): void {
  try {
    readStorage('local')?.setItem(VISITS_CACHE_KEY, JSON.stringify({ ...visits, day: todayKey() }));
  } catch {
    // 存储被禁用时忽略：只是少了兜底，不影响显示
  }
}

/**
 * 每次打开站点只上报一次：SPA 内部跳转、React StrictMode 的重复执行
 * 都复用同一个请求；服务端再按「访客 + 会话 + 日期」去重。
 */
export function recordSiteVisit(): Promise<SiteVisits | null> {
  if (!syncEnabled) return Promise.resolve(null);
  visitRequest ??= requestSiteVisit(SUPABASE_URL, SUPABASE_ANON_KEY).then((value) => {
    visitResult = value;
    if (value) writeVisitsCache(value);
    return value;
  });
  return visitRequest;
}

export interface SiteVisitsState {
  /** 是否接入访问统计：未配置数据库时首页不渲染这两项 */
  enabled: boolean;
  /** 请求仍在路上 */
  pending: boolean;
  /** 计数：优先当天缓存，拿不到又没缓存时为 null（两项收起） */
  visits: SiteVisits | null;
}

/** 首页数字行：有当天缓存就先拿缓存顶上，请求回来再换成新值。 */
export function useSiteVisits(): SiteVisitsState {
  const [state, setState] = useState<{ pending: boolean; visits: SiteVisits | null }>(() => {
    if (visitResult) return { pending: false, visits: visitResult };
    const cached = readVisitsCache();
    // 已经判定拿不到（visitResult === null）时只剩缓存可用
    return { pending: visitResult !== null && syncEnabled, visits: cached };
  });

  useEffect(() => {
    if (!syncEnabled) return;
    let alive = true;
    void recordSiteVisit().then((value) => {
      // 已有结果时不再改写，避免一次无谓的重渲染；失败则保留缓存兜底
      if (alive) setState((prev) => (prev.pending ? { pending: false, visits: value ?? prev.visits } : prev));
    });
    return () => {
      alive = false;
    };
  }, []);

  return { enabled: syncEnabled, ...state };
}

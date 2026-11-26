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
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { total?: unknown; today?: unknown };
    const total = Number(data?.total);
    const today = Number(data?.today);
    if (!Number.isFinite(total) || !Number.isFinite(today)) return null;
    return { total, today };
  } catch {
    return null;
  }
}

let visitRequest: Promise<SiteVisits | null> | null = null;
/** 请求结果缓存：首页晚于上报挂载时直接取用，不必先闪一帧骨架 */
let visitResult: SiteVisits | null | undefined;

/**
 * 每次打开站点只上报一次：SPA 内部跳转、React StrictMode 的重复执行
 * 都复用同一个请求；服务端再按「访客 + 会话 + 日期」去重。
 */
export function recordSiteVisit(): Promise<SiteVisits | null> {
  if (!syncEnabled) return Promise.resolve(null);
  visitRequest ??= requestSiteVisit(SUPABASE_URL, SUPABASE_ANON_KEY).then((value) => {
    visitResult = value;
    return value;
  });
  return visitRequest;
}

export interface SiteVisitsState {
  /** 是否接入访问统计：未配置数据库时首页不渲染这两项，也不显示占位 */
  enabled: boolean;
  /** 请求仍在路上：首页用骨架占位，数字到位后交叉淡入 */
  pending: boolean;
  /** 计数；上报失败时为 null（此时两项会收起） */
  visits: SiteVisits | null;
}

/** 首页数字行：区分「还没到」与「拿不到」，前者占位、后者不渲染。 */
export function useSiteVisits(): SiteVisitsState {
  const [state, setState] = useState<{ pending: boolean; visits: SiteVisits | null }>(() =>
    visitResult !== undefined
      ? { pending: false, visits: visitResult }
      : { pending: syncEnabled, visits: null },
  );

  useEffect(() => {
    if (!syncEnabled) return;
    let alive = true;
    void recordSiteVisit().then((value) => {
      // 已有结果时不再改写，避免一次无谓的重渲染
      if (alive) setState((prev) => (prev.pending ? { pending: false, visits: value } : prev));
    });
    return () => {
      alive = false;
    };
  }, []);

  return { enabled: syncEnabled, ...state };
}

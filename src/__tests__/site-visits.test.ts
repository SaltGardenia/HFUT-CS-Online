import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readVisitsCache, requestSiteVisit, visitSessionId, visitorId } from '../lib/visits';

const BASE = 'https://demo.supabase.co';
const KEY = 'sb_publishable_test';

function okJson(body: unknown) {
  return { ok: true, json: async () => body } as Response;
}

describe('站点访问量上报', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('调用 record_site_visit 并解析累计/今日计数', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ total: 1234, today: 56 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await requestSiteVisit(BASE, KEY, 'visitor-abc123', 'session-abc123');

    expect(result).toEqual({ total: 1234, today: 56 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/rest/v1/rpc/record_site_visit`);
    expect(init.method).toBe('POST');
    expect(init.keepalive).toBe(true);
    expect(init.headers).toMatchObject({
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(String(init.body))).toEqual({
      p_visitor: 'visitor-abc123',
      p_session: 'session-abc123',
    });
  });

  it('HTTP 失败、非法返回和断网都静默返回 null', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) } as Response));
    expect(await requestSiteVisit(BASE, KEY, 'visitor-abc123', 'session-abc123')).toBeNull();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson({ total: 'x', today: 1 })));
    expect(await requestSiteVisit(BASE, KEY, 'visitor-abc123', 'session-abc123')).toBeNull();

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await requestSiteVisit(BASE, KEY, 'visitor-abc123', 'session-abc123')).toBeNull();
  });

  it('访客标识与标签页会话标识稳定且符合服务端校验格式', () => {
    const visitor = visitorId();
    const session = visitSessionId();
    expect(visitor).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect(session).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect(visitorId()).toBe(visitor);
    expect(visitSessionId()).toBe(session);
    expect(localStorage.getItem('hb-visitor-id')).toBe(visitor);
    expect(sessionStorage.getItem('hb-visit-session')).toBe(session);
  });
});

describe('访问量缓存兜底', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  function day(offset = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  it('当天的缓存直接可用', () => {
    localStorage.setItem('hb-site-visits', JSON.stringify({ total: 190, today: 31, day: day() }));
    expect(readVisitsCache()).toEqual({ total: 190, today: 31 });
  });

  it('跨天或损坏的缓存作废（「今日访问量」不能沿用昨天）', () => {
    localStorage.setItem('hb-site-visits', JSON.stringify({ total: 190, today: 31, day: day(-1) }));
    expect(readVisitsCache()).toBeNull();

    localStorage.setItem('hb-site-visits', JSON.stringify({ total: 'x', today: 1, day: day() }));
    expect(readVisitsCache()).toBeNull();

    localStorage.setItem('hb-site-visits', 'not json');
    expect(readVisitsCache()).toBeNull();
  });
});

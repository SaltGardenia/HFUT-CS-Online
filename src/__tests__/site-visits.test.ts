import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { requestSiteVisit, visitSessionId, visitorId } from '../lib/visits';

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

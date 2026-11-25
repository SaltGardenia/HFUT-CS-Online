import { beforeEach, describe, expect, it, vi } from 'vitest';

/** 用内存后端替换 Supabase，验证 SyncManager 的登录 → 合并 → 上传编排 */
const mocks = vi.hoisted(() => ({
  user: { id: 'user-1', email: 'student@example.com' },
  pushCalls: [] as { progress: any[]; favorites: any[]; recent: any[]; reading: any[] }[],
  remote: {
    progress: [] as any[],
    favorites: [] as any[],
    recent: [] as any[],
    reading: [] as any[],
  },
}));

vi.mock('../lib/sync/config', () => ({
  syncEnabled: true,
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'test',
}));

vi.mock('../lib/sync/backend', () => ({
  createSupabaseBackend: () => ({
    getSession: async () => mocks.user,
    onAuthChange: () => () => {},
    signIn: async () => {},
    signUp: async () => ({ needsConfirm: false }),
    signOut: async () => {},
    pull: async () => mocks.remote,
    push: async (payload: { progress: any[]; favorites: any[]; recent: any[]; reading: any[] }) => {
      mocks.pushCalls.push(payload);
    },
  }),
}));

const { syncManager } = await import('../lib/sync/manager');
const { readProgress, readProgressMeta, readReading, writeProgress } = await import('../lib/sync/local');

describe('SyncManager：登录合并与增量上传', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.pushCalls.length = 0;
    mocks.remote = { progress: [], favorites: [], recent: [], reading: [] };
  });

  it('首次登录：本机历史进度上传，云端较新记录回填本机', async () => {
    // 本机游客进度（没有时间戳，模拟升级前的数据）
    localStorage.setItem('practice-progress-v1', JSON.stringify({ q1: 'right' }));
    mocks.remote = {
      progress: [
        // q1 云端是 2000 年，本机补戳为现在 → 本机胜出并上传
        { course: 'algo', question_id: 'q1', result: 'wrong', updated_at: new Date(2000).toISOString() },
        // q2 只在云端 → 回填本机
        { course: 'algo', question_id: 'q2', result: 'revealed', updated_at: new Date(3000).toISOString() },
      ],
      favorites: [],
      recent: [],
      reading: [],
    };

    await syncManager.init();
    await syncManager.syncNow();

    expect(syncManager.getState().status).toBe('synced');
    expect(syncManager.getState().user?.id).toBe('user-1');
    expect(readProgress('practice-progress-v1')).toEqual({ q1: 'right', q2: 'revealed' });
    expect(readProgressMeta('practice-progress-v1').q2.r).toBe('revealed');

    const sent = mocks.pushCalls.flatMap((p) => p.progress);
    expect(sent.find((r) => r.question_id === 'q1')).toMatchObject({
      course: 'algo',
      result: 'right',
    });
    // q2 是云端更新，不回传
    expect(sent.some((r) => r.question_id === 'q2')).toBe(false);
  });

  it('阅读进度按页合并：云端较新回填，本机独有 / 较新的上传', async () => {
    localStorage.setItem(
      'hb-reading-v1',
      JSON.stringify({
        '/algo/deck/deck3': { c: 'algo', y: 1200, p: 0.12, s: '分治法', t: 5000 },
        '/algo/deck/deck5': { c: 'algo', y: 3000, p: 0.3, t: 3000 },
      }),
    );
    mocks.remote = {
      progress: [],
      favorites: [],
      recent: [],
      reading: [
        {
          course: 'algo',
          page: '/algo/deck/deck4',
          scroll_y: 2500,
          percent: 0.5,
          section: '动态规划',
          updated_at: new Date(9000).toISOString(),
        },
        {
          course: 'algo',
          page: '/algo/deck/deck3',
          scroll_y: 40,
          percent: 0.01,
          section: null,
          updated_at: new Date(2000).toISOString(),
        },
      ],
    };

    await syncManager.syncNow();

    const reading = readReading();
    // 云端较新：回填本机
    expect(reading['/algo/deck/deck4']).toMatchObject({ c: 'algo', y: 2500, p: 0.5, t: 9000 });
    // 本机较新：保留并上传
    expect(reading['/algo/deck/deck3']).toMatchObject({ y: 1200, t: 5000 });
    // 本机独有：保留并上传
    expect(reading['/algo/deck/deck5']).toMatchObject({ y: 3000, t: 3000 });

    const sent = mocks.pushCalls.flatMap((p) => p.reading);
    expect(sent.find((r) => r.page === '/algo/deck/deck3')).toMatchObject({
      course: 'algo',
      scroll_y: 1200,
      percent: 0.12,
      section: '分治法',
    });
    expect(sent.some((r) => r.page === '/algo/deck/deck5')).toBe(true);
    // 云端较新的页不回传
    expect(sent.some((r) => r.page === '/algo/deck/deck4')).toBe(false);
  });

  it('登录后继续答题：只上传变化的题目，并写入时间戳', async () => {
    await syncManager.init();
    mocks.pushCalls.length = 0;

    writeProgress('practice-progress-v1', { q9: 'wrong' });
    await syncManager.syncNow();

    const sent = mocks.pushCalls.flatMap((p) => p.progress);
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ course: 'algo', question_id: 'q9', result: 'wrong' });
    expect(Number.isFinite(Date.parse(sent[0].updated_at))).toBe(true);
    expect(syncManager.getState().status).toBe('synced');

    // 清掉防抖定时器，避免测试结束后再触发一次上传
    await syncManager.signOut();
  });
});

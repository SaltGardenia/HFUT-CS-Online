/**
 * 错题本/收藏本数据层：
 * 1) 本地账本（setQMark / readQMarks / applyQMarks / 账本发现）；
 * 2) 合并规则（新者胜、墓碑防复活）；
 * 3) SyncManager：登记账目上传、云端合并、脏数据走同一推送通道。
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

/** 用内存后端替换 Supabase，验证 SyncManager 的编排（与 sync-manager.test.ts 同一套夹具） */
const mocks = vi.hoisted(() => ({
  user: { id: 'user-1', email: 'student@example.com' },
  pushCalls: [] as { qmarks: { course: string; question_id: string; kind: string; marked: boolean }[] }[],
  remote: { progress: [], favorites: [], recent: [], reading: [], qmarks: [] as any[] },
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
    push: async (payload: { qmarks: { course: string; question_id: string; kind: string; marked: boolean }[] }) => {
      mocks.pushCalls.push(payload);
    },
  }),
}));

const { syncManager } = await import('../lib/sync/manager');
const local = await import('../lib/sync/local');
const { mergeQMarks } = await import('../lib/sync/merge');

beforeEach(() => {
  localStorage.clear();
  mocks.pushCalls.length = 0;
  mocks.remote = { progress: [], favorites: [], recent: [], reading: [], qmarks: [] };
});

describe('本地账本：一门课一份，键里带课程 slug', () => {
  it('记账 / 摘除都带时间戳，同态重写不落盘', () => {
    local.setQMark('os', 'wrong', 'p1-f1', true);
    const t1 = local.readQMarks('os').wrong['p1-f1'].t;
    expect(local.hasAnyQMark('os')).toBe(true);

    // 同态重写：时间戳不变（不产生新账目）
    local.setQMark('os', 'wrong', 'p1-f1', true);
    expect(local.readQMarks('os').wrong['p1-f1'].t).toBe(t1);

    // 移出：留墓碑
    local.setQMark('os', 'wrong', 'p1-f1', false);
    expect(local.readQMarks('os').wrong['p1-f1']).toMatchObject({ on: false });
  });

  it('收藏与错题互不干扰，课程之间互不干扰', () => {
    local.setQMark('os', 'fav', 'p1-f1', true);
    local.setQMark('net', 'wrong', 'p1:s1', true);
    expect(local.readQMarks('os').wrong).toEqual({});
    expect(local.readQMarks('os').fav).toHaveProperty('p1-f1');
    expect(local.readQMarks('net').wrong).toHaveProperty('p1:s1');
    expect(local.qmarkCourses().sort()).toEqual(['net', 'os']);
  });

  it('手改/损坏的账目形状直接丢弃', () => {
    localStorage.setItem('hb-qmarks:os', JSON.stringify({ fav: { a: { t: 'x', on: true }, b: { t: 5, on: 'yes' }, c: { t: 6, on: true } }, wrong: [1, 2] }));
    const marks = local.readQMarks('os');
    expect(marks.fav).toEqual({ c: { t: 6, on: true } });
    expect(marks.wrong).toEqual({});
  });

  it('云端合并落盘不产生脏数据（无回声）', () => {
    const events: unknown[] = [];
    local.setDirtyListener((e) => events.push(e));
    local.applyQMarks('os', { fav: { p1: { t: 9, on: true } }, wrong: {} });
    expect(events).toEqual([]);
    expect(local.readQMarks('os').fav.p1).toEqual({ t: 9, on: true });
    local.setDirtyListener(null);
  });

  it('clearUserData 连题目标记一起清（换账号不串数据）', () => {
    local.setQMark('os', 'wrong', 'p1-f1', true);
    local.clearUserData();
    expect(local.hasAnyQMark('os')).toBe(false);
    expect(local.qmarkCourses()).toEqual([]);
  });
});

describe('mergeQMarks：逐条取新者，墓碑参与比较', () => {
  it('云端较新：回填本机；本机较新：保留并回传', () => {
    const localMarks = {
      fav: { a: { t: 1000, on: true } },
      wrong: { b: { t: 2000, on: false } },
    };
    const remote = [
      { course: 'os', question_id: 'a', kind: 'fav', marked: false, updated_at: new Date(3000).toISOString() },
      { course: 'os', question_id: 'b', kind: 'wrong', marked: true, updated_at: new Date(1000).toISOString() },
      { course: 'os', question_id: 'c', kind: 'wrong', marked: true, updated_at: new Date(4000).toISOString() },
    ];
    const merged = mergeQMarks('os', localMarks, remote);
    // a：云端 3000 > 本机 1000，且云端标记 false → 本机摘除
    expect(merged.marks.fav.a).toEqual({ t: 3000, on: false });
    // b：本机 2000 > 云端 1000，本机墓碑胜出 → 回传防止复活
    expect(merged.marks.wrong.b).toEqual({ t: 2000, on: false });
    // c：只在云端 → 回填
    expect(merged.marks.wrong.c).toEqual({ t: 4000, on: true });

    const pushed = merged.push.map((p) => `${p.kind}:${p.question_id}:${p.marked}`);
    expect(pushed).toContain('wrong:b:false');
    expect(pushed).not.toContain('fav:a:false');
    expect(pushed).not.toContain('wrong:c:true');
  });

  it('本机从未记账且云端没有的条目不回传空墓碑', () => {
    const merged = mergeQMarks('os', { fav: {}, wrong: {} }, []);
    expect(merged.push).toEqual([]);
    expect(merged.marks).toEqual({ fav: {}, wrong: {} });
  });
});

describe('SyncManager：账目随账号同步', () => {
  it('登录后本机账目全部上传；之后的新写入走防抖推送', async () => {
    // 登录前的游客账目（自带时间戳）
    local.setQMark('os', 'wrong', 'p1-f1', true);
    local.setQMark('os', 'fav', 'p1-f2', true);
    mocks.pushCalls.length = 0;

    await syncManager.init();
    await syncManager.syncNow();

    expect(syncManager.getState().status).toBe('synced');
    const sent = mocks.pushCalls.flatMap((p) => p.qmarks);
    expect(sent.find((r) => r.question_id === 'p1-f1')).toMatchObject({ course: 'os', kind: 'wrong', marked: true });
    expect(sent.find((r) => r.question_id === 'p1-f2')).toMatchObject({ course: 'os', kind: 'fav', marked: true });

    // 登录后答题答错 → 错题本入账 → 下一轮推送带上
    mocks.pushCalls.length = 0;
    local.setQMark('os', 'wrong', 'p2-s1', true);
    await syncManager.syncNow();
    const sent2 = mocks.pushCalls.flatMap((p) => p.qmarks);
    expect(sent2.find((r) => r.question_id === 'p2-s1')).toMatchObject({ course: 'os', kind: 'wrong', marked: true });
  });

  it('云端较新的合并结果覆盖本机且不再回传', async () => {
    local.setQMark('os', 'wrong', 'p1-f1', true);
    await syncManager.init();
    await syncManager.syncNow();

    // 另一台设备摘掉了这道错题（时间更新）
    mocks.remote.qmarks = [
      { course: 'os', question_id: 'p1-f1', kind: 'wrong', marked: false, updated_at: new Date(Date.now() + 60000).toISOString() },
    ];
    mocks.pushCalls.length = 0;
    await syncManager.syncNow();

    expect(local.readQMarks('os').wrong['p1-f1']).toMatchObject({ on: false });
    const sent = mocks.pushCalls.flatMap((p) => p.qmarks);
    expect(sent.find((r) => r.question_id === 'p1-f1' && r.marked === false)).toBeUndefined();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRESS_STORES, READING_KEY } from '../lib/sync/keys';
import {
  applyProgress,
  applyReading,
  ensureProgressStamps,
  readProgress,
  readProgressMeta,
  readReading,
  setDirtyListener,
  subscribeStore,
  writeProgress,
  writeReading,
} from '../lib/sync/local';
import { mergeFavorites, mergeProgress, mergeReading, mergeRecent } from '../lib/sync/merge';
import type { RemoteProgressRow, RemoteReadingRow } from '../lib/sync/types';

const iso = (ms: number) => new Date(ms).toISOString();

function progressRow(qid: string, result: string | null, at: number): RemoteProgressRow {
  return { course: 'algo', question_id: qid, result, updated_at: iso(at) };
}

function readingRow(page: string, at: number, over: Partial<RemoteReadingRow> = {}): RemoteReadingRow {
  return {
    course: 'algo',
    page,
    scroll_y: 100,
    percent: 0.1,
    section: null,
    updated_at: iso(at),
    ...over,
  };
}

describe('mergeProgress：逐题独立合并', () => {
  it('云端较新时覆盖本机，云端没有的题目保留并上传', () => {
    const merged = mergeProgress(
      { q1: 'wrong', q2: 'right' },
      { q1: { t: 1000, r: 'wrong' }, q2: { t: 1000, r: 'right' } },
      [progressRow('q1', 'right', 2000), progressRow('q3', 'revealed', 2000)],
    );
    expect(merged.map).toEqual({ q1: 'right', q2: 'right', q3: 'revealed' });
    expect(merged.meta.q1).toEqual({ t: 2000, r: 'right' });
    // q2 只在本地，需上传；q3 云端更新，无需回传
    expect(merged.push).toEqual([{ question_id: 'q2', result: 'right', t: 1000 }]);
  });

  it('本机较新时保留本机并回传', () => {
    const merged = mergeProgress(
      { q1: 'wrong' },
      { q1: { t: 5000, r: 'wrong' } },
      [progressRow('q1', 'right', 2000)],
    );
    expect(merged.map.q1).toBe('wrong');
    expect(merged.push).toEqual([{ question_id: 'q1', result: 'wrong', t: 5000 }]);
  });

  it('清空墓碑不会被云端旧数据复活', () => {
    const merged = mergeProgress({}, { q1: { t: 5000, r: null } }, [progressRow('q1', 'right', 2000)]);
    expect(merged.map).toEqual({});
    expect(merged.meta.q1).toEqual({ t: 5000, r: null });
    expect(merged.push).toEqual([{ question_id: 'q1', result: null, t: 5000 }]);
  });

  it('墓碑较旧时让位给云端作答', () => {
    const merged = mergeProgress({}, { q1: { t: 1000, r: null } }, [progressRow('q1', 'right', 3000)]);
    expect(merged.map.q1).toBe('right');
    expect(merged.push).toEqual([]);
  });

  it('没有时间戳的本地值不会被当作最新（兜底最旧）', () => {
    const merged = mergeProgress({ q1: 'wrong' }, {}, [progressRow('q1', 'right', 100)]);
    expect(merged.map.q1).toBe('right');
  });
});

describe('mergeFavorites / mergeRecent：集合合并', () => {
  it('收藏按课程逐条取新，顺序按收藏时间倒序', () => {
    const merged = mergeFavorites(
      new Set(['A']),
      { A: { t: 1000, on: true } },
      [
        { course: 'A', favorited: true, updated_at: iso(2000) },
        { course: 'B', favorited: true, updated_at: iso(3000) },
      ],
      5000,
    );
    expect(merged.on).toEqual(['B', 'A']);
    expect(merged.push).toEqual([]);
  });

  it('取消收藏的墓碑能覆盖云端旧收藏', () => {
    const merged = mergeFavorites(new Set(), { A: { t: 5000, on: false } }, [
      { course: 'A', favorited: true, updated_at: iso(4000) },
    ], 5000);
    expect(merged.on).toEqual([]);
    expect(merged.push).toEqual([{ course: 'A', favorited: false, t: 5000 }]);
  });

  it('最近查看取最大时间并截断', () => {
    const merged = mergeRecent(
      ['A', 'B'],
      { A: 1000, B: 900 },
      [
        { course: 'B', viewed_at: iso(2000) },
        { course: 'C', viewed_at: iso(3000) },
      ],
      5000,
      2,
    );
    expect(merged.list).toEqual(['C', 'B']);
    // A 只在本地出现过，仍会回传云端；本地列表只保留前 2 条
    expect(merged.push).toEqual([{ course: 'A', t: 1000 }]);
  });

  it('本机新于云端的最近查看会回传', () => {
    const merged = mergeRecent(['A'], { A: 5000 }, [{ course: 'A', viewed_at: iso(1000) }], 5000, 8);
    expect(merged.push).toEqual([{ course: 'A', t: 5000 }]);
  });
});

describe('mergeReading：按页取新', () => {
  it('逐页独立合并：云端较新覆盖，本机较新 / 独有回传', () => {
    const merged = mergeReading(
      {
        '/algo/deck/deck3': { c: 'algo', y: 1200, p: 0.12, s: '分治法', t: 5000 },
        '/algo/deck/deck5': { c: 'algo', y: 300, p: 0.03, t: 1000 },
      },
      [
        readingRow('/algo/deck/deck3', 2000, { scroll_y: 40, percent: 0.01 }),
        readingRow('/algo/deck/deck4', 9000, { scroll_y: 2500, percent: 0.5, section: '动态规划' }),
      ],
    );

    expect(merged.map['/algo/deck/deck3']).toMatchObject({ y: 1200, p: 0.12, s: '分治法', t: 5000 });
    expect(merged.map['/algo/deck/deck4']).toMatchObject({
      c: 'algo',
      y: 2500,
      p: 0.5,
      s: '动态规划',
      t: 9000,
    });
    expect(merged.map['/algo/deck/deck5']).toMatchObject({ y: 300, t: 1000 });
    expect(merged.push.map((p) => p.page).sort()).toEqual(['/algo/deck/deck3', '/algo/deck/deck5']);
  });

  it('新设备只有云端进度：直接回填，无需上传', () => {
    const merged = mergeReading({}, [readingRow('/comp/deck/deck2', 7000, { course: 'comp' })]);
    expect(merged.map['/comp/deck/deck2']).toMatchObject({ c: 'comp', y: 100, p: 0.1, t: 7000 });
    expect(merged.push).toEqual([]);
  });

  it('云端位置越界时收敛到合法范围', () => {
    const merged = mergeReading(
      {},
      [
        readingRow('/x/deck/a', 1000, { scroll_y: -20, percent: 1.7 }),
        readingRow('/x/deck/b', 1000, { scroll_y: 50, percent: -0.3 }),
      ],
    );
    expect(merged.map['/x/deck/a']).toMatchObject({ y: 0, p: 1 });
    expect(merged.map['/x/deck/b']).toMatchObject({ y: 50, p: 0 });
  });
});

describe('本地存储层：时间戳、墓碑、订阅', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('写入变化题目时打时间戳并广播；重复写入不产生脏数据', () => {
    const listener = vi.fn();
    const unsub = subscribeStore('practice-progress-v1', listener);
    const changed = writeProgress('practice-progress-v1', { q1: 'right', q2: 'wrong' });
    expect(changed.sort()).toEqual(['q1', 'q2']);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(readProgress('practice-progress-v1')).toEqual({ q1: 'right', q2: 'wrong' });
    expect(Object.keys(readProgressMeta('practice-progress-v1'))).toEqual(['q1', 'q2']);

    expect(writeProgress('practice-progress-v1', { q1: 'right', q2: 'wrong' })).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
  });

  it('清空进度生成 null 墓碑', () => {
    writeProgress('practice-progress-v1', { q1: 'right' });
    const changed = writeProgress('practice-progress-v1', {});
    expect(changed).toEqual(['q1']);
    expect(readProgress('practice-progress-v1')).toEqual({});
    expect(readProgressMeta('practice-progress-v1').q1.r).toBeNull();
  });

  it('首次登录补时间戳：历史本地数据参与上传', () => {
    localStorage.setItem('practice-progress-v1', JSON.stringify({ q1: 'right' }));
    const stamped = ensureProgressStamps('practice-progress-v1');
    expect(stamped).toEqual(['q1']);
    expect(readProgressMeta('practice-progress-v1').q1).toMatchObject({ r: 'right' });
    expect(ensureProgressStamps('practice-progress-v1')).toEqual([]);
  });

  it('applyProgress 落盘云端合并结果并通知订阅者', () => {
    const listener = vi.fn();
    const unsub = subscribeStore('practice-progress-v1', listener);
    applyProgress('practice-progress-v1', { q9: 'revealed' }, { q9: { t: 9000, r: 'revealed' } });
    expect(readProgress('practice-progress-v1')).toEqual({ q9: 'revealed' });
    expect(listener).toHaveBeenCalled();
    unsub();
  });

  it('阅读进度：位置变化才落盘并广播，重复位置不产生脏数据', () => {
    const listener = vi.fn();
    const unsub = subscribeStore(READING_KEY, listener);
    expect(writeReading('/algo/deck/deck3', { c: 'algo', y: 1000, p: 0.2, t: 1 })).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    // 10px / 0.2% 内的抖动视为没动
    expect(writeReading('/algo/deck/deck3', { c: 'algo', y: 1006, p: 0.2005, t: 2 })).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(readReading()['/algo/deck/deck3'].y).toBe(1000);

    expect(writeReading('/algo/deck/deck3', { c: 'algo', y: 1600, p: 0.32, t: 3 })).toBe(true);
    expect(readReading()['/algo/deck/deck3'].y).toBe(1600);
    unsub();
  });

  it('applyReading 落盘云端结果但不产生脏事件（避免回声上传）', () => {
    const dirty = vi.fn();
    setDirtyListener(dirty);
    applyReading({ '/os/chapter/ch2': { c: 'os', y: 800, p: 0.4, s: '进程调度', t: 5000 } });
    expect(readReading()['/os/chapter/ch2']).toMatchObject({ c: 'os', y: 800, p: 0.4 });
    expect(dirty).not.toHaveBeenCalled();
    setDirtyListener(null);
  });
});

describe('进度键登记完整', () => {
  it('源码里出现的所有 *-practice-progress-v1 都已登记到 PROGRESS_STORES', () => {
    const files = import.meta.glob('../**/*.{ts,tsx}', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>;
    const found = new Set<string>();
    for (const text of Object.values(files)) {
      for (const m of text.matchAll(/'([a-z0-9-]*-?practice-progress-v1)'/g)) found.add(m[1]);
    }

    const registered = new Set(PROGRESS_STORES.map((s) => s.key));
    expect(found.size).toBeGreaterThan(0);
    for (const key of found) expect(registered.has(key), `${key} 未登记`).toBe(true);
  });
});

/**
 * 「清空进度」统一设计的行为测试：
 * 1) 存储层只清给定 id，其余试卷的作答原样保留，并给清掉的题留同步墓碑；
 * 2) 共用按钮/确认层：无进度时禁用，取消不清，确认才调用清空回调；
 * 3) 答题页只清本卷——同一门课其它试卷的进度不受影响。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClearProgress from '../components/practice/ClearProgress';
import OsPaperPage from '../pages/OsPaperPage';
import { clearProgress, clearProgressStore, readProgress, readProgressMeta } from '../lib/sync/local';

const SCRATCH_KEY = 'test-clear-progress-v1';

beforeEach(() => {
  localStorage.removeItem(SCRATCH_KEY);
  localStorage.removeItem('hb-progress-meta:' + SCRATCH_KEY);
  localStorage.removeItem('os-practice-progress-v1');
  localStorage.removeItem('hb-progress-meta:os-practice-progress-v1');
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('clearProgress：按 id 精确清空', () => {
  it('只删给定 id，其它题目保留，并在时间戳里留下墓碑', () => {
    localStorage.setItem(SCRATCH_KEY, JSON.stringify({ a: 'right', b: 'wrong', c: 'revealed' }));
    localStorage.setItem(
      'hb-progress-meta:' + SCRATCH_KEY,
      JSON.stringify({ a: { t: 1, r: 'right' }, b: { t: 2, r: 'wrong' }, c: { t: 3, r: 'revealed' } }),
    );

    const changed = clearProgress(SCRATCH_KEY, ['a', 'c']);

    expect(changed.sort()).toEqual(['a', 'c']);
    expect(readProgress(SCRATCH_KEY)).toEqual({ b: 'wrong' });
    // 云端同步靠 r:null 的墓碑删记录，否则下次合并会把旧作答拉回来
    expect(readProgressMeta(SCRATCH_KEY).a).toMatchObject({ r: null });
    expect(readProgressMeta(SCRATCH_KEY).c).toMatchObject({ r: null });
    // 没被清到的题时间戳原样保留
    expect(readProgressMeta(SCRATCH_KEY).b).toEqual({ t: 2, r: 'wrong' });
  });

  it('没有命中任何 id 时不写存储、不上报脏数据', () => {
    localStorage.setItem(SCRATCH_KEY, JSON.stringify({ a: 'right' }));
    expect(clearProgress(SCRATCH_KEY, ['zzz'])).toEqual([]);
    expect(readProgress(SCRATCH_KEY)).toEqual({ a: 'right' });
  });

  it('清空整表时连旧版本残留的 id 一起清掉', () => {
    localStorage.setItem(SCRATCH_KEY, JSON.stringify({ a: 'right', 'legacy-q9': 'wrong' }));
    expect(clearProgressStore(SCRATCH_KEY).sort()).toEqual(['a', 'legacy-q9']);
    expect(readProgress(SCRATCH_KEY)).toEqual({});
    expect(readProgressMeta(SCRATCH_KEY)['legacy-q9']).toMatchObject({ r: null });
  });
});

describe('ClearProgress：统一按钮与确认层', () => {
  it('没有作答时按钮禁用', () => {
    render(<ClearProgress done={0} onClear={() => {}} tip="清空测试进度？" />);
    expect(screen.getByRole('button', { name: '清空进度' })).toHaveProperty('disabled', true);
  });

  it('取消不清空，确认才回调并关闭确认层', async () => {
    const onClear = vi.fn();
    render(<ClearProgress done={3} onClear={onClear} tip="清空测试进度？" />);

    fireEvent.click(screen.getByRole('button', { name: '清空进度' }));
    expect(screen.getByRole('dialog').textContent).toContain('清空测试进度？');

    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onClear).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '清空进度' }));
    fireEvent.click(screen.getByRole('button', { name: '清空' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('答题页清空：只影响本卷', () => {
  it('OS 试卷 A 清空后，试卷 B（p2-*）的进度仍在', async () => {
    localStorage.setItem(
      'os-practice-progress-v1',
      JSON.stringify({ 'p1-f1': 'right', 'p1-f2': 'wrong', 'p2-s1': 'right' }),
    );
    localStorage.setItem(
      'hb-progress-meta:os-practice-progress-v1',
      JSON.stringify({
        'p1-f1': { t: 1, r: 'right' },
        'p1-f2': { t: 2, r: 'wrong' },
        'p2-s1': { t: 3, r: 'right' },
      }),
    );

    render(
      <MemoryRouter initialEntries={['/os/practice/ac-2022a']}>
        <Routes>
          <Route path="/os/practice/:paperId" element={<OsPaperPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: '清空进度' }));
    fireEvent.click(screen.getByRole('button', { name: '清空' }));

    await waitFor(() => {
      expect(readProgress('os-practice-progress-v1')).toEqual({ 'p2-s1': 'right' });
    });
    // 卷 B 的时间戳不被本卷清空改写
    expect(readProgressMeta('os-practice-progress-v1')['p2-s1']?.r).toBe('right');
  });
});

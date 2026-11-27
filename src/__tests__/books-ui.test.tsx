/**
 * 错题本/收藏本页面与题卡收藏按钮：
 * 1) 题卡右上角的收藏按钮可切换，qid 用调用方给的账内 id；
 * 2) 错题本页按试卷分组列出在册题目，「移出」只摘本课账目，答对自动出本；
 * 3) 收藏本页取消收藏即出本；空态诚实呈现；
 * 4) 首页入口卡显示两本账的题数。
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PracticeCard from '../components/practice/PracticeCard';
import QuestionBookPage, { BookCards, buildBookEntries, type BookEntry } from '../components/practice/books';
import { readQMarks, setQMark } from '../lib/sync/local';

const COURSE = 'testcourse';

const Q1 = {
  id: 'p1-s1',
  kind: 'single' as const,
  question: '<p>1 + 1 = ?</p>',
  options: ['<p>2</p>', '<p>3</p>'],
  answer: 'A',
  explanation: '<p>显然</p>',
  tags: [{ deck: 1, sec: 'sec-1', text: '算术' }],
};
const Q2 = {
  id: 'p2-s1',
  kind: 'judge' as const,
  question: '<p>2 &gt; 1？</p>',
  options: ['<p>对</p>', '<p>错</p>'],
  answer: '对',
  explanation: '<p>显然</p>',
  tags: [{ deck: 2, sec: 'sec-2', text: '比较' }],
};

const ENTRIES: BookEntry[] = buildBookEntries(
  [
    { id: 'p1', title: '试卷一', questions: [Q1] },
    { id: 'p2', title: '试卷二', questions: [Q2] },
  ],
  { single: '单选', judge: '判断' },
);

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('题卡收藏按钮', () => {
  it('传入 favorite 才渲染，可切换并在 aria 状态里反映', () => {
    let on = false;
    const { rerender, unmount } = render(
      <MemoryRouter>
        <PracticeCard quiz={Q1} label="单选 1" onResult={() => {}} favorite={{ on, onToggle: () => (on = !on) }} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: '收藏本题' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: '收藏本题' }));
    expect(on).toBe(true);

    rerender(
      <MemoryRouter>
        <PracticeCard quiz={Q1} label="单选 1" onResult={() => {}} favorite={{ on: true, onToggle: () => {} }} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: '取消收藏' }).getAttribute('aria-pressed')).toBe('true');
    unmount();
  });

  it('不传 favorite 的题卡（如课后作业）不出现收藏按钮', () => {
    render(
      <MemoryRouter>
        <PracticeCard quiz={Q1} label="单选 1" onResult={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /收藏/ })).toBeNull();
  });
});

describe('错题本页', () => {
  it('按试卷分组列出在册错题，「移出」只摘本课账目', () => {
    setQMark(COURSE, 'wrong', 'p1-s1', true);
    setQMark(COURSE, 'wrong', 'p2-s1', true);
    render(
      <MemoryRouter initialEntries={['/t/practice/wrongbook']}>
        <QuestionBookPage kind="wrong" course={COURSE} storeKey="test-progress-store" entries={ENTRIES} />
      </MemoryRouter>,
    );
    expect(screen.getByText('试卷一 · 1 题')).toBeTruthy();
    expect(screen.getByText('试卷二 · 1 题')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: '移出' }).length).toBe(2);

    fireEvent.click(screen.getAllByRole('button', { name: '移出' })[0]);
    const marks = readQMarks(COURSE);
    expect(marks.wrong['p1-s1']).toMatchObject({ on: false });
    expect(marks.wrong['p2-s1']).toMatchObject({ on: true });
  });

  it('在册题目可以就地重做；答对自动出本', () => {
    setQMark(COURSE, 'wrong', 'p1-s1', true);
    // 进度里这道题上次答错：卡片恢复为已答错（锁定）态，可直接重做
    localStorage.setItem('test-progress-store', JSON.stringify({ 'p1-s1': 'wrong' }));
    render(
      <MemoryRouter initialEntries={['/t/practice/wrongbook']}>
        <QuestionBookPage kind="wrong" course={COURSE} storeKey="test-progress-store" entries={ENTRIES} />
      </MemoryRouter>,
    );
    // 错题恢复成已答错状态，可重做
    fireEvent.click(screen.getByRole('button', { name: '重做' }));
    fireEvent.click(screen.getByRole('button', { name: /^A/ }));
    fireEvent.click(screen.getByRole('button', { name: '提交答案' }));
    // 答对：账目摘除，列表回到空态
    expect(readQMarks(COURSE).wrong['p1-s1']).toMatchObject({ on: false });
    expect(screen.getByText('暂无错题')).toBeTruthy();
  });

  it('空账诚实空态', () => {
    render(
      <MemoryRouter>
        <QuestionBookPage kind="wrong" course={COURSE} storeKey="test-progress-store" entries={ENTRIES} />
      </MemoryRouter>,
    );
    expect(screen.getByText('暂无错题')).toBeTruthy();
    expect(document.querySelector('.qbook-page .pq-progress')?.textContent).toContain('共 0 题');
  });
});

describe('收藏本页', () => {
  it('取消收藏即出本', () => {
    setQMark(COURSE, 'fav', 'p1-s1', true);
    setQMark(COURSE, 'fav', 'p2-s1', true);
    render(
      <MemoryRouter>
        <QuestionBookPage kind="fav" course={COURSE} storeKey="test-progress-store" entries={ENTRIES} />
      </MemoryRouter>,
    );
    expect(document.querySelector('.qbook-page .pq-progress')?.textContent).toContain('共 2 题');
    fireEvent.click(screen.getAllByRole('button', { name: '取消收藏' })[0]);
    expect(readQMarks(COURSE).fav['p1-s1']).toMatchObject({ on: false });
    expect(readQMarks(COURSE).fav['p2-s1']).toMatchObject({ on: true });
  });

  it('在错题本页点星也能进收藏本（两本账独立）', () => {
    setQMark(COURSE, 'wrong', 'p1-s1', true);
    render(
      <MemoryRouter>
        <QuestionBookPage kind="wrong" course={COURSE} storeKey="test-progress-store" entries={ENTRIES} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: '收藏本题' }));
    expect(readQMarks(COURSE).fav['p1-s1']).toMatchObject({ on: true });
    // 错题仍在册
    expect(readQMarks(COURSE).wrong['p1-s1']).toMatchObject({ on: true });
  });
});

describe('首页入口卡', () => {
  it('显示两本账的题数与去向', () => {
    setQMark(COURSE, 'wrong', 'p1-s1', true);
    setQMark(COURSE, 'fav', 'p2-s1', true);
    render(
      <MemoryRouter>
        <BookCards base="/t" course={COURSE} />
      </MemoryRouter>,
    );
    expect(screen.getByText('1 题待复习')).toBeTruthy();
    expect(screen.getByText('1 题')).toBeTruthy();
    expect(screen.getByRole('link', { name: /错题本/ }).getAttribute('href')).toBe('/t/practice/wrongbook');
    expect(screen.getByRole('link', { name: /收藏本/ }).getAttribute('href')).toBe('/t/practice/favorites');
  });

  it('空账显示「暂无」', () => {
    render(
      <MemoryRouter>
        <BookCards base="/t" course={COURSE} />
      </MemoryRouter>,
    );
    expect(screen.getByText('暂无错题')).toBeTruthy();
    expect(screen.getByText('暂无收藏')).toBeTruthy();
  });
});

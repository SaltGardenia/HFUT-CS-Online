/**
 * 考点分析（lib/exam-insights + components/practice/ExamInsights）：
 * 1) 聚合口径：章级按题去重（同题挂同章多个标签只计一次）、考点级按标签计；
 * 2) 排序契约：章按题数降序（同数按章号升），考点按覆盖卷数、题数降序；
 * 3) 卷×章矩阵与 maxCell；chapterNamesFrom 的章号解析；
 * 4) 个人易错考点：只含有错题的考点、keyOf 兼容 `${paperId}:${qid}`；
 * 5) 组件渲染：三个数据块 + 图例 + 易错块按进度出现，真实 OS 试卷数据可渲染。
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  buildExamInsights,
  buildWeakPoints,
  chapterNamesFrom,
  type InsightPaper,
} from '../lib/exam-insights';
import ExamInsights from '../components/practice/ExamInsights';
import OsPracticeIndex from '../pages/OsPracticeIndex';

afterEach(cleanup);

const tag = (deck: number, text: string, sec = `sec-ch${deck}`) => ({ deck, sec, text });

const paper = (id: string, title: string, questions: InsightPaper['questions']): InsightPaper => ({
  id,
  title,
  questions,
});

describe('buildExamInsights：聚合口径', () => {
  const papers: InsightPaper[] = [
    paper('a', '卷A', [
      { id: 'a1', kind: 'single', tags: [tag(2, '进程切换'), tag(3, '调度算法')] },
      { id: 'a2', kind: 'single', tags: [tag(2, '临界区'), tag(2, '进程切换')] }, // 同章两标签：章级只计一次
      { id: 'a3', kind: 'judge', tags: [tag(1, '中断')] },
    ]),
    paper('b', '卷B', [{ id: 'b1', kind: 'essay', tags: [tag(2, '进程切换')] }]),
  ];

  it('章级按题去重，跨章各计一次', () => {
    const d = buildExamInsights(papers);
    const ch2 = d.chapters.find((c) => c.deck === 2)!;
    expect(ch2.count).toBe(3); // a1 + a2（a2 两个第2章标签只算一题）+ b1
    expect(ch2.byKind).toEqual({ single: 2, essay: 1 });
    expect(ch2.papers).toBe(2);
    expect(ch2.byPaper).toEqual([
      { paperId: 'a', count: 2 },
      { paperId: 'b', count: 1 },
    ]);
  });

  it('考点级按标签计，跨卷同名合并并给出代表位置', () => {
    const d = buildExamInsights(papers);
    const t = d.tags.find((x) => x.text === '进程切换')!;
    expect(t.count).toBe(3);
    expect(t.papers).toBe(2);
    expect(t.deck).toBe(2);
    expect(t.sec).toBe('sec-ch2');
  });

  it('章按题数降序（同数按章号升），考点按覆盖卷数优先', () => {
    const d = buildExamInsights(papers);
    expect(d.chapters.map((c) => c.deck)).toEqual([2, 1, 3]);
    expect(d.tags[0].text).toBe('进程切换');
  });

  it('矩阵按章序对位，maxCell 取全表最大', () => {
    const d = buildExamInsights(papers);
    expect(d.decks).toEqual([1, 2, 3]);
    expect(d.matrix).toEqual([
      { paperId: 'a', title: '卷A', cells: [1, 2, 1], total: 3 },
      { paperId: 'b', title: '卷B', cells: [0, 1, 0], total: 1 },
    ]);
    expect(d.maxCell).toBe(2);
    expect(d.totalQuestions).toBe(4);
    expect(d.totalPapers).toBe(2);
  });
});

describe('chapterNamesFrom', () => {
  it('从「第N章/第N讲」解析章号 → 章名，无法解析的忽略', () => {
    expect(
      chapterNamesFrom([
        { no: '第2章', title: '进程同步' },
        { no: '第10讲', title: '动态规划' },
        { no: '大题精讲', title: '无章号' },
      ]),
    ).toEqual({ 2: '进程同步', 10: '动态规划' });
  });
});

describe('buildWeakPoints', () => {
  const papers: InsightPaper[] = [
    paper('a', '卷A', [
      { id: 'q1', kind: 'single', tags: [tag(2, '临界区')] },
      { id: 'q2', kind: 'single', tags: [tag(2, '临界区')] },
      { id: 'q3', kind: 'single', tags: [tag(3, '调度')] },
    ]),
  ];

  it('只返回有错题的考点，按错题数与错误率排序', () => {
    const weak = buildWeakPoints(papers, { q1: 'wrong', q2: 'right', q3: 'wrong' });
    expect(weak.map((w) => w.text)).toEqual(['调度', '临界区']); // 各 1 错，调度错误率 100% 更高
    expect(weak[1]).toMatchObject({ wrong: 1, answered: 2, deck: 2, sec: 'sec-ch2' });
  });

  it('keyOf 兼容 `${paperId}:${qid}` 键格式', () => {
    const weak = buildWeakPoints(papers, { 'a:q1': 'wrong' }, (pid, qid) => `${pid}:${qid}`);
    expect(weak.map((w) => w.text)).toEqual(['临界区']);
  });

  it('没有进度或全对时为空', () => {
    expect(buildWeakPoints(papers, {})).toEqual([]);
    expect(buildWeakPoints(papers, { q1: 'right', q2: 'right', q3: 'revealed' })).toEqual([]);
  });
});

describe('ExamInsights 组件渲染', () => {
  const papers: InsightPaper[] = [
    paper('a', '2022 期末卷', [
      { id: 'a1', kind: 'single', tags: [tag(2, '进程切换')] },
      { id: 'a2', kind: 'essay', tags: [tag(2, '银行家算法')] },
    ]),
    paper('b', '2021 期末卷', [{ id: 'b1', kind: 'fill', tags: [tag(1, '中断向量')] }]),
  ];
  const KIND_LABEL = { single: '单选', essay: '解答', fill: '填空' };

  it('三块图齐全：章级排行（含图例与题型堆叠）、高频考点、卷×章矩阵', () => {
    const { container } = render(
      createElement(ExamInsights, {
        papers,
        kindLabel: KIND_LABEL,
        tagHref: (deck, sec) => `/x/chapter/ch${deck}?s=${sec}`,
        chapterNames: { 1: '绪论', 2: '进程管理' },
      }),
    );
    expect(container.querySelector('.exam-insights')).toBeTruthy();
    expect(container.textContent).toContain('考点分析');
    expect(container.textContent).toContain('2 份试卷 · 3 道题 · 覆盖 2/2 章');
    expect(container.querySelectorAll('.ei-bars .ei-row')).toHaveLength(2);
    expect(container.querySelectorAll('.ei-legend li')).toHaveLength(3);
    expect(container.querySelectorAll('.ei-tags .ei-tag-row')).toHaveLength(3);
    // 高频考点行是真实链接，走 tagHref
    const firstTag = container.querySelector('.ei-tags .ei-tag-row') as HTMLAnchorElement;
    expect(firstTag.getAttribute('href')).toBe('/x/chapter/ch2?s=sec-ch2');
    // 矩阵：两行卷；deck 3 不在 chapterNames 表内，列被过滤，非零格 = A 卷第2章 + B 卷第1章
    expect(container.querySelectorAll('.ei-matrix tbody tr')).toHaveLength(2);
    expect(container.querySelectorAll('.ei-matrix tbody td.ei-m-cell')).toHaveLength(2);
    expect(container.textContent).toContain('2022 期末卷');
  });

  it('有错题进度时出现「我的易错考点」，全对时不出现', () => {
    const props = {
      papers,
      kindLabel: KIND_LABEL,
      tagHref: (deck: number, sec: string) => `/x/chapter/ch${deck}?s=${sec}`,
      chapterNames: { 1: '绪论', 2: '进程管理' } as Record<number, string>,
    };
    const withWrong = render(createElement(ExamInsights, { ...props, progress: { a1: 'wrong' } }));
    expect(withWrong.container.textContent).toContain('我的易错考点');
    expect(withWrong.container.textContent).toContain('错 1 / 答 1');
    withWrong.unmount();

    const allRight = render(createElement(ExamInsights, { ...props, progress: { a1: 'right', b1: 'right' } }));
    expect(allRight.container.textContent).not.toContain('我的易错考点');
  });

  it('单卷课程隐藏矩阵（与章级排行重复）', () => {
    const single = [papers[0]];
    const { container } = render(
      createElement(ExamInsights, {
        papers: single,
        kindLabel: KIND_LABEL,
        tagHref: (deck, sec) => `/x/chapter/ch${deck}?s=${sec}`,
      }),
    );
    expect(container.querySelector('.ei-matrix')).toBeNull();
    expect(container.querySelectorAll('.ei-bars .ei-row')).toHaveLength(1);
  });
});

describe('OsPracticeIndex 集成渲染', () => {
  it('真实 OS 试卷数据渲染出考点分析与试卷卡', () => {
    const { container } = render(
      createElement(MemoryRouter, null, createElement(OsPracticeIndex)),
    );
    expect(container.querySelector('.exam-insights')).toBeTruthy();
    expect(container.textContent).toContain('考点分布');
    expect(container.textContent).toContain('高频考点');
    // 4 份 OS 试卷 → 矩阵 4 行
    expect(container.querySelectorAll('.ei-matrix tbody tr')).toHaveLength(4);
    // 试卷卡片原样保留
    expect(container.querySelectorAll('nav[aria-label="试卷列表"] .ext-card')).toHaveLength(4);
  });
});

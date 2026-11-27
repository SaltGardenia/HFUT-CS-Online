/**
 * 练习报告测试：统计口径（aggregates）与渲染行为（PracticeReport）。
 * 口径要点：看答案计入作答分母、不计入掌握分子；章级按主标签（最小正 deck）归属。
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import {
  MIN_SAMPLE,
  WEAK_THRESHOLD,
  masteryOf,
  primaryDeck,
  shellDeckMeta,
  sortDecksByMastery,
  sortTagsWeakest,
  summarize,
  tallyByDeck,
  tallyByKind,
  tallyByTag,
  tallyOf,
  weakTags,
} from '../components/practice/report/aggregates';
import PracticeReport from '../components/practice/report/PracticeReport';
import type { PracticeQuestion } from '../content/practice';

/** 造题：tag 传 [deck, text] 简写 */
function q(id: string, kind: PracticeQuestion['kind'], ...tags: [number, string][]): PracticeQuestion {
  return {
    id,
    kind,
    question: `<p>${id}</p>`,
    answer: 'A',
    explanation: '<p>解析</p>',
    options: ['A', 'B', 'C', 'D'],
    tags: tags.map(([deck, text]) => ({ deck, sec: deck > 0 ? `sec-${deck}-${text}` : '', text })),
  };
}

const results = (r: Record<string, 'right' | 'wrong' | 'revealed'>) => r;

describe('练习报告统计口径', () => {
  it('tallyOf：right/wrong/revealed 分账，answered = 三者之和', () => {
    const qs = [q('a1', 'single', [1, 'x']), q('a2', 'single', [1, 'x']), q('a3', 'judge', [2, 'y']), q('a4', 'fill', [2, 'y'])];
    const t = tallyOf(qs, results({ a1: 'right', a2: 'wrong', a3: 'revealed' }));
    expect(t).toEqual({ total: 4, right: 1, wrong: 1, revealed: 1, answered: 3, pending: 1 });
  });

  it('掌握率：分母含看答案，分子只算答对；无作答为 null', () => {
    expect(masteryOf({ right: 3, answered: 4 })).toBeCloseTo(0.75);
    expect(masteryOf({ right: 2, answered: 2 })).toBe(1);
    expect(masteryOf({ right: 0, answered: 0 })).toBeNull();
  });

  it('summarize：覆盖率 = 已作答/总数', () => {
    const qs = [q('a1', 'single', [1, 'x']), q('a2', 'single', [1, 'x'])];
    const s = summarize(qs, results({ a1: 'revealed' }));
    expect(s.coverage).toBeCloseTo(0.5);
    expect(s.mastery).toBe(0); // 看答案不算掌握
  });

  it('primaryDeck：取最小正 deck；全是 deck 0 归 0', () => {
    expect(primaryDeck(q('b1', 'single', [3, 'a'], [1, 'b']))).toBe(1);
    expect(primaryDeck(q('b2', 'single', [0, '课件未收录']))).toBe(0);
    expect(primaryDeck(q('b3', 'single', [0, '未收录'], [2, 'b']))).toBe(2);
  });

  it('tallyByDeck：章级按主标签归属，各章 total 加总 = 总题数；deck 0 排最后', () => {
    const qs = [
      q('c1', 'single', [1, 'a']),
      q('c2', 'single', [1, 'b']),
      q('c3', 'judge', [2, 'c']),
      q('c4', 'fill', [0, '未收录']),
    ];
    const rows = tallyByDeck(qs, results({ c1: 'right', c3: 'wrong' }));
    expect(rows.map((r) => r.deck)).toEqual([1, 2, 0]);
    expect(rows.map((r) => r.total)).toEqual([2, 1, 1]);
    expect(rows.reduce((n, r) => n + r.total, 0)).toBe(4);
    expect(rows[0].answered).toBe(1);
  });

  it('tallyByTag：逐标签口径，一题挂两个知识点各计一次；同名标签合并', () => {
    const qs = [
      q('d1', 'single', [1, '主方法'], [2, '递归']),
      q('d2', 'single', [1, '主方法']),
    ];
    const rows = tallyByTag(qs, results({ d1: 'right' }));
    const zm = rows.find((r) => r.text === '主方法')!;
    expect(zm.total).toBe(2);
    expect(zm.answered).toBe(1);
    expect(rows.find((r) => r.text === '递归')!.total).toBe(1);
  });

  it('tallyByKind：只返回有题的题型，按传入顺序', () => {
    const qs = [q('e1', 'judge', [1, 'a']), q('e2', 'essay', [1, 'a'])];
    const rows = tallyByKind(qs, {}, ['single', 'judge', 'essay', 'fill']);
    expect(rows.map((r) => r.kind)).toEqual(['judge', 'essay']);
    expect(rows[0].total).toBe(1);
  });

  it('榜单排序：章榜掌握率降序（无作答垫底）；薄弱榜只留已作答、掌握率升序', () => {
    const qs = [
      q('f1', 'single', [1, 'a']),
      q('f2', 'single', [2, 'b']),
      q('f3', 'single', [3, 'c']),
    ];
    const rs = results({ f1: 'right', f3: 'wrong' });
    const decks = sortDecksByMastery(tallyByDeck(qs, rs));
    expect(decks.map((d) => d.deck)).toEqual([1, 3, 2]); // 100% → 0% → 未作答垫底

    const tags = sortTagsWeakest(tallyByTag(qs, rs));
    expect(tags.map((t) => t.text)).toEqual(['c', 'a']); // 0% 在前；未作答的 b 被剔除
  });

  it('薄弱知识点：掌握率 < 60% 且已作答', () => {
    const rows = tallyByTag(
      [q('g1', 'single', [1, '薄弱']), q('g2', 'single', [1, '过关']), q('g3', 'single', [1, '没做'])],
      results({ g1: 'wrong', g2: 'right' }),
    );
    const weak = weakTags(rows);
    expect(weak.map((r) => r.text)).toEqual(['薄弱']);
    expect(WEAK_THRESHOLD).toBe(0.6);
    expect(MIN_SAMPLE).toBe(3);
  });

  it('shellDeckMeta：序数取章名与章色；越界回落课程色', () => {
    const meta = shellDeckMeta({
      deckKey: 'os',
      chapters: [
        { id: 'ch1', no: '第1章', title: 't1' },
        { id: 'ch2', no: '第2章', title: 't2' },
      ],
    });
    expect(meta(1)).toEqual({ name: '第1章', color: 'var(--os1, var(--deck-accent))' });
    expect(meta(9).color).toBe('var(--deck-accent)');
  });
});

describe('练习报告渲染', () => {
  const mount = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

  const qs = [
    q('h1', 'single', [1, '主方法'], [3, '递归式']),
    q('h2', 'single', [1, '主方法']),
    q('h3', 'judge', [2, 'master 定理']),
    q('h4', 'fill', [0, '课件未收录']),
  ];

  it('全未作答：不渲染', () => {
    const { container } = mount(<PracticeReport title="本卷报告" questions={qs} results={{}} />);
    expect(container.querySelector('.pr-report')).toBeNull();
  });

  it('作答后：概览数字与分章行出现，掌握率按口径计算', () => {
    const { container } = mount(
      <PracticeReport
        title="本卷报告"
        questions={qs}
        results={results({ h1: 'right', h2: 'wrong', h4: 'revealed' })}
        deckMeta={(deck) => ({ name: `第${deck}讲`, color: 'var(--accent)' })}
      />,
    );
    const stats = container.querySelectorAll('.pr-stat');
    expect(stats).toHaveLength(4);
    // 已作答 3/4，掌握 1/3
    expect(stats[0].querySelector('b')?.textContent).toContain('3');
    expect(stats[1].querySelector('b')?.textContent).toBe('33%');
    expect(stats[2].querySelector('b')?.textContent).toBe('75%');
    // 分章：deck 1、2、0 三行（deck 0 = 未挂章节）
    expect(container.querySelectorAll('.pr-rows')[0].querySelectorAll('.pr-row')).toHaveLength(3);
    expect(container.textContent).toContain('未挂章节');
    // 知识点榜与散点
    expect(container.textContent).toContain('知识点掌握');
    expect(container.querySelectorAll('.pr-dot').length).toBeGreaterThanOrEqual(2);
  });

  it('知识点行可跳转（tagNav），deck 0 的知识点行不可跳', () => {
    const { container } = mount(
      <PracticeReport
        title="本卷报告"
        questions={qs}
        results={results({ h1: 'right', h3: 'right', h4: 'revealed' })}
        tagNav={(t) => ({ href: `/deck/deck${t.deck}?s=${t.sec}`, tip: t.text })}
      />,
    );
    const links = [...container.querySelectorAll('.pr-tag-link')];
    expect(links.length).toBeGreaterThan(0);
    // deck 0（课件未收录）只有行展示，无跳转链接
    expect(links.some((a) => a.textContent?.includes('课件未收录'))).toBe(false);
    expect(container.textContent).toContain('课件未收录');
  });

  it('知识点超过 8 条：默认收起，可展开全部', () => {
    const many = Array.from({ length: 12 }, (_, i) => q(`i${i}`, 'single', [1, `知识点${i}`]));
    const rs = Object.fromEntries(many.map((x, i) => [x.id, i % 2 === 0 ? ('right' as const) : ('wrong' as const)]));
    const { container } = mount(<PracticeReport title="全部习题报告" questions={many} results={rs} />);
    const tagRows = container.querySelectorAll('.pr-rows')[1]; // 第 2 个块 = 知识点榜
    expect(tagRows.querySelectorAll('.pr-row')).toHaveLength(8);
    const more = container.querySelector('.pr-more')!;
    fireEvent.click(more);
    expect(container.querySelectorAll('.pr-rows')[1].querySelectorAll('.pr-row')).toHaveLength(12);
    expect(more.textContent).toBe('收起');
  });
});

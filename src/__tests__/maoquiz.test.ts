/**
 * 毛概背题（lib/maoquiz + content/maogai）：
 * 1) 题库契约：题型/答案/选项/章节字段合法、ID 唯一、题量 1151；
 * 2) 艾宾浩斯调度：新卡首记进第 1 阶、记住进阶按间隔排期、毕业不再排期、遗忘回第 1 阶；
 * 3) 每日新学配额：只对首次作答计配额，跨天重置；
 * 4) 队列：学习只取未学新卡（按题库顺序），复习只取到期卡（最久未见在前）。
 */
import { describe, expect, it } from 'vitest';
import { maoBank, MAO_CHAPTERS } from '../content/maogai';
import {
  GRADUATED,
  NEW_PER_DAY,
  STAGE_INTERVALS,
  applyGrade,
  emptyState,
  learnQueue,
  remainingNew,
  reviewQueue,
} from '../lib/maoquiz';

const DAY = 86_400_000;
const NOW = new Date('2026-06-01T10:00:00').getTime();
const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
/** 队列测试用的截断题库（27 题） */
const someBank = maoBank.slice(0, NEW_PER_DAY + 5);

describe('毛概题库契约', () => {
  it('题量为清洗库的 1151 题且 ID 唯一', () => {
    expect(maoBank.length).toBe(1151);
    expect(new Set(maoBank.map((q) => q.id)).size).toBe(maoBank.length);
  });

  it('题目字段合法：题型在册、题干非空、答案与选项匹配、章节在册', () => {
    for (const q of maoBank) {
      expect(['single', 'multiple', 'judge', 'fill'], q.id).toContain(q.kind);
      expect(q.question.trim().length, q.id).toBeGreaterThan(0);
      expect(MAO_CHAPTERS.includes(q.chapter as never) || q.chapter === null, q.id).toBe(true);
      if (q.kind === 'single' || q.kind === 'multiple') {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
        for (const i of q.answer as number[]) {
          expect(i, q.id).toBeGreaterThanOrEqual(0);
          expect(i, q.id).toBeLessThan(q.options.length);
        }
      }
      if (q.kind === 'single') expect((q.answer as number[]).length, q.id).toBe(1);
      if (q.kind === 'multiple') expect((q.answer as number[]).length, q.id).toBeGreaterThanOrEqual(2);
      if (q.kind === 'judge') {
        expect(q.options, q.id).toEqual(['正确', '错误']);
        expect([0, 1], q.id).toContain((q.answer as number[])[0]);
      }
      if (q.kind === 'fill') {
        expect(q.options.length, q.id).toBe(0);
        expect(String(q.answer).trim().length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('按章节统计与清洗报告一致（导论 69、第一章 136、第八章 88、未归类 68）', () => {
    const counts = new Map<string, number>();
    for (const q of maoBank) counts.set(q.chapter ?? '未归类', (counts.get(q.chapter ?? '未归类') ?? 0) + 1);
    expect(counts.get('导论')).toBe(69);
    expect(counts.get('第一章')).toBe(136);
    expect(counts.get('第八章')).toBe(88);
    expect(counts.get('未归类')).toBe(68);
  });
});

describe('艾宾浩斯调度', () => {
  it('新卡首记进第 1 阶、明天复查；没记住计一次遗忘', () => {
    const s1 = applyGrade(emptyState(), 'MG-1', true, NOW, true);
    expect(s1.cards['MG-1']).toEqual({ s: 1, due: startOfDay(NOW) + 1 * DAY, lp: 0 });
    const s2 = applyGrade(emptyState(), 'MG-2', false, NOW, true);
    expect(s2.cards['MG-2']).toEqual({ s: 1, due: startOfDay(NOW) + 1 * DAY, lp: 1 });
  });

  it('连续记住按 1/2/4/7/15/30/60 天排期，第 8 次毕业不再排期', () => {
    let s = emptyState();
    let now = NOW;
    s = applyGrade(s, 'MG-1', true, now, true);
    for (let stage = 1; stage < GRADUATED; stage++) {
      now = startOfDay(NOW) + (stage - 1) * STAGE_INTERVALS[stage - 1] * DAY + DAY / 2;
      const rec = s.cards['MG-1'];
      expect(rec.s).toBe(stage);
      if (stage < GRADUATED) {
        // 到期前不出现在复习队列
        expect(reviewQueue(maoBank, s, rec.due - 1).map((q) => q.id)).not.toContain('MG-1');
        expect(reviewQueue(maoBank, s, rec.due).map((q) => q.id)).toContain('MG-1');
      }
      s = applyGrade(s, 'MG-1', true, now, false);
    }
    expect(s.cards['MG-1'].s).toBe(GRADUATED);
    expect(s.cards['MG-1'].due).toBe(Number.MAX_SAFE_INTEGER);
    expect(reviewQueue(maoBank, s, Number.MAX_SAFE_INTEGER - 1).map((q) => q.id)).not.toContain('MG-1');
  });

  it('任一阶段没记住都回第 1 阶并累计遗忘', () => {
    let s = applyGrade(emptyState(), 'MG-3', true, NOW, true);
    s = applyGrade(s, 'MG-3', true, NOW + DAY, false);
    expect(s.cards['MG-3'].s).toBe(2);
    s = applyGrade(s, 'MG-3', false, NOW + 3 * DAY, false);
    expect(s.cards['MG-3']).toEqual({ s: 1, due: startOfDay(NOW + 3 * DAY) + DAY, lp: 1 });
  });
});

describe('每日新学配额', () => {
  it('只对首次作答计配额，旧卡复习不消耗', () => {
    // 账面日期对齐测试时间（否则配额按跨天处理）
    let s = { ...emptyState(), day: '2026-06-01', nw: 0 };
    const first = learnQueue(someBank, s, NOW);
    expect(first.length).toBe(NEW_PER_DAY);
    for (const q of first) s = applyGrade(s, q.id, true, NOW, true);
    expect(remainingNew(s, NOW)).toBe(0);
    // 复习旧卡：配额不动
    s = applyGrade(s, first[0].id, true, NOW, false);
    expect(remainingNew(s, NOW)).toBe(0);
    // 跨天：配额回满
    expect(remainingNew(s, NOW + DAY)).toBe(NEW_PER_DAY);
    expect(learnQueue(someBank, { ...s, day: '', nw: 0 }, NOW + DAY).length).toBe(5);
  });
});

describe('队列', () => {
  it('学习队列只取未学新卡、按题库顺序；复习队列按到期先后', () => {
    const s = emptyState();
    const learn = learnQueue(someBank, s, NOW);
    expect(learn.map((q) => q.id)).toEqual(someBank.slice(0, NEW_PER_DAY).map((q) => q.id));

    let s2 = emptyState();
    // 前一天各记一次（第 1 阶，今天到期）
    s2 = applyGrade(s2, maoBank[0].id, true, NOW - DAY, true);
    s2 = applyGrade(s2, maoBank[1].id, true, NOW - DAY, true);
    // MG-1 记住 → 第 2 阶两天后到期；MG-2 没记住 → 回第 1 阶明天到期
    s2 = applyGrade(s2, maoBank[0].id, true, NOW, false);
    s2 = applyGrade(s2, maoBank[1].id, false, NOW, false);
    const due = reviewQueue(someBank, s2, NOW + 2 * DAY);
    // MG-2 明天到期在前，MG-1 后天到期在后
    expect(due.map((q) => q.id).indexOf('MG-2')).toBeLessThan(due.map((q) => q.id).indexOf('MG-1'));
  });
});

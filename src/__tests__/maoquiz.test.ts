/**
 * 毛概背题（lib/maoquiz + content/maogai）：
 * 1) 题库契约：题型/答案/选项/章节字段合法、ID 唯一、题量 1151；
 * 2) 百词斩式调度：学习中连对 LEARN_STREAK 次才算学会、按答错次数定首次复习间隔、
 *    答错/看答案回炉（回学习中、当天可再学）、复习阶段记住进阶、毕业不再排期；
 * 3) 队列：学习 = 未学新卡 + 学习中的卡（不限量），复习 = 已学会且到期（最久未见在前）。
 */
import { describe, expect, it } from 'vitest';
import { maoBank, MAO_CHAPTERS } from '../content/maogai';
import {
  GRADUATED,
  LEARN_STREAK,
  STAGE_INTERVALS,
  applyGrade,
  countsOf,
  emptyState,
  learnQueue,
  reviewQueue,
} from '../lib/maoquiz';

const DAY = 86_400_000;
const NOW = new Date('2026-06-01T10:00:00').getTime();
const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
/** 队列测试用的截断题库（30 题） */
const someBank = maoBank.slice(0, 30);

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

describe('百词斩式调度', () => {
  it('新卡连续答对 3 次才算学会；零错学会从第 2 阶起步（2 天后首复习）', () => {
    let s = emptyState();
    s = applyGrade(s, 'MG-1', true, NOW, );
    expect(s.cards['MG-1']).toEqual({ s: 0, k: 1, w: 0, due: startOfDay(NOW) });
    s = applyGrade(s, 'MG-1', true, NOW + 3600_000);
    expect(s.cards['MG-1'].k).toBe(2);
    s = applyGrade(s, 'MG-1', true, NOW + 7200_000);
    expect(s.cards['MG-1']).toEqual({ s: 2, k: 0, w: 0, due: startOfDay(NOW) + STAGE_INTERVALS[1] * DAY });
  });

  it('答错回炉：回学习中、连续清零、计错；再学会时错过的从第 1 阶起步（明天复习）', () => {
    let s = emptyState();
    s = applyGrade(s, 'MG-2', false, NOW);
    expect(s.cards['MG-2']).toEqual({ s: 0, k: 0, w: 1, due: startOfDay(NOW) });
    s = applyGrade(s, 'MG-2', true, NOW + DAY / 2);
    s = applyGrade(s, 'MG-2', true, NOW + DAY);
    s = applyGrade(s, 'MG-2', true, NOW + DAY + 3600_000);
    // 学会那天（NOW+DAY）的次日复习
    expect(s.cards['MG-2']).toEqual({ s: 1, k: 0, w: 1, due: startOfDay(NOW + DAY) + STAGE_INTERVALS[0] * DAY });
  });

  it('复习阶段记住进阶（1/2/4/7/15/30/60 天），第 7 阶后再记住毕业；答错回炉', () => {
    let s = emptyState();
    // 零错学会 → 第 2 阶起步
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, 'MG-3', true, NOW + i * 3600_000);
    expect(s.cards['MG-3'].s).toBe(2);
    // 依次记住走到毕业
    let now = NOW;
    for (let stage = 3; stage <= GRADUATED; stage++) {
      const prev = s.cards['MG-3'];
      now = prev.due + DAY / 2;
      s = applyGrade(s, 'MG-3', true, now);
      expect(s.cards['MG-3'].s).toBe(stage);
      if (stage < GRADUATED) {
        expect(reviewQueue(maoBank, s, s.cards['MG-3'].due - 1).map((q) => q.id)).not.toContain('MG-3');
        expect(reviewQueue(maoBank, s, s.cards['MG-3'].due).map((q) => q.id)).toContain('MG-3');
      }
    }
    expect(s.cards['MG-3']).toEqual({ s: GRADUATED, k: 0, w: 0, due: Number.MAX_SAFE_INTEGER });
    expect(reviewQueue(maoBank, s, Number.MAX_SAFE_INTEGER - 1).map((q) => q.id)).not.toContain('MG-3');
    // 毕业后答错也回炉
    s = applyGrade(s, 'MG-3', false, now + DAY);
    expect(s.cards['MG-3'].s).toBe(0);
    expect(s.cards['MG-3'].w).toBe(1);
  });
});

describe('队列', () => {
  it('学习队列 = 未学新卡 + 学习中的卡（不限量），不含已学会的', () => {
    let s = emptyState();
    expect(learnQueue(someBank, s).length).toBe(someBank.length);
    // 学会前两张、答错第三张（回学习中）
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, NOW + i * 3600_000);
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[1].id, true, NOW + i * 3600_000);
    s = applyGrade(s, someBank[2].id, false, NOW);
    const ids = learnQueue(someBank, s).map((q) => q.id);
    expect(ids).not.toContain(someBank[0].id);
    expect(ids).not.toContain(someBank[1].id);
    expect(ids).toContain(someBank[2].id);
    expect(ids.length).toBe(someBank.length - 2);
  });

  it('复习队列 = 已学会且到期的卡，最久未见的在前', () => {
    let s = emptyState();
    // MG-1 当天连对三次学会 → 第 2 阶，06-03 到期
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, maoBank[0].id, true, NOW + i * 3600_000);
    // 06-02 记住进阶（第 3 阶，06-06 到期）
    s = applyGrade(s, maoBank[0].id, true, NOW + DAY);
    // MG-2 06-02 学会 → 第 2 阶，06-04 到期
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, maoBank[1].id, true, NOW + DAY + i * 3600_000);
    // 06-03：都未到期
    expect(reviewQueue(someBank, s, NOW + 2 * DAY).length).toBe(0);
    // 06-04：MG-2 到期，MG-1 还没到
    const due1 = reviewQueue(someBank, s, NOW + 3 * DAY);
    expect(due1.map((q) => q.id)).toEqual([maoBank[1].id]);
    // 06-06：两张都到期，MG-2（更早排期）在前
    const due2 = reviewQueue(someBank, s, NOW + 5 * DAY);
    expect(due2.map((q) => q.id).indexOf(maoBank[1].id)).toBeLessThan(due2.map((q) => q.id).indexOf(maoBank[0].id));
  });

  it('countsOf：已学/学习中/待复习/已掌握口径正确', () => {
    let s = emptyState();
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, NOW + i * 3600_000);
    s = applyGrade(s, someBank[1].id, false, NOW); // 学习中（回炉）
    const c = countsOf(someBank, s, NOW);
    expect(c.total).toBe(someBank.length);
    expect(c.learned).toBe(2);
    expect(c.learning).toBe(1);
    expect(c.graduated).toBe(0);
    expect(c.due).toBe(0); // 学会的那张 2 天后到期
    expect(c.due).toBe(reviewQueue(someBank, s, NOW).length);
  });
});

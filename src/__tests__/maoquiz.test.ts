/**
 * 毛概背题（lib/maoquiz + content/maogai）：
 * 1) 题库契约：题型/答案/选项/章节字段合法、ID 唯一、题量 1151；
 * 2) 百词斩式分支规则：学习中连对 3 次学会、间隔乘增长系数（连对数/反应时长/题型修正）
 *    且封顶 MAX_INTERVAL、间隔达上限连对足够即毕业；答错阶梯降级切薄弱池、
 *    连续失败止损放宽；薄弱答对恢复常规；
 * 3) 调度：复习候选池优先级（薄弱 > 刚学不久 > 熟词）、每日上限溢出顺延、学习队列不限量。
 */
import { describe, expect, it } from 'vitest';
import { maoBank, MAO_CHAPTERS } from '../content/maogai';
import type { MaoState } from '../lib/maoquiz';
import {
  FAIL_CAP,
  LEARN_STREAK,
  MAX_INTERVAL,
  MIN_INTERVAL,
  REVIEW_DAILY_CAP,
  SLOW_FAIL_INTERVAL,
  applyGrade,
  countsOf,
  emptyState,
  learnQueue,
  reviewPool,
  takeReviewQueue,
} from '../lib/maoquiz';

const DAY = 86_400_000;
const NOW = new Date('2026-06-01T10:00:00').getTime();
const TODAY = NOW - 10 * 3600_000; // 当天 00:00
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

describe('学习中（连对 3 次学会）', () => {
  it('新卡连对 3 次学会：零错起步第 2 阶（2 天后首复习）', () => {
    let s = emptyState();
    s = applyGrade(s, 'MG-1', true, 2000, 'single', NOW);
    expect(s.cards['MG-1']).toEqual({ st: 0, streak: 1, fails: 0, ivl: 0, due: TODAY, rv: 1 });
    s = applyGrade(s, 'MG-1', true, 2000, 'single', NOW);
    s = applyGrade(s, 'MG-1', true, 2000, 'single', NOW);
    expect(s.cards['MG-1']).toEqual({ st: 1, streak: 3, fails: 0, ivl: 2, due: TODAY + 2 * DAY, rv: 3 });
  });

  it('学习期答错计连续失败；再学会时错过的从 1 天首复习起步', () => {
    let s = emptyState();
    s = applyGrade(s, 'MG-2', false, 4000, 'single', NOW);
    expect(s.cards['MG-2']).toEqual({ st: 0, streak: 0, fails: 1, ivl: 0, due: TODAY, rv: 1 });
    s = applyGrade(s, 'MG-2', true, 2000, 'single', NOW + 3600_000);
    s = applyGrade(s, 'MG-2', true, 2000, 'single', NOW + 3600_000);
    s = applyGrade(s, 'MG-2', true, 2000, 'single', NOW + 3600_000);
    expect(s.cards['MG-2']).toEqual({ st: 1, streak: 3, fails: 0, ivl: 1, due: TODAY + DAY, rv: 4 });
  });
});

describe('复习分支（增长系数 / 阶梯降级 / 毕业）', () => {
  /** 学会 MG-1（零错，ivl=2, streak=3） */
  const learned = () => {
    let s = emptyState();
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, 'MG-1', true, 2000, 'single', NOW + i * 3600_000);
    return s;
  };

  it('记住放大间隔：连对越多系数越高；反应时长与题型修正生效', () => {
    let s = learned();
    // streak 3→4：base = 1.6 + 0.1*4 = 2.0，2s 全额 → ivl = 2×2.0 = 4
    s = applyGrade(s, 'MG-1', true, 2000, 'single', NOW + 3 * DAY);
    expect(s.cards['MG-1'].ivl).toBe(4);
    // 慢答（犹豫）：>8s 打 6 折 → factor 1.6 → ivl = round(4×1.6) = 6（而非全额 8）
    s = applyGrade(s, 'MG-1', true, 10_000, 'single', NOW + 3 * DAY + 4 * DAY);
    expect(s.cards['MG-1'].ivl).toBe(6);
    // 填空（拼写置信度高）权重 1.2：factor = 1 + 1.0×1.2 = 2.2
    const s2: MaoState = { v: 1, cards: { MG: { st: 1, streak: 3, fails: 0, ivl: 10, due: TODAY, rv: 3 } } };
    const s3 = applyGrade(s2, 'MG', true, 2000, 'fill', NOW);
    expect(s3.cards['MG'].ivl).toBe(22); // round(10 × 2.2)
  });

  it('封顶 MAX_INTERVAL：间隔达上限且连对 MASTER_STREAK 次毕业，移出常规队列', () => {
    let s: MaoState = { v: 1, cards: { MG: { st: 1, streak: 4, fails: 0, ivl: 60, due: TODAY, rv: 4 } } };
    s = applyGrade(s, 'MG', true, 2000, 'single', NOW);
    // ivl 封顶 90，但此前 60 < 90 未达毕业条件 → 仍在复习
    expect(s.cards['MG'].st).toBe(1);
    expect(s.cards['MG'].ivl).toBe(MAX_INTERVAL);
    expect(s.cards['MG'].streak).toBe(5);
    s = applyGrade(s, 'MG', true, 2000, 'single', NOW);
    // 间隔已达上限 + 连对 ≥5 → 毕业
    expect(s.cards['MG'].st).toBe(3);
    expect(reviewPool(someBank, s, NOW + 100 * DAY).length).toBe(0);
  });

  it('答错阶梯降级切薄弱池：错 1 次减半、错 2 次压到最小、连续失败达阈值止损放宽', () => {
    let s: MaoState = { v: 1, cards: { MG: { st: 1, streak: 3, fails: 0, ivl: 10, due: TODAY, rv: 3 } } };
    s = applyGrade(s, 'MG', false, 2000, 'single', NOW);
    expect(s.cards['MG']).toMatchObject({ st: 2, fails: 1, streak: 0, ivl: 5 });
    expect(s.cards['MG'].due).toBe(TODAY + 5 * DAY);
    s = applyGrade(s, 'MG', false, 2000, 'single', NOW);
    expect(s.cards['MG'].ivl).toBe(MIN_INTERVAL);
    s = applyGrade(s, 'MG', false, 2000, 'single', NOW);
    expect(s.cards['MG'].ivl).toBe(MIN_INTERVAL);
    s = applyGrade(s, 'MG', false, 2000, 'single', NOW);
    expect(s.cards['MG'].fails).toBe(FAIL_CAP);
    expect(s.cards['MG'].ivl).toBe(SLOW_FAIL_INTERVAL);
  });

  it('薄弱答对恢复常规复习（fails 清零、间隔从低位放大）', () => {
    let s: MaoState = { v: 1, cards: { MG: { st: 2, streak: 0, fails: 2, ivl: 1, due: TODAY, rv: 5 } } };
    s = applyGrade(s, 'MG', true, 2000, 'single', NOW);
    expect(s.cards['MG']).toMatchObject({ st: 1, fails: 0, streak: 1, ivl: 2 });
  });
});

describe('调度', () => {
  it('复习候选池优先级：薄弱 > 刚学不久 > 长期熟词，同档按到期先后', () => {
    const [idA, idB, idC, idD] = someBank.slice(0, 4).map((q) => q.id);
    const cards = {
      [idA]: { st: 1 as const, streak: 2, fails: 0, ivl: 30, due: TODAY, rv: 5 },    // 熟词
      [idB]: { st: 2 as const, streak: 0, fails: 1, ivl: 1, due: TODAY, rv: 6 },     // 薄弱
      [idC]: { st: 1 as const, streak: 1, fails: 0, ivl: 2, due: TODAY, rv: 4 },     // 刚学不久
      [idD]: { st: 2 as const, streak: 0, fails: 2, ivl: 1, due: TODAY - DAY, rv: 7 }, // 薄弱（更早到期）
    };
    const state: MaoState = { v: 1, cards };
    const ids = reviewPool(someBank, state, NOW).map((q) => q.id);
    expect(ids).toEqual([idD, idB, idC, idA]);
  });

  it('每日上限：候选池超出 REVIEW_DAILY_CAP 时只取配额，溢出顺延一天（不删除）', () => {
    const cards: Record<string, { st: 1; streak: number; fails: number; ivl: number; due: number; rv: number }> = {};
    const ids = maoBank.slice(0, REVIEW_DAILY_CAP + 20).map((q) => q.id);
    for (const id of ids) cards[id] = { st: 1, streak: 3, fails: 0, ivl: 5, due: TODAY, rv: 3 };
    const state: MaoState = { v: 1, cards };
    const { queue, state: next } = takeReviewQueue(maoBank, state, NOW);
    // 只取当日配额；其余 20 张顺延一天；两类并集恰好覆盖全部到期卡
    expect(queue.length).toBe(REVIEW_DAILY_CAP);
    const kept = new Set(queue.map((q) => q.id));
    let deferred = 0;
    for (const id of ids) {
      if (kept.has(id)) expect(next.cards[id].due).toBe(TODAY);
      else {
        expect(next.cards[id].due).toBe(TODAY + DAY);
        deferred += 1;
      }
    }
    expect(deferred).toBe(20);
  });

  it('学习队列不限量（未学 + 学习中），已学会的不进', () => {
    let s = emptyState();
    expect(learnQueue(someBank, s).length).toBe(someBank.length);
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, 2000, 'single', NOW + i * 3600_000);
    s = applyGrade(s, someBank[1].id, false, 2000, 'single', NOW); // 学习中（回炉）
    const ids = learnQueue(someBank, s).map((q) => q.id);
    expect(ids).not.toContain(someBank[0].id);
    expect(ids).toContain(someBank[1].id);
    expect(ids.length).toBe(someBank.length - 1);
  });

  it('countsOf 口径：已学/学习中/薄弱/待复习/毕业', () => {
    let s = emptyState();
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, 2000, 'single', NOW + i * 3600_000);
    s = applyGrade(s, someBank[1].id, false, 2000, 'single', NOW); // 学习中
    const c = countsOf(someBank, s, NOW);
    expect(c.total).toBe(someBank.length);
    expect(c.learned).toBe(2);
    expect(c.learning).toBe(1);
    expect(c.weak).toBe(0);
    expect(c.graduated).toBe(0);
    expect(c.due).toBe(0); // 学会的那张 2 天后到期
    expect(c.fresh).toBe(someBank.length - 2);
  });
});

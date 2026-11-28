/**
 * 学习通题库（content/quizbank + lib/maoquiz）：
 * 1) 七门课题库契约：题量与注册表一致、ID 唯一、题型/答案/章节字段合法；
 * 2) 百词斩式调度：学习中连对 3 次学会、间隔乘增长系数且封顶、答错阶梯降级切薄弱池、
 *    连续失败止损、毕业移出队列；
 * 3) 调度：复习候选池优先级、每日上限溢出顺延、学习队列不限量。
 */
import { describe, expect, it } from 'vitest';
import { QUIZ_COURSES, loadQuizBank } from '../content/quizbank';
import type { QuizQuestion } from '../content/quizbank/types';
import type { QuizState } from '../lib/maoquiz';
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
const TODAY = NOW - 10 * 3600_000;

/** 调度测试用的小题库（不使用真实题库，避免数据变动影响断言） */
function smallBank(): QuizQuestion[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `T${i + 1}`,
    chapter: '第一章',
    kind: 'single' as const,
    question: `测试题 ${i + 1}`,
    options: ['甲', '乙', '丙', '丁'],
    answer: [0],
    explanation: '',
  }));
}
const someBank = smallBank();

describe('七门课题库契约', () => {
  it('题量与注册表一致，且字段合法', async () => {
    expect(QUIZ_COURSES).toHaveLength(7);
    for (const course of QUIZ_COURSES) {
      const bank = await loadQuizBank(course);
      expect(bank.length, course.slug).toBe(course.count);
      expect(new Set(bank.map((q) => q.id)).size, course.slug).toBe(bank.length);
      for (const q of bank) {
        const tag = `${course.slug}/${q.id}`;
        expect(['single', 'multiple', 'judge', 'fill'], tag).toContain(q.kind);
        expect(q.question.trim().length, tag).toBeGreaterThan(0);
        expect(q.chapter.trim().length, tag).toBeGreaterThan(0);
        if (q.kind === 'single' || q.kind === 'multiple') {
          expect(q.options.length, tag).toBeGreaterThanOrEqual(2);
          for (const i of q.answer as number[]) {
            expect(i, tag).toBeGreaterThanOrEqual(0);
            expect(i, tag).toBeLessThan(q.options.length);
          }
          if (q.kind === 'single') expect((q.answer as number[]).length, tag).toBe(1);
          if (q.kind === 'multiple') expect((q.answer as number[]).length, tag).toBeGreaterThanOrEqual(1);
        }
        if (q.kind === 'judge') {
          expect(q.options, tag).toEqual(['正确', '错误']);
          expect([0, 1], tag).toContain((q.answer as number[])[0]);
        }
        if (q.kind === 'fill') {
          expect(q.options.length, tag).toBe(0);
          expect(String(q.answer).trim().length, tag).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('百词斩式调度', () => {
  it('学习中新卡连对 3 次学会：零错从第 2 阶起步（2 天后首复习）', () => {
    let s = emptyState();
    s = applyGrade(s, 'T1', true, 2000, 'single', NOW);
    expect(s.cards['T1']).toEqual({ st: 0, streak: 1, fails: 0, ivl: 0, due: TODAY, rv: 1 });
    s = applyGrade(s, 'T1', true, 2000, 'single', NOW);
    s = applyGrade(s, 'T1', true, 2000, 'single', NOW);
    expect(s.cards['T1']).toEqual({ st: 1, streak: 3, fails: 0, ivl: 2, due: TODAY + 2 * DAY, rv: 3 });
  });

  it('学习期答错计连续失败；再学会时错过的从 1 天首复习起步', () => {
    let s = emptyState();
    s = applyGrade(s, 'T2', false, 4000, 'single', NOW);
    expect(s.cards['T2']).toEqual({ st: 0, streak: 0, fails: 1, ivl: 0, due: TODAY, rv: 1 });
    s = applyGrade(s, 'T2', true, 2000, 'single', NOW + DAY / 2);
    s = applyGrade(s, 'T2', true, 2000, 'single', NOW + DAY / 2);
    s = applyGrade(s, 'T2', true, 2000, 'single', NOW + DAY / 2);
    expect(s.cards['T2'].ivl).toBe(1);
    expect(s.cards['T2'].st).toBe(1);
  });

  it('复习记住放大间隔（反应时长/题型修正生效），封顶 MAX_INTERVAL 后连对足够即毕业', () => {
    let s: QuizState = { v: 1, cards: { T: { st: 1, streak: 3, fails: 0, ivl: 2, due: TODAY, rv: 3 } } };
    // streak→4，base=2.0，2s 全额 → ivl = 2×2.0 = 4
    s = applyGrade(s, 'T', true, 2000, 'single', NOW);
    expect(s.cards['T'].ivl).toBe(4);
    // 慢答（>8s 六折）→ factor 1.6 → ivl = round(4×1.6) = 6
    s = applyGrade(s, 'T', true, 10_000, 'single', NOW + 4 * DAY);
    expect(s.cards['T'].ivl).toBe(6);
    // 填空权重 1.2：ivl 10 × 2.2 = 22
    const s2: QuizState = { v: 1, cards: { T: { st: 1, streak: 3, fails: 0, ivl: 10, due: TODAY, rv: 3 } } };
    expect(applyGrade(s2, 'T', true, 2000, 'fill', NOW).cards['T'].ivl).toBe(22);
    // 封顶 → 毕业
    let s3: QuizState = { v: 1, cards: { T: { st: 1, streak: 4, fails: 0, ivl: 60, due: TODAY, rv: 4 } } };
    s3 = applyGrade(s3, 'T', true, 2000, 'single', NOW);
    expect(s3.cards['T'].ivl).toBe(MAX_INTERVAL);
    s3 = applyGrade(s3, 'T', true, 2000, 'single', NOW);
    expect(s3.cards['T'].st).toBe(3);
    expect(reviewPool(someBank, s3, NOW + 100 * DAY).length).toBe(0);
  });

  it('答错阶梯降级切薄弱池：错 1 次减半、错 2 次最小、连续失败达阈值止损放宽', () => {
    let s: QuizState = { v: 1, cards: { T: { st: 1, streak: 3, fails: 0, ivl: 10, due: TODAY, rv: 3 } } };
    s = applyGrade(s, 'T', false, 2000, 'single', NOW);
    expect(s.cards['T']).toMatchObject({ st: 2, fails: 1, streak: 0, ivl: 5 });
    expect(s.cards['T'].due).toBe(TODAY + 5 * DAY);
    s = applyGrade(s, 'T', false, 2000, 'single', NOW);
    expect(s.cards['T'].ivl).toBe(MIN_INTERVAL);
    s = applyGrade(s, 'T', false, 2000, 'single', NOW);
    expect(s.cards['T'].ivl).toBe(MIN_INTERVAL);
    s = applyGrade(s, 'T', false, 2000, 'single', NOW);
    expect(s.cards['T'].fails).toBe(FAIL_CAP);
    expect(s.cards['T'].ivl).toBe(SLOW_FAIL_INTERVAL);
  });

  it('薄弱答对恢复常规复习（fails 清零、间隔从低位放大）', () => {
    let s: QuizState = { v: 1, cards: { T: { st: 2, streak: 0, fails: 2, ivl: 1, due: TODAY, rv: 5 } } };
    s = applyGrade(s, 'T', true, 2000, 'single', NOW);
    expect(s.cards['T']).toMatchObject({ st: 1, fails: 0, streak: 1, ivl: 2 });
  });
});

describe('调度', () => {
  it('复习候选池优先级：薄弱 > 刚学不久 > 熟词，同档按到期先后', () => {
    const [idA, idB, idC, idD] = someBank.slice(0, 4).map((q) => q.id);
    const state: QuizState = {
      v: 1,
      cards: {
        [idA]: { st: 1 as const, streak: 2, fails: 0, ivl: 30, due: TODAY, rv: 5 },
        [idB]: { st: 2 as const, streak: 0, fails: 1, ivl: 1, due: TODAY, rv: 6 },
        [idC]: { st: 1 as const, streak: 1, fails: 0, ivl: 2, due: TODAY, rv: 4 },
        [idD]: { st: 2 as const, streak: 0, fails: 2, ivl: 1, due: TODAY - DAY, rv: 7 },
      },
    };
    expect(reviewPool(someBank, state, NOW).map((q) => q.id)).toEqual([idD, idB, idC, idA]);
  });

  it('每日上限：候选池超出 REVIEW_DAILY_CAP 时只取配额，溢出顺延一天', () => {
    // 构造超过上限的到期池：复制小题库并放大
    const bank = Array.from({ length: REVIEW_DAILY_CAP + 20 }, (_, i) => ({
      ...someBank[0],
      id: `R${i + 1}`,
    }));
    const cards: Record<string, { st: 1; streak: number; fails: number; ivl: number; due: number; rv: number }> = {};
    for (const q of bank) cards[q.id] = { st: 1, streak: 3, fails: 0, ivl: 5, due: TODAY, rv: 3 };
    const state: QuizState = { v: 1, cards };
    const { queue, state: next } = takeReviewQueue(bank, state, NOW);
    expect(queue.length).toBe(REVIEW_DAILY_CAP);
    const kept = new Set(queue.map((q) => q.id));
    let deferred = 0;
    for (const q of bank) {
      if (kept.has(q.id)) expect(next.cards[q.id].due).toBe(TODAY);
      else {
        expect(next.cards[q.id].due).toBe(TODAY + DAY);
        deferred += 1;
      }
    }
    expect(deferred).toBe(20);
  });

  it('学习队列不限量（未学 + 学习中），已学会的不进', () => {
    let s = emptyState();
    expect(learnQueue(someBank, s).length).toBe(someBank.length);
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, 2000, 'single', NOW + i * 3600_000);
    s = applyGrade(s, someBank[1].id, false, 2000, 'single', NOW);
    const ids = learnQueue(someBank, s).map((q) => q.id);
    expect(ids).not.toContain(someBank[0].id);
    expect(ids).toContain(someBank[1].id);
    expect(ids.length).toBe(someBank.length - 1);
  });

  it('countsOf 口径：已学/学习中/薄弱/待复习/毕业', () => {
    let s = emptyState();
    for (let i = 0; i < LEARN_STREAK; i++) s = applyGrade(s, someBank[0].id, true, 2000, 'single', NOW + i * 3600_000);
    s = applyGrade(s, someBank[1].id, false, 2000, 'single', NOW);
    const c = countsOf(someBank, s, NOW);
    expect(c.total).toBe(someBank.length);
    expect(c.learned).toBe(2);
    expect(c.learning).toBe(1);
    expect(c.weak).toBe(0);
    expect(c.graduated).toBe(0);
    expect(c.due).toBe(0);
    expect(c.fresh).toBe(someBank.length - 2);
  });
});

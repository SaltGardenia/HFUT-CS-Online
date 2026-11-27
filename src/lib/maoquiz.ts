/**
 * 毛概背题的艾宾浩斯调度（百词斩式：作答即判分，无人工自评）。
 * 数据只存本地 localStorage（键 hb-maoquiz-v1）；账号云同步的进度层
 * 是简单的结果映射，带排期的时间表暂不在其覆盖范围内。
 *
 * 卡片状态（CardRec）：
 *   s = 0        学习中——需连续答对 LEARN_STREAK 次才算学会（k 记当前连续答对数）
 *   s = 1..7     复习中——按 STAGE_INTERVALS[s-1] 天排下次复习（记住进阶）
 *   s = 8        毕业（掌握，不再排期）
 *   k            学习中的连续答对计数（学会后清零）
 *   w            累计答错次数——决定学会后的首次复习间隔：
 *                一次没错学会 → 从第 2 阶起步（2 天后首复习）；错过 → 第 1 阶起步（明天复习）
 *   due          下次到期时间戳（当日 00:00；学习中的卡 due=当天，即随时可再学）
 *
 * 作答结果：答对 → 学习中则 streak+1（满 3 次学会），复习中则进阶；
 *           答错 / 看答案 → 回炉：s=0、连续清零、w+1、当天回到学习队列。
 * 学习模式队列 = 未学新卡 + 学习中的卡（不限量，可以一直学下去）；
 * 复习模式队列 = 已学会且到期的卡（最久未见在前）。
 */
import { useSyncExternalStore } from 'react';
import type { MaoQuestion } from '../content/maogai';

/** 复习阶段间隔（天）；阶段 s 的下一次复习在 STAGE_INTERVALS[s-1] 天后 */
export const STAGE_INTERVALS = [1, 2, 4, 7, 15, 30, 60] as const;
/** 毕业阶段：第 7 阶（60 天）后再记住一次即掌握 */
export const GRADUATED = STAGE_INTERVALS.length + 1;
/** 学习中学会所需连续答对次数 */
export const LEARN_STREAK = 3;

const DAY = 86_400_000;
export const STORE_KEY = 'hb-maoquiz-v1';

export interface CardRec {
  /** 0 = 学习中；1..7 = 复习阶段；8 = 毕业 */
  s: number;
  /** 学习中连续答对计数 */
  k: number;
  /** 累计答错次数 */
  w: number;
  due: number;
}

export interface MaoState {
  v: 1;
  cards: Record<string, CardRec>;
}

const dayStart = (t: number): number => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const emptyState = (): MaoState => ({ v: 1, cards: {} });

const isMaoState = (x: unknown): x is MaoState =>
  typeof x === 'object' && x !== null && (x as MaoState).v === 1 &&
  typeof (x as MaoState).cards === 'object';

/** 旧版账目迁移：lp（遗忘数）并入 w，缺字段补 0 */
const normalizeRec = (r: Partial<CardRec> & { lp?: number }): CardRec => ({
  s: typeof r.s === 'number' ? r.s : 0,
  k: typeof r.k === 'number' ? r.k : 0,
  w: typeof r.w === 'number' ? r.w : (typeof r.lp === 'number' ? r.lp : 0),
  due: typeof r.due === 'number' ? r.due : 0,
});

/* ------------------------------------------------ 本地持久化 + 订阅 */

let cache: MaoState | null = null;
const listeners = new Set<() => void>();

const readFresh = (): MaoState => {
  let base: MaoState = emptyState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isMaoState(parsed)) {
        const cards: Record<string, CardRec> = {};
        for (const [id, rec] of Object.entries(parsed.cards)) cards[id] = normalizeRec(rec as CardRec & { lp?: number });
        base = { v: 1, cards };
      }
    }
  } catch {
    /* 隐私模式 / 损坏数据：退回空账 */
  }
  return base;
};

const persist = (s: MaoState) => {
  cache = s;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* 写失败（配额满）：内存账仍可用 */
  }
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const getSnapshot = (): MaoState => {
  if (!cache) cache = readFresh();
  return cache;
};

/** 订阅毛概背题账（页面展示与答题页共用一份真相） */
export function useMaoState(): MaoState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------------------------ 调度（纯函数，供测试） */

/** 对一道题记一次作答结果，返回新账（不改入参） */
export function applyGrade(state: MaoState, qid: string, good: boolean, now: number): MaoState {
  const prev = state.cards[qid];
  const cards = { ...state.cards };
  const start = dayStart(now);
  const today = start; // 学习中的卡 due=当天：随时可再学

  let rec: CardRec;
  if (good) {
    if (!prev || prev.s === 0) {
      // 学习中：连续答对满 LEARN_STREAK 次才算学会
      const k = (prev?.k ?? 0) + 1;
      const w = prev?.w ?? 0;
      if (k >= LEARN_STREAK) {
        // 学会：按答错次数决定首次复习间隔（错过的明天复习，零错的后天复习）
        const s = w >= 1 ? 1 : 2;
        rec = { s, k: 0, w, due: start + STAGE_INTERVALS[s - 1] * DAY };
      } else {
        rec = { s: 0, k, w, due: today };
      }
    } else {
      // 复习中：记住进阶；毕业不再排期
      const s = Math.min(prev.s + 1, GRADUATED);
      rec = { ...prev, s, due: s >= GRADUATED ? Number.MAX_SAFE_INTEGER : start + STAGE_INTERVALS[s - 1] * DAY };
    }
  } else {
    // 答错 / 看答案：回炉——回学习中、连续清零、计错、当天回到学习队列
    rec = { s: 0, k: 0, w: (prev?.w ?? 0) + 1, due: today };
  }
  cards[qid] = rec;
  return { ...state, cards };
}

/** 学习队列：未学新卡 + 学习中的卡，按题库顺序（不限量） */
export function learnQueue(bank: readonly MaoQuestion[], state: MaoState): MaoQuestion[] {
  return bank.filter((q) => {
    const rec = state.cards[q.id];
    return !rec || rec.s === 0;
  });
}

/** 复习队列：已学会且到期的卡，最久未见的在前 */
export function reviewQueue(bank: readonly MaoQuestion[], state: MaoState, now: number): MaoQuestion[] {
  return bank
    .filter((q) => {
      const rec = state.cards[q.id];
      return rec && rec.s >= 1 && rec.s < GRADUATED && rec.due <= now;
    })
    .sort((a, b) => (state.cards[a.id].due - state.cards[b.id].due) || a.id.localeCompare(b.id));
}

/** 总览统计 */
export function countsOf(bank: readonly MaoQuestion[], state: MaoState, now: number) {
  let learned = 0;
  let learning = 0;
  let graduated = 0;
  for (const q of bank) {
    const rec = state.cards[q.id];
    if (!rec) continue;
    learned += 1;
    if (rec.s === 0) learning += 1;
    else if (rec.s >= GRADUATED) graduated += 1;
  }
  return {
    total: bank.length,
    learned,
    learning,
    graduated,
    due: reviewQueue(bank, state, now).length,
    fresh: bank.filter((q) => !state.cards[q.id]).length,
  };
}

/** 写入一次作答结果（订阅者自动刷新） */
export function gradeCard(qid: string, good: boolean): void {
  persist(applyGrade(getSnapshot(), qid, good, Date.now()));
}

/** 清空背题账 */
export function resetMaoState(): void {
  persist(emptyState());
}

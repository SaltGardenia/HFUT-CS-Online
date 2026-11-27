/**
 * 毛概背题的艾宾浩斯调度。
 * 数据只存本地 localStorage（键 hb-maoquiz-v1）；账号云同步的进度层
 * 是简单的结果映射，带排期的时间表暂不在其覆盖范围内。
 *
 * 阶段模型（阶段 n = 第 n 次记住后的复习间隔，天）：
 *   未学 → ①1 ②2 ③4 ④7 ⑤15 ⑥30 ⑦60 → 毕业（掌握，不再排期）
 * 记住 = 进一阶并按上表排下次复习；没记住 = 回到第 1 阶（明天再见）并计一次遗忘。
 * 学习模式每天引入 NEW_PER_DAY 张新卡；复习模式只出到期卡，不限量。
 */
import { useSyncExternalStore } from 'react';
import type { MaoQuestion } from '../content/maogai';

/** 各阶段的复习间隔（天）；下标 s-1 对应第 s 阶 */
export const STAGE_INTERVALS = [1, 2, 4, 7, 15, 30, 60] as const;
/** 每日新学配额 */
export const NEW_PER_DAY = 20;
/** 毕业阶段：走完 60 天间隔再记住一次即掌握，不再进入复习队列 */
export const GRADUATED = STAGE_INTERVALS.length + 1;

const DAY = 86_400_000;
export const STORE_KEY = 'hb-maoquiz-v1';

export interface CardRec {
  /** 阶段 1..GRADUATED */
  s: number;
  /** 下次复习时间戳（到期日的 00:00） */
  due: number;
  /** 遗忘次数 */
  lp: number;
}

export interface MaoState {
  v: 1;
  cards: Record<string, CardRec>;
  /** 新学配额所属日期（本地时区 YYYY-MM-DD） */
  day: string;
  /** 当日已学新卡数 */
  nw: number;
}

const dayKey = (t: number): string => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const dayStart = (t: number): number => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const emptyState = (): MaoState => ({ v: 1, cards: {}, day: dayKey(Date.now()), nw: 0 });

const isMaoState = (x: unknown): x is MaoState =>
  typeof x === 'object' && x !== null && (x as MaoState).v === 1 &&
  typeof (x as MaoState).cards === 'object' && typeof (x as MaoState).day === 'string';

/* ------------------------------------------------ 本地持久化 + 订阅 */

let cache: MaoState | null = null;
const listeners = new Set<() => void>();

const readFresh = (): MaoState => {
  let base: MaoState = emptyState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isMaoState(parsed)) base = parsed;
    }
  } catch {
    /* 隐私模式 / 损坏数据：退回空账 */
  }
  // 跨天：配额重新计
  const today = dayKey(Date.now());
  if (base.day !== today) base = { ...base, day: today, nw: 0 };
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
  // 跨天后快照换新引用（不额外广播，读方下次渲染自然拿到）
  const today = dayKey(Date.now());
  if (cache.day !== today) cache = { ...cache, day: today, nw: 0 };
  return cache;
};

/** 订阅毛概背题账（页面展示与答题页共用一份真相） */
export function useMaoState(): MaoState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/* ------------------------------------------------ 调度（纯函数，供测试） */

/** 对一道题记一次结果，返回新账（不改入参） */
export function applyGrade(state: MaoState, qid: string, good: boolean, now: number, isNew: boolean): MaoState {
  const prev = state.cards[qid];
  const cards = { ...state.cards };
  const start = dayStart(now);
  let rec: CardRec;
  if (!prev) {
    // 新卡首记：无论记住与否都进第 1 阶，明天复查
    rec = { s: 1, due: start + STAGE_INTERVALS[0] * DAY, lp: good ? 0 : 1 };
  } else if (good) {
    const s = Math.min(prev.s + 1, GRADUATED);
    rec = { s, due: s >= GRADUATED ? Number.MAX_SAFE_INTEGER : start + STAGE_INTERVALS[s - 1] * DAY, lp: prev.lp };
  } else {
    // 遗忘：回第 1 阶，明天再见
    rec = { s: 1, due: start + STAGE_INTERVALS[0] * DAY, lp: prev.lp + 1 };
  }
  cards[qid] = rec;
  // 只有「从未学过的题」消耗当日新学配额
  const nw = !prev && isNew && state.day === dayKey(now) ? state.nw + 1 : state.nw;
  return { ...state, cards, nw };
}

/** 未来的到期时刻（毕业卡为 MAX，不进队列） */
const isDue = (rec: CardRec, now: number): boolean => rec.s < GRADUATED && rec.due <= now;

/** 复习队列：全部到期卡，按到期先后（最久未见的在前） */
export function reviewQueue(bank: readonly MaoQuestion[], state: MaoState, now: number): MaoQuestion[] {
  return bank
    .filter((q) => {
      const rec = state.cards[q.id];
      return rec && isDue(rec, now);
    })
    .sort((a, b) => (state.cards[a.id].due - state.cards[b.id].due) || a.id.localeCompare(b.id));
}

/** 学习队列：按题库顺序取未学新卡，扣掉当日已用配额 */
export function learnQueue(bank: readonly MaoQuestion[], state: MaoState, now: number): MaoQuestion[] {
  const today = dayKey(now);
  const quota = state.day === today ? Math.max(0, NEW_PER_DAY - state.nw) : NEW_PER_DAY;
  const out: MaoQuestion[] = [];
  for (const q of bank) {
    if (out.length >= quota) break;
    if (!state.cards[q.id]) out.push(q);
  }
  return out;
}

/** 今日剩余新学配额 */
export function remainingNew(state: MaoState, now: number): number {
  const today = dayKey(now);
  return state.day === today ? Math.max(0, NEW_PER_DAY - state.nw) : NEW_PER_DAY;
}

/** 遗忘回推后的展示阶段（0 = 新卡） */
export const stageOf = (state: MaoState, qid: string): number => state.cards[qid]?.s ?? 0;

/** 写入一次判分结果（订阅者自动刷新） */
export function gradeCard(qid: string, good: boolean, isNew: boolean): void {
  persist(applyGrade(getSnapshot(), qid, good, Date.now(), isNew));
}

/** 清空背题账 */
export function resetMaoState(): void {
  persist(emptyState());
}

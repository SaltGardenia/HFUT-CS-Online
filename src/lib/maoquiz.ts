/**
 * 毛概背题调度 —— 百词斩式分支逻辑（作答即判分，无人工自评）。
 * 数据只存本地 localStorage（键 hb-maoquiz-v1）；账号云同步的进度层
 * 是简单的结果映射，带排期的时间表暂不在其覆盖范围内。
 *
 * 卡片状态（CardRec.st）：
 *   0 学习中 —— 新词需连续答对 LEARN_STREAK 次才算学会（streak 记连对数），随时可再学
 *   1 复习中 —— ivl 为当前复习间隔（天）；记住后 ivl × 增长系数（受连对数/反应时长/题型修正），封顶 MAX_INTERVAL
 *   2 薄弱   —— 复习中答错进入错词池：阶梯降级（错 1 次减半、错 2 次压到最小间隔），
 *              连续失败达 FAIL_CAP 后放宽到 SLOW_FAIL_INTERVAL 止损（降低推送频率，错题本重做兜底）
 *   3 毕业   —— ivl 达上限且连续答对 MASTER_STREAK 次：移出常规复习队列；在收藏本重做即召回（回 st=1）
 *
 * 分支规则：
 *   答对  → streak+1、fails 清零、ivl 放大（增长系数 × 反应时长修正 × 题型权重，瞬时作答按蒙对保守处理）
 *   答错  → streak 清零、fails+1：学习中留在当日队列；复习中切薄弱池并阶梯降级
 *   看答案 → 按没答上处理（同答错回炉）
 *   慢答对 → 不放大到全额增幅（保守处理，相当于犹豫）
 *
 * 调度（流量控制）：
 *   复习候选池 = st1/st2 且到期，优先级：薄弱 > 刚学不久（ivl 小）> 长期熟词；
 *   单日复习保护上限 REVIEW_DAILY_CAP，溢出的到期卡 due 顺延一天（分摊，不删除）；
 *   学习队列不限量（新词按用户要求不设每日上限）。
 */
import { useSyncExternalStore } from 'react';
import { MAO_KIND_WEIGHTS, type MaoKind, type MaoQuestion } from '../content/maogai';

/** 学习中学会所需连续答对次数 */
export const LEARN_STREAK = 3;
/** 复习间隔下限（天） */
export const MIN_INTERVAL = 1;
/** 复习间隔上限（天） */
export const MAX_INTERVAL = 90;
/** 连续答对达到该次数且间隔达上限 → 毕业（已掌握，移出常规队列） */
export const MASTER_STREAK = 5;
/** 连续失败止损阈值：达到后间隔不再压到最小，放宽到 SLOW_FAIL_INTERVAL */
export const FAIL_CAP = 4;
/** 止损间隔（天）：连续失败过多的薄弱词降低推送频率 */
export const SLOW_FAIL_INTERVAL = 3;
/** 单日复习保护上限：到期池超过该数量时溢出部分顺延一天 */
export const REVIEW_DAILY_CAP = 150;

const DAY = 86_400_000;
export const STORE_KEY = 'hb-maoquiz-v1';

export interface CardRec {
  /** 0 学习中 / 1 复习中 / 2 薄弱 / 3 毕业 */
  st: 0 | 1 | 2 | 3;
  /** 连续答对次数（学习中满 LEARN_STREAK 学会；复习中决定增长系数；答对才增长） */
  streak: number;
  /** 当前连续失败次数（答对清零；复习中决定降级档位与止损） */
  fails: number;
  /** 当前复习间隔（天；学习中的卡为 0） */
  ivl: number;
  due: number;
  /** 累计作答次数（统计指标，不作为停止条件） */
  rv: number;
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

/** 旧账迁移：第一版 {s,k,w,due} → 新四态（间隔表折算成 ivl；w 为累计错次，不并入连续失败） */
const STAGE_TABLE = [1, 2, 4, 7, 15, 30, 60];
const normalizeRec = (r: Record<string, unknown>): CardRec => {
  const s = typeof r.s === 'number' ? r.s : undefined;
  if (s !== undefined) {
    if (s === 0) return { st: 0, streak: typeof r.k === 'number' ? r.k : 0, fails: 0, ivl: 0, due: Number(r.due) || 0, rv: 0 };
    if (s >= 8) return { st: 3, streak: 0, fails: 0, ivl: 60, due: Number.MAX_SAFE_INTEGER, rv: 0 };
    return { st: 1, streak: 0, fails: 0, ivl: STAGE_TABLE[s - 1] ?? 2, due: Number(r.due) || 0, rv: 0 };
  }
  return {
    st: (r.st as CardRec['st']) ?? 0,
    streak: typeof r.streak === 'number' ? r.streak : 0,
    fails: typeof r.fails === 'number' ? r.fails : 0,
    ivl: typeof r.ivl === 'number' ? r.ivl : 0,
    due: typeof r.due === 'number' ? r.due : 0,
    rv: typeof r.rv === 'number' ? r.rv : 0,
  };
};

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
        for (const [id, rec] of Object.entries(parsed.cards)) cards[id] = normalizeRec(rec as unknown as Record<string, unknown>);
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

/* ------------------------------------------------ 分支规则（纯函数，供测试） */

/**
 * 增长系数修正：连对越多放大越高（1.7 → 2.0）；
 * 反应时长：≤3s 全额，3–8s 打 85 折，>8s（犹豫）与 <1s（蒙对）打 6 折；
 * 题型权重：填空置信度最高（拉更长），判断题最低。
 */
const growthFactor = (streak: number, elapsedMs: number, kind: MaoKind): number => {
  const base = 1.6 + 0.1 * Math.min(streak, 4);
  const time = elapsedMs <= 1000 ? 0.5 : elapsedMs <= 3000 ? 1 : elapsedMs <= 8000 ? 0.85 : 0.6;
  return 1 + (base - 1) * time * (MAO_KIND_WEIGHTS[kind] ?? 1);
};

/** 记住一次：ivl 放大并封顶；达到上限且连对足够 → 毕业 */
const growInterval = (rec: CardRec, elapsedMs: number, kind: MaoKind): CardRec => {
  const ivl = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, Math.round(rec.ivl * growthFactor(rec.streak, elapsedMs, kind))));
  const mastered = rec.ivl >= MAX_INTERVAL && rec.streak >= MASTER_STREAK;
  return { ...rec, st: mastered ? 3 : 1, ivl: mastered ? rec.ivl : ivl };
};

/** 忘一次（复习阶段）：阶梯降级 + 连续失败止损 */
const degradeInterval = (rec: CardRec): CardRec => {
  const fails = rec.fails + 1;
  const ivl = fails >= FAIL_CAP
    ? SLOW_FAIL_INTERVAL
    : fails === 1
      ? Math.max(MIN_INTERVAL, Math.round(rec.ivl / 2))
      : MIN_INTERVAL;
  return { ...rec, st: 2, fails, streak: 0, ivl, due: 0 };
};

/** 对一道题记一次作答结果，返回新账（不改入参）；elapsedMs 为本题作答用时（反应时长修正） */
export function applyGrade(state: MaoState, qid: string, good: boolean, elapsedMs: number, kind: MaoKind, now: number): MaoState {
  const prev = state.cards[qid];
  const cards = { ...state.cards };
  const today = dayStart(now);
  let rec: CardRec;

  if (!prev || prev.st === 0) {
    // —— 学习中（含新卡）——
    // 本学习期是否答错过：答对会清零 fails，用 累计作答 - 当前连对 判断（迁移账 rv 可能为 0，兜底看 fails）
    const hadFail = (prev ? prev.rv - prev.streak : 0) > 0 || (prev?.fails ?? 0) > 0;
    const streak = good ? (prev?.streak ?? 0) + 1 : 0;
    const fails = good ? 0 : (prev?.fails ?? 0) + 1;
    if (streak >= LEARN_STREAK) {
      // 学会：错过的明天首复习，零错的后天首复习
      const ivl = hadFail ? 1 : 2;
      rec = { st: 1, streak, fails: 0, ivl, due: today + ivl * DAY, rv: (prev?.rv ?? 0) + 1 };
    } else {
      // 未学会：留在当日学习队列（百词斩式本轮/次日重现）
      rec = { st: 0, streak, fails, ivl: 0, due: today, rv: (prev?.rv ?? 0) + 1 };
    }
  } else if (good) {
    // —— 复习/薄弱答对 ——：连对计数、fails 清零，恢复常规复习并放大间隔
    rec = growInterval({ ...prev, st: 1, streak: prev.streak + 1, fails: 0, rv: prev.rv + 1 }, elapsedMs, kind);
    rec = { ...rec, due: today + rec.ivl * DAY };
  } else {
    // —— 复习/薄弱答错（含看答案）——：切薄弱池、阶梯降级；已提前作答的保留原到期日起算
    rec = degradeInterval({ ...prev, rv: prev.rv + 1 });
    rec = { ...rec, due: Math.max(today, prev.due) + rec.ivl * DAY };
  }
  cards[qid] = rec;
  return { ...state, cards };
}

/**
 * 复习候选池：st1/st2 且到期。
 * 优先级：薄弱（st2）> 刚学不久（ivl ≤ 3）> 长期熟词；同档按到期先后。
 */
export function reviewPool(bank: readonly MaoQuestion[], state: MaoState, now: number): MaoQuestion[] {
  const rank = (rec: CardRec): number => (rec.st === 2 ? 0 : rec.ivl <= 3 ? 1 : 2);
  return bank
    .filter((q) => {
      const rec = state.cards[q.id];
      return rec && (rec.st === 1 || rec.st === 2) && rec.due <= now;
    })
    .sort((a, b) => {
      const ra = rank(state.cards[a.id]);
      const rb = rank(state.cards[b.id]);
      return ra - rb || state.cards[a.id].due - state.cards[b.id].due || a.id.localeCompare(b.id);
    });
}

/**
 * 复习队列（流量控制）：候选池超过 REVIEW_DAILY_CAP 时，溢出部分 due 顺延一天
 * （分摊不删除，断档不一次性炸任务）。返回当期队列与顺延后的新账；无溢出时原账返回。
 */
export function takeReviewQueue(
  bank: readonly MaoQuestion[],
  state: MaoState,
  now: number,
): { queue: MaoQuestion[]; state: MaoState } {
  const pool = reviewPool(bank, state, now);
  if (pool.length <= REVIEW_DAILY_CAP) return { queue: pool, state };
  const queue = pool.slice(0, REVIEW_DAILY_CAP);
  const tomorrow = dayStart(now) + DAY;
  const cards = { ...state.cards };
  for (const q of pool.slice(REVIEW_DAILY_CAP)) cards[q.id] = { ...cards[q.id], due: tomorrow };
  return { queue, state: { ...state, cards } };
}

/** 学习队列：未学新卡 + 学习中的卡，按题库顺序（不限量——新词不设每日上限） */
export function learnQueue(bank: readonly MaoQuestion[], state: MaoState): MaoQuestion[] {
  return bank.filter((q) => {
    const rec = state.cards[q.id];
    return !rec || rec.st === 0;
  });
}

/** 总览统计 */
export function countsOf(bank: readonly MaoQuestion[], state: MaoState, now: number) {
  let learned = 0;
  let learning = 0;
  let weak = 0;
  let graduated = 0;
  for (const q of bank) {
    const rec = state.cards[q.id];
    if (!rec) continue;
    learned += 1;
    if (rec.st === 0) learning += 1;
    else if (rec.st === 2) weak += 1;
    else if (rec.st === 3) graduated += 1;
  }
  return {
    total: bank.length,
    learned,
    learning,
    weak,
    graduated,
    due: reviewPool(bank, state, now).length,
    fresh: bank.filter((q) => !state.cards[q.id]).length,
  };
}

/** 写入一次作答结果（订阅者自动刷新） */
export function gradeCard(qid: string, good: boolean, elapsedMs: number, kind: MaoKind): void {
  persist(applyGrade(getSnapshot(), qid, good, elapsedMs, kind, Date.now()));
}

/** 复习溢出顺延落盘（进复习页时调用；无溢出为空操作） */
export function deferOverflow(state: MaoState): void {
  if (state !== getSnapshot()) persist(state);
}

/** 清空背题账 */
export function resetMaoState(): void {
  persist(emptyState());
}

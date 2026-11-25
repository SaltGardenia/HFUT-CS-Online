/**
 * 合并规则（纯函数，便于测试）：
 * - 每条记录独立比较本地时间戳与云端 updated_at，新者胜；
 * - 不同题目直接并集，互不覆盖；
 * - 删除用墓碑参与比较，避免「本机清空后被云端旧数据复活」；
 * - 首次登录前的本地数据没有时间戳，调用方先补成「现在」再合并（本机进度上传）。
 */
import type {
  FavoriteMeta,
  ProgressMap,
  ProgressMeta,
  ReadingEntry,
  ReadingMap,
  RemoteFavoriteRow,
  RemoteProgressRow,
  RemoteReadingRow,
  RemoteRecentRow,
  RecentMeta,
} from './types';

export interface ProgressPushDraft {
  question_id: string;
  result: string | null;
  /** 毫秒时间戳 */
  t: number;
}

export interface MergeProgressResult {
  map: ProgressMap;
  meta: ProgressMeta;
  push: ProgressPushDraft[];
}

const ts = (iso: string): number => {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
};

export function mergeProgress(
  local: ProgressMap,
  meta: ProgressMeta,
  remote: RemoteProgressRow[],
): MergeProgressResult {
  const remoteById = new Map(remote.map((r) => [r.question_id, r]));
  const map: ProgressMap = {};
  const nextMeta: ProgressMeta = {};
  const push: ProgressPushDraft[] = [];
  const ids = new Set([...Object.keys(local), ...Object.keys(meta), ...remoteById.keys()]);

  for (const qid of ids) {
    const stamp = meta[qid];
    const remoteRow = remoteById.get(qid);
    const hasLocalValue = local[qid] !== undefined;
    const hasLocal = hasLocalValue || (stamp != null && stamp.r === null);
    const localValue: string | null | undefined = hasLocalValue ? local[qid] : stamp?.r;
    // 没有时间戳的本地值会在调用前被补戳；这里兜底为 epoch（可插入、不会覆盖云端）
    const localT = stamp ? stamp.t : hasLocal ? 0 : -Infinity;
    const remoteT = remoteRow ? ts(remoteRow.updated_at) : -Infinity;

    if (!hasLocal && !remoteRow) continue;

    let value: string | null | undefined;
    let t: number;
    let localWins = false;

    if (hasLocal && (!remoteRow || localT >= remoteT)) {
      value = localValue;
      t = localT;
      localWins = true;
    } else if (remoteRow) {
      value = remoteRow.result;
      t = remoteT;
    } else {
      continue;
    }

    if (value === null || value === undefined) {
      nextMeta[qid] = { t, r: null };
    } else {
      map[qid] = value;
      nextMeta[qid] = { t, r: value };
    }

    if (localWins && (!remoteRow || remoteRow.result !== (localValue ?? null))) {
      push.push({ question_id: qid, result: localValue ?? null, t });
    }
  }

  return { map, meta: nextMeta, push };
}

export interface FavoritePushDraft {
  course: string;
  favorited: boolean;
  t: number;
}

export interface MergeFavoritesResult {
  /** 已收藏的课程 slug，按收藏时间倒序 */
  on: string[];
  meta: FavoriteMeta;
  push: FavoritePushDraft[];
}

/** 课程 slug → 收藏时间戳；本地 list 里的顺序只用于展示，合并以时间戳为准 */
export function mergeFavorites(
  localOn: Set<string>,
  localMeta: FavoriteMeta,
  remote: RemoteFavoriteRow[],
  now: number,
): MergeFavoritesResult {
  const remoteBy = new Map(remote.map((r) => [r.course, r]));
  const nextMeta: FavoriteMeta = {};
  const push: FavoritePushDraft[] = [];
  const ids = new Set([...localOn, ...Object.keys(localMeta), ...remoteBy.keys()]);
  const winners: { course: string; t: number }[] = [];

  for (const course of ids) {
    const stamp = localMeta[course];
    const remoteRow = remoteBy.get(course);
    const hasLocal = localOn.has(course) || stamp != null;
    const localOnValue = localOn.has(course);
    const localT = stamp ? stamp.t : hasLocal ? now : -Infinity;
    const remoteT = remoteRow ? ts(remoteRow.updated_at) : -Infinity;

    let on: boolean;
    let t: number;
    let localWins = false;

    if (hasLocal && (!remoteRow || localT >= remoteT)) {
      on = localOnValue;
      t = localT;
      localWins = true;
    } else if (remoteRow) {
      on = remoteRow.favorited;
      t = remoteT;
    } else {
      continue;
    }

    nextMeta[course] = { t, on };
    if (on) winners.push({ course, t });
    if (localWins && (!remoteRow || remoteRow.favorited !== on)) {
      // 未收藏且云端从未有过该行时无需上传
      if (!(on === false && !remoteRow)) push.push({ course, favorited: on, t });
    }
  }

  winners.sort((a, b) => b.t - a.t);
  return { on: winners.map((w) => w.course), meta: nextMeta, push };
}

export interface RecentPushDraft {
  course: string;
  t: number;
}

export interface MergeRecentResult {
  /** 课程 slug，最近查看在前 */
  list: string[];
  meta: RecentMeta;
  push: RecentPushDraft[];
}

export function mergeRecent(
  localList: string[],
  localMeta: RecentMeta,
  remote: RemoteRecentRow[],
  now: number,
  limit: number,
): MergeRecentResult {
  const remoteBy = new Map(remote.map((r) => [r.course, r]));
  const meta: RecentMeta = {};
  const push: RecentPushDraft[] = [];
  const ids = new Set([...localList, ...Object.keys(localMeta), ...remoteBy.keys()]);

  for (const course of ids) {
    const inLocalList = localList.includes(course);
    const localT = localMeta[course] ?? (inLocalList ? now : -Infinity);
    const remoteRow = remoteBy.get(course);
    const remoteT = remoteRow ? ts(remoteRow.viewed_at) : -Infinity;
    if (localT === -Infinity && remoteT === -Infinity) continue;

    if (localT >= remoteT) {
      meta[course] = localT;
      if (localT > remoteT) push.push({ course, t: localT });
    } else {
      meta[course] = remoteT;
    }
  }

  const list = Object.entries(meta)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([course]) => course);

  return { list, meta, push };
}

export interface ReadingPushDraft {
  page: string;
  entry: ReadingEntry;
}

export interface MergeReadingResult {
  map: ReadingMap;
  push: ReadingPushDraft[];
}

/**
 * 阅读进度合并：同一页取时间较新的一份（页路径唯一，天然按页并行）。
 * 本地较新或有本地无云端时回传；云端较新则覆盖本机。
 */
export function mergeReading(local: ReadingMap, remote: RemoteReadingRow[]): MergeReadingResult {
  const remoteBy = new Map(remote.map((r) => [r.page, r]));
  const map: ReadingMap = {};
  const push: ReadingPushDraft[] = [];
  const pages = new Set([...Object.keys(local), ...remoteBy.keys()]);

  for (const page of pages) {
    const localEntry = local[page];
    const remoteRow = remoteBy.get(page);
    const localT = localEntry && Number.isFinite(localEntry.t) ? localEntry.t : -Infinity;
    const remoteT = remoteRow ? ts(remoteRow.updated_at) : -Infinity;

    if (localEntry && localT >= remoteT) {
      map[page] = localEntry;
      if (!remoteRow || localT > remoteT) push.push({ page, entry: localEntry });
    } else if (remoteRow) {
      map[page] = {
        c: remoteRow.course,
        y: Math.max(0, remoteRow.scroll_y ?? 0),
        p: Math.min(1, Math.max(0, remoteRow.percent ?? 0)),
        s: remoteRow.section ?? undefined,
        t: remoteT,
      };
    }
  }

  return { map, push };
}


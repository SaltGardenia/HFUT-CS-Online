/**
 * 本地存储层：所有「用户数据」的读写都从这里走。
 * - 页面仍然先写 localStorage（离线可用、刷新不丢）；
 * - 这里额外维护每题时间戳与脏标记，供 SyncManager 增量同步；
 * - 通过订阅机制，云端合并结果能即时推给已挂载的页面。
 */
import {
  DEVICE_KEY,
  FAVORITE_META_KEY,
  FAVORITES_KEY,
  PROGRESS_STORES,
  QMARKS_PREFIX,
  READING_KEY,
  RECENT_KEY,
  RECENT_META_KEY,
  progressMetaKey,
  qmarksKey,
} from './keys';
import type {
  CourseQMarks,
  FavoriteMeta,
  FavoriteStamp,
  ProgressMap,
  ProgressMeta,
  ProgressStamp,
  ProgressValue,
  QMarkKind,
  QMarkMeta,
  ReadingEntry,
  ReadingMap,
  RecentMeta,
} from './types';

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
let crossTabBound = false;

function bindCrossTab() {
  if (crossTabBound || typeof window === 'undefined') return;
  crossTabBound = true;
  // 其他标签页 / 设备窗口写入时，浏览器只会给本页抛 storage 事件
  window.addEventListener('storage', (e) => {
    if (e.key) notifyStore(e.key);
  });
}

export function notifyStore(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

export function subscribeStore(key: string, fn: Listener): () => void {
  bindCrossTab();
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) listeners.delete(key);
  };
}

export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, raw: string, notify = true) {
  try {
    localStorage.setItem(key, raw);
  } catch {
    /* 隐私模式 / 配额不足：静默降级为会话内记忆 */
    return;
  }
  if (notify) notifyStore(key);
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  if (!raw) return fallback;
  try {
    const value = JSON.parse(raw) as T;
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function sameJSON(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ------------------------------------------------------------------ 进度 */

export interface DirtyEvent {
  kind: 'progress' | 'favorite' | 'recent' | 'reading' | 'qmarks';
  /** progress：发生变化的进度存储键 */
  key?: string;
  /** progress：发生变化的题目 id */
  qids?: string[];
  /** reading：发生变化的页面路径 */
  page?: string;
  /** qmarks：发生变化的课程 slug */
  course?: string;
}

let dirtyListener: ((e: DirtyEvent) => void) | null = null;

/** SyncManager 注册脏数据监听（其他模块不直接用） */
export function setDirtyListener(fn: ((e: DirtyEvent) => void) | null) {
  dirtyListener = fn;
}

function emitDirty(e: DirtyEvent) {
  dirtyListener?.(e);
}

/** 只接受普通对象：手改/旧版本留下的数组、数字、字符串一律视为损坏数据 */
function readRecord<T>(key: string): Record<string, T> {
  const value = readJSON<unknown>(key, {});
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as Record<string, T>;
}

export function readProgress(key: string): ProgressMap {
  return readRecord<ProgressValue>(key);
}

export function readProgressMeta(key: string): ProgressMeta {
  return readRecord<ProgressStamp>(progressMetaKey(key));
}

function writeProgressMeta(key: string, meta: ProgressMeta) {
  if (Object.keys(meta).length === 0) {
    try {
      localStorage.removeItem(progressMetaKey(key));
    } catch {
      /* ignore */
    }
    return;
  }
  writeRaw(progressMetaKey(key), JSON.stringify(meta), false);
}

/**
 * 页面写入整份进度映射：与旧值做差，给变化的题目打时间戳并上报脏数据。
 * 返回本次变化的题目 id。
 */
export function writeProgress(key: string, map: ProgressMap): string[] {
  const prev = readProgress(key);
  const meta = readProgressMeta(key);
  const now = Date.now();
  const changed: string[] = [];
  const ids = new Set([...Object.keys(prev), ...Object.keys(meta), ...Object.keys(map)]);

  for (const qid of ids) {
    const before = prev[qid];
    const after = map[qid];
    if (before === after) continue;
    meta[qid] = { t: now, r: after ?? null };
    changed.push(qid);
  }

  const changedData = !sameJSON(prev, map);
  if (changedData) writeRaw(key, JSON.stringify(map));
  if (changed.length > 0) {
    writeProgressMeta(key, meta);
    emitDirty({ kind: 'progress', key, qids: changed });
  }
  return changed;
}

/**
 * 清掉指定题目（或 `${paperId}:${qid}`）的作答记录，同表里其它试卷、其它题原样保留。
 * 与页面作答走同一条写入路径，所以被清掉的题会留下 `r: null` 墓碑，账号同步能跟着删。
 */
export function clearProgress(key: string, ids: readonly string[]): string[] {
  const map = readProgress(key);
  let hit = false;
  for (const id of ids) {
    if (!(id in map)) continue;
    delete map[id];
    hit = true;
  }
  if (!hit) return [];
  return writeProgress(key, map);
}

/** 清掉整份进度表（本课全部试卷）；旧版本残留的 id 也一起清，同样留墓碑 */
export function clearProgressStore(key: string): string[] {
  return clearProgress(key, Object.keys(readProgress(key)));
}

/** 首次登录前就存在的本地作答没有时间戳：补成「现在」，视为本机最新进度上传。 */
export function ensureProgressStamps(key: string): string[] {
  const map = readProgress(key);
  const meta = readProgressMeta(key);
  const now = Date.now();
  const stamped: string[] = [];
  for (const [qid, value] of Object.entries(map)) {
    if (meta[qid]) continue;
    meta[qid] = { t: now, r: value };
    stamped.push(qid);
  }
  if (stamped.length > 0) writeProgressMeta(key, meta);
  return stamped;
}

/** 云端合并结果落盘（不产生脏标记，避免回声） */
export function applyProgress(key: string, map: ProgressMap, meta: ProgressMeta) {
  if (!sameJSON(readProgress(key), map)) writeRaw(key, JSON.stringify(map));
  if (!sameJSON(readProgressMeta(key), meta)) writeProgressMeta(key, meta);
}

/* ---------------------------------------------------------------- 收藏 */

export function readFavorites(): string[] {
  const raw = readJSON<unknown>(FAVORITES_KEY, []);
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
}

export function readFavoriteMeta(): FavoriteMeta {
  return readJSON<FavoriteMeta>(FAVORITE_META_KEY, {});
}

export function writeFavorites(list: string[], meta: FavoriteMeta) {
  if (!sameJSON(readFavorites(), list)) writeRaw(FAVORITES_KEY, JSON.stringify(list));
  writeRaw(FAVORITE_META_KEY, JSON.stringify(meta), false);
}

/** 首次登录前已收藏的课程补时间戳（视为本机最新，参与合并上传） */
export function ensureFavoriteStamps(): string[] {
  const list = readFavorites();
  const meta = readFavoriteMeta();
  const now = Date.now();
  const stamped: string[] = [];
  for (const name of list) {
    if (meta[name]) continue;
    meta[name] = { t: now, on: true };
    stamped.push(name);
  }
  if (stamped.length > 0) writeRaw(FAVORITE_META_KEY, JSON.stringify(meta), false);
  return stamped;
}

export function setFavorite(name: string, on: boolean) {
  const list = readFavorites().filter((n) => n !== name);
  if (on) list.unshift(name);
  const meta = readFavoriteMeta();
  meta[name] = { t: Date.now(), on } satisfies FavoriteStamp;
  writeFavorites(list, meta);
  emitDirty({ kind: 'favorite' });
}

/* ------------------------------------------------- 题目标记（收藏本/错题本） */

/** 校验一本账：只接受 { qid: { t: number, on: boolean } } 形状的手工损坏防护 */
function readQMarkMeta(raw: unknown): QMarkMeta {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const meta: QMarkMeta = {};
  for (const [qid, stamp] of Object.entries(raw as Record<string, unknown>)) {
    if (!stamp || typeof stamp !== 'object') continue;
    const { t, on } = stamp as { t?: unknown; on?: unknown };
    if (typeof t !== 'number' || !Number.isFinite(t) || typeof on !== 'boolean') continue;
    meta[qid] = { t, on };
  }
  return meta;
}

/** 本机记过账的全部课程 slug（按 localStorage 键前缀发现，无需登记表） */
export function qmarkCourses(): string[] {
  const courses: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(QMARKS_PREFIX)) courses.push(key.slice(QMARKS_PREFIX.length));
    }
  } catch {
    /* ignore */
  }
  return courses;
}

export function readQMarks(course: string): CourseQMarks {
  const value = readJSON<unknown>(qmarksKey(course), {});
  const record =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return { fav: readQMarkMeta(record.fav), wrong: readQMarkMeta(record.wrong) };
}

/** 写一道题的标记并上报脏数据；同态重写不落盘、不触发同步 */
export function setQMark(course: string, kind: QMarkKind, qid: string, on: boolean) {
  const marks = readQMarks(course);
  const prev = marks[kind][qid];
  if (prev && prev.on === on) return;
  marks[kind][qid] = { t: Date.now(), on };
  writeRaw(qmarksKey(course), JSON.stringify(marks));
  emitDirty({ kind: 'qmarks', course });
}

/** 一键清空一本账（错题本/收藏本）：全部改为墓碑，云端同样会同步删除 */
export function clearQMarks(course: string, kind: QMarkKind) {
  const marks = readQMarks(course);
  const ids = Object.keys(marks[kind]).filter((id) => marks[kind][id]?.on);
  if (!ids.length) return;
  const t = Date.now();
  for (const id of ids) marks[kind][id] = { t, on: false };
  writeRaw(qmarksKey(course), JSON.stringify(marks));
  emitDirty({ kind: 'qmarks', course });
}

/** 云端合并结果落盘（不产生脏标记，避免回声） */
export function applyQMarks(course: string, marks: CourseQMarks) {
  if (!sameJSON(readQMarks(course), marks)) writeRaw(qmarksKey(course), JSON.stringify(marks));
}

/** 一门课是否记过任何账（含墓碑）；登录时用它决定哪些课要参与上传 */
export function hasAnyQMark(course: string): boolean {
  const marks = readQMarks(course);
  return Object.keys(marks.fav).length > 0 || Object.keys(marks.wrong).length > 0;
}

/* ------------------------------------------------------------ 最近查看 */

const RECENT_MAX = 8;

export function readRecent(): string[] {
  const raw = readJSON<unknown>(RECENT_KEY, []);
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
}

export function readRecentMeta(): RecentMeta {
  return readJSON<RecentMeta>(RECENT_META_KEY, {});
}

export function writeRecent(list: string[], meta: RecentMeta) {
  if (!sameJSON(readRecent(), list)) writeRaw(RECENT_KEY, JSON.stringify(list));
  writeRaw(RECENT_META_KEY, JSON.stringify(meta), false);
}

export function ensureRecentStamps(): string[] {
  const list = readRecent();
  const meta = readRecentMeta();
  const now = Date.now();
  const stamped: string[] = [];
  // 列表是 MRU 顺序：越靠前越新
  list.forEach((name, i) => {
    if (meta[name] != null) return;
    meta[name] = now - i * 1000;
    stamped.push(name);
  });
  if (stamped.length > 0) writeRaw(RECENT_META_KEY, JSON.stringify(meta), false);
  return stamped;
}

export function recordRecent(name: string) {
  const list = [name, ...readRecent().filter((n) => n !== name)].slice(0, RECENT_MAX);
  const meta = readRecentMeta();
  meta[name] = Date.now();
  writeRecent(list, meta);
  emitDirty({ kind: 'recent' });
}

/* ------------------------------------------------------------ 阅读进度 */

/** 只保留最近 200 页：长期使用也不会把 localStorage 撑大 */
const READING_MAX = 200;

export function readReading(): ReadingMap {
  return readRecord<ReadingEntry>(READING_KEY);
}

function sameReading(a: ReadingEntry, b: ReadingEntry): boolean {
  return (
    Math.abs(a.y - b.y) < 12 &&
    Math.abs(a.p - b.p) < 0.002 &&
    (a.s ?? '') === (b.s ?? '')
  );
}

/** 写一页的阅读进度；位置没变时不落盘、也不产生同步脏数据 */
export function writeReading(page: string, entry: ReadingEntry): boolean {
  const all = readReading();
  const prev = all[page];
  if (prev && sameReading(prev, entry)) return false;
  all[page] = entry;

  const pages = Object.keys(all);
  if (pages.length > READING_MAX) {
    pages
      .sort((a, b) => (all[b]?.t ?? 0) - (all[a]?.t ?? 0))
      .slice(READING_MAX)
      .forEach((p) => delete all[p]);
  }

  writeRaw(READING_KEY, JSON.stringify(all));
  emitDirty({ kind: 'reading', page });
  return true;
}

/** 云端合并结果落盘（不产生脏标记，避免回声） */
export function applyReading(map: ReadingMap) {
  if (sameJSON(readReading(), map)) return;
  writeRaw(READING_KEY, JSON.stringify(map));
}

/* ---------------------------------------------------------------- 设备 */

/**
 * 本机缓存上次登录的账号：换账号登录时清掉上一位用户留在本机的缓存，
 * 避免把 A 的进度上传进 B 的账号（云端仍保留 A 的数据）。
 */
const OWNER_KEY = 'hb-local-owner';

export function readOwner(): string | null {
  return readRaw(OWNER_KEY);
}

export function writeOwner(userId: string) {
  writeRaw(OWNER_KEY, userId, false);
}

/** 清空本机用户数据（进度、收藏、最近查看、题目两本账及其时间戳），用于切换账号 */
export function clearUserData() {
  for (const store of PROGRESS_STORES) {
    writeRaw(store.key, '{}');
    try {
      localStorage.removeItem(progressMetaKey(store.key));
    } catch {
      /* ignore */
    }
  }
  writeRaw(FAVORITES_KEY, '[]');
  writeRaw(RECENT_KEY, '[]');
  writeRaw(READING_KEY, '{}');
  for (const course of qmarkCourses()) {
    try {
      localStorage.removeItem(qmarksKey(course));
    } catch {
      /* ignore */
    }
  }
  try {
    localStorage.removeItem(FAVORITE_META_KEY);
    localStorage.removeItem(RECENT_META_KEY);
  } catch {
    /* ignore */
  }
}

export function getDeviceId(): string {
  let id: string | null = null;
  try {
    id = localStorage.getItem(DEVICE_KEY);
  } catch {
    id = null;
  }
  if (id) return id;
  id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  writeRaw(DEVICE_KEY, id, false);
  return id;
}

/** 读取某道题的本地时间戳（测试与同步管理器使用） */
export function progressStampOf(key: string, qid: string): ProgressStamp | undefined {
  return readProgressMeta(key)[qid];
}

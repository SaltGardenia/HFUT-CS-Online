/** 同步层共用的数据形状（本地与云端两侧都按这些结构走） */

export type ProgressValue = string;

export type ProgressMap = Record<string, ProgressValue>;

/** 单题本地时间戳；r 为 null 表示「已清空」的墓碑 */
export interface ProgressStamp {
  t: number;
  r: ProgressValue | null;
}

export type ProgressMeta = Record<string, ProgressStamp>;

export interface FavoriteStamp {
  t: number;
  on: boolean;
}

export type FavoriteMeta = Record<string, FavoriteStamp>;

/** 最近查看：课程名 → 最近一次查看时间（毫秒） */
export type RecentMeta = Record<string, number>;

/**
 * 阅读进度：一页一条，本地键是路由 pathname（如 `/algo/deck/deck3`）。
 * y 用于同设备精确恢复，p（0~1）用于跨设备换算（屏幕尺寸不同）。
 */
export interface ReadingEntry {
  /** 课程 slug（路由首段，与云端 course 字段一致） */
  c: string;
  /** 滚动位置（px） */
  y: number;
  /** 页面进度 0~1 */
  p: number;
  /** 最近的小节标题 */
  s?: string;
  /** 本地更新时间（毫秒） */
  t: number;
}

export type ReadingMap = Record<string, ReadingEntry>;

export interface RemoteProgressRow {
  course: string;
  question_id: string;
  result: string | null;
  updated_at: string;
}

export interface RemoteFavoriteRow {
  course: string;
  favorited: boolean;
  updated_at: string;
}

export interface RemoteRecentRow {
  course: string;
  viewed_at: string;
}

export interface RemoteReadingRow {
  course: string;
  page: string;
  scroll_y: number;
  percent: number;
  section: string | null;
  updated_at: string;
}

export interface PushReadingRow extends RemoteReadingRow {
  device_id: string;
}

export interface PushProgressRow {
  course: string;
  question_id: string;
  result: string | null;
  updated_at: string;
  device_id: string;
}

export interface PushFavoriteRow {
  course: string;
  favorited: boolean;
  updated_at: string;
}

export interface PushRecentRow {
  course: string;
  viewed_at: string;
}

export interface PushPayload {
  progress: PushProgressRow[];
  favorites: PushFavoriteRow[];
  recent: PushRecentRow[];
  reading: PushReadingRow[];
}

export interface SyncUser {
  id: string;
  email: string | null;
}

export type SyncStatus = 'disabled' | 'guest' | 'syncing' | 'synced' | 'offline' | 'error';

export interface SyncState {
  /** 是否配置了 Supabase 环境变量（未配置时账号入口整体隐藏） */
  enabled: boolean;
  /** 是否已完成会话检查 */
  ready: boolean;
  status: SyncStatus;
  user: SyncUser | null;
  lastSyncedAt: number | null;
  error: string | null;
}

/**
 * 同步范围登记：哪些 localStorage 键属于「用户数据」。
 * 新增课程练习页时，把它的进度键登记到这里，账号同步才会覆盖它。
 */
import { courses } from '../../courses/registry';

export interface ProgressStore {
  /** localStorage 键 */
  key: string;
  /** 云端 course 字段（课程路由 slug，稳定不变） */
  course: string;
}

export const PROGRESS_STORES: readonly ProgressStore[] = [
  { key: 'practice-progress-v1', course: 'algo' },
  { key: 'os-practice-progress-v1', course: 'os' },
  { key: 'net-practice-progress-v1', course: 'net' },
  { key: 'pat-practice-progress-v1', course: 'pat' },
  { key: 'ai-practice-progress-v1', course: 'ai' },
  { key: 'ca-practice-progress-v1', course: 'ca' },
  { key: 'math-practice-progress-v1', course: 'math' },
  { key: 'db-practice-progress-v1', course: 'db' },
  { key: 'se-practice-progress-v1', course: 'se' },
  { key: 'st-practice-progress-v1', course: 'st' },
  { key: 'phys-practice-progress-v1', course: 'phys' },
  { key: 'dm-practice-progress-v1', course: 'dm' },
  { key: 'asm-practice-progress-v1', course: 'asm' },
  { key: 'eda-practice-progress-v1', course: 'eda' },
  { key: 'py-practice-progress-v1', course: 'py' },
  { key: 'cm-practice-progress-v1', course: 'cm' },
  { key: 'prob-practice-progress-v1', course: 'prob' },
  { key: 'res-practice-progress-v1', course: 'res' },
  { key: 'physlab-practice-progress-v1', course: 'physlab' },
  { key: 'la-practice-progress-v1', course: 'la' },
  { key: 'ds-practice-progress-v1', course: 'ds' },
  { key: 'ee-practice-progress-v1', course: 'ee' },
];

const byKey = new Map(PROGRESS_STORES.map((s) => [s.key, s]));

export function progressStoreOf(key: string): ProgressStore | undefined {
  return byKey.get(key);
}

export const FAVORITES_KEY = 'hb-favorite-courses';
export const RECENT_KEY = 'hb-recent-courses';
export const READING_KEY = 'hb-reading-v1';
export const DEVICE_KEY = 'hb-device-id';

/** 进度时间戳（与数据分开存，不改动页面已有的数据格式） */
export const progressMetaKey = (storeKey: string) => `hb-progress-meta:${storeKey}`;
export const FAVORITE_META_KEY = 'hb-favorite-meta';
export const RECENT_META_KEY = 'hb-recent-meta';

/** 课程名（收藏/最近查看用）→ 路由 slug（云端用） */
export function courseSlugByName(name: string): string {
  const c = courses.find((x) => x.name === name);
  return c ? c.base.replace(/^\/+/, '') || 'hub' : name;
}

/** 路由 slug → 课程名（云端数据回到本机时用） */
export function courseNameBySlug(slug: string): string | undefined {
  return courses.find((x) => x.base.replace(/^\/+/, '') === slug)?.name;
}

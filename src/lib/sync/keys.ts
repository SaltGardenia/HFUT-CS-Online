/**
 * 同步范围登记：哪些 localStorage 键属于「用户数据」。
 * 新增课程练习页时，把它的进度键登记到这里，账号同步才会覆盖它。
 */
import { courses } from '../../courses/registry';
import { QUIZ_COURSES } from '../../content/quizbank';

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

/** 题目收藏/错题本：一门课一份账（收藏本 + 错题本），键里带课程 slug 划数据边界 */
export const QMARKS_PREFIX = 'hb-qmarks:';
export const qmarksKey = (course: string) => `${QMARKS_PREFIX}${course}`;

/** 学习通题库背题账（每门课一份排期表，键里带课程 slug） */
export const QUIZ_CARDS_PREFIX = 'hb-maquiz:';
export const quizCardsKey = (course: string) => `${QUIZ_CARDS_PREFIX}${course}`;
/** 背题账的云端 course 字段：`quiz/<slug>`，与收藏/最近查看的题库课程 slug 同一命名 */
export const quizCloudCourse = (slug: string) => `quiz/${slug}`;
/** 云端 course → 本地课程 slug（非题库课程返回 undefined） */
export function quizSlugOfCloudCourse(course: string): string | undefined {
  return course.startsWith('quiz/') ? course.slice(5) : undefined;
}

/** 进度时间戳（与数据分开存，不改动页面已有的数据格式） */
export const progressMetaKey = (storeKey: string) => `hb-progress-meta:${storeKey}`;
export const FAVORITE_META_KEY = 'hb-favorite-meta';
export const RECENT_META_KEY = 'hb-recent-meta';

const QUIZ_NAME_BY_SLUG = new Map(QUIZ_COURSES.map((c) => [c.slug, c.name]));

/** 课程名（收藏/最近查看用）→ 云端 slug：
 *  学期课程用路由首段（algo/os…）；学习通题库课程用 `quiz/<slug>`；
 *  未上线占位课程沿用中文名本身（往返稳定）。 */
export function courseSlugByName(name: string): string {
  const c = courses.find((x) => x.name === name);
  if (c) return c.base.replace(/^\/+/, '') || 'hub';
  const quiz = QUIZ_COURSES.find((x) => x.name === name);
  if (quiz) return `quiz/${quiz.slug}`;
  return name;
}

/** 云端 slug → 课程名（云端数据回到本机时用）；未知的纯 ASCII slug 返回 undefined */
export function courseNameBySlug(slug: string): string | undefined {
  const c = courses.find((x) => x.base.replace(/^\/+/, '') === slug);
  if (c) return c.name;
  if (slug.startsWith('quiz/')) return QUIZ_NAME_BY_SLUG.get(slug.slice(5));
  // 占位课程（未上线）用中文名当 slug，原样还原；避免把历史脏 slug 变成收藏项
  return /[一-龥]/.test(slug) ? slug : undefined;
}

/** 学习通题库 · 七门课注册表（首页卡片、课程页、收藏/最近查看共用的唯一事实源） */
import type { QuizKind, QuizQuestion } from './types';

export type { QuizKind, QuizQuestion } from './types';

export interface QuizCourse {
  slug: string;
  /** 课程显示名（首页卡片 / 收藏 / 最近查看的键） */
  name: string;
  /** 题量（与题库文件一致，用于卡片与首页统计） */
  count: number;
  /** 按需加载题库（Vite 动态 import → 每门课独立 chunk） */
  load: () => Promise<QuizQuestion[]>;
}

/** 学习通题库课程（顺序即首页展示顺序） */
export const QUIZ_COURSES: readonly QuizCourse[] = [
  {
    slug: 'sizheng',
    name: '思想道德与法治',
    count: 630,
    load: async () => normalize((await import('./banks/sizheng.json')).default),
  },
  {
    slug: 'mayuan',
    name: '马克思主义基本原理',
    count: 621,
    load: async () => normalize((await import('./banks/mayuan.json')).default),
  },
  {
    slug: 'maogai',
    name: '毛概',
    count: 619,
    load: async () => normalize((await import('./banks/maogai.json')).default),
  },
  {
    slug: 'jingang',
    name: '中国近现代史纲要',
    count: 528,
    load: async () => normalize((await import('./banks/jingang.json')).default),
  },
  {
    slug: 'xigai',
    name: '习概',
    count: 450,
    load: async () => normalize((await import('./banks/xigai.json')).default),
  },
  {
    slug: 'xingce',
    name: '形势与政策',
    count: 450,
    load: async () => normalize((await import('./banks/xingce.json')).default),
  },
  {
    slug: 'gongtongti',
    name: '中华民族共同体概论',
    count: 253,
    load: async () => normalize((await import('./banks/gongtongti.json')).default),
  },
];

export const findQuizCourse = (slug: string | undefined): QuizCourse | undefined =>
  QUIZ_COURSES.find((c) => c.slug === slug);

/** 历史显示名 → 现显示名：改名后本地收藏/最近查看与云端旧行统一归一 */
export const QUIZ_LEGACY_NAMES: Record<string, string> = {
  毛泽东思想和中国特色社会主义理论体系概论: '毛概',
  习近平新时代中国特色社会主义思想概论: '习概',
  '形势与政策（2026秋）': '形势与政策',
};

/** 课程名归一（历史全名 → 短名） */
export const normalizeQuizName = (name: string): string => QUIZ_LEGACY_NAMES[name] ?? name;

/** 课程名 → 路由（首页收藏/最近查看按名称解析用） */
export const QUIZ_ROUTE_BY_NAME: Record<string, string> = Object.fromEntries(
  QUIZ_COURSES.map((c) => [c.name, `/quiz/${c.slug}`]),
);

/** 含历史名称的解析表（迁移未跑完/云端仍有旧名称时，卡片也不会丢） */
export const QUIZ_ROUTE_BY_ANY_NAME: Record<string, string> = {
  ...Object.fromEntries(Object.entries(QUIZ_LEGACY_NAMES).map(([old, now]) => [old, QUIZ_ROUTE_BY_NAME[now]])),
  ...QUIZ_ROUTE_BY_NAME,
};

/* ------------------------------------------------ 题库加载（带缓存） */

const cache = new Map<string, QuizQuestion[]>();

/** 清洗库原始形态：type 字段、判断题答案为数字 */
interface RawQuestion {
  id: string;
  chapter: string;
  type: 'single' | 'multiple' | 'judge' | 'blank' | 'text';
  question: string;
  options: string[];
  answer: number[] | number | string;
  explanation: string;
  badAnswer?: boolean;
}

const KIND: Record<RawQuestion['type'], QuizKind> = {
  single: 'single',
  multiple: 'multiple',
  judge: 'judge',
  blank: 'fill',
  text: 'fill',
};

function normalize(raw: unknown): QuizQuestion[] {
  return (raw as RawQuestion[]).map((q) => ({
    id: q.id,
    chapter: q.chapter,
    kind: KIND[q.type] ?? 'single',
    question: q.question,
    options: Array.isArray(q.options) ? q.options : [],
    answer:
      q.type === 'judge'
        ? [Number(q.answer) === 0 ? 0 : 1]
        : (q.answer as number[] | string),
    explanation: q.explanation || '',
    ...(q.badAnswer ? { badAnswer: true } : {}),
  }));
}

/** 按课程加载题库（进程内缓存，切换课程/返回不重复拉取） */
export function loadQuizBank(course: QuizCourse): Promise<QuizQuestion[]> {
  const hit = cache.get(course.slug);
  if (hit) return Promise.resolve(hit);
  return course.load().then((bank) => {
    cache.set(course.slug, bank);
    return bank;
  });
}

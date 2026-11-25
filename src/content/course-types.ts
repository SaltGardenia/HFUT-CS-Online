/** 新一代课程页的公共数据契约：章节复用 DeckData，试卷在本文件定义。
 * 线性代数 / 数据结构 / 电路与电子技术基础 三门课共用同一套页面组件与样式。 */
import type { DeckData } from './types';
import type { PracticeQuestion } from './practice/types';

export type { DeckData, Section, TocEntry, Block, QuizData } from './types';
export type { PracticeTag, PracticeKind } from './practice/types';

/** 一门课的一章（课件的一章/一讲） */
export type CourseChapter = DeckData;

/** 题型：与练习组件一致 */
export type CourseQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export type CourseQuestion = PracticeQuestion;

/** 原卷的一道大题 */
export interface CoursePaperSection {
  title: string;
  questionIds: string[];
}

/** 一份试卷 */
export interface CoursePaper {
  id: string;
  title: string;
  /** 来源说明（原卷文件名/学年学期） */
  source: string;
  answerSource: '原卷附答案' | '附件答案' | '本站整理' | '原卷未附答案';
  sections: CoursePaperSection[];
  questions: CourseQuestion[];
}

/** 顶栏的单元分组（章节较多时用） */
export interface CourseUnit {
  /** 单元短名（顶栏按钮文案） */
  label: string;
  /** 悬停说明 */
  tip: string;
  /** 该单元包含的章节 id（按课程顺序） */
  chapterIds: string[];
}

/** 总目录页的课程概况卡片 */
export interface CourseIntroCard {
  title: string;
  body: string;
}

/** 一门课的静态配置：课程页组件只负责把它接到共享外壳上 */
export interface CourseConfig {
  /** 课程名 */
  name: string;
  /** 路由前缀，如 /la */
  base: string;
  /** html[data-deck] 主题键 */
  deckKey: string;
  /** 顶栏课程名胶囊的悬停说明 */
  tip: string;
  /** 数据来源一句话（首页卡片副标） */
  source: string;
  chapters: CourseChapter[];
  papers: CoursePaper[];
  /** 作答进度 localStorage 键（须在 lib/sync/keys.ts 登记） */
  storeKey: string;
  /** 题型短标签 */
  kindLabel: Record<CourseQuizKind, string>;
  /** 知识点标签目标：章序号 → { sectionId: 显示名 } */
  tagSections: Record<number, Record<string, string>>;
  /** 章节较多时的单元分组；为空则顶栏直接平铺各章 */
  units?: CourseUnit[];
  /** 总目录页导语（HTML） */
  lede: string;
  /** 总目录页概况卡片 */
  introCards: CourseIntroCard[];
  /** 各章一句话简介（总目录卡片） */
  chapterBlurbs: Record<string, string>;
  /** 搜索框空结果的示例关键词 */
  suggestions?: string[];
  /** 只有一份试卷时，在线练习直接展示答题页 */
  singlePaperDirect?: boolean;
}

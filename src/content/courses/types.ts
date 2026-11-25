/** 通用课程页的数据契约 —— 大二下 12 门课共用一套外壳与页面组件，
 * 每门课只提供本文件描述的数据；样式全部来自 src/styles（上游写死，课程页零内联样式）。 */
import type { DeckData } from '../types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 一章（复用算法课的章节结构：lede + toc + sections） */
export type GenChapter = DeckData;

export type GenQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 知识点标签：deck 为课件章号（章号有缺号时按实际章号，如计组 1、3、4…），sec 为章内 section id */
export interface GenTag {
  deck: number;
  sec: string;
  text: string;
}

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export interface GenQuestion {
  /** 全库唯一 id，如 'comp-1314-s1' */
  id: string;
  kind: GenQuizKind;
  /** 题卡序号文案（按原卷编号），如「单选 3」「解答 2」；缺省按题型内的顺序编号 */
  label?: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  tags: GenTag[];
}

export interface GenPaperSection {
  title: string;
  questionIds: string[];
}

export interface GenPaper {
  id: string;
  title: string;
  source: string;
  answerSource: '原卷附答案' | '本站整理';
  sections: GenPaperSection[];
  questions: GenQuestion[];
}

/** 首页「课程与资料概况」卡片 */
export interface HomeCard {
  title: string;
  /** 可信 HTML 片段 */
  html: string;
}

export interface CourseHome {
  /** 首段导语（HTML） */
  lede: string;
  /** 概况卡片（2～3 张） */
  cards: HomeCard[];
  /** 每章一句话简介，key 为章节 id */
  blurbs: Record<string, string>;
}

/** 顶栏分组：章节较多时用「单元」按钮 + 下拉菜单（与计算机体系结构课同机制） */
export interface CourseUnit {
  id: string;
  /** 按钮完整文案，如「基础」 */
  label: string;
  /** 窄屏文案 */
  short: string;
  /** 该单元包含的章节 id（按导航顺序） */
  chapters: string[];
}

/** 一门课的全部数据 */
export interface CourseSpec {
  /** html[data-deck] 与路由前缀的主键，如 'comp' */
  key: string;
  /** 路由前缀，如 '/comp' */
  base: string;
  /** 课程名（顶栏胶囊） */
  name: string;
  /** 课程名胶囊的悬停说明 */
  tip: string;
  /** 正文单位（「章」/「讲」/「单元」），用于侧栏与目录文案 */
  unit: '章' | '讲' | '单元';
  chapters: GenChapter[];
  papers: GenPaper[];
  units?: CourseUnit[];
  home: CourseHome;
}

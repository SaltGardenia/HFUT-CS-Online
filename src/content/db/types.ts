/** 数据库系统课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';
import type { PracticeTag } from '../practice/types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 数据库系统课程的一个章（第1章…第9章 + 实验环境） */
export type DbChapter = DeckData;

/** 在线练习知识点标签：复用算法课题库契约，deck 存章号 1..9，
 * 答题页通过 tagNav 把它映射为 /db/chapter/chN?s=sec。 */
export type DbTag = PracticeTag;

export type DbQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export interface DbQuestion {
  /** 全库唯一 id，如 'p1-f1'（试卷 1 · 填空 1） */
  id: string;
  kind: DbQuizKind;
  /** 题干 HTML（含原始编号） */
  question: string;
  /** 选项 HTML（single/multi/judge 有，judge 固定为 ['对','错']；fill/essay 无） */
  options?: string[];
  /**
   * 答案原文：single 'A'；multi 'A、C'；judge '对'/'错'；
   * fill 文本（可用全角「｜」分隔多个可接受写法）；essay 参考答案（HTML，不判分）
   */
  answer: string;
  /** 解析 HTML */
  explanation: string;
  /** 知识点标签（≥1 个，可点击跳转对应章位置） */
  tags: DbTag[];
}

/** 原卷的一道大题（答题页按它分组展示） */
export interface DbPaperSection {
  /** 大题标题，如「一、选择题」 */
  title: string;
  /** 该大题下的题目 id 列表（按原卷顺序） */
  questionIds: string[];
}

/** 一份试卷 */
export interface DbPaper {
  /** 路由 id，如 'db-2015a' */
  id: string;
  /** 展示名，如「2015-2016 学年第一学期 · 数据库系统试卷（宣城校区）」 */
  title: string;
  /** 来源说明（原卷文件名 / 答案出处），列表页与答题页展示 */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' */
  answerSource: '原卷附答案' | '本站整理';
  /** 答题页的答题区按大题分组 */
  sections: DbPaperSection[];
  questions: DbQuestion[];
}

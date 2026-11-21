/** 软件工程课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';
import type { PracticeTag } from '../practice/types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 软件工程课程的一个章（第1章…第13章 + 课程设计） */
export type SeChapter = DeckData;

/** 在线练习知识点标签：复用算法课题库契约，deck 存章号 1..14（14 = 课程设计），
 * 答题页通过 tagNav 把它映射为 /se/deck/deckN?s=sec。 */
export type SeTag = PracticeTag;

export type SeQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export interface SeQuestion {
  /** 全库唯一 id，如 'p1-s1'（试卷 1 · 单选 1） */
  id: string;
  kind: SeQuizKind;
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
  tags: SeTag[];
}

/** 原卷的一道大题（答题页按它分组展示） */
export interface SePaperSection {
  /** 大题标题，如「一、选择题」 */
  title: string;
  /** 该大题下的题目 id 列表（按原卷顺序） */
  questionIds: string[];
}

/** 一份试卷 */
export interface SePaper {
  /** 路由 id，如 'se-2022a' */
  id: string;
  /** 展示名 */
  title: string;
  /** 来源说明（原卷文件名 / 答案出处），列表页与答题页展示 */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' */
  answerSource: '原卷附答案' | '本站整理';
  /** 答题页的答题区按大题分组 */
  sections: SePaperSection[];
  questions: SeQuestion[];
}

/** 软件测试课程的数据契约 —— 章节页复用算法课的 DeckData/Section/Block 结构 */
import type { DeckData } from '../types';
import type { PracticeTag } from '../practice/types';

export type { DeckData, Section, TocEntry, Block, QuizData } from '../types';

/** 软件测试课程的一个章（课件编号 1～7、9、10 —— 原课程无第 8 章文件） */
export type StChapter = DeckData;

/** 在线练习知识点标签：复用算法课题库契约，deck 存课件章号（1..7、9、10），
 * 答题页通过 tagNav 把它映射为 /st/deck/deckN?s=sec。 */
export type StTag = PracticeTag;

export type StQuizKind = 'single' | 'multi' | 'judge' | 'fill' | 'essay';

/** 一道试题（question/options/answer/explanation 为可信 HTML 片段） */
export interface StQuestion {
  /** 全库唯一 id，如 'p1-s1'（试卷 1 · 单选 1） */
  id: string;
  kind: StQuizKind;
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
  tags: StTag[];
}

/** 原卷的一道大题（答题页按它分组展示） */
export interface StPaperSection {
  /** 大题标题，如「一、选择题」 */
  title: string;
  /** 该大题下的题目 id 列表（按原卷顺序） */
  questionIds: string[];
}

/** 一份试卷 */
export interface StPaper {
  /** 路由 id，如 'st-2020a' */
  id: string;
  /** 展示名 */
  title: string;
  /** 来源说明（原卷文件名 / 答案出处），列表页与答题页展示 */
  source: string;
  /** 参考答案来源说明：'原卷附答案' | '本站整理' */
  answerSource: '原卷附答案' | '本站整理';
  /** 答题页的答题区按大题分组 */
  sections: StPaperSection[];
  questions: StQuestion[];
}

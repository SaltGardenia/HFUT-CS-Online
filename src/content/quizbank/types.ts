/** 学习通题库数据契约 */
export type QuizKind = 'single' | 'multiple' | 'judge' | 'fill';

export interface QuizQuestion {
  /** 课程内唯一（清洗时按顺序重编） */
  id: string;
  /** 章节/讲次标签（各课命名不同：导论、第一章、第一讲 …） */
  chapter: string;
  kind: QuizKind;
  question: string;
  /** 判断题固定 ['正确','错误']；填空题为 [] */
  options: string[];
  /** 选择题 = 正确项下标数组；判断题 = [0|1]；填空题 = 答案文本 */
  answer: number[] | string;
  explanation: string;
  /** 源数据质量标记（如选项缺文本） */
  badAnswer?: boolean;
}

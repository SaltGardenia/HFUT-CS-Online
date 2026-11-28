/** 题型展示与权重（七门课共用） */
import type { QuizKind } from './types';

/** 题型展示名（固定顺序） */
export const QUIZ_KINDS = [
  { kind: 'single', label: '单选' },
  { kind: 'multiple', label: '多选' },
  { kind: 'judge', label: '判断' },
  { kind: 'fill', label: '填空' },
] as const;

export const quizKindLabel = (k: QuizKind): string =>
  QUIZ_KINDS.find((x) => x.kind === k)?.label ?? '题目';

/** 题型权重（间隔增幅修正）：填空（拼写式作答）置信度最高拉得最长；判断题两选项易蒙最低 */
export const QUIZ_KIND_WEIGHTS: Record<QuizKind, number> = { single: 1, multiple: 0.9, judge: 0.8, fill: 1.2 };

/** 判断题固定选项 */
export const JUDGE_OPTIONS = ['正确', '错误'];

/** 展示用选项：填空题为空，其余取题库选项 */
export const optionsOf = (q: { kind: QuizKind; options: string[] }): string[] =>
  q.kind === 'fill' ? [] : q.options;

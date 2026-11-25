import type { GenQuizKind } from './types';

/** 题型标签（与算法课/OS/ST 课一致） */
export const GEN_KIND_LABEL: Record<GenQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

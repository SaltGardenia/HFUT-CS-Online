import { netPapers } from '../../content/net';

/** 作答结果持久化 key（qid = `${paperId}:${questionId}`） */
export const NET_PRACTICE_STORE_KEY = 'net-practice-progress-v1';
export type NetResult = 'right' | 'wrong' | 'revealed';

export function netPaperStats(paperId: string, results: Record<string, NetResult>) {
  const paper = netPapers.find((p) => p.id === paperId);
  if (!paper) return { done: 0, right: 0, total: 0 };
  const done = paper.questions.filter((q) => results[`${paperId}:${q.id}`]).length;
  const right = paper.questions.filter((q) => results[`${paperId}:${q.id}`] === 'right').length;
  return { done, right, total: paper.questions.length };
}


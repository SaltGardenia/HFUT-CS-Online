/** 与历年试卷及其他课程独立，但复用同一组 right/wrong/revealed 结果。 */
export type HomeworkResult = 'right' | 'wrong' | 'revealed';
export type HomeworkResults = Record<string, HomeworkResult>;
export const NET_HOMEWORK_STORE_KEY = 'net-homework-progress-v1';

export function homeworkId(chapterNo: number, questionNo: number): string {
  return `${chapterNo}:${questionNo}`;
}

export function loadHomeworkResults(): HomeworkResults {
  try {
    const saved = JSON.parse(localStorage.getItem(NET_HOMEWORK_STORE_KEY) ?? 'null');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      Object.entries(saved).filter(([key, value]) =>
        /^\d+:\d+$/.test(key) && (value === 'right' || value === 'wrong' || value === 'revealed'),
      ),
    ) as HomeworkResults;
  } catch {
    return {};
  }
}


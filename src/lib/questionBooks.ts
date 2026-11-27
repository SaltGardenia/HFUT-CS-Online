/**
 * 题目收藏本 / 错题本：页面层的读写门面。
 * 数据按课程划界（localStorage `hb-qmarks:<course>`，云端 user_qmarks 随账号同步）；
 * qid 与该课作答进度同一套 id（net/phys 为 `${paperId}:${qid}`，其余为题目 id）。
 */
import { useCallback, useMemo } from 'react';
import { setQMark } from './sync/local';
import { useCourseQMarks } from './sync/react';
import type { CourseQMarks } from './sync/types';

/** 复用页面上报的作答结果（right / wrong / revealed） */
export type BookResult = 'right' | 'wrong' | 'revealed';

export interface QuestionBooks {
  /** 本题是否在收藏本 */
  favorited(qid: string): boolean;
  toggleFavorite(qid: string): void;
  /** 本题是否在错题本 */
  wrong(qid: string): boolean;
  /** 错题本页的移出按钮 */
  removeFromWrong(qid: string): void;
  /** 作答结果联动：答错进错题本，答对移出错题本，看答案不动账 */
  trackResult(qid: string, result: BookResult): void;
  /** 当前在册的题目 id（保持账内时间序，错题本/收藏本页用它筛本课题集） */
  wrongIds(): string[];
  favoriteIds(): string[];
}

/** 两本账的原始记录（qids 只暴露 id，便于调用方与课程题集求交集） */
function idsOn(marks: CourseQMarks, kind: 'fav' | 'wrong'): string[] {
  return Object.entries(marks[kind])
    .filter(([, stamp]) => stamp.on)
    .sort((a, b) => b[1].t - a[1].t)
    .map(([qid]) => qid);
}

/** 一门课的两本账：所有在线练习页与书页共用同一个实例语义 */
export function useQuestionBooks(course: string): QuestionBooks {
  const marks = useCourseQMarks(course);

  const wrongIds = useMemo(() => idsOn(marks, 'wrong'), [marks]);
  const favoriteIds = useMemo(() => idsOn(marks, 'fav'), [marks]);
  const onSets = useMemo(
    () => ({
      fav: new Set(favoriteIds),
      wrong: new Set(wrongIds),
    }),
    [favoriteIds, wrongIds],
  );

  const favorited = useCallback((qid: string) => onSets.fav.has(qid), [onSets]);
  const wrong = useCallback((qid: string) => onSets.wrong.has(qid), [onSets]);
  const toggleFavorite = useCallback(
    (qid: string) => setQMark(course, 'fav', qid, !onSets.fav.has(qid)),
    [course, onSets],
  );
  const removeFromWrong = useCallback(
    (qid: string) => setQMark(course, 'wrong', qid, false),
    [course],
  );
  const trackResult = useCallback(
    (qid: string, result: BookResult) => {
      // 首答就对不落墓碑：错题本只记真错过的题
      if (result === 'wrong') setQMark(course, 'wrong', qid, true);
      else if (result === 'right' && onSets.wrong.has(qid)) setQMark(course, 'wrong', qid, false);
    },
    [course, onSets],
  );

  return { favorited, toggleFavorite, wrong, removeFromWrong, trackResult, wrongIds, favoriteIds };
}

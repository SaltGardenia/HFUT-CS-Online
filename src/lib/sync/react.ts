import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getFavoriteCourses } from '../favoriteCourses';
import { getRecentCourses } from '../recentCourses';
import * as local from './local';
import { FAVORITES_KEY, RECENT_KEY, qmarksKey } from './keys';
import { syncManager } from './manager';
import type { CourseQMarks, SyncState } from './types';

/** 订阅同步状态（账号、同步进度、错误） */
export function useSync(): SyncState {
  return useSyncExternalStore(syncManager.subscribe, syncManager.getState, syncManager.getState);
}

/** 订阅一份进度表；setter 走统一存储层（自动打时间戳 + 触发云端上传） */
export function useProgressStore<R extends string>(
  key: string,
): [Record<string, R>, (updater: Record<string, R> | ((prev: Record<string, R>) => Record<string, R>)) => void] {
  const [map, setMap] = useState<Record<string, R>>(() => local.readProgress(key) as Record<string, R>);
  const rawRef = useRef<string | null>(local.readRaw(key));

  useEffect(() => {
    const raw = local.readRaw(key);
    rawRef.current = raw;
    setMap(local.readProgress(key) as Record<string, R>);
    return local.subscribeStore(key, () => {
      const nextRaw = local.readRaw(key);
      if (nextRaw === rawRef.current) return;
      rawRef.current = nextRaw;
      setMap(local.readProgress(key) as Record<string, R>);
    });
  }, [key]);

  const set = useCallback(
    (updater: Record<string, R> | ((prev: Record<string, R>) => Record<string, R>)) => {
      const prev = local.readProgress(key) as Record<string, R>;
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // 先更新 UI：localStorage 不可用（隐私模式 / 配额满）时仍能正常答题
      setMap(next);
      local.writeProgress(key, next);
    },
    [key],
  );

  return [map, set];
}

/** 只读订阅一份进度表（列表页统计用，云端合并后自动刷新） */
export function useStoredRecord<T extends string>(key: string): Record<string, T> {
  const [map, setMap] = useState<Record<string, T>>(() => local.readProgress(key) as Record<string, T>);
  const rawRef = useRef<string | null>(local.readRaw(key));

  useEffect(() => {
    const raw = local.readRaw(key);
    rawRef.current = raw;
    setMap(local.readProgress(key) as Record<string, T>);
    return local.subscribeStore(key, () => {
      const nextRaw = local.readRaw(key);
      if (nextRaw === rawRef.current) return;
      rawRef.current = nextRaw;
      setMap(local.readProgress(key) as Record<string, T>);
    });
  }, [key]);

  return map;
}

export function useFavoriteCourses(): string[] {
  const [list, setList] = useState(getFavoriteCourses);
  useEffect(() => {
    setList(getFavoriteCourses());
    return local.subscribeStore(FAVORITES_KEY, () => setList(getFavoriteCourses()));
  }, []);
  return list;
}

export function useRecentCourses(): string[] {
  const [list, setList] = useState(getRecentCourses);
  useEffect(() => {
    setList(getRecentCourses());
    return local.subscribeStore(RECENT_KEY, () => setList(getRecentCourses()));
  }, []);
  return list;
}

/** 只读订阅一门课的题目两本账（收藏本/错题本）；本机写入与云端合并都会刷新 */
export function useCourseQMarks(course: string): CourseQMarks {
  const key = qmarksKey(course);
  const [marks, setMarks] = useState<CourseQMarks>(() => local.readQMarks(course));
  const rawRef = useRef<string | null>(local.readRaw(key));

  useEffect(() => {
    const raw = local.readRaw(key);
    rawRef.current = raw;
    setMarks(local.readQMarks(course));
    return local.subscribeStore(key, () => {
      const nextRaw = local.readRaw(key);
      if (nextRaw === rawRef.current) return;
      rawRef.current = nextRaw;
      setMarks(local.readQMarks(course));
    });
  }, [key, course]);

  return marks;
}

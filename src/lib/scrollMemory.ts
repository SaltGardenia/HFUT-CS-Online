import { useEffect } from 'react';
import type { Location, NavigationType } from 'react-router-dom';

/** 历史条目的滚动位置：会话内前进 / 后退（POP）时按 location.key 精确恢复 */
const positions = new Map<string, number>();

/** 刷新页面后恢复用：sessionStorage 按「路径 + 查询」持久化 */
const STORAGE_PREFIX = 'hb-scroll:';

const storageKey = (pathname: string, search: string) =>
  `${STORAGE_PREFIX}${pathname}${search}`;

function readPersisted(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null; // 隐私模式等禁用存储的场景：只保留内存记忆
  }
}

function persist(key: string, y: number) {
  try {
    sessionStorage.setItem(key, String(y));
  } catch {
    /* 同上，忽略 */
  }
}

/**
 * 课程外壳的滚动记忆。
 *
 * - 滚动时就地记录（内存按 location.key、sessionStorage 按路径），不依赖卸载时机：
 *   AnimatePresence 让旧页在退场动画期间仍然挂着，cleanup 里读 window.scrollY
 *   很可能已经是新页的位置，会把记录覆盖成新页的滚动值。
 * - POP（浏览器前进 / 后退、刷新页面）恢复原位，刷新后按路径从 sessionStorage 恢复。
 * - 普通导航回顶部；带 ?s= 段落锚点时交给章节页自己定位。
 */
export function useScrollMemory(location: Location, navType: NavigationType) {
  const { key, pathname, search } = location;
  const path = storageKey(pathname, search);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        positions.set(key, y);
        persist(path, y);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key, path]);

  useEffect(() => {
    if (navType !== 'POP') {
      if (!search) window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (search) return; // ?s= 深链由章节页定位
    // 没有记录也回顶部：SPA 换页时 window 会沿用上一页的滚动值（可能被新页高度截断）
    const saved = positions.get(key) ?? readPersisted(path);
    if (!saved) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // 首帧排版未稳时 scrollTo 会被夹到较小的值：双 rAF + 字体就绪后各校正一次；
    // 用户一旦主动滚动（滚轮 / 触摸 / 按键）就停止校正，避免把人拽回去。
    let cancelled = false;
    const stop = () => {
      cancelled = true;
    };
    const apply = () => {
      // instant：绕开全局 scroll-behavior: smooth，避免恢复过程被肉眼看到
      if (!cancelled) window.scrollTo({ top: saved, behavior: 'instant' });
    };
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchmove', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });
    const timers: number[] = [];
    requestAnimationFrame(() => {
      requestAnimationFrame(apply);
      void document.fonts?.ready.then(() => {
        if (!cancelled) apply();
      });
      timers.push(window.setTimeout(apply, 120));
    });
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [key, path, search, navType]);
}

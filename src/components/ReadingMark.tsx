import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { IconBookmark } from './icons';
import { READING_KEY } from '../lib/sync/keys';
import { readReading, subscribeStore, writeReading } from '../lib/sync/local';
import type { ReadingEntry } from '../lib/sync/types';

/** 只在正文阅读页出现：/<course>/deck/<id> 或 /<course>/chapter/<id> */
const CONTENT_PATH = /\/(?:deck|chapter)\/[^/]+\/?$/;
/** 离开上次位置超过约 0.75 屏才浮出指示标，贴着读的时候不打扰 */
const SHOW_RATIO = 0.75;
/** 停止滚动后多久落盘（随后云端同步会防抖上传） */
const WRITE_IDLE_MS = 1800;
/** 云端进度晚到多久之内仍可替换锚点（用户还没开始读时） */
const ADOPT_WINDOW_MS = 8000;

/** 路由首段 = 课程 slug（与云端 course 字段一致） */
function pageSlug(pathname: string): string {
  return pathname.split('/').filter(Boolean)[0] ?? 'hub';
}

/** 当前位置所属的小节标题（就近取 h2/h3），只用于提示文案 */
function sectionText(): string | undefined {
  const nodes = document.querySelectorAll<HTMLElement>('.page h2[id], .page h3[id]');
  let text: string | undefined;
  for (const node of nodes) {
    if (node.getBoundingClientRect().top > 140) break;
    text = node.textContent?.trim() || text;
  }
  return text ? text.slice(0, 60) : undefined;
}

/**
 * 阅读进度指示标（Word 式「回到上次的进度」）：
 * - 打开正文页时取本机 / 云端里较新的进度作为锚点；
 * - 读远了浮出「上次读到 N%」小胶囊，点击平滑回去；
 * - 滚动停顿后把当前位置写回本机（登录后自动同步云端）。
 */
export default function ReadingMark() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const active = CONTENT_PATH.test(pathname);

  const [anchor, setAnchor] = useState<ReadingEntry | null>(null);
  const [visible, setVisible] = useState(false);

  const anchorRef = useRef<ReadingEntry | null>(null);
  const targetRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const mountedAtRef = useRef(0);
  const layoutReadyRef = useRef(false);
  const userMovedRef = useRef(false);
  const dismissedRef = useRef(false);
  const lastWriteRef = useRef<ReadingEntry | null>(null);
  const writeTimerRef = useRef(0);
  const rafRef = useRef(0);

  const measure = useCallback(() => {
    const current = anchorRef.current;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (!current || max < 240) {
      targetRef.current = null;
      if (visibleRef.current) {
        visibleRef.current = false;
        setVisible(false);
      }
      return;
    }
    const target = Math.round(Math.min(1, Math.max(0, current.p)) * max);
    targetRef.current = target;
    const far = Math.abs(window.scrollY - target) > Math.max(window.innerHeight * SHOW_RATIO, 240);
    const next = layoutReadyRef.current && far && !dismissedRef.current;
    if (next !== visibleRef.current) {
      visibleRef.current = next;
      setVisible(next);
    }
  }, []);

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measure();
    });
  }, [measure]);

  // 换页：重置状态，取本页上次的进度作锚点；云端合并晚到则在用户开读前替换
  useEffect(() => {
    anchorRef.current = null;
    targetRef.current = null;
    mountedAtRef.current = Date.now();
    layoutReadyRef.current = false;
    userMovedRef.current = false;
    dismissedRef.current = false;
    lastWriteRef.current = null;
    visibleRef.current = false;
    setAnchor(null);
    setVisible(false);
    if (!active) return;

    const adopt = (entry: ReadingEntry | undefined, force: boolean) => {
      if (!entry) return;
      const current = anchorRef.current;
      if (!force && current && current.t >= entry.t) return;
      anchorRef.current = entry;
      setAnchor(entry);
      scheduleMeasure();
    };

    adopt(readReading()[pathname], true);

    const unsub = subscribeStore(READING_KEY, () => {
      // 云端进度比本机新：用户还没往下读，也没点过指示标，才把锚点挪过去
      if (userMovedRef.current || dismissedRef.current) return;
      if (Date.now() - mountedAtRef.current > ADOPT_WINDOW_MS) return;
      if (window.scrollY > 80) return;
      const entry = readReading()[pathname];
      if (!entry) {
        // 切换账号会清空本机数据：锚点一并撤销
        anchorRef.current = null;
        setAnchor(null);
        scheduleMeasure();
        return;
      }
      adopt(entry, false);
    });

    // 懒加载的课程包 / 首帧排版完成后才算距离
    const ready = window.setTimeout(() => {
      layoutReadyRef.current = true;
      scheduleMeasure();
    }, 600);

    return () => {
      unsub();
      window.clearTimeout(ready);
    };
  }, [active, pathname, scheduleMeasure]);

  // 记录：滚动停顿后写回本机；用户主动操作随时可打断
  useEffect(() => {
    if (!active) return;

    const flush = () => {
      if (!layoutReadyRef.current) return;
      const y = window.scrollY;
      // 顶部的程序化回滚不覆盖历史进度
      if (y <= 0) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max < 240) return;
      const p = Math.min(1, y / max);
      const prev = lastWriteRef.current;
      if (prev && Math.abs(prev.y - y) < 12 && Math.abs(prev.p - p) < 0.004) return;
      const entry: ReadingEntry = {
        c: pageSlug(pathname),
        y: Math.round(y),
        p,
        s: sectionText(),
        t: Date.now(),
      };
      lastWriteRef.current = entry;
      writeReading(pathname, entry);
    };

    const onScroll = () => {
      layoutReadyRef.current = true;
      if (window.scrollY > 80) userMovedRef.current = true;
      scheduleMeasure();
      window.clearTimeout(writeTimerRef.current);
      writeTimerRef.current = window.setTimeout(flush, WRITE_IDLE_MS);
    };
    const onInput = () => {
      userMovedRef.current = true;
    };
    const onHide = () => {
      if (document.hidden) flush();
    };
    const onPointerDown = () => flush();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onInput, { passive: true });
    window.addEventListener('touchmove', onInput, { passive: true });
    window.addEventListener('keydown', onInput);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHide);

    // 图片 / 字体到位后页面变高：重新校准锚点位置
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleMeasure) : null;
    ro?.observe(document.documentElement);

    return () => {
      window.clearTimeout(writeTimerRef.current);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('touchmove', onInput);
      window.removeEventListener('keydown', onInput);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHide);
      ro?.disconnect();
    };
  }, [active, pathname, scheduleMeasure]);

  if (!active || !anchor || !visible) return null;
  const pct = Math.round(Math.min(1, Math.max(0, anchor.p)) * 100);

  return (
    <button
      type="button"
      className="reading-mark"
      onClick={() => {
        dismissedRef.current = true;
        visibleRef.current = false;
        setVisible(false);
        const target = targetRef.current;
        if (target != null) {
          window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
        }
      }}
      title={anchor.s ? `上次读到：${anchor.s}` : '回到上次阅读的位置'}
      aria-label={`回到上次阅读的位置（${pct}%）`}
    >
      <IconBookmark size={15} />
      <span>上次读到 {pct}%</span>
    </button>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { capDecks } from '../content/cap';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import CapDeckPage from '../pages/CapDeckPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { CAP_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 各路由的滚动记忆（POP 导航时恢复） */
const scrollPositions = new Map<string, number>();

/** 计算机应用项目实训课搜索索引：讲次目录（试题未收录，无试卷条目；单讲课程不设总目录页） */
function buildCapIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const d of capDecks) {
    for (const t of d.toc) {
      items.push({ kind: '章节', unit: d.id, unitTitle: decodeEntities(d.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  return items;
}

/**
 * 「计算机应用项目实训」课程根组件 —— 挂在 /cap/* 下。
 * 布局与算法课完全一致（同一套上游样式）；课件 无人机答辩1 讲，
 * 不设总目录页（避免近空白页），首页与旧链接统一兜底到讲次页；
 * 试题未收录，不设在线练习页与导航按钮。
 */
export default function CapCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(CAP_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(/^\/cap\/deck\/(cap\d+)$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 课程页 → html[data-deck='cap']：整套课程统一切换到自然语言理解主题色（陶橙）
  useEffect(() => {
    document.documentElement.dataset.deck = 'cap';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 单讲课程：讲次页直接用课程基础色，无需 data-ch 映射（附件页由 data-pg='att' 覆盖）

  // Esc 关闭抽屉
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 滚动记忆：离开时保存；POP 恢复；无 ?s= 的新导航回顶部（定位交给页面处理）
  useEffect(() => {
    const key = location.key;
    return () => {
      scrollPositions.set(key, window.scrollY);
    };
  }, [location.key]);

  useEffect(() => {
    if (navType === 'POP') {
      const y = scrollPositions.get(location.key) ?? 0;
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'auto' }));
    } else if (!location.search) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.key, navType, location.search]);

  // 路由切换时关闭抽屉
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const onAtt = location.pathname.startsWith(`${CAP_BASE}/attachments`);
  // 附件页专属色：html[data-pg='att'] → tokens.css 覆盖 --deck-accent（不与讲次页重复）
  useEffect(() => {
    if (onAtt) document.documentElement.dataset.pg = 'att';
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

  // 顶栏导航：分词系统讲解（单讲）+ 附件（试题未收录，无在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${CAP_BASE}/deck/${capDecks[0].id}`,
        full: '无人机答辩',
        short: '讲',
        active: !!currentDeck,
        key: null,
        tip: `${capDecks[0].no} · ${decodeEntities(capDecks[0].title)}`,
      },
      {
        to: `${CAP_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 实训分章文档',
      },
    ],
    [currentDeck, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${CAP_BASE}/deck/${capDecks[0].id}`,
        no: '讲',
        label: `${capDecks[0].no} ${decodeEntities(capDecks[0].title)}`,
        active: !!currentDeck,
        deckKey: 'cap',
      },
      {
        to: `${CAP_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentDeck, onAtt],
  );

  // 搜索：讲次目录索引 + 跳转路由
  const searchIndex = useMemo(buildCapIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => `${CAP_BASE}/deck/${item.unit}?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="计算机应用项目实训"
        courseBase={CAP_BASE}
        courseTip="计算机应用项目实训 · 无人机答辩课件"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      <div className={`shell-body${onAtt ? ' no-sidebar' : ''}`}>
        <Sidebar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={{
              enter: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
              center: { opacity: 1, x: 0, y: 0 },
              leave: reduced ? { opacity: 0 } : { opacity: 0, y: -8 },
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route index element={<Navigate to={`${CAP_BASE}/deck/${capDecks[0].id}`} replace />} />
              <Route path="deck/:deckId" element={<CapDeckPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={`${CAP_BASE}/deck/${capDecks[0].id}`} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="drawer-root">
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SidebarContent nav={nav} />
        </MobileDrawer>
      </div>
    </div>
  );
}

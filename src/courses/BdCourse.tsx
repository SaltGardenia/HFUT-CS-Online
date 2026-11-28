import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { bdDecks } from '../content/bd';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import BdDeckPage from '../pages/BdDeckPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { BD_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 大数据处理技术课搜索索引：讲次目录（试题未收录，无试卷条目；单讲课程不设总目录页） */
function buildBdIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const d of bdDecks) {
    appendOutlineIndex(items, d);
    for (const t of d.toc) {
      items.push({ kind: '章节', unit: d.id, unitTitle: decodeEntities(d.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  return items;
}

/**
 * 「大数据处理技术」课程根组件 —— 挂在 /bd/* 下。
 * 布局与算法课完全一致（同一套上游样式）；课件 课程作业1 讲，
 * 不设总目录页（避免近空白页），首页与旧链接统一兜底到讲次页；
 * 试题未收录，不设在线练习页与导航按钮。
 */
export default function BdCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(BD_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(/^\/bd\/deck\/(bd\d+)$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 课程页 → html[data-deck='bd']：整套课程统一切换到大数据处理技术主题色（深靛蓝）
  useEffect(() => {
    document.documentElement.dataset.deck = 'bd';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 单讲课程：讲次页直接用课程基础色

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

  useScrollMemory(location, navType);

  // 路由切换时关闭抽屉
  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const onAtt = location.pathname.startsWith(`${BD_BASE}/attachments`);

  // 顶栏导航：课程作业（单讲）+ 附件（试题未收录，无在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${BD_BASE}/deck/${bdDecks[0].id}`,
        full: '课程作业',
        short: '讲',
        active: !!currentDeck,
        key: null,
        tip: `${bdDecks[0].no} · ${decodeEntities(bdDecks[0].title)}`,
      },
      {
        to: `${BD_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 综合设计报告与实验',
      },
    ],
    [currentDeck, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${BD_BASE}/deck/${bdDecks[0].id}`,
        no: '讲',
        label: `${bdDecks[0].no} ${decodeEntities(bdDecks[0].title)}`,
        active: !!currentDeck,
        deckKey: 'bd',
      },
      {
        to: `${BD_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentDeck, onAtt],
  );

  // 搜索：讲次目录索引 + 跳转路由
  const searchIndex = useMemo(buildBdIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => `${BD_BASE}/deck/${item.unit}?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="大数据处理技术"
        courseBase={BD_BASE}
        courseTip="大数据处理技术 · 作业课件"
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
              <Route index element={<Navigate to={`${BD_BASE}/deck/${bdDecks[0].id}`} replace />} />
              <Route path="deck/:deckId" element={<BdDeckPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={`${BD_BASE}/deck/${bdDecks[0].id}`} replace />} />
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

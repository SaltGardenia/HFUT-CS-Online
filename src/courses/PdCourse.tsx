import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { pdChapters, pdHome } from '../content/pd';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import PdHomePage from '../pages/PdHomePage';
import PdChapterPage from '../pages/PdChapterPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { PD_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 程序设计基础课搜索索引：各章目录 + 总目录（试题未收录，无试卷条目） */
function buildPdIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of pdChapters) {
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: decodeEntities(ch.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const t of pdHome.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

/**
 * 「程序设计基础」课程根组件 —— 挂在 /pd/* 下。
 * 布局与算法课完全一致（同一套上游样式），数据为第 1～9、11、12 章课件精讲；
 * 试题未收录，不设在线练习页与导航按钮（旧链接由 * 兜底回总目录）。
 */
export default function PdCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(PD_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/pd\/deck\/(ch\d+)$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 课程页 → html[data-deck='pd']：整套课程统一切换到程序设计基础主题色（赭金）
  useEffect(() => {
    document.documentElement.dataset.deck = 'pd';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 当前章 → html[data-ch]：tokens.css 按序数映射每章专属色（总目录/附件无 data-ch，用课程基础色）
  const unitNo = currentChapter ? pdChapters.findIndex((d) => d.id === currentChapter) + 1 : 0;
  useEffect(() => {
    if (unitNo) document.documentElement.dataset.ch = String(unitNo);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [unitNo]);

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

  const onAtt = location.pathname.startsWith(`${PD_BASE}/attachments`);
  // 附件页专属色：html[data-pg='att'] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    if (onAtt) document.documentElement.dataset.pg = 'att';
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

  // 顶栏导航：总目录 + 第1～9/11/12章 + 附件（试题未收录，无在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${PD_BASE}`,
        full: '总目录',
        short: '目录',
        active: !currentChapter && !onAtt,
        key: null,
        tip: '课程首页 · 章节脉络',
      },
      ...pdChapters.map((d, i) => ({
        to: `${PD_BASE}/deck/${d.id}`,
        full: d.no,
        short: String(i + 1),
        active: d.id === currentChapter,
        key: null,
        tip: decodeEntities(d.title),
      })),
      {
        to: `${PD_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${PD_BASE}`,
        no: '◎',
        label: '总目录 · 章节脉络',
        active: !currentChapter && !onAtt,
      },
      ...pdChapters.map((d, i) => ({
        to: `${PD_BASE}/deck/${d.id}`,
        no: String(i + 1),
        label: `${d.no} ${d.title}`,
        active: d.id === currentChapter,
        deckKey: 'pd',
      })),
      {
        to: `${PD_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onAtt],
  );

  // 搜索：章节索引 + 跳转路由
  const searchIndex = useMemo(buildPdIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit ? `${PD_BASE}/deck/${item.unit}?s=${item.sectionId}` : `${PD_BASE}/?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="程序设计基础"
        courseBase={PD_BASE}
        courseTip="程序设计基础 · C 语言与 C++ 基础课件精讲"
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
              <Route index element={<PdHomePage />} />
              <Route path="deck/:deckId" element={<PdChapterPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={PD_BASE} replace />} />
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

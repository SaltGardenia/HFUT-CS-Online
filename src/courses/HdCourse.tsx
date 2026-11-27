import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { hdUnits, hdHome } from '../content/hd';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import HdHomePage from '../pages/HdHomePage';
import HdUnitPage from '../pages/HdUnitPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { HD_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 系统硬件综合设计课搜索索引：各讲目录 + 总目录（试题未收录，无试卷条目） */
function buildHdIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const u of hdUnits) {
    appendOutlineIndex(items, u);
    for (const t of u.toc) {
      items.push({ kind: '章节', unit: u.id, unitTitle: decodeEntities(u.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  appendOutlineIndex(items, hdHome, '总目录', null);
  for (const t of hdHome.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

/**
 * 「系统硬件综合设计」课程根组件 —— 挂在 /hd/* 下。
 * 布局与算法课完全一致（同一套上游样式），数据为 4 讲课件逐节整理；
 * 试题未收录，不设在线练习页与导航按钮（旧链接由 * 兜底回总目录）。
 */
export default function HdCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(HD_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentUnit = useMemo(() => {
    const m = location.pathname.match(/^\/hd\/deck\/(hd\d+)$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 课程页 → html[data-deck='hd']：整套课程统一切换到系统硬件综合设计主题色（玫红）
  useEffect(() => {
    document.documentElement.dataset.deck = 'hd';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 当前讲 → html[data-ch]：tokens.css 按序数映射每讲专属色（总目录/附件无 data-ch，用课程基础色）
  const unitNo = currentUnit ? hdUnits.findIndex((d) => d.id === currentUnit) + 1 : 0;
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

  const onAtt = location.pathname.startsWith(`${HD_BASE}/attachments`);
  // 附件页专属色：html[data-pg='att'] → tokens.css 覆盖 --deck-accent（不与总目录、各讲重复）
  useEffect(() => {
    if (onAtt) document.documentElement.dataset.pg = 'att';
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

  // 顶栏导航：总目录 + 第1～4讲 + 附件（试题未收录，无在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${HD_BASE}`,
        full: '总目录',
        short: '目录',
        active: !currentUnit && !onAtt,
        key: null,
        tip: '课程首页 · 课件脉络',
      },
      ...hdUnits.map((d, i) => ({
        to: `${HD_BASE}/deck/${d.id}`,
        full: d.no,
        short: String(i + 1),
        active: d.id === currentUnit,
        key: null,
        tip: decodeEntities(d.title),
      })),
      {
        to: `${HD_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentUnit, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${HD_BASE}`,
        no: '◎',
        label: '总目录 · 课件脉络',
        active: !currentUnit && !onAtt,
      },
      ...hdUnits.map((d, i) => ({
        to: `${HD_BASE}/deck/${d.id}`,
        no: String(i + 1),
        label: `${d.no} ${d.title}`,
        active: d.id === currentUnit,
        deckKey: 'hd',
      })),
      {
        to: `${HD_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentUnit, onAtt],
  );

  // 搜索：章节索引 + 跳转路由
  const searchIndex = useMemo(buildHdIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit ? `${HD_BASE}/deck/${item.unit}?s=${item.sectionId}` : `${HD_BASE}/?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="系统硬件综合设计"
        courseBase={HD_BASE}
        courseTip="系统硬件综合设计 · CPU 设计课件精讲"
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
              <Route index element={<HdHomePage />} />
              <Route path="deck/:deckId" element={<HdUnitPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={HD_BASE} replace />} />
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

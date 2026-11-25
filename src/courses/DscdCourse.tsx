import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { DSCD_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';

/**
 * 「数据结构课程设计」课程根组件 —— 挂在 /dscd/* 下。
 * 课件与试题均为 0：全课只含附件（课程设计报告、实验报告与代码），
 * 导航仅「附件」一项，首页与旧链接统一兜底到附件页；布局与其它课程完全一致。
 */
export default function DscdCourse() {
  const location = useLocation();

  useEffect(() => {
    const course = findCourseByBase(DSCD_BASE);
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 课程主题色：html[data-deck='dscd']
  useEffect(() => {
    document.documentElement.dataset.deck = 'dscd';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 附件页专属色
  const onAtt = location.pathname.startsWith(`${DSCD_BASE}/attachments`);
  useEffect(() => {
    if (onAtt) document.documentElement.dataset.pg = 'att';
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useScrollMemory(location, navType);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${DSCD_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: true,
        key: null,
        tip: '附件资料 · 课程设计报告 / 实验报告 / 代码目录与下载',
      },
    ],
    [],
  );

  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${DSCD_BASE}/attachments`,
        no: '件',
        label: '附件资料 · 报告与代码区',
        active: true,
      },
    ],
    [],
  );

  const searchIndex = useMemo<SearchIndexItem[]>(() => [], []);

  return (
    <div className="shell">
      <TopBar
        courseName="数据结构课程设计"
        courseBase={DSCD_BASE}
        courseTip="数据结构课程设计 · 报告与代码"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={() => ''}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      <div className="shell-body no-sidebar">
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
              <Route index element={<Navigate to={`${DSCD_BASE}/attachments`} replace />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={`${DSCD_BASE}/attachments`} replace />} />
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

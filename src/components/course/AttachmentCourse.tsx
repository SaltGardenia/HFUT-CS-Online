import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../../lib/scrollMemory';
import TopBar, { type CourseTab } from '../TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../Sidebar';
import MobileDrawer from '../MobileDrawer';
import type { SearchIndexItem } from '../SearchBox';
import CourseAttachmentsPage from '../../pages/CourseAttachmentsPage';
import { findCourseByBase } from '../../courses/registry';
import { recordCourseView } from '../../lib/recentCourses';

/**
 * 纯附件课程外壳：课件目录为空（或仅有扫描件 / 上机代码），全课只含附件资料。
 * 与其它课程共用同一套顶栏、侧栏、页面骨架与样式，只把首页兜底到附件页。
 */
export default function AttachmentCourse({ base, tip }: { base: string; tip: string }) {
  const location = useLocation();
  const course = findCourseByBase(base);

  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.deck = course?.id ?? '';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, [course]);


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
        to: `${base}/attachments`,
        full: '附件',
        short: '附件',
        active: true,
        key: null,
        tip,
      },
    ],
    [base, tip],
  );

  const nav = useMemo<NavEntry[]>(
    () => [{ to: `${base}/attachments`, no: '件', label: '附件资料', active: true }],
    [base],
  );

  // 无可检索正文：空索引（TopBar 对空索引不渲染搜索胶囊）
  const searchIndex = useMemo<SearchIndexItem[]>(() => [], []);

  return (
    <div className="shell">
      <TopBar
        courseName={course?.name ?? ''}
        courseBase={base}
        courseTip={tip}
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
              <Route index element={<Navigate to={`${base}/attachments`} replace />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={`${base}/attachments`} replace />} />
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

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { MC_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';

/**
 * 「移动计算与应用开发」课程根组件 —— 挂在 /mc/* 下。
 * 课件为 0，试题仅为实验代码（无试卷）：全课只含附件（实验报告 + 实验二/三/四代码），
 * 导航仅「附件」一项，首页与旧链接统一兜底到附件页；布局与算法课完全一致（同一套上游样式）。
 */
export default function McCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(MC_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 课程页 → html[data-deck='mc']：整套课程统一切换到移动计算与应用开发主题色（深青灰）
  useEffect(() => {
    document.documentElement.dataset.deck = 'mc';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 附件页专属色：html[data-pg='att'] → tokens.css 覆盖 --deck-accent（本课唯一页面）
  const onAtt = location.pathname.startsWith(`${MC_BASE}/attachments`);
  useEffect(() => {
    if (onAtt) document.documentElement.dataset.pg = 'att';
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

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

  // 顶栏导航：仅 附件（课件未收录、试题无试卷，无课程内容与在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: `${MC_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: true,
        key: null,
        tip: '附件资料 · 实验报告与实验代码目录与下载',
      },
    ],
    [],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: `${MC_BASE}/attachments`,
        no: '件',
        label: '附件资料 · 实验报告与实验代码',
        active: true,
      },
    ],
    [],
  );

  // 附件课无可检索内容：空索引（TopBar 对空索引不渲染搜索胶囊）
  const searchIndex = useMemo<SearchIndexItem[]>(() => [], []);

  return (
    <div className="shell">
      <TopBar
        courseName="移动计算与应用开发"
        courseBase={MC_BASE}
        courseTip="移动计算与应用开发 · 实验报告与实验代码"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={() => ''}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 全课只有附件页（无侧栏），正文占满整个版心 */}
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
              <Route index element={<Navigate to={`${MC_BASE}/attachments`} replace />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={`${MC_BASE}/attachments`} replace />} />
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

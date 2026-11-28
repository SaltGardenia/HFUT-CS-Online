import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { SEC_BASE, findCourseByBase } from './registry';
import { secChapters } from '../content/sec';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import { type SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import SecHomePage from '../pages/SecHomePage';
import SecChapterPage from '../pages/SecChapterPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 信息安全技术课搜索索引：章节目录（试题未收录，无试卷条目） */
function buildSecIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of secChapters) {
    const title = `${ch.no} ${decodeEntities(ch.title)}`;
    appendOutlineIndex(items, ch, title);
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  return items;
}

/** 信息安全技术课程根组件 —— 挂在 /sec/* 下；课件无第 5 章 PDF，试题未收录，不设在线练习页与导航按钮 */
export default function SecCourse() {
  const location = useLocation();

  const course = findCourseByBase(SEC_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/sec\/deck\/deck(?:[1-4]|6|7)$/);
    return m ? m[0].split('/').pop()! : null;
  }, [location.pathname]);

  const onAtt = location.pathname.startsWith(`${SEC_BASE}/attachments`);

  // 课程主题色：html[data-deck='sec'] → --deck-accent = 暗松绿
  useEffect(() => {
    document.documentElement.dataset.deck = 'sec';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：按序号前后翻页决定方向（deck 编号 1～4、6、7 直接用数字比大小）
  const chNo = currentChapter ? Number(currentChapter.slice(4)) : 0;
  const prevNoRef = useRef(0);
  const dir = chNo && prevNoRef.current && chNo !== prevNoRef.current ? Math.sign(chNo - prevNoRef.current) : 0;
  useEffect(() => {
    prevNoRef.current = chNo;
  }, [chNo]);

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

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // 顶栏导航：总目录 + 第1～4、6、7章 + 附件（导航栏本题未收录，无在线练习项）
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${SEC_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onAtt, key: null, tip: '课程首页 · 课程与资料概况' },
      ...secChapters.map((c) => ({
        to: `${SEC_BASE}/deck/${c.id}`,
        full: c.no,
        short: c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: c.id,
        tip: decodeEntities(c.title),
      })),
      {
        to: `${SEC_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试卷目录与下载',
      },
    ],
    [currentChapter, onAtt],
  );

  // 抽屉导航（首页条目由 SidebarContent 自带）
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${SEC_BASE}`, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onAtt },
      ...secChapters.map((c) => ({
        to: `${SEC_BASE}/deck/${c.id}`,
        no: c.no.replace('第', '').replace('章', ''),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: c.id,
      })),
      {
        to: `${SEC_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onAtt],
  );

  const searchIndex = useMemo(buildSecIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => `${SEC_BASE}/deck/${item.unit}?s=${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="信息安全技术"
        courseBase={SEC_BASE}
        courseTip="信息安全技术 · 课程资料"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      <div className={`shell-body${onAtt ? ' no-sidebar' : ''}`}>
        <Sidebar />
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={location.pathname}
            custom={dir}
            variants={{
              enter: (d: number) =>
                reduced ? { opacity: 0 } : d === 0 ? { opacity: 0, y: 12 } : { opacity: 0, x: 28 * d },
              center: { opacity: 1, x: 0, y: 0 },
              leave: (d: number) =>
                reduced ? { opacity: 0 } : d === 0 ? { opacity: 0, y: -8 } : { opacity: 0, x: -22 * d },
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Routes location={location}>
              <Route index element={<SecHomePage />} />
              <Route path="deck/:deckId" element={<SecChapterPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={SEC_BASE} replace />} />
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

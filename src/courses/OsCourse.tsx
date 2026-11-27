import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { OS_BASE, courses } from './registry';
import { osChapters, osPapers } from '../content/os';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import { type SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import OsHomePage from '../pages/OsHomePage';
import OsChapterPage from '../pages/OsChapterPage';
import OsPracticeIndex from '../pages/OsPracticeIndex';
import OsPaperPage from '../pages/OsPaperPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** OS 课程搜索索引：章节目录 + 试卷 */
function buildOsIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of osChapters) {
    const title = `${ch.no} ${decodeEntities(ch.title)}`;
    appendOutlineIndex(items, ch, title);
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const p of osPapers) {
    items.push({ kind: '试卷', unit: null, unitTitle: '在线练习 · 历年试卷', sectionId: p.id, text: p.title });
  }
  return items;
}

/** 操作系统课程根组件 —— 挂在 /os/* 下，布局与算法课同构（顶栏 + 侧栏 + 章节页/练习页） */
export default function OsCourse() {
  const location = useLocation();

  useEffect(() => {
    recordCourseView(courses[1].name);
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/os\/chapter\/(ch[1-8])/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onPractice = location.pathname.startsWith(`${OS_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${OS_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 课程主题色：html[data-deck='os'] → --deck-accent = 橄榄绿（首页/在线练习用）
  useEffect(() => {
    document.documentElement.dataset.deck = 'os';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：按章号前后翻页决定方向
  const chNo = currentChapter ? Number(currentChapter.slice(2)) : 0;
  // 当前章 → html[data-ch]：tokens.css 按序数映射每章专属色（首页/练习无 data-ch，用课程基础色）
  useEffect(() => {
    if (chNo) document.documentElement.dataset.ch = String(chNo);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [chNo]);
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

  // 顶栏导航：目录 + 第1～7章 + 大题精讲 + 在线练习（末位固定）
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${OS_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况', dot: 'var(--os)' },
      ...osChapters.map((c) => ({
        to: `${OS_BASE}/chapter/${c.id}`,
        full: c.no,
        short: c.id === 'ch8' ? '精讲' : c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: c.id,
        tip: decodeEntities(c.title),
      })),
      {
        to: `${OS_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: '在线练习 · 4 份试卷',
        extra: 'practice-tab',
      },
      {
        to: `${OS_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  // 抽屉导航（首页条目由 SidebarContent 自带）
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${OS_BASE}`, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt },
      ...osChapters.map((c) => ({
        to: `${OS_BASE}/chapter/${c.id}`,
        no: c.id === 'ch8' ? '讲' : c.no.replace('第', '').replace('章', ''),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: c.id,
      })),
      {
        to: `${OS_BASE}/practice`,
        no: '练',
        label: '在线练习 · 历年试卷',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${OS_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  const searchIndex = useMemo(buildOsIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit
      ? `${OS_BASE}/chapter/${item.unit}?s=${item.sectionId}`
      : `${OS_BASE}/practice/${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="操作系统"
        courseBase={OS_BASE}
        courseTip="操作系统 · 课程资料与在线练习"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${onPractice || onAtt ? ' no-sidebar' : ''}`}>
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
              <Route index element={<OsHomePage />} />
              <Route path="chapter/:chapterId" element={<OsChapterPage />} />
              <Route path="practice" element={<OsPracticeIndex />} />
              <Route path="practice/:paperId" element={<OsPaperPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={OS_BASE} replace />} />
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

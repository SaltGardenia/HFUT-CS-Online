import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { netChapters, netPapers, netHome } from '../content/net';
import { buildSlideReview } from '../content/net/slide-review';
import { buildNetSupplement } from '../content/net/supplement';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import NetHomePage from '../pages/NetHomePage';
import NetUnitPage from '../pages/NetUnitPage';
import NetPracticeListPage from '../pages/net/NetPracticeListPage';
import NetPracticePaperPage from '../pages/net/NetPracticePaperPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { NET_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 计网课搜索索引：各章目录 + 试卷入口 + 总目录 */
function buildNetIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of netChapters) {
    for (const t of buildNetSupplement(ch).toc) {
      items.push({kind:'章节',unit:ch.id,unitTitle:decodeEntities(ch.title)+' · 补充',sectionId:t.id,text:decodeEntities(t.text)});
    }
    for (const t of buildSlideReview(ch).chapter.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: decodeEntities(ch.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const p of netPapers) {
    items.push({ kind: '试卷', unit: null, unitTitle: '在线练习', sectionId: p.id, text: decodeEntities(p.title) });
  }
  for (const t of netHome.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

/**
 * 「计算机网络」课程根组件 —— 挂在 /net/* 下。
 * 布局与算法课完全一致（同一套上游样式），数据为计网八章 + 三套试卷。
 */
export default function NetworkCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(NET_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/net\/deck\/(ch[1-8])/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 课程页 → html[data-deck='net']：整套课程统一切换到计网主题色（深青）
  useEffect(() => {
    document.documentElement.dataset.deck = 'net';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：记录上一次的章号，前/后翻页用不同方向
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

  const practiceActive = location.pathname.startsWith(`${NET_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${NET_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = practiceActive ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [practiceActive, onAtt]);



  // 顶栏导航：总目录 + 第1~8章 + 在线练习 + 附件
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${NET_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !practiceActive && !onAtt, key: null, tip: '课程首页 · 八章总览', dot: 'var(--net)' },
      ...netChapters.map((d) => ({
        to: `${NET_BASE}/deck/${d.id}`,
        full: d.no,
        short: d.no.replace('第', '').replace('章', ''),
        active: d.id === currentChapter,
        key: 'net',
        tip: decodeEntities(d.title),
      })),
      {
        to: `${NET_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: practiceActive,
        key: null,
        tip: '在线练习 · 3 套期末试卷',
        extra: 'practice-tab',
      },
      {
        to: `${NET_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, practiceActive, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${NET_BASE}`, no: '◎', label: '总目录 · 八章总览', active: !currentChapter && !practiceActive && !onAtt },
      ...netChapters.map((d) => ({
        to: `${NET_BASE}/deck/${d.id}`,
        no: d.no.replace('第', '').replace('章', ''),
        label: d.title,
        active: d.id === currentChapter,
        deckKey: 'net',
      })),
      {
        to: `${NET_BASE}/practice`,
        no: '练',
        label: '在线练习 · 3 套试卷',
        active: practiceActive,
        navKey: 'practice',
      },
      {
        to: `${NET_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, practiceActive, onAtt],
  );

  // 搜索：章节/试卷索引 + 跳转路由
  const searchIndex = useMemo(buildNetIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => {
    if (item.kind === '试卷') return `${NET_BASE}/practice/${item.sectionId}`;
    return item.unit
      ? `${NET_BASE}/deck/${item.unit}?s=${item.sectionId}`
      : `${NET_BASE}/?s=${item.sectionId}`;
  };

  return (
    <div className="shell">
      <TopBar
        courseName="计算机网络"
        courseBase={NET_BASE}
        courseTip="计算机网络 · 课件讲义"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${practiceActive || onAtt ? ' no-sidebar' : ''}`}>
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
              <Route index element={<NetHomePage />} />
              <Route path="deck/:deckId" element={<NetUnitPage />} />
              <Route path="practice" element={<NetPracticeListPage />} />
              <Route path="practice/:paperId" element={<NetPracticePaperPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={NET_BASE} replace />} />
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

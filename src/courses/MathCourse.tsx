import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { MATH_BASE, courses, findCourseByBase } from './registry';
import { mathChapters, mathPapers, MATH_KIND_LABEL, MATH_SECTIONS } from '../content/math';
import { type SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex, appendPaperIndex } from '../lib/outlineSearch';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import MathHomePage from '../pages/MathHomePage';
import MathChapterPage from '../pages/MathChapterPage';
import MathPracticeIndex from '../pages/MathPracticeIndex';
import MathPaperPage from '../pages/MathPaperPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import QuestionBookPage, { buildBookEntries } from '../components/practice/books';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 高等数学搜索索引：章节目录 + 试卷 + 全部试题 */
function buildMathIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of mathChapters) {
    const title = `${ch.no} ${decodeEntities(ch.title)}`;
    appendOutlineIndex(items, ch, title);
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const p of mathPapers) {
    items.push({ kind: '试卷', unit: null, unitTitle: '在线练习 · 试卷', sectionId: p.id, text: p.title });
  }
  appendPaperIndex(items, mathPapers);
  return items;
}

/** 高等数学课程根组件 —— 挂在 /math/* 下，布局与算法课同构（顶栏 + 侧栏 + 章节页/练习页） */
/** MATH 试卷题目的书页条目：qid 与作答进度同一套 id，序号与答题页题卡一致 */
const MATH_BOOK_ENTRIES = buildBookEntries(
  mathPapers,
  MATH_KIND_LABEL,
);

export default function MathCourse() {
  const location = useLocation();

  useEffect(() => {
    const course = findCourseByBase(MATH_BASE) ?? courses[0];
    recordCourseView(course.name);
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/math\/chapter\/(ch\d+)/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onPractice = location.pathname.startsWith(`${MATH_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${MATH_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 课程主题色：html[data-deck='math'] → --deck-accent = 苔藓绿
  useEffect(() => {
    document.documentElement.dataset.deck = 'math';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：按章号前后翻页决定方向
  const chNo = currentChapter ? Number(currentChapter.slice(2)) : 0;
  // 当前章 → html[data-ch]：tokens.css 按课内序数（1..6）映射每章专属色（首页/练习无 data-ch，用课程基础色）
  const chIdx = currentChapter ? mathChapters.findIndex((c) => c.id === currentChapter) + 1 : 0;
  useEffect(() => {
    if (chIdx) document.documentElement.dataset.ch = String(chIdx);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [chIdx]);
  const prevNoRef = useRef(0);
  const dir = chNo && prevNoRef.current && chNo !== prevNoRef.current ? Math.sign(chNo - prevNoRef.current) : 0;
  useEffect(() => {
    prevNoRef.current = chNo;
  }, [chNo]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useScrollMemory(location, navType);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // 顶栏导航：总目录 + 第 8～13 章 + 在线练习 + 附件（末位固定）
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${MATH_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况', dot: 'var(--math)' },
      ...mathChapters.map((c) => ({
        to: `${MATH_BASE}/chapter/${c.id}`,
        full: c.no,
        short: c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: null,
        tip: decodeEntities(c.title),
      })),
      {
        to: `${MATH_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: `在线练习 · ${mathPapers.length} 份试卷`,
        extra: 'practice-tab',
      },
      {
        to: `${MATH_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${MATH_BASE}`, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt },
      ...mathChapters.map((c) => ({
        to: `${MATH_BASE}/chapter/${c.id}`,
        no: c.id.slice(2),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: 'math',
      })),
      {
        to: `${MATH_BASE}/practice`,
        no: '练',
        label: `在线练习 · ${mathPapers.length} 份试卷`,
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${MATH_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  const searchIndex = useMemo(buildMathIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit
      ? `${MATH_BASE}/chapter/${item.unit}?s=${item.sectionId}`
      : `${MATH_BASE}/practice/${item.sectionId}${item.questionId ? `?s=${item.questionId}` : ''}`;

  return (
    <div className="shell">
      <TopBar
        courseName="高等数学"
        courseBase={MATH_BASE}
        courseTip="高等数学 · 课程资料与在线练习"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页/附件页不上报目录（无侧栏），让正文占满整个版心 */}
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
              <Route index element={<MathHomePage />} />
              <Route path="chapter/:chapterId" element={<MathChapterPage />} />
              <Route path="practice" element={<MathPracticeIndex />} />
              {(['wrong', 'fav'] as const).map((kind) => (
                <Route
                  key={kind}
                  path={kind === 'wrong' ? 'practice/wrongbook' : 'practice/favorites'}
                  element={
                    <QuestionBookPage
                      kind={kind}
                      course="math"
                      base={MATH_BASE}
                      storeKey="math-practice-progress-v1"
                      entries={MATH_BOOK_ENTRIES}
                      tagNav={(t) => ({
                        href: `${MATH_BASE}/chapter/ch${t.deck}?s=${t.sec}`,
                        tip: `跳转到 ${MATH_SECTIONS[t.deck]?.[t.sec] ?? t.text} · ${t.text}`,
                      })}
                      tagDeckKey={() => 'math'}
                    />
                  }
                />
              ))}
              <Route path="practice/:paperId" element={<MathPaperPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={MATH_BASE} replace />} />
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

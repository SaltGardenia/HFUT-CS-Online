import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { DB_BASE, findCourseByBase } from './registry';
import { dbChapters, dbPapers, DB_KIND_LABEL } from '../content/db';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import { type SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import DbHomePage from '../pages/DbHomePage';
import DbChapterPage from '../pages/DbChapterPage';
import DbPracticeIndex from '../pages/DbPracticeIndex';
import DbPaperPage from '../pages/DbPaperPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import QuestionBookPage, { buildBookEntries } from '../components/practice/books';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 数据库系统课程搜索索引：章节目录 + 试卷 */
function buildDbIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of dbChapters) {
    const title = `${ch.no} ${decodeEntities(ch.title)}`;
    appendOutlineIndex(items, ch, title);
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const p of dbPapers) {
    items.push({ kind: '试卷', unit: null, unitTitle: '在线练习 · 历年试卷', sectionId: p.id, text: p.title });
  }
  return items;
}

/** 数据库系统课程根组件 —— 挂在 /db/* 下，布局与 OS 课同构（顶栏 + 侧栏 + 章节页/练习页/附件页） */
const dbBookLabel = (kind: string, qid: string) => {
  const m = qid.match(/^[a-z]\d+-[a-z](\d+)(?:-(\d+))?$/);
  const no = m ? m[1] : '';
  const sub = m && m[2] ? `-${m[2]}` : '';
  return `${DB_KIND_LABEL[kind as keyof typeof DB_KIND_LABEL]} ${no}${sub}`;
};

/** DB 试卷题目的书页条目：qid 与作答进度同一套 id，序号与答题页题卡一致 */
const DB_BOOK_ENTRIES = buildBookEntries(
  dbPapers,
  DB_KIND_LABEL,
  {
  labelOf: (q) => dbBookLabel(q.kind, q.id),
  },
);

export default function DbCourse() {
  const location = useLocation();

  const course = findCourseByBase(DB_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/db\/chapter\/(ch[1-9]|lab)/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onPractice = location.pathname.startsWith(`${DB_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${DB_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 课程主题色：html[data-deck='db'] → --deck-accent = 橄榄黄绿
  useEffect(() => {
    document.documentElement.dataset.deck = 'db';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：按序号前后翻页决定方向（lab 在末位按 10 计）
  const chNo = currentChapter
    ? currentChapter === 'lab'
      ? dbChapters.length
      : Number(currentChapter.slice(2))
    : 0;
  // 当前章 → html[data-ch]：tokens.css 按序数映射每章专属色（首页/练习无 data-ch，用课程基础色）
  useEffect(() => {
    if (currentChapter) document.documentElement.dataset.ch = String(chNo);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [currentChapter, chNo]);
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

  // 顶栏导航：总目录 + 第1～9章 + 实验 + 在线练习（末位固定）+ 附件
  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${DB_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况', dot: 'var(--db)' },
      ...dbChapters.map((c) => ({
        to: `${DB_BASE}/chapter/${c.id}`,
        full: c.no,
        short: c.id === 'lab' ? '实' : c.no.replace('第', '').replace('章', ''),
        active: c.id === currentChapter,
        key: c.id,
        tip: decodeEntities(c.title),
      })),
      {
        to: `${DB_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: '在线练习 · 5 份试卷',
        extra: 'practice-tab',
      },
      {
        to: `${DB_BASE}/attachments`,
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
      { to: `${DB_BASE}`, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt },
      ...dbChapters.map((c) => ({
        to: `${DB_BASE}/chapter/${c.id}`,
        no: c.id === 'lab' ? '实' : c.no.replace('第', '').replace('章', ''),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: c.id,
      })),
      {
        to: `${DB_BASE}/practice`,
        no: '练',
        label: '在线练习 · 历年试卷',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${DB_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  const searchIndex = useMemo(buildDbIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit
      ? `${DB_BASE}/chapter/${item.unit}?s=${item.sectionId}`
      : `${DB_BASE}/practice/${item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="数据库系统"
        courseBase={DB_BASE}
        courseTip="数据库系统 · 课程资料与在线练习"
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
              <Route index element={<DbHomePage />} />
              <Route path="chapter/:chapterId" element={<DbChapterPage />} />
              <Route path="practice" element={<DbPracticeIndex />} />
              {(['wrong', 'fav'] as const).map((kind) => (
                <Route
                  key={kind}
                  path={kind === 'wrong' ? 'practice/wrongbook' : 'practice/favorites'}
                  element={
                    <QuestionBookPage
                      kind={kind}
                      course="db"
                      base={DB_BASE}
                      storeKey="db-practice-progress-v1"
                      entries={DB_BOOK_ENTRIES}
                      tagNav={(t) => ({
                        href: `${DB_BASE}/chapter/ch${t.deck}?s=${t.sec}`,
                        tip: `跳转到 ${dbChapters.find((c) => c.id === `ch${t.deck}`)?.no ?? ''} · ${t.text}`,
                      })}
                      tagDeckKey={() => 'db'}
                    />
                  }
                />
              ))}
              <Route path="practice/:paperId" element={<DbPaperPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={DB_BASE} replace />} />
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

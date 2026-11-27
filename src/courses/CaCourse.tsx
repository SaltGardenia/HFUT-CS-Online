import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { CA_BASE, courses, findCourseByBase } from './registry';
import { caChapters, caPapers, CA_KIND_LABEL } from '../content/ca';
import TopBar, { type CourseTab, type CourseTabMenuItem } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import { type SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex, appendPaperIndex } from '../lib/outlineSearch';
import CaHomePage from '../pages/CaHomePage';
import CaChapterPage from '../pages/CaChapterPage';
import CaPracticeIndex from '../pages/CaPracticeIndex';
import CaPaperPage from '../pages/CaPaperPage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import QuestionBookPage, { buildBookEntries } from '../components/practice/books';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 讲次较多：导航栏用「单元」按钮 + 下拉菜单列出各讲（用户约定的高一级单位） */
const CA_UNITS: { name: string; tip: string; chapters: string[] }[] = [
  { name: '基础', tip: '第 1～3 讲 · 基本概念、性能评测、指令集架构', chapters: ['ch1', 'ch2', 'ch3'] },
  { name: '流水线', tip: '第 4～6 讲 · 数据通路、流水线基础、相关与冒险', chapters: ['ch4', 'ch5', 'ch6'] },
  { name: 'ILP', tip: '第 7～8 讲 · 指令级并行 I / II', chapters: ['ch7', 'ch8'] },
  { name: '存储系统', tip: '第 9～12 讲 · 存储层次、Cache、缓存优化、虚存', chapters: ['ch9', 'ch10', 'ch11', 'ch12'] },
  { name: '多核与一致性', tip: '第 13～14 讲 · 多核处理器、缓存一致性', chapters: ['ch13', 'ch14'] },
];

/** 计算机体系结构搜索索引：讲次目录 + 试卷 + 全部试题 */
function buildCaIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const ch of caChapters) {
    const title = `${ch.no} ${decodeEntities(ch.title)}`;
    appendOutlineIndex(items, ch, title);
    for (const t of ch.toc) {
      items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const p of caPapers) {
    items.push({ kind: '试卷', unit: null, unitTitle: '在线练习 · 试题', sectionId: p.id, text: p.title });
  }
  appendPaperIndex(items, caPapers);
  return items;
}

/** 计算机体系结构课程根组件 —— 挂在 /ca/* 下，布局与算法课同构（顶栏 + 侧栏 + 章节页/练习页） */
const caBookLabel = (kind: string, qid: string) => {
  const m = qid.match(/^q\d+-(\d+)$/);
  return `${CA_KIND_LABEL[kind as keyof typeof CA_KIND_LABEL]} ${m ? m[1] : qid}`;
};

/** CA 试卷题目的书页条目：qid 与作答进度同一套 id，序号与答题页题卡一致 */
const CA_BOOK_ENTRIES = buildBookEntries(
  caPapers,
  CA_KIND_LABEL,
  {
  labelOf: (q) => caBookLabel(q.kind, q.id),
  },
);

export default function CaCourse() {
  const location = useLocation();

  useEffect(() => {
    const course = findCourseByBase(CA_BASE) ?? courses[0];
    recordCourseView(course.name);
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/^\/ca\/chapter\/(ch\d+)/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onPractice = location.pathname.startsWith(`${CA_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${CA_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 课程主题色：html[data-deck='ca'] → --deck-accent = 暗酒红
  useEffect(() => {
    document.documentElement.dataset.deck = 'ca';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 章节方向性转场：按讲号前后翻页决定方向
  const chNo = currentChapter ? Number(currentChapter.slice(2)) : 0;
  // 当前讲 → html[data-ch]：tokens.css 按课内序数映射每讲专属色（首页/练习无 data-ch，用课程基础色）
  const chIdx = currentChapter ? caChapters.findIndex((c) => c.id === currentChapter) + 1 : 0;
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
      if (e.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useScrollMemory(location, navType);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  const chapterById = useMemo(() => new Map(caChapters.map((c) => [c.id, c])), []);

  // 顶栏导航：总目录 + 5 个单元（下拉列出各讲）+ 在线练习（末位固定）
  const tabs = useMemo<CourseTab[]>(() => {
    const groups: CourseTab[] = CA_UNITS.map((u) => {
      const menu: CourseTabMenuItem[] = u.chapters.map((id) => {
        const c = chapterById.get(id)!;
        return {
          to: `${CA_BASE}/chapter/${c.id}`,
          label: `${c.no} ${decodeEntities(c.title)}`,
          active: c.id === currentChapter,
          tip: decodeEntities(c.title),
        };
      });
      return {
        to: menu[0].to,
        full: u.name,
        short: u.name,
        active: u.chapters.includes(currentChapter ?? ''),
        key: currentChapter && u.chapters.includes(currentChapter) ? currentChapter : null,
        tip: u.tip,
        menu,
      };
    });
    return [
      { to: `${CA_BASE}`, full: '总目录', short: '目录', active: !currentChapter && !onPractice && !onAtt, key: null, tip: '课程首页 · 课程与资料概况' },
      ...groups,
      { to: `${CA_BASE}/practice`, full: '在线练习', short: '练习', active: onPractice, key: null, tip: '在线练习 · 3 份试题', extra: 'practice-tab', dot: 'var(--ca-practice)' },
      { to: `${CA_BASE}/attachments`, full: '附件', short: '附件', active: onAtt, key: null, tip: '附件资料 · 课件 / 试题 / 附件目录与预览', dot: 'var(--ca-att)' },
    ];
  }, [currentChapter, onPractice, onAtt, chapterById]);

  // 抽屉导航（首页条目由 SidebarContent 自带）：逐讲列出
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${CA_BASE}`, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt },
      ...caChapters.map((c) => ({
        to: `${CA_BASE}/chapter/${c.id}`,
        no: c.id.slice(2),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: c.id,
      })),
      {
        to: `${CA_BASE}/practice`,
        no: '练',
        label: '在线练习 · 试题',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${CA_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentChapter, onPractice, onAtt],
  );

  const searchIndex = useMemo(buildCaIndex, []);
  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit
      ? `${CA_BASE}/chapter/${item.unit}?s=${item.sectionId}`
      : `${CA_BASE}/practice/${item.sectionId}${item.questionId ? `?s=${item.questionId}` : ''}`;

  return (
    <div className="shell">
      <TopBar
        courseName="计算机体系结构"
        courseBase={CA_BASE}
        courseTip="计算机体系结构 · 课程资料与在线练习"
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
              <Route index element={<CaHomePage />} />
              <Route path="chapter/:chapterId" element={<CaChapterPage />} />
              <Route path="practice" element={<CaPracticeIndex />} />
              {(['wrong', 'fav'] as const).map((kind) => (
                <Route
                  key={kind}
                  path={kind === 'wrong' ? 'practice/wrongbook' : 'practice/favorites'}
                  element={
                    <QuestionBookPage
                      kind={kind}
                      course="ca"
                      storeKey="ca-practice-progress-v1"
                      entries={CA_BOOK_ENTRIES}
                      tagNav={(t) => ({
                        href: `${CA_BASE}/chapter/ch${t.deck}?s=${t.sec}`,
                        tip: `跳转到 ${caChapters.find((c) => c.id === `ch${t.deck}`)?.no ?? ''} · ${t.text}`,
                      })}
                      tagDeckKey={() => 'ca'}
                    />
                  }
                />
              ))}
              <Route path="practice/:paperId" element={<CaPaperPage />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={CA_BASE} replace />} />
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

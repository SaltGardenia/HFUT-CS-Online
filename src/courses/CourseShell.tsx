import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import type { CourseSpec } from '../content/courses/types';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import GenHomePage from '../pages/courses/GenHomePage';
import GenChapterPage from '../pages/courses/GenChapterPage';
import GenPracticeIndex from '../pages/courses/GenPracticeIndex';
import GenPaperPage from '../pages/courses/GenPaperPage';
import { findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/**
 * 通用课程外壳 —— 大二下 12 门课共用。
 * 顶栏（总目录 + 各章/单元 + 在线练习 + 附件）、侧栏、章节页、练习页、附件页
 * 全部来自同一套上游组件与样式，各课程只提供 src/content/courses 里的数据。
 */
export default function CourseShell({ spec }: { spec: CourseSpec }) {
  const location = useLocation();
  const { base, key } = spec;
  const storeKey = `${key}-practice-progress-v1`;

  const course = findCourseByBase(base);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const chapterById = useMemo(() => new Map(spec.chapters.map((c) => [c.id, c])), [spec.chapters]);

  // 当前章：/deck/deckN 里的 N 就是课件章号（章号有缺号时按实际章号）
  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/\/deck\/(deck\d+)$/);
    return m ? m[1] : null;
  }, [location.pathname]);
  const chNo = currentChapter ? Number(currentChapter.slice(4)) : 0;

  const onPractice = location.pathname.startsWith(`${base}/practice`);
  const onAtt = location.pathname.startsWith(`${base}/attachments`);

  // 课程主题色：html[data-deck='<key>']
  useEffect(() => {
    document.documentElement.dataset.deck = key;
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, [key]);

  // 当前章 → html[data-ch]：tokens.css 按章号映射每章专属色
  useEffect(() => {
    if (chNo) document.documentElement.dataset.ch = String(chNo);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [chNo]);

  // 练习 / 附件页专属色：html[data-pg]
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useScrollMemory(location, navType);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // 顶栏导航：总目录 + 各章（章节多时用单元下拉）+ 在线练习 + 附件
  const tabs = useMemo<CourseTab[]>(() => {
    const list: CourseTab[] = [
      {
        to: base,
        full: '总目录',
        short: '目录',
        active: !currentChapter && !onPractice && !onAtt,
        key: null,
        tip: '课程首页 · 课程与资料概况',
      },
    ];
    if (spec.units?.length) {
      for (const u of spec.units) {
        const chapters = u.chapters.map((id) => chapterById.get(id)).filter(Boolean) as CourseSpec['chapters'];
        if (!chapters.length) continue;
        const menu = chapters.map((c) => ({
          to: `${base}/deck/${c.id}`,
          label: `${c.no} ${decodeEntities(c.title)}`,
          active: c.id === currentChapter,
          tip: decodeEntities(c.title),
        }));
        list.push({
          to: menu[0].to,
          full: u.label,
          short: u.short,
          active: u.chapters.includes(currentChapter ?? ''),
          key: null,
          tip: menu.map((m) => m.label).join(' / '),
          menu,
        });
      }
    } else {
      for (const c of spec.chapters) {
        list.push({
          to: `${base}/deck/${c.id}`,
          full: c.no,
          short: c.no.replace(/^第/, '').replace(/[章讲]$/, ''),
          active: c.id === currentChapter,
          key: c.id,
          tip: decodeEntities(c.title),
        });
      }
    }
    if (spec.papers.length) {
      list.push({
        to: `${base}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: `在线练习 · ${spec.papers.length} 份试卷`,
        extra: 'practice-tab',
      });
    }
    list.push({
      to: `${base}/attachments`,
      full: '附件',
      short: '附件',
      active: onAtt,
      key: null,
      tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
    });
    return list;
  }, [base, chapterById, currentChapter, onAtt, onPractice, spec.chapters, spec.papers.length, spec.units]);

  const nav = useMemo<NavEntry[]>(
    () => [
      { to: base, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt },
      ...spec.chapters.map((c) => ({
        to: `${base}/deck/${c.id}`,
        no: c.no.replace(/^第/, '').replace(/[章讲]$/, ''),
        label: decodeEntities(c.title),
        active: c.id === currentChapter,
        deckKey: c.id,
      })),
      ...(spec.papers.length
        ? [
            {
              to: `${base}/practice`,
              no: '练',
              label: `在线练习 · ${spec.papers.length} 份试卷`,
              active: onPractice,
              navKey: 'practice',
            },
          ]
        : []),
      { to: `${base}/attachments`, no: '件', label: '附件资料', active: onAtt },
    ],
    [base, currentChapter, onAtt, onPractice, spec.chapters, spec.papers.length],
  );

  const searchIndex = useMemo<SearchIndexItem[]>(() => {
    const items: SearchIndexItem[] = [];
    for (const ch of spec.chapters) {
      const title = `${ch.no} ${decodeEntities(ch.title)}`;
      appendOutlineIndex(items, ch, title);
      for (const t of ch.toc) {
        items.push({ kind: '章节', unit: ch.id, unitTitle: title, sectionId: t.id, text: decodeEntities(t.text) });
      }
    }
    for (const p of spec.papers) {
      items.push({ kind: '试卷', unit: null, unitTitle: '在线练习 · 试卷', sectionId: p.id, text: p.title });
      for (const q of p.questions) {
        for (const t of q.tags) {
          items.push({
            kind: '题目',
            unit: null,
            unitTitle: p.title,
            sectionId: p.id,
            text: t.text,
          });
        }
      }
    }
    return items;
  }, [spec.chapters, spec.papers]);

  const searchLinkTo = (item: SearchIndexItem) =>
    item.unit ? `${base}/deck/${item.unit}?s=${item.sectionId}` : `${base}/practice/${item.sectionId}`;

  const fullBleed = onPractice || onAtt;

  return (
    <div className="shell">
      <TopBar
        courseName={spec.name}
        courseBase={base}
        courseTip={spec.tip}
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      <div className={`shell-body${fullBleed ? ' no-sidebar' : ''}`}>
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
              <Route index element={<GenHomePage spec={spec} />} />
              {spec.chapters.length > 0 && (
                <Route
                  path="deck/:deckId"
                  element={<GenChapterPage base={base} chapters={spec.chapters} unit={spec.unit} />}
                />
              )}
              {spec.papers.length > 0 && (
                <>
                  <Route path="practice" element={<GenPracticeIndex spec={spec} storeKey={storeKey} />} />
                  <Route
                    path="practice/:paperId"
                    element={<GenPaperPage spec={spec} storeKey={storeKey} />}
                  />
                </>
              )}
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={base} replace />} />
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

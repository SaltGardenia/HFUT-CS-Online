import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { aiPaper } from '../content/ai';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendPaperIndex } from '../lib/outlineSearch';
import AiPracticePage from '../pages/ai/AiPracticePage';
import { AI_PRACTICE_STORE_KEY } from '../pages/ai/AiPracticePage';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import QuestionBookPage, { type BookEntry } from '../components/practice/books';
import { AI_BASE, findCourseByBase } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 人工智能课搜索索引：5 个方向 + 15 个设计题目（题干/要求整段可检索） */
function buildAiIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const sec of aiPaper.sections) {
    items.push({ kind: '方向', unit: null, unitTitle: '设计报告题库', sectionId: sec.id, text: decodeEntities(sec.title) });
  }
  appendPaperIndex(items, [aiPaper]);
  return items;
}

/**
 * 「人工智能原理」课程根组件 —— 挂在 /ai/* 下。
 * 课件为 0：本课程只含设计报告题库的在线练习（单试卷直接展示），
 * 布局与算法课完全一致（同一套上游样式），主题色为品红（--ai）。
 */
/** AI 试题的书页条目：题号按题库全序，短标取所属方向（与答题页 seqOf 一致） */
const AI_BOOK_ENTRIES: BookEntry[] = aiPaper.questions.map((q) => {
  const sec = aiPaper.sections.find((x) => x.questionIds.includes(q.id));
  const no = aiPaper.questions.findIndex((x) => x.id === q.id) + 1;
  return { qid: q.id, quiz: q, label: `${sec?.short ?? '题目'} ${no}`, paper: aiPaper.title };
});

export default function AiCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  const course = findCourseByBase(AI_BASE);
  useEffect(() => {
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 课程页 → html[data-deck='ai']：整套课程统一切换到人工智能主题色（品红）
  useEffect(() => {
    document.documentElement.dataset.deck = 'ai';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

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

  const practicePath = `${AI_BASE}/practice`;
  const onAtt = location.pathname.startsWith(`${AI_BASE}/attachments`);
  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = !onAtt ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);

  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent（不与总目录、各章重复）
  useEffect(() => {
    const pg = !onAtt ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onAtt]);


  // 顶栏导航：仅 在线练习 + 附件（本课无课件，不做知识总结页；方向选择在练习页热力图内完成）
  const tabs = useMemo<CourseTab[]>(
    () => [
      {
        to: practicePath,
        full: '在线练习',
        short: '练习',
        active: !onAtt,
        key: null,
        tip: '设计报告题库 · 15 个选题',
        extra: 'practice-tab',
      },
      {
        to: `${AI_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [onAtt],
  );

  // 抽屉导航：仅 在线练习 + 附件
  const nav = useMemo<NavEntry[]>(
    () => [
      {
        to: practicePath,
        no: '练',
        label: '在线练习 · 设计报告题库',
        active: !onAtt,
        navKey: 'practice',
      },
      {
        to: `${AI_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [onAtt],
  );

  // 搜索：方向/题目索引 + 跳转（同页 ?s= 定位；试题命中定位到具体题）
  const searchIndex = useMemo(buildAiIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => `${practicePath}?s=${item.questionId ?? item.sectionId}`;

  return (
    <div className="shell">
      <TopBar
        courseName="人工智能原理"
        courseBase={AI_BASE}
        courseTip="人工智能原理 · 设计报告题库"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 题库全程都是练习页：不上侧栏，正文占满整个版心 */}
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
              <Route index element={<Navigate to={practicePath} replace />} />
              <Route path="practice" element={<AiPracticePage />} />
              <Route
                path="practice/wrongbook"
                element={
                  <QuestionBookPage
                    kind="wrong"
                    course="ai"
                    storeKey={AI_PRACTICE_STORE_KEY}
                    entries={AI_BOOK_ENTRIES}
                    tagNav={(t) => {
                      const sec = aiPaper.sections.find((x) => x.no === t.deck);
                      return {
                        href: `${AI_BASE}/practice?s=${t.sec}`,
                        tip: `跳转到 ${sec ? sec.title : '题库方向'} · ${t.text}`,
                      };
                    }}
                    tagDeckKey={() => 'ai'}
                  />
                }
              />
              <Route
                path="practice/favorites"
                element={
                  <QuestionBookPage
                    kind="fav"
                    course="ai"
                    storeKey={AI_PRACTICE_STORE_KEY}
                    entries={AI_BOOK_ENTRIES}
                    tagNav={(t) => {
                      const sec = aiPaper.sections.find((x) => x.no === t.deck);
                      return {
                        href: `${AI_BASE}/practice?s=${t.sec}`,
                        tip: `跳转到 ${sec ? sec.title : '题库方向'} · ${t.text}`,
                      };
                    }}
                    tagDeckKey={() => 'ai'}
                  />
                }
              />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={practicePath} replace />} />
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

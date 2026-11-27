import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { patDecks, patHome, papers } from '../content/pat';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import PatHome from '../pages/pat/Home';
import PatDeck from '../pages/pat/Deck';
import PatPractice from '../pages/pat/Practice';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import { PAT_BASE } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 本课程的搜索索引：讲次目录 + 课程首页目录 + 赛题（跳在线练习） */
export function buildPatIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const deck of patDecks) {
    appendOutlineIndex(items, deck);
    for (const t of deck.toc) {
      if (t.level !== 2) continue;
      items.push({ kind: '章节', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const paper of papers) {
    for (const q of paper.questions) {
      items.push({
        kind: '题目',
        unit: null,
        unitTitle: '在线练习',
        sectionId: q.id,
        text: `${q.no}. ${q.title}`,
      });
    }
  }
  appendOutlineIndex(items, patHome, '总目录', null);
  for (const t of patHome.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '课程主页', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

/**
 * 「程序设计艺术与方法」课程根组件 —— 挂在 /pat/* 下。
 * 布局与交互完全复用上游组件（TopBar/Sidebar/抽屉/页面骨架），
 * 课程只注入自己的数据：三讲课件 + 讲义六章 + 省赛在线练习。
 */
export default function PatCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  useEffect(() => {
    recordCourseView('程序设计艺术与方法');
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(/^\/pat\/deck\/(deck[1-6])/);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 整门课程共用一个主题色（青碧）：html[data-deck='pat'] → --deck-accent
  useEffect(() => {
    document.documentElement.dataset.deck = 'pat';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 当前讲 → html[data-ch]：tokens.css 按序数映射每讲专属色（首页/练习无 data-ch，用课程基础色）
  const deckNo = currentDeck ? Number(currentDeck.slice(4)) : 0;
  useEffect(() => {
    if (deckNo) document.documentElement.dataset.ch = String(deckNo);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [deckNo]);

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

  // 顶栏导航：总目录 + 三讲 + 讲义三章 + 在线练习 + 附件
  const onPractice = location.pathname.startsWith(`${PAT_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${PAT_BASE}/attachments`);
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

  const tabs = useMemo<CourseTab[]>(
    () => [
      { to: `${PAT_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与课程实验', dot: 'var(--pat)' },
      ...patDecks.map((d) => ({
        to: `${PAT_BASE}/deck/${d.id}`,
        full: d.no,
        short: d.id === 'deck1' ? '1' : d.id === 'deck2' ? '2' : d.id === 'deck3' ? '3' : d.id === 'deck4' ? '4' : d.id === 'deck5' ? '5' : '6',
        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
      })),
      {
        to: `${PAT_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: '在线练习 · 2019 省赛 12 题',
        extra: 'practice-tab',
      },
      {
        to: `${PAT_BASE}/attachments`,
        full: '附件',
        short: '附件',
        active: onAtt,
        key: null,
        tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
      },
    ],
    [currentDeck, onPractice, onAtt],
  );

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: `${PAT_BASE}`, no: '◎', label: '课程主页 · 内容地图', active: !currentDeck && !onPractice && !onAtt },
      ...patDecks.map((d) => ({
        to: `${PAT_BASE}/deck/${d.id}`,
        no: d.id === 'deck1' ? '1' : d.id === 'deck2' ? '2' : d.id === 'deck3' ? '3' : d.id === 'deck4' ? '4' : d.id === 'deck5' ? '5' : '6',
        label: d.title,
        active: d.id === currentDeck,
        // 整课一个主题色：data-deck='pat' → --pat（不用算法课的 deckN 配色）
        deckKey: 'pat',
      })),
      {
        to: `${PAT_BASE}/practice`,
        no: '练',
        label: '在线练习 · 省赛 12 题',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${PAT_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentDeck, onPractice, onAtt],
  );

  // 搜索：讲次/课程主页目录 + 赛题索引
  const searchIndex = useMemo(buildPatIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => {
    if (item.unit) return `${PAT_BASE}/deck/${item.unit}?s=${item.sectionId}`;
    // 赛题条目跳在线练习并定位到题；其余为课程主页目录
    return item.unitTitle === '在线练习'
      ? `${PAT_BASE}/practice?s=${item.sectionId}`
      : `${PAT_BASE}/?s=${item.sectionId}`;
  };

  return (
    <div className="shell pat-scope">
      <TopBar
        courseName="程序设计艺术与方法"
        courseBase={PAT_BASE}
        courseTip="程序设计艺术与方法 · ICPC 竞赛基础课"
        tabs={tabs}
        searchIndex={searchIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${onPractice || onAtt ? ' no-sidebar' : ''}`}>
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
              <Route index element={<PatHome />} />
              <Route path="deck/:deckId" element={<PatDeck />} />
              <Route path="practice" element={<PatPractice />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={PAT_BASE} replace />} />
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

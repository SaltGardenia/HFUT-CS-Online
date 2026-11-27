import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { useScrollMemory } from '../lib/scrollMemory';
import { physDecks, physHome, physPapers, type PhysQuestion } from '../content/phys';
import TopBar, { type CourseTab } from '../components/TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../components/Sidebar';
import MobileDrawer from '../components/MobileDrawer';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex } from '../lib/outlineSearch';
import PhysHome from '../pages/phys/Home';
import PhysDeck from '../pages/phys/Deck';
import PhysPracticeList from '../pages/phys/PracticeList';
import PhysPracticePaper, { paperGroups } from '../pages/phys/PracticePaper';
import { PHYS_PRACTICE_STORE_KEY } from '../pages/phys/PracticeList';
import CourseAttachmentsPage from '../pages/CourseAttachmentsPage';
import QuestionBookPage, { type BookEntry } from '../components/practice/books';
import { PHYS_BASE } from './registry';
import { recordCourseView } from '../lib/recentCourses';
import { decodeEntities } from '../lib/text';

/** 本课程的搜索索引：章目录 + 课程主页目录 + 试卷题目（跳在线练习） */
export function buildPhysIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const deck of physDecks) {
    appendOutlineIndex(items, deck);
    for (const t of deck.toc) {
      if (t.level !== 2) continue;
      items.push({ kind: '章节', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
  }
  for (const paper of physPapers) {
    for (const q of paper.questions) {
      items.push({
        kind: '题目',
        unit: null,
        unitTitle: '在线练习',
        sectionId: q.id,
        text: `${q.no} ${q.title}`,
      });
    }
  }
  appendOutlineIndex(items, physHome, '总目录', null);
  for (const t of physHome.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '课程主页', sectionId: t.id, text: decodeEntities(t.text) });
  }
  return items;
}

const DECK_ID_RE = /^\/phys\/deck\/(deck(?:[1-9]|1[0-2]))$/;

/**
 * 「大学物理」课程根组件 —— 挂在 /phys/* 下。
 * 布局与交互完全复用上游组件（TopBar/Sidebar/抽屉/页面骨架），
 * 课程只注入自己的数据：12 章课件精讲 + 4 份期末试卷在线练习。
 */
/** 大学物理试卷题目的书页条目：qid 与作答进度一致（`${paperId}:${qid}`），序号按大题重新编号；
 *  calc 题与 essay 的答题区交互一致，统一按 essay 交给题卡渲染（与答题页相同） */
const PHYS_BOOK_ENTRIES: BookEntry[] = physPapers.flatMap((paper) =>
  paperGroups(paper).flatMap((sec) =>
    sec.questionIds
      .map((id) => paper.questions.find((q) => q.id === id))
      .filter((q): q is PhysQuestion => Boolean(q))
      .map((q, i) => ({
        qid: `${paper.id}:${q.id}`,
        quiz: { ...q, kind: 'essay' as const },
        label: `${sec.short} ${i + 1}`,
        paper: paper.title,
      })),
  ),
);

export default function PhysCourse() {
  const location = useLocation();

  // 记录「最近查看」（本地 localStorage），供首页最近查看板块使用
  useEffect(() => {
    recordCourseView('大学物理');
  }, []);
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentDeck = useMemo(() => {
    const m = location.pathname.match(DECK_ID_RE);
    return m ? m[1] : null;
  }, [location.pathname]);

  // 整门课程共用一个主题色（藕紫）：html[data-deck='phys'] → --deck-accent
  useEffect(() => {
    document.documentElement.dataset.deck = 'phys';
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, []);

  // 当前章 → html[data-ch]：tokens.css 按序数映射每章专属色（首页/练习无 data-ch，用课程基础色）
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

  // 顶栏导航：总目录 + 十二章 + 在线练习 + 附件
  const onPractice = location.pathname.startsWith(`${PHYS_BASE}/practice`);
  const onAtt = location.pathname.startsWith(`${PHYS_BASE}/attachments`);
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
      { to: `${PHYS_BASE}`, full: '总目录', short: '目录', active: !currentDeck && !onPractice && !onAtt, key: null, tip: '课程主页 · 内容地图与参考资料', dot: 'var(--phys)' },
      ...physDecks.map((d, i) => ({
        to: `${PHYS_BASE}/deck/${d.id}`,
        full: d.no,
        short: String(i + 1),
        active: d.id === currentDeck,
        key: null,
        tip: decodeEntities(d.title),
      })),
      {
        to: `${PHYS_BASE}/practice`,
        full: '在线练习',
        short: '练习',
        active: onPractice,
        key: null,
        tip: '在线练习 · 4 份期末试卷 42 题',
        extra: 'practice-tab',
      },
      {
        to: `${PHYS_BASE}/attachments`,
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
      { to: `${PHYS_BASE}`, no: '◎', label: '课程主页 · 内容地图', active: !currentDeck && !onPractice && !onAtt },
      ...physDecks.map((d, i) => ({
        to: `${PHYS_BASE}/deck/${d.id}`,
        no: String(i + 1),
        label: `${d.no} ${d.title}`,
        active: d.id === currentDeck,
        // 整课一个主题色：data-deck='phys' → --phys（不用算法课的 deckN 配色）
        deckKey: 'phys',
      })),
      {
        to: `${PHYS_BASE}/practice`,
        no: '练',
        label: '在线练习 · 4 份期末试卷',
        active: onPractice,
        navKey: 'practice',
      },
      {
        to: `${PHYS_BASE}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [currentDeck, onPractice, onAtt],
  );

  // 搜索：章/课程主页目录 + 试卷题目索引
  const searchIndex = useMemo(buildPhysIndex, []);
  const searchLinkTo = (item: SearchIndexItem) => {
    if (item.unit) return `${PHYS_BASE}/deck/${item.unit}?s=${item.sectionId}`;
    // 题目条目跳在线练习并定位到题；其余为课程主页目录
    return item.unitTitle === '在线练习'
      ? `${PHYS_BASE}/practice?s=${item.sectionId}`
      : `${PHYS_BASE}/?s=${item.sectionId}`;
  };

  return (
    <div className="shell phys-scope">
      <TopBar
        courseName="大学物理"
        courseBase={PHYS_BASE}
        courseTip="大学物理 · 力学 热学 电磁学 光学"
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
              <Route index element={<PhysHome />} />
              <Route path="deck/:deckId" element={<PhysDeck />} />
              <Route path="practice" element={<PhysPracticeList />} />
              {(['wrong', 'fav'] as const).map((kind) => (
                <Route
                  key={kind}
                  path={kind === 'wrong' ? 'practice/wrongbook' : 'practice/favorites'}
                  element={
                    <QuestionBookPage
                      kind={kind}
                      course="phys"
                      storeKey={PHYS_PRACTICE_STORE_KEY}
                      entries={PHYS_BOOK_ENTRIES}
                      tagNav={(t) => {
                        if (t.deck === 0) {
                          return { href: PHYS_BASE, tip: `本库课件未收录该专题 · ${t.text}` };
                        }
                        return {
                          href: `${PHYS_BASE}/deck/deck${t.deck}?s=${t.sec}`,
                          tip: `跳转到 第 ${t.deck} 章 · ${t.text}`,
                        };
                      }}
                      tagDeckKey={() => 'phys'}
                    />
                  }
                />
              ))}
              <Route path="practice/:paperId" element={<PhysPracticePaper />} />
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={PHYS_BASE} replace />} />
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

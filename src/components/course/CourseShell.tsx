import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigationType, useParams } from 'react-router-dom';
import { useScrollMemory } from '../../lib/scrollMemory';
import type { CourseConfig } from '../../content/course-types';
import { findCourseByBase } from '../../courses/registry';
import TopBar, { type CourseTab, type CourseTabMenuItem } from '../TopBar';
import Sidebar, { SidebarContent, type NavEntry } from '../Sidebar';
import MobileDrawer from '../MobileDrawer';
import type { SearchIndexItem } from '../SearchBox';
import { appendOutlineIndex, appendPaperIndex } from '../../lib/outlineSearch';
import { useAttachmentSearchIndex } from '../../lib/attachmentSearch';
import CourseHomeView from './CourseHomeView';
import CourseChapterView from './CourseChapterView';
import CoursePracticeIndex from './CoursePracticeIndex';
import CoursePaperView from './CoursePaperView';
import CourseAttachmentsPage from '../../pages/CourseAttachmentsPage';
import QuestionBookPage, { buildBookEntries } from '../practice/books';
import { recordCourseView } from '../../lib/recentCourses';
import { decodeEntities } from '../../lib/text';

/** 课程内额外页面（如数据结构的可视化）：顶栏 tab 插在「在线练习」左侧 */
export interface CourseExtraPage {
  /** 相对课程 base 的路径段，如 visual */
  path: string;
  full: string;
  short: string;
  tip: string;
  /** 侧栏/抽屉里的序号与文字 */
  navNo: string;
  navLabel: string;
  /** 正文占满版心（不显示目录侧栏） */
  fullWidth?: boolean;
  /** 路由路径；需要参数时写 visual/:algorithmId? */
  routePath?: string;
  /** 自定义左侧栏（不传则用本页目录） */
  sidebar?: ReactNode;
  element: ReactNode;
}

/**
 * 课程外壳：顶栏 + 侧栏 + 四个页面（总目录 / 章节 / 在线练习 / 附件）。
 * 样式全部来自全站共享 CSS（base.css / tokens.css）；课程页只提供数据与配置，
 * 后续统一调整版式只需改样式与这里，无需逐课修改。
 */
export default function CourseShell({ config, extras = [] }: { config: CourseConfig; extras?: CourseExtraPage[] }) {
  const location = useLocation();
  const navType = useNavigationType();
  const reduced = useReducedMotion();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 错题本/收藏本：一门课一份账（slug 取路由前缀），覆盖本课全部试卷题集
  const courseSlug = config.base.replace(/^\//, '');
  const bookEntries = useMemo(() => buildBookEntries(config.papers, config.kindLabel), [config]);

  useEffect(() => {
    const course = findCourseByBase(config.base);
    if (course) recordCourseView(course.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentChapter = useMemo(() => {
    const m = location.pathname.match(/\/chapter\/([^/?]+)/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const onPractice = location.pathname.startsWith(`${config.base}/practice`);
  const onAtt = location.pathname.startsWith(`${config.base}/attachments`);
  const onExtra = extras.find((e) => location.pathname.startsWith(`${config.base}/${e.path}`)) ?? null;

  // 练习/附件页专属色：html[data-pg] → tokens.css 覆盖 --deck-accent
  useEffect(() => {
    const pg = onPractice ? 'practice' : onAtt ? 'att' : null;
    if (pg) document.documentElement.dataset.pg = pg;
    else delete document.documentElement.dataset.pg;
    return () => {
      delete document.documentElement.dataset.pg;
    };
  }, [onPractice, onAtt]);

  // 课程主题色：html[data-deck]
  // 每次路由变化都重新声明：子页面卸载时可能清掉它（如模拟器），否则主题会回落成全局红色。
  useEffect(() => {
    document.documentElement.dataset.deck = config.deckKey;
    return () => {
      delete document.documentElement.dataset.deck;
    };
  }, [config.deckKey, location.pathname]);

  // 当前章 → html[data-ch]：tokens.css 按课内序数映射每章专属色
  const chIdx = currentChapter ? config.chapters.findIndex((c) => c.id === currentChapter) + 1 : 0;
  useEffect(() => {
    if (chIdx) document.documentElement.dataset.ch = String(chIdx);
    else delete document.documentElement.dataset.ch;
    return () => {
      delete document.documentElement.dataset.ch;
    };
  }, [chIdx]);

  // 章节方向性转场：按章序前后翻页决定方向
  const prevIdxRef = useRef(0);
  const dir = chIdx && prevIdxRef.current && chIdx !== prevIdxRef.current ? Math.sign(chIdx - prevIdxRef.current) : 0;
  useEffect(() => {
    prevIdxRef.current = chIdx;
  }, [chIdx]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useScrollMemory(location, navType);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // 顶栏导航：总目录 + 各章（章节多时按单元分组）+ 在线练习 + 附件（末位固定）
  const tabs = useMemo<CourseTab[]>(() => {
    const head: CourseTab = {
      to: config.base,
      full: '总目录',
      short: '目录',
      active: !currentChapter && !onPractice && !onAtt && !onExtra,
      key: null,
      tip: '课程首页 · 课程与资料概况',
    };
    const chapterTab = (c: (typeof config.chapters)[number]): CourseTab => ({
      to: `${config.base}/chapter/${c.id}`,
      full: c.no,
      short: c.no.replace(/^第/, '').replace(/[章讲]$/, ''),
      active: c.id === currentChapter,
      key: null,
      tip: decodeEntities(c.title),
    });
    const practiceTab: CourseTab | null = config.papers.length
      ? {
          to: `${config.base}/practice`,
          full: '在线练习',
          short: '练习',
          active: onPractice,
          key: null,
          tip: config.singlePaperDirect
            ? '在线练习 · 期末试卷'
            : `在线练习 · ${config.papers.length} 份试卷`,
          extra: 'practice-tab',
        }
      : null;
    const attTab: CourseTab = {
      to: `${config.base}/attachments`,
      full: '附件',
      short: '附件',
      active: onAtt,
      key: null,
      tip: '附件资料 · 课件 / 试题 / 附件目录与预览',
    };

    let middle: CourseTab[];
    if (config.units?.length) {
      middle = config.units.map((u) => {
        const menu: CourseTabMenuItem[] = u.chapterIds.map((id) => {
          const c = config.chapters.find((x) => x.id === id)!;
          return {
            to: `${config.base}/chapter/${c.id}`,
            label: `${c.no} ${decodeEntities(c.title)}`,
            active: c.id === currentChapter,
            tip: decodeEntities(c.title),
          };
        });
        return {
          to: `${config.base}/chapter/${u.chapterIds[0]}`,
          full: u.label,
          short: u.label,
          active: u.chapterIds.includes(currentChapter ?? ''),
          key: null,
          tip: u.tip,
          menu,
        };
      });
    } else {
      middle = config.chapters.map(chapterTab);
    }

    return [head, ...middle, ...extras.map(extraTab), ...(practiceTab ? [practiceTab] : []), attTab].filter(Boolean) as CourseTab[];
  }, [config, currentChapter, onPractice, onAtt, onExtra, extras]);

  function extraTab(e: CourseExtraPage): CourseTab {
    return {
      to: `${config.base}/${e.path}`,
      full: e.full,
      short: e.short,
      active: onExtra?.path === e.path,
      key: null,
      tip: e.tip,
    };
  }

  // 抽屉导航：首页条目由 SidebarContent 自带，这里只给课程内条目
  const nav = useMemo<NavEntry[]>(
    () => [
      { to: config.base, no: '◎', label: '总目录 · 课程概况', active: !currentChapter && !onPractice && !onAtt && !onExtra },
      ...config.chapters.map((c) => ({
        to: `${config.base}/chapter/${c.id}`,
        no: c.no.replace(/^第/, '').replace(/[章讲]$/, ''),
        label: c.title,
        active: c.id === currentChapter,
        deckKey: config.deckKey,
      })),
      ...extras.map((e) => ({
        to: `${config.base}/${e.path}`,
        no: e.navNo,
        label: e.navLabel,
        active: onExtra?.path === e.path,
      })),
      ...(config.papers.length
        ? [
            {
              to: `${config.base}/practice`,
              no: '练',
              label: config.singlePaperDirect
                ? '在线练习 · 期末试卷'
                : `在线练习 · ${config.papers.length} 份试卷`,
              active: onPractice,
              navKey: 'practice',
            },
          ]
        : []),
      {
        to: `${config.base}/attachments`,
        no: '件',
        label: '附件资料',
        active: onAtt,
      },
    ],
    [config, currentChapter, onPractice, onAtt, onExtra, extras],
  );

  // 纯附件课（无章节与试卷）：课程内容即附件清单，按文件名检索
  const attachmentIndex = useAttachmentSearchIndex(config.base, !config.chapters.length && !config.papers.length);
  const searchIndex = useMemo<SearchIndexItem[]>(() => {
    const items: SearchIndexItem[] = [];
    for (const ch of config.chapters) {
      const title = `${ch.no} ${decodeEntities(ch.title)}`;
      appendOutlineIndex(items, ch, title);
      for (const t of ch.toc) {
        items.push({
          kind: '章节',
          unit: ch.id,
          unitTitle: title,
          sectionId: t.id,
          text: decodeEntities(t.text),
        });
      }
    }
    for (const p of config.papers) {
      items.push({
        kind: '试卷',
        unit: null,
        unitTitle: '在线练习 · 试卷',
        sectionId: p.id,
        text: p.title,
      });
    }
    appendPaperIndex(items, config.papers);
    return items;
  }, [config]);
  const fullIndex = searchIndex.length ? searchIndex : attachmentIndex;

  const searchLinkTo = (item: SearchIndexItem) => {
    if (item.questionId) return `${config.base}/practice/${item.sectionId}?s=${item.questionId}`;
    if (item.unit) return `${config.base}/chapter/${item.unit}?s=${item.sectionId}`;
    if (item.kind === '附件') return `${config.base}/attachments?f=${encodeURIComponent(item.sectionId)}`;
    return config.singlePaperDirect ? `${config.base}/practice` : `${config.base}/practice/${item.sectionId}`;
  };

  return (
    <div className="shell">
      <TopBar
        courseName={config.name}
        courseBase={config.base}
        courseTip={config.tip}
        tabs={tabs}
        searchIndex={fullIndex}
        searchLinkTo={searchLinkTo}
        onOpenSidebar={() => setDrawerOpen(true)}
      />

      {/* 练习页/附件页不上报目录（无侧栏），让正文占满整个版心 */}
      <div className={`shell-body${onPractice || onAtt || onExtra?.fullWidth ? ' no-sidebar' : ''}`}>
        {onExtra?.sidebar ?? <Sidebar />}
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
              <Route index element={<CourseHomeView config={config} />} />
              <Route path="chapter/:chapterId" element={<CourseChapterView config={config} />} />
              {extras.map((e) => (
                <Route key={e.path} path={e.routePath ?? e.path} element={e.element} />
              ))}
              {config.papers.length > 0 && (
                <>
                  <Route
                    path="practice"
                    element={
                      config.singlePaperDirect ? (
                        <CoursePaperView config={config} paper={config.papers[0]} />
                      ) : (
                        <CoursePracticeIndex config={config} />
                      )
                    }
                  />
                  {(['wrong', 'fav'] as const).map((kind) => (
                    <Route
                      key={kind}
                      path={kind === 'wrong' ? 'practice/wrongbook' : 'practice/favorites'}
                      element={
                        <QuestionBookPage
                          kind={kind}
                          course={courseSlug}
                          base={config.base}
                          storeKey={config.storeKey}
                          entries={bookEntries}
                          tagNav={(t) => {
                            const target = config.chapters[t.deck - 1];
                            return {
                              href: `${config.base}/chapter/${target?.id ?? config.chapters[0].id}?s=${t.sec}`,
                              tip: `跳转到 ${target?.no ?? `第 ${t.deck} 章`} · ${config.tagSections[t.deck]?.[t.sec] ?? t.text}`,
                            };
                          }}
                          tagDeckKey={() => config.deckKey}
                        />
                      }
                    />
                  ))}
                  {!config.singlePaperDirect && (
                    <Route path="practice/:paperId" element={<PaperRoute config={config} />} />
                  )}
                </>
              )}
              <Route path="attachments" element={<CourseAttachmentsPage />} />
              <Route path="*" element={<Navigate to={config.base} replace />} />
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

/** /practice/:paperId 路由：按 id 取试卷，找不到回列表 */
function PaperRoute({ config }: { config: CourseConfig }) {
  const { paperId } = useParams();
  const paper = config.papers.find((p) => p.id === paperId);
  if (!paper) return <Navigate to={`${config.base}/practice`} replace />;
  return <CoursePaperView key={paper.id} config={config} paper={paper} />;
}

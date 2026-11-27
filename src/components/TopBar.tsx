import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { IconArrowLeft, IconMenu } from './icons';
import ThemeToggle from './ThemeToggle';
import SearchBox, { type SearchIndexItem } from './SearchBox';
import AccountButton from './AccountButton';
import ErrataButton from './ErrataButton';

/** 分组菜单中的一讲/一章 */
export interface CourseTabMenuItem {
  to: string;
  /** 菜单项文案，如「第5讲 流水线基础」 */
  label: string;
  active: boolean;
  tip: string;
}

/** 顶栏中部的一个导航按钮（总目录 / 各讲次·章节 / 在线练习） */
export interface CourseTab {
  to: string;
  /** 宽屏显示文案，如「第1讲」 */
  full: string;
  /** 窄屏显示文案，如「1」 */
  short: string;
  active: boolean;
  /** 讲次/章节 key（用于 data-deck 标记；总目录与练习为 null） */
  key?: string | null;
  /** 悬停提示（完整标题） */
  tip: string;
  extra?: string;
  /** 讲次较多时的单元分组：有值时该按钮渲染为「单元」按钮，悬停/点击弹出讲次菜单 */
  menu?: CourseTabMenuItem[];
}

interface Props {
  /** 课程名（左侧胶囊） */
  courseName: string;
  /** 课程根路由（课程名胶囊的跳转目标） */
  courseBase: string;
  /** 课程名胶囊的悬停说明 */
  courseTip: string;
  /** 当前页副标（讲次/章节标题） */
  tabs: CourseTab[];
  /** 搜索索引与条目跳转路由（各课程自行构建） */
  searchIndex: SearchIndexItem[];
  searchLinkTo: (item: SearchIndexItem) => string;
  onOpenSidebar: () => void;
}

/** 指示器：全场只有一枚，靠 layoutId 在页签之间滑动 */
function TabPill({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.span
      className="deck-tab-pill"
      layoutId="deck-tab-pill"
      transition={reduced ? { duration: 0 } : { type: 'tween', duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/** 顶栏中部的课程导航：一项对应一页，线性排列无回环 */
function SiteTabs({ tabs }: { tabs: CourseTab[] }) {
  const reduced = useReducedMotion();
  // 指示器只有一个：默认停在当前页签，鼠标悬浮时跟到悬停的页签，移出导航后滑回当前页签
  const [hoverTo, setHoverTo] = useState<string | null>(null);
  const hovered = hoverTo && tabs.some((t) => t.to === hoverTo) ? hoverTo : null;
  const pillTo = hovered ?? tabs.find((t) => t.active)?.to ?? null;

  return (
    <nav
      className="deck-tabs nav-pill"
      aria-label="课程导航"
      onMouseLeave={() => setHoverTo(null)}
    >
      {tabs.map((t) => {
        // 承载指示器的页签同时用主色高亮文字，保证「一个指示器」而不是「一枚药丸 + 一处高亮」
        const hasPill = pillTo === t.to;
        return t.menu ? (
          <TabGroup
            key={t.to}
            tab={t}
            reduced={reduced}
            hasPill={hasPill}
            onHover={() => setHoverTo(t.to)}
          />
        ) : (
          <Link
            key={t.to}
            to={t.to}
            className={`deck-tab${t.active ? ' active' : ''}${hasPill ? ' has-pill' : ''}${t.extra ? ' ' + t.extra : ''}`}
            data-deck={t.key ?? undefined}
            data-title={t.tip}
            aria-current={t.active ? 'page' : undefined}
            onMouseEnter={() => setHoverTo(t.to)}
          >
            {hasPill && <TabPill reduced={reduced} />}
            <span className="deck-tab-no">
              <span className="tab-full">{t.full}</span>
              <span className="tab-short">{t.short}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/** 单元分组按钮：悬停/点击展开讲次菜单（讲次较多的课程用，替代一长排 tab） */
function TabGroup({
  tab,
  reduced,
  hasPill,
  onHover,
}: {
  tab: CourseTab;
  reduced: boolean | null;
  hasPill: boolean;
  onHover: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击容器外部或按 Esc 收起
  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="deck-tab-group"
      onMouseEnter={() => {
        onHover();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`deck-tab${tab.active ? ' active' : ''}${hasPill ? ' has-pill' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        data-title={tab.tip}
        onClick={() => setOpen((o) => !o)}
      >
        {hasPill && <TabPill reduced={reduced} />}
        <span className="deck-tab-no">
          <span className="tab-full">{tab.full}</span>
          <span className="tab-short">{tab.short}</span>
        </span>
      </button>
      {open && (
        <div className="deck-menu" role="menu" aria-label={tab.full}>
          {tab.menu!.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              role="menuitem"
              className={`deck-menu-item${m.active ? ' active' : ''}`}
              title={m.tip}
              onClick={() => setOpen(false)}
            >
              <span className="deck-menu-label">{m.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 课程顶栏：返回站点首页 / 抽屉触发 / 课程名胶囊 + 课程导航 + 搜索与主题切换。
 * 组件只管布局与样式，具体课程的数据（课程名、导航项）全部由调用方传入。
 */
export default function TopBar({
  courseName,
  courseBase,
  courseTip,
  tabs,
  searchIndex,
  searchLinkTo,
  onOpenSidebar,
}: Props) {
  // 深层练习页（试卷页 / 错题本 / 收藏本）：左箭头回上一级「在线练习」；其余页面回站点首页
  const { pathname } = useLocation();
  const practiceRoot = /^\/[^/]+\/practice\/./.test(pathname)
    ? pathname.slice(0, pathname.indexOf('/practice/') + '/practice'.length)
    : null;
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* 独立返回胶囊（手机上收进抽屉，把顶栏宽度让给课程名） */}
        <Link
          to={practiceRoot ?? '/'}
          className="topbar-ctl nav-pill topbar-home"
          aria-label={practiceRoot ? '返回在线练习' : '返回课程资料库首页'}
          title={practiceRoot ? '返回在线练习' : '返回课程资料库首页'}
        >
          <span className="icon-btn">
            <IconArrowLeft size={18} />
          </span>
        </Link>
        <button
          className="topbar-ctl nav-pill drawer-trigger"
          aria-label="打开目录"
          onClick={onOpenSidebar}
        >
          <span className="icon-btn">
            <IconMenu />
          </span>
        </button>
        {/* 课程名独立胶囊：与返回箭头/搜索等同语言 */}
        <Link to={courseBase} className="topbar-ctl nav-pill topbar-title" title={courseTip}>
          {courseName}
        </Link>
      </div>
      <SiteTabs tabs={tabs} />
      <div className="topbar-right">
        {/* 纯附件/无内容课程（如课程设计）没有可检索的索引，不渲染搜索胶囊 */}
        {searchIndex.length > 0 && (
          <div className="topbar-ctl nav-pill">
            <SearchBox index={searchIndex} linkTo={searchLinkTo} />
          </div>
        )}
        <div className="topbar-ctl nav-pill">
          <ThemeToggle />
        </div>
        <div className="topbar-ctl nav-pill errata-slot">
          <ErrataButton />
        </div>
        <AccountButton />
      </div>
    </header>
  );
}

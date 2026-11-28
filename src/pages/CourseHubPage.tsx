import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { catalog } from '../content/catalog';
import { courses, findCourseByName, STUB_BASE } from '../courses/registry';
import SiteHeader from '../components/SiteHeader';
import { useFavoriteCourses, useRecentCourses } from '../lib/sync';
import { useSiteVisits } from '../lib/visits';
import { contributors } from '../content/contributors';
import ContactCard from '../components/ContactCard';
import { IconChevronDown, IconChevronUp, IconGitHub, IconStar } from '../components/icons';
import { toggleFavorite } from '../lib/favoriteCourses';
import { useToc } from '../lib/toc';
import { QUIZ_COURSES, QUIZ_ROUTE_BY_NAME } from '../content/quizbank';

/** 学期分组顺序：8 个学期 */
const SEMESTERS = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下'];

/** 学习通题库课程（非学期课，不在 catalog/registry）：名称 → 路由，收藏与最近查看按此解析 */
const QUESTION_BANK_ROUTES: Record<string, string> = QUIZ_ROUTE_BY_NAME;

interface Card {
  semester: string;
  name: string;
  href: string;
  ready: boolean;
}

const REPO_URL = 'https://github.com/SaltGardenia/HFUT-CS-Online';
/** 首页滚动位置（sessionStorage）：滚动即更新，回首页时据此恢复 */
const HOME_SCROLL_KEY = 'home-scroll-y';
/** 头像链接覆盖：站长指向个人站而非 GitHub 主页 */
const CONTRIB_LINKS: Record<string, string> = {
  SaltGardenia: 'https://saltgardenia.github.io/',
};

/**
 * 账目里的数字：整栏同时开数，一起从 0 数到终值，不做淡入/上移那套入场。
 * 已经有当天缓存时不等待，直接开数；稍后请求回来若数值变了，再从当前值补数上去。
 */
function CountUp({ value, started }: { value: number; started: boolean }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(() => (reduced ? value : 0));
  // 补数时要从「当前显示的值」接着数，不能回到 0
  const shownRef = useRef(shown);

  useEffect(() => {
    const set = (v: number) => {
      shownRef.current = v;
      setShown(v);
    };
    if (reduced) {
      set(value);
      return;
    }
    if (!started) {
      set(0);
      return;
    }
    const controls = animate(shownRef.current, value, {
      // 首次开数走完整节奏；后来刷新到新值只补一小段
      duration: shownRef.current === 0 ? 0.9 : 0.35,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => set(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, started, reduced]);

  return <>{shown}</>;
}

/**
 * 访问量一行：数据在路上时只占住数字槽（不画任何色块），
 * 数据到达和其余数字一起开数。行盒始终由 <b> 决定，账目栏不会上下跳。
 */
function VisitStat({
  label,
  value,
  started,
  group,
}: {
  label: string;
  /** null：请求还没回来（空出数字槽）；数字：从 0 数到位 */
  value: number | null | undefined;
  started: boolean;
  group?: boolean;
}) {
  return (
    <div className={group ? 'hub-stat hub-stat-group' : 'hub-stat'}>
      <span className="hub-stat-k">{label}</span>
      <span className="hub-stat-leader" aria-hidden="true" />
      <span className="hub-stat-v">
        {/* 占位也用 <b>：字体行盒与数字完全一致，占位期和到位后行高、行位都不变 */}
        {value == null ? (
          <b aria-hidden="true">&#8203;</b>
        ) : (
          <b>
            <CountUp value={value} started={started} />
          </b>
        )}
      </span>
    </div>
  );
}

export default function CourseHubPage() {
  const toc = useToc();
  const reduced = useReducedMotion();
  const [contactOpen, setContactOpen] = useState(false);

  // 最近查看的课程（本地优先，登录后随云端合并刷新）
  const recentNames = useRecentCourses();
  // 收藏的课程（收藏先后序）；卡片星标与合并展示区共用
  const favs = useFavoriteCourses();
  // 站点访问量（Supabase 计数；请求未到时先空出槽位，失败则不渲染）
  const visits = useSiteVisits();
  // 账目统一开数：有当天缓存就立即开数；没有就等访问量回来（或确认拿不到）再一起数。
  // 请求特别慢、又没缓存时最多等 3s，宁可让这两项晚到，也不让整栏一直空着。
  const [ledgerStarted, setLedgerStarted] = useState(!visits.pending || visits.visits != null);
  useEffect(() => {
    if (ledgerStarted) return;
    if (!visits.pending || visits.visits) {
      setLedgerStarted(true);
      return;
    }
    const timer = window.setTimeout(() => setLedgerStarted(true), 3000);
    return () => window.clearTimeout(timer);
  }, [ledgerStarted, visits.pending, visits.visits]);

  // 置顶按钮：滚过约一屏内容后出现（rAF 节流，与在线练习页同款）
  const [showTop, setShowTop] = useState(false);
  // 首屏向下提示：滚离顶部即退场（衔接 hero 与下方学期目录）
  const [showHint, setShowHint] = useState(true);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setShowTop(window.scrollY > 800);
      setShowHint(window.scrollY < 120);
    };
    const onScroll = () => {
      // 首页滚动位置就地记录：只在用户真的滚首页时写，不依赖卸载时机
      // （卸载 cleanup 里读到的 scrollY 可能已是目标课程页的位置，会把记录覆盖成课程页滚动值）
      sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // 站点层无正文目录，清空侧栏上报
  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 首页滚动记忆：回到首页时恢复原位，不跳回顶部。
  // 恢复在双 rAF 后执行，并在字体就绪/稍后各校正一次（首帧排版可能未稳定，过早 scrollTo 会被夹到较小值）；
  // 一旦用户主动滚动（滚轮/触摸/按键）就停止校正，避免把用户拽回去。
  useEffect(() => {
    const saved = Number(sessionStorage.getItem(HOME_SCROLL_KEY) ?? 0);
    if (!saved) return;
    let cancelled = false;
    const stop = () => {
      cancelled = true;
    };
    const apply = () => {
      // instant：绕开全局 scroll-behavior:smooth，避免恢复过程中被读到中间位置
      if (!cancelled) window.scrollTo({ top: saved, behavior: 'instant' });
    };
    window.addEventListener('wheel', stop, { passive: true, once: true });
    window.addEventListener('touchmove', stop, { passive: true, once: true });
    window.addEventListener('keydown', stop, { once: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(apply);
      void document.fonts?.ready.then(() => {
        if (!cancelled) apply();
      });
      window.setTimeout(apply, 120);
      window.setTimeout(apply, 400);
    });
    return () => {
      cancelled = true;
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
    };
  }, []);

  const { groups, stats } = useMemo(() => {
    // catalog：学期 → 课程；已上线课程（registry）若不在 catalog 里则注入虚拟卡片
    const bySem = new Map<string, Card[]>();
    const push = (semester: string, c: Omit<Card, 'semester'>) => {
      if (!bySem.has(semester)) bySem.set(semester, []);
      bySem.get(semester)!.push({ ...c, semester });
    };
    for (const c of catalog) {
      const entry = findCourseByName(c.name);
      push(c.semester, {
        name: c.name,
        href: entry ? entry.base : `${STUB_BASE}/${encodeURIComponent(c.name)}`,
        ready: !!entry,
      });
    }
    for (const entry of courses) {
      if (bySem.has(entry.semester) && bySem.get(entry.semester)!.some((c) => c.name === entry.name)) continue;
      push(entry.semester, {
        name: entry.name,
        href: entry.base,
        ready: true,
      });
    }
    const order = [...SEMESTERS, ...[...bySem.keys()].filter((s) => !SEMESTERS.includes(s))];
    const groups = order
      .filter((s) => bySem.has(s))
      .map((semester) => ({ semester, cards: bySem.get(semester)! }));

    const sum = (k: 'total' | 'exams' | 'courseware') =>
      catalog.reduce((acc, c) => acc + c[k], 0);
    const stats = {
      semesters: SEMESTERS.length,
      courses: catalog.length,
      files: sum('total'),
      exams: sum('exams'),
      courseware: sum('courseware'),
    };
    return { groups, stats };
  }, []);

  const card = (c: Card, i: number) => {
    const fav = favs.includes(c.name);
    return (
      <motion.div
        key={c.name}
        className="course-cell"
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(i * 0.03, 0.24), ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link
          to={c.href}
          className={`course-card${c.ready ? ' ready' : ''}`}
          aria-label={c.ready ? `${c.name}，进入课程` : `${c.name}，查看资料统计`}
        >
          <span className="course-title">{c.name}</span>
          {c.ready && <span className="course-go" aria-hidden="true">→</span>}
        </Link>
        {/* 收藏按钮：卡片 Link 的兄弟节点，避免嵌套可点击元素 */}
        <button
          type="button"
          className={`course-fav${fav ? ' on' : ''}`}
          aria-pressed={fav}
          aria-label={fav ? `取消收藏 ${c.name}` : `收藏 ${c.name}`}
          title={fav ? '取消收藏' : '收藏'}
          onClick={() => {
            toggleFavorite(c.name);
          }}
        >
          <IconStar size={16} />
        </button>
      </motion.div>
    );
  };

  // 首屏 hero 的分节淡入（reduced-motion 下直接呈现）
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  // 按课程名解析成展示卡片（数据取 catalog + registry，名字已不在资料库的忽略；
  // 学习通题库课程不在两者之内，按名称兜底到对应路由）
  const resolveCard = (name: string): Card | null => {
    const c = catalog.find((x) => x.name === name);
    const entry = findCourseByName(name);
    if (!c && !entry) {
      const href = QUESTION_BANK_ROUTES[name];
      if (!href) return null;
      return { semester: '学习通题库', name, href, ready: true };
    }
    return {
      semester: c?.semester ?? entry!.semester,
      name,
      href: entry ? entry.base : `${STUB_BASE}/${encodeURIComponent(name)}`,
      ready: !!entry,
    };
  };

  // 收藏卡片（收藏先后序在前）
  const favCards: Card[] = useMemo(() => favs.map(resolveCard).filter((x): x is Card => !!x), [favs]);
  // 最近查看卡片
  const recentCards: Card[] = useMemo(
    () => recentNames.map(resolveCard).filter((x): x is Card => !!x),
    [recentNames],
  );
  // 首屏合并展示：收藏在前，最近查看随后（与收藏重复的只出现一次）
  const shownCards: Card[] = useMemo(() => {
    const favSet = new Set(favs);
    return [...favCards, ...recentCards.filter((r) => !favSet.has(r.name))];
  }, [favCards, recentCards, favs]);

  return (
    <div className="hub-shell">
      <SiteHeader />

      <section className="hub-hero" aria-label="站点简介">
        <div className="hub-hero-grid">
          <div className="hub-hero-lead">
            <motion.h1 className="hub-hero-name" {...rise(0)}>
              HFUT-CS-Online
            </motion.h1>
            <motion.p className="hub-hero-sub" {...rise(0.06)}>
              汇总合肥工业大学计算机与信息学院的在线课程资料
            </motion.p>
            <motion.div className="hub-hero-links" {...rise(0.12)}>
              <a className="hub-cta hub-cta-main" href={REPO_URL} target="_blank" rel="noreferrer">
                <IconGitHub size={16} />
                Github
              </a>
              <button type="button" className="hub-cta" onClick={() => setContactOpen(true)}>
                联系作者
              </button>
            </motion.div>
          </div>
          {/* 馆藏账目：标签在左、数目右对齐，虚点引导——目录卡的记数方式。
              开数前只露标签与虚点（数字隐身），等访问量回来（或确认拿不到）后
              整栏数字一起出现、一起数。 */}
          <div className={`hub-hero-stats${ledgerStarted || reduced ? '' : ' is-waiting'}`}>
            <div className="hub-stat">
              <span className="hub-stat-k">学期</span>
              <span className="hub-stat-leader" aria-hidden="true" />
              <b>
                <CountUp value={stats.semesters} started={ledgerStarted} />
              </b>
            </div>
            <div className="hub-stat">
              <span className="hub-stat-k">门课程</span>
              <span className="hub-stat-leader" aria-hidden="true" />
              <b>
                <CountUp value={stats.courses} started={ledgerStarted} />
              </b>
            </div>
            <div className="hub-stat hub-stat-group">
              <span className="hub-stat-k">份文件</span>
              <span className="hub-stat-leader" aria-hidden="true" />
              <b>
                <CountUp value={stats.files} started={ledgerStarted} />
              </b>
            </div>
            <div className="hub-stat">
              <span className="hub-stat-k">份课件</span>
              <span className="hub-stat-leader" aria-hidden="true" />
              <b>
                <CountUp value={stats.courseware} started={ledgerStarted} />
              </b>
            </div>
            <div className="hub-stat">
              <span className="hub-stat-k">份试题</span>
              <span className="hub-stat-leader" aria-hidden="true" />
              <b>
                <CountUp value={stats.exams} started={ledgerStarted} />
              </b>
            </div>
            {visits.enabled && (visits.pending || visits.visits) && (
              <>
                <VisitStat label="累计访问量" value={visits.visits?.total} started={ledgerStarted} group />
                <VisitStat label="今日访问量" value={visits.visits?.today} started={ledgerStarted} />
              </>
            )}
          </div>
        </div>
        {/* 名册：一条细线收住整页，贡献者在左，招呼在右 */}
        <motion.div className="hub-hero-foot" {...rise(0.24)}>
          <motion.span
            className="hub-hero-rule"
            aria-hidden="true"
            initial={reduced ? undefined : { scaleX: 0 }}
            animate={reduced ? undefined : { scaleX: 1 }}
            transition={reduced ? undefined : { duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="hub-hero-credits">
            {contributors.length > 0 && (
              <div className="contrib-avatars">
                {/* 名册左压右：序号越小层级越高，左边头像盖住右边 */}
                {contributors.map((c, i) => (
                  <a key={c.login} className="contrib-avatar" href={CONTRIB_LINKS[c.login] ?? c.html_url} target="_blank" rel="noreferrer"
                     style={{ zIndex: contributors.length - i }}
                     aria-label={c.login} title={`${c.login} · ${c.repo}`}>
                    <img src={c.avatar_url} alt={c.login} loading="lazy" />
                  </a>
                ))}
              </div>
            )}
            <p className="hub-hero-welcome">欢迎 Issue &amp; PR</p>
          </div>
        </motion.div>
        {/* 向下滚动提示：滚离首屏即退场 */}
        <AnimatePresence>
          {showHint && (
            <motion.button
              type="button"
              className="hub-hero-scroll"
              aria-label="查看下方课程目录"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
              onClick={() =>
                document.getElementById('catalog')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
              }
            >
              <IconChevronDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </section>

      <main className="hub-main" id="catalog">
        {shownCards.length > 0 && (
          <section className="hub-sem" aria-label={favCards.length > 0 ? '收藏与最近查看' : '最近查看'}>
            <div className="hub-sem-h">
              <h2>{favCards.length > 0 ? '收藏与最近查看' : '最近查看'}</h2>
            </div>
            <div className="hub-grid">{shownCards.map(card)}</div>
          </section>
        )}
        {/* 学习通题库：背题应用（非学期课程），不走资料目录 */}
        <section className="hub-sem" aria-label="学习通题库">
          <div className="hub-sem-h">
            <h2>学习通题库</h2>
          </div>
          <div className="hub-grid">
            {QUIZ_COURSES.map((qc, i) => (
              <motion.div
                key={qc.slug}
                className="course-cell"
                initial={reduced ? undefined : { opacity: 0, y: 10 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(0.06 + i * 0.03, 0.24), ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Link
                  to={`/quiz/${qc.slug}`}
                  className="course-card ready"
                  aria-label={`${qc.name}，进入课程`}
                >
                  <span className="course-title">{qc.name}</span>
                  <span className="course-go" aria-hidden="true">→</span>
                </Link>
                {/* 收藏按钮：卡片 Link 的兄弟节点，与学期课程卡同款 */}
                <button
                  type="button"
                  className={`course-fav${favs.includes(qc.name) ? ' on' : ''}`}
                  aria-pressed={favs.includes(qc.name)}
                  aria-label={favs.includes(qc.name) ? `取消收藏 ${qc.name}` : `收藏 ${qc.name}`}
                  title={favs.includes(qc.name) ? '取消收藏' : '收藏'}
                  onClick={() => {
                    toggleFavorite(qc.name);
                  }}
                >
                  <IconStar size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
        {groups.map((g) => (
          <section className="hub-sem" key={g.semester}>
            <div className="hub-sem-h">
              <h2>{g.semester}</h2>
              {g.semester === '公共课与杂项' && <span>不属于具体学期课程的公共资料</span>}
            </div>
            <div className="hub-grid">{g.cards.map(card)}</div>
          </section>
        ))}
      </main>
      {/* 置顶按钮 */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="pq-top"
            aria-label="回到顶部"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 480, damping: 30 }}
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
          >
            <IconChevronUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
      <ContactCard open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import type {
  CourseConfig,
  CoursePaper,
  CourseQuestion,
  CourseQuizKind,
  PracticeTag,
} from '../../content/course-types';
import PracticeCard from '../practice/PracticeCard';
import { IconChevronUp, IconX } from '../icons';
import { useProgressStore } from '../../lib/sync';

type Result = 'right' | 'wrong' | 'revealed';

/** 右侧进度轨 / 吸顶摘要的分段大小（与其它课程练习页一致） */
const SEGMENT = 10;

/** 题型固定顺序（与热力图分块一一对应） */
const KINDS: CourseQuizKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 通用答题页：左侧题型热力图 + 右侧答题区，每题带可跳转的知识点标签 */
export default function CoursePaperView({
  config,
  paper,
}: {
  config: CourseConfig;
  paper: CoursePaper;
}) {
  const reduced = useReducedMotion();
  const [results, setResults] = useProgressStore<Result>(config.storeKey);
  const [kind, setKind] = useState<CourseQuizKind>(
    () => KINDS.find((k) => paper.questions.some((q) => q.kind === k)) ?? 'fill',
  );
  const firstKindRun = useRef(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingJump = useRef<string | null>(null);

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  const onResult = (qid: string, r: Result) => setResults((s) => ({ ...s, [qid]: r }));

  const bankOf = (k: CourseQuizKind) => paper.questions.filter((q) => q.kind === k);

  const countFor = (k: CourseQuizKind) => {
    const bank = bankOf(k);
    const done = bank.filter((q) => results[q.id]).length;
    const right = bank.filter((q) => results[q.id] === 'right').length;
    return { done, right };
  };

  /** 题卡序号：按同题型内的原卷顺序 */
  const labelOf = useMemo(() => {
    const map = new Map<string, string>();
    const counters = new Map<CourseQuizKind, number>();
    for (const q of paper.questions) {
      const n = (counters.get(q.kind) ?? 0) + 1;
      counters.set(q.kind, n);
      map.set(q.id, `${config.kindLabel[q.kind]} ${n}`);
    }
    return map;
  }, [paper, config]);

  const visible = useMemo(
    () =>
      paper.sections
        .flatMap((s) => s.questionIds)
        .map((id) => paper.questions.find((q) => q.id === id)!)
        .filter((q) => q && q.kind === kind),
    [paper, kind],
  );

  const sectionOf = useMemo(() => {
    const map = new Map<string, { title: string; no: number }>();
    paper.sections.forEach((s, i) => {
      for (const qid of s.questionIds) map.set(qid, { title: s.title, no: i + 1 });
    });
    return map;
  }, [paper]);

  const sectionCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const q of visible) {
      const sec = sectionOf.get(q.id);
      if (sec) counts.set(sec.no, (counts.get(sec.no) ?? 0) + 1);
    }
    return counts;
  }, [visible, sectionOf]);

  useEffect(() => {
    if (firstKindRun.current) {
      firstKindRun.current = false;
      return;
    }
    if (pendingJump.current) return;
    const main = document.querySelector('.pq-main');
    if (!main) return;
    const top = main.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const jumpToQuestion = (qid: string, k: CourseQuizKind) => {
    pendingJump.current = qid;
    if (kind === k) {
      window.setTimeout(() => {
        const el = document.querySelector(`.practice-q[data-qid="${qid}"]`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 108;
          window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
          pendingJump.current = null;
        }
      }, 30);
      return;
    }
    setKind(k);
  };

  useEffect(() => {
    if (!pendingJump.current) return;
    const t = window.setTimeout(() => {
      const id = pendingJump.current;
      pendingJump.current = null;
      if (!id) return;
      const el = document.querySelector(`.practice-q[data-qid="${id}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 108;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    }, 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const [probe, setProbe] = useState({ idx: 0, showTop: false });
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.practice-q'));
      let idx = 0;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].getBoundingClientRect().top <= 140) idx = i;
        else break;
      }
      const next = { idx: Math.min(idx, Math.max(0, visible.length - 1)), showTop: window.scrollY > 800 };
      setProbe((s) => (s.idx === next.idx && s.showTop === next.showTop ? s : next));
    };
    const onScroll = () => {
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
  }, [visible.length]);
  const { idx, showTop } = probe;

  const done = paper.questions.filter((q) => results[q.id]).length;
  const right = paper.questions.filter((q) => results[q.id] === 'right').length;
  const total = paper.questions.length;

  // 大题标题去掉「一、」前缀（原卷中文序数由 pq-group-no 徽章承担）
  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+[、．.]/, '');

  let lastSection = 0;

  const scrollToCard = (cardIdx: number) => {
    const q = visible[cardIdx];
    if (!q) return;
    const el = document.querySelector(`.practice-q[data-qid="${q.id}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  };

  const segmentCount = Math.ceil(visible.length / SEGMENT);
  const activeSeg = Math.min(Math.floor(idx / SEGMENT), Math.max(0, segmentCount - 1));
  const segSection = (k: number) => sectionOf.get(visible[k * SEGMENT]?.id ?? '')?.no ?? 0;
  const heatKinds = KINDS.filter((k) => bankOf(k).length > 0);

  // 知识点标签跳转：章序号 → /base/chapter/{chapterId}?s=sec
  const tagNav = (t: PracticeTag) => {
    const target = config.chapters[t.deck - 1];
    return {
      href: `${config.base}/chapter/${target?.id ?? config.chapters[0].id}?s=${t.sec}`,
      tip: `跳转到 ${target?.no ?? `第 ${t.deck} 章`} · ${config.tagSections[t.deck]?.[t.sec] ?? t.text}`,
    };
  };

  return (
    <div className="page practice-page">
      <h1>{paper.title}</h1>
      <div className="lede">
        <p>
          {paper.source} · 共 {total} 题 · 参考答案：{paper.answerSource}。左侧热力图可切换题型、点击格子跳到具体题；
          每题附知识点标签，点击跳转课件对应位置。
        </p>
      </div>

      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            总进度：<span className="pq-frag">已作答 <b>{done}</b> / {total}</span> ·{' '}
            <span className="pq-frag">
              答对{' '}
              <motion.b
                className="pq-right-num"
                key={right}
                initial={reduced ? false : { scale: 1.4, color: 'var(--ok)' }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 20 }}
              >
                {right}
              </motion.b>{' '}
              题
            </span>
          </span>
          <button className="btn pq-danger" onClick={() => setConfirmOpen(true)} disabled={done === 0}>
            清空进度
          </button>
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={done} aria-valuemax={total}>
          <span style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：热力图即总览+导航——分块标题就是题型切换，格子里是每一题 */}
        <aside className="pq-rail" aria-label="题型与进度热力图">
          <div className="pq-heatblock">
            {heatKinds.map((k) => {
              const c = countFor(k);
              return (
                <div key={k} className="pq-heat" data-active={kind === k}>
                  <button type="button" className="pq-heat-label" onClick={() => setKind(k)} aria-pressed={kind === k}>
                    <span className="pq-heat-kind">{config.kindLabel[k]}</span>
                    <span>
                      {c.done}/{bankOf(k).length}
                    </span>
                  </button>
                  <div className="pq-heat-grid">
                    {bankOf(k).map((q) => {
                      const r = results[q.id];
                      const state = r ?? 'none';
                      const stateText =
                        r === 'right' ? '已答对' : r === 'wrong' ? '已答错' : r === 'revealed' ? '已看答案' : '未作答';
                      return (
                        <button
                          key={q.id}
                          type="button"
                          className="pq-heat-cell"
                          data-state={state}
                          title={`${labelOf.get(q.id) ?? ''} · ${stateText}`}
                          aria-label={`${labelOf.get(q.id) ?? ''} ${stateText}`}
                          onClick={() => jumpToQuestion(q.id, k)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 主列：题目列表（按原卷大题分组） */}
        <div className="pq-main">
          <div className="pq-list" key={kind}>
            {visible.map((q: CourseQuestion) => {
              const sec = sectionOf.get(q.id);
              const showHead = sec !== undefined && sec.no !== lastSection;
              if (sec) lastSection = sec.no;
              return (
                <Fragment key={q.id}>
                  {showHead && sec && (
                    <p className="pq-group-h" data-deck={config.deckKey}>
                      <b className="pq-group-no">{config.kindLabel[kind]}</b>
                      {sec.title} · {sectionCounts.get(sec.no) ?? 0} 题
                    </p>
                  )}
                  <PracticeCard
                    quiz={q}
                    label={labelOf.get(q.id) ?? ''}
                    result={results[q.id]}
                    onResult={onResult}
                    tagNav={tagNav}
                    tagDeckKey={() => config.deckKey}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧进度轨：每 10 题一段，点击跳转（仅宽屏） */}
      <AnimatePresence>
        {segmentCount > 1 && (
          <nav className="pq-track" aria-label="题目分段导航">
            {Array.from({ length: segmentCount }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`pq-track-seg${k === activeSeg ? ' active' : ''}`}
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, visible.length)} 题${segSection(k) ? ` · ${stripPrefix(paper.sections[segSection(k) - 1].title)}` : ''}`}
                onClick={() => scrollToCard(k * SEGMENT)}
              >
                <i />
                <span>{k * SEGMENT + 1}</span>
              </button>
            ))}
          </nav>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="hub-modal-scrim"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              className="hub-modal material"
              role="dialog"
              aria-modal="true"
              aria-label="清空进度"
              initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hub-modal-head">
                <h2>清空进度</h2>
                <button className="icon-btn" onClick={() => setConfirmOpen(false)} aria-label="关闭">
                  <IconX size={16} />
                </button>
              </div>
              <p className="hub-modal-tip">清空本份试卷的全部作答进度？</p>
              <div className="hub-modal-actions">
                <button className="btn" onClick={() => setConfirmOpen(false)}>
                  取消
                </button>
                <button
                  className="btn pq-danger"
                  onClick={() => {
                    setResults({});
                    setConfirmOpen(false);
                  }}
                >
                  清空
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

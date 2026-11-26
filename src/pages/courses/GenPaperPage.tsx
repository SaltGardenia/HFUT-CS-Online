import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Navigate, useParams } from 'react-router-dom';
import type { CourseSpec, GenPaper, GenQuizKind, GenTag } from '../../content/courses/types';
import { GEN_KIND_LABEL } from '../../content/courses/labels';
import PracticeCard from '../../components/practice/PracticeCard';
import ClearProgress from '../../components/practice/ClearProgress';
import { IconChevronUp } from '../../components/icons';
import { clearProgress, useProgressStore } from '../../lib/sync';

/** 作答结果的持久化 key（每门课独立，避免跨课串数据） */
interface Props {
  spec: CourseSpec;
  storeKey: string;
}

type Result = 'right' | 'wrong' | 'revealed';

/** 右侧进度轨 / 吸顶摘要的分段大小（与算法课练习页一致） */
const SEGMENT = 10;

/** 题型固定顺序（与热力图分块一一对应） */
const KINDS: GenQuizKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

export default function GenPaperPage({ spec, storeKey }: Props) {
  const { paperId } = useParams();
  const paper = spec.papers.find((p) => p.id === paperId);
  if (!paper) return <Navigate to={`${spec.base}/practice`} replace />;
  return <PaperInner key={paper.id} paper={paper} spec={spec} storeKey={storeKey} />;
}

function PaperInner({ paper, spec, storeKey }: { paper: GenPaper; spec: CourseSpec; storeKey: string }) {
  const reduced = useReducedMotion();
  const [results, setResults] = useProgressStore<Result>(storeKey);
  const [kind, setKind] = useState<GenQuizKind>('single');
  const firstKindRun = useRef(true);
  const pendingJump = useRef<string | null>(null);

  const onResult = (qid: string, r: Result) => setResults((s) => ({ ...s, [qid]: r }));

  const bankOf = (k: GenQuizKind) => paper.questions.filter((q) => q.kind === k);

  const countFor = (k: GenQuizKind) => {
    const bank = bankOf(k);
    const done = bank.filter((q) => results[q.id]).length;
    const right = bank.filter((q) => results[q.id] === 'right').length;
    return { done, right };
  };

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

  // 打开试卷时定位到第一个有题的题型
  const [kindInit] = useState(() => KINDS.find((k) => paper.questions.some((q) => q.kind === k)) ?? 'single');
  useEffect(() => {
    setKind(kindInit);
  }, [kindInit]);

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

  const jumpToQuestion = (qid: string, k: GenQuizKind) => {
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

  const stripPrefix = (t: string) => t.replace(/^[一二三四五六七八九十]+、/, '');

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

  // 知识点标签跳转：章号 → <base>/deck/deckN?s=secId
  const tagNav = (t: GenTag) => ({
    href: `${spec.base}/deck/deck${t.deck}?s=${t.sec}`,
    tip: `跳转到 ${spec.chapters.find((c) => c.id === `deck${t.deck}`)?.no ?? ''} · ${t.text}`,
  });

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
          <ClearProgress
            done={done}
            onClear={() => clearProgress(storeKey, paper.questions.map((q) => q.id))}
            tip="清空本卷的全部作答进度？"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={done} aria-valuemax={total}>
          <span style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        <aside className="pq-rail" aria-label="题型与进度热力图">
          <div className="pq-heatblock">
            {heatKinds.map((k) => {
              const c = countFor(k);
              const short = GEN_KIND_LABEL[k];
              return (
                <div key={k} className="pq-heat" data-active={kind === k}>
                  <button type="button" className="pq-heat-label" onClick={() => setKind(k)} aria-pressed={kind === k}>
                    <span className="pq-heat-kind">{short}</span>
                    <span>
                      {c.done}/{bankOf(k).length}
                    </span>
                  </button>
                  <div className="pq-heat-grid">
                    {bankOf(k).map((q, qi) => {
                      const r = results[q.id];
                      const state = r ?? 'none';
                      const stateText =
                        r === 'right' ? '已答对' : r === 'wrong' ? '已答错' : r === 'revealed' ? '已看答案' : '未作答';
                      const label = q.label ?? `${short} ${qi + 1}`;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          className="pq-heat-cell"
                          data-state={state}
                          title={`${label} · ${stateText}`}
                          aria-label={`${label} ${stateText}`}
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

        <div className="pq-main">
          <div className="pq-list" key={kind}>
            {visible.map((q, qi) => {
              const sec = sectionOf.get(q.id);
              const showHead = sec !== undefined && sec.no !== lastSection;
              if (sec) lastSection = sec.no;
              return (
                <Fragment key={q.id}>
                  {showHead && sec && (
                    <p className="pq-group-h">
                      <b className="pq-group-no">{GEN_KIND_LABEL[kind]}</b>
                      {sec.title} · {sectionCounts.get(sec.no) ?? 0} 题
                    </p>
                  )}
                  <PracticeCard
                    quiz={q}
                    label={q.label ?? `${GEN_KIND_LABEL[kind]} ${qi + 1}`}
                    result={results[q.id]}
                    onResult={onResult}
                    tagNav={tagNav}
                    tagDeckKey={() => spec.key}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {segmentCount > 1 && (
          <nav className="pq-track" aria-label="题目分段导航">
            {Array.from({ length: segmentCount }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`pq-track-seg${k === activeSeg ? ' active' : ''}`}
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, visible.length)} 题${segSection(k) ? ` · ${stripPrefix(paper.sections[secSectionIdx(paper, segSection(k))].title)}` : ''}`}
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

    </div>
  );
}

/** 大题序号 → paper.sections 的下标 */
function secSectionIdx(paper: GenPaper, no: number): number {
  return Math.max(0, Math.min(paper.sections.length - 1, no - 1));
}

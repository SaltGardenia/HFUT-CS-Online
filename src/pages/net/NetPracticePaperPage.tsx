import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { NET_BASE } from '../../courses/registry';
import { findNetPaper, type NetPaper } from '../../content/net';
import PracticeCard from '../../components/practice/PracticeCard';
import PracticeReport from '../../components/practice/report/PracticeReport';
import ClearProgress from '../../components/practice/ClearProgress';
import { IconArrowLeft, IconChevronUp } from '../../components/icons';
import { clearProgress, useProgressStore } from '../../lib/sync';
import { useQuestionBooks } from '../../lib/questionBooks';
import { NET_PRACTICE_STORE_KEY, netPaperStats, type NetResult } from './netPracticeState';

/** 右侧进度轨的分段大小 */
const SEGMENT = 10;

/** 滚动监听：rAF 节流，返回「视口顶部最近的题目序号」与「是否该出现置顶按钮」 */
function useScrollProbe(visibleLength: number) {
  const [state, setState] = useState({ idx: 0, showTop: false });
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
      const next = { idx: Math.min(idx, Math.max(0, visibleLength - 1)), showTop: window.scrollY > 800 };
      setState((s) => (s.idx === next.idx && s.showTop === next.showTop ? s : next));
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
  }, [visibleLength]);
  return state;
}

/** 答题页：左侧热力图（按大题分块）+ 右侧答题区，左侧栏无目录、正文占满版心 */
export default function NetPracticePaperPage() {
  const { paperId } = useParams();
  const paper = paperId ? findNetPaper(paperId) : undefined;
  if (!paper) return <Navigate to={`${NET_BASE}/practice`} replace />;
  return <NetPaperInner key={paper.id} paper={paper} />;
}

function NetPaperInner({ paper }: { paper: NetPaper }) {
  const reduced = useReducedMotion();
  const [results, setResults] = useProgressStore<NetResult>(NET_PRACTICE_STORE_KEY);
  const books = useQuestionBooks('net');

  const onResult = (qid: string, r: NetResult) => {
    setResults((s) => ({ ...s, [`${paper.id}:${qid}`]: r }));
    books.trackResult(`${paper.id}:${qid}`, r);
  };

  const sectionStats = (questionIds: string[]) => {
    const done = questionIds.filter((id) => results[`${paper.id}:${id}`]).length;
    const right = questionIds.filter((id) => results[`${paper.id}:${id}`] === 'right').length;
    return { done, right, total: questionIds.length };
  };

  const { done, right, total } = netPaperStats(paper.id, results);

  const { idx, showTop } = useScrollProbe(paper.questions.length);

  // 每题所在的大题（右轨 tooltip 用）
  const sectionOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const sec of paper.sections) for (const id of sec.questionIds) m.set(id, sec.title);
    return m;
  }, [paper]);

  const scrollToCard = (cardIdx: number) => {
    const q = paper.questions[cardIdx];
    if (!q) return;
    const el = document.querySelector(`.practice-q[data-qid="${q.id}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  };

  const segmentCount = Math.ceil(paper.questions.length / SEGMENT);
  const activeSeg = Math.min(Math.floor(idx / SEGMENT), Math.max(0, segmentCount - 1));

  // 热力图点击 → 跳到具体题目
  const jumpToQuestion = (qid: string) => {
    const el = document.querySelector(`.practice-q[data-qid="${qid}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  };

  // ?s=<题目id> 深链：定位到具体题目（搜索试题命中跳转）
  const [params] = useSearchParams();
  const deepLink = params.get('s');
  useEffect(() => {
    if (!deepLink) return;
    const t = window.setTimeout(() => jumpToQuestion(deepLink), 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink, paper.id]);

  // 知识点标签跳转：章号 → /net/deck/chN?s=sec
  const tagNav = (t: { deck: number; sec: string; text: string }) => ({
    href: `${NET_BASE}/deck/ch${t.deck}?s=${t.sec}`,
    tip: `跳转到 第 ${t.deck} 章 · ${t.text}`,
  });

  // 大题内的作答序号（题号按大题重新编号）
  const seqOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const sec of paper.sections) {
      sec.questionIds.forEach((id, i) => m.set(id, `${sec.short} ${i + 1}`));
    }
    return m;
  }, [paper]);

  return (
    <div className="page practice-page">
      <div className="net-paper-head">
        <div className="paper-title-row">
          <Link to={`${NET_BASE}/practice`} className="paper-back">
            <IconArrowLeft size={13} />
            返回试卷列表
          </Link>
          <h1>{paper.title}</h1>
        </div>
        <p className="net-paper-sub">
          {paper.meta} · {paper.answerSource} · 原卷：{paper.source}
        </p>
      </div>

      {/* 总进度条 */}
      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            本卷进度：<span className="pq-frag">已作答 <b>{done}</b> / {total}</span> ·{' '}
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
            onClear={() => clearProgress(NET_PRACTICE_STORE_KEY, paper.questions.map((q) => `${paper.id}:${q.id}`))}
            tip="清空本卷的全部作答进度？其它试卷不受影响。"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={done} aria-valuemax={total}>
          <span style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：热力图按大题分块，格子是每一题 */}
        <aside className="pq-rail" aria-label="大题与进度热力图">
          <div className="pq-heatblock">
            {paper.sections.map((sec) => {
              const st = sectionStats(sec.questionIds);
              return (
                <div key={sec.title} className="pq-heat">
                  <div className="pq-heat-label">
                    <span className="pq-heat-kind">{sec.short}</span>
                    <span>
                      {st.done}/{st.total}
                    </span>
                  </div>
                  <div className="pq-heat-grid">
                    {sec.questionIds.map((qid) => {
                      const r = results[`${paper.id}:${qid}`];
                      const state = r ?? 'none';
                      const stateText =
                        r === 'right' ? '已答对' : r === 'wrong' ? '已答错' : r === 'revealed' ? '已看答案' : '未作答';
                      const no = sec.questionIds.indexOf(qid) + 1;
                      return (
                        <button
                          key={qid}
                          type="button"
                          className="pq-heat-cell"
                          data-state={state}
                          title={`${sec.short} ${no} · ${stateText}`}
                          aria-label={`${sec.short} ${no} ${stateText}`}
                          onClick={() => jumpToQuestion(qid)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 主列：题目列表，按原卷大题分组 */}
        <div className="pq-main">
          <div className="pq-list">
            {paper.sections.map((sec) => (
              <Fragment key={sec.title}>
                <p className="pq-group-h" data-deck="net">
                  <b className="pq-group-no">{sec.short.slice(0, 2)}</b>
                  {sec.title} · {sec.questionIds.length} 题
                </p>
                {sec.questionIds.map((qid) => {
                  const q = paper.questions.find((x) => x.id === qid);
                  if (!q) return null;
                  return (
                    <PracticeCard
                      key={qid}
                      quiz={q}
                      label={seqOf.get(qid) ?? qid}
                      result={results[`${paper.id}:${qid}`]}
                      onResult={onResult}
                      tagNav={tagNav}
                      tagDeckKey={() => 'net'}
                      favorite={{
                        on: books.favorited(`${paper.id}:${qid}`),
                        onToggle: () => books.toggleFavorite(`${paper.id}:${qid}`),
                      }}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 本卷报告：作答数据图表化，随作答实时更新（整卷未作答时不渲染）；本课进度键带卷前缀，这里同步改写 */}
      <PracticeReport
        title="本卷报告"
        questions={paper.questions.map((q) => ({ ...q, id: `${paper.id}:${q.id}` }))}
        results={results}
        deckMeta={(deck) => ({ name: `第 ${deck} 章`, color: `var(--net${deck}, var(--deck-accent))` })}
        tagNav={tagNav}
      />

      {/* 右侧进度轨：每 10 题一段，点击跳转（仅宽屏） */}
      <AnimatePresence>
        {segmentCount > 1 && (
          <nav className="pq-track" aria-label="题目分段导航">
            {Array.from({ length: segmentCount }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`pq-track-seg${k === activeSeg ? ' active' : ''}`}
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, paper.questions.length)} 题 · ${sectionOf.get(paper.questions[k * SEGMENT]?.id ?? '') ?? ''}`}
                onClick={() => scrollToCard(k * SEGMENT)}
              >
                <i />
                <span>{k * SEGMENT + 1}</span>
              </button>
            ))}
          </nav>
        )}
      </AnimatePresence>

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
    </div>
  );
}

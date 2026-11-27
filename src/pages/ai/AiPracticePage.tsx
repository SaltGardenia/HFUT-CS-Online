import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AI_BASE } from '../../courses/registry';
import { aiPaper } from '../../content/ai';
import PracticeCard from '../../components/practice/PracticeCard';
import PracticeReport from '../../components/practice/report/PracticeReport';
import ClearProgress from '../../components/practice/ClearProgress';
import { IconChevronUp } from '../../components/icons';
import { clearProgress, useProgressStore } from '../../lib/sync';
import { useQuestionBooks } from '../../lib/questionBooks';
import { BookCards } from '../../components/practice/books';

/** 单卷进度存储 key（与算法课/计网课各自独立） */
/** 书页路由复用同一进度键（导出给课程根） */
export const AI_PRACTICE_STORE_KEY = 'ai-practice-progress-v1';
const AI_STORE_KEY = AI_PRACTICE_STORE_KEY;

/** 单题作答状态（设计题为开放题，只会有 revealed） */
type AiResult = 'right' | 'wrong' | 'revealed';

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

/**
 * 设计报告题库答题页：左侧热力图（按方向分块）+ 右侧答题区。
 * 题库只有一份试卷，按约定直接展示，不走试卷列表；方向背景收在折叠块里，标签 ?s= 可定位。
 */
export default function AiPracticePage() {
  const reduced = useReducedMotion();
  const [params] = useSearchParams();
  const s = params.get('s');

  const [results, setResults] = useProgressStore<AiResult>(AI_STORE_KEY);
  const books = useQuestionBooks('ai');

  const onResult = (qid: string, r: AiResult) => {
    setResults((prev) => ({ ...prev, [qid]: r }));
    books.trackResult(qid, r);
  };

  const { done, total } = useMemo(() => {
    const done = aiPaper.questions.filter((q) => results[q.id]).length;
    return { done, total: aiPaper.questions.length };
  }, [results]);

  const { idx, showTop } = useScrollProbe(aiPaper.questions.length);

  // 每题所在的方向（右轨 tooltip 用）
  const sectionOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const sec of aiPaper.sections) for (const id of sec.questionIds) m.set(id, sec.title);
    return m;
  }, []);

  // 每题的展示序号（全卷 1~15 连续，与原文档题号一致；题干本身以「题目 N：」开头，标签用方向短名避免重复）
  const seqOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const sec of aiPaper.sections) {
      sec.questionIds.forEach((qid) => {
        const no = aiPaper.questions.findIndex((q) => q.id === qid) + 1;
        m.set(qid, `${sec.short} ${no}`);
      });
    }
    return m;
  }, []);

  const scrollToEl = (el: Element) => {
    const top = el.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
  };

  // ?s= 定位：dir-N 展开并滚到方向背景；qid 滚到具体题目
  useEffect(() => {
    if (!s) return;
    const t = window.setTimeout(() => {
      if (s.startsWith('dir-')) {
        const el = document.getElementById(`ai-${s}`);
        if (el instanceof HTMLDetailsElement) el.open = true;
        if (el) scrollToEl(el);
      } else {
        const el = document.querySelector(`.practice-q[data-qid="${s}"]`);
        if (el) scrollToEl(el);
      }
    }, reduced ? 30 : 130);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, reduced]);

  // 知识点标签 → 同页方向背景（?s=dir-N）
  const tagNav = (t: { deck: number; sec: string; text: string }) => {
    const sec = aiPaper.sections.find((x) => x.no === t.deck);
    return {
      href: `${AI_BASE}/practice?s=${t.sec}`,
      tip: `跳转到 ${sec ? sec.title : '题库方向'} · ${t.text}`,
    };
  };

  const segmentCount = Math.ceil(aiPaper.questions.length / SEGMENT);
  const activeSeg = Math.min(Math.floor(idx / SEGMENT), Math.max(0, segmentCount - 1));

  return (
    <div className="page practice-page">
      <div className="net-paper-head">
        <h1>{aiPaper.title}</h1>
        <p className="net-paper-sub">
          原文档：{aiPaper.source} · {aiPaper.answerSource}
        </p>
      </div>

      <div className="callout key">
        <p className="callout-h">题库说明</p>
        <div dangerouslySetInnerHTML={{ __html: aiPaper.intro }} />
      </div>

      <BookCards base={AI_BASE} course="ai" />

      {/* 总进度条：设计题为开放题，进度即「已查阅」 */}
      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            本卷进度：<span className="pq-frag">已查阅 <b>{done}</b> / {total} 题</span>
          </span>
          <ClearProgress
            done={done}
            onClear={() => clearProgress(AI_STORE_KEY, aiPaper.questions.map((q) => q.id))}
            tip="清空本卷的全部查阅记录？"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={done} aria-valuemax={total}>
          <span style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：热力图按方向分块，格子是每一题 */}
        <aside className="pq-rail" aria-label="方向与进度热力图">
          <div className="pq-heatblock">
            {aiPaper.sections.map((sec) => {
              const doneSec = sec.questionIds.filter((id) => results[id]).length;
              return (
                <div key={sec.id} className="pq-heat">
                  <div className="pq-heat-label">
                    <span className="pq-heat-kind">{sec.short}</span>
                    <span>
                      {doneSec}/{sec.questionIds.length}
                    </span>
                  </div>
                  <div className="pq-heat-grid">
                    {sec.questionIds.map((qid) => {
                      const r = results[qid];
                      const state = r ?? 'none';
                      const stateText = r === 'revealed' ? '已查阅' : '未查阅';
                      const no = aiPaper.questions.findIndex((q) => q.id === qid) + 1;
                      return (
                        <button
                          key={qid}
                          type="button"
                          className="pq-heat-cell"
                          data-state={state}
                          title={`题目 ${no} · ${stateText}`}
                          aria-label={`题目 ${no} ${stateText}`}
                          onClick={() => {
                            const el = document.querySelector(`.practice-q[data-qid="${qid}"]`);
                            if (el) scrollToEl(el);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 主列：题目列表，按原文档方向分组 */}
        <div className="pq-main">
          <div className="pq-list">
            {aiPaper.sections.map((sec) => (
              <Fragment key={sec.id}>
                <p className="pq-group-h" data-deck="ai" id={`ai-${sec.id}`}>
                  <b className="pq-group-no">{sec.short.slice(0, 2)}</b>
                  {sec.title} · {sec.questionIds.length} 题
                </p>
                {sec.brief && (
                  <details className="ai-kp">
                    <summary>方向背景 · 实验目的与背景知识（原文档）</summary>
                    <div className="ai-kp-body" dangerouslySetInnerHTML={{ __html: sec.brief }} />
                  </details>
                )}
                {sec.questionIds.map((qid) => {
                  const q = aiPaper.questions.find((x) => x.id === qid);
                  if (!q) return null;
                  return (
                    <PracticeCard
                      key={qid}
                      quiz={q}
                      label={seqOf.get(qid) ?? qid}
                      result={results[qid]}
                      onResult={onResult}
                      favorite={{ on: books.favorited(qid), onToggle: () => books.toggleFavorite(qid) }}
                      tagNav={tagNav}
                      tagDeckKey={() => 'ai'}
                    />
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 本卷报告：作答数据图表化，随作答实时更新（全未作答时不渲染） */}
      <PracticeReport
        title="本卷报告"
        questions={aiPaper.questions}
        results={results}
        deckMeta={(deck) => ({
          name: aiPaper.sections.find((x) => x.no === deck)?.title ?? `方向 ${deck}`,
          // AI 课无章节色板（课件为 0）：借全局讲色板区分方向
          color: `var(--deck${deck}, var(--deck-accent))`,
        })}
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
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, aiPaper.questions.length)} 题 · ${sectionOf.get(aiPaper.questions[k * SEGMENT]?.id ?? '') ?? ''}`}
                onClick={() => {
                  const q = aiPaper.questions[k * SEGMENT];
                  if (!q) return;
                  const el = document.querySelector(`.practice-q[data-qid="${q.id}"]`);
                  if (el) scrollToEl(el);
                }}
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

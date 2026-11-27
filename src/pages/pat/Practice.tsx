import { Fragment, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { PAT_BASE } from '../../courses/registry';
import { papers } from '../../content/pat';
import type { PatPaper } from '../../content/pat';
import PracticeCard from '../../components/practice/PracticeCard';
import ClearProgress from '../../components/practice/ClearProgress';
import { BookCards } from '../../components/practice/books';
import { useQuestionBooks } from '../../lib/questionBooks';
import { IconChevronUp } from '../../components/icons';
import { clearProgress, useProgressStore } from '../../lib/sync';

/** 作答结果的持久化 key（与算法课的 practice-progress-v1 分开） */
/** 书页路由复用同一进度键（导出给课程根） */
export const PAT_PRACTICE_STORE_KEY = 'pat-practice-progress-v1';
const STORE_KEY = PAT_PRACTICE_STORE_KEY;
type Result = 'right' | 'wrong' | 'revealed';

/** 热力图一格一题：绿=已看解析并理解，灰=已展开，浅灰=未作答 */
export default function PatPractice() {
  const reduced = useReducedMotion();
  const [params] = useSearchParams();
  const deepLink = params.get('s');
  // 试卷选择：多份试卷先出列表；本课现只有一份省赛卷，直接进入答题
  const [paperId, setPaperId] = useState<string | null>(papers.length === 1 ? papers[0].id : null);
  const [results, setResults] = useProgressStore<Result>(STORE_KEY);
  const books = useQuestionBooks('pat');
  const [showTop, setShowTop] = useState(false);

  const paper: PatPaper | undefined = papers.find((p) => p.id === paperId);

  // 置顶按钮：滚过一屏出现
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      setShowTop(window.scrollY > 800);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ?s=<题目id> 深链：定位到具体赛题
  useEffect(() => {
    if (!deepLink || !paper) return;
    const t = window.setTimeout(() => {
      const el = document.querySelector(`.practice-q[data-qid="${deepLink}"]`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 108;
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
      }
    }, 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink, paperId]);

  if (papers.length > 1 && !paper) {
    // 试卷列表：供用户选择（本课现仅一份试卷，此分支为多卷预留）
    return (
      <div className="page practice-page">
        <h1>在线练习</h1>

      <BookCards base={PAT_BASE} course="pat" />
        <div className="pq-progress material">
          <div className="pq-progress-text">
            <span>选择一份试卷开始作答</span>
          </div>
        </div>
        <div className="card-grid">
          {papers.map((p) => {
            const done = p.questions.filter((q) => results[`${p.id}:${q.id}`]).length;
            return (
              <button key={p.id} type="button" className="card" onClick={() => setPaperId(p.id)}>
                <h3>{p.title}</h3>
                <p>
                  {p.source} · {p.questions.length} 题 · 已作答 {done}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!paper) return null;

  const total = paper.questions.length;
  const totalDone = paper.questions.filter((q) => results[q.id]).length;
  const seenAnswer = paper.questions.filter((q) => results[q.id] === 'revealed').length;

  const onResult = (qid: string, r: Result) => {
    setResults((s) => ({ ...s, [qid]: r }));
    books.trackResult(qid, r);
  };

  const stateText = (r: Result | undefined) =>
    r === 'revealed' ? '已看解析' : r ? '已标记' : '未作答';

  return (
    <div className="page practice-page">
      <h1>在线练习</h1>

      {/* 试卷头：来源与说明 */}
      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            {paper.title} · <span className="pq-frag">{paper.questions.length} 题</span> ·{' '}
            <span className="pq-frag">已展开解析 <b>{seenAnswer}</b> / {total}</span> · 参考答案：{paper.answerSource}
          </span>
          <ClearProgress
            done={totalDone}
            onClear={() => clearProgress(STORE_KEY, paper.questions.map((q) => q.id))}
            tip="清空本卷的全部作答进度？"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={totalDone} aria-valuemax={total}>
          <span style={{ width: `${(totalDone / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：热力图即总览+导航——格子是每一道赛题，点击跳题 */}
        <aside className="pq-rail" aria-label="赛题进度热力图">
          <div className="pq-heatblock">
            <div className="pq-heat" data-active="true">
              <button type="button" className="pq-heat-label" aria-pressed="true">
                <span className="pq-heat-kind">赛题</span>
                <span>
                  {totalDone}/{total}
                </span>
              </button>
              <div className="pq-heat-grid">
                {paper.questions.map((q) => {
                  const r = results[q.id];
                  const state = r ?? 'none';
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className="pq-heat-cell"
                      data-state={state === 'revealed' ? 'revealed' : state ? 'right' : 'none'}
                      title={`赛题 ${q.no} ${q.title} · ${stateText(r)}`}
                      aria-label={`赛题 ${q.no} ${q.title} ${stateText(r)}`}
                      onClick={() => {
                        const el = document.querySelector(`.practice-q[data-qid="${q.id}"]`);
                        if (el) {
                          const top = el.getBoundingClientRect().top + window.scrollY - 108;
                          window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* 主列：题目列表（每题附知识点标签，可跳转到讲次对应位置） */}
        <div className="pq-main">
          <div className="pq-list">
            {paper.questions.map((q) => (
              <Fragment key={q.id}>
                <PracticeCard
                  quiz={{
                    id: q.id,
                    kind: 'essay',
                    question: q.question,
                    answer: q.answer,
                    explanation: q.explanation,
                    tags: q.tags,
                  }}
                  label={`赛题 ${q.no} · ${q.title} · ${q.time}`}
                  result={results[q.id]}
                  onResult={onResult}
                  favorite={{ on: books.favorited(q.id), onToggle: () => books.toggleFavorite(q.id) }}
                  tagNav={(t) => ({
                    href: `${PAT_BASE}/deck/deck${t.deck}?s=${t.sec}`,
                    tip: `跳转到 ${decodeDeckTitle(t.deck)} · ${t.text}`,
                  })}
                  tagDeckKey={() => 'pat'}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

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

function decodeDeckTitle(deck: number): string {
  const titles: Record<number, string> = {
    1: '第一讲 · STL 简介',
    2: '第二讲 · 搜索专题',
    3: '第三讲 · 计算几何',
    4: '讲义 · 动态规划',
    5: '讲义 · 组合数学',
    6: '讲义 · 专题解析',
  };
  return titles[deck] ?? `讲义 ${deck}`;
}

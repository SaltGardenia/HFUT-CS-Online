import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { practiceQuestions, KIND_META, type PracticeKind } from '../content/practice';
import PracticeCard from '../components/practice/PracticeCard';
import PracticeReport from '../components/practice/report/PracticeReport';
import ClearProgress from '../components/practice/ClearProgress';
import { BookCards } from '../components/practice/books';
import { IconChevronUp } from '../components/icons';
import { clearProgressStore, useProgressStore } from '../lib/sync';
import { useQuestionBooks } from '../lib/questionBooks';

/** 题型（固定顺序，与热力图分块一一对应） */
const KINDS: PracticeKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 作答结果的持久化 key */
const STORE_KEY = 'practice-progress-v1';
type Result = 'right' | 'wrong' | 'revealed';

/** 右侧进度轨 / 吸顶摘要的分段大小 */
const SEGMENT = 10;

/** 滚动监听：rAF 节流，返回「视口顶部最近的题目序号」与「是否该出现置顶按钮」 */
function useScrollProbe(visibleLength: number, listResetKey: string) {
  const reduced = useReducedMotion();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLength, listResetKey, reduced]);
  return state;
}

export default function PracticePage() {
  const reduced = useReducedMotion();
  const [kind, setKind] = useState<PracticeKind>('single');
  const [results, setResults] = useProgressStore<Result>(STORE_KEY);
  const books = useQuestionBooks('algo');
  const firstKindRun = useRef(true);

  const onResult = (qid: string, r: Result) => {
    setResults((s) => ({ ...s, [qid]: r }));
    books.trackResult(qid, r);
  };

  const bankOf = (k: PracticeKind) => practiceQuestions.filter((q) => q.kind === k);

  const countFor = (k: PracticeKind) => {
    const bank = bankOf(k);
    const done = bank.filter((q) => results[q.id]).length;
    const right = bank.filter((q) => results[q.id] === 'right').length;
    return { done, right };
  };

  // 题型选择融在热力图分块标题上：可见列表只由题型决定
  const visible = useMemo(() => bankOf(kind), [kind]);

  // 热力图点击 → 跨题型时先切题型再跳（声明在锚定 effect 之前）
  const pendingJump = useRef<string | null>(null);

  // 题型切换：把列表锚到吸顶条之下，避免深滚位置出现「莫名的半张卡」。
  // 热力图跳转会先切题型再落到具体题，此时跳过锚定，由 pendingJump 接管滚动。
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

  // 热力图点击 → 跳到具体题目
  const jumpToQuestion = (qid: string, k: PracticeKind) => {
    pendingJump.current = qid;
    if (kind === k) {
      // 题型不变时 visible 不重算，直接滚
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

  // visible 更新后执行未完成的跳转
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

  // ?s=<题目id> 深链（搜索试题命中跳转）：跨题型先切题型，滚动交给 pendingJump
  const [params] = useSearchParams();
  const deepLink = params.get('s');
  useEffect(() => {
    if (!deepLink) return;
    const q = practiceQuestions.find((x) => x.id === deepLink);
    if (!q) return;
    jumpToQuestion(q.id, q.kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink]);

  const { idx, showTop } = useScrollProbe(visible.length, kind);

  const totalDone = practiceQuestions.filter((q) => results[q.id]).length;
  const totalRight = practiceQuestions.filter((q) => results[q.id] === 'right').length;
  const total = practiceQuestions.length;

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

  // 右轨分段起点所在讲次（tooltip 里给出「落在哪一讲」）
  const segDeck = (k: number) => {
    const q = visible[k * SEGMENT];
    return q ? Math.min(...q.tags.map((t) => t.deck)) : 0;
  };
  // 列表渲染用的分组游标（每次渲染重置）；各讲在当前筛选下的题数
  const groups = useMemo(() => {
    const counts = new Map<number, number>();
    visible.forEach((q) => {
      const d = Math.min(...q.tags.map((t) => t.deck));
      counts.set(d, (counts.get(d) ?? 0) + 1);
    });
    return counts;
  }, [visible]);
  let lastDeck = 0;

  return (
    <div className="page practice-page">
      <h1>在线练习</h1>

      <BookCards base="/algo" course="algo" />

      {/* 总进度条 */}
      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            总进度：<span className="pq-frag">已作答 <b>{totalDone}</b> / {total}</span> ·{' '}
            <span className="pq-frag">
              答对{' '}
              <motion.b
                className="pq-right-num"
                key={totalRight}
                initial={reduced ? false : { scale: 1.4, color: 'var(--ok)' }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 20 }}
              >
                {totalRight}
              </motion.b>{' '}
              题
            </span>
          </span>
          <ClearProgress
            done={totalDone}
            onClear={() => clearProgressStore(STORE_KEY)}
            tip="清空本课全部题目的作答进度？"
          />
        </div>
        <div className="pq-progress-bar" role="progressbar" aria-valuenow={totalDone} aria-valuemax={total}>
          <span style={{ width: `${(totalDone / total) * 100}%` }} />
        </div>
      </div>

      <div className="pq-layout">
        {/* 左栏：热力图即总览+导航——分块标题就是题型切换，格子里是每一题 */}
        <aside className="pq-rail" aria-label="题型与进度热力图">
          {/* 420 格，一格一题——绿=答对，红=答错，深灰=已看答案，浅灰=未作答；点击标题切题型、点击格子跳题 */}
          <div className="pq-heatblock">
            {KINDS.map((k) => {
              const c = countFor(k);
              const short = KIND_META[k].label.replace('题', '');
              return (
                <div key={k} className="pq-heat" data-active={kind === k}>
                  <button
                    type="button"
                    className="pq-heat-label"
                    onClick={() => setKind(k)}
                    aria-pressed={kind === k}
                  >
                    <span className="pq-heat-kind">{short}</span>
                    <span>
                      {c.done}/{KIND_META[k].total}
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
                          title={`${short} ${Number(q.id.slice(1))} · ${stateText}`}
                          aria-label={`${short} ${Number(q.id.slice(1))} ${stateText}`}
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

        {/* 主列：题目列表 */}
        <div className="pq-main">
          <div className="pq-list" key={kind}>
            {visible.map((q) => {
              // 讲次分组分隔：按各题主讲次（tag 里最小的讲号）给长列表一个定位锚点
              const d = Math.min(...q.tags.map((t) => t.deck));
              const showHead = d !== lastDeck;
              lastDeck = d;
              return (
                <Fragment key={q.id}>
                  {showHead && (
                    <p className="pq-group-h" data-deck={`deck${d}`}>
                      <b className="pq-group-no">{d}</b>第 {d} 讲 · {groups.get(d) ?? 0} 题
                    </p>
                  )}
                  <PracticeCard
                    quiz={q}
                    label={`${KIND_META[q.kind].label.replace('题', '')} ${Number(q.id.slice(1))}`}
                    result={results[q.id]}
                    onResult={onResult}
                    favorite={{ on: books.favorited(q.id), onToggle: () => books.toggleFavorite(q.id) }}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 全部习题报告：420 题全库口径，随作答实时更新（全未作答时不渲染） */}
      <PracticeReport title="全部习题报告" questions={practiceQuestions} results={results} />

      {/* 右侧进度轨：每 10 题一段，点击跳转（仅宽屏） */}
      <AnimatePresence>
        {segmentCount > 1 && (
          <nav className="pq-track" aria-label="题目分段导航">
            {Array.from({ length: segmentCount }, (_, k) => (
              <button
                key={k}
                type="button"
                className={`pq-track-seg${k === activeSeg ? ' active' : ''}`}
                title={`第 ${k * SEGMENT + 1}–${Math.min((k + 1) * SEGMENT, visible.length)} 题 · ${segDeck(k) ? `第 ${segDeck(k)} 讲` : ''}`}
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

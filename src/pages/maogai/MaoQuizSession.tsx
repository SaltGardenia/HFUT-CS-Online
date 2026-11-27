import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { maoBank, type MaoQuestion } from '../../content/maogai';
import {
  LEARN_STREAK,
  deferOverflow,
  gradeCard,
  learnQueue,
  reviewPool,
  takeReviewQueue,
  useMaoState,
} from '../../lib/maoquiz';
import { setQMark } from '../../lib/sync/local';
import { useCourseQMarks } from '../../lib/sync';
import QuestionCard from './QuestionCard';

const MAO_COURSE = 'maogai';

export default function MaoQuizSession() {
  const { mode } = useParams();
  const reduced = useReducedMotion();
  const live = useMaoState();

  const kind = mode === 'review' ? 'review' : 'learn';

  // 复习模式：候选池按优先级（薄弱 > 刚学不久 > 熟词）取当日配额，溢出的到期卡顺延一天
  // 学习模式：未学新卡 + 学习中的卡，不限量。队列在进页面时定格。
  const [queue, setQueue] = useState<MaoQuestion[]>(() => {
    if (kind === 'review') {
      const { queue: picked, state } = takeReviewQueue(maoBank, live, Date.now());
      deferOverflow(state);
      return picked;
    }
    return learnQueue(maoBank, live);
  });
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState({ good: 0, bad: 0 });
  // 判分后手动点「下一题」推进（Enter 等价）
  const next = () => setIdx((i) => i + 1);

  const q = queue[idx];
  const finished = idx >= queue.length;

  // 收藏星标（hb-qmarks:maogai 的收藏本）
  const marks = useCourseQMarks(MAO_COURSE);
  const favOn = (id: string) => !!marks.fav[id]?.on;
  const toggleFav = (id: string) => setQMark(MAO_COURSE, 'fav', id, !favOn(id));


  /** 学习队列（不限量）；复习队列带溢出顺延 */
  const buildQueue = (m: 'learn' | 'review', now = Date.now()) => {
    if (m === 'review') {
      const { queue: picked, state } = takeReviewQueue(maoBank, live, now);
      deferOverflow(state);
      return picked;
    }
    return learnQueue(maoBank, live);
  };

  /**
   * 判分：作答即调度（反应时长/题型修正在内）。
   * 答错入错题本、答对自动移出（与其他课程两本账同款）；
   * 学习模式里未连满 LEARN_STREAK 的卡排到本轮队尾（百词斩式重现）。
   */
  const onGrade = (item: MaoQuestion) => (good: boolean, elapsedMs: number) => {
    gradeCard(item.id, good, elapsedMs, item.kind);
    setTally((t) => ({ good: t.good + (good ? 1 : 0), bad: t.bad + (good ? 0 : 1) }));
    if (!good) setQMark(MAO_COURSE, 'wrong', item.id, true);
    else if (marks.wrong[item.id]?.on) setQMark(MAO_COURSE, 'wrong', item.id, false);
    if (kind === 'learn') {
      const rec = live.cards[item.id];
      const streakAfter = good ? (rec?.streak ?? 0) + 1 : 0;
      const stillLearning = !rec || rec.st === 0 ? !good || streakAfter < LEARN_STREAK : false;
      if (stillLearning) setQueue((qu) => [...qu, item]);
    }
  };

  const endActions = useMemo(() => {
    const now = Date.now();
    return {
      learnLeft: learnQueue(maoBank, live).length,
      reviewLeft: reviewPool(maoBank, live, now).length,
    };
  }, [finished, live]);

  // 空队列（直接输入 URL 而没有到期卡/新卡）
  if (queue.length === 0) {
    return (
      <main className="mq-main mq-center">
        <p className="mq-empty">{kind === 'review' ? '没有到期的复习卡。' : '新题已背完，学习中的卡也掌握了。'}</p>
        <Link className="btn" to="/maogai">返回总览</Link>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="mq-main mq-center">
        <h1 className="mq-done-h">本轮完成</h1>
        <p className="mq-done-s">答对 {tally.good} · 答错 {tally.bad}</p>
        <div className="mq-modes">
          {endActions.learnLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => {
              setQueue(buildQueue('learn'));
              setIdx(0);
              setTally({ good: 0, bad: 0 });
            }}>
              <b>继续学习</b>
              <span>{endActions.learnLeft} 张卡</span>
            </button>
          )}
          {endActions.reviewLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => {
              setQueue(buildQueue('review'));
              setIdx(0);
              setTally({ good: 0, bad: 0 });
            }}>
              <b>接着复习</b>
              <span>到期 {endActions.reviewLeft} 题</span>
            </button>
          )}
          <Link className="btn" to="/maogai">返回总览</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mq-main">
      <div className="mq-top">
        <span className="mq-top-n">第 {idx + 1} / {queue.length} 题</span>
      </div>
      <div className="mq-top-bar">
        <i style={{ width: `${(idx / queue.length) * 100}%` }} />
      </div>
      <motion.div
        key={`${q.id}-${idx}`}
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <QuestionCard
          q={q}
          onNext={next}
          onGrade={onGrade(q)}
          fav={{ on: favOn(q.id), onToggle: () => toggleFav(q.id) }}
        />
      </motion.div>
    </main>
  );
}

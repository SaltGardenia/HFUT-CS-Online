import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { maoBank, type MaoQuestion } from '../../content/maogai';
import { LEARN_STREAK, gradeCard, learnQueue, reviewQueue, useMaoState } from '../../lib/maoquiz';
import { setQMark } from '../../lib/sync/local';
import { useCourseQMarks } from '../../lib/sync';
import QuestionCard from './QuestionCard';

const MAO_COURSE = 'maogai';
/** 答对后停留（给判分反馈）/ 答错后停留（看正确答案）的时长 */
const NEXT_DELAY_GOOD = 420;
const NEXT_DELAY_BAD = 1150;

export default function MaoQuizSession() {
  const { mode } = useParams();
  const reduced = useReducedMotion();
  const live = useMaoState();

  const kind = mode === 'review' ? 'review' : 'learn';

  // 队列在进页面时定格；学习模式下未学会的卡会排到本轮队尾重现
  const [queue, setQueue] = useState<MaoQuestion[]>(() =>
    kind === 'review' ? reviewQueue(maoBank, live, Date.now()) : learnQueue(maoBank, live),
  );
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState({ good: 0, bad: 0 });
  const timerRef = useRef(0);

  const q = queue[idx];
  const finished = idx >= queue.length;

  // 收藏星标（hb-qmarks:maogai 的收藏本）
  const marks = useCourseQMarks(MAO_COURSE);
  const favOn = (id: string) => !!marks.fav[id]?.on;
  const toggleFav = (id: string) => setQMark(MAO_COURSE, 'fav', id, !favOn(id));

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const buildQueue = (m: 'learn' | 'review', now = Date.now()) =>
    m === 'review' ? reviewQueue(maoBank, live, now) : learnQueue(maoBank, live);

  /** 判分：写调度账；答错入错题本、答对自动移出（与其他课程两本账同款）；学习模式把未学会的卡排到本轮队尾 */
  const onGrade = (item: MaoQuestion) => (good: boolean) => {
    gradeCard(item.id, good);
    setTally((t) => ({ good: t.good + (good ? 1 : 0), bad: t.bad + (good ? 0 : 1) }));
    if (!good) setQMark(MAO_COURSE, 'wrong', item.id, true);
    else if (marks.wrong[item.id]?.on) setQMark(MAO_COURSE, 'wrong', item.id, false);
    if (kind === 'learn') {
      // 学习中的卡：答对但还没连满 LEARN_STREAK 次，或答错——都会在本轮再次出现
      const rec = live.cards[item.id];
      const streakAfter = good ? (rec?.k ?? 0) + 1 : 0;
      const stillLearning = !good || streakAfter < LEARN_STREAK;
      if (stillLearning) setQueue((qu) => [...qu, item]);
    }
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setIdx((i) => i + 1), good ? NEXT_DELAY_GOOD : NEXT_DELAY_BAD);
  };

  const endActions = useMemo(() => {
    const now = Date.now();
    return {
      learnLeft: learnQueue(maoBank, live).length,
      reviewLeft: reviewQueue(maoBank, live, now).length,
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
          autoAdvance
          onGrade={onGrade(q)}
          fav={{ on: favOn(q.id), onToggle: () => toggleFav(q.id) }}
        />
      </motion.div>
    </main>
  );
}

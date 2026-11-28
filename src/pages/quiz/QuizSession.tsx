import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { loadQuizBank, type QuizCourse } from '../../content/quizbank';
import type { QuizQuestion } from '../../content/quizbank/types';
import {
  LEARN_STREAK,
  deferOverflow,
  gradeCard,
  learnQueue,
  reviewPool,
  takeReviewQueue,
  useQuizState,
} from '../../lib/maoquiz';
import { setQMark } from '../../lib/sync/local';
import { useCourseQMarks } from '../../lib/sync';
import QuestionCard from './QuestionCard';

export default function QuizSession({ course }: { course: QuizCourse }) {
  const { mode } = useParams();
  const reduced = useReducedMotion();
  const live = useQuizState(course.slug);

  const kind = mode === 'review' ? 'review' : 'learn';
  const [bank, setBank] = useState<QuizQuestion[] | null>(null);
  const [queue, setQueue] = useState<QuizQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState({ good: 0, bad: 0 });

  // 题库按需加载；加载完成后按模式定格本轮队列
  useEffect(() => {
    let alive = true;
    loadQuizBank(course).then((b) => {
      if (!alive) return;
      setBank(b);
      const state = live;
      if (kind === 'review') {
        const picked = takeReviewQueue(b, state, Date.now());
        deferOverflow(course.slug, picked.state);
        setQueue(picked.queue);
      } else {
        setQueue(learnQueue(b, state));
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.slug]);

  const q = queue && idx < queue.length ? queue[idx] : null;
  const finished = queue !== null && idx >= queue.length;

  // 收藏星标（hb-qmarks:<slug> 的收藏本）
  const marks = useCourseQMarks(course.slug);
  const favOn = (id: string) => !!marks.fav[id]?.on;
  const toggleFav = (id: string) => setQMark(course.slug, 'fav', id, !favOn(id));

  const buildQueue = (m: 'learn' | 'review', now = Date.now()) => {
    if (!bank) return [];
    if (m === 'review') {
      const picked = takeReviewQueue(bank, live, now);
      deferOverflow(course.slug, picked.state);
      return picked.queue;
    }
    return learnQueue(bank, live);
  };

  /**
   * 判分：作答即调度（反应时长/题型修正在内）。
   * 答错入错题本、答对自动移出（与其他课程两本账同款）；
   * 学习模式里未连满 LEARN_STREAK 的卡排到本轮队尾（百词斩式重现）。
   */
  const onGrade = useCallback(
    (item: QuizQuestion) => (good: boolean, elapsedMs: number) => {
      gradeCard(course.slug, item.id, good, elapsedMs, item.kind);
      setTally((t) => ({ good: t.good + (good ? 1 : 0), bad: t.bad + (good ? 0 : 1) }));
      if (!good) setQMark(course.slug, 'wrong', item.id, true);
      else if (marks.wrong[item.id]?.on) setQMark(course.slug, 'wrong', item.id, false);
      if (kind === 'learn') {
        const rec = live.cards[item.id];
        const streakAfter = good ? (rec?.streak ?? 0) + 1 : 0;
        const stillLearning = !rec || rec.st === 0 ? !good || streakAfter < LEARN_STREAK : false;
        if (stillLearning) setQueue((qu) => (qu ? [...qu, item] : qu));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [course.slug, kind, live, marks],
  );

  const next = () => setIdx((i) => i + 1);

  const endActions = useMemo(() => {
    if (!bank) return { learnLeft: 0, reviewLeft: 0 };
    const now = Date.now();
    return {
      learnLeft: learnQueue(bank, live).length,
      reviewLeft: reviewPool(bank, live, now).length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, finished, live]);

  // 空队列（直接输入 URL 而没有到期卡/新卡）
  if (queue !== null && queue.length === 0) {
    return (
      <main className="mq-main mq-center">
        <p className="mq-empty">{kind === 'review' ? '没有到期的复习卡。' : '新题已背完，学习中的卡也掌握了。'}</p>
        <Link className="btn" to={`/quiz/${course.slug}`}>返回总览</Link>
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
          <Link className="btn" to={`/quiz/${course.slug}`}>返回总览</Link>
        </div>
      </main>
    );
  }

  if (!q) {
    return (
      <main className="mq-main mq-center">
        <p className="mq-empty">题库加载中…</p>
      </main>
    );
  }

  return (
    <main className="mq-main">
      <div className="mq-top">
        <span className="mq-top-n">第 {idx + 1} / {queue!.length} 题</span>
      </div>
      <div className="mq-top-bar">
        <i style={{ width: `${(idx / queue!.length) * 100}%` }} />
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

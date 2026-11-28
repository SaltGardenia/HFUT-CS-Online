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
  readGroupSize,
  reviewPool,
  takeGroup,
  takeReviewQueue,
  useQuizState,
} from '../../lib/maoquiz';
import { setQMark } from '../../lib/sync/local';
import { useCourseQMarks } from '../../lib/sync';
import { IconArrowLeft, IconArrowRight } from '../../components/icons';
import QuestionCard from './QuestionCard';

export default function QuizSession({ course }: { course: QuizCourse }) {
  const { mode } = useParams();
  const reduced = useReducedMotion();
  const live = useQuizState(course.slug);

  const kind = mode === 'review' ? 'review' : 'learn';
  const [bank, setBank] = useState<QuizQuestion[] | null>(null);
  const [group, setGroup] = useState<QuizQuestion[] | null>(null);
  const [queue, setQueue] = useState<QuizQuestion[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState({ good: 0, bad: 0 });

  // 题库按需加载；加载完成后按模式与「每组题数」定格本组
  useEffect(() => {
    let alive = true;
    loadQuizBank(course).then((b) => {
      if (!alive) return;
      setBank(b);
      const state = live;
      let full: QuizQuestion[];
      if (kind === 'review') {
        const picked = takeReviewQueue(b, state, Date.now());
        deferOverflow(course.slug, picked.state);
        full = picked.queue;
      } else {
        full = learnQueue(b, state);
      }
      const picked = takeGroup(full, readGroupSize(kind));
      setGroup(picked);
      setQueue(picked);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.slug, kind]);

  const q = queue && idx < queue.length ? queue[idx] : null;
  const finished = queue !== null && idx >= queue.length;

  // 本组进度：学习看「已掌握」，复习看「已作答」
  const groupTotal = group?.length ?? 0;
  const doneInGroup = !group
    ? 0
    : kind === 'review'
      ? Math.min(idx, group.length)
      : group.filter((item) => (live.cards[item.id]?.st ?? 0) >= 1).length;

  // 收藏星标（hb-qmarks:<slug> 的收藏本）
  const marks = useCourseQMarks(course.slug);
  const favOn = (id: string) => !!marks.fav[id]?.on;
  const toggleFav = (id: string) => setQMark(course.slug, 'fav', id, !favOn(id));

  /** 从当前模式的剩余队列取下一组并重置本组进度 */
  const startGroup = (m: 'learn' | 'review', now = Date.now()) => {
    if (!bank) return;
    let full: QuizQuestion[];
    if (m === 'review') {
      const picked = takeReviewQueue(bank, live, now);
      deferOverflow(course.slug, picked.state);
      full = picked.queue;
    } else {
      full = learnQueue(bank, live);
    }
    const picked = takeGroup(full, readGroupSize(m));
    setGroup(picked);
    setQueue(picked);
    setIdx(0);
    setTally({ good: 0, bad: 0 });
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
        <h1 className="mq-done-h">本组完成</h1>
        <p className="mq-done-s">
          答对 {tally.good} · 答错 {tally.bad} · 本组 {groupTotal} 题
        </p>
        <div className="mq-modes">
          <Link className="mq-mode" to={`/quiz/${course.slug}`}>
            <span className="mq-mode-head">
              <IconArrowLeft size={16} />
              <b>返回总览</b>
            </span>
            <span>已学 {Object.keys(live.cards).length} / {course.count} 题</span>
          </Link>
          {endActions.learnLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => startGroup('learn')}>
              <span className="mq-mode-head">
                <b>继续学习</b>
                <IconArrowRight size={16} />
              </span>
              <span>
                下一组 {Math.min(readGroupSize('learn'), endActions.learnLeft)} 题 · 待学 {endActions.learnLeft}
              </span>
            </button>
          )}
          {endActions.reviewLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => startGroup('review')}>
              <span className="mq-mode-head">
                <b>接着复习</b>
                <IconArrowRight size={16} />
              </span>
              <span>
                下一组 {Math.min(readGroupSize('review'), endActions.reviewLeft)} 题 · 到期 {endActions.reviewLeft}
              </span>
            </button>
          )}
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
        <span className="mq-top-n">
          {kind === 'learn' ? '本组已掌握' : '本组已复习'} {doneInGroup} / {groupTotal} 题
        </span>
      </div>
      <div className="mq-top-bar">
        <i style={{ width: `${groupTotal ? (doneInGroup / groupTotal) * 100 : 0}%` }} />
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
          streak={{
            n: live.cards[q.id]?.streak ?? 0,
            target: kind === 'learn' ? LEARN_STREAK : undefined,
          }}
        />
      </motion.div>
    </main>
  );
}

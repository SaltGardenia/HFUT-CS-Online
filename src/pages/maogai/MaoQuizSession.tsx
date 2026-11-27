import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { maoBank, maoKindLabel, JUDGE_OPTIONS, optionsOf, type MaoQuestion } from '../../content/maogai';
import { gradeCard, learnQueue, reviewQueue, useMaoState } from '../../lib/maoquiz';
import { decodeEntities } from '../../lib/text';
import { IconCheck, IconX } from '../../components/icons';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const normalize = (s: string) => s.replace(/\s+/g, '').replace(/　/g, '');

/** 判分展示文本（字母 / 正确错误 / 填空原文） */
const answerTextOf = (q: MaoQuestion): string => {
  if (q.kind === 'fill') return String(q.answer);
  if (q.kind === 'judge') return JUDGE_OPTIONS[(q.answer as number[])[0]];
  return (q.answer as number[]).map((i) => LETTERS[i]).join('、');
};

/** 一张题卡：作答 → 判分 → 艾宾浩斯自评（记住了 / 没记住） */
function QuestionCard({ q, onGrade }: { q: MaoQuestion; onGrade: (good: boolean) => void }) {
  const options = optionsOf(q);
  const answerIdx = q.kind === 'fill' ? [] : (q.answer as number[]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<'right' | 'wrong' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillInput, setFillInput] = useState('');
  const [fillWrong, setFillWrong] = useState(false);
  const fillRef = useRef<HTMLInputElement>(null);

  const locked = submitted !== null || revealed;
  const showGrade = locked;
  const suggest = submitted === 'right' ? true : submitted === 'wrong' ? false : null;

  const optionState = (i: number): string => {
    const letter = LETTERS[i];
    const correct = answerIdx.includes(i);
    if (submitted === 'right' && correct) return 'correct';
    if (wrongPicks.includes(letter)) return 'wrong';
    if (submitted === 'wrong' && correct) return 'correct';
    if (!locked && picked.includes(letter)) return 'selected';
    if (locked && correct) return 'correct';
    if (locked && !correct && !picked.includes(letter)) return 'dim';
    if (revealed && correct) return 'correct';
    if (revealed && !correct) return 'dim';
    return '';
  };

  const pick = (letter: string) => {
    if (locked) return;
    if (q.kind === 'multiple') {
      setPicked((p) => (p.includes(letter) ? p.filter((l) => l !== letter) : [...p, letter]));
      return;
    }
    // 单选 / 判断：点选项即判分
    const idx = LETTERS.indexOf(letter);
    const ok = answerIdx.includes(idx);
    setPicked([letter]);
    setSubmitted(ok ? 'right' : 'wrong');
    if (!ok) setWrongPicks([letter]);
  };

  const submitMulti = () => {
    if (locked || picked.length === 0) return;
    const ok = picked.length === answerIdx.length && answerIdx.every((i) => picked.includes(LETTERS[i]));
    setSubmitted(ok ? 'right' : 'wrong');
    if (!ok) setWrongPicks(picked.filter((l) => !answerIdx.includes(LETTERS.indexOf(l))));
  };

  const checkFill = () => {
    if (locked || !fillInput.trim()) return;
    const ok = normalize(fillInput) === normalize(String(q.answer));
    setSubmitted(ok ? 'right' : 'wrong');
    setFillWrong(!ok);
  };

  // 已判分（或已看答案）后：Enter 触发建议档
  useEffect(() => {
    if (!showGrade || suggest === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      onGrade(suggest);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showGrade, suggest, onGrade]);

  const cls = submitted === 'right' ? ' answered-right' : submitted === 'wrong' ? ' answered-wrong' : '';

  return (
    <div className={`quiz mq-qcard${cls}`}>
      <p className="quiz-q">
        <span className="pq-kind" data-kind={q.kind}>{maoKindLabel(q.kind)}</span>
        <span>{decodeEntities(q.question)}</span>
      </p>
      {q.chapter && <span className="mq-chip">{q.chapter}</span>}

      {q.kind !== 'fill' && (
        <ul className="quiz-opt">
          {options.map((o, i) => {
            const letter = LETTERS[i];
            const st = optionState(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  className={`opt-btn${st ? ' ' + st : ''}`}
                  disabled={locked}
                  onClick={() => pick(letter)}
                >
                  <span className="opt-key">{letter}</span>
                  <span>{decodeEntities(o)}</span>
                  {st === 'correct' && <IconCheck size={16} className="opt-mark" style={{ marginLeft: 'auto', color: 'var(--ok)' }} />}
                  {st === 'wrong' && <IconX size={16} className="opt-mark" style={{ marginLeft: 'auto', color: 'var(--hot)' }} />}
                  {st === 'selected' && <IconCheck size={15} className="opt-mark" style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {q.kind === 'multiple' && !locked && (
        <div className="quiz-actions">
          <button className="btn primary" disabled={picked.length === 0} onClick={submitMulti}>
            提交答案（{picked.length} 项）
          </button>
          <button className="btn" onClick={() => setRevealed(true)}>直接看答案</button>
        </div>
      )}

      {q.kind === 'fill' && !locked && (
        <div className="quiz-fill">
          <input
            ref={fillRef}
            value={fillInput}
            placeholder="输入你的答案…"
            onChange={(e) => setFillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkFill()}
            aria-label="填空答案"
          />
          <button className="btn primary" onClick={checkFill}>检查</button>
          <button className="btn" onClick={() => setRevealed(true)}>显示答案</button>
        </div>
      )}

      {locked && (
        <p className="quiz-a">
          <b>答案：{answerTextOf(q)}</b>
          {q.explanation && <span>{decodeEntities(q.explanation)}</span>}
        </p>
      )}
      {q.kind === 'fill' && fillWrong && submitted === 'wrong' && (
        <p className="quiz-note">不完全一致——术语要写全，可对照上方答案核对。</p>
      )}

      {showGrade && (
        <div className="mq-grade" role="group" aria-label="记住了吗">
          <button type="button" className="btn mq-grade-bad" data-suggest={suggest === false || undefined} onClick={() => onGrade(false)}>
            <IconX size={14} /> 没记住
          </button>
          <button type="button" className="btn mq-grade-good" data-suggest={suggest === true || undefined} onClick={() => onGrade(true)}>
            <IconCheck size={14} /> 记住了
          </button>
        </div>
      )}
    </div>
  );
}

export default function MaoQuizSession() {
  const { mode } = useParams();
  const reduced = useReducedMotion();
  const live = useMaoState();

  const kind = mode === 'review' ? 'review' : 'learn';

  // 队列在进页面时定格：答题过程中新排期不影响本轮
  const [queue, setQueue] = useState<MaoQuestion[]>(() =>
    kind === 'review' ? reviewQueue(maoBank, live, Date.now()) : learnQueue(maoBank, live, Date.now()),
  );
  const [idx, setIdx] = useState(0);
  const [tally, setTally] = useState({ good: 0, bad: 0 });
  // 进页面时已学过的题（判定「新学」用）
  const seenAtMount = useRef(new Set(Object.keys(live.cards)));

  const buildQueue = (m: 'learn' | 'review', now = Date.now()) =>
    m === 'review' ? reviewQueue(maoBank, live, now) : learnQueue(maoBank, live, now);

  const onGrade = (q: MaoQuestion) => (good: boolean) => {
    gradeCard(q.id, good, !seenAtMount.current.has(q.id));
    setTally((t) => ({ good: t.good + (good ? 1 : 0), bad: t.bad + (good ? 0 : 1) }));
    setIdx((i) => i + 1);
  };

  const finished = idx >= queue.length;
  const current = queue[idx];
  const q = current ?? queue[queue.length - 1];

  const endActions = useMemo(() => {
    const now = Date.now();
    return {
      learnLeft: buildQueue('learn', now).length,
      reviewLeft: reviewQueue(maoBank, live, now).length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, live]);

  // 空队列（直接输入 URL 而没有到期卡/新卡）
  if (queue.length === 0) {
    return (
      <main className="mq-main mq-center">
        <p className="mq-empty">
          {kind === 'review' ? '没有到期的复习卡。' : '今日新学已完成或新题已背完。'}
        </p>
        <Link className="btn" to="/maogai">返回总览</Link>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="mq-main mq-center">
        <h1 className="mq-done-h">本轮完成</h1>
        <p className="mq-done-s">
          记住 {tally.good} · 没记住 {tally.bad}
          {kind === 'learn' && <> · 新学 {queue.filter((x) => !seenAtMount.current.has(x.id)).length}</>}
        </p>
        <div className="mq-modes">
          {kind === 'learn' && endActions.reviewLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => {
              setQueue(buildQueue('review'));
              setIdx(0);
              setTally({ good: 0, bad: 0 });
            }}>
              <b>接着复习</b>
              <span>到期 {endActions.reviewLeft} 题</span>
            </button>
          )}
          {endActions.learnLeft > 0 && (
            <button type="button" className="mq-mode" onClick={() => {
              setQueue(buildQueue('learn'));
              setIdx(0);
              setTally({ good: 0, bad: 0 });
            }}>
              <b>继续背新题</b>
              <span>剩余配额 {endActions.learnLeft} 题</span>
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
        key={q.id}
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <QuestionCard q={q} onGrade={onGrade(q)} />
      </motion.div>
    </main>
  );
}

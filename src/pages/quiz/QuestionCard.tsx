import { useEffect, useRef, useState } from 'react';
import { quizKindLabel, JUDGE_OPTIONS, optionsOf } from '../../content/quizbank/consts';
import type { QuizQuestion } from '../../content/quizbank/types';
import { decodeEntities } from '../../lib/text';
import { IconCheck, IconReset, IconStar, IconX } from '../../components/icons';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const normalize = (s: string) => s.replace(/\s+/g, '').replace(/　/g, '');

/** 判分展示文本（字母 / 正确错误 / 填空原文） */
export const answerTextOf = (q: QuizQuestion): string => {
  if (q.kind === 'fill') return String(q.answer);
  if (q.kind === 'judge') return JUDGE_OPTIONS[(q.answer as number[])[0]];
  return (q.answer as number[]).map((i) => LETTERS[i]).join('、');
};

interface Props {
  q: QuizQuestion;
/** 判分上报：good = 答对；elapsedMs = 本题反应时长（间隔增幅修正）；「看答案」按没答上处理（回炉） */
  onGrade: (good: boolean, elapsedMs: number) => void;
/** 下一题动作：传入则判分后出现「下一题」按钮（会话模式）；不传显示「重做」（书页模式） */
  onNext?: () => void;
  /** 收藏星标 */
  fav: { on: boolean; onToggle: () => void };
  /** 角标动作（错题本：移出错题本） */
  cornerAction?: { label: string; onClick: () => void };
  /** 连对进度：n = 当前连续答对数（答错归零）；target = 学会所需次数（学习模式才给） */
  streak?: { n: number; target?: number };
}

/**
 * 题库题卡：作答即判分（无人工自评），七门课共用。
 * 单选/判断点选项立即判分；多选勾选后提交；填空输入比对；
 * 「直接看答案」视为没答上。判分结果经 onGrade 交给外层（调度账 + 错题本）。
 */
export default function QuestionCard({ q, onGrade, onNext, fav, cornerAction, streak }: Props) {
  const options = optionsOf(q);
  const answerIdx = q.kind === 'fill' ? [] : (q.answer as number[]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<'right' | 'wrong' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillInput, setFillInput] = useState('');
  const [fillWrong, setFillWrong] = useState(false);
  const gradedRef = useRef(false);
  // 反应时长修正的起点：卡片挂载（重做后重新计）
  const shownAt = useRef(typeof performance !== 'undefined' ? performance.now() : Date.now());

  const locked = submitted !== null || revealed;

  const judge = (good: boolean) => {
    if (gradedRef.current) return;
    gradedRef.current = true;
    setSubmitted(good ? 'right' : 'wrong');
    onGrade(good, performance.now() - shownAt.current);
  };

  const pick = (letter: string) => {
    if (locked) return;
    if (q.kind === 'multiple') {
      setPicked((p) => (p.includes(letter) ? p.filter((l) => l !== letter) : [...p, letter]));
      return;
    }
    const idx = LETTERS.indexOf(letter);
    const ok = answerIdx.includes(idx);
    setPicked([letter]);
    if (!ok) setWrongPicks([letter]);
    judge(ok);
  };

  const submitMulti = () => {
    if (locked || picked.length === 0) return;
    const ok = picked.length === answerIdx.length && answerIdx.every((i) => picked.includes(LETTERS[i]));
    if (!ok) setWrongPicks(picked.filter((l) => !answerIdx.includes(LETTERS.indexOf(l))));
    judge(ok);
  };

  const checkFill = () => {
    if (locked || !fillInput.trim()) return;
    const ok = normalize(fillInput) === normalize(String(q.answer));
    if (!ok) setFillWrong(true);
    judge(ok);
  };

  const reveal = () => {
    if (locked) return;
    setRevealed(true);
    judge(false);
  };

  const reset = () => {
    setPicked([]);
    setWrongPicks([]);
    setSubmitted(null);
    setRevealed(false);
    setFillInput('');
    setFillWrong(false);
    gradedRef.current = false;
    shownAt.current = performance.now();
  };

  const optionState = (i: number): string => {
    const letter = LETTERS[i];
    const correct = answerIdx.includes(i);
    if (submitted === 'right' && correct) return 'correct';
    if (wrongPicks.includes(letter)) return 'wrong';
    if (submitted === 'wrong' && correct) return 'correct';
    if (locked && correct) return 'correct';
    if (locked && !correct && !picked.includes(letter)) return 'dim';
    if (revealed && correct) return 'correct';
    if (revealed && !correct) return 'dim';
    return '';
  };

  // 判分后 Enter = 下一题（会话模式）
  useEffect(() => {
    if (!locked || !onNext) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, onNext]);

  const cls = submitted === 'right' ? ' answered-right' : submitted === 'wrong' ? ' answered-wrong' : '';
  const hasCorner = fav || cornerAction;

  return (
    <div className={`quiz mq-qcard${cls}${hasCorner ? ' pq-has-corner' : ''}`}>
      {(fav || cornerAction) && (
        <div className="pq-corner">
          {cornerAction && (
            <button type="button" className="pq-corner-btn" onClick={cornerAction.onClick}>
              {cornerAction.label}
            </button>
          )}
          <button
            type="button"
            className={`pq-fav${fav.on ? ' on' : ''}`}
            aria-pressed={fav.on}
            aria-label={fav.on ? '取消收藏' : '收藏本题'}
            title={fav.on ? '取消收藏' : '收藏本题'}
            onClick={fav.onToggle}
          >
            <IconStar size={15} />
          </button>
        </div>
      )}

      <p className="quiz-q">
        <span className="pq-kind" data-kind={q.kind}>{quizKindLabel(q.kind)}</span>
        <span>{decodeEntities(q.question)}</span>
      </p>
      {q.chapter && <span className="mq-chip">{q.chapter}</span>}
      {streak && (
        <span
          className="mq-chip mq-chip-streak"
          title={`连续答对 ${streak.n} 次${streak.target ? `（连对 ${streak.target} 次学会）` : ''}`}
        >
          连对 {streak.n}{streak.target ? ` / ${streak.target}` : ''}
        </span>
      )}

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
                  {st === 'selected' && !locked && <IconCheck size={15} className="opt-mark" style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />}
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
          <button className="btn" onClick={reveal}>直接看答案</button>
        </div>
      )}

      {q.kind === 'fill' && !locked && (
        <div className="quiz-fill">
          <input
            value={fillInput}
            placeholder="输入你的答案…"
            onChange={(e) => setFillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkFill()}
            aria-label="填空答案"
          />
          <button className="btn primary" onClick={checkFill}>检查</button>
          <button className="btn" onClick={reveal}>显示答案</button>
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

      {locked && onNext && (
        <div className="quiz-actions">
          <button className="btn primary" onClick={onNext}>下一题</button>
        </div>
      )}
      {locked && !onNext && (
        <div className="quiz-actions">
          <button className="btn" onClick={reset}>
            <IconReset size={14} /> 重做
          </button>
        </div>
      )}
    </div>
  );
}

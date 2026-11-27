import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ALGO_BASE } from '../../courses/registry';
import type { PracticeQuestion, PracticeTag } from '../../content/practice';
import { decodeEntities } from '../../lib/text';
import { IconArrowRight, IconCheck, IconChevronDown, IconReset, IconStar, IconX } from '../icons';

interface EssayOptions {
  /** 章节页标题锚点；使用 h3 以保留目录高亮和滚动定位。 */
  anchorId?: string;
  revealLabel?: string;
  answerLabel?: string;
  explanationLabel?: string;
  sourceNote?: string;
  attention?: string | null;
  statusLabels?: { right: string; wrong: string; revealed: string };
  /** 主观题自评可复用进度结果，不表示机器判分。 */
  review?: { onChange: (result: 'right' | 'wrong') => void };
  /** 允许章节练习清理持久化记录。 */
  onReset?: () => void;
}

interface Props {
  quiz: PracticeQuestion;
  /** 展示序号文案，如「单选 12」 */
  label: string;
  /** 已保存的作答结果（用于列表级状态点） */
  result?: 'right' | 'wrong' | 'revealed';
  /** 作答结果上报：right / wrong / revealed（直接看答案） */
  onResult: (qid: string, result: 'right' | 'wrong' | 'revealed') => void;
  /** 知识点标签 → 跳转目标；缺省为算法课（第 N 讲 ?s=） */
  tagNav?: (t: PracticeTag) => { href: string; tip: string };
  /** 标签主题色的 data-deck 取值；缺省为算法课的 deckN（计网课传 () => 'net'） */
  tagDeckKey?: (deck: number) => string;
  /** 仅主观题的来源、锚点及自评扩展；其他课程默认行为不变。 */
  essayOptions?: EssayOptions;
  /** 收藏本交互：传入才渲染右上角收藏按钮（qid 用各课进度键的题目 id） */
  favorite?: { on: boolean; onToggle: () => void };
  /** 书页的角标动作（错题本页：移出错题本），与收藏按钮同排 */
  cornerAction?: { label: string; onClick: () => void };
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const normalize = (s: string) => s.replace(/\s+/g, '').replace(/　/g, '');

/** 展示层排版：把纯文本写法的 ^上标 / _下标 转成 sup/sub（不改题库源文本） */
function prettyMath(html: string): string {
  return html
    .replace(/\^\(([^()<>]+)\)/g, '<sup>$1</sup>')
    .replace(/\^(-?[0-9]+(?:\.[0-9]+)?|[a-z])(?![a-zA-Z0-9])/g, '<sup>$1</sup>')
    .replace(/([a-zA-Z0-9）)])_([a-zA-Z0-9]+)(?![a-zA-Z0-9])/g, '$1<sub>$2</sub>');
}

/** 在线练习题卡：与 QuizCard 同一套交互语言，外加可跳转的知识点标签与简答题支持 */
export default function PracticeCard({
  quiz,
  label,
  result,
  onResult,
  tagNav,
  tagDeckKey,
  essayOptions,
  favorite,
  cornerAction,
}: Props) {
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);

  const correctLetters = useMemo<string[]>(() => {
    if (quiz.kind === 'single' || quiz.kind === 'multi') return quiz.answer.split('、');
    if (quiz.kind === 'judge') {
      const idx = (quiz.options ?? []).findIndex((o) => decodeEntities(o).trim() === quiz.answer);
      return idx >= 0 ? [LETTERS[idx]] : [];
    }
    return [];
  }, [quiz]);

  const fillVariants = useMemo(
    () => (quiz.kind === 'fill' ? quiz.answer.split('｜').map((v) => normalize(decodeEntities(v))) : []),
    [quiz],
  );

  const questionHtml = useMemo(() => prettyMath(quiz.question), [quiz]);
  const optionsHtml = useMemo(() => (quiz.options ?? []).map(prettyMath), [quiz]);
  const answerHtml = useMemo(() => prettyMath(quiz.answer), [quiz]);
  const explanationHtml = useMemo(() => prettyMath(quiz.explanation), [quiz]);

  // 挂载时从已保存结果恢复判分态：状态点与卡片内容同源，不出现「红点 + 未作答」的矛盾
  // （上次具体选了什么没有存，答错的卡片恢复为展示正确答案 + 红色状态点）
  const [picked, setPicked] = useState<string[]>(() => (result === 'right' || result === 'wrong' ? correctLetters : []));
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<'right' | 'wrong' | null>(() =>
    result === 'right' || result === 'wrong' ? result : null,
  );
  const [revealed, setRevealed] = useState(() => result === 'revealed');
  const [fillInput, setFillInput] = useState(() => (result ? fillVariants[0] ?? '' : ''));
  const [fillWrong, setFillWrong] = useState(() => result === 'wrong');

  // 章末主观题的「清空本章进度」来自外层：仅在记录被删除时复位卡片，
  // 其它课程的默认交互完全不受影响；状态变更无需卸载卡片，保留展开动画。
  useEffect(() => {
    if (essayOptions?.review && result === undefined) {
      setSubmitted(null);
      setRevealed(false);
    }
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  // 判分脉冲动画结束后摘掉标记
  useEffect(() => {
    if (!pulse) return;
    const t = window.setTimeout(() => setPulse(false), 380);
    return () => window.clearTimeout(t);
  }, [pulse]);

  const isEssay = quiz.kind === 'essay';
  const isFill = quiz.kind === 'fill';
  const showExplanation = submitted !== null || revealed;
  const effectiveStatus = isEssay && essayOptions?.review ? result : submitted;
  const cls = effectiveStatus === 'right' ? ' answered-right' : effectiveStatus === 'wrong' ? ' answered-wrong' : '';
  const QuestionTag = essayOptions?.anchorId ? 'h3' : 'p';
  const statusText = result === 'right' ? essayOptions?.statusLabels?.right ?? '已答对'
    : result === 'wrong' ? essayOptions?.statusLabels?.wrong ?? '已答错'
      : essayOptions?.statusLabels?.revealed ?? '已看答案';
  const locked = submitted !== null || revealed;

  const pick = (letter: string) => {
    if (locked) return;
    if (quiz.kind === 'multi') {
      setPicked((p) => (p.includes(letter) ? p.filter((l) => l !== letter) : [...p, letter]));
      return;
    }
    setPicked([letter]);
    setWrongPicks([]);
  };

  const submitAnswer = () => {
    if (locked || picked.length === 0) return;
    if (quiz.kind === 'multi') {
      const ok = picked.length === correctLetters.length && correctLetters.every((l) => picked.includes(l));
      setSubmitted(ok ? 'right' : 'wrong');
      if (!ok) setWrongPicks(picked.filter((l) => !correctLetters.includes(l)));
      setPulse(true);
      onResult(quiz.id, ok ? 'right' : 'wrong');
      return;
    }
    const ok = picked[0] === correctLetters[0];
    setSubmitted(ok ? 'right' : 'wrong');
    if (!ok) setWrongPicks(picked.filter((l) => !correctLetters.includes(l)));
    setPulse(true);
    onResult(quiz.id, ok ? 'right' : 'wrong');
  };

  const checkFill = () => {
    if (!fillInput.trim()) return;
    const ok = fillVariants.includes(normalize(fillInput));
    setSubmitted(ok ? 'right' : 'wrong');
    setFillWrong(!ok);
    setPulse(true);
    onResult(quiz.id, ok ? 'right' : 'wrong');
  };

  const reveal = () => {
    if (locked) return;
    setRevealed(true);
    onResult(quiz.id, 'revealed');
  };

  const reset = () => {
    setPicked([]);
    setWrongPicks([]);
    setSubmitted(null);
    setRevealed(false);
    setFillInput('');
    setFillWrong(false);
    essayOptions?.onReset?.();
  };

  const optionState = (letter: string): string => {
    if (submitted === 'right' && correctLetters.includes(letter)) return 'correct';
    if (wrongPicks.includes(letter)) return 'wrong';
    if (submitted === 'wrong' && correctLetters.includes(letter)) return 'correct';
    if (picked.includes(letter)) return 'selected';
    if (submitted !== null && !correctLetters.includes(letter) && !picked.includes(letter)) return 'dim';
    if (revealed && correctLetters.includes(letter)) return 'correct';
    if (revealed && !correctLetters.includes(letter)) return 'dim';
    return '';
  };

  return (
    <div
      className={`quiz practice-q${cls}${pulse ? ' pq-pulse' : ''}${favorite || cornerAction ? ' pq-has-corner' : ''}`}
      data-qid={quiz.id}
      data-result={result}
    >
      {/* 右上角：已作答状态点（列表扫读用）+ 收藏 / 书页角标动作 */}
      {(result || favorite || cornerAction) && (
        <div className="pq-corner">
          {result && (
            <span className="pq-status" data-result={result} aria-label={statusText} title={statusText}>
              {result === 'right' && <IconCheck size={11} />}
              {result === 'wrong' && <IconX size={11} />}
            </span>
          )}
          {cornerAction && (
            <button type="button" className="pq-corner-btn" onClick={cornerAction.onClick}>
              {cornerAction.label}
            </button>
          )}
          {favorite && (
            <button
              type="button"
              className={`pq-fav${favorite.on ? ' on' : ''}`}
              aria-pressed={favorite.on}
              aria-label={favorite.on ? '取消收藏' : '收藏本题'}
              title={favorite.on ? '取消收藏' : '收藏本题'}
              onClick={favorite.onToggle}
            >
              <IconStar size={15} />
            </button>
          )}
        </div>
      )}

      <QuestionTag className={`quiz-q${essayOptions?.anchorId ? ' pq-question-heading' : ''}`} id={essayOptions?.anchorId}>
        <span className="pq-kind" data-kind={quiz.kind}>
          {label}
        </span>
        <span dangerouslySetInnerHTML={{ __html: questionHtml }} />
      </QuestionTag>
      {isEssay && essayOptions?.attention && (
        <p className="quiz-note"><strong>题目核对：</strong>{essayOptions.attention}</p>
      )}

      {!isEssay && !isFill && (
        <ul className="quiz-opt">
          {optionsHtml.map((o, i) => {
            const letter = LETTERS[i];
            const st = optionState(letter);
            return (
              <li key={i}>
                <button
                  type="button"
                  className={`opt-btn${st ? ' ' + st : ''}`}
                  disabled={locked}
                  onClick={() => pick(letter)}
                >
                  <span className="opt-key">{letter}</span>
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                  {st === 'correct' && (
                    <motion.span
                      className="opt-mark"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 560, damping: 22 }}
                      style={{ marginLeft: 'auto', color: 'var(--ok)', display: 'inline-flex' }}
                    >
                      <IconCheck size={16} />
                    </motion.span>
                  )}
                  {st === 'selected' && (
                    <motion.span
                      className="opt-mark"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 24 }}
                      style={{ marginLeft: 'auto', color: 'var(--ink-3)', display: 'inline-flex' }}
                    >
                      <IconCheck size={15} />
                    </motion.span>
                  )}
                  {st === 'wrong' && (
                    <motion.span
                      className="opt-mark"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 560, damping: 22 }}
                      style={{ marginLeft: 'auto', color: 'var(--hot)', display: 'inline-flex' }}
                    >
                      <IconX size={16} />
                    </motion.span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {(quiz.kind === 'single' || quiz.kind === 'multi' || quiz.kind === 'judge') && !locked && (
        <div className="quiz-actions">
          <button className="btn primary" disabled={picked.length === 0} onClick={submitAnswer}>
            {quiz.kind === 'multi' ? `提交答案（${picked.length} 项）` : '提交答案'}
          </button>
          <button className="btn" onClick={reveal}>
            直接看答案
          </button>
        </div>
      )}

      {isFill && !locked && (
        <>
          <div className="quiz-fill">
            <input
              value={fillInput}
              placeholder="输入你的答案…"
              onChange={(e) => setFillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkFill()}
              aria-label="填空答案"
            />
            <button className="btn primary" onClick={checkFill}>
              检查
            </button>
            <button className="btn" onClick={reveal}>
              显示答案
            </button>
          </div>
          {fillWrong && <p className="quiz-note">不完全一致——术语与记号要写全，可对照下方答案核对。</p>}
        </>
      )}

      {isEssay && !locked && (
        <div className="quiz-actions">
          <button className="btn pq-disclose" onClick={reveal}>
            {essayOptions?.revealLabel ?? '查看参考答案与评分要点'}
            <IconChevronDown size={14} />
          </button>
        </div>
      )}

      {(locked || (isEssay && revealed)) && (
        <div className="quiz-actions">
          <button className="btn" onClick={reset}>
            <IconReset size={14} />
            重做
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {showExplanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {isEssay ? (
              <>
                <div className="quiz-a pq-answer">
                  <b>{essayOptions?.answerLabel ?? '参考答案'}</b>
                  {essayOptions?.sourceNote && <p className="quiz-note">{essayOptions.sourceNote}</p>}
                  <div className="pq-answer-body" dangerouslySetInnerHTML={{ __html: answerHtml }} />
                </div>
                {explanationHtml.trim() && (
                  <div className="pq-rubric">
                    <b>{essayOptions?.explanationLabel ?? '解析与评分要点'}</b>
                    <div className="pq-answer-body" dangerouslySetInnerHTML={{ __html: explanationHtml }} />
                  </div>
                )}
              </>
            ) : (
              <p className="quiz-a">
                <b>答案：{decodeEntities(quiz.answer)}</b>
                <span dangerouslySetInnerHTML={{ __html: explanationHtml }} />
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isEssay && essayOptions?.review && showExplanation && (
        <div className="pq-review" role="group" aria-label="掌握情况自评">
          <span>自评掌握情况</span>
          <button type="button" className="btn" aria-pressed={result === 'right'} onClick={() => essayOptions.review?.onChange('right')}>
            <IconCheck size={14} /> 已掌握
          </button>
          <button type="button" className="btn" aria-pressed={result === 'wrong'} onClick={() => essayOptions.review?.onChange('wrong')}>
            <IconX size={14} /> 需复习
          </button>
        </div>
      )}

      {/* 知识点标签：点击跳到对应讲次/章节的对应位置 */}
      <div className="pq-tags" aria-label="知识点标签">
        {quiz.tags.map((t) => {
          const nav = tagNav?.(t) ?? {
            href: `${ALGO_BASE}/deck/deck${t.deck}?s=${t.sec}`,
            tip: `跳转到 第 ${t.deck} 讲 · ${decodeEntities(t.text)}`,
          };
          return (
            <button
              key={`${t.deck}-${t.sec}-${t.text}`}
              type="button"
              className="ptag"
              data-deck={tagDeckKey ? tagDeckKey(t.deck) : `deck${t.deck}`}
              data-tip={nav.tip}
              title={nav.tip}
              onClick={() => navigate(nav.href)}
            >
              <span className="ptag-no">{t.deck}</span>
              {decodeEntities(t.text)}
              <IconArrowRight size={11} className="ptag-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

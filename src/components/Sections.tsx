import { motion, useReducedMotion } from 'motion/react';
import type { Section } from '../content/types';
import { decodeEntities } from '../lib/text';
import HtmlContent from './HtmlContent';
import DemoPlayer from './DemoPlayer';
import QuizCard from './QuizCard';

interface Props {
  sections: Section[];
  /** 各题作答结果：key = `${sectionId}:${blockIndex}` */
  scores?: Record<string, boolean>;
  /** 每题作答回调 */
  onQuizResult?: (key: string, right: boolean) => void;
  /** 仅在需要显示「1.」格式的页面保留序号末尾句点。 */
  keepNumberDot?: boolean;
}

/** 把 h2 标题里已有的编号（"1." / "2.1" / "一、"）拆出来单独渲染成主题色刻度 */
const H2_NO_RE = /^((?:[0-9０-９一二三四五六七八九十]+)(?:[.\-]\d+)*[.、．]?)\s*(.+)$/u;

/** 把 content 模块的 sections 渲染成正文（html / demo / quiz 三类 block） */
export default function Sections({ sections, scores, onQuizResult, keepNumberDot = false }: Props) {
  const reduced = useReducedMotion();
  return (
    <>
      {sections.map((sec) => {
        const quizIdx = sec.blocks.flatMap((b, i) => (b.type === 'quiz' ? [i] : []));
        const answered = quizIdx.filter((i) => scores?.[`${sec.id}:${i}`] !== undefined).length;
        const right = quizIdx.filter((i) => scores?.[`${sec.id}:${i}`] === true).length;
        const heading = decodeEntities(sec.heading);
        const m = H2_NO_RE.exec(heading);
        return (
          // 滚动目标与目录 id 一致：落在 h2 上（scroll-spy 也以它为准）
          <section key={sec.id}>
            <h2 id={sec.id}>
              {m ? (
                <>
                  <span className="h2-no" aria-hidden="true">
                    {keepNumberDot ? m[1] : m[1].replace(/[.、．]$/, '')}
                  </span>
                  <span className="h2-title">{m[2]}</span>
                </>
              ) : (
                <span className="h2-title">{heading}</span>
              )}
            </h2>
            {quizIdx.length > 0 && (
              <p className="quiz-section-score">
                已作答 {answered} / {quizIdx.length} · 答对{' '}
                <motion.span
                  className="quiz-score-num"
                  key={right}
                  initial={reduced ? false : { scale: 1.5, color: 'var(--ok)' }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 20 }}
                >
                  {right}
                </motion.span>{' '}
                题
              </p>
            )}
            {sec.blocks.map((b, i) => {
              if (b.type === 'html') return <HtmlContent key={i} html={b.html} />;
              if (b.type === 'demo') return <DemoPlayer key={i} name={b.name} title={b.title} />;
              return (
                <QuizCard
                  key={i}
                  quiz={b.quiz}
                  onResult={(r) => onQuizResult?.(`${sec.id}:${i}`, r)}
                />
              );
            })}
          </section>
        );
      })}
    </>
  );
}

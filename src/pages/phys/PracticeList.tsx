import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { PHYS_BASE } from '../../courses/registry';
import { physPapers } from '../../content/phys';
import { IconArrowRight } from '../../components/icons';
import PracticeReport from '../../components/practice/report/PracticeReport';
import ClearProgress from '../../components/practice/ClearProgress';
import { clearProgressStore, useProgressStore } from '../../lib/sync';

/** 作答结果持久化 key（qid = `${paperId}:${questionId}`，与算法课的 practice-progress-v1 分开） */
export const PHYS_PRACTICE_STORE_KEY = 'phys-practice-progress-v1';
export type PhysResult = 'right' | 'wrong' | 'revealed';

export function physPaperStats(paperId: string, results: Record<string, PhysResult>) {
  const paper = physPapers.find((p) => p.id === paperId);
  if (!paper) return { done: 0, right: 0, total: 0 };
  const done = paper.questions.filter((q) => results[`${paperId}:${q.id}`]).length;
  const right = paper.questions.filter((q) => results[`${paperId}:${q.id}`] === 'right').length;
  return { done, right, total: paper.questions.length };
}

/** 「大学物理」在线练习 · 试卷列表：多份试卷先选卷，再进入答题页 */
export default function PhysPracticeList() {
  const reduced = useReducedMotion();
  const [results] = useProgressStore<PhysResult>(PHYS_PRACTICE_STORE_KEY);

  // 清空按钮的可用性：任一卷有作答即可清
  const totalDone = useMemo(
    () => physPapers.reduce((n, p) => n + physPaperStats(p.id, results).done, 0),
    [results],
  );

  return (
    <div className="page phys-practice-page">
      <h1>在线练习</h1>

      <div className="pq-clear-row">
        <ClearProgress
          done={totalDone}
          onClear={() => clearProgressStore(PHYS_PRACTICE_STORE_KEY)}
          tip="清空全部试卷的作答进度？"
        />
      </div>

      <div className="net-paper-grid">
        {physPapers.map((p, i) => {
          const { done, right, total: n } = physPaperStats(p.id, results);
          return (
            <motion.div
              key={p.id}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(i * 0.04, 0.2), ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link to={`${PHYS_BASE}/practice/${p.id}`} className="net-paper-card material" aria-label={`进入 ${p.title}`}>
                <span className="net-paper-title">{p.title}</span>
                <span className="net-paper-meta">{p.source}</span>
                <span className="net-paper-source">
                  {p.answerSource} · {n} 题
                </span>
                <span className="net-paper-progress">
                  已作答 {done} / {n} · 已展开解析 {right} 题
                  <i aria-hidden="true">
                    <span style={{ width: `${(done / n) * 100}%` }} />
                  </i>
                </span>
                <IconArrowRight size={15} className="net-paper-go" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* 全部习题报告：四份试卷合并口径，随作答实时更新（全未作答时不渲染）；本课进度键带卷前缀，这里同步改写 */}
      <PracticeReport
        title="全部习题报告"
        questions={physPapers.flatMap((p) => p.questions.map((q) => ({ ...q, kind: 'essay' as const, id: `${p.id}:${q.id}` })))}
        results={results}
        deckMeta={(deck) => ({ name: `第 ${deck} 章`, color: `var(--phys${deck}, var(--deck-accent))` })}
        tagNav={(t) => {
          if (t.deck === 0) return { href: PHYS_BASE, tip: `本库课件未收录该专题 · ${t.text}` };
          return { href: `${PHYS_BASE}/deck/deck${t.deck}?s=${t.sec}`, tip: `跳转到 第 ${t.deck} 章 · ${t.text}` };
        }}
      />

    </div>
  );
}

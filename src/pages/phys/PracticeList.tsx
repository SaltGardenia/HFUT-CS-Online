import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { PHYS_BASE } from '../../courses/registry';
import { physPapers, physDecks } from '../../content/phys';
import { IconArrowRight } from '../../components/icons';
import ExamInsights from '../../components/practice/ExamInsights';
import PracticeReport from '../../components/practice/report/PracticeReport';
import ClearProgress from '../../components/practice/ClearProgress';
import { clearProgressStore, useProgressStore } from '../../lib/sync';
import { chapterNamesFrom } from '../../lib/exam-insights';

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

/** 卡片小字只留题型信息（大学物理固定为简答/计算两类） */
function physKindSummary(paper: { questions: { kind: string }[] }): string {
  const label: Record<string, string> = { essay: '简答', calc: '计算' };
  return ['essay', 'calc']
    .filter((k) => paper.questions.some((q) => q.kind === k))
    .map((k) => `${label[k]} ${paper.questions.filter((q) => q.kind === k).length}`)
    .join(' · ');
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

      <ExamInsights
        papers={physPapers}
        kindLabel={{ essay: '简答', calc: '计算' }}
        tagHref={(deck, sec) => (deck === 0 ? PHYS_BASE : `${PHYS_BASE}/deck/deck${deck}?s=${sec}`)}
        chapterNames={chapterNamesFrom(physDecks)}
        progress={results}
        resultKey={(paperId, qid) => `${paperId}:${qid}`}
      />

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
                <span className="net-paper-source">{physKindSummary(p)}</span>
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

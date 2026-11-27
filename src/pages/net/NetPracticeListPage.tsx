import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { NET_BASE } from '../../courses/registry';
import { netPapers, netChapters } from '../../content/net';
import { IconArrowRight } from '../../components/icons';
import ExamInsights from '../../components/practice/ExamInsights';
import PracticeReport from '../../components/practice/report/PracticeReport';
import ClearProgress from '../../components/practice/ClearProgress';
import { clearProgressStore, useProgressStore } from '../../lib/sync';
import { chapterNamesFrom } from '../../lib/exam-insights';
import { NET_PRACTICE_STORE_KEY, netPaperStats, type NetResult } from './netPracticeState';

/** 计网的题型标签与算法课一致 */
const NET_KIND_LABEL: Record<string, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};
const NET_KINDS: (keyof typeof NET_KIND_LABEL)[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 卡片小字只留题型信息 */
function netKindSummary(paper: { questions: { kind: string }[] }): string {
  return NET_KINDS.filter((k) => paper.questions.some((q) => q.kind === k))
    .map((k) => `${NET_KIND_LABEL[k]} ${paper.questions.filter((q) => q.kind === k).length}`)
    .join(' · ');
}

/** 「计算机网络」在线练习 · 试卷列表：多份试卷先选卷，再进入答题页 */
export default function NetPracticeListPage() {
  const reduced = useReducedMotion();
  const [results] = useProgressStore<NetResult>(NET_PRACTICE_STORE_KEY);

  // 清空按钮的可用性：任一卷有作答即可清
  const totalDone = useMemo(
    () => netPapers.reduce((n, p) => n + netPaperStats(p.id, results).done, 0),
    [results],
  );

  return (
    <div className="page net-practice-page">
      <h1>在线练习</h1>

      <div className="pq-clear-row">
        <ClearProgress
          done={totalDone}
          onClear={() => clearProgressStore(NET_PRACTICE_STORE_KEY)}
          tip="清空全部试卷的作答进度？"
        />
      </div>

      <ExamInsights
        papers={netPapers}
        kindLabel={NET_KIND_LABEL}
        tagHref={(deck, sec) => `${NET_BASE}/deck/ch${deck}?s=${sec}`}
        chapterNames={chapterNamesFrom(netChapters)}
        progress={results}
        resultKey={(paperId, qid) => `${paperId}:${qid}`}
      />

      <div className="net-paper-grid">
        {netPapers.map((p, i) => {
          const { done, right, total: n } = netPaperStats(p.id, results);
          return (
            <motion.div
              key={p.id}
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.24, delay: Math.min(i * 0.04, 0.2), ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link to={`${NET_BASE}/practice/${p.id}`} className="net-paper-card material" aria-label={`进入 ${p.title}`}>
                <span className="net-paper-title">{p.title}</span>
                <span className="net-paper-source">{netKindSummary(p)}</span>
                <span className="net-paper-progress">
                  已作答 {done} / {n} · 答对 {right} 题
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

      {/* 全部习题报告：三份试卷合并口径，随作答实时更新（全未作答时不渲染）；本课进度键带卷前缀，这里同步改写 */}
      <PracticeReport
        title="全部习题报告"
        questions={netPapers.flatMap((p) => p.questions.map((q) => ({ ...q, id: `${p.id}:${q.id}` })))}
        results={results}
        deckMeta={(deck) => ({ name: `第 ${deck} 章`, color: `var(--net${deck}, var(--deck-accent))` })}
        tagNav={(t) => ({
          href: `${NET_BASE}/deck/ch${t.deck}?s=${t.sec}`,
          tip: `跳转到 第 ${t.deck} 章 · ${t.text}`,
        })}
      />

    </div>
  );
}

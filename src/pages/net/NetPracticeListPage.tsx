import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { NET_BASE } from '../../courses/registry';
import { netPapers } from '../../content/net';
import { IconArrowRight } from '../../components/icons';
import ClearProgress from '../../components/practice/ClearProgress';
import { clearProgressStore, useProgressStore } from '../../lib/sync';
import { NET_PRACTICE_STORE_KEY, netPaperStats, type NetResult } from './netPracticeState';

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
                <span className="net-paper-meta">{p.meta}</span>
                <span className="net-paper-source">
                  {p.answerSource} · {n} 题
                </span>
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

    </div>
  );
}

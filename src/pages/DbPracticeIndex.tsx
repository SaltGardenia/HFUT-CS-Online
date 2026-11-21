import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DB_BASE } from '../courses/registry';
import { dbPapers, DB_KIND_LABEL } from '../content/db';
import { useToc } from '../lib/toc';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 作答进度（与答题页共用同一 localStorage 键），列表卡上展示每卷的完成度 */
const STORE_KEY = 'db-practice-progress-v1';

function loadProgress(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区） */
export default function DbPracticeIndex() {
  const toc = useToc();

  // 试卷卡上的题型统计与完成度
  const cards = useMemo(
    () =>
      dbPapers.map((p) => {
        const progress = loadProgress();
        const done = p.questions.filter((q) => progress[q.id]).length;
        const right = p.questions.filter((q) => progress[q.id] === 'right').length;
        const kinds = (['single', 'multi', 'judge', 'fill', 'essay'] as const)
          .filter((k) => p.questions.some((q) => q.kind === k))
          .map((k) => `${DB_KIND_LABEL[k]} ${p.questions.filter((q) => q.kind === k).length}`)
          .join(' · ');
        return { paper: p, done, right, kinds };
      }),
    [],
  );

  // 列表页无本页目录
  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <h1>在线练习</h1>
      <div className="lede">
        <p>
          按试卷整理的历年试题：先选择一份试卷，进入答题页后作答——左侧为题型热力图（一格一题、绿对红错），
          右侧为答题区；每道题附<strong>知识点标签</strong>，点击可跳转到课件中对应的位置。
        </p>
      </div>
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${DB_BASE}/practice/${p.id}`}>
            <span className="ext-card-icon">
              <IconFileText size={18} />
            </span>
            <span className="ext-card-body">
              <span className="ext-card-title">{p.title}</span>
              <span className="ext-card-desc">
                {p.source} · {p.questions.length} 题（{kinds}） · 参考答案：{p.answerSource}
              </span>
              <span className="ext-card-progress">
                <i aria-hidden="true">
                  <span style={{ width: `${(done / p.questions.length) * 100}%` }} />
                </i>
                <span className="ext-card-progress-num">
                  已作答 {done}/{p.questions.length} · 答对 {right} 题
                </span>
              </span>
            </span>
            <IconArrowRight size={15} className="ext-card-arrow" />
          </Link>
        ))}
      </nav>
    </div>
  );
}

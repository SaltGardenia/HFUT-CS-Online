import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ST_BASE } from '../courses/registry';
import { stPapers, stChapters, ST_KIND_LABEL } from '../content/st';
import { useToc } from '../lib/toc';
import { useStoredRecord } from '../lib/sync';
import { chapterNamesFrom } from '../lib/exam-insights';
import ExamInsights from '../components/practice/ExamInsights';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 作答进度（与答题页共用同一 key），列表卡上展示每卷的完成度 */
const STORE_KEY = 'st-practice-progress-v1';

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区） */
export default function StPracticeIndex() {
  const toc = useToc();
  const progress = useStoredRecord<string>(STORE_KEY);

  // 试卷卡上的题型统计与完成度
  const cards = useMemo(
    () =>
      stPapers.map((p) => {
        const done = p.questions.filter((q) => progress[q.id]).length;
        const right = p.questions.filter((q) => progress[q.id] === 'right').length;
        const kinds = (['single', 'multi', 'judge', 'fill', 'essay'] as const)
          .filter((k) => p.questions.some((q) => q.kind === k))
          .map((k) => `${ST_KIND_LABEL[k]} ${p.questions.filter((q) => q.kind === k).length}`)
          .join(' · ');
        return { paper: p, done, right, kinds };
      }),
    [progress],
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
      <ExamInsights
        papers={stPapers}
        kindLabel={ST_KIND_LABEL}
        tagHref={(deck, sec) => `${ST_BASE}/deck/deck${deck}?s=${sec}`}
        chapterNames={chapterNamesFrom(stChapters)}
        progress={progress}
      />
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${ST_BASE}/practice/${p.id}`}>
            <span className="ext-card-icon">
              <IconFileText size={18} />
            </span>
            <span className="ext-card-body">
              <span className="ext-card-title">{p.title}</span>
              <span className="ext-card-desc">{kinds}</span>
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

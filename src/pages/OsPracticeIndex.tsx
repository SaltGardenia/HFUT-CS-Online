import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { OS_BASE } from '../courses/registry';
import { osChapters, osPapers, OS_KIND_LABEL } from '../content/os';
import { useToc } from '../lib/toc';
import { useStoredRecord } from '../lib/sync';
import { chapterNamesFrom } from '../lib/exam-insights';
import ExamInsights from '../components/practice/ExamInsights';
import { IconArrowRight, IconFileText } from '../components/icons';
import { BookCards } from '../components/practice/books';
import PracticeReport from '../components/practice/report/PracticeReport';
import { shellDeckMeta } from '../components/practice/report/aggregates';

/** 作答进度（与答题页共用同一 key），列表卡上展示每卷的完成度 */
const STORE_KEY = 'os-practice-progress-v1';

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区） */
export default function OsPracticeIndex() {
  const toc = useToc();
  const progress = useStoredRecord<string>(STORE_KEY);

  // 试卷卡上的题型统计与完成度
  const cards = useMemo(
    () =>
      osPapers.map((p) => {
        const done = p.questions.filter((q) => progress[q.id]).length;
        const right = p.questions.filter((q) => progress[q.id] === 'right').length;
        const kinds = (['single', 'multi', 'judge', 'fill', 'essay'] as const)
          .filter((k) => p.questions.some((q) => q.kind === k))
          .map((k) => `${OS_KIND_LABEL[k]} ${p.questions.filter((q) => q.kind === k).length}`)
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
        papers={osPapers}
        kindLabel={OS_KIND_LABEL}
        tagHref={(deck, sec) => `${OS_BASE}/chapter/ch${deck}?s=${sec}`}
        chapterNames={chapterNamesFrom(osChapters)}
        progress={progress}
      />
      <BookCards base={OS_BASE} course="os" />
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${OS_BASE}/practice/${p.id}`}>
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

      {/* 全部习题报告：四份试卷合并口径，随作答实时更新（全未作答时不渲染） */}
      <PracticeReport
        title="全部习题报告"
        questions={osPapers.flatMap((p) => p.questions)}
        results={progress as Record<string, 'right' | 'wrong' | 'revealed'>}
        deckMeta={shellDeckMeta({ deckKey: 'os', chapters: osChapters })}
        tagNav={(t) => ({
          href: `${OS_BASE}/chapter/ch${t.deck}?s=${t.sec}`,
          tip: `跳转到 ${osChapters.find((c) => c.id === `ch${t.deck}`)?.no ?? ''} · ${t.text}`,
        })}
      />
    </div>
  );
}

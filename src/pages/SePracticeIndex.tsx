import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SE_BASE } from '../courses/registry';
import { seChapters, sePapers, SE_KIND_LABEL } from '../content/se';
import { useToc } from '../lib/toc';
import { useStoredRecord } from '../lib/sync';
import { chapterNamesFrom } from '../lib/exam-insights';
import ExamInsights from '../components/practice/ExamInsights';
import { IconArrowRight, IconFileText } from '../components/icons';
import { BookCards } from '../components/practice/books';
import PracticeReport from '../components/practice/report/PracticeReport';
import { shellDeckMeta } from '../components/practice/report/aggregates';

/** 作答进度（与答题页共用同一 key），列表卡上展示每卷的完成度 */
const STORE_KEY = 'se-practice-progress-v1';

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区） */
export default function SePracticeIndex() {
  const toc = useToc();
  const progress = useStoredRecord<string>(STORE_KEY);

  // 试卷卡上的题型统计与完成度
  const cards = useMemo(
    () =>
      sePapers.map((p) => {
        const done = p.questions.filter((q) => progress[q.id]).length;
        const right = p.questions.filter((q) => progress[q.id] === 'right').length;
        const kinds = (['single', 'multi', 'judge', 'fill', 'essay'] as const)
          .filter((k) => p.questions.some((q) => q.kind === k))
          .map((k) => `${SE_KIND_LABEL[k]} ${p.questions.filter((q) => q.kind === k).length}`)
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
        papers={sePapers}
        kindLabel={SE_KIND_LABEL}
        tagHref={(deck, sec) => `${SE_BASE}/deck/${deck === 14 ? 'cd' : `deck${deck}`}?s=${sec}`}
        chapterNames={chapterNamesFrom(seChapters)}
        progress={progress}
      />
      <BookCards base={SE_BASE} course="se" />
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${SE_BASE}/practice/${p.id}`}>
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

      {/* 全部习题报告：各份试卷合并口径，随作答实时更新（全未作答时不渲染） */}
      <PracticeReport
        title="全部习题报告"
        questions={sePapers.flatMap((p) => p.questions)}
        results={progress as Record<string, 'right' | 'wrong' | 'revealed'>}
        deckMeta={shellDeckMeta({ deckKey: 'se', chapters: seChapters })}
        tagNav={(t) => ({
          href: `${SE_BASE}/deck/${t.deck === 14 ? 'cd' : `deck${t.deck}`}?s=${t.sec}`,
          tip: `跳转到 ${seChapters.find((c) => c.id === (t.deck === 14 ? 'cd' : `deck${t.deck}`))?.no ?? ''} · ${t.text}`,
        })}
      />
    </div>
  );
}

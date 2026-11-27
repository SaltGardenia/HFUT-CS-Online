import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { CourseConfig, CourseQuizKind } from '../../content/course-types';
import { useToc } from '../../lib/toc';
import { useStoredRecord } from '../../lib/sync';
import { chapterNamesFrom } from '../../lib/exam-insights';
import ExamInsights from '../practice/ExamInsights';
import { IconArrowRight, IconFileText } from '../icons';

const KINDS: CourseQuizKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区） */
export default function CoursePracticeIndex({ config }: { config: CourseConfig }) {
  const toc = useToc();
  const progress = useStoredRecord<string>(config.storeKey);

  const cards = useMemo(
    () =>
      config.papers.map((p) => {
        const done = p.questions.filter((q) => progress[q.id]).length;
        const right = p.questions.filter((q) => progress[q.id] === 'right').length;
        const kinds = KINDS.filter((k) => p.questions.some((q) => q.kind === k))
          .map((k) => `${config.kindLabel[k]} ${p.questions.filter((q) => q.kind === k).length}`)
          .join(' · ');
        return { paper: p, done, right, kinds };
      }),
    [config, progress],
  );

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <h1>在线练习</h1>
      <ExamInsights
        papers={config.papers}
        kindLabel={config.kindLabel}
        tagHref={(deck, sec) => `${config.base}/chapter/${config.chapters[deck - 1]?.id ?? config.chapters[0].id}?s=${sec}`}
        chapterNames={chapterNamesFrom(config.chapters)}
        progress={progress}
      />
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${config.base}/practice/${p.id}`}>
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

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { CourseConfig, CourseQuizKind, PracticeTag } from '../../content/course-types';
import { useToc } from '../../lib/toc';
import { useStoredRecord } from '../../lib/sync';
import { IconArrowRight, IconFileText } from '../icons';
import PracticeReport from '../practice/report/PracticeReport';
import { shellDeckMeta } from '../practice/report/aggregates';

const KINDS: CourseQuizKind[] = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 试卷列表页：多份试卷先列于此，点击进入答题页（热力图 + 答题区）；末尾附全部习题报告 */
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

  // 知识点行跳转：与答题页的标签跳转同一套口径
  const tagNav = (t: PracticeTag) => {
    const target = config.chapters[t.deck - 1];
    return {
      href: `${config.base}/chapter/${target?.id ?? config.chapters[0].id}?s=${t.sec}`,
      tip: `跳转到 ${target?.no ?? `第 ${t.deck} 章`} · ${config.tagSections[t.deck]?.[t.sec] ?? t.text}`,
    };
  };

  return (
    <div className="page">
      <h1>在线练习</h1>
      <div className="lede">
        <p>
          按试卷整理的课程试题：先选择一份试卷，进入答题页后作答——左侧为题型热力图（一格一题、绿对红错），
          右侧为答题区；每道题附<strong>知识点标签</strong>，点击可跳转到课件中对应的章节位置。
        </p>
      </div>
      <nav className="ext-cards" aria-label="试卷列表">
        {cards.map(({ paper: p, done, right, kinds }) => (
          <Link key={p.id} className="ext-card" to={`${config.base}/practice/${p.id}`}>
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

      {/* 全部习题报告：本课程所有试卷合并口径，随作答实时更新（全未作答时不渲染） */}
      <PracticeReport
        title="全部习题报告"
        questions={config.papers.flatMap((p) => p.questions)}
        results={progress as Record<string, 'right' | 'wrong' | 'revealed'>}
        deckMeta={shellDeckMeta(config)}
        tagNav={tagNav}
      />
    </div>
  );
}

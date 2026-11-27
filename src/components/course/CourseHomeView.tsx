import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CourseConfig } from '../../content/course-types';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../HtmlContent';
import SectionCapsule from '../SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../icons';

/** 总目录页的课程概况：章节卡片 + 试卷列表（各课程共用同一套版式） */
export default function CourseHomeView({ config }: { config: CourseConfig }) {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const prefix = config.base.replace(/^\//, '');
  const SEC_INTRO = `sec-${prefix}-intro`;
  const SEC_CHAPTERS = `sec-${prefix}-chapters`;
  const SEC_PRACTICE = `sec-${prefix}-practice`;

  const homeToc = [
    { id: SEC_INTRO, text: '1. 课程与资料概况', level: 2 as const },
    { id: SEC_CHAPTERS, text: '2. 章节目录', level: 2 as const },
    ...(config.papers.length
      ? [{ id: SEC_PRACTICE, text: '3. 在线练习 · 试卷', level: 2 as const }]
      : []),
  ];

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${config.base}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(homeToc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollSpy(pageRef, []);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('s');
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page" ref={pageRef}>
      <h1>{config.name}</h1>
      <div className="lede">
        <HtmlContent html={config.lede} />
      </div>

      <section>
        <h2 id={SEC_INTRO}>
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          {config.introCards.map((c) => (
            <div key={c.title} className="card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 id={SEC_CHAPTERS}>
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {config.chapters.map((c) => (
            <Link key={c.id} className="card" to={`${config.base}/chapter/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{config.chapterBlurbs[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      {config.papers.length > 0 && (
        <section>
          <h2 id={SEC_PRACTICE}>
            <span className="h2-no" aria-hidden="true">3</span>
            <span className="h2-title">在线练习 · 试卷</span>
          </h2>
          <nav className="ext-cards" aria-label="试卷列表">
            {config.papers.map((p) => (
              <Link
                key={p.id}
                className="ext-card"
                to={
                  config.singlePaperDirect
                    ? `${config.base}/practice`
                    : `${config.base}/practice/${p.id}`
                }
              >
                <span className="ext-card-icon">
                  <IconFileText size={18} />
                </span>
                <span className="ext-card-body">
                  <span className="ext-card-title">{p.title}</span>
                  <span className="ext-card-desc">
                    {p.questions.length} 题 · 参考答案：{p.answerSource}
                  </span>
                </span>
                <IconArrowRight size={15} className="ext-card-arrow" />
              </Link>
            ))}
          </nav>
          <div className="card-grid deck-map">
            <Link className="card" to={`${config.base}/practice`}>
              <h3>在线练习总览</h3>
              <p>
                {config.singlePaperDirect
                  ? '进入答题页：左侧题型热力图，右侧答题区；每题附知识点标签，可跳转到课件对应章节位置。'
                  : '进入试卷列表页，按试卷作答：左侧题型热力图，右侧答题区；每题附知识点标签，可跳转到课件对应章节位置。'}
              </p>
            </Link>
          </div>
        </section>
      )}

      <SectionCapsule />
    </div>
  );
}

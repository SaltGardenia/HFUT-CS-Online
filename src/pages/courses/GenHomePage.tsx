import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { CourseSpec } from '../../content/courses/types';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../../components/HtmlContent';
import SectionCapsule from '../../components/SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../../components/icons';
import { BookCards } from '../../components/practice/books';

/** 通用课程首页：课程与资料概况 / 章节目录 / 在线练习 / 附件资料（无该类资料则整节省略） */
export default function GenHomePage({ spec }: { spec: CourseSpec }) {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);
  const { base, key, chapters, papers, home } = spec;

  const catalogLabel = spec.unit === '章' ? '章节目录' : spec.unit === '讲' ? '讲次目录' : '单元目录';

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${base}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    const entries = [
      { id: `sec-${key}-intro`, text: '1. 课程与资料概况', level: 2 as const },
      ...(chapters.length
        ? [{ id: `sec-${key}-chapters`, text: `2. ${catalogLabel}`, level: 2 as const }]
        : []),
      ...(papers.length
        ? [{ id: `sec-${key}-practice`, text: `${chapters.length ? 3 : 2}. 在线练习 · 试卷`, level: 2 as const }]
        : []),
      {
        id: `sec-${key}-att`,
        text: `${1 + (chapters.length ? 1 : 0) + (papers.length ? 1 : 0) + 1}. 附件资料`,
        level: 2 as const,
      },
    ];
    toc.report(entries, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useScrollSpy(pageRef, []);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('s');
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const practiceNo = chapters.length ? 3 : 2;
  const attNo = 1 + (chapters.length ? 1 : 0) + (papers.length ? 1 : 0) + 1;

  return (
    <div className="page" ref={pageRef}>
      <h1>{spec.name}</h1>
      <div className="lede">
        <HtmlContent html={home.lede} />
      </div>

      <section>
        <h2 id={`sec-${key}-intro`}>
          <span className="h2-no" aria-hidden="true">
            1
          </span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          {home.cards.map((c) => (
            <div key={c.title} className="card">
              <h3>{c.title}</h3>
              <HtmlContent html={c.html} />
            </div>
          ))}
        </div>
      </section>

      {chapters.length > 0 && (
        <section>
          <h2 id={`sec-${key}-chapters`}>
            <span className="h2-no" aria-hidden="true">
              2
            </span>
            <span className="h2-title">{catalogLabel}</span>
          </h2>
          <div className="card-grid deck-map">
            {chapters.map((c) => (
              <Link key={c.id} className="card" to={`${base}/deck/${c.id}`}>
                <h3>
                  {c.no} · {decodeEntities(c.title)}
                </h3>
                <p>{home.blurbs[c.id]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {papers.length > 0 && (
        <section>
          <h2 id={`sec-${key}-practice`}>
            <span className="h2-no" aria-hidden="true">
              {practiceNo}
            </span>
            <span className="h2-title">在线练习 · 试卷</span>
          </h2>
          <BookCards base={base} course={key} />
          <nav className="ext-cards" aria-label="试卷列表">
            {papers.map((p) => (
              <Link key={p.id} className="ext-card" to={`${base}/practice/${p.id}`}>
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
            <Link className="card" to={`${base}/practice`}>
              <h3>在线练习总览</h3>
              <p>
                进入试卷列表页逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。
              </p>
            </Link>
          </div>
        </section>
      )}

      <section>
        <h2 id={`sec-${key}-att`}>
          <span className="h2-no" aria-hidden="true">
            {attNo}
          </span>
          <span className="h2-title">附件资料</span>
        </h2>
        <div className="card-grid deck-map">
          <Link className="card" to={`${base}/attachments`}>
            <h3>课件 / 试题 / 附件目录</h3>
            <p>
              按类别浏览本课整理的全部文件（课件、试题与实验/作业材料），可逐项展开目录并一键下载原件。
            </p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

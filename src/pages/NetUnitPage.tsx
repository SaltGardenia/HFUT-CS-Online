import { Fragment, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NET_BASE } from '../courses/registry';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import NetHomework from './net/NetHomework';
import NetHighlights from './net/NetHighlights';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

/** 「计算机网络」章节页：/net/deck/chN */
export default function NetUnitPage() {
  const { deckId } = useParams();
  const chapter = netChapters.find((d) => d.id === deckId);
  if (!chapter) return <Navigate to={NET_BASE} replace />;
  return <NetUnitInner key={chapter.id} chapter={chapter} />;
}

function NetUnitInner({ chapter }: { chapter: (typeof netChapters)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${NET_BASE}/deck/${chapter.id}?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(chapter.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  useScrollSpy(pageRef, [chapter.id]);

  const level2 = chapter.toc.filter((e) => e.level === 2);
  const chapterNo = Number(chapter.id.slice(2));
  const questions = netHomework[chapterNo] ?? [];
  // 与侧栏目录使用相同的 section id；把 h3 知识点归入所在 h2。
  const questionsForSection = new Map<string, typeof questions>();
  let parent = '';
  for (const entry of chapter.toc) {
    if (entry.level === 2) parent = entry.id;
    for (const q of questions) {
      if (q.related !== entry.id) continue;
      const existing = questionsForSection.get(parent) ?? [];
      if (!existing.some((item) => item.no === q.no)) {
        questionsForSection.set(parent, [...existing, q]);
      }
    }
  }

  return (
    <div className="page" ref={pageRef} data-deck={chapter.id}>
      <h1>{decodeEntities(chapter.title)}</h1>
      <div className="lede">
        <HtmlContent html={chapter.lede} />
      </div>
      <NetHighlights chapterNo={chapterNo} />
      {level2.length > 1 && (
        <nav className="topic-map" aria-label="本章知识点导航">
          <span className="topic-map-label">本章脉络</span>
          {level2.map((e) => (
            <button key={e.id} type="button" className="topic-chip" onClick={() => jump(e.id)}>
              {decodeEntities(e.text)}
            </button>
          ))}
        </nav>
      )}
      {chapter.sections.map((section) => (
        <Fragment key={section.id}>
          <Sections sections={[section]} keepNumberDot />
          {(questionsForSection.get(section.id) ?? []).length > 0 && (
            <nav className="net-hw-context" aria-label="本节相关课程作业">
              <span>对应课程作业</span>
              {(questionsForSection.get(section.id) ?? []).map((question) => (
                <Link key={question.no} to={`${NET_BASE}/deck/${chapter.id}?s=sec-ch${chapterNo}-hw-${question.no}`}>
                  题 {question.no}
                </Link>
              ))}
            </nav>
          )}
        </Fragment>
      ))}
      <NetHomework chapterNo={chapterNo} questions={questions} />
      <SectionCapsule />
    </div>
  );
}

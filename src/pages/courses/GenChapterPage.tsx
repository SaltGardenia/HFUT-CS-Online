import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { GenChapter } from '../../content/courses/types';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../../components/HtmlContent';
import Sections from '../../components/Sections';
import SectionCapsule from '../../components/SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';

interface Props {
  base: string;
  chapters: GenChapter[];
  unit: string;
}

/** 通用章节页：/&lt;base&gt;/deck/deckN（与各课程章节页同一套排版） */
export default function GenChapterPage({ base, chapters, unit }: Props) {
  const { deckId } = useParams();
  const chapter = chapters.find((c) => c.id === deckId);
  if (!chapter) return <Navigate to={base} replace />;
  return <ChapterInner key={chapter.id} chapter={chapter} base={base} unit={unit} />;
}

function ChapterInner({ chapter, base, unit }: { chapter: GenChapter; base: string; unit: string }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${base}/deck/${chapter.id}?s=${id}`, { replace: true });
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

  return (
    <div className="page" ref={pageRef} data-chapter={chapter.id}>
      <h1>{decodeEntities(chapter.title)}</h1>
      <div className="lede">
        <HtmlContent html={chapter.lede} />
      </div>
      {level2.length > 1 && (
        <nav className="topic-map" aria-label={`本${unit}知识点导航`}>
          <span className="topic-map-label">本{unit}脉络</span>
          {level2.map((e) => (
            <button key={e.id} type="button" className="topic-chip" onClick={() => jump(e.id)}>
              {decodeEntities(e.text)}
            </button>
          ))}
        </nav>
      )}
      <Sections sections={chapter.sections} />
      <SectionCapsule />
    </div>
  );
}

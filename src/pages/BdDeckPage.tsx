import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BD_BASE } from '../courses/registry';
import { bdDecks } from '../content/bd';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

/** 讲次页：/bd/deck/bdN（单讲课程，index 兜底到此） */
export default function BdDeckPage() {
  const { deckId } = useParams();
  const deck = bdDecks.find((d) => d.id === deckId);
  if (!deck) return <Navigate to={BD_BASE} replace />;
  return <NluDeckInner key={deck.id} deck={deck} />;
}

function NluDeckInner({ deck }: { deck: (typeof bdDecks)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${BD_BASE}/deck/${deck.id}?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(deck.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  useScrollSpy(pageRef, [deck.id]);

  const level2 = deck.toc.filter((e) => e.level === 2);

  return (
    <div className="page" ref={pageRef} data-deck={deck.id}>
      <h1>{decodeEntities(deck.title)}</h1>
      <div className="lede">
        <HtmlContent html={deck.lede} />
      </div>
      {level2.length > 1 && (
        <nav className="topic-map" aria-label="本讲知识点导航">
          <span className="topic-map-label">本讲脉络</span>
          {level2.map((e) => (
            <button key={e.id} type="button" className="topic-chip" onClick={() => jump(e.id)}>
              {decodeEntities(e.text)}
            </button>
          ))}
        </nav>
      )}
      <Sections sections={deck.sections} />
      <SectionCapsule />
    </div>
  );
}

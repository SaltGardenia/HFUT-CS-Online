import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PHYS_BASE } from '../../courses/registry';
import { physDecks } from '../../content/phys';
import { useToc } from '../../lib/toc';
import { decodeEntities } from '../../lib/text';
import HtmlContent from '../../components/HtmlContent';
import Sections from '../../components/Sections';
import SectionCapsule from '../../components/SectionCapsule';
import { scrollToId } from '../../lib/scroll';
import { useScrollSpy } from '../../lib/scrollspy';

/** 章页面：布局与算法课 DeckPage 一致，数据换成大学物理课程包 */
export default function PhysDeck() {
  const { deckId } = useParams();
  const deck = physDecks.find((d) => d.id === deckId);
  if (!deck) return <Navigate to={PHYS_BASE} replace />;
  return <DeckInner key={deck.id} deck={deck} />;
}

function DeckInner({ deck }: { deck: (typeof physDecks)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id); // 立即高亮，不等滚动事件
    navigate(`${PHYS_BASE}/deck/${deck.id}?s=${id}`, { replace: true });
  };

  // 上报目录到外壳侧栏
  useEffect(() => {
    toc.report(deck.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id]);

  // ?s=sec-id 深链：首次直接定位，此后平滑滚动
  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  // 精准 scroll-spy：与侧栏目录一一对应
  useScrollSpy(pageRef, [deck.id]);

  const level2 = deck.toc.filter((e) => e.level === 2);

  return (
    <div className="page" ref={pageRef} data-deck={deck.id}>
      <h1>{decodeEntities(deck.title)}</h1>
      <div className="lede">
        <HtmlContent html={deck.lede} />
      </div>
      {/* 本章知识点导航卡：由目录数据生成的可点标签，先给全章一张「地图」 */}
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
      <Sections
        sections={deck.sections}
        scores={scores}
        onQuizResult={(key, right) => setScores((s) => ({ ...s, [key]: right }))}
      />
      <SectionCapsule />
    </div>
  );
}

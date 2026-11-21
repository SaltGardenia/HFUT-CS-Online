import { useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DB_BASE } from '../courses/registry';
import { dbChapters } from '../content/db';
import type { DbChapter } from '../content/db';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

export default function DbChapterPage() {
  const { chapterId } = useParams();
  const chapter = dbChapters.find((c) => c.id === chapterId);
  if (!chapter) return <Navigate to={DB_BASE} replace />;
  return <ChapterInner key={chapter.id} chapter={chapter} />;
}

function ChapterInner({ chapter }: { chapter: DbChapter }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id); // 立即高亮，不等滚动事件
    navigate(`${DB_BASE}/chapter/${chapter.id}?s=${id}`, { replace: true });
  };

  // 上报目录到外壳侧栏
  useEffect(() => {
    toc.report(chapter.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id]);

  // ?s=sec-id 深链：首次直接定位，此后平滑滚动
  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  // 精准 scroll-spy：与侧栏目录一一对应（含无二级目录的一级标题）
  useScrollSpy(pageRef, [chapter.id]);

  const level2 = chapter.toc.filter((e) => e.level === 2);

  return (
    <div className="page" ref={pageRef} data-chapter={chapter.id}>
      <h1>{decodeEntities(chapter.title)}</h1>
      <div className="lede">
        <HtmlContent html={chapter.lede} />
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
      <Sections sections={chapter.sections} />
      <SectionCapsule />
    </div>
  );
}

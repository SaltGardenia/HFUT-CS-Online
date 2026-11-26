import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NET_BASE } from '../courses/registry';
import { netChapters, netPapers } from '../content/net';
import { buildNetSupplement, isNetSupplementAnchor } from '../content/net/supplement';
import { netHomework } from '../content/net/homework';
import { buildSlideReview, sourceExtraNotes } from '../content/net/slide-review';
import NetHomework from './net/NetHomework';
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

function NetUnitInner({ chapter: original }: { chapter: (typeof netChapters)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const requested = params.get('s');
  const review = useMemo(() => buildSlideReview(original), [original]);
  const supplement = useMemo(() => buildNetSupplement(original), [original]);
  const supplementAnchor = !!requested && isNetSupplementAnchor(requested) && supplement.toc.some(e => e.id === requested);
  const legacyAnchor = !!requested && !review.resolve(requested) && original.toc.some(e => e.id === requested);
  const mode = supplementAnchor ? 'supplement' : legacyAnchor ? 'extra'
    : params.get('view') === 'supplement' ? 'supplement' : params.get('view') === 'extra' ? 'extra' : 'main';
  const extra = mode === 'extra';
  const isSupplement = mode === 'supplement';
  const chapter = isSupplement ? supplement : extra ? original : review.chapter;
  const section = requested ? (mode === 'main' ? review.resolve(requested) : requested) : undefined;
  useEffect(() => {
    if (!requested) return;
    const view = supplementAnchor ? 'supplement' : legacyAnchor ? 'extra' : undefined;
    if (view && params.get('view') !== view) {
      navigate(`${NET_BASE}/deck/${original.id}?view=${view}&s=${encodeURIComponent(requested)}`, { replace: true });
    }
  }, [legacyAnchor, supplementAnchor, params, navigate, original.id, requested]);
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${NET_BASE}/deck/${chapter.id}?${mode === 'main' ? '' : 'view='+mode+'&'}s=${encodeURIComponent(id)}`, { replace: true });
  };

  useEffect(() => {
    toc.report(chapter.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id, mode]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section, mode]);

  useScrollSpy(pageRef, [chapter.id, mode]);

  const level2 = chapter.toc.filter((e) => e.level === 2);
  const chapterNo = Number(chapter.id.slice(2));
  const questions = isSupplement ? [] : netHomework[chapterNo] ?? [];
  // 与侧栏目录使用相同的 section id；把 h3 知识点归入所在 h2。
  const questionsForSection = new Map<string, typeof questions>();
  let parent = '';
  for (const entry of chapter.toc) {
    if (entry.level === 2) parent = entry.id;
    for (const q of questions) {
      if ((extra ? q.related : review.resolve(q.related)) !== entry.id) continue;
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
      <nav className="topic-map" aria-label="复习模式">
        <span className="topic-map-label">复习模式</span>
        {([['main','课件主线'],['supplement','历年考点与拓展'],['extra','历史原讲义']] as const).map(([value,label]) => (
          <button key={value} className="topic-chip" type="button" aria-pressed={mode === value}
            style={{ fontWeight: mode === value ? 700 : 400 }} onClick={() => {
              if (mode !== value) {
                navigate(`${NET_BASE}/deck/${chapter.id}${value === 'main' ? '' : '?view='+value}`, {replace:true});
                window.scrollTo({top:0,behavior:'auto'});
              }
            }}>{label}</button>
        ))}
      </nav>
      <div className="callout tip">
        <p className="callout-h">{isSupplement ? '历年考点与课外拓展' : extra ? '历史原讲义（仅供对照）' : '学习范围'}</p>
        <p>{isSupplement ? '本页不重复整理课内定义，仅收录未详细展开的考点和必要的延伸知识。' : extra ? '此处保留历史版本，其中有与主线重复的内容。' : '按课件顺序学习；理解辅助紧随相应知识点。'}</p>
        <p>{sourceExtraNotes[chapterNo]}</p>
      </div>
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
          {isSupplement && (() => {
            const papers = netPapers.filter(p => p.questions.some(q => q.tags.some(t => t.sec === section.id)));
            return papers.length > 0 && <nav className="net-hw-context" aria-label="相关历年试卷">
              <span>相关历年试卷</span>
              {papers.map(p => <Link key={p.id} to={`${NET_BASE}/practice/${p.id}`}>{p.id.replace('paper-', '')} 年试卷</Link>)}
            </nav>;
          })()}
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
      {!isSupplement && <NetHomework chapterNo={chapterNo} questions={questions} />}
      <SectionCapsule />
    </div>
  );
}

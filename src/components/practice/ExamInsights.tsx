import { useMemo, useState } from 'react';
import { buildExamInsights, buildWeakPoints, type InsightPaper } from '../../lib/exam-insights';

/** 题型系列色的固定槽位顺序（未列出的题型按首现顺序追加在后面） */
const KIND_SLOT_ORDER = ['single', 'multi', 'judge', 'fill', 'essay'];

/** 高频考点榜的条数 */
const TOP_TAGS = 8;

export interface ExamInsightsProps {
  papers: InsightPaper[];
  /** 题型 → 短标（如「单选」）；未提供的题型直接显示 kind */
  kindLabel: Record<string, string>;
  /** 考点跳转 href（与答题页的知识点标签同一条链路） */
  tagHref: (deck: number, sec: string) => string;
  /** 章号 → 章名（行标与覆盖统计用；不在表内的章，如 phys 的 deck 0「课件未收录」，不进图） */
  chapterNames?: Record<number, string>;
  /** 作答进度（键 → right/wrong/revealed），提供后才出现「我的易错考点」 */
  progress?: Record<string, string>;
  /** 进度键格式（phys/net 为 `${paperId}:${qid}`，缺省用 qid） */
  resultKey?: (paperId: string, qid: string) => string;
}

/** 在线练习页顶部的考点分析：章级排行、高频考点榜、卷×章矩阵与个人易错榜。
 * 数据全部由试卷标签聚合得出（lib/exam-insights），无图表库，条形为纯 CSS。 */
export default function ExamInsights({
  papers,
  kindLabel,
  tagHref,
  chapterNames,
  progress,
  resultKey,
}: ExamInsightsProps) {
  const [sortBy, setSortBy] = useState<'count' | 'deck'>('count');

  const data = useMemo(() => buildExamInsights(papers), [papers]);
  const weak = useMemo(
    () => (progress ? buildWeakPoints(papers, progress, resultKey) : []),
    [papers, progress, resultKey],
  );
  const paperTitle = useMemo(() => new Map(papers.map((p) => [p.id, p.title])), [papers]);

  // 出现过的题型按槽位顺序排列 → 系列色
  const kinds = useMemo(() => {
    const present = new Set(papers.flatMap((p) => p.questions.map((q) => q.kind)));
    return [
      ...KIND_SLOT_ORDER.filter((k) => present.has(k)),
      ...[...present].filter((k) => !KIND_SLOT_ORDER.includes(k)),
    ];
  }, [papers]);
  const kindSlot = useMemo(() => new Map(kinds.map((k, i) => [k, i % 6])), [kinds]);

  // chapterNames 表外的章不进图（行与矩阵列同步过滤）
  const chapterRows = useMemo(
    () => (chapterNames ? data.chapters.filter((c) => chapterNames[c.deck] != null) : data.chapters),
    [data, chapterNames],
  );
  const decks = useMemo(() => {
    if (!chapterNames) return data.decks.map((deck, cellIdx) => ({ deck, cellIdx }));
    return data.decks
      .filter((d) => chapterNames[d] != null)
      .map((deck) => ({ deck, cellIdx: data.decks.indexOf(deck) }));
  }, [data, chapterNames]);

  const chapters = useMemo(
    () => (sortBy === 'count' ? chapterRows : [...chapterRows].sort((a, b) => a.deck - b.deck)),
    [chapterRows, sortBy],
  );
  const topTags = useMemo(() => data.tags.slice(0, TOP_TAGS), [data]);

  const maxChapter = Math.max(1, ...chapters.map((c) => c.count));
  const chapterTotal = chapterNames ? Object.keys(chapterNames).length : data.chapters.length;
  // 高频考点条长 = 覆盖卷占比（与排序指标一致，AA 式「条长即所排之量」）；
  // 单卷课程没有跨卷信号，退回按题数
  const tagBar = (t: { count: number; papers: number }) =>
    data.totalPapers > 1 ? (t.papers / data.totalPapers) * 100 : (t.count / Math.max(1, ...data.tags.map((x) => x.count))) * 100;

  if (data.totalQuestions === 0) return null;

  const tipPaper = (byPaper: { paperId: string; count: number }[]) =>
    byPaper.map(({ paperId, count }) => (
      <span key={paperId}>
        {paperTitle.get(paperId) ?? paperId} · {count} 题
      </span>
    ));

  return (
    <section className="exam-insights" aria-label="考点分析">
      <div className="ei-head">
        <h2>考点分析</h2>
        <p className="ei-sum">
          {data.totalPapers} 份试卷 · {data.totalQuestions} 道题 · 覆盖 {chapters.length}/{chapterTotal} 章
        </p>
      </div>

      {/* 块 1/2 两列并排：考点分布（左）+ 高频考点（右） */}
      <div className="ei-top">
        {/* 块 1 · 章级考点分布：排行条形，条内按题型堆叠 */}
        {chapters.length > 0 && (
          <div className="ei-block">
          <div className="ei-block-head">
            <h3>考点分布</h3>
            <div className="ei-sort" role="group" aria-label="排序方式">
              <button type="button" data-on={sortBy === 'count'} onClick={() => setSortBy('count')}>
                按题数
              </button>
              <button type="button" data-on={sortBy === 'deck'} onClick={() => setSortBy('deck')}>
                按章序
              </button>
            </div>
          </div>
          <ul className="ei-bars">
            {chapters.map((c, i) => (
              <li key={c.deck} className="ei-row">
                <span className="ei-row-label">
                  <b className="ei-no">{c.deck}</b>
                  <span className="ei-row-name">{chapterNames?.[c.deck] ?? `第 ${c.deck} 章`}</span>
                </span>
                <span className="ei-track" aria-hidden="true">
                  <span
                    className="ei-fill"
                    style={{ width: `${(c.count / maxChapter) * 100}%`, animationDelay: `${Math.min(i * 24, 240)}ms` }}
                  >
                    {kinds
                      .filter((k) => c.byKind[k])
                      .map((k) => (
                        <i key={k} className={`ei-seg ei-k${kindSlot.get(k)}`} style={{ flexGrow: c.byKind[k] }} />
                      ))}
                  </span>
                </span>
                <span className="ei-row-nums">
                  <b>{c.count}</b> 题 · {c.papers} 卷
                </span>
                <span className="ei-tip">{tipPaper(c.byPaper)}</span>
              </li>
            ))}
          </ul>
          <ul className="ei-legend" aria-hidden="true">
            {kinds.map((k) => (
              <li key={k}>
                <i className={`ei-k${kindSlot.get(k)}`} />
                {kindLabel[k] ?? k}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 块 2 · 高频考点：按覆盖卷数、题数排行；● = 跨 ≥2 卷的重点考点 */}
      {topTags.length > 0 && (
        <div className="ei-block">
          <div className="ei-block-head">
            <h3>高频考点</h3>
          </div>
          <ul className="ei-tags">
            {topTags.map((t, i) => (
              <li key={t.text}>
                <a className="ei-tag-row" href={tagHref(t.deck, t.sec)}>
                  <i className="ei-dot" data-on={t.papers >= 2} aria-hidden="true" />
                  <span className="ei-row-name">{t.text}</span>
                  <span className="ei-track" aria-hidden="true">
                    <span
                      className="ei-fill ei-fill-accent"
                      style={{ width: `${tagBar(t)}%`, animationDelay: `${Math.min(i * 24, 240)}ms` }}
                    />
                  </span>
                  <span className="ei-row-nums">
                    <b>{t.count}</b> 题 · {t.papers} 卷
                  </span>
                  <span className="ei-tip">{tipPaper(t.byPaper)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      {/* 块 3 · 历年分布矩阵：行=试卷（按数据顺序即年代序），列=章，格深浅=题数 */}
      {data.matrix.length >= 2 && decks.length > 0 && (
        <div className="ei-block">
          <div className="ei-block-head">
            <h3>历年分布</h3>
          </div>
          <div className="ei-matrix-wrap">
            <table className="ei-matrix">
              <thead>
                <tr>
                  <th scope="col">试卷</th>
                  {decks.map(({ deck }) => (
                    <th key={deck} scope="col" className="ei-m-ch" title={chapterNames?.[deck]}>
                      {deck}
                    </th>
                  ))}
                  <th scope="col">合计</th>
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((row) => (
                  <tr key={row.paperId}>
                    <th scope="row" className="ei-m-paper">
                      {row.title}
                    </th>
                    {decks.map(({ deck, cellIdx }) => {
                      const n = row.cells[cellIdx] ?? 0;
                      const ratio = n / data.maxCell;
                      return n > 0 ? (
                        <td
                          key={deck}
                          className="ei-m-cell"
                          title={`${row.title} · ${chapterNames?.[deck] ?? `第 ${deck} 章`} · ${n} 题`}
                          style={{
                            background: `color-mix(in srgb, var(--deck-accent) ${Math.round(10 + 72 * ratio)}%, transparent)`,
                            ...(ratio > 0.5 ? { color: 'var(--panel-solid)' } : {}),
                          }}
                        >
                          {n}
                        </td>
                      ) : (
                        <td key={deck} className="ei-m-zero" aria-hidden="true" />
                      );
                    })}
                    <td className="ei-m-total">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 块 4 · 个人易错考点：由作答进度算出，答错才有 */}
      {weak.length > 0 && (
        <div className="ei-block">
          <div className="ei-block-head">
            <h3>我的易错考点</h3>
          </div>
          <ul className="ei-tags">
            {weak.map((w) => (
              <li key={w.text}>
                <a className="ei-tag-row" href={tagHref(w.deck, w.sec)}>
                  <i className="ei-dot ei-dot-warn" aria-hidden="true" />
                  <span className="ei-row-name">{w.text}</span>
                  <span className="ei-track" aria-hidden="true">
                    <span className="ei-fill ei-fill-warn" style={{ width: `${(w.wrong / w.answered) * 100}%` }} />
                  </span>
                  <span className="ei-row-nums">
                    错 <b>{w.wrong}</b> / 答 {w.answered}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

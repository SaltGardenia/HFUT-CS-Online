/**
 * 练习报告：作答数据的图表化汇总（数据组织取 artificialanalysis.ai 的排行榜语言：
 * 榜单优先、精确排序、色彩 = 章身份、散点 + 参考象限）。
 * 挂在答题页题目列表末尾（本卷报告）或练习首页末尾（全部习题报告）；
 * 作答数 ≥1 才渲染，随作答实时更新。四个模块：概览数字 / 分章榜 / 知识点榜 / 覆盖×掌握散点。
 */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGO_BASE } from '../../../courses/registry';
import type { PracticeQuestion, PracticeTag } from '../../../content/practice';
import { decodeEntities } from '../../../lib/text';
import {
  MIN_SAMPLE,
  WEAK_THRESHOLD,
  masteryOf,
  sortDecksByMastery,
  sortTagsWeakest,
  summarize,
  tallyByDeck,
  tallyByTag,
  weakTags,
  type DeckMeta,
  type DeckRow,
  type ReportResults,
  type TagRow,
  type Tally,
} from './aggregates';

export interface PracticeReportProps {
  /** 报告标题（「本卷报告」/「全部习题报告」） */
  title: string;
  /** 统计域内的题目 */
  questions: PracticeQuestion[];
  /** 本课程作答进度表 */
  results: ReportResults;
  /** 章序号 → 显示名与章色；deck 0 固定灰「未挂章节」，不经过此函数 */
  deckMeta?: (deck: number) => DeckMeta;
  /** 知识点行跳转；缺省为算法课（/algo/deck/deckN?s=） */
  tagNav?: (t: PracticeTag) => { href: string; tip: string };
}

/** deck 0（课件未收录）固定灰色，不走各课章色 */
const DECK0_META: DeckMeta = { name: '未挂章节', color: 'var(--ink-3)' };

const pctText = (m: number | null) => (m == null ? null : `${Math.round(m * 100)}%`);

/** 分段堆叠条：答对绿 / 答错红 / 看答案灰；轨道露出部分即未作答 */
function SegmentBar({ t }: { t: Tally }) {
  const w = (n: number) => `${(n / Math.max(1, t.answered)) * 100}%`;
  return (
    <span className="pr-bar" aria-hidden="true">
      <i className="pr-seg" data-k="right" style={{ width: w(t.right) }} />
      <i className="pr-seg" data-k="wrong" style={{ width: w(t.wrong) }} />
      <i className="pr-seg" data-k="revealed" style={{ width: w(t.revealed) }} />
    </span>
  );
}

const tallyTip = (t: Tally) =>
  `对 ${t.right} · 错 ${t.wrong} · 看答案 ${t.revealed} · 未作答 ${t.pending}（共 ${t.total} 题）`;

export default function PracticeReport({ title, questions, results, deckMeta, tagNav }: PracticeReportProps) {
  const navigate = useNavigate();
  const [showAllTags, setShowAllTags] = useState(false);

  const summary = useMemo(() => summarize(questions, results), [questions, results]);
  const deckRows = useMemo(() => tallyByDeck(questions, results), [questions, results]);
  const tagRows = useMemo(() => tallyByTag(questions, results), [questions, results]);
  const deckSorted = useMemo(() => sortDecksByMastery(deckRows), [deckRows]);
  const tagsSorted = useMemo(() => sortTagsWeakest(tagRows), [tagRows]);
  const weak = useMemo(() => weakTags(tagRows), [tagRows]);

  if (summary.tally.answered === 0) return null;

  const metaOf = (deck: number): DeckMeta =>
    deck === 0 ? DECK0_META : (deckMeta?.(deck) ?? { name: `第 ${deck} 讲`, color: `var(--deck${deck}, var(--deck-accent))` });

  const navOf = (t: TagRow): { href: string; tip: string } | null => {
    if (!t.sec) return null;
    const tag: PracticeTag = { deck: t.deck, sec: t.sec, text: t.text };
    if (tagNav) return tagNav(tag);
    if (t.deck <= 0) return null;
    return { href: `${ALGO_BASE}/deck/deck${t.deck}?s=${t.sec}`, tip: `跳转到 第 ${t.deck} 讲 · ${decodeEntities(t.text)}` };
  };

  const shownTags = showAllTags ? tagsSorted : tagsSorted.slice(0, 8);

  return (
    <section className="pr-report" aria-label={title}>
      <h2>{title}</h2>

      {/* ① 概览数字条 */}
      <div className="pr-stats" role="group" aria-label="总体统计">
        <div className="pr-stat">
          <b>
            {summary.tally.answered}
            <small>/{summary.tally.total}</small>
          </b>
          <span>已作答</span>
        </div>
        <div className="pr-stat">
          <b>{pctText(summary.mastery) ?? '—'}</b>
          <span>掌握率</span>
        </div>
        <div className="pr-stat">
          <b>{pctText(summary.coverage) ?? '—'}</b>
          <span>覆盖率</span>
        </div>
        <div className="pr-stat" title={`已作答且掌握率低于 ${Math.round(WEAK_THRESHOLD * 100)}% 的知识点`}>
          <b>{weak.length}</b>
          <span>薄弱知识点</span>
        </div>
      </div>

      {/* ② 分章掌握榜：按掌握率降序（排行榜语言） */}
      <div className="pr-block" role="group" aria-label="分章掌握">
        <h3 className="pr-block-title">分章掌握</h3>
        <div className="pr-rows">
          {deckSorted.map((r: DeckRow) => {
            const meta = metaOf(r.deck);
            return (
              <div key={r.deck} className="pr-row" title={tallyTip(r)}>
                <span className="pr-row-name">
                  <i className="pr-no" style={r.deck > 0 ? { background: meta.color } : undefined}>
                    {r.deck > 0 ? r.deck : ''}
                  </i>
                  {meta.name}
                </span>
                <SegmentBar t={r} />
                <span className="pr-row-num">
                  <b>{pctText(masteryOf(r)) ?? '—'}</b>
                  <small>
                    {r.right}/{r.answered}
                  </small>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ③ 知识点掌握榜：薄弱优先，默认前 8 条 */}
      {tagsSorted.length > 0 && (
        <div className="pr-block" role="group" aria-label="知识点掌握">
          <h3 className="pr-block-title">
            知识点掌握
            <span className="pr-block-cap">
              {tagsSorted.length} 个已作答 · 薄弱 {weak.length}
            </span>
          </h3>
          <div className="pr-rows">
            {shownTags.map((t) => {
              const nav = navOf(t);
              const name = decodeEntities(t.text);
              return (
                <div key={`${t.deck}|${t.text}`} className="pr-row" data-small={t.total < MIN_SAMPLE || undefined} title={tallyTip({ ...t, pending: t.total - t.answered })}>
                  <span className="pr-row-name">
                    <i className="pr-no" style={t.deck > 0 ? { background: metaOf(t.deck).color } : undefined}>
                      {t.deck > 0 ? t.deck : ''}
                    </i>
                    {nav ? (
                      <button type="button" className="pr-tag-link" title={nav.tip} onClick={() => navigate(nav.href)}>
                        {name}
                      </button>
                    ) : (
                      name
                    )}
                    {t.total < MIN_SAMPLE && <small className="pr-n">{t.total} 题</small>}
                  </span>
                  <SegmentBar t={{ ...t, pending: t.total - t.answered }} />
                  <span className="pr-row-num">
                    <b>{pctText(masteryOf(t)) ?? '—'}</b>
                    <small>
                      {t.right}/{t.answered}
                    </small>
                  </span>
                </div>
              );
            })}
          </div>
          {tagsSorted.length > 8 && (
            <button type="button" className="pr-more" onClick={() => setShowAllTags((v) => !v)}>
              {showAllTags ? '收起' : `展开全部 ${tagsSorted.length} 个知识点`}
            </button>
          )}
        </div>
      )}

      {/* ④ 覆盖 × 掌握散点：一章一点，均值虚线分象限（≥2 个已作答章才画） */}
      <Scatter summary={summary} deckRows={deckSorted} metaOf={metaOf} />
    </section>
  );
}

/* ---------------------------------------------------------- 覆盖 × 掌握散点 */

/** viewBox 尺寸与内边距（底部留双行：刻度 + 轴题） */
const W = 340;
const H = 212;
const L = 42;
const R = 16;
const T = 18;
const B = 36;

function Scatter({
  summary,
  deckRows,
  metaOf,
}: {
  summary: ReturnType<typeof summarize>;
  deckRows: DeckRow[];
  metaOf: (deck: number) => DeckMeta;
}) {
  const pts = deckRows.filter((r) => r.answered > 0);
  if (pts.length < 2 || summary.coverage == null || summary.mastery == null) return null;

  const iw = W - L - R;
  const ih = H - T - B;
  const X = (v: number) => L + iw * v;
  const Y = (v: number) => T + ih * (1 - v);
  const cov = summary.coverage;
  const mast = summary.mastery;

  return (
    <div className="pr-block" role="group" aria-label="覆盖与掌握散点">
      <h3 className="pr-block-title">覆盖 × 掌握</h3>
      <svg
        className="pr-scatter"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`覆盖 × 掌握散点：${pts.length} 个章，整体覆盖率 ${Math.round(cov * 100)}%，整体掌握率 ${Math.round(mast * 100)}%`}
      >
        {/* 参考网格（1/4 刻度细线）与坐标标注 */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g} className="pr-grid">
            <line x1={X(g)} y1={Y(0)} x2={X(g)} y2={Y(1)} />
            <line x1={L} y1={Y(g)} x2={W - R} y2={Y(g)} />
          </g>
        ))}
        {[0, 0.5, 1].map((g) => (
          <g key={g} className="pr-tick">
            <text x={X(g)} y={Y(0) + 14} textAnchor="middle">{Math.round(g * 100)}</text>
            <text x={L - 7} y={Y(g) + 3}>{Math.round(g * 100)}</text>
          </g>
        ))}
        <text className="pr-axis" x={L} y={T - 7}>掌握率</text>
        <text className="pr-axis" x={W - R} y={Y(0) + 28} textAnchor="end">覆盖率</text>

        {/* 「优先复习」象限底纹：覆盖广（高于均值）但掌握弱（低于均值） */}
        <rect className="pr-zone" x={X(cov)} y={Y(mast)} width={Math.max(0, X(1) - X(cov))} height={Math.max(0, Y(0) - Y(mast))} />
        <g className="pr-mean">
          <line x1={X(cov)} y1={Y(0)} x2={X(cov)} y2={Y(1)} />
          <line x1={L} y1={Y(mast)} x2={W - R} y2={Y(mast)} />
        </g>
        <text className="pr-zone-label" x={X(1) - 6} y={Y(mast) + 12} textAnchor="end">
          优先复习
        </text>

        {/* 章散点：点色 = 章色；作答 <2 题空心（统计不稳） */}
        {pts.map((r) => {
          const meta = metaOf(r.deck);
          const hollow = r.answered < 2;
          return (
            <circle
              key={r.deck}
              className="pr-dot"
              cx={X(r.answered / r.total)}
              cy={Y(r.right / r.answered)}
              r={5.5}
              data-hollow={hollow || undefined}
              style={r.deck > 0 ? ({ '--dot': meta.color } as React.CSSProperties) : undefined}
            >
              <title>
                {`${meta.name}：覆盖 ${Math.round((r.answered / r.total) * 100)}% · 掌握 ${Math.round((r.right / r.answered) * 100)}%（对 ${r.right} / 错 ${r.wrong} / 看答案 ${r.revealed}）`}
              </title>
            </circle>
          );
        })}
      </svg>
      <div className="pr-legend" aria-hidden="true">
        {pts.map((r) => (
          <span key={r.deck} className="pr-legend-item">
            <i style={r.deck > 0 ? { background: metaOf(r.deck).color } : undefined} />
            {metaOf(r.deck).name}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 练习报告的纯统计层：题组 + 作答结果 → 各维度汇总（不涉及渲染，全部可单测）。
 * 口径：已作答 = right / wrong / revealed 任意一种；
 * 掌握率 = right ÷ 已作答（「已看答案」计入分母、不计入分子）。
 */
import type { PracticeKind, PracticeQuestion } from '../../../content/practice/types';

export type ReportResult = 'right' | 'wrong' | 'revealed';
export type ReportResults = Record<string, ReportResult>;

/** 薄弱阈值：已作答知识点的掌握率低于该值记为薄弱 */
export const WEAK_THRESHOLD = 0.6;

/** 小样本阈值：作答题数低于该值的知识点行降透明度并标注题数（统计不稳） */
export const MIN_SAMPLE = 3;

/** 一组题的作答分账 */
export interface Tally {
  /** 该维度上的总题数 */
  total: number;
  right: number;
  wrong: number;
  revealed: number;
  /** 已作答 = right + wrong + revealed */
  answered: number;
  /** 未作答 */
  pending: number;
}

/**
 * 主标签章号：一题归入其 tags 中最小的正 deck 号（与列表分组标题口径一致）；
 * 标签全是 deck 0（课件未收录）时归 0。
 */
export function primaryDeck(q: PracticeQuestion): number {
  const decks = q.tags.map((t) => t.deck).filter((d) => d > 0);
  return decks.length > 0 ? Math.min(...decks) : 0;
}

/** 掌握率（0~1）；无作答时为 null */
export function masteryOf(t: { right: number; answered: number }): number | null {
  return t.answered > 0 ? t.right / t.answered : null;
}

export function tallyOf(questions: readonly PracticeQuestion[], results: ReportResults): Tally {
  const t: Tally = { total: questions.length, right: 0, wrong: 0, revealed: 0, answered: 0, pending: 0 };
  for (const q of questions) {
    const r = results[q.id];
    if (r === 'right') t.right += 1;
    else if (r === 'wrong') t.wrong += 1;
    else if (r === 'revealed') t.revealed += 1;
  }
  t.answered = t.right + t.wrong + t.revealed;
  t.pending = t.total - t.answered;
  return t;
}

export interface ReportSummary {
  tally: Tally;
  /** 掌握率 0~1；无作答时为 null */
  mastery: number | null;
  /** 覆盖率 0~1；题组为空时为 null */
  coverage: number | null;
}

export function summarize(questions: readonly PracticeQuestion[], results: ReportResults): ReportSummary {
  const tally = tallyOf(questions, results);
  return {
    tally,
    mastery: masteryOf(tally),
    coverage: tally.total > 0 ? tally.answered / tally.total : null,
  };
}

/** 章级汇总行（主标签口径，各章题数加总 = 总题数） */
export interface DeckRow extends Tally {
  /** 章序号；0 = 未挂章节（如「课件未收录」标签） */
  deck: number;
}

const deckOrder = (d: number) => (d === 0 ? Number.MAX_SAFE_INTEGER : d);

export function tallyByDeck(questions: readonly PracticeQuestion[], results: ReportResults): DeckRow[] {
  const groups = new Map<number, PracticeQuestion[]>();
  for (const q of questions) {
    const d = primaryDeck(q);
    const list = groups.get(d);
    if (list) list.push(q);
    else groups.set(d, [q]);
  }
  return [...groups.entries()]
    .map(([deck, qs]) => ({ deck, ...tallyOf(qs, results) }))
    .sort((a, b) => deckOrder(a.deck) - deckOrder(b.deck));
}

/** 知识点汇总行（逐标签口径：一题挂 N 个知识点各计一次） */
export interface TagRow {
  /** 章序号；0 = 课件未收录 */
  deck: number;
  /** 标签显示文本 */
  text: string;
  /** 跳转用的 section id（同名标签取第一个；'' = 无处可跳） */
  sec: string;
  /** 挂该知识点的题数 */
  total: number;
  right: number;
  wrong: number;
  revealed: number;
  answered: number;
}

export function tallyByTag(questions: readonly PracticeQuestion[], results: ReportResults): TagRow[] {
  const map = new Map<string, TagRow>();
  for (const q of questions) {
    for (const tag of q.tags) {
      const key = `${tag.deck}|${tag.text}`;
      let row = map.get(key);
      if (!row) {
        row = { deck: tag.deck, text: tag.text, sec: '', total: 0, right: 0, wrong: 0, revealed: 0, answered: 0 };
        map.set(key, row);
      }
      if (!row.sec && tag.sec) row.sec = tag.sec;
      row.total += 1;
      const r = results[q.id];
      if (r === 'right') row.right += 1;
      else if (r === 'wrong') row.wrong += 1;
      else if (r === 'revealed') row.revealed += 1;
    }
  }
  for (const row of map.values()) row.answered = row.right + row.wrong + row.revealed;
  return [...map.values()];
}

/** 题型汇总行（只含出现的题型，按传入顺序） */
export interface KindRow extends Tally {
  kind: PracticeKind;
}

export function tallyByKind(
  questions: readonly PracticeQuestion[],
  results: ReportResults,
  kinds: readonly PracticeKind[],
): KindRow[] {
  return kinds
    .map((kind) => ({ kind, ...tallyOf(questions.filter((q) => q.kind === kind), results) }))
    .filter((row) => row.total > 0);
}

/** 榜单排序：掌握率高在前（无作答垫底），并列时作答多在前 */
export function sortDecksByMastery<T extends DeckRow>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => {
    const ma = masteryOf(a) ?? -1;
    const mb = masteryOf(b) ?? -1;
    if (ma !== mb) return mb - ma;
    return b.answered - a.answered || a.deck - b.deck;
  });
}

/** 薄弱优先：只留已作答行，掌握率低在前，并列时作答多在前 */
export function sortTagsWeakest<T extends TagRow>(rows: readonly T[]): T[] {
  return rows
    .filter((r) => r.answered > 0)
    .sort((a, b) => {
      const ma = masteryOf(a) ?? 1;
      const mb = masteryOf(b) ?? 1;
      if (ma !== mb) return ma - mb;
      return b.answered - a.answered || a.deck - b.deck || a.text.localeCompare(b.text, 'zh');
    });
}

/** 薄弱知识点：已作答且掌握率低于阈值，薄弱优先排序 */
export function weakTags(rows: readonly TagRow[]): TagRow[] {
  return sortTagsWeakest(rows).filter((r) => (masteryOf(r) ?? 1) < WEAK_THRESHOLD);
}

/** 章元信息：显示名 + 章色（CSS color，可用 var(...)） */
export interface DeckMeta {
  name: string;
  color: string;
}

interface ShellLikeConfig {
  deckKey: string;
  chapters: readonly { id: string; no: string; title: string }[];
}

/** CourseShell 共享课的章元信息适配器：deck 号 = 章节列表序数（1 基），章色取 --{deckKey}{序数} */
export function shellDeckMeta(config: ShellLikeConfig): (deck: number) => DeckMeta {
  return (deck: number): DeckMeta => {
    const ch = config.chapters[deck - 1];
    if (!ch) return { name: `第 ${deck} 章`, color: 'var(--deck-accent)' };
    return { name: ch.no.replace(/\s+/g, ''), color: `var(--${config.deckKey}${deck}, var(--deck-accent))` };
  };
}

/** 章号不从 1 开始的课程（如高数 8..13）：deck 号 = 章节 id 里的章号，章色取课内序数 */
export function numberedDeckMeta(config: ShellLikeConfig): (deck: number) => DeckMeta {
  return (deck: number): DeckMeta => {
    const i = config.chapters.findIndex((c) => c.id === `ch${deck}`);
    if (i < 0) return { name: `第 ${deck} 章`, color: 'var(--deck-accent)' };
    return {
      name: config.chapters[i].no.replace(/\s+/g, ''),
      color: `var(--${config.deckKey}${i + 1}, var(--deck-accent))`,
    };
  };
}


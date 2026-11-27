import type { DeckData } from '../content/types';
import type { SearchIndexItem } from '../components/SearchBox';
import { decodeEntities } from './text';
import type { ReadingMap } from './sync/types';

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
const boundary = /^(P|DIV|LI|UL|OL|TABLE|TR|TH|TD|PRE|BLOCKQUOTE|FIGCAPTION|BR|H[1-6]|HR|DL|DT|DD)$/;

/** 从讲义 HTML 提取正文，沿用已存在的目录锚点；未设锚点的小标题归入所在节。 */
export function appendOutlineIndex(
  items: SearchIndexItem[], deck: DeckData,
  unitTitle = decodeEntities(deck.title), unit: string | null = deck.id,
): void {
  const anchors = new Map(deck.toc.map(t => [t.id, decodeEntities(t.text)]));
  const template = document.createElement('template');
  for (const section of deck.sections) {
    let sectionId = section.id;
    let fragments: string[] = [];
    const flush = () => {
      const text = normalize(fragments.join(''));
      if (text) items.push({ kind: '正文', unit, unitTitle, sectionId, sectionTitle: anchors.get(sectionId) || decodeEntities(section.heading), parentSectionTitle: anchors.get(section.id) || decodeEntities(section.heading), text });
      fragments = [];
    };
    const walk = (node: Node) => {
      if (node.nodeType === 3) {
        fragments.push(node.textContent ?? '');
        return;
      }
      if (node.nodeType !== 1) return;
      const el = node as Element;
      const tag = el.tagName.toUpperCase();
      if (/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|SVG)$/.test(tag) || el.hasAttribute('hidden')) return;
      if (el.id && anchors.has(el.id) && el.id !== sectionId) {
        flush();
        sectionId = el.id;
      }
      if (boundary.test(tag)) fragments.push(' ');
      for (const child of Array.from(el.childNodes)) walk(child);
      if (boundary.test(tag)) fragments.push(' ');
    };
    for (const block of section.blocks) {
      if (block.type !== 'html') continue;
      template.innerHTML = block.html;
      fragments.push(' ');
      for (const node of Array.from(template.content.childNodes)) walk(node);
    }
    flush();
  }
}

/** 两套讲义路由均支持；首页、试卷和附件页不偏向任何章节。 */
export function currentSearchUnit(pathname: string): string | undefined {
  return /^\/[^/]+\/(?:deck|chapter)\/([^/]+)\/?$/.exec(pathname)?.[1];
}

/** HTML 片段 → 纯文本：试题题干/选项/解析入索引用（实体解码，跨标签补空格）。 */
export function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

/** 题型短标：与各课程练习页的题型文案一致（OS_KIND_LABEL 等的共用子集）。 */
const KIND_SHORT: Record<string, string> = { single: '单选', multi: '多选', judge: '判断', fill: '填空', essay: '简答' };

/** 搜索索引里的最小试卷结构：各课程试卷类型（含 PAT 无题型、无选项的赛题）都是它的超集。 */
export interface IndexablePaper {
  id: string;
  title: string;
  /** 原卷大题；带 short（如「一、单选」的短名）时用它做题号前缀 */
  sections?: { questionIds: string[]; short?: string }[];
  questions: {
    id: string;
    kind?: string;
    title?: string;
    question: string;
    options?: string[];
    answer?: string;
    explanation?: string;
  }[];
}

/** 题号：OS 系题卡按 qid 解原卷编号（p2-f14-1 → 14-1），算法题库按 id 序号（f37 → 37）。 */
function questionNo(qid: string): string | null {
  const m = qid.match(/^[a-z]\d+-[a-z](\d+)(?:-(\d+))?$/);
  if (m) return `${m[1]}${m[2] ? `-${m[2]}` : ''}`;
  const s = qid.match(/^[a-z](\d+)$/);
  return s ? s[1] : null;
}

/**
 * 试题入索引：text = 题干 + 选项 + 解析，可整段检索；判断题不含选项与答案，
 * 避免「对/错」命中每一道判断题。题号文案尽量与练习页题卡一致（qid 编号 / 大题短名 / 全卷序号兜底）。
 */
export function appendPaperIndex(items: SearchIndexItem[], papers: IndexablePaper[], unitTitle?: string): void {
  for (const paper of papers) {
    const seq = new Map<string, { no: number; prefix?: string }>();
    if (paper.sections) {
      for (const sec of paper.sections) {
        sec.questionIds.forEach((id, i) => seq.set(id, { no: i + 1, prefix: sec.short }));
      }
    }
    paper.questions.forEach((q, i) => {
      if (!seq.has(q.id)) seq.set(q.id, { no: i + 1 });
      const parts = [q.title ? htmlToText(q.title) : '', htmlToText(q.question)];
      if (q.kind !== 'judge' && q.options?.length) parts.push(...q.options.map(htmlToText));
      if (q.answer && q.kind !== 'judge') parts.push(htmlToText(q.answer));
      if (q.explanation) parts.push(htmlToText(q.explanation));
      const { no, prefix } = seq.get(q.id)!;
      // 题号文案与练习页题卡对齐：OS 系卷页从 qid 解原卷编号（f14 → 填空 14），
      // 其余课程大题短名 + 大题内序号（单选 3 / 简答题 2）；无大题结构时退全卷序号。
      const idNo = questionNo(q.id);
      const label = prefix
        ? `${prefix} ${idNo ?? no}`
        : idNo && q.kind
          ? `${KIND_SHORT[q.kind] ?? ''} ${idNo}`.trim()
          : `第 ${no} 题`;
      items.push({
        kind: '题目',
        unit: null,
        unitTitle: unitTitle ?? paper.title,
        sectionId: paper.id,
        questionId: q.id,
        sectionTitle: label,
        text: parts.filter(Boolean).join(' '),
      });
    });
  }
}

/** 当前章整体优先；同组内保持原有标题优先及讲义顺序。 */
export function findSearchResults(index: SearchIndexItem[], query: string, limit = 12, currentUnit?: string): SearchIndexItem[] {
  const q = normalize(query).toLowerCase();
  if (!q) return [];
  const hits: { item: SearchIndexItem; score: number }[] = [];
  for (const item of index) {
    const idx = item.text.toLowerCase().indexOf(q);
    if (idx < 0) continue;
    // 标题短文本看命中位置；正文与试题是长文本，位置无意义，统一排在标题之后
    const score = item.kind === '正文' || item.questionId ? 3 : idx === 0 ? 0 : idx < 6 ? 1 : 2;
    hits.push({ item, score });
  }
  const priority = (item: SearchIndexItem) => currentUnit && item.unit === currentUnit ? 0 : 1;
  hits.sort((a, b) => priority(a.item) - priority(b.item) || a.score - b.score);
  const seen = new Set<string>();
  const result: SearchIndexItem[] = [];
  for (const { item } of hits) {
    const key = JSON.stringify([item.unit, item.sectionId, item.questionId ?? null]);
    if ((item.kind === '正文' || item.questionId) && seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

/** 截取命中位置附近的上下文，而非一律显示正文开头。 */
export function searchSnippet(text: string, query: string): string {
  const q = normalize(query).toLowerCase();
  const i = text.toLowerCase().indexOf(q);
  if (!q || i < 0 || text.length <= 54) return text;
  const start = Math.max(0, i - 12);
  const end = Math.min(text.length, i + q.length + 36);
  return (start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

/** H2 与章名分列显示，独立的小字号第二行显示 H3；无 H3 时省略。试题命中显示试卷名与题号。 */
export function outlineResultPath(item: SearchIndexItem): { chapter: string; heading: string; subheading: string | null } {
  const chapter = item.unit || item.questionId ? item.unitTitle : '首页';
  const section = item.parentSectionTitle || item.sectionTitle;
  const heading = section || chapter;
  const subheading = item.parentSectionTitle && item.sectionTitle && item.sectionTitle !== section
    ? item.sectionTitle : null;
  return { chapter, heading, subheading };
}

/** 阅读记录按页面保存，不能据此断定单个知识点已经读完。 */
export function chapterReadingStatus(item: SearchIndexItem, href: string, reading: ReadingMap): { read: boolean; percent: number } | null {
  if (!item.unit || (item.kind !== '章节' && item.kind !== '正文')) return null;
  const page = href.split(/[?#]/, 1)[0].replace(/\/$/, '');
  if (currentSearchUnit(page) !== item.unit) return null;
  const entry = reading[page];
  if (!entry || !Number.isFinite(entry.p)) return { read: false, percent: 0 };
  return { read: true, percent: Math.round(Math.min(1, Math.max(0, entry.p)) * 100) };
}

import type { DeckData } from '../content/types';
import type { SearchIndexItem } from '../components/SearchBox';
import { decodeEntities } from './text';

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

/** 标题、试卷等原有条目优先；正文匹配不受前面命中数量限制。 */
export function findSearchResults(index: SearchIndexItem[], query: string, limit = 12): SearchIndexItem[] {
  const q = normalize(query).toLowerCase();
  if (!q) return [];
  const hits: { item: SearchIndexItem; score: number }[] = [];
  for (const item of index) {
    const idx = item.text.toLowerCase().indexOf(q);
    if (idx < 0) continue;
    const score = item.kind === '正文' ? 3 : idx === 0 ? 0 : idx < 6 ? 1 : 2;
    hits.push({ item, score });
  }
  hits.sort((a, b) => a.score - b.score);
  const seen = new Set<string>();
  const result: SearchIndexItem[] = [];
  for (const { item } of hits) {
    const key = JSON.stringify([item.unit, item.sectionId]);
    if (item.kind === '正文' && seen.has(key)) continue;
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

/** 第一行显示章名与 H2，独立的小字号第二行显示 H3；无 H3 时省略。 */
export function outlineResultPath(item: SearchIndexItem): { heading: string; subheading: string | null } {
  const chapter = item.unit ? item.unitTitle : '首页';
  const section = item.parentSectionTitle || item.sectionTitle;
  const heading = section && section !== chapter ? chapter + ' · ' + section : chapter;
  const subheading = item.parentSectionTitle && item.sectionTitle && item.sectionTitle !== section
    ? item.sectionTitle : null;
  return { heading, subheading };
}

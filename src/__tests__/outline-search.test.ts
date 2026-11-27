import { describe, expect, it } from 'vitest';
import type { DeckData } from '../content/types';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex, findSearchResults, searchSnippet } from '../lib/outlineSearch';

describe('讲义正文搜索', () => {
  const deck: DeckData = {
    id: 'ch1', no: '第1章', title: '网络', subtitle: '', lede: '',
    toc: [{ id: 'intro', text: '概述', level: 2 }, { id: 'protocol', text: '协议', level: 3 }],
    sections: [{ id: 'intro', heading: '概述', blocks: [
      { type: 'html', html: '<p>网络<strong>资源</strong>共享 &amp; 通信</p><h3 id="protocol">协议</h3><p>滑动窗口</p><table><tr><td>超时</td><td>重传</td></tr></table><script>不可搜索</script>' },
      { type: 'html', html: '<p>后续正文</p>' },
    ] }],
  };
  const items: SearchIndexItem[] = [];
  appendOutlineIndex(items, deck);

  it('搜索正文、跨行内标签的词、HTML 实体和表格，并定位最近的目录锚点', () => {
    expect(findSearchResults(items, '资源共享')[0]?.sectionId).toBe('intro');
    expect(findSearchResults(items, '&')[0]?.sectionId).toBe('intro');
    expect(findSearchResults(items, '滑动窗口')[0]).toMatchObject({ sectionId: 'protocol', sectionTitle: '协议' });
    expect(findSearchResults(items, '超时 重传')[0]?.sectionId).toBe('protocol');
    expect(findSearchResults(items, '后续正文')[0]?.sectionId).toBe('protocol');
    expect(findSearchResults(items, '不可搜索')).toEqual([]);
  });

  it('标题优先，正文不遮蔽后面的标题命中，避免同锚点重复', () => {
    const body = Array.from({ length: 450 }, (_, i): SearchIndexItem => ({ kind: '正文', unit: 'ch1', unitTitle: '网络', sectionId: String(i), text: '滑动窗口' }));
    const title: SearchIndexItem = { kind: '章节', unit: 'ch1', unitTitle: '网络', sectionId: '1', text: '滑动窗口' };
    const results = findSearchResults([...body, title], '滑动窗口');
    expect(results[0]).toBe(title);
    expect(results.filter(r => r.sectionId === '1')).toHaveLength(1);
    expect(results).toHaveLength(12);
  });

  it('长正文摘要包含实际命中词', () => {
    const snippet = searchSnippet('前文'.repeat(100) + 'CRC' + '后文'.repeat(100), 'crc');
    expect(snippet).toContain('CRC');
    expect(snippet.indexOf('CRC')).toBeLessThanOrEqual(13);
    expect(snippet.length).toBeLessThanOrEqual(55);
  });
});

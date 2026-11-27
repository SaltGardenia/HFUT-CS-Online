import { describe, expect, it } from 'vitest';
import type { DeckData } from '../content/types';
import type { SearchIndexItem } from '../components/SearchBox';
import { appendOutlineIndex, appendPaperIndex, findSearchResults, searchSnippet, outlineResultPath, currentSearchUnit, chapterReadingStatus } from '../lib/outlineSearch';

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
    expect(findSearchResults(items, '滑动窗口')[0]).toMatchObject({ sectionId: 'protocol', sectionTitle: '协议', parentSectionTitle: '概述' });
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

  it('当前章节整体优先，其余章节保持标题优先和原有顺序', () => {
    const hit = (unit: string, sectionId: string, kind: SearchIndexItem['kind'], text = '流量控制'): SearchIndexItem =>
      ({ unit, sectionId, kind, text, unitTitle: unit });
    const entries = [
      hit('ch1', 'a', '章节'),
      hit('ch2', 'b', '正文'),
      hit('ch3', 'c', '正文'),
      hit('ch3', 'd', '章节', '关于流量控制'),
      hit('ch4', 'e', '章节', '关于流量控制'),
      hit('ch4', 'f', '正文'),
      hit('ch3', 'd', '正文'),
    ];
    expect(findSearchResults(entries, '流量控制', 12, 'ch3').map(r => r.sectionId))
      .toEqual(['d', 'c', 'a', 'e', 'b', 'f']);
    expect(findSearchResults(entries, '流量控制').map(r => r.sectionId))
      .toEqual(['a', 'd', 'e', 'b', 'c', 'f']);
    expect(findSearchResults(entries, '流量控制', 2, 'ch3').map(r => r.sectionId))
      .toEqual(['d', 'c']);
  });

  it('识别两种课程章节路由，非讲义页面不设置当前章', () => {
    expect(currentSearchUnit('/net/deck/ch3')).toBe('ch3');
    expect(currentSearchUnit('/os/chapter/ch3/')).toBe('ch3');
    expect(currentSearchUnit('/algo/deck/deck2')).toBe('deck2');
    expect(currentSearchUnit('/net')).toBeUndefined();
    expect(currentSearchUnit('/net/practice/ch3')).toBeUndefined();
    expect(currentSearchUnit('/net/attachments')).toBeUndefined();
  });

  it('按实际章节路由复用阅读进度，不把首页或试卷标为未读', () => {
    const item = findSearchResults(items, '滑动窗口')[0];
    const reading = { '/net/deck/ch1': { c: 'net', y: 300, p: 0.35, t: 1 } };
    expect(chapterReadingStatus(item, '/net/deck/ch1?s=protocol', reading)).toEqual({ read: true, percent: 35 });
    expect(chapterReadingStatus(item, '/os/chapter/ch1?s=protocol', reading)).toEqual({ read: false, percent: 0 });
    expect(chapterReadingStatus({ ...item, kind: '章节' }, '/net/deck/ch1?view=supplement&s=other', reading)).toEqual({ read: true, percent: 35 });
    expect(chapterReadingStatus({ ...item, unit: null }, '/net/?s=home', reading)).toBeNull();
    expect(chapterReadingStatus({ ...item, kind: '试卷' }, '/net/practice/ch1', reading)).toBeNull();
  });

  it('正文路径分别提供章名、二级标题和可选的三级标题', () => {
    expect(outlineResultPath(findSearchResults(items, '滑动窗口')[0])).toEqual({ chapter: '网络', heading: '概述', subheading: '协议' });
    expect(outlineResultPath(findSearchResults(items, '资源共享')[0])).toEqual({ chapter: '网络', heading: '概述', subheading: null });
  });

  it('长正文摘要包含实际命中词', () => {
    const snippet = searchSnippet('前文'.repeat(100) + 'CRC' + '后文'.repeat(100), 'crc');
    expect(snippet).toContain('CRC');
    expect(snippet.indexOf('CRC')).toBeLessThanOrEqual(13);
    expect(snippet.length).toBeLessThanOrEqual(55);
  });
});

describe('试题检索', () => {
  const papers = [
    {
      id: 'ac2022',
      title: '2022 年 A 卷',
      sections: [
        { questionIds: ['p1-s1'], short: '单选' },
        { questionIds: ['p1-s2'], short: '判断' },
        { questionIds: ['p1-f14'] },
      ],
      questions: [
        { id: 'p1-s1', kind: 'single', question: '<p>银行家算法用于<strong>避免死锁</strong></p>', options: ['<p>预防死锁</p>', '<p>避免死锁</p>'], answer: 'B', explanation: '<p>银行家算法属于死锁<b>避免</b>策略</p>' },
        { id: 'p1-s2', kind: 'judge', question: '<p>进程一直等待输入</p>', options: ['对', '错'], answer: '错', explanation: '' },
        { id: 'p1-f14', kind: 'fill', question: '<p>虚存页面置换算法？</p>', answer: 'LRU' },
      ],
    },
  ];
  const items: SearchIndexItem[] = [];
  appendPaperIndex(items, papers);

  it('题干、选项、解析整段可检索，判断题不含选项与答案', () => {
    expect(findSearchResults(items, '银行家算法')).toHaveLength(1);
    expect(findSearchResults(items, '避免死锁')).toHaveLength(1);
    expect(findSearchResults(items, '预防死锁')).toHaveLength(1);
    expect(findSearchResults(items, 'LRU')).toHaveLength(1);
    // 判断题的选项/答案不入索引；题干其它内容仍可命中
    expect(findSearchResults(items, '一直等待')).toHaveLength(1);
    expect(findSearchResults(items, '错')).toEqual([]);
  });

  it('条目带试卷名、题目 id 与题号标签，题号尽量与练习页一致', () => {
    const [single, judge, fill] = items;
    expect(single).toMatchObject({ kind: '题目', unit: null, unitTitle: '2022 年 A 卷', sectionId: 'ac2022', questionId: 'p1-s1', sectionTitle: '单选 1' });
    expect(judge.sectionTitle).toBe('判断 2');
    expect(fill.sectionTitle).toBe('填空 14');
  });

  it('无大题结构时按全卷顺序编号', () => {
    const flat: SearchIndexItem[] = [];
    appendPaperIndex(flat, [{ id: 'pat', title: '省赛卷', questions: [
      { id: 'q1', title: ' STL ', question: '<p>sort 排序</p>' },
      { id: 'q2', title: '搜索', question: '<p>BFS 剪枝</p>' },
    ] }]);
    expect(flat.map((i) => i.sectionTitle)).toEqual(['第 1 题', '第 2 题']);
    expect(flat[0].text).toContain('STL');
    expect(flat[0].text).toContain('sort');
  });

  it('标题优先于试题；同卷不同题互不去重', () => {
    const title: SearchIndexItem = { kind: '章节', unit: 'ch1', unitTitle: '操作系统', sectionId: 'deadlock', text: '银行家算法' };
    const results = findSearchResults([title, ...items], '银行家算法');
    expect(results[0]).toBe(title);
    expect(results.filter((r) => r.questionId === 'p1-s1')).toHaveLength(1);
    // 大题短名参与题号：与练习页「单选 3」文案对齐
    const seq: SearchIndexItem[] = [];
    appendPaperIndex(seq, [{ id: 'net', title: '2024 卷', sections: [{ questionIds: ['p3-s1', 'p3-s2'], short: '单选' }], questions: [
      { id: 'p3-s1', kind: 'single', question: '<p>集线器工作在</p>' },
      { id: 'p3-s2', kind: 'single', question: '<p>交换机工作在</p>' },
    ] }]);
    expect(seq[1].sectionTitle).toBe('单选 2');
  });

  it('试题命中按试卷名 + 题号两行渲染', () => {
    expect(outlineResultPath(items[0])).toEqual({ chapter: '2022 年 A 卷', heading: '单选 1', subheading: null });
  });
});

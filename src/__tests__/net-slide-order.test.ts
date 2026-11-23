/** 按课程课件的实际讲解路径检查章节次序与稳定锚点。 */
import { describe, it, expect } from 'vitest';
import { netChapters } from '../content/net';
import { netDemoPlacements } from '../content/net/enhance';

const REQUIRED_ORDER: Record<number, string[]> = {
  1: ['sec-ch1-history', 'sec-ch1-definition', 'sec-ch1-structure',
    'sec-ch1-internet', 'sec-ch1-work', 'sec-ch1-topology',
    'sec-ch1-classify', 'sec-ch1-performance', 'sec-ch1-trend'],
  2: ['sec-ch2-protocol', 'sec-ch2-idea', 'sec-ch2-arch', 'sec-ch2-osi', 'sec-ch2-tcpip'],
  3: ['sec-ch3-basic', 'sec-ch3-process', 'sec-ch3-media', 'sec-ch3-mode',
    'sec-ch3-mux', 'sec-ch3-digital', 'sec-ch3-switch', 'sec-ch3-vc',
    'sec-ch3-phy', 'sec-ch3-access'],
  4: ['sec-ch4-basic', 'sec-ch4-frame', 'sec-ch4-error', 'sec-ch4-flow', 'sec-ch4-p2p'],
  5: ['sec-ch5-lan-basic', 'sec-ch5-broadcast', 'sec-ch5-lan-current',
    'sec-ch5-mac', 'sec-ch5-expand', 'sec-ch5-vlan',
    'sec-ch5-evolve', 'sec-ch5-lan-gigabit'],
  6: ['sec-ch6-vc', 'sec-ch6-ip', 'sec-ch6-arp', 'sec-ch6-icmp',
    'sec-ch6-routing', 'sec-ch6-protocol', 'sec-ch6-switch'],
  7: ['sec-ch7-overview', 'sec-ch7-udp', 'sec-ch7-tcp', 'sec-ch7-reliable',
    'sec-ch7-tcp-header', 'sec-ch7-impl', 'sec-ch7-flow',
    'sec-ch7-tcp-connection', 'sec-ch7-congestion'],
  8: ['sec-ch8-overview', 'sec-ch8-dns', 'sec-ch8-ftp',
    'sec-ch8-http', 'sec-ch8-email'],
};

const allHtml = (chapterNo: number) => netChapters[chapterNo - 1].sections
  .flatMap((section) => section.blocks)
  .filter((block) => block.type === 'html')
  .map((block) => block.html).join('\n');

describe('2025 版计算机网络课件顺序', () => {
  for (const [number, ids] of Object.entries(REQUIRED_ORDER)) {
    const chapterNo = Number(number);
    it('第' + chapterNo + '章的正文、目录、章节锚点顺序一致', () => {
      const chapter = netChapters[chapterNo - 1];
      expect(chapter.sections.map((section) => section.id)).toEqual(ids);
      const sectionOrder = chapter.toc.filter((entry) => entry.level === 2 && !entry.id.endsWith('-homework'));
      expect(sectionOrder.map((item) => item.id)).toEqual(ids);
      const tocIds = chapter.toc.map((item) => item.id);
      expect(new Set(tocIds).size).toBe(tocIds.length);
      const homework = tocIds.indexOf('sec-ch' + chapterNo + '-homework');
      expect(homework).toBeGreaterThan(tocIds.indexOf(ids[ids.length - 1]));
    });
  }

  it('八章的正文标题和目录都使用章内连续的普通数字序号', () => {
    for (const chapter of netChapters) {
      let expected = 0;
      for (const section of chapter.sections) {
        const toc = chapter.toc.find((entry) => entry.id === section.id);
        expect(toc?.text).toBe(section.heading);
        if (section.heading.startsWith('拓展：')) {
          expect(section.heading).not.toMatch(/^\d/);
          continue;
        }
        expect(section.heading).toMatch(new RegExp(`^${++expected}\\. `));
        expect(section.heading).not.toMatch(/^\d+\.\d+/);
      }
    }
  });

  it('第1章路由器的功能严格采用课件中的分组交换与分组转发表述', () => {
    const chapter = netChapters[0];
    const router = chapter.sections.find((section) => section.id === 'sec-ch1-work');
    const html = router?.blocks
      .filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    expect(html).toContain('实现<strong>分组交换</strong>（packet switching）的关键构件');
    expect(html).toContain('转发收到的分组');
    expect(html).toContain('<strong>分组</strong>（packet）');
    expect(html).not.toContain('其主要功能是<strong>数据交换</strong>');
    expect(chapter.toc.find((entry) => entry.id === 'sec-ch1-work-h2')?.text)
      .toBe('网络核心中的路由器与分组交换');
  });

  it('第1章拓扑结构保留课件中点、线抽象及拓扑定义', () => {
    const chapter = netChapters[0];
    const section = chapter.sections.find((item) => item.id === 'sec-ch1-topology');
    const html = section?.blocks
      .filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    expect(html).toContain('服务器、工作站等网络单元抽象为“点”');
    expect(html).toContain('电缆、双绞线等传输介质抽象为“线”');
    expect(html).toContain('通信线路和结点相互连接的几何排列方法和模式');
    expect(html.indexOf('服务器、工作站等网络单元抽象为“点”'))
      .toBeLessThan(html.indexOf('<table class="tbl">'));
    expect(chapter.toc.some((item) => item.id === 'sec-ch1-classify-h2')).toBe(true);
  });

  it('第1章五类拓扑都有课件顺序的独立展开，而不只是比较表格', () => {
    const chapter = netChapters[0];
    const section = chapter.sections.find((item) => item.id === 'sec-ch1-topology');
    const html = section?.blocks
      .filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    const titles = [
      '总线型拓扑结构', '星型拓扑结构', '树型拓扑结构',
      '环型拓扑结构', '网状型拓扑结构',
    ];
    const positions = titles.map((title) => html.indexOf('<h4>' + title + '</h4>'));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
    expect(html).toContain('共享一根传输总线');
    expect(html).toContain('中央结点');
    expect(html).toContain('由根结点和各级分支结点构成');
    expect(html).toContain('两个相邻结点');
    expect(html).toContain('需要路由选择和流量控制功能');
    expect(html.indexOf('<h4>五种拓扑结构对照速览</h4>'))
      .toBeGreaterThan(positions[positions.length - 1]);
    expect(html).toContain('不限定使用令牌协议');
  });

  it('第1章中网络组成、拓扑、交换分类与性能指标顺序严格按课件', () => {
    const html = allHtml(1);
    const structure = netChapters[0].sections.find((section) => section.id === 'sec-ch1-structure');
    const topology = netChapters[0].sections.find((section) => section.id === 'sec-ch1-topology');
    const classification = netChapters[0].sections.find((section) => section.id === 'sec-ch1-classify');
    expect(structure?.blocks.some((block) => block.type === 'html' && block.html.includes('资源子网与通信子网'))).toBe(true);
    expect(topology?.blocks.some((block) => block.type === 'html' && block.html.includes('按拓扑结构分类'))).toBe(true);
    expect(classification?.blocks.some((block) => block.type === 'html' &&
      block.html.includes('电路交换') && block.html.includes('按地理范围分类'))).toBe(true);
    expect(html).toContain('分组丢失率');
  });

  it('第3章编码调制与数据传输三种方向按幻灯片内部顺序出现', () => {
    const html = allHtml(3);
    const ordered = [
      'sec-ch3-process-h2', 'sec-ch3-process-h3', 'sec-ch3-process-h1',
      'sec-ch3-mode-h3', 'sec-ch3-mode-h1', 'sec-ch3-mode-h2',
    ];
    const positions = ordered.map((id) => html.indexOf('id="' + id + '"'));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  });

  it('第5章 CSMA/CD、传统以太网、利用率、MAC、扩展、VLAN 和高速以太网依次出现', () => {
    const html = allHtml(5);
    const anchors = ['sec-ch5-broadcast-h2', 'sec-ch5-broadcast-h3', 'sec-ch5-lan-current-h1',
      'sec-ch5-broadcast-h4', 'sec-ch5-broadcast-h5', '四、虚拟局域网 VLAN', '快速以太网'];
    const positions = anchors.map((x) => html.indexOf(x));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  });

  it('第7章先理解可靠传输和首部，再学习流量控制与连接管理', () => {
    const html = allHtml(7);
    const ids = ['sec-ch7-tcp-h1', 'sec-ch7-reliable-h1', 'sec-ch7-tcp-h2',
      'sec-ch7-flow-h1', 'sec-ch7-tcp-h3', 'sec-ch7-congestion-h1'];
    const positions = ids.map((id) => html.indexOf('id="' + id + '"'));
    expect(positions.every((pos) => pos >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  });

  it('原有动画所绑定的标题锚点仍在对应章节内', () => {
    for (const demo of netDemoPlacements) {
      const chapter = netChapters[demo.chapter - 1];
      const exists = chapter.sections.some((section) =>
        section.id === demo.anchor ||
        section.blocks.some((block) => block.type === 'html' && block.html.includes('id="' + demo.anchor + '"')));
      expect(exists, demo.name + ' 的原锚点丢失').toBe(true);
    }
  });
});

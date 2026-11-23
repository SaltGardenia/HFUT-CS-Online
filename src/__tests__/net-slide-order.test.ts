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

  it('第1章在分组交换前保留课件的计算机数据传输特点与选型结论', () => {
    const chapter = netChapters[0];
    // 对齐 PPT 顺序后，交换技术位于“网络分类”节，而非原“网络运行”节。
    const switching = chapter.sections.find((section) => section.id === 'sec-ch1-classify');
    const html = switching?.blocks
      .filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    const intro = html.indexOf('<h4>计算机数据传输的特点</h4>');
    const packet = html.indexOf('<h4>分组交换技术：三个核心思想</h4>');
    const message = html.indexOf('报文交换的主要特点');
    expect(message).toBeGreaterThanOrEqual(0);
    expect(intro).toBeGreaterThan(message);
    expect(packet).toBeGreaterThan(intro);
    expect(html).toContain('<strong>突发性：</strong>计算机数据是突发性地出现在传输线路上');
    expect(html).toContain('<strong>复杂性：</strong>可能是一对一通信，但也可能是一对多通信');
    expect(html).toContain('计算机网络使用分组交换技术');
    expect(html).toContain('<strong>注意：</strong>上述结论');
  });

  it('第1章分组交换首先突出课件中的三项核心思想与宏观资源共享', () => {
    const section = netChapters[0].sections.find((item) => item.id === 'sec-ch1-classify');
    const html = section?.blocks
      .filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    const heading = html.indexOf('分组交换技术：三个核心思想');
    const groups = [
      '<strong>分组：</strong>',
      '<strong>存储转发：</strong>',
      '<strong>资源共享：</strong>',
    ].map((phrase) => html.indexOf(phrase));
    expect(heading).toBeGreaterThanOrEqual(0);
    expect(groups.every((pos) => pos > heading)).toBe(true);
    for (let i = 1; i < groups.length; i++) {
      expect(groups[i]).toBeGreaterThan(groups[i - 1]);
    }
    expect(html).toContain('核心思想是：分组、存储转发、资源共享');
    expect(html).toContain('先存储到缓存中');
    expect(html).toContain('排队等待处理');
    expect(html).toContain('最后选择输出链路转发出去');
    expect(html).toContain('多个用户可以共享一段链路');
    expect(html).toContain('一个时刻只能一个用户占有链路，因此资源共享是宏观的');
    expect(html.indexOf('计算机数据传输的特点')).toBeLessThan(heading);
  });

  it('第1章按 LAN、MAN、WAN、AN 顺序展开覆盖范围、特点和网络层次', () => {
    const chapter = netChapters[0];
    const coverage = chapter.sections.find((s) => s.id === 'sec-ch1-classify');
    const html = coverage?.blocks
      .filter((b) => b.type === 'html')
      .map((b) => b.html).join('\\n') ?? '';
    const ids = [
      'sec-ch1-classify-lan', 'sec-ch1-classify-man',
      'sec-ch1-classify-wan', 'sec-ch1-classify-an',
    ];
    const positions = ids.map((id) => html.indexOf('id="' + id + '"'));
    expect(positions.every((p) => p >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    for (const id of ids) expect(chapter.toc.some((t) => t.id === id)).toBe(true);
    expect(html).toContain('10 Mb/s～10 Gb/s');
    expect(html).toContain('通信时延短，可靠性较高');
    expect(html).toContain('传统局域网常采用');
    expect(html).toContain('城域网是局域网的延伸');
    expect(html).toContain('数百公里到数千公里，甚至上万公里');
    expect(html).toContain('接入网 AN → 城域网 MAN → 广域网 WAN');
    expect(html).toContain('三者的界限逐渐模糊');
    expect(html.indexOf('按覆盖范围分类速览')).toBeGreaterThan(positions[3]);
  });

  it('第1章知识点正文不再使用课件叙述性开场白', () => {
    const html = netChapters[0].sections.flatMap((s) => s.blocks)
      .filter((b) => b.type === 'html').map((b) => b.html).join('\\n');
    expect(html).not.toMatch(/课件(?:明确指出|表述为|指出|强调|概括为)/);
  });

  it('第1章速率区分通信的十进制单位与存储容量的二进制单位', () => {
    const section = netChapters[0].sections.find((item) => item.id === 'sec-ch1-performance');
    const html = section?.blocks.filter((block) => block.type === 'html')
      .map((block) => block.html).join('\\n') ?? '';
    expect(html).toContain('通信领域：速率使用十进制单位');
    expect(html).toContain('计算机领域：存储容量常使用二进制单位');
    for (const factor of ['10<sup>3</sup>', '10<sup>6</sup>', '10<sup>9</sup>', '10<sup>12</sup>']) {
      expect(html).toContain(factor);
    }
    for (const factor of ['2<sup>10</sup>', '2<sup>20</sup>', '2<sup>30</sup>', '2<sup>40</sup>']) {
      expect(html).toContain(factor);
    }
    expect(html).toContain('1 B = 8 bit');
    expect(html).toContain('4 × 10<sup>10</sup> bit/s');
    expect(html).toContain('40 Gbit/s');
    expect(html).toContain('12.5 MB/s');
    expect(html).toContain('11.92 MiB/s');
    expect(html).toContain('不是 100 MB/s');
    expect(html.indexOf('通信领域：速率使用十进制单位'))
      .toBeLessThan(html.indexOf('<strong>带宽</strong>'));
  });

  it('第1章性能指标按吞吐量、时延、丢包率、BDP、RTT、利用率逐项展开', () => {
    const chapter = netChapters[0];
    const section = chapter.sections.find((x) => x.id === 'sec-ch1-performance');
    const html = section?.blocks.filter((x) => x.type === 'html').map((x) => x.html).join('\\n') ?? '';
    const ids = ['sec-ch1-performance-throughput', 'sec-ch1-performance-h2',
      'sec-ch1-performance-loss', 'sec-ch1-performance-bdp',
      'sec-ch1-performance-rtt', 'sec-ch1-performance-h3'];
    const positions = ids.map((id) => html.indexOf('id="' + id + '"'));
    expect(positions.every((p) => p >= 0)).toBe(true);
    for (let i = 1; i < positions.length; i++) expect(positions[i]).toBeGreaterThan(positions[i-1]);
    for (const id of ids) expect(chapter.toc.some((item) => item.id === id)).toBe(true);

    for (const term of [
      '实际通过的数据量 ÷ 测量时间', '甚至下降到零',
      '每秒传送的字节数（B/s）或帧数（帧/s）',
      '128 ÷ 2 = 64 Mbit/s = 8 MB/s',
      '分析首部、提取数据、差错检验、查找路由或转发表',
      '输入或输出队列', '2.3 × 10<sup>5</sup> km/s',
      '2.0 × 10<sup>5</sup> km/s', '收费站每 5 s',
      '83.3 m', '分组丢失率 = 丢失的分组数',
      '接口丢包率、结点丢包率、链路丢包率',
      '250 kB ≈ 244.14 KiB', 'RTT ≈ 2 × 单程传播时延',
      '全网络各信道利用率的', 'D = D<sub>0</sub> / (1 &minus; U)',
      '20D<sub>0</sub>', '性能指标速查：一眼区分考点',
    ]) expect(html, '遗漏：' + term).toContain(term);
    expect(html).not.toMatch(/课件(?:明确指出|表述为|指出|强调)/);
  });

  it('第1章中网络组成、拓扑、交换分类与性能指标顺序严格按课件', () => {
    const html = allHtml(1);
    const structure = netChapters[0].sections.find((section) => section.id === 'sec-ch1-structure');
    const topology = netChapters[0].sections.find((section) => section.id === 'sec-ch1-topology');
    const classification = netChapters[0].sections.find((section) => section.id === 'sec-ch1-classify');
    expect(structure?.blocks.some((block) => block.type === 'html' && block.html.includes('资源子网与通信子网'))).toBe(true);
    expect(topology?.blocks.some((block) => block.type === 'html' && block.html.includes('按拓扑结构分类'))).toBe(true);
    expect(classification?.blocks.some((block) => block.type === 'html' &&
      block.html.includes('电路交换') && block.html.includes('按覆盖范围分类'))).toBe(true);
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

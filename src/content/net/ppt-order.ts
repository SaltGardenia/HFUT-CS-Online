/** 将网络复习手册的阅读顺序调整为 2025 年课程课件的讲授顺序。
 * 只移动知识单元，不修改已有知识解释和稳定锚点；原先单列的拓展仍然保留。
 * 此处理发生在图示、交互演示、作业插入之前，确保所有后续增强跟随内容移动。
 */
import type { DeckData, Section, TocEntry } from './types';

const contents = (section: Section): string =>
  section.blocks.filter((block) => block.type === 'html')
    .map((block) => block.html).join('\n');

function fromHtml(id: string, heading: string, html: string): Section {
  return { id, heading, blocks: [{ type: 'html', html }] };
}

function copyWithHtml(section: Section, html: string, heading = section.heading): Section {
  const htmlBlocks = section.blocks.filter((block) => block.type === 'html');
  if (htmlBlocks.length !== section.blocks.length || htmlBlocks.length !== 1)
    throw new Error('无法安全重排非纯 HTML 章节：' + section.id);
  return fromHtml(section.id, heading, html);
}

function sectionOf(chapter: DeckData, id: string): Section {
  const section = chapter.sections.find((item) => item.id === id);
  if (!section) throw new Error('PPT 顺序核对失败，缺少知识单元：' + id);
  return section;
}

function cut(html: string, marker: string): [string, string] {
  const index = html.indexOf(marker);
  if (index < 0 || html.indexOf(marker, index + marker.length) >= 0)
    throw new Error('PPT 顺序核对失败，找不到唯一分界：' + marker);
  return [html.slice(0, index), html.slice(index)];
}

function rename(chapter: DeckData, sections: Section[]): DeckData {
  // 目录与正文由同一排序生成；子标题仍使用原有 ID，练习题和动画锚点不变。
  const original = chapter.toc.filter((entry) => entry.level === 3);
  const toc: TocEntry[] = [];
  const seen = new Set<string>();
  for (const section of sections) {
    toc.push({ id: section.id, text: section.heading, level: 2 });
    seen.add(section.id);
    const html = contents(section);
    const children = original
      .map((entry) => ({ entry, pos: html.indexOf('id="' + entry.id + '"') }))
      .filter((value) => value.pos >= 0)
      .sort((a, b) => a.pos - b.pos);
    for (const child of children) {
      if (seen.has(child.entry.id))
        throw new Error('重复知识点锚点：' + child.entry.id);
      toc.push(child.entry);
      seen.add(child.entry.id);
    }
  }
  const missing = chapter.toc.filter((entry) => !seen.has(entry.id));
  if (missing.length) throw new Error('移动正文时遗漏目录锚点：' + missing.map((entry) => entry.id).join(', '));
  return { ...chapter, toc, sections };
}

function chapter1(chapter: DeckData): DeckData {
  const history = sectionOf(chapter, 'sec-ch1-history');
  const definition = sectionOf(chapter, 'sec-ch1-definition');
  const originalClass = sectionOf(chapter, 'sec-ch1-classify');
  const originalWork = sectionOf(chapter, 'sec-ch1-work');
  const [coverage, topology] = cut(contents(originalClass), '<h3 id="sec-ch1-classify-h2">');
  const [networkWork, switching] = cut(contents(originalWork), '<h3 id="sec-ch1-work-h3">');
  const structure = fromHtml('sec-ch1-structure', '1.2 计算机网络的结构组成',
    '<h3>网络的硬件与软件组成</h3>' +
    '<p>计算机网络由网络硬件和网络软件两部分组成。硬件包括主机、工作站、终端、' +
    '交换机、路由器、通信线路以及 Modem 等信号变换设备；' +
    '网络软件包括网络操作系统、通信软件、网络管理软件、网络协议软件和网络应用软件。</p>' +
    '<h3>资源子网与通信子网</h3>' +
    '<p>从逻辑结构看，计算机网络可划分为<strong>资源子网</strong>和<strong>通信子网</strong>：' +
    '资源子网主要由主机及其资源构成，负责信息处理和资源共享；' +
    '通信子网由通信控制设备和通信链路等构成，负责数据传输、交换及通信处理。</p>');
  const classificationIntro =
    '<p>网络可以按交换技术、地理范围、传输介质、拓扑结构、通信方式及管理范围等不同标准分类。' +
    '这些分类维度可以同时适用于同一张网络。</p>' +
    '<table class="tbl"><thead><tr><th>分类依据</th><th>典型类别</th></tr></thead><tbody>' +
    '<tr><td>交换技术</td><td>电路交换网、报文交换网、分组交换网</td></tr>' +
    '<tr><td>覆盖范围</td><td>局域网 LAN、城域网 MAN、广域网 WAN</td></tr>' +
    '<tr><td>传输介质</td><td>有线网、无线网</td></tr>' +
    '<tr><td>信号频带占用</td><td>基带网、宽带网</td></tr>' +
    '<tr><td>拓扑结构</td><td>总线型、星型、树型、环型、网状型</td></tr>' +
    '<tr><td>通信方式</td><td>点对点传输网络、广播式传输网络</td></tr>' +
    '<tr><td>管理与使用范围</td><td>内部网、内联网、外联网等</td></tr></tbody></table>';
  const sections: Section[] = [
    copyWithHtml(history, contents(history), '1.1.1 计算机网络的形成与发展'),
    copyWithHtml(definition, contents(definition), '1.1.2 定义与 1.1.3 主要功能'),
    structure,
    copyWithHtml(sectionOf(chapter, 'sec-ch1-internet'),
      contents(sectionOf(chapter, 'sec-ch1-internet')), '1.2.1 因特网概述'),
    copyWithHtml(originalWork, networkWork, '1.2.2 网络边缘与网络核心'),
    fromHtml('sec-ch1-topology', '1.3 网络的拓扑结构', topology),
    copyWithHtml(originalClass, classificationIntro + switching + coverage, '1.4 计算机网络的分类'),
    copyWithHtml(sectionOf(chapter, 'sec-ch1-performance'),
      contents(sectionOf(chapter, 'sec-ch1-performance')), '1.5 计算机网络的性能指标'),
    copyWithHtml(sectionOf(chapter, 'sec-ch1-trend'),
      contents(sectionOf(chapter, 'sec-ch1-trend')), '拓展：计算机网络的发展趋势'),
  ];
  return rename(chapter, sections);
}

function chapter2(chapter: DeckData): DeckData {
  const spec: [string, string][] = [
    ['sec-ch2-protocol', '2.1 网络协议'],
    ['sec-ch2-idea', '2.2 网络体系结构的分层思想'],
    ['sec-ch2-arch', '2.2 网络体系结构与服务'],
    ['sec-ch2-osi', '2.3 OSI 参考模型'],
    ['sec-ch2-tcpip', '2.4 TCP/IP 参考模型'],
  ];
  return rename(chapter, spec.map(([id, heading]) => {
    const section = sectionOf(chapter, id);
    return copyWithHtml(section, contents(section), heading);
  }));
}

function chapter3(chapter: DeckData, network: DeckData): DeckData {
  const process = sectionOf(chapter, 'sec-ch3-process');
  const [processIntro, processTopics] = cut(contents(process), '<h3 id="sec-ch3-process-h1">');
  const [pcm, lineAndModulation] = cut(processTopics, '<h3 id="sec-ch3-process-h2">');
  const [lineEncoding, modulation] = cut(lineAndModulation, '<h3 id="sec-ch3-process-h3">');
  // 幻灯片先讲数字数据的数字编码，再讲模拟调制，最后讲 PCM。
  const processInSlideOrder = processIntro + lineEncoding + modulation + pcm;
  const mode = sectionOf(chapter, 'sec-ch3-mode');
  const [modeIntro, modeTopics] = cut(contents(mode), '<h3 id="sec-ch3-mode-h1">');
  const [serialParallel, syncAndDirection] = cut(modeTopics, '<h3 id="sec-ch3-mode-h2">');
  const [synchronization, direction] = cut(syncAndDirection, '<h3 id="sec-ch3-mode-h3">');
  // 数据传输方向（单工/半双工/全双工）→ 并/串行 → 同步/异步。
  const modeInSlideOrder = modeIntro + direction + serialParallel + synchronization;
  const mux = sectionOf(chapter, 'sec-ch3-mux');
  const muxHtml = contents(mux);
  const [beforeDigital, digitalAndCodes] = cut(muxHtml, '<h4>准同步数字传输的局限与 SONET / SDH</h4>');
  const [digital, codes] = cut(digitalAndCodes, '<h3 id="sec-ch3-mux-h3">');
  const networkSwitch = sectionOf(network, 'sec-ch5-switch');
  const datagrams = sectionOf(network, 'sec-ch5-vc');
  const sections: Section[] = [
    copyWithHtml(sectionOf(chapter, 'sec-ch3-basic'),
      contents(sectionOf(chapter, 'sec-ch3-basic')), '3.1 数据通信基础与系统模型'),
    copyWithHtml(process, processInSlideOrder, '3.2 数字编码与调制'),
    copyWithHtml(sectionOf(chapter, 'sec-ch3-media'),
      contents(sectionOf(chapter, 'sec-ch3-media')), '3.3 传输介质'),
    copyWithHtml(mode, modeInSlideOrder, '3.4 数据传输方向、方式与同步'),
    copyWithHtml(mux, beforeDigital + codes, '3.5 多路复用技术'),
    fromHtml('sec-ch3-digital', '3.5 数字传输系统与 SONET/SDH', digital),
    fromHtml('sec-ch3-switch', '3.6 交换技术',
      contents(networkSwitch).replaceAll('sec-ch5-', 'sec-ch3-')),
    fromHtml('sec-ch3-vc', '3.6 虚电路与数据报',
      contents(datagrams).replaceAll('sec-ch5-', 'sec-ch3-')),
    copyWithHtml(sectionOf(chapter, 'sec-ch3-phy'),
      contents(sectionOf(chapter, 'sec-ch3-phy')), '3.7 物理层协议'),
    copyWithHtml(sectionOf(chapter, 'sec-ch3-access'),
      contents(sectionOf(chapter, 'sec-ch3-access')), '拓展：宽带接入技术'),
  ];
  return rename(chapter, sections);
}

function chapter4(chapter: DeckData): DeckData {
  return rename(chapter, [
    ['sec-ch4-basic', '4.1 数据链路层基本概念'],
    ['sec-ch4-frame', '4.2 封装成帧与透明传输'],
    ['sec-ch4-error', '4.2 差错检测与控制'],
    ['sec-ch4-flow', '4.3 可靠传输与 ARQ 协议'],
    ['sec-ch4-p2p', '4.4 点对点协议 PPP 与 HDLC'],
  ].map(([id, heading]) => {
    const section = sectionOf(chapter, id);
    return copyWithHtml(section, contents(section), heading);
  }));
}

function chapter5(chapter: DeckData): DeckData {
  const lan = sectionOf(chapter, 'sec-ch5-lan-basic');
  const broadcast = sectionOf(chapter, 'sec-ch5-broadcast');
  const raw = contents(broadcast);
  const [preamble, fromH1] = cut(raw, '<h3 id="sec-ch5-broadcast-h1">');
  const [h1, fromH2] = cut(fromH1, '<h3 id="sec-ch5-broadcast-h2">');
  const [h2, fromH3] = cut(fromH2, '<h3 id="sec-ch5-broadcast-h3">');
  const [traditional, fromH4] = cut(fromH3, '<h3 id="sec-ch5-broadcast-h4">');
  const [frame, fromH5] = cut(fromH4, '<h3 id="sec-ch5-broadcast-h5">');
  const vlanPhrase = '<strong>四、虚拟局域网 VLAN</strong>';
  const vlanPos = fromH5.indexOf(vlanPhrase);
  if (vlanPos < 0) throw new Error('局域网章节缺少 VLAN 内容');
  const vlanParagraph = fromH5.lastIndexOf('<p', vlanPos);
  if (vlanParagraph < 0) throw new Error('局域网章节 VLAN 段落边界未定位');
  const expand = fromH5.slice(0, vlanParagraph);
  const vlan = fromH5.slice(vlanParagraph);
  const current = sectionOf(chapter, 'sec-ch5-lan-current');
  const [utilization, gigabit] = cut(contents(current), '<p><strong>千兆以太网的历史性半双工兼容机制</strong>');
  const sections: Section[] = [
    copyWithHtml(lan, contents(lan) + preamble + h1 + h2, '5.1 局域网概述与 CSMA/CD'),
    copyWithHtml(broadcast, traditional, '5.2 传统以太网'),
    copyWithHtml(current, utilization, '5.2 以太网信道利用率'),
    fromHtml('sec-ch5-mac', '5.3 以太网的 MAC 层与帧', frame),
    fromHtml('sec-ch5-expand', '5.4 扩展的局域网与交换机', expand),
    fromHtml('sec-ch5-vlan', '5.5 虚拟局域网 VLAN', vlan),
    copyWithHtml(sectionOf(chapter, 'sec-ch5-evolve'),
      contents(sectionOf(chapter, 'sec-ch5-evolve')), '5.6 高速以太网'),
    fromHtml('sec-ch5-lan-gigabit', '5.6 千兆以太网半双工兼容机制', gigabit),
  ];
  return rename(chapter, sections);
}

function chapter6(chapter: DeckData): DeckData {
  const spec: [string, string][] = [
    ['sec-ch6-vc', '6.1 网络层的虚电路与数据报服务'],
    ['sec-ch6-ip', '6.2 网际协议 IP 与 IP 地址'],
    ['sec-ch6-arp', '6.3 IP 地址与硬件地址、ARP'],
    ['sec-ch6-icmp', '6.4 网际控制报文协议 ICMP'],
    ['sec-ch6-routing', '6.5 路由选择算法'],
    ['sec-ch6-protocol', '6.6 RIP、OSPF 与 BGP 路由协议'],
    ['sec-ch6-switch', '拓展：网络交换技术'],
  ];
  return rename(chapter, spec.map(([id, heading]) => {
    const section = sectionOf(chapter, id);
    return copyWithHtml(section, contents(section), heading);
  }));
}

function chapter7(chapter: DeckData): DeckData {
  const tcp = sectionOf(chapter, 'sec-ch7-tcp');
  const [overview, headerAndConnection] = cut(contents(tcp), '<h3 id="sec-ch7-tcp-h2">');
  const [header, connection] = cut(headerAndConnection, '<h3 id="sec-ch7-tcp-h3">');
  const specs: [string, string][] = [
    ['sec-ch7-overview', '7.1 传输层概述'],
    ['sec-ch7-udp', '7.2 用户数据报协议 UDP'],
  ];
  const sections: Section[] = specs.map(([id, heading]) => {
    const part = sectionOf(chapter, id);
    return copyWithHtml(part, contents(part), heading);
  });
  sections.push(
    copyWithHtml(tcp, overview, '7.3 TCP 协议的主要特点'),
    copyWithHtml(sectionOf(chapter, 'sec-ch7-reliable'),
      contents(sectionOf(chapter, 'sec-ch7-reliable')), '7.3 可靠传输的工作原理'),
    fromHtml('sec-ch7-tcp-header', '7.3 TCP 报文段的首部', header),
    copyWithHtml(sectionOf(chapter, 'sec-ch7-impl'),
      contents(sectionOf(chapter, 'sec-ch7-impl')), '7.3 TCP 可靠传输的实现'),
    copyWithHtml(sectionOf(chapter, 'sec-ch7-flow'),
      contents(sectionOf(chapter, 'sec-ch7-flow')), '7.3 TCP 流量控制'),
    fromHtml('sec-ch7-tcp-connection', '7.3 TCP 运输连接管理', connection),
    copyWithHtml(sectionOf(chapter, 'sec-ch7-congestion'),
      contents(sectionOf(chapter, 'sec-ch7-congestion')), '7.4 TCP 拥塞控制'),
  );
  return rename(chapter, sections);
}

function chapter8(chapter: DeckData): DeckData {
  const spec: [string, string][] = [
    ['sec-ch8-overview', '8.1 应用层与网络应用'],
    ['sec-ch8-dns', '8.1 域名系统 DNS'],
    ['sec-ch8-ftp', '8.2 文件传送协议 FTP'],
    ['sec-ch8-http', '8.3 万维网 WWW 与 HTTP'],
    ['sec-ch8-email', '拓展：电子邮件协议'],
  ];
  return rename(chapter, spec.map(([id, heading]) => {
    const section = sectionOf(chapter, id);
    return copyWithHtml(section, contents(section), heading);
  }));
}

export function alignNetworkChapterToSlides(chapter: DeckData, chapterNo: number, networkSource: DeckData): DeckData {
  switch (chapterNo) {
    case 1: return chapter1(chapter);
    case 2: return chapter2(chapter);
    case 3: return chapter3(chapter, networkSource);
    case 4: return chapter4(chapter);
    case 5: return chapter5(chapter);
    case 6: return chapter6(chapter);
    case 7: return chapter7(chapter);
    case 8: return chapter8(chapter);
    default: return chapter;
  }
}

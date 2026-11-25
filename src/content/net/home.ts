/* 计算机网络总览：2025 版八章，与旧版七章知识点兼容 */
import type { DeckData, Section } from './types';
import type { ReadingMap } from '../../lib/sync/types';
import { NET_BASE } from '../../courses/registry';
import { netHomework } from './homework';

/** 按 2025 版章节正文顺序归纳；卡片计数直接读取作业数据。 */
const chapterMap = [
  { no: 1, title: '概论', summary: '计算机网络的形成与发展、定义和主要功能；因特网的边缘与核心、C/S 与 P2P、网络拓扑；电路交换、报文交换与分组交换，LAN / MAN / WAN / AN；<strong>速率、带宽、吞吐量、四种时延、时延带宽积及利用率</strong>。' },
  { no: 2, title: '网络结构与协议', summary: '分层思想、体系结构与网络协议；<strong>协议三要素、协议与服务的区别、实体与 SAP</strong>；OSI/RM 七层功能及 PDU、SDU、PCI；TCP/IP 与五层体系结构、封装与解封装及跨网络传输过程。' },
  { no: 3, title: '物理层与数据通信', summary: '通信系统模型、数据与信号、通信性能指标；PCM、NRZ、曼彻斯特编码、ASK / FSK / PSK；双绞线、光纤与无线介质；同步与异步传输、FDM / TDM / STDM / WDM / CDM；交换技术、虚电路和数据报、物理层协议。' },
  { no: 4, title: '数据链路层', summary: '链路层服务与功能、封装成帧、透明传输；差错来源、海明距离与海明码、<strong>CRC 模2除法</strong>；停止等待、连续 ARQ、GBN 与选择重传，滑动窗口及效率计算；HDLC 与 PPP。' },
  { no: 5, title: '局域网', summary: 'IEEE 802、共享信道接入、<strong>CSMA/CD 争用期与二进制指数退避</strong>；以太网信道利用率、MAC 地址和帧格式；集线器、网桥与交换机、自学习转发表、VLAN；高速以太网及载波延伸、分组突发。' },
  { no: 6, title: '网络层', summary: '虚电路与数据报；IPv4 首部、分片、分类地址、<strong>子网划分、VLSM、CIDR 与最长前缀匹配</strong>；IP 与 MAC 地址、ARP、ICMP；距离向量和链路状态算法，RIP 路由表更新、OSPF 与 BGP。' },
  { no: 7, title: '传输层', summary: '进程间通信、端口与复用分用、UDP 与 TCP；可靠传输、TCP 首部与字节序号、滑动窗口、RTT 与超时重传；流量控制、三次握手与四次挥手；<strong>慢开始、拥塞避免、快重传、快恢复</strong>。' },
  { no: 8, title: '应用层', summary: '网络应用及应用层协议体系架构；DNS 域名服务器与解析过程、FTP 控制连接和数据连接；<strong>WWW、URL、HTTP 请求与响应</strong>；HTML 与动态文档、电子邮件 SMTP / POP3 / IMAP。' },
] as const;

/** 阅读进度沿用 ReadingMark 的路径键；只展示最近一次记录，不把滚动百分比当成掌握率。 */
function chapterCards(reading: ReadingMap): string {
  return chapterMap.map(({ no, title, summary }) => {
    const path = `${NET_BASE}/deck/ch${no}`;
    const entry = reading[path];
    const hasProgress = !!entry && Number.isFinite(entry.p);
    const percent = hasProgress ? Math.round(Math.min(1, Math.max(0, entry.p)) * 100) : 0;
    return `
      <a class="card" href="${path}">
        <h3>第 ${no} 章 · ${title}</h3>
        <p>${summary}</p>
        <p class="card-meta">${(netHomework[no] ?? []).length} 道课程作业</p>
        <p style="display:flex;justify-content:space-between;gap:8px;margin:8px 0 5px;font-variant-numeric:tabular-nums">
          <span>${hasProgress ? '上次读到' : '暂无阅读记录'}</span><strong>${percent}%</strong>
        </p>
        <div class="pq-progress-bar" role="progressbar" aria-label="第${no}章阅读位置" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
          <span style="width:${percent}%;background:var(--deck-accent)"></span>
        </div>
      </a>`;
  }).join('');
}

const home: DeckData = {
  id: 'home', no: '', title: '计算机网络 · 2025 课件复习手册', subtitle: '',
  lede: `<p>以<strong>2025 版八章课件</strong>为主线，参考已有章节讲义与课程作业。
  每章正文之后附<strong>课程作业、教师答案整理及完整参考解答</strong>，
  可由题目跳转到知识点、再从知识点返回作业。</p>
  <p>原有页面参考较早的七章目录（局域网合并在链路层）；
  2025 年课件改为<strong>八章</strong>，第五章独立讲局域网。
  两种编排不代表网络协议体系本身发生了变化。</p>`,
  toc: [
    { id: 'sec-net-map', text: '八章内容地图', level: 2 },
    { id: 'sec-net-map-h1', text: '章节内容与作业', level: 3 },
    { id: 'sec-net-map-h2', text: '课件表述与现行实践', level: 3 },
  ],
  sections: buildNetHomeSections(),
};
/** 首页在阅读记录发生变化时重新生成卡片；目录索引使用默认的无记录版本。 */
export function buildNetHomeSections(reading: ReadingMap = {}): Section[] {
  return [{
    id: 'sec-net-map', heading: '八章内容地图', blocks: [{
      type: 'html', html: `
      <div class="callout tip"><p class="callout-h">复习顺序</p>
      <p>先阅读知识点与标出的重点，再做每章末的作业。卡片中的百分比表示上次保存的阅读位置，并非知识掌握程度。
      答案区分别注明<strong>教师答案（整理）</strong>与<strong>补充参考解答</strong>，
      便于区分已给结论和推导解释；2025 课件未布置的题不虚构为教师作业。</p></div>
      <h3 id="sec-net-map-h1">章节内容与作业</h3>
      <div class="card-grid deck-map">${chapterCards(reading)}</div>
      <h3 id="sec-net-map-h2">课件表述与现行实践</h3>
      <p>按照课件复习时注意<strong>适用前提</strong>：例如 CSMA/CD 属于经典半双工共享以太网，
      不应推广至常见的全双工交换式链路；IPv4 分类编址是教学基础，但实际路由以 CIDR
      与最长前缀匹配为主；HTTP/3 在 QUIC 上运行，QUIC 通常使用 UDP，不等同于
      “所有 HTTP 都运行于 TCP”。如遇版本差异，各章用双轨说明。</p>
      `,
    }],
  }];
}

export default home;

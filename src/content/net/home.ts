/* 计算机网络总览：2025 版八章，与旧版七章知识点兼容 */
import type { DeckData, Section } from './types';
import type { ReadingMap } from '../../lib/sync/types';
import { NET_BASE } from '../../courses/registry';
import { netHomework } from './homework';

/** 按 2025 版章节正文顺序归纳；卡片计数直接读取作业数据。 */
const chapterMap = [
  { no: 1, title: '概论', summary: '网络形成与发展、定义、功能、结构、拓扑、分类、交换技术与覆盖范围；<strong>速率、带宽、吞吐量、时延、丢包率、RTT、利用率</strong>。' },
  { no: 2, title: '网络结构与协议', summary: '网络体系结构形成、协议及三要素、分层、服务与接口；<strong>OSI/RM 七层、PDU、五层体系结构及 TCP/IP</strong>。' },
  { no: 3, title: '物理层与数据通信', summary: '通信系统、数字编码、ASK/FSK/PSK、PCM、信道极限容量、传输介质；传输方式与同步；<strong>FDM/TDM、T1/E1、STDM、WDM、SONET/SDH</strong>、交换与物理层协议。' },
  { no: 4, title: '数据链路层', summary: '链路与成帧、透明传输、<strong>CRC 与 FCS</strong>；停止等待、连续 ARQ、GBN/SRP 与窗口；PPP。' },
  { no: 5, title: '局域网', summary: '局域网与 IEEE 802、MAC/LLC、适配器、<strong>CSMA/CD</strong>；传统以太网、利用率、MAC 帧、集线器/网桥/交换机、生成树、VLAN、高速以太网。' },
  { no: 6, title: '网络层', summary: '网络层服务、网际协议 IP 与虚拟互连网络、IP 地址、IP/MAC 与 ARP、首部和分片、转发；<strong>子网划分、CIDR、ICMP、RIP 与 OSPF</strong>。' },
  { no: 7, title: '传输层', summary: '传输层、端口、UDP、TCP 特点与套接字、可靠传输、报文首部、窗口和流量控制、RTT/Karn、连接管理、<strong>拥塞控制</strong>。' },
  { no: 8, title: '应用层', summary: '应用层概述、DNS、FTP、WWW 与 URL、<strong>HTTP 操作、代理服务器、HTTP 报文、Cookie</strong>、网页文档、CGI 与信息检索。' },
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
    { id: 'sec-net-map-h2', text: '拓展与勘误说明', level: 3 },
  ],
  sections: buildNetHomeSections(),
};
/** 首页在阅读记录发生变化时重新生成卡片；目录索引使用默认的无记录版本。 */
export function buildNetHomeSections(reading: ReadingMap = {}): Section[] {
  return [{
    id: 'sec-net-map', heading: '八章内容地图', blocks: [{
      type: 'html', html: `
      <div class="callout tip"><p class="callout-h">复习顺序</p>
      <p>默认进入按课件顺序整理的详细讲义，另可切换查看完整原讲义与拓展；先读主线，再做每章末的作业。卡片中的百分比表示上次保存的阅读位置，并非知识掌握程度。
      答案区分别注明<strong>教师答案（整理）</strong>与<strong>补充参考解答</strong>，
      便于区分已给结论和推导解释；2025 课件未布置的题不虚构为教师作业。</p></div>
      <h3 id="sec-net-map-h1">章节内容与作业</h3>
      <div class="card-grid deck-map">${chapterCards(reading)}</div>
      <h3 id="sec-net-map-h2">拓展与勘误说明</h3>
      <p>按照课件复习时注意<strong>适用前提</strong>：例如 CSMA/CD 属于经典半双工共享以太网，
      不应推广至常见的全双工交换式链路；IPv4 分类编址是教学基础，但实际路由以 CIDR
      与最长前缀匹配为主；HTTP/3 在 QUIC 上运行，QUIC 通常使用 UDP，不等同于
      “所有 HTTP 都运行于 TCP”。如遇版本差异，各章用双轨说明。</p>
      `,
    }],
  }];
}

export default home;

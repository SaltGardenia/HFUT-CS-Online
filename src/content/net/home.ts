/* 计算机网络 · 总目录 —— 依据「课件/PPT-2024」七章的小结与作业整理 */
import type { DeckData } from './types';

const home: DeckData = {
  id: 'home',
  no: '',
  title: '计算机网络 · 复习手册',
  subtitle: '',
  lede: `
  依据课程组 <strong>PPT-2024</strong> 七章课件整理：从概论、体系结构、物理层、数据链路层、网络层、传输层到应用层，
        每章按课件章节结构成页，紧扣课件内容；配合<strong>在线练习</strong>的三套期末试卷自测。
`,
  toc: [
    { id: 'sec-net-map', text: '1. 七章总览', level: 2 },
    { id: 'sec-net-map-h1', text: '章节脉络', level: 3 },
    { id: 'sec-net-map-h2', text: '各章要点与常考题型', level: 3 },
  ],
  sections: [
    {
      id: 'sec-net-map',
      heading: '1. 七章总览',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout tip">
            <p class="callout-h">课件重点速览</p>
            <p>结合荧光笔标记整理：<strong>A 级优先掌握</strong>，<strong>B 级理解记忆</strong>。重点已标在各章对应知识点处。</p>
          </div>

          <h3 id="sec-net-map-h1">章节脉络</h3>
          <p>课程按「体系结构 → 逐层展开」推进，章与章之间的承接关系如下：</p>
          <table class="tbl">
            <thead>
              <tr><th>章</th><th>主题</th><th>在协议栈中的位置</th></tr>
            </thead>
            <tbody>
              <tr><td>第 1 章</td><td>概论</td><td>全局——定义、分类、运行过程与性能指标</td></tr>
              <tr><td>第 2 章</td><td>计算机网络体系结构</td><td>全局——分层思想、协议三要素、OSI 与 TCP/IP 模型</td></tr>
              <tr><td>第 3 章</td><td>物理层</td><td>最底层——比特流的透明传输</td></tr>
              <tr><td>第 4 章</td><td>数据链路层</td><td>帧——封装成帧、透明传输、差错控制与局域网</td></tr>
              <tr><td>第 5 章</td><td>网络层</td><td>分组——路由选择、IP 协议、ICMP、ARP</td></tr>
              <tr><td>第 6 章</td><td>传输层</td><td>端到端——UDP/TCP、可靠传输、流量与拥塞控制</td></tr>
              <tr><td>第 7 章</td><td>应用层</td><td>最高层——DNS、电子邮件、HTTP</td></tr>
            </tbody>
          </table>
          <h3 id="sec-net-map-h2">各章要点与常考题型</h3>
          <table class="tbl">
            <thead>
              <tr><th>章</th><th>重点（课件小结）</th><th>常考题型（课件作业 / 历年卷）</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>第 1 章</td>
                <td>定义、拓扑分类、三种交换技术、性能指标（时延、利用率）</td>
                <td>拓扑结构分类及特点；交换技术比较；分组交换过程；速率/带宽/吞吐量/时延/利用率</td>
              </tr>
              <tr>
                <td>第 2 章</td>
                <td>分层思想；体系结构定义；协议三要素；OSI 七层与 TCP/IP 四层</td>
                <td>协议三要素及其关系；OSI/RM、Internet 模型与五层结构的认识；层次对应关系</td>
              </tr>
              <tr>
                <td>第 3 章</td>
                <td>信道容量与香农公式；传输媒体；信源编码（抽样/量化/编码）；信道编码三种编码；多路复用</td>
                <td>通信系统模型；二进制串的 NRZ/曼彻斯特/差分曼彻斯特编码；复用技术原理与特点</td>
              </tr>
              <tr>
                <td>第 4 章</td>
                <td>三个基本问题；海明码与 CRC；HDLC 与 PPP；CSMA/CD；以太网与交换机、VLAN</td>
                <td>CRC 码计算；CSMA/CD 原理与指数避退；透明传输；HDLC 与 PPP 异同；网桥/交换机隔离冲突域</td>
              </tr>
              <tr>
                <td>第 5 章</td>
                <td>虚电路与数据报；路由算法（D-V、L-S）；RIP/OSPF/BGP；IP 分组格式；子网划分与 CIDR；ICMP、ARP</td>
                <td>IP 首部各字段；子网划分计算；CIDR 地址块；ICMP/ARP 作用与报文结构；tracert 原理</td>
              </tr>
              <tr>
                <td>第 6 章</td>
                <td>端口与 Socket；UDP 特点与校验和；TCP 首部、三次握手/四次挥手；四种计时器；滑动窗口；流量与拥塞控制</td>
                <td>TCP 连接建立与释放；确认号与窗口计算；RTT/RTTs/RTTD 与 RTO；糊涂窗口综合症；慢开始与拥塞避免</td>
              </tr>
              <tr>
                <td>第 7 章</td>
                <td>应用架构（C/S、P2P）；DNS 域名与解析；SMTP/POP3/IMAP；HTTP 报文；HTTP/2 与 HTTP/3</td>
                <td>DNS 解析过程；UDP/TCP 的选择；邮件协议分工；HTTP 特点与状态码；QUIC 核心特性</td>
              </tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
  ],
};

export default home;

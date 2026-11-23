/* 2025 版第5章：把旧版第4章「广播链路与以太网」归入单列的局域网章。 */
import type { NetChapter, Section, TocEntry } from './types';
import oldLink from './ch4';

const replaceAnchor = (value: string) => value.replaceAll('sec-ch4-', 'sec-ch5-');
const oldToc: TocEntry[] = oldLink.toc
  .filter((entry) => /^sec-ch4-(broadcast|evolve)/.test(entry.id))
  .map((entry) => ({
    ...entry,
    id: replaceAnchor(entry.id),
    text: entry.level === 2
      ? entry.text.replace(/^6\./, '2.').replace(/^7\./, '3.')
      : entry.text,
  }));
const oldSections: Section[] = oldLink.sections
  .filter((section) => /^sec-ch4-(broadcast|evolve)/.test(section.id))
  .map((section) => ({
    ...section,
    id: replaceAnchor(section.id),
    heading: section.heading.replace(/^6\./, '2.').replace(/^7\./, '3.'),
    blocks: section.blocks.map((block) =>
      block.type === 'html' ? { ...block, html: replaceAnchor(block.html) } : block,
    ),
  }));

const ch: NetChapter = {
  id: 'ch5',
  no: '第5章',
  title: '局域网',
  subtitle: '第 5 章 · 局域网',
  lede: `<p>局域网由有限范围的站点与通信线路组成，常由单个单位或组织管理。
  本章介绍 IEEE 802 标准、媒体接入控制、以太网与交换机、VLAN，以及高速以太网的演进。</p>`,
  toc: [
    { id: 'sec-ch5-lan-basic', text: '1. 局域网概述与 IEEE 802', level: 2 },
    ...oldToc,
    { id: 'sec-ch5-lan-current', text: '4. 经典共享以太网与高速发展', level: 2 },
    { id: 'sec-ch5-lan-current-h1', text: '信道利用率、载波延伸与分组突发', level: 3 },
  ],
  sections: [
    {
      id: 'sec-ch5-lan-basic',
      heading: '1. 局域网概述与 IEEE 802',
      blocks: [{
        type: 'html',
        html: `
          <h3>局域网的特点与主要优点</h3>
          <p><strong>主要特点：</strong>局域网通常由一个单位或组织拥有并管理，地理范围与站点数目相对有限。</p>
          <p><strong>主要优点：</strong></p>
          <ol>
            <li>传统共享式局域网具有<strong>广播功能</strong>，一个站点发送的数据可方便地传送给同一广播域内的其他站点。</li>
            <li><strong>扩展和演变方便</strong>，可增减站点、调整设备位置并逐步升级。</li>
            <li>通过合理的网络架构和冗余设计，有助于提高系统的<strong>可靠性、可用性和生存性</strong>。</li>
          </ol>
          <p>局域网通常覆盖相对有限的区域。
          <strong>地理范围、传输速率、误码率的具体数值</strong>会随标准和设备演进，
          教材中的典型数值通常用于说明经典网络，不能作为所有现代 LAN 的统一限制。</p>
          <p><strong>IEEE 802</strong> 中，802.3 主要涉及以太网，802.11 涉及无线局域网，
          802.1Q 定义 VLAN 标记等桥接相关机制。传统教材将数据链路层分为
          逻辑链路控制（LLC）与媒体接入控制（MAC）两个子层；
          在当代常见 Ethernet II 与 IP 的组合中，并非每帧都显式采用 IEEE 802.2 LLC 首部。</p>
          <p><strong>共享信道的媒体接入控制：</strong>多个站点共用广播介质时同时发送会发生冲突。
            <strong>静态划分信道</strong>可采用频分、时分、波分、码分等复用方式；
            <strong>动态媒体接入</strong>包括随机接入（如 CSMA/CD）和受控接入（如轮询）。
            这些是共享介质的传统分类；全双工交换式以太网通常不再依靠碰撞检测接入。</p>
          <p>网络接口适配器（NIC）主要承担物理层与链路层的数据发送、接收、帧处理等任务；
          “网卡完全不使用 CPU”不成立：网卡能独立执行许多硬件操作，
          但驱动、中断、协议栈和部分卸载功能仍与主机处理器协作。</p>
        `,
      }],
    },
    ...oldSections,
    {
      id: 'sec-ch5-lan-current',
      heading: '4. 经典共享以太网与高速发展',
      blocks: [{
        type: 'html',
        html: `
          <h3>共享式以太网与交换式以太网</h3>
          <p><strong>半双工共享式以太网：</strong>共享介质的站点用 CSMA/CD 协调访问，
            检测碰撞后采用截断二进制指数退避等机制重传；
            <strong>全双工交换式以太网：</strong>交换机端口到主机的点到点连接通常不再需要 CSMA/CD。</p>
          <p><strong>碰撞域与广播域：</strong>集线器不隔离碰撞域；
            二层交换机的每个端口通常形成独立碰撞域，但同一 VLAN 内仍可能共享广播域。
            路由器或三层转发边界通常用于隔离不同广播域。</p>
          <p><strong>交换机转发表：</strong>交换机根据收到帧的<strong>源 MAC</strong>与入端口进行自学习，
            根据<strong>目的 MAC</strong>决定转发接口。若目的地址未知，通常在所属 VLAN 内
            向除入端口外的其他端口泛洪；如果已知目的地址映射到入端口，则进行过滤。
            动态学习表项有老化时间。</p>
          <h3 id="sec-ch5-lan-current-h1">信道利用率、载波延伸与分组突发</h3>
          <h4>经典共享式以太网：争用期和退避的计算思路</h4>
          <ol>
            <li><strong>争用期：</strong>若端到端单程传播时延为 τ，则碰撞检测窗口为 <strong>2τ</strong>，也就是一次往返传播时延。</li>
            <li><strong>10 Mbit/s 经典以太网：</strong>争用期为 <strong>51.2 μs</strong>，对应 512 bit，即 64 B 的发送时间。</li>
            <li><strong>碰撞后随机退避：</strong>令 k = min(已发生的重传次数, 10)，从 <strong>0 到 2<sup>k</sup>−1</strong> 中随机选择整数 r，等待 <strong>r × 2τ</strong> 后再尝试。</li>
            <li><strong>重试上限：</strong>连续 16 次碰撞仍未发送成功时，停止继续重传并向上层报告。</li>
          </ol>
          <p><strong>例：</strong>第 1 次碰撞，r 只能取 0 或 1；第 2 次碰撞，r 可取 0、1、2、3；
            第 3 次碰撞，可取 0～7。冲突次数越多，等待范围越大，以减少反复碰撞的概率。</p>
          <div class="callout tip">
            <p class="callout-h">适用范围</p>
            <p>这些规则针对采用 <strong>CSMA/CD 的经典半双工共享式以太网</strong>。
              现代全双工交换式以太网没有这种共享碰撞检测过程，不能对所有以太网链路照搬争用期和退避公式。</p>
          </div>
          
          <p>下述信道利用率模型、载波延伸和分组突发主要描述<strong>经典半双工共享式以太网</strong>；
            现代常见的全双工交换式以太网不依靠 CSMA/CD 解决争用。</p>
          <p><strong>信道利用率参数 a</strong>：单程端到端传播时延记为 τ，一帧的发送时延为 T<sub>0</sub> = L/C，
            则 a = τ/T<sub>0</sub>。在这一理想化计算中，不计碰撞、退避、处理及帧间隔等开销，
            成功传完一帧的占用时间约为 T<sub>0</sub> + τ，因此上界为：</p>
          <p class="formula">S<sub>max</sub> = T<sub>0</sub> / (T<sub>0</sub> + τ) = 1 / (1 + a)</p>
          <p>a 越大，传播时延相对发送时延所占的比重越高；实际共享介质还有碰撞和退避，
            信道利用率通常比这个理想上界低。不能将 1/(1+a) 当成一切以太网的精确吞吐量公式。</p>
          <p><strong>千兆以太网的历史性半双工兼容机制</strong>：
            载波延伸（carrier extension）将争用时隙扩展为
            <strong>4096 bit times，即 512 字节时间</strong>；当 MAC 帧不足 512 字节时间时，
            在帧之后添加特殊扩展符号，以满足碰撞检测所需的最短发送时长。
            <strong>以太网 MAC 帧的最短合法长度仍是 64 字节</strong>，不要误记成最短 MAC 帧变为 512 字节。</p>
          <p><strong>分组突发（packet bursting）</strong>：为避免多个短帧各自重复承担载波延伸开销，
            半双工千兆以太网可以在第一次扩展后接续发送多个短帧并保持载波占用。
            这是改善历史共享式千兆以太网效率的技术，不表示全双工千兆以太网仍使用 CSMA/CD。</p>
        `,
      }],
    },
  ],
};
export default ch;

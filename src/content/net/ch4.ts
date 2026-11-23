/* 计算机网络 · 第4章 数据链路层 —— 依据「课件/PPT-2024/第四章数据链路层（2024）.pptx」整理 */
import type { NetChapter } from './types';
import { pppStuffingFigure, pppPhasesFigure, pppLcpFigure, pppConfigFigure, pppAuthFigure, pppNcpFigure } from './ppp-figures';

const ch: NetChapter = {
  id: 'ch4',
  no: '第4章',
  title: '数据链路层',
  subtitle: '第 4 章 · 数据链路层',
  lede: `
  本章回答「如何在可能出错的物理线路上构造无差错的逻辑数据链路」：<strong>封装成帧、透明传输、差错控制</strong>三个基本问题，
        海明码与 CRC 校验，点到点信道的 <strong>HDLC / PPP</strong> 协议，广播信道的 <strong>CSMA/CD</strong> 与以太网、局域网扩展（网桥、交换机、VLAN）。
`,
  toc: [
    { id: 'sec-ch4-basic', text: '1. 数据链路层概述', level: 2 },
    { id: 'sec-ch4-basic-h1', text: '基本概念与术语', level: 3 },
    { id: 'sec-ch4-basic-h2', text: '为网络层提供的主要服务', level: 3 },
    { id: 'sec-ch4-basic-h3', text: '★ 主要功能与简单模型', level: 3 },
    { id: 'sec-ch4-frame', text: '2. 数据链路层的基本问题', level: 2 },
    { id: 'sec-ch4-frame-h1', text: '★ 封装成帧', level: 3 },
    { id: 'sec-ch4-frame-h2', text: '★ 透明传输', level: 3 },
    { id: 'sec-ch4-error', text: '3. 差错控制', level: 2 },
    { id: 'sec-ch4-error-h1', text: '★ 差错来源、检错码与纠错码', level: 3 },
    { id: 'sec-ch4-error-h2', text: '编码效率与海明距离', level: 3 },
    { id: 'sec-ch4-error-h3', text: '海明码', level: 3 },
    { id: 'sec-ch4-error-h4', text: '★ 循环冗余码 CRC', level: 3 },
    { id: 'sec-ch4-error-h5', text: '其它差错控制编码', level: 3 },
    { id: 'sec-ch4-flow', text: '4. 流量控制', level: 2 },
    { id: 'sec-ch4-flow-h1', text: '★ 停—等协议', level: 3 },
    { id: 'sec-ch4-flow-h2', text: '★ 滑动窗口协议', level: 3 },
    { id: 'sec-ch4-p2p', text: '5. 点到点信道数据链路层协议', level: 2 },
    { id: 'sec-ch4-p2p-h1', text: 'HDLC 协议', level: 3 },
    { id: 'sec-ch4-p2p-h2', text: '★ PPP 协议', level: 3 },
    { id: 'sec-ch4-p2p-h3', text: 'HDLC 与 PPP 的对比', level: 3 },
    { id: 'sec-ch4-broadcast', text: '6. 广播信道数据链路层', level: 2 },
    { id: 'sec-ch4-broadcast-h1', text: 'MAC 概述与动态接入分配协议', level: 3 },
    { id: 'sec-ch4-broadcast-h2', text: '★ CSMA/CD 与 CSMA/CA', level: 3 },
    { id: 'sec-ch4-broadcast-h3', text: '★ 局域网与经典以太网', level: 3 },
    { id: 'sec-ch4-broadcast-h4', text: '★ 以太网帧结构与 10BASE-T', level: 3 },
    { id: 'sec-ch4-broadcast-h5', text: '★ 局域网扩展与虚拟局域网', level: 3 },
    { id: 'sec-ch4-evolve', text: '7. 以太网的演进', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch4-basic',
      heading: '1. 数据链路层概述',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">本章荧光笔重点</p>
            <p><strong>本章重点：</strong>成帧与透明传输 · CRC/FCS · 停止等待 · 连续 ARQ / GBN / SR · HDLC 与 PPP。
            <strong>网卡、MAC、CSMA/CD、交换机自学习与 VLAN</strong> 集中归入<strong>第5章局域网</strong>。</p>
          </div>
          <p>
            物理线路可能出现比特差错。数据链路层通过<strong>封装成帧、透明传输、差错检测</strong>等机制，在相邻结点间传输帧；
            某些链路协议还通过确认与重传提高逐跳可靠性，但<strong>并非所有数据链路层协议都提供无差错、可靠交付保证</strong>。
            例如基础 PPP 和经典以太网主要提供检错与必要时丢弃，不能把“无差错的逻辑数据链路”理解为这一层的普遍协议承诺。
          </p>
          <h3 id="sec-ch4-basic-h1">基本概念与术语</h3>
          <ul>
            <li><strong>结点</strong>（node）：可能是计算机或网络设备（如路由器、交换机或集线器等）；</li>
            <li>
              <strong>帧</strong>（frame）：数据链路层的协议数据单元（PDU），用于封装网络层数据报，包括帧首部、数据（网络层的 PDU）和帧尾；
            </li>
            <li>
              <strong>最大传输单元 MTU</strong>（Maximum Transmission Unit）：某链路可承载的最大网络层数据报长度。IPv4 数据报超过出接口 MTU 时，可能在允许分片的条件下分片，也可能被丢弃并报告差错；IPv6 路由器不对经过的数据报执行分片。同一链路上两个方向的 MTU 未必相同。
              PMTU（路径最大数据单元）是通信结点间路径上的最小 MTU。
            </li>
            <li>
              <strong>链路</strong>（Link）：连接两个相邻结点的物理信道，如双绞线、光纤等；一条链路只是一条通路的一个组成部分。
              <strong>数据链路</strong>（data link）：两个结点间的逻辑通道——把实现控制数据传输协议的硬件和软件加到链路上即构成数据链路，
              通常使用适配器（即网卡）实现，一般的适配器都包括了数据链路层和物理层的功能。
              数据链路层的范围只与本地结点之间的数据交付（local delivery of frames）有关，帧的传输不会超出本地网络。
            </li>
          </ul>
          <p>数据链路层传送的是<strong>帧</strong>：网络层的 IP 数据报装入帧的数据部分，结点 A 的链路层发送帧，结点 B 的链路层接收帧。</p>
          <h3 id="sec-ch4-basic-h2">为网络层提供的主要服务</h3>
          <p>向上层提供相邻节点之间的帧传送服务，是否具备可靠交付机制取决于具体协议；按服务类型可以概括为以下三种形式：</p>
          <table class="tbl">
            <thead>
              <tr><th>服务</th><th>说明</th><th>适用场景</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>无确认的无连接服务</strong></td>
                <td>发送数据帧之前源结点与目标结点无须建立连接，事后也无须释放连接；源结点只负责发送数据帧，其余一概不关心；目标结点只接收数据帧并不进行确认，接收的数据若有错则丢弃、不通知源结点，传输可靠性由高层完成</td>
                <td>有较可靠的网络中，是以太网的主要方式</td>
              </tr>
              <tr>
                <td><strong>有确认的无连接服务</strong></td>
                <td>源结点按照顺序对每个数据帧进行编号再发送；目的结点收到数据帧向源结点发出确认帧；如果在规定的时间内源结点未收到相应数据帧的确认帧，则认为已经丢失，重新发送数据帧</td>
                <td>不可靠信道，如无线通信系统</td>
              </tr>
              <tr>
                <td><strong>有确认的面向连接服务</strong></td>
                <td>源结点和目标结点在传输数据之前必须先建立一个连接，只有连接建立后才能传输数据帧，且传输完成后要释放连接；源结点对每一个数据帧均进行编号并按编号顺序发送，若在规定时间内未收到确认帧则重新发送；每收到一个数据帧目标结点会向源结点发确认帧；有明显的数据链路建立、数据传输、数据链路释放三个阶段</td>
                <td>通常用于广域网的通信子网</td>
              </tr>
            </tbody>
          </table>
          <h3 id="sec-ch4-basic-h3">主要功能与简单模型</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜链路层三大问题</p>
            <p>封装成帧确定边界，透明传输确保特殊字符或比特组合可传送，差错检测识别比特错误。</p>
          </div>
          <p>将网络层的报文封装成数据帧并按顺序发送（一个数据帧可能会有几百到几千字节的长度），为了保证可靠传输，需要具有以下功能：</p>
          <ul>
            <li>一种合适的<strong>帧结构</strong>，以便封装上层数据；</li>
            <li>一种合适的数据识别机制，确保所有数据得到传输；</li>
            <li>一种<strong>检错或纠错</strong>机制，以发现并解决传输中的错误；</li>
            <li>一种合适的<strong>流量控制</strong>机制，以维持有序通信；</li>
            <li>一种获得发送数据权的判断和决策机制。</li>
          </ul>
          <p>
            <strong>数据链路层简单模型</strong>：主机 H1 经局域网 → 路由器 R1 → 广域网（电话网）→ 路由器 R2、R3 → 局域网 → 主机 H2。
            从各层次看数据的流动：H1 的应用层→运输层→网络层→链路层→物理层，经 R1（下三层）、R2（下三层）、R3（下三层）到 H2；
            仅从数据链路层观察，帧的流动是 H1 ↔ R1 ↔ R2 ↔ R3 ↔ H2。
          </p>
          <p>
            <strong>两种传输方式</strong>——点对点信道：一个数据链路上有且仅有两个结点，以双工方式传输数据，主要用于通信子网的结点（路由器）间数据传输；
            广播信道：多个结点共享一个信道，每个结点都可以通过这个信道向其他结点发送数据，每个结点只接收发送给自己的数据，
            主要用于资源子网的同一局域网结点间数据传输。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-frame',
      heading: '2. 数据链路层的基本问题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>面对物理链路的恶劣环境，为实现可靠数据传输，数据链路层有许多问题需要解决，其中以下三个是最基本的共性问题：</p>
          <ul>
            <li><strong>封装成帧</strong>：发送结点的数据链路层将网络层的数据报文添加首部和尾部后封装成帧；</li>
            <li><strong>透明传输</strong>：数据报文中的任意数据都可以得到传输，高层应用无需担心特殊字符的传输问题；</li>
            <li><strong>差错控制</strong>：接收方只接收无差错的数据帧（见 3. 差错控制）。</li>
          </ul>
          <h3 id="sec-ch4-frame-h1">封装成帧</h3>
          <p>
            封装成帧（framing）是在网络层报文的前后分别添加<strong>首部和尾部</strong>，构成一个帧。
            首部和尾部的重要作用之一就是进行<strong>帧定界</strong>——为方便接收方数据链路层能够以帧为单位处理接收的数据，
            发送方必须按照正确的标定起始和终止的方式对数据进行封装。
          </p>
          <p>
            当数据是由可打印的 ASCII 码组成的文本文件时，帧定界可以使用控制字符作为帧定界符：
            控制字符 <strong>SOH</strong>（Start Of Header）放在帧的最前面，表示帧首部开始；控制字符 <strong>EOT</strong>（End Of Transmission）表示帧结束。
            SOH 和 EOT 只是控制字符的名字，分别十六进制编码 01 和 04。
            若发送端在发送一个帧时出现故障、发送中断、随后又恢复正常重新发送，接收端通过判断 SOH 与 EOT 之间的匹配情况就可以判断前面收到的是个不完整的帧，丢弃即可。
          </p>
          <h3 id="sec-ch4-frame-h2">透明传输</h3>
          <h4>为什么需要字符填充？</h4>
          <p>假设使用 SOH 标记帧开始、EOT 标记帧结束。如果待传数据自身恰好包含与 EOT 相同的控制字符，
            接收方会把<strong>普通数据误判为帧尾</strong>。发送方因此需要转义或字符填充；
            接收方在解释真正的帧界限之后再去掉填充，还原原始数据。</p>
          <p><strong>理解：</strong>“透明”不是不会出错，而是<strong>原始数据即使包含控制字符，也能被原样传给上层</strong>。
            记忆顺序：<strong>数据撞上定界符 → 发送方转义 → 接收方还原</strong>。按比特定界的协议则可采用零比特填充等不同机制。</p>
          
          <div class="callout key">
            <p class="callout-h">重点 A｜封装成帧与透明传输</p>
            <p>封装成帧确定帧界限；透明传输要求数据中即使出现与定界符相同的位组合，也不会误判边界。透明传输不等于“永远不会出现差错”。</p>
          </div>

          <p>
            <strong>透明</strong>是指某个实际存在的事物看起来似乎不存在。<strong>透明传输</strong>是指无论被传数据是什么样的比特组合，
            都能够在链路上传送；若被传数据中存在与某个控制信息相同的比特组合，则发送方必须采取适当的措施，使接收方不会将此数据误认为是某种控制信息。
            被传数据对于数据链路层而言是不可见的、透明的——透明传输相当于是黑盒，进来什么就出去什么。
          </p>
          <p>如果帧定界符出现在被传输的数据中，会被接收端误认为是一个帧或被当作无效帧而丢弃。</p>
          <p>
            <strong>方法一：字节填充法</strong>（byte stuffing，也称为字符填充 character stuffing）：
            若被传数据中出现控制字符「SOH」或「EOT」时，发送端的数据链路层则在其前插入一个转义字符「ESC」（其十六进制编码是 1B）；
            接收端的数据链路层在将数据送往网络层之前删除插入的转义字符；如果被传数据中有转义字符时，那么应在转义字符前面再插入一个转义字符；
            接收端收到连续的两个转义字符时，删除前面一个。
          </p>
          <p>
            <strong>方法二：比特填充法</strong>：当连续的多个「1」或多个「0」作为帧定界符中的一部分时，可采用一种比较简单的透明传输方法。
            设帧定界符中有连续 n 个「1」：发送端只要在帧的数据字段发现有 n−1 个连续「1」时，则立即填入一个「0」；
            接收端对帧的数据字段比特流进行扫描，每当发现 n−1 个连续「1」时，就删除其后的「0」。
            例如在 HDLC 协议中，帧定界符为「01111110」，在其数据字段中只要发现有连续 5 个「1」，就在其后插入一个「0」。
            如数据 01001111110001010 中出现了和帧定界符完全一样的 8 个比特组合，发送端在连续发送 5 个「1」之后填入「0」再发送（0100111110 10001010），
            接收端在连续接收到 5 个「1」之后删除其后的「0」恢复原样。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-error',
      heading: '3. 差错控制',
      blocks: [
        {
          type: 'html',
          html: `
          <p>在数据通信过程中，由于自然环境等因素，差错总是不可避免。</p>
          <h3 id="sec-ch4-error-h1">差错来源、检错码与纠错码</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜检错不等于可靠传输</p>
            <p>CRC 可检测比特差错，但丢失、重复、失序需要编号、确认和重传等机制解决。</p>
          </div>
          <table class="tbl">
            <thead>
              <tr><th>差错来源</th><th>特征</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>热噪声</strong>（传输介质内的分子热运动）</td><td>干扰幅度小，持续性，对模拟通信影响大</td></tr>
              <tr><td><strong>冲击噪声</strong>（外界干扰）</td><td>干扰幅度大，突发性，对数字通信影响大。如数据率为 9600bps，一次闪电持续时间为 10ms，则连续破坏 96 位</td></tr>
            </tbody>
          </table>
          <p>计算机网络通信中，差错控制主要针对<strong>冲击噪声</strong>。差错控制方法：通过特殊的编码（差错控制码），使接收端能够发现甚至自动纠正错误。常用的差错控制编码有两类：</p>
          <ul>
            <li><strong>检错码</strong>：能够发现差错，但无法自动纠正差错，通过发送方重传来获得正确的数据；</li>
            <li><strong>纠错码</strong>：不但能够发现差错，而且能够知道哪里出错，从而自动纠正差错。</li>
          </ul>
          <h3 id="sec-ch4-error-h2">编码效率与海明距离</h3>
          <p>
            <strong>码字</strong>由信息位和校验位（冗余位）组成：设信息位为 m 位，校验位为 r 位，则码字长度为 n = m + r。
            <strong>编码效率</strong> R = m/n = m/(m+r)。<strong>两个码字的距离</strong>：两个码字的不同位数——例如 10001001 和 10110001 的距离为 3。
            <strong>海明距离</strong>：给定某种编码算法，码字表中必存在两个码字之间的距离最小，这个最小距离称为该编码系统的海明距离。
            <strong>海明距离决定了编码系统的检错和纠错能力</strong>：
          </p>
          <div class="callout key">
            <p class="callout-h">检错与纠错能力</p>
            <p>若检测 d 位出错，则海明距离至少为 <strong>d + 1</strong>；若纠正 d 位出错，则海明距离至少为 <strong>2d + 1</strong>。</p>
            <p>例：设有一编码系统的码字表由 4 个码字组成：0000000000、0000011111、1111100000、1111111111，
              海明距离为 5，则可检测出 4 位出错、纠正两位出错。如果收到一个码字 0000000111，判断出错——
              如果出错位不超过两位，则可以断定其正确码字为 0000011111；如果出错超过两位（如 3 位），则无法断定其正确码字是 0000011111 还是 0000000000。</p>
          </div>
          <h3 id="sec-ch4-error-h3">海明码</h3>
          <p>
            1950 年海明发明海明码（Hamming Code）。海明码是一种<strong>纠错码</strong>，有时把其能力概括为“检测 2 位错误并纠正 1 位错误”。
            <strong>这一概括须区分两种模式的能力，不能误认为普通海明码可以同时保证纠一检二</strong>。
            海明码是一种分组码，由 m 位信息位和 r 位校验位构成，要求满足：
          </p>
          <p class="formula">2<sup>r</sup> &ge; m + r + 1</p>
          <div class="callout warn">
            <p class="callout-h">海明码检错、纠错能力的关键区别</p>
            <p>上述校验位不等式是单比特纠错海明码的常用设计条件。普通 Hamming(7,4) 的最小码距为 <strong>3</strong>：
            可以检测不超过 <strong>2 位</strong>错误，或者纠正不超过 <strong>1 位</strong>错误；
            但单比特纠错译码器遇到双位错误时可能误纠，因此不能同时保证“纠 1 位、检 2 位”。
            增加一个整体奇偶校验位得到扩展 Hamming(8,4)，最小码距可达 <strong>4</strong>，
            才能同时实现 SECDED（Single Error Correction, Double Error Detection）。</p>
          </div>
          <p>
            理论上 r 个校验位可以出现在任意位置上；习惯上校验位通常被安排在 2 的整数次幂的位置上。
            如 4 位信息位 a<sub>1</sub>a<sub>2</sub>a<sub>3</sub>a<sub>4</sub>，校验位至少是 3 位 p<sub>1</sub>p<sub>2</sub>p<sub>3</sub>，
            组合成的结构为：<strong>p<sub>1</sub>p<sub>2</sub>a<sub>1</sub>p<sub>3</sub>a<sub>2</sub>a<sub>3</sub>a<sub>4</sub></strong>
            （即第 1、2、4 位为校验位，剩余位置按顺序插入信息位）。
          </p>
          <p>每一位校验位均对若干位信息位进行检验，默认偶校验（+ 为异或运算）：</p>
          <p class="formula">p<sub>1</sub> = a<sub>1</sub> + a<sub>2</sub> + a<sub>4</sub>&nbsp;&nbsp;&nbsp;&nbsp;p<sub>2</sub> = a<sub>1</sub> + a<sub>3</sub> + a<sub>4</sub>&nbsp;&nbsp;&nbsp;&nbsp;p<sub>3</sub> = a<sub>2</sub> + a<sub>3</sub> + a<sub>4</sub></p>
          <p>校验及纠错：</p>
          <p class="formula">e<sub>1</sub> = p<sub>1</sub> + a<sub>1</sub> + a<sub>2</sub> + a<sub>4</sub>&nbsp;&nbsp;&nbsp;&nbsp;e<sub>2</sub> = p<sub>2</sub> + a<sub>1</sub> + a<sub>3</sub> + a<sub>4</sub>&nbsp;&nbsp;&nbsp;&nbsp;e<sub>3</sub> = p<sub>3</sub> + a<sub>2</sub> + a<sub>3</sub> + a<sub>4</sub></p>
          <p>
            若 e<sub>1</sub>e<sub>2</sub>e<sub>3</sub> 为 000，在单比特差错模型下表示没有检出差错；否则在仅有 1 位出错时，应按 e<sub>3</sub>e<sub>2</sub>e<sub>1</sub> 的二进制值定位出错位，
            并将其取反即可纠正——如 e<sub>1</sub>e<sub>2</sub>e<sub>3</sub> = 101，即表示在第五位出错，取反即可。
          </p>
          <p>
            <strong>海明码特性</strong>：海明距离只能纠正一位出错，而实际通信过程中经常发生的是突发性错误（一连串位出错）。
            要纠正这样的突发性出错，则必须加大海明距离；但加大海明距离势必会增加校验位长度，从而降低了编码效率，同时也会使编码系统过于复杂。
          </p>
          <h3 id="sec-ch4-error-h4">循环冗余码 CRC</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜CRC 模 2 除法</p>
            <p>练会生成多项式与二进制序列的对应、补零后模 2 除法、余数 FCS 和发送码字。余数为零表示通过检验，不是绝对无错保证。</p>
          </div>

          <p>
            循环冗余码简称为 CRC 码（Cyclic Redundancy Code），是目前计算机网络中使用最广泛的一种<strong>检错码</strong>。
            CRC 码又称多项式码，每个码字对应于一个多项式：设码字为 a<sub>1</sub>a<sub>2</sub>a<sub>3</sub>…a<sub>n</sub>，
            则对应的多项式为 A(x) = a<sub>1</sub>x<sup>n−1</sup> + a<sub>2</sub>x<sup>n−2</sup> + … + a<sub>n</sub>。
            如 110001 → x<sup>5</sup> + x<sup>4</sup> + 1。
          </p>
          <div class="callout key">
            <p class="callout-h">编码原理</p>
            <p>
              设信息位串为 a<sub>1</sub>a<sub>2</sub>a<sub>3</sub>…a<sub>m</sub>，信息编码多项式为 M(x)。
              选择一个 r 次多项式 G(x) 作为<strong>生成多项式</strong>，按下面步骤生成校验串：
              ① 在信息位串后补 r 个 0，对应的多项式为 x<sup>r</sup>M(x)；
              ② 用模 2 除运算，计算余数 R(x) = MOD(x<sup>r</sup>M(x) / G(x))；
              ③ 要发送的码字多项式 T(x) = x<sup>r</sup>M(x) + R(x)。
            </p>
            <p>
              例：信息位串为 1010001，若 G(x) = x<sup>4</sup> + x<sup>2</sup> + x + 1（即 10111），求 CRC 码。
              解：M(x) = x<sup>6</sup> + x<sup>4</sup> + 1，r = 4，x<sup>r</sup>M(x) = x<sup>10</sup> + x<sup>8</sup> + x<sup>4</sup> → 10100010000。
              用模 2 除（被除数 10100010000 ÷ 除数 10111）得商与余数 R(x) = x<sup>3</sup> + x<sup>2</sup> + 1（即 1101）。
              要发送的码字为 <strong>1010001 1101</strong>（信息位串 + 校验位串）。
            </p>
          </div>
          <p>
            <strong>译码原理</strong>：接收端收到码字 T′(x) 后，用同一生成多项式 G(x) 对 T′(x) 也进行模 2 除运算：
            若 MOD(T′(x)/G(x)) = 0，则表示 CRC 未检出差错（仍有漏检可能）；若 MOD(T′(x)/G(x)) ≠ 0，则说明已检出差错。
          </p>
          <p>
            <strong>CRC 码检错能力</strong>：CRC 码不能 100% 的发现错误——当余数为「0」时可能发生错误，CRC 检错率取决于生成多项式 G(x)。
            生成多项式性质：
          </p>
          <ul>
            <li>若 G(x) 中含有 x+1 因子，则能检测出所有的奇数位错；</li>
            <li>若 G(x) 中不含有 x 因子（即含有常数项 1），那么能检测出所有突发长度 ≤ r 的突发错；</li>
            <li>若 G(x) 中不含有 x 因子，且对任何 0 &lt; e ≤ n−1 的 e 除不尽 x<sup>e</sup>+1，则能检测出所有的双位错；</li>
            <li>若 G(x) 中不含有 x 因子，则对于突发长度为 r+1 的突发错误的漏校率为 2<sup>−(r−1)</sup>；对突发长度大于 r+1 的突发错误的漏校率为 2<sup>−r</sup>。</li>
          </ul>
          <p>
            由此得出推论：若适当选取 G(x)，使其含有（x+1）因子、常数项不为零，且满足双位错检出条件，则由此生成多项式的 CRC 码可以检出所有的双位错、奇数位错和突发长度不大于 r 的突发错误；
            突发长度为 r+1 的突发错误检出率可达 (1 − 2<sup>−(r−1)</sup>)；突发长度大于 r+1 的突发错误检出率可达 (1 − 2<sup>−r</sup>)。
            例如若 r = 16 且 G(x) 满足上述要求，则可以检出所有的双位错和奇数位错、突发长度不大于 16 的突发错误；
            突发长度为 17 的突发错误检出率可达 1 − 2<sup>−15</sup>（约 99.997%）；突发长度为 18 的检出率可达 1 − 2<sup>−16</sup>（约 99.998%）。
          </p>
          <p>三个标准 CRC 生成多项式：</p>
          <p class="formula">CRC-12 = x<sup>12</sup> + x<sup>11</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1&nbsp;&nbsp;&nbsp;&nbsp;CRC-16 = x<sup>16</sup> + x<sup>15</sup> + x<sup>2</sup> + 1&nbsp;&nbsp;&nbsp;&nbsp;CRC-CCITT = x<sup>16</sup> + x<sup>12</sup> + x<sup>5</sup> + 1</p>
          <h3 id="sec-ch4-error-h5">其它差错控制编码</h3>
          <ul>
            <li><strong>奇偶校验码</strong>；</li>
            <li>
              <strong>定比码</strong>：指定每个码字中均含有相同数目的「1」。编码效率 R = log<sub>2</sub>C<sub>n</sub><sup>m</sup>/n
              （n 为码字的长度，m 为「1」的数目），编码效率较低；检错能力：除了码字中「1」变为「0」和「0」变为「1」成对出现外，
              其余所有差错都能被检测出来。
            </li>
            <li><strong>正反码</strong>。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-flow',
      heading: '4. 流量控制',
      blocks: [
        {
          type: 'html',
          html: `
          <p><em>本节属于拓展自学内容。</em></p>
          <h3 id="sec-ch4-flow-h1">停—等协议</h3>
          <h4>停等协议：四种典型情形</h4>
          <table class="tbl">
            <thead><tr><th>情况</th><th>发送方 / 接收方处理</th><th>核心原因</th></tr></thead>
            <tbody>
              <tr><td>数据帧正确收到</td><td>接收方交付数据并发送 ACK；发送方继续发下一帧</td><td>确认成功</td></tr>
              <tr><td>数据帧出错</td><td>接收方丢弃错误帧，可发 NAK；发送方重传</td><td>差错检测</td></tr>
              <tr><td>数据帧丢失</td><td>接收方无从确认；发送方等待超时后重传</td><td>超时定时器</td></tr>
              <tr><td>ACK 丢失或迟到</td><td>发送方可能超时重传；接收方识别并丢弃重复帧，再确认</td><td>序号防重复交付</td></tr>
            </tbody>
          </table>
          <p><strong>关键辨析：</strong>超时设置太短可能造成不必要的重传；太长则会增加故障恢复的等待。
            <strong>确认号、序号和超时重传</strong>共同解决确认丢失造成的重复帧问题，而不只是“重新发一遍”。</p>
          
          <div class="callout key">
            <p class="callout-h">重点 A｜停止等待中的确认与重传</p>
            <p>按正常发送、数据差错、确认丢失分别画时间线；超时重传后接收方须丢弃重复帧。</p>
          </div>
          <div class="callout key">
            <p class="callout-h">重点 A｜停止等待效率</p>
            <p>区分数据帧发送时间、单向传播时间和 ACK 开销，再根据题目假设计算信道利用率；注意重传与编号机制。</p>
          </div>

          <p>
            发送方发送一帧后，等待对方的应答。接收端收到一帧后，检查校验位串：若出错，返回「否认」信息；若无错，返回「确认」信息。
            发送端收到「确认」后立即发送下一帧，收到「否认」则重发该帧；发送端发送一帧后立即启动超时计时器，若超时中断，重发该帧；
            接收端应保存最近收到的帧序号，若下一个到达帧的序号与该序号相同，则丢弃并返回「确认」信息。
          </p>
          <p>
            <strong>优点</strong>：简单；<strong>缺点</strong>：信道利用率低。信道最大利用率：设 B 为信道速率，L 为帧长，R 为信号在信道中的单程传播延时：
          </p>
          <p class="formula">U = (L/B) / (L/B + 2R)</p>
          <p>一个帧的完整周期 = 发送数据帧 L/B → 传播 2R → 确认帧。如考虑由于差错造成的重发，以及帧头、校验和冗余信息，信道实际利用率达不到最大利用率。</p>
          <h3 id="sec-ch4-flow-h2">滑动窗口协议</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜GBN / SR 与滑动窗口</p>
            <p>比较回退 N 帧和选择重传的接收窗口、确认与重传范围；能沿时间轴模拟发送窗口的移动。</p>
          </div>

          <p>
            <strong>基本思想</strong>：为提高信道利用率，允许发送方连续发送若干帧后再等待对方应答。
            <strong>窗口</strong>：可容纳数据帧的缓冲区。<strong>发送窗口</strong>：发送方用来保存已发送但尚未经确认的数据帧；
            <strong>接收窗口</strong>：接收方用来保存已正确接收但尚未提交给主机（网络层）数据帧。
            <strong>窗口尺寸</strong>：窗口中可以保存的帧数目。
          </p>
          <p>
            <strong>帧序号</strong>：为了保证接收方能按正确次序向主机递交数据帧而设立的临时帧序号，一般在帧控制字段中用若干位来表示。
            如果用 3 位来表示，则帧序号为 0—7；当一次通信超过 8 帧时，则顺序重复使用这 8 个帧序号。
          </p>
          <p><strong>滑动窗口协议的基本规则</strong>：</p>
          <ul>
            <li>只有帧序号落入当前窗口的帧才有资格发送，发送方收到对方确认信息后，将发送窗口向前滑动；</li>
            <li>只有帧序号落入当前窗口的帧才接收，否则丢弃；接收方接收窗口中的帧递交给主机后，接收窗口向前滑动。</li>
          </ul>
          <p>
            <strong>顺序接收管道协议（回退 n）</strong>：接收窗口尺寸为 1 的滑动窗口协议。设发送窗口尺寸 W<sub>T</sub> = n，接收窗口尺寸 W<sub>R</sub> = 1。
            发送方可连续发送 n 帧而无需对方应答，但需要将已发出但尚未收到确认的帧保存在发送窗口中，以备由于出错或丢失而重发；
            接收方将正确的且帧序号落入当前接收窗口的帧存入接收窗口，同时按序将接收窗口的帧送交给主机，出错或帧序号未落入当前窗口的帧全部予以丢弃；
            当某帧丢失或出错时，则其后到达的帧均丢弃，并返回否认信息，请求对方从出错帧开始重发；
            发送方设置超时计时器，当超时计时器满且未收到应答，则从最早未获确认的帧开始重发仍未确认的后续帧（不一定恰好 n 帧）。
            优点：仅需一个接收缓冲区；缺点：当信道误码率较高时，会产生大量重发帧。
          </p>
          <p><strong>连续 ARQ（Go-Back-N）工作要点：</strong>发送端可在窗口内连续发送多个帧，
            接收端只按序接收；若 DATA2 丢失或出错，后续 DATA3 等帧即便无错也会被丢弃，
            并重复确认当前已按序收到的最后一帧。确认号采用“期待收到的下一帧序号”的约定时，
            ACK2 表示 DATA0 与 DATA1 已被确认，接下来期待 DATA2。</p>
          <p><strong>连续 ARQ 的效率权衡：</strong>连续发送减少等待，链路条件好时吞吐量较高；
            但某帧发生错误而回退重传时，后续已经传送过的帧也需要重发，错误较多时可能浪费大量带宽，
            <strong>连续 ARQ 不一定在所有信道条件下都优于停止等待协议</strong>。</p>
          <p>
            <strong>选择重传协议</strong>：若某一帧出错，后面正确到达的帧虽然不能立即送网络层，但接收方可将其保存在接收窗口，
            仅要求发送方重传那个发错的帧。
          </p>
          <p>三种协议都可以看成是滑动窗口协议，其差别仅在窗口的尺寸不同：</p>
          <table class="tbl">
            <thead>
              <tr><th>协议</th><th>发送窗口</th><th>接收窗口</th></tr>
            </thead>
            <tbody>
              <tr><td>停—等</td><td>1</td><td>1</td></tr>
              <tr><td>回退 n</td><td>&gt;1</td><td>1</td></tr>
              <tr><td>选择重传</td><td>&gt;1</td><td>&gt;1</td></tr>
            </tbody>
          </table>
          <p>
            <strong>窗口尺寸受到的限制</strong>：以选择重传 ARQ 为例，帧序号字段为 m 位时，为避免新旧帧序号混淆，应满足
            <strong>W<sub>T</sub> + W<sub>R</sub> ≤ 2<sup>m</sup></strong>。为避免接收窗口容量闲置，通常令 W<sub>T</sub> ≥ W<sub>R</sub>，但这属于效率建议，不是协议正确性的必要条件。
            分析：若 W<sub>R</sub> &gt; W<sub>T</sub>，部分接收窗口容量可能用不上；
            W<sub>T</sub> + W<sub>R</sub> ≤ 2<sup>m</sup> 保证了上一轮帧序号和下一轮序号在 W<sub>T</sub> + W<sub>R</sub> 范围内不会出现重复，
            否则接收端无法判断落入窗口的帧是上轮重发的还是新的帧。
            例：设 m = 3、W<sub>T</sub> = 7、W<sub>R</sub> = 2，显然 W<sub>R</sub> + W<sub>T</sub> &gt; 2<sup>m</sup>——
            发送端连续发送 7 帧（0-6 号帧）且全部正确到达，接收端发出确认信息并将接收窗口向前滑动到「7 号和 0 号」；
            若这些确认信息全部丢失，发送端由于收不到确认信息而超时重发 0-6 号帧，重发的 0 号帧又落入接收窗口而被重复接收，
            并被误认为下一轮帧递交给主机。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-p2p',
      heading: '5. 点到点信道数据链路层协议',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            点到点信道的两端各有一个端点（结点），采用一对一通信方式，双方协调完成通信；
            通常用于广域网中两个路由器串口之间互联，或者使用调制解调器通过电话线拨号连接 ISP。
          </p>
          <h3 id="sec-ch4-p2p-h1">HDLC 协议</h3>
          <p>
            HDLC（High Level Data Control）协议是一种<strong>面向比特</strong>的链路层协议（以二进制位作为数据帧的基本数据单位），
            是 ISO 在 IBM 的 SDLC（Synchronous Data Link Control）的基础上制定的数据链路层协议，曾经是数据链路层协议的典型代表，得到过广泛的应用。
          </p>
          <p>HDLC 定义了三种类型的站、两种链路结构和三种数据传送操作方式：</p>
          <table class="tbl">
            <thead>
              <tr><th>概念</th><th>内容</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>三种类型的站</strong></td>
                <td>
                  <strong>主站</strong>：负责对数据链路实行全面的管理（发起传输、组织数据流、差错控制与恢复），发出的帧称为命令（Command）；
                  <strong>次站</strong>：受控于主站，只能按照主站的命令进行相应操作，发出的帧称为响应（Response）；
                  <strong>复合站</strong>：具有主站和次站双重功能的站，两个复合站之间可以完全对等地进行通信，具有平衡的链路控制能力。
                </td>
              </tr>
              <tr>
                <td><strong>两种链路结构</strong></td>
                <td><strong>非平衡配置</strong>：点-点或点-多点线路，支持全双工和半双工；<strong>平衡配置</strong>：仅点-点线路，支持全双工和半双工。</td>
              </tr>
              <tr>
                <td><strong>三种数据传送操作方式</strong></td>
                <td>
                  <strong>正常响应方式 NRM</strong>（非平衡配置，数据传输由主站发起，从站只能响应主站的轮询）；
                  <strong>异步响应方式 ARM</strong>（非平衡配置，从站可以主动发送响应帧，主站负责线路管理）；
                  <strong>异步平衡方式 ABM</strong>（平衡配置，任一复合站都可以发起数据传输，不需要得到对方复合站的许可）。
                </td>
              </tr>
            </tbody>
          </table>
          <p><strong>HDLC 帧格式</strong>：</p>
          <table class="tbl">
            <thead>
              <tr><th>标志</th><th>地址</th><th>控制</th><th>数据</th><th>帧检验</th><th>标志</th></tr>
            </thead>
            <tbody>
              <tr><td>1 字节</td><td>1-3 字节</td><td>1 字节</td><td>任意</td><td>2 字节</td><td>1 字节</td></tr>
            </tbody>
          </table>
          <ul>
            <li>
              <strong>标志</strong>：固定为 01111110（0x7E），标志着一个帧的开始和结束，具有帧之间的同步作用；
              在连续发送多帧时，可用一个标志字段既表示帧的开始又表示帧的结束。
            </li>
            <li>
              <strong>插「0」技术</strong>：为了避免其它字段中出现「01111110」产生误解，HDLC 采用插「0」技术——
              发送方除标志位外，连续发现 5 个「1」后自动插「0」；接收方连续发现 5 个「1」后，其后为「0」则自动去掉该「0」，
              为「1」则出错，为「1」且再下一位为「0」则为标志位。
            </li>
            <li>
              <strong>地址</strong>：全「1」为广播地址，全「0」为无效地址。在非平衡方式中总是填入次站地址；在平衡方式中总是填入应答站地址，用来区分命令和响应。
              通常为 1 个字节，若第一位为「0」则表明其后的一个字节也是地址，最多一般不超过 3 个字节。
            </li>
            <li>
              <strong>控制</strong>：该字段表示帧类型、帧编号及其他控制信息。帧类型有三类——
              <strong>信息帧</strong>（含有要传输的数据，以 0 开始）、<strong>监督帧</strong>（应答帧，以 10 开始）、
              <strong>无编号帧</strong>（以 11 开始，不带编号和数据，相当于控制帧：SNRM 置正常响应模式、UA 无编号帧确认、FRMR 帧拒绝、DISC 拆除连线、RESET 复位等）。
              控制字段格式（8 位）：信息帧为「0 | N(S) | P/F | N(R)」，监督帧为「1 0 | S | P/F | N(R)」，无编号帧为「1 1 | M | P/F | M」。
              N(S) 表示信息帧的帧序号 0-7；N(R) 为接收端期望接收的下一帧的序号；P/F 为轮询/结束位，用于多点轮询访问方式。
              监督帧 S 位的含义：00 确认以前各帧准备接受后继帧；10 确认以前各帧但暂停接收后继帧（流量控制）；
              01 否认 N(R) 起的各帧，请求重发从 N(R) 开始的各帧；11 仅否认 N(R) 帧，请求重发 N(R) 那一帧。
              M 共 5 位，表示 2<sup>5</sup> = 32 种控制功能。
            </li>
            <li><strong>数据</strong>：要传输的数据，可以是任意二进制位的组合，即高层的报文分组。</li>
            <li><strong>帧校验</strong>：16 位 CRC 码，G(x) = CRC-CCITT = x<sup>16</sup> + x<sup>12</sup> + x<sup>5</sup> + 1。</li>
          </ul>
          <p>
            <strong>HDLC 工作原理</strong>分三个阶段：<strong>建立数据链路连接</strong>（发送 SNRM 请求建立链路连接，接收方同意则发送 UA 应答）；
            <strong>传输数据帧</strong>（按某种流量控制策略发送和接收数据帧，允许捎带应答）；
            <strong>拆除链路连接</strong>（全部数据发送完毕，发送方发出 DISC 无编号帧，接收方返回 UA 作为响应，释放链路层实体占用的资源）。
          </p>
          <p>
            <strong>HDLC 协议的特点</strong>：主节点同时与多个从节点保持传输，传输效率高；支持全双工和半双工通信方式；
            支持多种传输速率；具有很强的透明传输能力，可传输任何数据；具有自动重传机制和流量控制能力，有效提高了数据传输的可靠性和稳定性。
          </p>
          <h3 id="sec-ch4-p2p-h2">PPP 协议</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜PPP 能做与不能做的事</p>
            <p>把封装成帧、透明性、差错检测与可靠重传、流量控制分开判断：PPP 能检错，但不提供可靠重传保证。</p>
          </div>

          <p>
            HDLC 与 PPP 提供的链路层可靠交付机制不同：部分链路层协议可使用帧序号、确认和重传提供逐跳可靠交付，
            而基础 PPP 侧重于成帧、透明传输、协议复用和检错，<strong>并不提供基于帧确认与重传的可靠交付保证</strong>。
            <strong>OSI/RM 不要求所有数据链路层协议必须可靠，也不存在后来所有链路层协议一律取消可靠交付的规则</strong>：
            是否在链路层采用 ARQ、流量控制由技术条件和具体协议决定，例如 IEEE 802.11 无线 MAC 可使用帧确认与重传。
            点对点协议（Point to Point Protocol，<strong>PPP</strong>）就是一个比 HDLC 协议简单的数据链路层协议：
            一个得到广泛应用的广域网及接入网中的数据链路层协议。异步链路上的 PPP 可以描述为“<strong>面向字符</strong>”，
            对应异步链路采用字节填充的场景；但 PPP 还支持同步链路上的比特填充，不能认为它只支持字符导向的封装；
            目的是通过拨号或专线方式建立点对点的连接和通信，为各种主机、网桥和路由器之间简单连接提供一种共通的标准解决方案。
            应用场合包括拨号方式和专线方式。
          </p>
          <h4>PPP 应满足的十项需求</h4>
          <ol>
            <li><strong>简单：</strong>协议机制尽可能简单。</li>
            <li><strong>封装成帧：</strong>通过明确的帧定界方法识别帧边界。</li>
            <li><strong>透明性：</strong>用户数据不应因为出现标志字节或位模式而被误解。</li>
            <li><strong>支持多种网络层协议：</strong>同一链路可承载不同网络层协议的数据报。</li>
            <li><strong>支持多种链路类型：</strong>适用于不同物理点对点链路。</li>
            <li><strong>差错检测：</strong>检测错误帧并将其丢弃。</li>
            <li><strong>检测连接状态：</strong>能监测链路是否正常工作。</li>
            <li><strong>最大传送单元：</strong>规定默认 MTU / MRU 并允许必要的协商。</li>
            <li><strong>网络层地址协商：</strong>为网络层协议协商必要地址配置。</li>
            <li><strong>数据压缩协商：</strong>能够协商是否及如何使用压缩机制。</li>
          </ol>
          <p><strong>PPP 不要求提供的功能：</strong>逐帧纠错、流量控制、数据帧序号、
            多点线路支持，以及对半双工或单工链路的支持。这里指基础 PPP 的要求，
            不排除其上层协议或特定扩展实现其他功能。</p>
          <p><strong>PPP 协议组成</strong>：</p>
          <ul>
            <li>
              一个将 IP 数据报封装到串行链路的方法——PPP 在点对点链路上使用与 HDLC 极为类似的格式封装数据，仅做了很少的改动；
              PPP 既支持异步链路也支持面向比特的同步链路；IP 数据报被作为数据封装在 PPP 帧中，数据长度受最大传送单元 MTU 的限制；
            </li>
            <li>
              <strong>LCP</strong>（Link Control Protocol，链路控制协议）：一个用来建立、配置和测试数据链路连接的链路控制协议，
              通信的双方可协商一些选项，在 RFC1661 中定义了 11 种类型的 LCP 分组；
            </li>
            <li>
              <strong>NCP</strong>（Network Control Protocol，网络控制协议）：一套网络控制协议，协商链路上传输的数据包格式与类型，
              建立、配置不同的网络层协议，从而可以支持不同的网络层协议（如 IP、Decnet、Appletalk 等）——
              如果是 IP 则提供 IPCP 接口；如果是 IPX 则提供 IPXCP 接口；如果是 Appletalk 则提供 ATCP 接口。
            </li>
          </ul>
          <p><strong>PPP 协议的帧格式</strong>：</p>
          <table class="tbl">
            <thead>
              <tr><th>字段</th><th>长度</th><th>取值</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>F（标志）</td><td>1 字节</td><td>0x7E</td><td>标志一个帧的开始或结束。连续 2 个帧之间只需一个标志字段；如果出现连续两个标志字段，表示这是一个空帧</td></tr>
              <tr><td>A（地址）</td><td>默认 1 字节</td><td>0xFF</td><td>典型 HDLC-like PPP 帧的默认地址字段；通过 LCP 地址/控制域压缩（ACFC）可省略 A 与 C 字段</td></tr>
              <tr><td>C（控制）</td><td>默认 1 字节</td><td>0x03</td><td>典型 HDLC-like PPP 帧的默认控制字段；协商 ACFC 后可与地址字段一并省略</td></tr>
              <tr>
                <td>协议</td><td>默认 2 字节，可压缩为 1 字节</td><td>—</td>
                <td>0x0021 是 IPv4 数据报；0xC021 是 LCP；0x8021 是 IPCP（NCP 的一种，而非所有 NCP 的统一代码）；0xC023 是 PAP；0xC025 是 LQR；0xC223 是 CHAP</td>
              </tr>
              <tr><td>信息部分</td><td>0 个或多个字节，默认 MRU 1500 字节</td><td>—</td><td>RFC 1661 定义的信息字段是<strong>变长</strong>的，默认最大接收单元 MRU 为 1500 字节（信息及可选填充合计），协商后可调整；<strong>短帧不需要自动填充至 1500 字节</strong>，不能混用以太网 46 字节最小载荷规则</td></tr>
              <tr><td>FCS</td><td>默认 2 字节，可用 4 字节</td><td>CRC 码</td><td>通常使用 16 位 FCS；RFC 1662 还定义了可协商使用的 32 位 FCS</td></tr>
            </tbody>
          </table>
          <p class="muted">标准对照：PPP 的 16 位 FCS 为默认值，RFC 1662 也定义 32 位 FCS。RFC 1661 的协议字段压缩（PFC）
            与地址/控制字段压缩（ACFC）均需协商，基础帧格式不等于全部实现都固定携带两个额外字节；
            1500 字节是默认 MRU 而非固定帧长（不包含协议字段），且不同物理链路的透明传输方式可能不同。</p>
          <p><strong>PPP 协议的透明传输</strong>：</p>
          <ul>
            <li>
              <strong>比特同步链路上的 HDLC-like PPP（RFC 1662）</strong>：采用零比特填充方法——
              发送端在帧内容中每出现连续 5 个 1 就插入一个 0；接收端在相应位置删除插入的 0。
              <strong>但不能把 SONET/SDH 一概归入这一实现方式</strong>：RFC 2615 的 PPP over SONET/SDH
              视物理传送为八位组同步链路，采用字节填充并进行扰码处理，不等于在比特同步链路上使用零比特填充。
            </li>
            <li>
              <strong>异步方式</strong>：使用一种特殊的<strong>字符填充法</strong>——将信息字段中出现的每个 0x7E 字节转变成 2 字节序列 (0x7D, 0x5E)；
              若信息字段中出现一个 0x7D 的字节，则将其转变成 2 字节序列 (0x7D, 0x5D)；
              对于 ACCM 指定需要转义的控制字符（缺省 ACCM 中包含 0x00～0x1F），在该字符前面加入 0x7D，并对原字节按位异或 0x20（如 0x04→0x24）；<strong>并非所有链路在协商后都无条件转义全部控制字符</strong>。
            </li>
          </ul>
          ${pppStuffingFigure}
          <p><strong>PPP 协议运行阶段</strong>：链路不可用阶段（初始）→ 链路建立阶段（LCP 协商，包括协商认证方式等）→
            验证阶段（可选，PAP/CHAP 验证）→ 网络层协议阶段（NCP 协商）→ 维持阶段（维持 PPP 会话，传输数据、定时测试链路）→
            网络终止阶段（终止 PPP 会话，回到链路不可用阶段）。即：静止 → 建立 → 认证 → 协商 → 维持 → 终止。</p>
          ${pppPhasesFigure}
          <p>
            <strong>LCP</strong>：链路控制协议是 PPP 协议的一个子集，用于点对点通信时发送端和接收端协商确定一系列必要的信息。
            针对不同的工作，LCP 协议有三种不同类型的帧：<strong>链路配置报文</strong>（建立和配置一条链路）、
            <strong>链路维护报文</strong>（维护和调试链路）、<strong>链路终止报文</strong>（终止一条链路）。
            LCP 是 PPP 的子协议，嵌入在 PPP 的信息部分（协议字段 0xC021）。LCP 帧有四个字段：Code、Ident、Length、LCP Data——
            Code 标识 LCP 数据报文类型；Ident 为 LCP 报文序列号，用于匹配 Request 和 Reply 报文；Length 为 LCP 报文长度；
            LCP Data 为 LCP 数据报文。
          </p>
          ${pppLcpFigure}
          <p>
            链路配置报文：<strong>Config-Request</strong>（代码 0x01，启用链路以及配置请求报文，链路两端结点均可根据需要主动发出）、
            <strong>Config-Ack</strong>（0x02，接受请求应答）、<strong>Config-Nak</strong>（0x03，部分拒绝请求应答）、
            <strong>Config-Reject</strong>（0x04，仅列出无法识别或明确不可协商的选项，不代表拒绝整份请求）。LCP 的配置选项都是一些 TLV（Type、Length、Value）组，
            只要不超过 MTU，一个 LCP 报文可以携带多个 TLV 组。
            LCP 配置选项包括：<strong>最大接收单元 MRU</strong>（通知对方可以接收的最大数据包长度）、
            <strong>异步控制字符映射 ACCM</strong>（通知对方哪些控制字符需要转义）、<strong>认证协议</strong>（协商认证协议，默认不认证）、
            <strong>魔术数 Magic-Number</strong>（测试链路是否存在环）、<strong>协议域压缩</strong>（编号小于 256 的协议压缩为一个字节传输，默认不使用）、
            <strong>地址和控制域压缩</strong>。如果一个配置选项没有在配置请求数据包中出现，那么该配置选项将使用默认值。
          </p>
          <p>
            链路终止报文：<strong>Terminate-Request</strong>（关闭一个点对点的连接，任意一端都可以发出；主动终止的一方持续发送直到收到 Terminate-Reply）、
            <strong>Terminate-Reply</strong>（应答链路终止请求）。链路维护报文：如定时进行 PPP 保活的报文——链路两端分别发送 Echo Request 报文，
            如果对方回复了 Echo Reply 报文，则表示链路仍在活跃状态。
          </p>
          <p>
            LCP 协商过程：发送 LCP Config-Request 的一方向另一方提出自己需要的选项；接收方根据自身情况选择 Config-Ack
            （能识别并接受全部请求项目）、Config-Nak（能识别全部请求并只接受部分配置参数，发送自己认可的配置参数）、
            Config-Reject（只列出请求中不认识或不可协商的选项，保留其他可接受选项）之一进行应答。
            具体来说，Configure-Ack 需要确认请求中的<strong>全部选项及值</strong>，Configure-Nak 指出可协商但值不接受的选项并建议可接受值，
            Configure-Reject 仅拒绝无法协商的选项，<strong>都不能把“部分选项不接受”理解成“整份请求全部拒绝”</strong>（RFC 1661 第 5.2—5.4 节）。
          </p>
          ${pppConfigFigure}
          <div class="callout tip">
            <p class="callout-h">标准对照｜LCP 报文名称与选项协商</p>
            <p>按 RFC 1661，LCP 终止请求的确认应为
            <strong>Terminate-Ack</strong>（而非 Terminate-Reply）；
            <strong>Configure-Reject</strong> 携带的是被拒绝的配置选项，而不是必然拒绝全部选项；
            <strong>Configure-Nak</strong> 可用于对可识别的选项提出不同的可接受取值。
            另外，PPP 信息字段的 <strong>1500 字节是默认 MRU（最大接收单元），不是固定帧长</strong>。
            RFC 1661 的 Padding 是可选的（MAY），不要求不足 1500 字节的数据必须填充到 1500 字节。
            下方交互演示按协议标准逐报文展示。</p>
          </div>
          <p><strong>PPP 协议的认证</strong>（在建立 LCP 连接过程中可以选择认证通信对端），两种认证方式：</p>
          <ul>
            <li>
              <strong>PAP</strong>（Password Authentication Protocol，口令认证协议，RFC1334 定义）：一种简单的用户名/口令认证方式，
              由链路的一端向另一端发送用户名和密码，另一端根据收到的用户名和密码判断是否建立连接；明文方式传输用户名和口令，安全性差。
            </li>
            <li>
              <strong>CHAP</strong>（Challenge Handshake Authentication Protocol，挑战握手认证协议，RFC1994 定义）：一种挑战响应式协议——
              由认证端向被认证端发出挑战「challenge」信息，被认证端将挑战应答的 hash 函数值发送给认证端，认证端根据收到的响应决定是否建立连接；
              不用传送口令信息，安全性较高。
            </li>
          </ul>
          ${pppAuthFigure}
          <p>
            <strong>NCP</strong>：网络控制协议实际上是一套协议，每个子协议都是为处理相应网络层协议所需的错综复杂的配置而存在（IP、IPX、AppleTalk 等都拥有各自的 NCP），
            NCP 与 LCP 有相同的协议格式。当链路建立后，LCP 将控制权交给适当的 NCP；在 NCP 成功配置网络层协议之后，PPP 就可以传输相应的网络层协议数据包。
            <strong>IPCP</strong>（IP 控制协议）是 PPP 协议中负责配置和激活网络层 IP 协议传输的 NCP 子协议：PPP 的协议域为 0x8021；
            IPCP 的 Code 域取值范围是 1-7（Configure-Request/Ack/Nak/Reject、Terminate-Request/Ack 和 Code-Reject）。
            IPCP 协商的内容：IP-Compression-Protocol（协商压缩协议，Van Jacobson TCP/IP 报头压缩技术可将 TCP/IP 报头降低至 3 字节）、
            IP-Address（协商本地使用的 IP 地址，全 0 的 IP 地址表示要求对方分配一个 IP 地址）、
            Primary/Secondary DNS Server Address（协商远端的主、次 DNS 服务器地址，全 0 表示要求对方提供 DNS 地址）。
          </p>
          ${pppNcpFigure}
          <h3 id="sec-ch4-p2p-h3">HDLC 与 PPP 的对比</h3>
          <table class="tbl">
            <thead>
              <tr><th>维度</th><th>HDLC</th><th>PPP</th></tr>
            </thead>
            <tbody>
              <tr><td>链路类型</td><td>支持全双工/半双工链路</td><td>支持全双工/半双工链路</td></tr>
              <tr><td>透明传输</td><td>只支持零比特填充</td><td>支持字节填充和零比特填充</td></tr>
              <tr><td>差错控制</td><td>有检错（CRC 冗余校验）无纠错</td><td>有检错（CRC 冗余校验）无纠错</td></tr>
              <tr><td>传输单位</td><td>比特导向帧封装</td><td>数据按八位组组织；异步链路可使用字节填充，同步链路可使用比特填充，不能只概括为“面向字符”</td></tr>
              <tr><td>协议字段</td><td>有控制字段（1 个字节），功能类似</td><td>有协议字段（2 个字节）</td></tr>
              <tr><td>可靠性</td><td>有帧编号和确认机制，属于可靠传输</td><td>没有帧编号和确认机制，属不可靠传输</td></tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-broadcast',
      heading: '6. 广播信道数据链路层',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            广播信道是一种可以通过广播方式传输信息的信息通道，可以实现一对多的通信。使用广播信道是一个公共信道，必须制定某种机制保证通信有序进行——
            这种机制被称为<strong>媒介共享技术</strong>，也称为多址接入控制（Multiple Access Control，MAC）或媒介访问控制（Medium Access Control，MAC）技术。
          </p>
          <h3 id="sec-ch4-broadcast-h1">MAC 概述与动态接入分配协议</h3>
          <p>
            MAC 技术用于解决公共信道使用产生竞争时如何分配信道使用权的问题。MAC 层在分享有限的信道资源时，需要满足：
            公平的在多个用户间分配信道资源；高效的使用信道资源；各用户之间具有良好的连通性；尽可能高的系统吞吐量、尽可能低的系统时延。
            在 IEEE802 标准中，MAC 层是数据链路层的一个子层，处于数据链路逻辑控制层（LLC）与物理层之间——
            LLC 层负责提供本结点到其他相邻结点的「链路」，MAC 层负责实现本结点与其他结点有序、高效的共享信道。
          </p>
          <p>按照信道访问权限的控制方式，媒介访问控制协议分为两大类：<strong>静态信道分配方式</strong>（频分/时分/码分/波分复用）与
            <strong>动态接入分配方式</strong>（随机分配：ALOHA、CSMA/CD、CSMA/CA；受控分配：轮询协议、令牌协议）。</p>
          <p><strong>ALOHA 协议</strong>：世界上最早的无线电计算机网，由美国夏威夷大学的 Norman Abramson 等人于 1968 年设计提出，
            目的是在夏威夷各岛屿之间通过低成本的商业无线电设备实现部署在各岛上的计算机系统互连。
            ALOHAnet 最重要的贡献在于利用共享介质来进行终端的传输，而不是像 ARPANET 那样结点间只能通过一对一的方式通信。</p>
          <ul>
            <li>
              <strong>纯 ALOHA</strong>——不监听信道，想发就发，随机重发：发送端发起传输请求后可立即发送数据，无需等待授权，也不需要检测信道是否空闲；
              接收端在成功接收数据后返回一个 ACK 帧；校验有错则不发 ACK 帧；发送端在预定的时间内未收到 ACK 帧，则认为发生碰撞，
              并在一个随机时间后重发，若重发再次碰撞则再等待一个随机时间后重发，直到接收到 ACK 帧。
              当网络中结点数量较多且结点发送帧的数量符合泊松分布时，信道利用率的理论值仅为 <strong>18%</strong>。
            </li>
            <li>
              <strong>时隙 ALOHA</strong>——不监听信道，规定发送时间：将时间划分为等长的时隙（slot），每个时隙可以传输 1 个帧；
              结点间严格时钟同步，且只能在时隙开始时发送帧；如果 2 个及以上结点在同一时隙发送帧即检测到冲突。
              无碰撞可以在下一个时隙继续发送新的帧；有碰撞则在下一个时隙以概率 p 重传该帧直至成功。
              优点：单个结点活动时可以连续以信道全部速率传输数据、高度分散化（只需同步时隙）、简单；
              缺点：冲突浪费时隙、存在空闲时隙、需要时钟同步。
              信道利用率的理论值比纯 ALOHA 高出一倍有余，约为 <strong>37%</strong>。
            </li>
          </ul>
          <p>
            <strong>CSMA</strong>：CSMA 认为 ALOHA 的信道利用率低主要在于发送前没有查看信道是否被占用，于是提出了「载波侦听」的基本思想：
            <strong>发送数据前先检测信道</strong>——信道空闲立即发送数据；若信道忙，则等待并继续检测信道。
            根据检测到信道忙后所采取的策略，CSMA 被分为：
          </p>
          <table class="tbl">
            <thead>
              <tr><th>类型</th><th>信道空闲</th><th>信道忙</th></tr>
            </thead>
            <tbody>
              <tr><td>1-坚持 CSMA</td><td>立即发送数据</td><td>持续检测，发现空闲立即发送</td></tr>
              <tr><td>非坚持 CSMA</td><td>立即发送数据</td><td>等待随机时间后再检测</td></tr>
              <tr><td>p-坚持 CSMA（适用于分槽的信道）</td><td>按 p 概率发送数据，或按（1-p）概率等到下个时间槽再试</td><td>等待下一个时间槽再试</td></tr>
            </tbody>
          </table>
          <p>
            由于只是在发送前检测信道是否被占用，当有两个或两个以上结点同时发送数据时，发送方只有在数据发送完成后才会获悉发生碰撞，
            数据无法使用必须重发，从而浪费信道资源。
          </p>
          <h3 id="sec-ch4-broadcast-h2">CSMA/CD 与 CSMA/CA</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜碰撞窗口与指数退避</p>
            <p>共享半双工以太网争用期为 2τ；随机退避取 r∈[0,2ᵏ−1]，k=min(重传次数,10)，退避 r 个基本时间。</p>
          </div>
          <div class="callout key">
            <p class="callout-h">重点 A｜CSMA/CD 与指数退避</p>
            <p>会画最晚检测碰撞的时间关系，区分往返传播时延 2τ 与 RTT 的口语混用；退避参数 k=min(重传次数,10)，连续冲突达到 16 次后放弃。</p>
          </div>

          <p>
            <strong>CSMA/CD</strong>（Carrier Sense Multiple Access with Collision Detection，载波侦听多址接入/碰撞检测）是针对纯 CSMA
            在发送数据时无法检测到是否与其他结点发生碰撞问题而提出的一种改进协议，是<strong>以太网的基础</strong>。
            其主要贡献是解决了多个结点同时传输时，由于距离等原因无法立刻检测到冲突的问题。口诀：<strong>先听后说，边听边说，发生碰撞，随机避退</strong>。
          </p>
          <p>
            「碰撞检测」（也称冲突检测）：结点<strong>边发送数据边检测</strong>信道上的信号电压大小——若多个结点同时发送数据，
            由于各结点信号电压的叠加，信道上的信号电压会发生较大变化；当结点检测到信号电压变化值超过了阈值时，就认为发生了碰撞。
            每个正在发送数据的结点一旦发现碰撞，会立即停止发送，免得继续浪费网络资源，并在等待一段随机时间后再次发送。
          </p>
          <p>
            <strong>碰撞对传输数据的影响</strong>：原因是电磁波在信道上传播速度有限，发送的数据信号在信道上传输有一定的传输时延，
            导致同时或相差时间不大的多个结点发送数据前无法检测到别的结点也在或已经发送数据；后果是发生碰撞后信道上传输的信号将严重失真，
            无法从中得到有价值的信息。设广播信道两端各有一个结点 A 和 B，从 A 到 B 的距离为 1km，信号单程端到端传播时延记为 τ：
            t=0 时 A 检测到信道空闲发送数据；t=τ−δ 时 B 检测到信道空闲也发送数据；t=τ−δ/2 时发生碰撞；
            t=τ 时 B 检测到碰撞停止发送；t=2τ−δ 时 A 检测到发生碰撞。可见<strong>发送数据帧后最多经过 2τ 的时间</strong>，
            发送端就可知道是否遭受了碰撞——这个时间称为<strong>争用期</strong>（碰撞窗口），只要超过这个时间就不会发生碰撞。
          </p>
          <div class="callout warn">
            <p class="callout-h">注意｜CSMA/CD 争用期</p>
            <p>有些教学资料把 2τ 写成「两倍的端到端往返时延」，但同页又将 τ 定义为单程传播时延。这里属于措辞错误：
              <strong>2τ = 两倍单程传播时延 = 一次往返传播时延</strong>，不是「两倍往返时延」。
              标准以太网争用期 51.2 μs 无需翻倍。计算题请按 2τ 代入。</p>
          </div>
          <p><strong>碰撞避退算法</strong>：判断发生碰撞后，CSMA/CD 采用「二进制指数退避」算法：</p>
          <ul>
            <li>每个站点确定一个基本推迟时间 T<sub>i</sub>（如 T<sub>i</sub> = 2τ）；</li>
            <li>从整数集合 {0, 1, 2, 3, …, 2<sup>k</sup>−1} 中随机抽取一个整数 r，其中 k = Min（重发次数，10）；</li>
            <li>随机等待时间 T<sub>W</sub> = r × T<sub>i</sub>；</li>
            <li>若连续 16 次发送不能成功，则放弃发送并向高层报告。</li>
          </ul>
          <p>算法要点：重发次数越多，等待时间越长。</p>
          <p><strong>CSMA/CD 的一些特性</strong>：</p>
          <ul>
            <li>CSMA/CD 只支持<strong>半双工</strong>；</li>
            <li>为了确保发送端能够在发送完成前检测到碰撞，采用 CSMA/CD 的网络必须确定<strong>最小帧长度</strong>——凡是收到长度小于最小帧长度的帧都是无效帧；</li>
            <li>检测到碰撞后，发送端立即停止发送数据，并发送若干比特<strong>干扰信号</strong>（jamming signal）通知其他结点；</li>
            <li>由于存在发送成功与否的不确定性，采用 CSMA/CD 协议的网络的平均通信量远低于其最高数据速率。</li>
          </ul>
          <p>
            <strong>CSMA/CA</strong>（Collision Avoidance，冲突避免机制）一般工作在无线网中。无线网与有线网有很大区别：
            发生碰撞的信号能量通常较小很难被检测出来；<strong>隐蔽结点问题</strong>——当 A 和 C 检测不到无线信号时，都以为 B 是空闲的，
            因而都向 B 发送数据，结果发生碰撞（未能检测出媒体上已存在的信号的问题）；<strong>暴露结点问题</strong>——B 向 A 发送数据时，
            C 检测到媒体上有信号就不敢向 D 发送数据，其实 B 向 A 发送数据并不影响 C 向 D 发送数据。
            因此在无线网中无法使用 CSMA/CD，只能设法避免冲突。
          </p>
          <p>
            <strong>CSMA/CA 原理</strong>：发送数据前监听信道，若有冲突则进行二进制指数避退；若信道空闲，则再等待一段随机的时间后依然没有别的结点使用即发送数据
            （每个结点采用的随机时间不同，可以减少冲突的机会）。此外先发送一段很小的请求传送报文 <strong>RTS</strong>（Request to Send）给目标结点，
            并等待目标端回应报文 <strong>CTS</strong>（Clear to Send）后才开始传送数据——在 RTS、CTS 和后面发送的数据帧中都有一个称为
            <strong>网络分配向量</strong>的数据结构，指明本次发送数据所需要的时间，凡是能收到报文的其他结点将不会在这段时间里发送数据，
            确保接下来传送资料时不会被碰撞。
          </p>
          <h3 id="sec-ch4-broadcast-h3">局域网与经典以太网</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜局域网和网卡</p>
            <p>网卡（NIC）负责收发帧、串并转换、缓存等；分清共享式与交换式以太网的冲突特点。</p>
          </div>
          <div class="callout key">
            <p class="callout-h">重点 A｜MAC 帧与交换机自学习</p>
            <p>掌握以太网 MAC 帧字段顺序、典型长度；交换机按源 MAC 学习端口，按目的 MAC 查表转发/泛洪，表项可老化。</p>
          </div>

          <p>
            局域网（Local Area Network，LAN）是在一个局部的地理范围内（如一个学校、工厂和机关内，一般是方圆几千米以内），
            将各种计算机、外部设备和数据库等互相联接起来组成的计算机通信网，可以实现文件管理、应用软件共享、打印机共享、
            扫描仪共享、工作组内的日程安排、电子邮件和传真通信服务等功能。
          </p>
          <p><strong>局域网的特点</strong>：具有广播功能，从一个站点可很方便地访问全网，局域网上的主机可共享连接在局域网上的各种硬件和软件资源；
            便于系统的扩展和逐渐地演变，各设备的位置可灵活调整和改变；提高了系统的可靠性、可用性和残存性。
            <strong>拓扑</strong>：总线网、星形网、树形网、环形网。</p>
          <p>
            <strong>IEEE802 协议簇</strong>：1980 年 2 月 IEEE 成立局域网标准委员会（IEEE 802 委员会）专门从事局域网模型及相关协议的标准制定与颁布。
            因为只考虑局域网内部的数据交换，802 制定的局域网参考模型只有逻辑链路控制（LLC）子层与介质访问控制（MAC）子层，
            基本对应 OSI 参考模型的数据链路层与物理层。IEEE 802 委员会制定和颁布了众多协议：802.1~802.23（没有 802.13）。
          </p>
          <p>
            <strong>经典以太网</strong>：两个以太网标准——DIX Ethernet V2（世界上第一个局域网产品「以太网」的标准，由 DEC、Intel 和 Xerox 三家企业开发，
            目前的主流）与 IEEE 的 802.3 标准。DIX Ethernet V2 与 IEEE 的 802.3 只有很小的差别，因此也可以将 802.3 局域网称为「以太网」；
            严格说来，「以太网」应当是指符合 DIX Ethernet V2 标准的局域网。
            由于 TCP/IP 使用的局域网是 DIX Ethernet V2 而不是 802.3 标准中的几种局域网，因此逻辑链路控制子层 LLC（即 802.2 标准）的作用已经不大了，
            很多厂商生产的适配器上就仅装有 MAC 协议而没有 LLC 协议；在路由器的互连中依然能看到 LLC 协议。
          </p>
          <p>
            <strong>最初以太网的连接方式</strong>：将许多计算机都连接到一根总线上（总线上没有有源器件，既简单又可靠）。
            信道上的每一个工作的结点都能检测到发送方发送的数据信号，但只有目的地址与数据帧首部写入的地址一致的结点才接收这个数据帧，
            其他所有的结点都检测到数据帧首部的地址与自身的地址不同因而将数据帧丢弃——在具有广播特性的总线上实现了<strong>一对一的通信</strong>。
          </p>
          <p><strong>一些概念</strong>：</p>
          <ul>
            <li>采用 CSMA/CD 协议作为基本工作机制；</li>
            <li>以粗电缆为传输媒介，单段传输距离可达 500m，最多可连接 4 台中继器，最长可达 2500m；</li>
            <li>采用较为灵活的无连接的工作方式，即不必先建立连接就可以直接发送数据；采用曼彻斯特编码；</li>
            <li>不对发送的数据帧编号，也不要求对方发回确认——局域网信道质量好，因其而产生差错的概率很小；</li>
            <li>争用期为两倍的端到端<strong>单程传播时延</strong>（一次往返传播时延 2τ），并被规定为 <strong>51.2μs</strong>；争用期内可发送 512bit，即 64 字节；
              如发送了 64 字节均未遇到碰撞即不会再遇到碰撞；<strong>最短有效帧长为 64 字节</strong>，小于 64 字节的帧都是无效帧。</li>
          </ul>
          <p>
            <strong>以太网的信道利用率</strong>：设 L（bit）为帧长，数据发送速率为 C (bit/s)，因而帧的发送时间为 T<sub>0</sub> = L/C (s)，
            τ 为端到端传输时延。发送一帧所需的平均时间是「占用期」——包括争用期与发送成功的 T<sub>0</sub> + τ。
            定义参数 <strong>a = τ / T<sub>0</sub></strong>：a→0 表示一发生碰撞就立即可以检测出来并立即停止发送，因而信道利用率很高；
            a 越大，表明争用期所占的比例增大，每发生一次碰撞就浪费许多信道资源，使得信道利用率明显降低。
            当数据率一定时，以太网的媒介过长 τ 值会很大；帧的长度不能太短，否则 T<sub>0</sub> 的值会太小使 a 值太大。
          </p>
          <p>
            <strong>极限信道利用率</strong>：在理想状态下（各结点发送数据时都不会产生碰撞，媒介一旦空闲就有结点立即发送数据），
            发送一帧占用媒介的时间是 T<sub>0</sub> + τ，则极限信道利用率 S<sub>max</sub> 为：
          </p>
          <p class="formula">S<sub>max</sub> = T<sub>0</sub> / (T<sub>0</sub> + &tau;) = 1 / (1 + a)</p>
          <h3 id="sec-ch4-broadcast-h4">以太网帧结构与 10BASE-T</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜MAC 地址及帧格式</p>
            <p>以太网 V2 帧主要字段：目的 MAC 6B、源 MAC 6B、类型 2B、数据 46～1500B、FCS 4B。</p>
          </div>
          <p>
            因为历史和利益诉求的不同，形成了大致相同略有区别的多种以太网协议（封装格式上有明显体现）：
            <strong>DIX Ethernet II</strong>（Ethernet V2/ARPA，目前的主流）、<strong>IEEE 802.3/802.2 LLC</strong>（将协议类型字段替换为长度字段，
            加入 802.2 LLC 头用以标志上层协议）、<strong>IEEE 802.3/802.2 SNAP</strong>（在 LLC 头后追加 <strong>5 字节 SNAP 协议标识：3 字节 OUI + 2 字节 PID</strong>；当 OUI=00-00-00 时后 2 字节通常可承载 EtherType）、
            <strong>RAW 802.3</strong>（NOVELL Ethernet 802.3，仅支持 IPX/SPX 网络）。
          </p>
          <p><strong>以太网 V2 的 MAC 帧格式</strong>：</p>
          <table class="tbl">
            <thead>
              <tr><th>字段</th><th>长度</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>目的地址 / 源地址</td><td>各 6 字节</td><td>48 bit MAC 地址，也称为链路层地址、硬件地址等。典型的全球管理 EUI-48 单播地址由 IEEE 分配 24 位 OUI、机构管理后 24 位，但还存在不同规模的地址分配及本地管理、随机化 MAC 地址；不能把所有 MAC 都视为固定厂商前缀，也不能将 MAC 绝对视为不可重复的设备身份。网卡通常接收发给自身 MAC 的单播及广播帧，也按已配置的多播组/过滤策略接收相应多播帧；混杂模式等特殊设置可接收其他帧。MAC 地址通常用于链路层转发，不能仅凭一条 MAC 地址断定全球唯一的设备身份</td></tr>
              <tr><td>类型</td><td>2 字节</td><td>指承载的上层协议，即在数据字段里封装着什么样的上层协议报文（IP、ARP、RARP 等）</td></tr>
              <tr><td>数据</td><td>46 ~ 1500 字节</td><td>至少 46 字节，不足则填充补足</td></tr>
              <tr><td>CRC（FCS）</td><td>4 字节</td><td>采用 CRC-32 的生成多项式 G(x) = x<sup>32</sup> + x<sup>26</sup> + x<sup>23</sup> + x<sup>22</sup> + x<sup>16</sup> + x<sup>12</sup> + x<sup>11</sup> + x<sup>10</sup> + x<sup>8</sup> + <strong>x<sup>7</sup></strong> + x<sup>5</sup> + x<sup>4</sup> + x<sup>2</sup> + x + 1（不计最高次 x<sup>32</sup> 时，32 位十六进制表示为 <strong>0x04C11DB7</strong>）</td></tr>
            </tbody>
          </table>
          <p>
            为了达到比特同步，在传输媒体上实际传送的要比 MAC 帧还多 8 个字节：在帧的前面插入的 8 字节中，
            第一个字段共 7 个字节是<strong>前同步码</strong>（10101010…），用来迅速实现 MAC 帧的比特同步；
            第二个字段是<strong>帧开始定界符</strong>（10101011），表示后面的信息就是 MAC 帧。
          </p>
          <p>
            <strong>10BASE-T 以太网</strong>：传统以太网最初使用粗同轴电缆，后来演进到比较便宜的细同轴电缆，最后发展为更便宜和更灵活的双绞线。
            以双绞线为物理传输介质的以太网，其物理拓扑结构为星形，中心结点为一种有很高可靠性的设备——<strong>集线器</strong>（Hub），
            集线器工作在<strong>物理层</strong>，形状类似多接口转发器。
            由 Hub 构成的星形网络在<strong>逻辑上依然是总线结构</strong>，依然使用 CSMA/CD 协议并共享逻辑上的总线，以半双工方式传输数据；
            10BASE-T 的通信距离稍短，每个站到集线器的距离不超过 100 m。
            这种 10 Mb/s 速率的无屏蔽双绞线星形网的出现，既降低了成本，又提高了可靠性——是局域网发展史上一个非常重要的里程碑，
            为以太网在局域网中的统治地位奠定了牢固的基础。
          </p>
          <h3 id="sec-ch4-broadcast-h5">局域网扩展与虚拟局域网</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜交换机、网桥与表项老化</p>
            <p>交换机相当于多端口网桥；由源 MAC 和入端口学习，根据目的 MAC 转发，过期表项自动删除。</p>
          </div>
          <div class="callout key">
            <p class="callout-h">重点 A｜广播域、碰撞域与 VLAN</p>
            <p>每个交换机端口一般是独立碰撞域；未划分 VLAN 的二层交换网络仍可处于同一广播域，VLAN 用于逻辑分隔广播域。</p>
          </div>

          <p>
            <strong>一、从物理层进行扩展</strong>：① 利用光纤和光纤调制解调器扩展——利用光纤作为传输介质，信号远距离传输后还原；
            ② 利用集线器的级联——多个集线器级联成更大的局域网。例如某大学三个系各自有一个局域网（三个独立的碰撞域），
            用一个主干集线器将三个系连接起来后形成<strong>一个更大的碰撞域</strong>，碰撞的可能性更大。
            优点：使原来属于不同碰撞域的局域网上的计算机能够进行跨碰撞域的通信；扩大了局域网覆盖的地理范围。
            缺点：碰撞域增大了，但总的吞吐量并未提高；只能级联相同速率的集线器。
          </p>
          <p>
            <strong>二、数据链路层的扩展（网桥）</strong>：网桥工作在数据链路层，根据 MAC 帧的目的地址对收到的帧进行转发。
            网桥具有<strong>过滤帧</strong>的功能——收到一个帧时并不是向所有的接口转发此帧，而是先检查此帧的目的 MAC 地址，
            然后再确定将该帧转发到哪一个接口。利用网桥可以将两个不同的局域网互连。
            <strong>网桥隔离了碰撞域</strong>（网桥分离了广播域和碰撞域中的冲突域——碰撞域被分割为多个，广播域仍为一个）。
          </p>
          <p>网桥的优点：过滤通信量，隔离冲突域；扩大了物理覆盖范围；提高了可靠性；可互连不同物理层、不同 MAC 子层和不同速率（如 10 Mb/s 和 100 Mb/s 以太网）的局域网。
            缺点：存储转发增加了时延；在 MAC 子层并没有流量控制功能；不同 MAC 子层的网段桥接在一起时时延更大；
            扩大了广播域，当结点数量较多时容易形成广播风暴，导致网络拥塞而不可用。</p>
          <p>
            <strong>透明网桥</strong>：「透明」是指局域网上的结点并不知道也不用关心所发送的帧将经过哪几个网桥。
            透明网桥是一种即插即用设备，其标准是 IEEE 802.1D。<strong>基于自学习算法的帧转发</strong>：
            基本思想是「若从 A 发出的帧从接口 x 进入了某网桥，那么从这个接口出发沿相反方向一定可把一个帧传送到 A」——
            每个网桥都有一个转发表，每收到一个帧就在表中记录其源地址和进入网桥的接口；转发帧时根据收到的帧的目的地址进行转发；
            为了适应网络拓扑的变化，转发表还有一个<strong>老化时间</strong>，接收到合法帧并根据<strong>源 MAC 地址</strong>学习或刷新对应表项时更新老化计时；转发给目的 MAC 地址本身通常不刷新该目的地址表项，使网桥时刻反映最新的拓扑。
          </p>
          <p>网桥收到一帧后的处理：<strong>自学习</strong>——查找转发表中与收到帧的源地址有无匹配的项目，没有就在转发表中增加一个项目（源地址、进入的接口和时间），
            有则把原有的项目进行更新；<strong>转发帧</strong>——查找转发表中与收到帧的目的地址有无匹配的项目，没有则通过所有其他接口（进入接口除外）进行转发，
            有则按转发表中给出的接口进行转发；若转发表中给出的接口就是该帧进入网桥的接口，则应丢弃该帧。</p>
          <p>
            <strong>避免网络成环</strong>：网络成环后会产生广播风暴——帧不停地兜圈子，网络资源被白白消耗。
            <strong>生成树协议 STP</strong>（Spanning Tree Protocol）是一种工作在数据链路层的通信协议，基本功能是防止由于冗余链路产生的环，
            确保网络中无环路的逻辑拓扑结构，从而避免广播风暴大量占用网络资源。
            STP 算法：选举根网桥（以网桥优先级和 MAC 地址组合生成的桥 ID，ID 最小者为根）→ 遍历各结点到根网桥的所有路径并计算每个路径的代价 →
            在每个结点的所有到根网桥的路径中选择代价最小的路径为通信路径，其余路径作为备份路径并阻塞 → 定时重新计算生成树以适应网络拓扑变化。
            在透明网桥中默认使用生成树协议以破除环。
          </p>
          <p>
            <strong>三、以太网交换机</strong>：1990 年问世的交换式集线器（switching hub）可明显地提高局域网的性能，常称为以太网交换机（switch）。
            以太网交换机通常都有十几个接口，实质上就是一个<strong>多接口的网桥</strong>，工作在数据链路层，因此也称为第二层交换机。
            以太网交换机的特点：每个接口都直接与结点相连，并且以<strong>全双工方式</strong>工作；能同时连通许多对接口，
            使每一对相互通信的结点都能像独占通信媒体那样进行无碰撞地传输数据；使用专用的交换结构芯片，交换速率较高；
            交换机的每个接口都有独享带宽，对于 N 个接口的交换机，其总容量是同样带宽 HUB 的 N 倍。
            利用交换机进行局域网扩展可以隔离冲突域，扩大广播域，同时也扩大了广播风暴范围。
          </p>
          <p>
            <strong>四、虚拟局域网 VLAN</strong>：由局域网中不同网段上的结点所构成的<strong>逻辑网段</strong>，
            这些结点与其真实的物理位置和真实网段无关，通常具有某些共同的需求。
            在需要 VLAN 标记的链路（例如典型 802.1Q Trunk）上，交换机会在帧中携带 VLAN 标识；接入端口通常收发不带 VLAN 标记的帧，不能认为每个 VLAN 的每个帧都会插入标记。
            <strong>VLAN 是一种逻辑分组机制，而不是新的物理局域网标准</strong>；每个 VLAN 构成独立广播域，可限制广播传播。交换机对碰撞域的隔离主要由端口完成，而不是靠 VLAN 标记。
            例如三个虚拟局域网 VLAN1、VLAN2、VLAN3 分布在多个以太网交换机上——当 B1 向 VLAN2 工作组内成员发送数据时，
            工作站 B2 和 B3 将会收到广播的信息，而 A1、A2 和 C1 都不会收到 B1 发出的广播信息。
            虚拟局域网限制了广播传播范围，有助于减轻广播负担，但如果某个 VLAN 内存在环路或广播泛洪，仍可能发生广播风暴。
          </p>
          <h4>VLAN 的主要优点与划分方式</h4>
          <ol>
            <li><strong>改善性能：</strong>减少广播域内的无关广播流量。</li>
            <li><strong>简化管理：</strong>逻辑分组可以不受物理位置限制，便于按部门或应用划分。</li>
            <li><strong>降低成本：</strong>可复用交换基础设施，减少为逻辑隔离而单独布设物理网络的需求。</li>
            <li><strong>改善安全性：</strong>不同 VLAN 默认在二层隔离，但跨 VLAN 访问仍需三层网关及访问控制策略。</li>
          </ol>
          <p><strong>常见划分方式：</strong>① 按交换机端口划分（配置简单，但用户迁移端口通常要重新配置）；
            ② 按 MAC 地址划分（允许终端位置变化，但维护 MAC 列表较繁琐）；
            ③ 按协议类型划分；④ 按 IP 子网划分；⑤ 按高层应用或服务划分。
            这些是 VLAN 成员分配策略，不意味着所有普通交换机都支持全部方式。</p>
          <p>
            VLAN 协议允许在以太网的帧格式中插入一个 4 字节的标识符，称为 <strong>VLAN 标记</strong>（tag），用来指明发送该帧的结点属于哪一个 VLAN。
            802.1Q 帧格式：目的地址（6）+ 源地址（6）+ 802.1Q 标记（4）+ 长度/类型（2）+ 数据 + FCS。
            VLAN 标记的 4 字节中：前 2 字节为标记类型（10000001 00000000），后 2 字节中前 3 位为优先级、1 位为封装格式标记（「0」表示以太网）、
            后 12 位为 VLAN 标识 VID；该字段可表示 0～4095，但 0 用于优先级标记、4095 为保留值，普通可分配的 VLAN ID 为 1～4094。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch4-evolve',
      heading: '7. 以太网的演进',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            以太网在与 ATM 技术的竞争中获胜后成为主要局域网组网方式，技术发展极为迅速。高速以太网技术包括：快速以太网、千兆以太网、万兆以太网。
          </p>
          <p>
            <strong>快速以太网（100BASE-T）</strong>：速率达到或超过 100 Mb/s 的以太网称为快速以太网（Fast Ethernet）。
            在双绞线上传送 100 Mb/s 基带信号的星型拓扑以太网；在<strong>半双工</strong>共享信道场景仍采用 IEEE 802.3 的 CSMA/CD 协议。
            特点：可在<strong>全双工</strong>方式下工作而无冲突发生（全双工时不使用 CSMA/CD 协议）；MAC 帧格式仍然是 802.3 标准规定的；
            保持最短帧长不变，但将一个网段的最大电缆长度减小到 100 m；帧间时间间隔从原来的 9.6μs 改为现在的 0.96μs。
            三种不同的物理层：<strong>100BASE-TX</strong> 使用 2 对 UTP 5 类线或屏蔽双绞线 STP；
            <strong>100BASE-FX</strong> 通常使用 1 对光纤（两根，收发各一根）；<strong>100BASE-T4</strong> 使用 4 对 UTP 3 类线或 5 类线。
          </p>
          <div class="callout warn">
            <p class="callout-h">名称勘误｜100BASE-FX 光纤数量</p>
            <p>100BASE-FX 有时被误写为「使用 2 对光纤」；通常的双纤 100BASE-FX 为<strong>一对、共两根光纤</strong>，分别用于发送与接收。
              这是把「两根」与「两对」混淆。复习时记住 100BASE-TX 为两对双绞线、100BASE-FX 为一对光纤，勿照抄这处数量笔误。</p>
          </div>
          <p>
            <strong>千兆以太网</strong>：允许在 1 Gb/s 下全双工和半双工两种方式工作；使用 802.3 协议规定的帧格式；
            在半双工方式下使用 CSMA/CD 协议（全双工方式不需要使用）；与 10BASE-T 和 100BASE-T 技术向后兼容。
            物理层：<strong>1000BASE-X</strong>（基于光纤通道）——1000BASE-SX 短波长、1000BASE-LX 长波长、1000BASE-CX 铜线；
            <strong>1000BASE-T</strong> 使用 4 对 5 类线 UTP。
          </p>
          <p>
            <strong>万兆以太网</strong>：与 10 Mb/s、100 Mb/s 和 1 Gb/s 以太网的帧格式完全相同；保留了 802.3 标准规定的以太网最小和最大帧长，便于升级；
            可使用光纤，也支持 10GBASE-T 等双绞铜缆物理层；<strong>只工作在全双工方式</strong>，因此没有争用问题，也不使用 CSMA/CD 协议。
          </p>
          <div class="callout tip">
            <p class="callout-h">本章小结</p>
            <p>本章围绕数据链路层的三个基本问题（封装成帧、透明传输、差错控制）展开，覆盖差错控制编码（海明码、CRC）、
              流量控制（停等、滑动窗口）、点到点协议（HDLC、PPP）与广播信道协议（ALOHA、CSMA/CD、CSMA/CA），
              以及局域网、以太网、网桥、交换机与 VLAN。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

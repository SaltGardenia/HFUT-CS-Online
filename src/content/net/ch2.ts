/* 计算机网络 · 第2章 计算机网络体系结构 —— 依据「课件/PPT-2024/第二章计算机网络体系结构.pptx」整理 */
import type { NetChapter } from './types';

const ch: NetChapter = {
  id: 'ch2',
  no: '第2章',
  title: '计算机网络体系结构',
  subtitle: '第 2 章 · 计算机网络体系结构',
  lede: `
  本章回答「如何让相互独立的计算机系统有条不紊地通信」——<strong>建立秩序、建立共识</strong>。
        从分层思想出发，给出计算机网络体系结构的定义（层、层间接口及协议的集合），剖析网络协议的三要素与协议数据单元，
        并对比 <strong>OSI 参考模型</strong>、<strong>TCP/IP 模型</strong>与<strong>五层体系结构</strong>。
`,
  toc: [
    { id: 'sec-ch2-idea', text: '1. 网络体系结构的基本思想', level: 2 },
    { id: 'sec-ch2-idea-h1', text: '分层思想', level: 3 },
    { id: 'sec-ch2-idea-h2', text: '分层思想的优点', level: 3 },
    { id: 'sec-ch2-arch', text: '2. 计算机网络体系结构', level: 2 },
    { id: 'sec-ch2-arch-h1', text: '定义：层、接口与协议的集合', level: 3 },
    { id: 'sec-ch2-arch-h2', text: '实体、协议、服务和 SAP', level: 3 },
    { id: 'sec-ch2-arch-h3', text: '计算机网络体系结构模型', level: 3 },
    { id: 'sec-ch2-protocol', text: '3. 网络协议', level: 2 },
    { id: 'sec-ch2-protocol-h1', text: '协议「三要素」', level: 3 },
    { id: 'sec-ch2-protocol-h2', text: '协议数据单元 PDU', level: 3 },
    { id: 'sec-ch2-osi', text: '4. OSI 参考模型', level: 2 },
    { id: 'sec-ch2-osi-h1', text: '三种模型的比较', level: 3 },
    { id: 'sec-ch2-osi-h2', text: '主机 1 向主机 2 发送数据', level: 3 },
    { id: 'sec-ch2-osi-h3', text: 'OSI/RM 各层简介', level: 3 },
    { id: 'sec-ch2-tcpip', text: '5. Internet 模型', level: 2 },
    { id: 'sec-ch2-tcpip-h1', text: 'Internet 模型简介', level: 3 },
    { id: 'sec-ch2-tcpip-h2', text: 'Internet 模型特点', level: 3 },
  ],
  sections: [
    {
      id: 'sec-ch2-idea',
      heading: '1. 网络体系结构的基本思想',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch2-idea-h1">分层思想</h3>
          <p>
            将一个庞大、复杂的问题分解为若干个功能相对单一、结构比较简单、处理更为方便的局部问题，并分别解决——这种「化整为零」的方法就是
            <strong>分层思想</strong>。计算机网络体系结构的分层思想：<strong>每一层在其下层所提供服务的支持下，通过自身内部功能为其上层提供一种或几种特定的服务</strong>。
          </p>
          <p>
            一个例子（电商服务）：买卖双方物品交接是通过下层服务完成的——卖家只需将目的地址明确的物品交给快递员，买家只需从快递员手中接过物品即可，
            无需关心快递、分检和运输等细节；其他各层也同理。分层结构自上而下是：电商服务 → 快递服务 → 地址分检服务 → 运输服务（运输线路）。
          </p>
          <h3 id="sec-ch2-idea-h2">分层思想的优点</h3>
          <ul>
            <li><strong>耦合度低（独立性强）</strong>：每层只需调用下层接口即可获得下层的服务，无需关心下层的具体实现——即在上层看来，下层是具有特定功能的黑箱；</li>
            <li><strong>适应性强</strong>：只要每层提供的服务和接口不变，其内部实现细节可以任意改变；</li>
            <li><strong>易于实现和维护</strong>：把复杂的系统分解成若干个涉及范围小且功能简单的子系统，使得系统结构更加清晰，系统实现、调试和维护都变得简单和容易。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-arch',
      heading: '2. 计算机网络体系结构',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            采用分层思想的计算机网络体系结构必须解决下面几个问题：
            <strong>确定分层与功能</strong>（确定网络体系结构应该有哪些层次，以及每层应该具有哪些功能）、
            <strong>确定服务与接口</strong>（确定每个层次为上层提供哪些服务，以及上层调用这些服务的接口规格）、
            <strong>确定协议</strong>（确定每层必须遵守的规则，以便确保通信的两方可以达成高度默契）。
          </p>
          <h3 id="sec-ch2-arch-h1">定义：层、接口与协议的集合</h3>
          <div class="callout key">
            <p class="callout-h">定义</p>
            <p><strong>层、层间接口及协议的集合被称为计算机网络体系结构</strong>。</p>
          </div>
          <p>
            计算机网络体系结构是关于计算机网络及其部件所应完成功能的<strong>精确定义</strong>；
            实现（implementation）是在遵循这种体系结构的前提下用合适的硬件或软件完成这些功能的过程。
            体系结构是抽象的，实现则是具体的，是真正在运行的计算机硬件和软件。
          </p>
          <h3 id="sec-ch2-arch-h2">实体、协议、服务和 SAP</h3>
          <div class="callout key">
            <p class="callout-h">荧光笔复习 A｜协议与服务、SDU/PCI/PDU</p>
            <p>协议约束同层对等实体（水平），服务由下层向上层提供（垂直）；本层通过加入 PCI 等控制信息形成相应 PDU，勿混淆数据单元层次。</p>
            <p><small>依据：2025 体系结构 PDF 第 27、45 页；A/B 为复习建议，不代表教师正式划定考试范围。</small></p>
          </div>

          <ul>
            <li><strong>实体</strong>：任何可发送或接收信息的硬件或软件进程。</li>
            <li><strong>接口</strong>：同系统内相邻层之间的交互通道，也称为<strong>服务访问点</strong> SAP（Service Access Point）。</li>
            <li><strong>协议</strong>：控制<strong>对等层</strong>实体间进行数据交换的规则、约定和标准。</li>
            <li><strong>服务</strong>：为保证上层对等实体间的通信，由<strong>下层向上层</strong>提供的功能。</li>
          </ul>
          <p>
            协议的影响范围仅限本层，有「<strong>协议是水平的</strong>」之说；服务的影响范围上下相邻层，有「<strong>服务是垂直的</strong>」之说。
            在第 n 层与第 n+1 层的交互中，(n) 层实体是服务提供者，(n+1) 层实体是服务用户，两者通过 SAP 交换原语，对等实体间遵循 (n) 层协议与 (n+1) 层协议。
          </p>
          <h3 id="sec-ch2-arch-h3">计算机网络体系结构模型</h3>
          <ul>
            <li>同一网络中的任意两个端系统必须具有<strong>相同的层次</strong>；</li>
            <li>每层都使用其下层提供的服务，也都向其上层提供服务；</li>
            <li>通信仅在<strong>对等层</strong>间进行，非对等层之间不能「通信」；</li>
            <li>除了最底层进行<strong>实际的物理通信</strong>外，其余对等层通信均为<strong>逻辑通信</strong>。</li>
          </ul>
          <p>图中的 Pn 代表第 n 层协议，即第 n 层对等实体间通信时必须遵循的规则或约定。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-protocol',
      heading: '3. 网络协议',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            对等实体间的共识就是协议。<strong>网络协议</strong>（network protocol，简称协议），是为进行网络数据交换而建立的规则、标准或约定：
            网络对等实体间为完成数据交换所必须遵循的规则、约定和标准。这个定义指明了通信协议的三要素：<strong>语法、语义和时序（同步）</strong>。
          </p>
          <h3 id="sec-ch2-protocol-h1">协议「三要素」</h3>
          <table class="tbl">
            <thead>
              <tr><th>要素</th><th>含义</th><th>举例</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>语法</strong></td>
                <td>协议元素与数据的组合结构，也就是<strong>报文格式</strong></td>
                <td>BSC 报文由 SOH、HEAD、STX、TEXT、ETX、BCC 组成；HDLC 帧由 Flag、Address、Ctrl、Data、FCS、Flag 组成</td>
              </tr>
              <tr>
                <td><strong>语义</strong></td>
                <td>对协议中各协议元素的含义的解释</td>
                <td>HDLC 中当 Flag 等于 7EH（01111110）时，表示报文的开始和结束</td>
              </tr>
              <tr>
                <td><strong>时序</strong></td>
                <td>（也称为同步）指在通信过程中，通信两方操作的执行顺序与规则</td>
                <td>先应答再收发等顺序约定</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>三要素之间的关系</strong>：计算机间通信的本质在于信息报文的交换。语法规定了报文格式，语义赋予了报文特定内涵，
            时序通过控制具有特定语义的报文的交换，从而实现计算机间的通信。<strong>语法是语义的载体，时序又是对语义的有序组织</strong>。
            正是基于这样的关系，计算机在通信时才得以保持高度默契。
          </p>
          <h3 id="sec-ch2-protocol-h2">协议数据单元 PDU</h3>
          <p>
            计算机网络体系结构中，对等层之间交换的信息报文统称为<strong>协议数据单元</strong>（Protocol Data Unit，PDU）。
            PDU 由协议控制信息（<strong>协议头</strong>）和数据（<strong>SDU</strong>）组成。协议头中一般含有完成传输数据所需的控制信息，
            如：地址、序号、长度、分段标志、差错控制信息等。各层的 PDU 有不同的专属名称。
          </p>
          <p>
            两个端系统之间的数据通信过程本质上就是 PDU 的不断<strong>封装</strong>和<strong>解封</strong>过程：
            在源系统，数据在自上而下逐层递交的过程就是 PDU 不断封装的过程；在目的系统，当数据到达后自下而上递交的过程就是 PDU 不断拆封的过程。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-osi',
      heading: '4. OSI 参考模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            1974 年 IBM 提出了第一个层次化的系统网络体系结构 SNA（Systems Network Architecture）。
            ISO 在 20 世纪 70 年代末开展开放系统互连标准化工作，OSI 参考模型相关标准 ISO 7498 于 1984 年发布（Open Systems Interconnection/Reference Model, OSI/RM）。
            提出 OSI/RM 的目的是试图使各种计算机在世界范围内互联成网，可以相互交互、共享资源。
          </p>
          <div class="callout warn">
            <p class="callout-h">课件年代差异｜OSI 参考模型</p>
            <p><strong>2025 年网络体系结构课件</strong>写「1983 年形成 ISO 7498」，这里可能指标准形成阶段；正式发布的标准版本为 <strong>ISO 7498:1984</strong>。
              网站正文按正式版本写 1984 年。若考试专门问“课件所述形成时间”，须结合老师给出的题目与答案判断，不把两个年份混为一谈。</p>
          </div>
          <h3 id="sec-ch2-osi-h1">三种模型的比较</h3>
          <p>除了 OSI/RM，在实际应用和科学研究领域中还有两个模型非常活跃，分别是 TCP/IP 模型和五层体系结构模型：</p>
          <table class="tbl">
            <thead>
              <tr><th>模型</th><th>层次</th><th>特点与地位</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>OSI 七层体系结构</strong></td>
                <td>应用层、表示层、会话层、传输层、网络层、数据链路层、物理层</td>
                <td>概念清楚、理论完整，是一个<strong>理论上的国际标准</strong>，但却不是事实上的国际标准</td>
              </tr>
              <tr>
                <td><strong>TCP/IP 协议簇</strong></td>
                <td>应用层、传输层、网际层、网络接口层</td>
                <td>简单易用，是<strong>事实上（de facto）的国际标准</strong></td>
              </tr>
              <tr>
                <td><strong>五层体系结构</strong></td>
                <td>应用层、传输层、网络层、数据链路层、物理层</td>
                <td>结合了 OSI/RM 和 TCP/IP 协议簇的优点而提出来的模型，但其只是为了<strong>学术学习研究</strong>，没有具体的实际意义</td>
              </tr>
            </tbody>
          </table>
          <h3 id="sec-ch2-osi-h2">主机 1 向主机 2 发送数据</h3>
          <div class="callout tip">
            <p class="callout-h">荧光笔复习 B｜分层封装/解封装</p>
            <p>结合分层传输图辨别各层作用、传输层的端到端通信，以及 TCP/IP 各层的功能对应。</p>
            <p><small>依据：2025 体系结构 PDF 第 31–38、71 页；A/B 为复习建议，不代表教师正式划定考试范围。</small></p>
          </div>

          <p>主机 1 的应用进程 AP1 向主机 2 的应用进程 AP2 发送数据的完整过程（自上而下逐层封装，再自下而上逐层拆封）：</p>
          <ol>
            <li>应用进程数据先传送到应用层，加上应用层首部，成为<strong>应用层 PDU</strong>；</li>
            <li>应用层 PDU 再传送到运输层，加上运输层首部，成为<strong>运输层报文</strong>；</li>
            <li>运输层报文再传送到网络层，加上网络层首部，成为 <strong>IP 数据报（或分组）</strong>；</li>
            <li>IP 数据报再传送到数据链路层，加上链路层首部和尾部，成为<strong>数据链路层帧</strong>；</li>
            <li>数据链路层帧再传送到物理层，最下面的物理层把<strong>比特流</strong>传送到物理媒体（电信号或光信号在物理媒体中传播，从发送端物理层传送到接收端物理层）。</li>
          </ol>
          <p>
            接收方逐层剥去首部（尾部）：物理层接收到比特流上交数据链路层 → 数据链路层剥去帧首部和帧尾部，取出数据部分上交网络层 →
            网络层剥去首部上交运输层 → 运输层剥去首部上交应用层 → 应用层剥去应用层 PDU 首部，取出应用程序数据上交应用进程。
            注意观察加入或剥去首部（尾部）的层次：应用层首部 H5、运输层首部 H4、网络层首部 H3、链路层首部 H2 与链路层尾部 T2。
          </p>
          <h3 id="sec-ch2-osi-h3">OSI/RM 各层简介</h3>
          <p>OSI/RM 的层次、协议和各层 PDU：应用层/表示层/会话层的 PDU 统称<strong>报文</strong>，传输层为<strong>段</strong>，网络层为<strong>分组</strong>，数据链路层为<strong>帧</strong>，物理层为<strong>比特</strong>。</p>
          <table class="tbl">
            <thead>
              <tr><th>层次</th><th>任务</th><th>功能与服务</th><th>协议举例</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>7 应用层</strong></td>
                <td>为用户的应用进程提供网络通信服务</td>
                <td>用户应用程序与网络间的接口；使用户应用程序能够与网络进行交互；具有可以完成和实现用户请求的各种服务</td>
                <td>MHS、FTAM、EDI、QQ…</td>
              </tr>
              <tr>
                <td><strong>6 表示层</strong></td>
                <td>对上层数据或命令进行解释，使一个主机应用层信息可以被另一个主机的应用程序理解</td>
                <td>对数据进行编码、编译、加密、转换；提供数据加密、压缩、格式转换等服务</td>
                <td>ASN.1、JPEG、ASCII、……</td>
              </tr>
              <tr>
                <td><strong>5 会话层</strong></td>
                <td>负责在网络中的两节点之间建立、维持和终止通信；向两个实体的表示层提供建立和使用连接的方法（不同实体之间的表示层的连接称为会话）</td>
                <td>建立会话、保持会话和结束会话；会话连接的建立和释放、通信方式管理（半双工、全双工、优先级）、会话单元分割和主同步、数据传输异常中断恢复等</td>
                <td>ADSP、ASP、H.245……</td>
              </tr>
              <tr>
                <td><strong>4 传输层</strong></td>
                <td>通信子网与资源子网的分界层，是通信子网和资源子网的接口和桥梁；向高层屏蔽数据通信的所有细节，为用户提供透明的报文传输，保证报文可靠的、正确的传输</td>
                <td>提供端到端的可靠的透明数据传输，使上层服务用户不必关心通信子网的实现细节；提供面向连接的和面向无连接的传输服务；传输连接管理（连接建立、维护和拆除）、传输差错处理（差错控制、流量控制和数据重发）</td>
                <td>TCP、UDP、SPX、NetBIOS/NetBEUI 等</td>
              </tr>
              <tr>
                <td><strong>3 网络层</strong></td>
                <td>通信子网的最高层，在下两层的基础上向资源子网提供服务；在选择路由时综合考虑优先权、网络拥塞程度、服务质量以及路由代价等决定从一个节点到另一个节点的最佳路径</td>
                <td>提供基于逻辑地址的寻址和不同网络间的路由选择；逻辑地址寻址、路由选择、流量控制；将网络地址翻译成对应的物理地址，并通过路由选择算法为分组通过通信子网选择最适当的路径</td>
                <td>IP、ICMP、IGMP、ARP/RARP、IPX、RIP、OSPF 等</td>
              </tr>
              <tr>
                <td><strong>2 数据链路层</strong></td>
                <td>负责建立和管理节点间的链路，控制网络层与物理层之间的通信；实现成帧、差错检测等功能；是否通过确认、重传提供可靠交付由具体链路层协议决定。又分为介质访问控制（MAC）与逻辑链路控制（LLC）两个子层——MAC 解决共享型网络中的信道竞争问题，完成网络介质的访问控制；LLC 建立和维护网络连接，执行差错校验、流量控制和链路控制</td>
                <td>为上层提供相邻结点间的帧传送服务，具体可靠性取决于所用协议；物理地址寻址、数据的成帧、流量控制、差错控制</td>
                <td>Wi-Fi（IEEE 802.11）、WiMAX（IEEE 802.16）、ATM、DTM、令牌环、以太网、FDDI、帧中继、GPRS、HDLC、PPP、L2TP、ISDN、STP 等</td>
              </tr>
              <tr>
                <td><strong>1 物理层</strong></td>
                <td>OSI 的最底层，真正将数据在传输媒介上进行传输的层次；规定激活、维持、关闭通信端点之间的机械特性、电气特性、功能特性以及过程特性；在物理介质上正确地、透明地传送比特流（源结点将 1、0 转化为强弱不同的电信号并传输，目的结点将电信号转化为 1、0）</td>
                <td>实现相邻计算机节点之间比特流的透明传送，屏蔽具体传输介质和物理设备的差异，使数据链路层不必关心网络的具体传输介质</td>
                <td>EIA/TIA RS-232、EIA/TIA RS-449、V.35、RJ-45、SONET/SDH、G.709 等</td>
              </tr>
            </tbody>
          </table>
          `,
        },
      ],
    },
    {
      id: 'sec-ch2-tcpip',
      heading: '5. Internet 模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p>因为模型中两个核心协议为 TCP 和 IP 协议，Internet 模型也称为 <strong>TCP/IP 模型</strong>。</p>
          <h3 id="sec-ch2-tcpip-h1">Internet 模型简介</h3>
          <p>
            早期的 ARPANET 使用的主要是 NCP（Network Control Protocol，网络控制协议）协议。随着网络的发展和用户对网络需求的不断提高，
            NCP 暴露出许多问题，特别是缺乏在异构网络之间进行互联的完整机制，制约了 ARPANET 发展成为一个分布广泛的网络。
            1980 年，用于「异构」网络环境中的 TCP/IP 协议研制成功，TCP/IP 协议可以在各种硬件和操作系统上实现互操作；
            1983 年 1 月 1 日，ARPANET 正式完成从 NCP 向 TCP/IP 的切换。
          </p>
          <p>Internet 模型的四层（大体对应 OSI 的层次）：</p>
          <table class="tbl">
            <thead>
              <tr><th>层次</th><th>与 OSI 的对应</th><th>主要协议</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>应用层</strong></td>
                <td>大体对应 OSI 的应用层、表示层和会话层</td>
                <td>FTP（文件传输协议）、SMTP（简单邮件传输协议）、TELNET（远程网络登陆协议）、DNS（域名服务）、HTTP（超文本传输协议）等</td>
              </tr>
              <tr>
                <td><strong>传输层</strong></td>
                <td>大体上对应 OSI 的传输层</td>
                <td>
                  <strong>TCP</strong>（传输控制协议）——可靠的、面向连接的协议，将报文以字节流形式从源主机进程发到目的主机进程；
                  <strong>UDP</strong>（用户数据报协议）——不可靠的、无连接的协议
                </td>
              </tr>
              <tr>
                <td><strong>网际层</strong></td>
                <td>大体上对应 OSI 的网络层</td>
                <td>
                  <strong>IP</strong>（Internet 协议，Internet 体系结构的核心协议）——把 IP 分组以数据报方式从源主机发送到目的主机；
                  <strong>ICMP</strong>（网际控制报文协议）——负责向节点（路由器或主机）报告网络中发生的状况；
                  <strong>ARP</strong>（地址解析协议）——负责将 IP 地址转换成 MAC 地址
                </td>
              </tr>
              <tr>
                <td><strong>网络接口层</strong></td>
                <td>大体上对应 OSI 的物理层和链路层</td>
                <td>也称为子网层，具有开放的特点。子网协议有：以太网协议、FDDI、PPP、SLIP、Token Bus（802.4）、百兆/千兆/万兆以太网</td>
              </tr>
            </tbody>
          </table>
          <h3 id="sec-ch2-tcpip-h2">Internet 模型特点</h3>
          <ul>
            <li><strong>免费开放</strong>：协议标准完全开放，可以供普通用户和相关厂商自由、免费使用；</li>
            <li><strong>平台无关</strong>：可在任意硬件平台和操作系统环境中运行；</li>
            <li><strong>可靠传输</strong>：TCP 能通过确认、重传等机制提供可靠字节流；IP 和 UDP 本身不保证可靠交付；</li>
            <li><strong>伸缩灵活</strong>：既可用于大小不同规模的网络，也可以根据需要对各层进行裁剪、组合，并且支持多种应用层协议；</li>
            <li><strong>管理维护</strong>：对网络地址统一管理和分配，对网络运行状况进行检测和维护。</li>
          </ul>
          <div class="callout tip">
            <p class="callout-h">本章小结</p>
            <p>本章主要介绍网络协议和网络体系结构的概念、网络层次划分的意义、OSI 参考模型和 TCP/IP 协议簇及其各层的主要功能。
              重点：了解网络协议和网络体系结构。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

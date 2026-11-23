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
    { id: 'sec-ch2-idea-h2', text: '分层的优缺点及主要功能', level: 3 },
    { id: 'sec-ch2-arch', text: '2. 计算机网络体系结构', level: 2 },
    { id: 'sec-ch2-arch-h1', text: '定义：层、接口与协议的集合', level: 3 },
    { id: 'sec-ch2-arch-h2', text: '★ 实体、协议、服务和 SAP', level: 3 },
    { id: 'sec-ch2-arch-h3', text: '计算机网络体系结构模型', level: 3 },
    { id: 'sec-ch2-protocol', text: '3. 网络协议', level: 2 },
    { id: 'sec-ch2-protocol-h1', text: '★ 协议「三要素」', level: 3 },
    { id: 'sec-ch2-protocol-h2', text: '协议数据单元 PDU', level: 3 },
    { id: 'sec-ch2-osi', text: '4. OSI 参考模型', level: 2 },
    { id: 'sec-ch2-osi-h1', text: '三种模型的比较', level: 3 },
    { id: 'sec-ch2-osi-h2', text: '★ 主机 1 向主机 2 发送数据', level: 3 },
    { id: 'sec-ch2-osi-h3', text: '★ OSI/RM 各层简介', level: 3 },
    { id: 'sec-ch2-tcpip', text: '5. Internet 模型', level: 2 },
    { id: 'sec-ch2-tcpip-h1', text: '★ Internet 模型简介', level: 3 },
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
          <div class="callout key">
            <p class="callout-h">本章荧光笔重点</p>
            <p><strong>协议三要素</strong> · <strong>协议/服务/SAP</strong> · <strong>SDU/PCI/PDU</strong> · <strong>OSI 各层职责</strong> · <strong>TCP/IP 各层功能</strong> · <strong>分层封装</strong></p>
          </div>
          <h3 id="sec-ch2-idea-h1">分层思想</h3>
          <h4>两台计算机传送文件必须协调的七件事</h4>
          <p>把“从主机 A 向主机 B 传送一个文件”作为贯穿例子，通信前后需要解决七个问题：</p>
          <ol>
            <li><strong>通路：</strong>首先必须存在能够传送数据的通路。</li>
            <li><strong>激活：</strong>发送方必须能够激活或使用这条通信通路。</li>
            <li><strong>寻址：</strong>发送方要让网络识别正确的接收方。</li>
            <li><strong>在线：</strong>需要考虑对方是否开机、网络连接是否正常。</li>
            <li><strong>准备：</strong>需要考虑对方是否有能力和空间接收、保存文件。</li>
            <li><strong>格式：</strong>如果双方的文件表示方式不兼容，需要进行格式转换。</li>
            <li><strong>差错：</strong>还要处理传输错误或异常，使接收方获得正确的数据。</li>
          </ol>
          <p><strong>理解：</strong>这些问题不必由一个巨大协议一次解决，而可以分配给不同层次与协议共同完成。
            <strong>速记：通、启、址、在、备、格、错。</strong>上面的检查是通信问题的功能清单，并非每次通信都要依次人工执行七个操作。</p>
          
          <p>
            将一个庞大、复杂的问题分解为若干个功能相对单一、结构比较简单、处理更为方便的局部问题，并分别解决——这种「化整为零」的方法就是
            <strong>分层思想</strong>。计算机网络体系结构的分层思想：<strong>每一层在其下层所提供服务的支持下，通过自身内部功能为其上层提供一种或几种特定的服务</strong>。
          </p>
          <p>
            一个例子（电商服务）：买卖双方物品交接是通过下层服务完成的——卖家只需将目的地址明确的物品交给快递员，买家只需从快递员手中接过物品即可，
            无需关心快递、分检和运输等细节；其他各层也同理。分层结构自上而下是：电商服务 → 快递服务 → 地址分检服务 → 运输服务（运输线路）。
          </p>
          <h3 id="sec-ch2-idea-h2">分层的优缺点及主要功能</h3>
          <p><strong>分层的优点：</strong></p>
          <ol>
            <li><strong>各层相对独立：</strong>只需使用下层提供的服务，不必了解下层内部实现。</li>
            <li><strong>灵活性好：</strong>层间接口不变时，内部实现可以替换。</li>
            <li><strong>结构上可分割：</strong>将复杂通信问题分解成各自职责明确的模块。</li>
            <li><strong>易于实现和维护：</strong>便于单独开发、调试与定位问题。</li>
            <li><strong>促进标准化：</strong>协议与服务接口形成统一约定，使不同实现可互通。</li>
          </ol>
          <p><strong>分层的缺点：</strong>不同层可能重复执行某些功能，产生额外的处理与封装开销。
            层数过少会使单层协议过于复杂；层数过多则会使整体协调与系统集成更加困难。</p>
          <h4>网络各层完成的主要功能</h4>
          <ol>
            <li><strong>差错控制：</strong>发现或处理传输差错，提高通信可靠性。</li>
            <li><strong>流量控制：</strong>协调发送速率，使接收方有能力及时接收。</li>
            <li><strong>分段和重装：</strong>发送时拆分数据，在接收端重新组合。</li>
            <li><strong>复用和分用：</strong>多个上层会话共享下层通信资源，接收端再区分。</li>
            <li><strong>连接建立和释放：</strong>有连接的协议在交换数据前建立逻辑连接，结束后释放。</li>
          </ol>
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
            <p class="callout-h">重点 A｜协议与服务、SDU/PCI/PDU</p>
            <p>协议约束同层对等实体（水平），服务由下层向上层提供（垂直）；本层通过加入 PCI 等控制信息形成相应 PDU，勿混淆数据单元层次。</p>
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
          <div class="callout tip">
            <p class="callout-h">协议三要素｜对话类比</p>
            <p><strong>语法</strong>解决“按什么格式说”；<strong>语义</strong>解决“说的话有什么含义”；
              <strong>同步</strong>解决“什么时候说、说完由谁回答”。例如见面问好：用中文说“你好”是格式，
              “你好”表达问候，听到问候后作出回答体现交互顺序。</p>
          </div>
          <p><strong>易错：</strong>同步不只意味着发送双方的时钟完全相同，它还包括交互先后次序、状态变化和应答规则。
            记忆时用<strong>格式—含义—顺序</strong>分别对应语法、语义、同步。</p>
          
          <div class="callout key">
            <p class="callout-h">重点 A｜协议三要素</p>
            <p>语法规定数据格式；语义规定控制信息及含义；同步规定交互时序与应答关系。</p>
          </div>
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
          <p><strong>协议可以有两种表达形式：</strong><strong>文字描述</strong>便于人阅读和理解；
            <strong>程序代码</strong>便于计算机执行。无论采用哪一种形式，都应能对信息交换的格式、含义和过程作出精确说明。</p>
          
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
            <p class="callout-h">注意｜OSI 参考模型的标准时间</p>
            <p>一些历史材料写「1983 年形成 ISO 7498」，这里可能指标准形成阶段；正式发布的标准版本为 <strong>ISO 7498:1984</strong>。
              正式公开发布的 ISO 7498:1984 与标准形成、研究阶段并非同一个时间点。</p>
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
            <p class="callout-h">重点 B｜分层封装/解封装</p>
            <p>结合分层传输图辨别各层作用、传输层的端到端通信，以及 TCP/IP 各层的功能对应。</p>
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
          <div class="callout tip">
            <p class="callout-h">重点 B｜OSI 各层功能</p>
            <p>物理层传送比特，链路层处理相邻结点间的帧，网络层负责寻址与路由，运输层提供进程间端到端通信。</p>
          </div>
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
                <td>运输层位于网络层与应用层之间，负责面向应用进程的端到端逻辑通信，通过端口实现复用、分用；是否保证可靠、按序交付取决于具体协议，<strong>不能把可靠性视为所有运输层协议的共同保证</strong></td>
                <td>TCP 提供面向连接的可靠、有序字节流，具有确认、重传、流量与拥塞控制；UDP 提供无连接、保留报文边界的尽力交付，不保证可靠交付。“运输层保证报文可靠传输”仅适用于 TCP 等提供可靠传输的服务，不能无条件推广到 UDP</td>
                <td>TCP、UDP、SPX、NetBIOS/NetBEUI 等</td>
              </tr>
              <tr>
                <td><strong>3 网络层</strong></td>
                <td>通信子网的最高层，在下两层的基础上向资源子网提供服务；在选择路由时综合考虑优先权、网络拥塞程度、服务质量以及路由代价等决定从一个节点到另一个节点的最佳路径</td>
                <td>提供基于逻辑地址的寻址和跨网络的路径选择及分组转发；IPv4 的下一跳地址在以太网等链路上的 MAC 解析常由 ARP 配合完成，
                  <strong>不能概括为 OSI 网络层必须自行把网络地址直接翻译为物理地址</strong>；流控与可靠性特性还取决于使用的网络层协议</td>
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
          <div class="callout tip">
            <p class="callout-h">重点 B｜TCP/IP 各层职责</p>
            <p>网络接口层连接物理网络；网际层转发 IP 数据报；运输层提供 TCP/UDP 服务；应用层承载 DNS、FTP 等协议。</p>
          </div>
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
          <h4>TCP/IP 协议族的“沙漏”结构</h4>
          <p>沙漏中部是统一的<strong>IP 网际层</strong>：上方可以运行 TCP、UDP 等运输层协议，以及 HTTP、SMTP、DNS 等应用层协议；
            下方可以使用以太网、无线局域网等不同网络接口技术。</p>
          <p><strong>Everything over IP：</strong>各种应用都能通过 IP 网络传送；
            <strong>IP over Everything：</strong>IP 又能够运行在多种不同底层网络之上。
            <strong>速记：</strong>中间统一用 IP，上层多种应用，下层多种接入。</p>
          
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

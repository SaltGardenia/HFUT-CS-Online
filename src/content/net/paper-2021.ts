/* 计算机网络试卷 · 2021～2022 学年第二学期期末 —— 依据「试题/期末/《计算机网络》2021-2022学年第二学期期末试卷-有答案.pdf」整理。
 * 选择题答案取自原卷手写勾选；名词解释/简答/应用题参考答案由本站依据课件整理。 */
import type { NetPaper, PracticeQuestion } from './types';

const questions: PracticeQuestion[] = [
  {
    id: 'p1-s1',
    kind: 'single',
    question: '电脑网络拓扑是通过网中结点与通信线路之间的几何关系表示网络中各实体间的',
    options: ['联机关系', '结构关系', '主次关系', '层次关系'],
    answer: 'B',
    explanation: '计算机网络拓扑是指通信子网节点间连接结构的拓扑形式，通过结点与线段间的几何关系表示网络结构，反映的是网络中各实体的结构关系，故选「结构关系」。',
    tags: [{ deck: 1, sec: 'sec-ch1-classify-h2', text: '拓扑结构分类' }],
  },
  {
    id: 'p1-s2',
    kind: 'single',
    question: '双绞线由两根相互绝缘的、绞合成均匀的螺旋状的导线组成，以下关于双绞线的表达，不正确的选项是',
    options: [
      '它传输速率达10Mbit/s~100Mbit/s，甚至更高，传输距离可达几十公里甚至更远',
      '它既可以传输模拟信号，也可以传输数字信号',
      '与同轴电缆相比，双绞线易受外部电磁波的干扰，线路本身也产生噪声，误码率较高',
      '通常只用作局域网通信介质',
    ],
    answer: 'A',
    explanation: '本卷按典型局域网铜缆以太网链路理解，A 所称“几十公里甚至更远”不符合普通双绞线以太网单段距离限制（如 100BASE-TX 通常为 100 米），因此按原卷选 A。<strong>但题目 D“通常只用作局域网通信介质”也不严谨</strong>：电话用户接入线、DSL 等同样使用双绞铜线；不能把“局域网常用”理解成“仅限局域网”。题目实际存在语义歧义，保留原选项并提示该问题。',
    tags: [{ deck: 3, sec: 'sec-ch3-media-h1', text: '双绞线' }],
  },
  {
    id: 'p1-s3',
    kind: 'single',
    question: 'ATM网络采用固定长度的信元传送数据，信元长度为',
    options: ['1024B', '53B', '128B', '64B'],
    answer: 'B',
    explanation: 'ATM（异步传输模式）采用定长信元：53 字节，包括控制信息的 5 字节信头和 48 字节的净载荷。',
    tags: [{ deck: 5, sec: 'sec-ch5-switch', text: '数据交换技术' }],
  },
  {
    id: 'p1-s4',
    kind: 'single',
    question: '127.0.0.1属于哪一类特别地址',
    options: ['播送地址', '回环地址', '本地链路地址', '网络地址'],
    answer: 'B',
    explanation: '整个 127.0.0.0/8（127.0.0.0～127.255.255.255）属于 IPv4 回环用途地址块；127.0.0.1 常用来测试本机协议栈，不能当作普通公网地址转发。',
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h2', text: '特殊 IP 地址' }],
  },
  {
    id: 'p1-s5',
    kind: 'single',
    question: 'HTTP的会话有四个过程，请选出不是的一个',
    options: ['建立连接', '发出请求信息', '发出响应信息', '传输数据'],
    answer: 'D',
    explanation: 'HTTP 会话过程为：建立 TCP 连接 → 发出请求报文 → 发出响应报文（把文档发送给浏览器）→ 释放连接。「传输数据」不是其中独立的过程，文档随响应报文传回。',
    tags: [{ deck: 7, sec: 'sec-ch7-http-h2', text: 'HTTP 操作过程' }],
  },
  {
    id: 'p1-s6',
    kind: 'single',
    question: '在ISO/OSI参考模型中,网络层的主要功能是',
    options: [
      '提供可靠的端—端服务,透明地传送报文',
      '路由选择、拥塞控制与网络互连',
      '在通信实体之间传送以帧为单位的数据',
      '数据格式变换、数据加密与解密、数据压缩与恢复',
    ],
    answer: 'B',
    explanation: '网络层负责逻辑寻址、路由选择、分组转发及网络互连。在 OSI 的教学模型中也可涉及网络层拥塞控制，故选 B；IPv4 下一跳的 MAC 地址解析由 ARP 完成，不是网络层的一般定义。A 对应运输层的可靠服务，C 对应数据链路层，D 对应表示层。',
    tags: [{ deck: 2, sec: 'sec-ch2-osi-h3', text: 'OSI 各层简介' }],
  },
  {
    id: 'p1-s7',
    kind: 'single',
    question: '以下哪个任务不是网络操作系统的根本任务',
    options: [
      '明确本地资源与网络资源之间的差异',
      '为用户提供根本的网络服务功能',
      '管理网络系统的共享资源',
      '提供网络系统的安全服务',
    ],
    answer: 'A',
    explanation: '网络操作系统的根本任务是：为用户提供基本网络服务功能、管理网络系统的共享资源、提供网络系统的安全服务；「明确本地资源与网络资源之间的差异」不属于其根本任务。',
    tags: [{ deck: 1, sec: 'sec-ch1-definition', text: '资源共享' }],
  },
  {
    id: 'p1-s8',
    kind: 'single',
    question: '既可应用于局域网又可应用于广域网的以太网技术是',
    options: ['以太网', '快速以太网', '千兆以太网', '万兆以太网'],
    answer: 'D',
    explanation: '万兆以太网支持光纤和 10GBASE-T 铜缆等物理层，且工作在全双工方式，不使用 CSMA/CD；其高速、长距离光纤实现既可用于局域网，也可用于园区或广域网连接，因此按原卷口径选 D。',
    tags: [{ deck: 4, sec: 'sec-ch4-evolve', text: '以太网的演进' }],
  },
  {
    id: 'p1-s9',
    kind: 'single',
    question: '交换机端口可以分为半双工与全双工两类，对于100Mbps的全双工端口,端口带宽为',
    options: ['100Mbps', '200Mbps', '400Mbps', '800Mbps'],
    answer: 'B',
    explanation: '全双工端口可同时收发，收、发各占 100Mbps，端口带宽为 2×100Mbps = 200Mbps。',
    tags: [{ deck: 4, sec: 'sec-ch4-broadcast-h5', text: '以太网交换机' }],
  },
  {
    id: 'p1-s10',
    kind: 'single',
    question: '要把学校里行政楼和实验楼的局域网互连,可以通过（　）实现',
    options: ['交换机', 'MODEM', '中继器', '网卡'],
    answer: 'A',
    explanation: '网桥/交换机工作在数据链路层，根据 MAC 帧的目的地址对帧进行过滤转发，可将两个不同局域网互连；中继器/集线器只能扩大碰撞域，不能隔离流量。',
    tags: [{ deck: 4, sec: 'sec-ch4-broadcast-h5', text: '局域网扩展' }],
  },
  {
    id: 'p1-s11',
    kind: 'single',
    question: '以下哪一类IP地址标识的主机数量最多',
    options: ['D类', 'C类', 'B类', 'A类'],
    answer: 'D',
    explanation: 'A 类地址主机号字段为 3 字节，每个网络中最大主机数为 2<sup>24</sup>−2 = 16777214，远多于 B 类（65534）、C 类（254）；D 类是多播地址不标识主机。',
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h2', text: '分类 IP 地址' }],
  },
  {
    id: 'p1-s12',
    kind: 'single',
    question: '子网掩码中「1」代表',
    options: ['主机部分', '网络部分', '主机个数', '无任何意义'],
    answer: 'B',
    explanation: '子网掩码 32 比特中，网络号（包括子网号）部分全为「1」，主机号部分全为「0」，用于分离网络号和主机号。',
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h3', text: '子网掩码' }],
  },
  {
    id: 'p1-s13',
    kind: 'single',
    question: '给出B类地址190.168.0.0及其子网掩码255.255.224.0,请确定它可以划分几个子网',
    options: ['8', '6', '4', '2'],
    answer: 'A',
    explanation: '掩码 255.255.224.0 的第三字节为 11100000，借用了 3 位主机号作子网号；2<sup>3</sup> = 8 个子网组合。按课件口径排除全 0 全 1 子网则可划分 6 个可用子网，此处按子网位数的组合数计为 8。',
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h3', text: '划分子网' }],
  },
  {
    id: 'p1-s14',
    kind: 'single',
    question: 'TCP/IP体系结构中与ISO-OSI参考模型的1、2层对应的是哪一层',
    options: ['网络接口层', '传输层', '互联网层', '应用层'],
    answer: 'A',
    explanation: 'TCP/IP 模型的网络接口层大体上对应 OSI 的物理层和链路层（第 1、2 层）。',
    tags: [{ deck: 2, sec: 'sec-ch2-tcpip-h1', text: 'TCP/IP 四层对应' }],
  },
  {
    id: 'p1-e1',
    kind: 'essay',
    question: '名词解释：UTP',
    answer: `UTP（Unshielded Twisted Pair，非屏蔽双绞线）：由相互缠绕在一起的两根绝缘铜线组成的传输媒体。两根导线分别带有信号相位相差 180 度的电流，外界电磁干扰给两个电流带来的影响将相互抵销；螺旋状的结构有助于抵销电容增大。双绞线既可传输模拟信号也可传输数字信号，按 CAT 类别分为一类到六类。`,
    explanation: `要点：非屏蔽双绞线的构成（两根绝缘铜线绞合）、抗干扰原理（平衡信号/螺旋结构抵销）、典型应用（如快速以太网 100Mbps 每段 100 米）。`,
    tags: [{ deck: 3, sec: 'sec-ch3-media-h1', text: '双绞线' }],
  },
  {
    id: 'p1-e2',
    kind: 'essay',
    question: '名词解释：FTP',
    answer: `FTP（File Transfer Protocol，文件传输协议）：TCP/IP 应用层的文件传送协议，属于面向连接的公共应用层协议，用于在客户与服务器之间传输文件。FTP 使用客户服务器方式工作，在 TCP/IP 模型中由传输层 TCP 提供可靠的传送服务；其熟知端口号为 21。`,
    explanation: `要点：全称与中文名、所属层次（应用层公共标准协议）、客户服务器方式、基于 TCP。`,
    tags: [{ deck: 2, sec: 'sec-ch2-tcpip-h1', text: '应用层协议' }],
  },
  {
    id: 'p1-e3',
    kind: 'essay',
    question: '名词解释：ADSL',
    answer: `ADSL（Asymmetric Digital Subscriber Line，非对称数字用户线路）：xDSL 系列技术中最流行的一种，1989 年由贝尔实验室推出。ADSL 是基于普通电话线的宽带接入技术，有三个信道——一个高速下行信道、一个上行信道和一个 POTS 信道，数据信号和电话音频信号以频分复用方式调制于各自频段互不干扰；采用 DMT 调制技术把信道划分为 256 个 4kHz 子信道，上行用低频 25 个子信道，下行用高频 230 个子信道，并通过自适应调制技术使用户线能够传送尽可能高的数据率。`,
    explanation: `要点：全称与「非对称」含义、基于电话线的宽带接入、上下行速率不对称、DMT 频分复用与自适应调制。`,
    tags: [{ deck: 3, sec: 'sec-ch3-access-h1', text: 'ADSL 与 DMT' }],
  },
  {
    id: 'p1-e4',
    kind: 'essay',
    question: '名词解释：DNS',
    answer: `DNS（Domain Name System，域名系统）：用来解决主机名与 IP 地址映射关系的因特网目录服务。DNS 采用层次结构的命名方法确保域名的唯一性，由根域名服务器、顶级域名服务器、权限域名服务器和本地域名服务器分工协作完成域名到 IP 地址的解析；主机向本地域名服务器采用递归查询，本地域名服务器向根域名服务器通常采用迭代查询。DNS 通常采用 UDP 53 端口进行查询，也支持 TCP 53；传统未启用 EDNS 的 DNS UDP 报文限额为 512 字节，启用 EDNS(0) 后可更大，发生截断可改用 TCP，区域传送通常也使用 TCP。`,
    explanation: `要点：作用（域名↔IP 映射）、层次结构与四类服务器、递归/迭代查询、端口 53 及 UDP/TCP 的选择。`,
    tags: [{ deck: 7, sec: 'sec-ch7-dns', text: '域名系统' }],
  },
  {
    id: 'p1-e5',
    kind: 'essay',
    question: '名词解释：SMTP',
    answer: `SMTP（Simple Mail Transfer Protocol，简单邮件传送协议）：规定在两个相互通信的 SMTP 进程之间如何交换信息的邮件传送协议。SMTP 使用客户服务器方式（发送端的 SMTP 进程是客户，接收端的是服务器），定义了 16 条命令和 23 种应答信息（应答以 3 位数字代码开始）；发信人的用户代理向源邮件服务器发送邮件、源邮件服务器向目的邮件服务器发送邮件都使用 SMTP。`,
    explanation: `要点：全称与中文、客户服务器方式、命令与应答形式、只负责「发送/推送」邮件（与 POP3/IMAP 的读取分工）。`,
    tags: [{ deck: 7, sec: 'sec-ch7-email-h2', text: 'SMTP' }],
  },
  {
    id: 'p1-e6',
    kind: 'essay',
    question: '简述IPv4到IPv6的过渡技术。',
    answer: `
    <p>IPv4 与 IPv6 将长期共存，过渡技术要使二者互联互通，主要有三类：</p>
    <ul>
      <li><strong>双协议栈</strong>：主机（或路由器）同时安装 IPv4 和 IPv6 两套协议栈，与 IPv4 节点通信时使用 IPv4，与 IPv6 节点通信时使用 IPv6，按目的地址的类型选择栈。</li>
      <li><strong>隧道技术</strong>：在 IPv6 数据报外再封装 IPv4 首部，把 IPv6 分组作为 IPv4 数据报的载荷在 IPv4 网络中「隧道」中穿越，到出口后再剥去 IPv4 首部恢复 IPv6 分组。</li>
      <li><strong>翻译/转换技术</strong>：在网络边界设置协议转换设备，对 IPv4 与 IPv6 分组的首部字段进行相互转换，使纯 IPv4 与纯 IPv6 节点之间也能通信。</li>
    </ul>`,
    explanation: `要点：三种过渡技术的名称与思路——双栈（按地址类型选栈）、隧道（IPv6 封装于 IPv4 穿越）、翻译（边界协议转换）。`,
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h1', text: 'IP 协议概述' }],
  },
  {
    id: 'p1-e7',
    kind: 'essay',
    question: '简述OSI参考模型和TCP/IP模型的异同和特点。',
    answer: `
    <p><strong>相同点</strong>：二者都采用分层思想，都存在传输层、网络（网际）层与应用层，且传输层均提供面向连接与无连接两类服务。</p>
    <p><strong>不同点</strong>：</p>
    <ul>
      <li>OSI 是七层（应用、表示、会话、传输、网络、数据链路、物理），TCP/IP 是四层（应用、传输、网际、网络接口）；TCP/IP 的应用层大体对应 OSI 的应用层+表示层+会话层，网络接口层对应 OSI 的物理层+数据链路层。</li>
      <li>OSI 先有模型后有协议，概念清楚、理论完整，是理论上的国际标准但不是事实标准；TCP/IP 协议先于模型发展，简单易用，是事实上的国际标准。</li>
      <li>TCP/IP 在网际层只提供无连接的数据报服务；OSI 在网络层既支持无连接也支持面向连接的通信。</li>
    </ul>
    <p><strong>TCP/IP 的特点</strong>：协议标准完全开放免费；平台无关，可在多种硬件与操作系统环境中实现；TCP 可提供可靠字节流，IP/UDP 本身不提供可靠交付保证；伸缩灵活，可裁剪组合各层并支持多种应用层协议；对网络地址统一管理和分配、可对网络运行状况进行检测和维护。</p>`,
    explanation: `要点：层次划分与对应关系、理论与事实标准之争、网际层服务的差异、TCP/IP 五个特点。`,
    tags: [
      { deck: 2, sec: 'sec-ch2-osi-h1', text: '三种模型比较' },
      { deck: 2, sec: 'sec-ch2-tcpip-h2', text: 'TCP/IP 特点' },
    ],
  },
  {
    id: 'p1-e8',
    kind: 'essay',
    question: '网络安全面临的威胁主要有哪些。',
    answer: `
    <ul>
      <li><strong>网络中的安全问题</strong>主要针对两类对象：网络上的数据（被动攻击——窃听、流量分析，攻击者只观察而不干扰；主动攻击——篡改、伪造、重放、拒绝服务等，攻击者对数据进行干扰）。</li>
      <li><strong>恶意程序</strong>：计算机病毒、蠕虫、木马、逻辑炸弹等。</li>
      <li><strong>针对网络服务系统的威胁</strong>：冒充合法用户、非授权访问、拒绝服务攻击（DoS）、对域名/路由等基础设施的欺骗等。</li>
      <li>归纳为四大威胁：<strong>截获（被动）、中断、篡改、伪造（主动）</strong>——截获是被动攻击，后三类属主动攻击。</li>
    </ul>`,
    explanation: `要点：被动攻击（截获/流量分析）与主动攻击（中断、篡改、伪造）的区分；恶意程序；针对服务的拒绝攻击等。`,
    tags: [{ deck: 1, sec: 'sec-ch1-trend', text: '发展趋势' }],
  },
  {
    id: 'p1-e9',
    kind: 'essay',
    question: '某网络10.0.0.0的子网掩码255.224.0.0，请确定可以划分的子网个数，写出每个子网的子网号及每个子网的主机范围。',
    answer: `
    <p>10.0.0.0 是 A 类地址，掩码 255.224.0.0 的第二字节为 11100000，即从主机号借 <strong>3 位</strong>作子网号，可划分 2<sup>3</sup> = 8 个子网组合。</p>
    <p>按课件口径（子网号全 0 全 1 不用）划分出 <strong>6 个子网</strong>，子网号（第二字节）取 001～110：</p>
    <table class="tbl">
      <thead><tr><th>子网号</th><th>子网地址</th><th>主机范围</th></tr></thead>
      <tbody>
        <tr><td>001</td><td>10.32.0.0</td><td>10.32.0.1 — 10.63.255.254</td></tr>
        <tr><td>010</td><td>10.64.0.0</td><td>10.64.0.1 — 10.95.255.254</td></tr>
        <tr><td>011</td><td>10.96.0.0</td><td>10.96.0.1 — 10.127.255.254</td></tr>
        <tr><td>100</td><td>10.128.0.0</td><td>10.128.0.1 — 10.159.255.254</td></tr>
        <tr><td>101</td><td>10.160.0.0</td><td>10.160.0.1 — 10.191.255.254</td></tr>
        <tr><td>110</td><td>10.192.0.0</td><td>10.192.0.1 — 10.223.255.254</td></tr>
      </tbody>
    </table>
    <p>每个子网主机号占 21 位，扣除全 0（网络地址）与全 1（广播地址）两个，每子网可容纳 2<sup>21</sup>−2 台主机。</p>`,
    explanation: `要点：借 3 位子网号 → 8 种组合。这里沿用旧式教材排除全 0、全 1 子网的约定，因此列 6 个；现代 CIDR/VLSM 通常允许这两类子网，实际可划分 8 个。子网地址按第二字节 32 的倍数递增；每个子网主机范围仍需排除网络地址与广播地址。`,
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h3', text: '子网划分' }],
  },
  {
    id: 'p1-e10',
    kind: 'essay',
    question: '应用题：浏览主页过程中应用了什么协议？',
    answer: `
    <p>用户点击链接到浏览器显示主页的完整过程中：</p>
    <ol>
      <li><strong>DNS</strong>——浏览器先向 DNS 请求解析主页服务器的域名，得到 IP 地址（DNS 查询本身使用 UDP，必要时用 TCP）；</li>
      <li><strong>ARP</strong>——在本网段内由 IP 地址解析出网关/服务器的 MAC 地址，以便封装以太帧；</li>
      <li><strong>TCP</strong>——在课件的经典 HTTP/1.x 示例中，浏览器与服务器通过三次握手建立 TCP 连接（明文 HTTP 默认端口 80）；</li>
      <li><strong>HTTP</strong>——浏览器发出 GET 请求报文，服务器返回响应报文把文档发给浏览器；</li>
      <li>底层由 <strong>IP</strong> 完成寻址与转发，传输媒体上由以太网等协议传送帧。</li>
    </ol>
    <p><strong>现行协议补充</strong>：以上是本卷要求的典型 HTTP/TCP 流程，不是打开所有网页都必经的固定步骤。
    今天常见的 HTTPS 在 TCP 上增加 TLS（默认端口 443）；HTTP/3 则运行在 QUIC/UDP 之上，不经过 TCP 三次握手。
    DNS 结果与 ARP 邻居表可能命中缓存，因而不是每次访问都需要重新发出 DNS、ARP 请求；IPv6 链路使用 NDP 而非 IPv4 ARP。</p>`,
    explanation: `按经典 HTTP/1.x 题目模型：DNS → ARP（必要时）→ TCP → HTTP，由 IP 与链路层承载；现代 HTTPS 还有 TLS，HTTP/3 使用 QUIC/UDP，缓存命中时不必重新查询 DNS/ARP。`,
    tags: [
      { deck: 7, sec: 'sec-ch7-http-h2', text: 'HTTP 操作过程' },
      { deck: 7, sec: 'sec-ch7-dns-h3', text: '域名解析过程' },
    ],
  },
  {
    id: 'p1-e11',
    kind: 'essay',
    question: '画出二进制数字信号01001101的基带信号编码波形、曼彻斯特编码波形图、以及差分曼彻斯特编码的波形图。',
    answer: `
    <p>比特序列 0 1 0 0 1 1 0 1（左边先发送）：</p>
    <ul>
      <li><strong>NRZ 基带信号</strong>：每位占一个码元宽度，0 为低电平、1 为高电平（本题取 0 低 1 高的约定）。</li>
      <li>
        <strong>曼彻斯特编码</strong>：每一位中间有一次跳变——从高到低表示「0」，从低到高表示「1」；
        每位前半是位值的反相、后半是位值本身（本课件取「高→低 = 0，低→高 = 1」的约定）。
      </li>
      <li>
        <strong>差分曼彻斯特编码</strong>：每一位中间的跳变仅作同步不表示数据；数据看每位<strong>开始</strong>处有无跳变——有跳变表示「0」，无跳变表示「1」。
        首位的方向以一个初始电平为参考。
      </li>
    </ul>
    <figure class="fig">
    <svg viewBox="0 0 400 150" role="img" aria-label="01001101 的三种编码波形">
      <g stroke="var(--hairline-soft)" stroke-width="1">
        <line x1="74" y1="20" x2="74" y2="124"/>
        <line x1="114" y1="20" x2="114" y2="124"/><line x1="154" y1="20" x2="154" y2="124"/>
        <line x1="194" y1="20" x2="194" y2="124"/><line x1="234" y1="20" x2="234" y2="124"/>
        <line x1="274" y1="20" x2="274" y2="124"/><line x1="314" y1="20" x2="314" y2="124"/>
        <line x1="354" y1="20" x2="354" y2="124"/><line x1="394" y1="20" x2="394" y2="124"/>
      </g>
      <g class="tx tx-sm" fill="var(--ink-3)">
        <text x="2" y="46">NRZ</text>
        <text x="2" y="76">曼彻斯特</text>
        <text x="2" y="106">差分曼彻斯特</text>
      </g>
      <g stroke-width="2" fill="none" stroke-linejoin="round">
        <path stroke="var(--ink-2)" d="M74 52 H114 V34 H154 V52 H194 H234 V34 H274 H314 V52 H354 V34 H394"/>
        <path stroke="var(--net)" d="M74 64 H94 V82 H134 V64 H174 V82 H194 V64 H214 V82 H254 V64 H274 V82 H294 V64 H334 V82 H374 V64 H394"/>
        <path stroke="var(--warn)" d="M74 94 V112 H94 V94 H134 V112 H154 V94 H174 V112 H194 V94 H214 V112 H254 V94 H274 H294 V112 H314 V94 H334 V112 H354 H374 V94 H394"/>
      </g>
      <g class="tx tx-b" fill="var(--ink)">
        <text x="91" y="140">0</text><text x="131" y="140">1</text><text x="171" y="140">0</text><text x="211" y="140">0</text>
        <text x="251" y="140">1</text><text x="291" y="140">1</text><text x="331" y="140">0</text><text x="371" y="140">1</text>
      </g>
    </svg>
    <p class="fig-cap">01001101 的 NRZ、曼彻斯特与差分曼彻斯特编码（左端为发送起点）</p>
    </figure>`,
    explanation: `要点：NRZ 整位平顶；曼彻斯特每位中间必跳变且跳变方向代表位值；差分曼彻斯特看位开始处有无跳变（有跳变为 0，无跳变为 1）。`,
    tags: [{ deck: 3, sec: 'sec-ch3-process-h2', text: '信道编码' }],
  },
  {
    id: 'p1-e12',
    kind: 'essay',
    question: '在某数据通信系统中使用CRC检验，若：（1）生成多项式为：X<sup>4</sup>+X<sup>3</sup>+X+1。（2）发送端所发数据为11001100。如果无传输错误，则应正确收到的数据（含CRC码）是什么？（需要写出过程）',
    answer: `
    <p>G(x) = x<sup>4</sup>+x<sup>3</sup>+x+1 为 4 次多项式，对应二进制 <strong>11011</strong>，r = 4。</p>
    <p>① 信息位串 11001100 后补 4 个 0，得被除数 <strong>110011000000</strong>（对应 x<sup>4</sup>M(x)）；</p>
    <p>② 模 2 除法（逐位异或）：</p>
    <pre class="code">被除数 110011000000，除数 11011（逐位模 2 异或）
起始位   当前 5 位       操作后 5 位    商位
  0      11001       ⊕11011→00010      1
  1      00101       首位为 0          0
  2      01010       首位为 0          0
  3      10100       ⊕11011→01111      1
  4      11110       ⊕11011→00101      1
  5      01010       首位为 0          0
  6      10100       ⊕11011→01111      1
  7      11110       ⊕11011→00101      1
商为 10011011；最终保留低 4 位：余数 R = 0101</pre>
    <p>③ 余数 R(x) = x<sup>2</sup>+1（因为 0101 对应 x²+1），CRC 码为 <strong>0101</strong>；</p>
    <p>④ 发送的码字 T(x) = x<sup>4</sup>M(x) + R(x) = <strong>11001100 0101</strong>。</p>
    <p>验证：110011000101 ÷ 11011 余数为 0，译码判为无错。∴ 无传输错误时应正确收到 <strong>110011000101</strong>。</p>`,
    explanation: `要点：补 4 个 0 → 模 2 除（异或）得余数 0101 → 余数拼在信息位后；接收端用同一 G(x) 除尽即无错。`,
    tags: [{ deck: 4, sec: 'sec-ch4-error-h4', text: 'CRC 编码与译码' }],
  },
  {
    id: 'p1-e13',
    kind: 'essay',
    question: '设有某网201.96.28.0（1）将其划成6个逻辑子网，划分完之后损失了多少IP。（2）写出每个子网的起始和结束IP。（3）写出子网掩码。',
    answer: `
    <p>201.96.28.0 是 C 类地址。划 6 个逻辑子网需借 3 位主机号（2<sup>3</sup> = 8 ≥ 6），子网掩码为 <strong>255.255.255.224</strong>（/27）。</p>
    <p><strong>（2）</strong>按旧式子网号限制，子网号 001～110 共 6 个子网，每子网 32 个地址（块大小 32），每子网主机范围去掉网络地址与广播地址：</p>
    <table class="tbl">
      <thead><tr><th>子网</th><th>子网地址</th><th>起始 IP</th><th>结束 IP</th></tr></thead>
      <tbody>
        <tr><td>001</td><td>201.96.28.32</td><td>201.96.28.33</td><td>201.96.28.62</td></tr>
        <tr><td>010</td><td>201.96.28.64</td><td>201.96.28.65</td><td>201.96.28.94</td></tr>
        <tr><td>011</td><td>201.96.28.96</td><td>201.96.28.97</td><td>201.96.28.126</td></tr>
        <tr><td>100</td><td>201.96.28.128</td><td>201.96.28.129</td><td>201.96.28.158</td></tr>
        <tr><td>101</td><td>201.96.28.160</td><td>201.96.28.161</td><td>201.96.28.190</td></tr>
        <tr><td>110</td><td>201.96.28.192</td><td>201.96.28.193</td><td>201.96.28.222</td></tr>
      </tbody>
    </table>
    <p><strong>（1）</strong>原 C 类网可分配主机地址 254 个；划分后 6 个子网各提供 30 个主机地址，共 180 个——损失 <strong>254 − 180 = 74</strong> 个 IP
      （此处的 74 表示按旧规则仅分配上述 6 个子网后，相对原 /24 的 254 个可用主机地址，无法在这 6 个子网内分配的地址数：12 个是这 6 个子网各自的网络/广播地址，另 62 个来自旧规则禁用的两块子网。若按现代规则把 8 个 /27 子网全部使用，共有 8×30=240 个可用主机地址，真正因新增网络/广播保留而减少的是 254−240=14 个；未分配的地址块不等于永久损失）。</p>`,
    explanation: `要点：借 3 位 → /27 掩码 255.255.255.224；块大小 32，每个子网可用 30 个主机地址。按旧教材仅用 001～110 六块计算为 254−180=74（含旧规则未使用的两块）；现代八块全部可用时，总可分配 240 个主机地址，相对 /24 的损失是 14。`,
    tags: [{ deck: 5, sec: 'sec-ch5-ip-h3', text: '子网划分' }],
  },
];

const paper: NetPaper = {
  id: 'paper-2021',
  title: '2021～2022 学年第二学期期末试卷',
  source: '《计算机网络》2021-2022学年第二学期期末试卷-有答案.pdf',
  answerSource: '选择题为原卷勾选答案；简答与应用题为课件整理参考答案',
  meta: '单选 14 × 2 分 · 名词解释 5 × 2 分 · 简答 30 分 · 应用 32 分',
  sections: [
    { title: '一、单项选择题', short: '单选', questionIds: ['p1-s1', 'p1-s2', 'p1-s3', 'p1-s4', 'p1-s5', 'p1-s6', 'p1-s7', 'p1-s8', 'p1-s9', 'p1-s10', 'p1-s11', 'p1-s12', 'p1-s13', 'p1-s14'] },
    { title: '二、名词解释题', short: '名词解释', questionIds: ['p1-e1', 'p1-e2', 'p1-e3', 'p1-e4', 'p1-e5'] },
    { title: '三、简答题', short: '简答', questionIds: ['p1-e6', 'p1-e7', 'p1-e8', 'p1-e9'] },
    { title: '四、应用题', short: '应用', questionIds: ['p1-e10', 'p1-e11', 'p1-e12', 'p1-e13'] },
  ],
  questions,
};

export default paper;

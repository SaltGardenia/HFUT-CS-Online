/* 计算机网络试卷 · 2024～2025 学年第一学期期末（A 卷）—— 依据「试题/期末/《计算机网络》2024-2025学年第一学期期末试卷.pdf」扫描件整理。
 * 原卷未附答案，参考答案由本站依据课件整理。 */
import type { NetPaper, PracticeQuestion } from './types';

const questions: PracticeQuestion[] = [
  /* ---------------- 一、单项选择题（每题 2 分，共 40 分） ---------------- */
  {
    id: 'p3-s1',
    kind: 'single',
    question: '计算机网络是分布在不同地理位置的多个独立的（　）的集合。',
    options: ['局域网系统', '多协议路由器', '操作系统', '自治计算机'],
    answer: 'D',
    explanation: '计算机网络定义：将若干台具有<strong>独立功能</strong>的计算机系统（自治计算机——各自运行独立操作系统、地位平等无主从之分），用通信介质连接起来，通过网络协议在数据交换的基础上实现资源共享的系统。',
    tags: [{ deck: 1, sec: 'sec-ch1-definition', text: '计算机网络的定义' }],
  },
  {
    id: 'p3-s2',
    kind: 'single',
    question: '用于网络互联的设备一般采用（　）。',
    options: ['中继器', '交换机', '路由器', '网关'],
    answer: 'C',
    explanation: '路由器是网络核心中最主要的设备，工作在网络层，负责存储转发与路由选择，是异构网络互联的标准设备。',
    tags: [{ deck: 1, sec: 'sec-ch1-work-h2', text: '路由器' }],
  },
  {
    id: 'p3-s3',
    kind: 'single',
    question: '在模拟音频信道上传输数字信号，必须使用（　）。',
    options: ['编码器', '加密器', '调制解调器', '复用器'],
    answer: 'C',
    explanation: '若选用模拟信道，需要在发送端将数字信号变换成模拟信号（调制）、接收端还原成数字信号（解调）——由调制解调器 MODEM 完成。',
    tags: [{ deck: 3, sec: 'sec-ch3-basic-h2', text: '调制与解调' }],
  },
  {
    id: 'p3-s4',
    kind: 'single',
    question: '完成路径选择功能是在 OSI 模型的（　）。',
    options: ['物理层', '数据链路层', '网络层', '传输层'],
    answer: 'C',
    explanation: '网络层通过路由选择算法为分组通过通信子网选择最适当的路径——路径选择是网络层的核心功能。',
    tags: [{ deck: 2, sec: 'sec-ch2-osi-h3', text: '网络层' }],
  },
  {
    id: 'p3-s5',
    kind: 'single',
    question: '网络协议是计算机网络和分布系统中互相通信的（　）间交换信息时必须遵守的规则的集合。',
    options: ['相邻层实体', '对等层实体', '同一层实体', '不同层实体'],
    answer: 'B',
    explanation: '协议控制<strong>对等层</strong>实体间进行数据交换——「协议是水平的」，只存在于对等实体之间。',
    tags: [{ deck: 2, sec: 'sec-ch2-arch-h2', text: '实体与协议' }],
  },
  {
    id: 'p3-s6',
    kind: 'single',
    question: '第三代计算机网络的主要特点是（　）。',
    options: [
      '计算机-计算机网络',
      '以单机为中心的联机系统',
      '国际网络体系结构标准化',
      '基于个人计算机的局域网',
    ],
    answer: 'C',
    explanation: '计算机网络发展的第三个阶段是开放式标准化网络——具有统一的网络体系结构、遵守国际标准化协议（如 OSI 参考模型、TCP/IP 协议族），即国际网络体系结构标准化。',
    tags: [{ deck: 1, sec: 'sec-ch1-history', text: '开放式标准化网络' }],
  },
  {
    id: 'p3-s7',
    kind: 'single',
    question: '数据链路层的数据单位称为（　）。',
    options: ['比特', '字节', '帧', '分组'],
    answer: 'C',
    explanation: '数据链路层的协议数据单元是帧（frame），封装网络层数据报；物理层为比特，网络层为分组。',
    tags: [
      { deck: 2, sec: 'sec-ch2-osi-h3', text: '各层 PDU' },
      { deck: 4, sec: 'sec-ch4-basic-h1', text: '帧' },
    ],
  },
  {
    id: 'p3-s8',
    kind: 'single',
    question: '下列哪一项最好的描述了循环冗余检验的特征（　）。',
    options: [
      '逐个的检查每一个字符',
      '查出 99%以上的差错',
      '查不出有偶数个数出错的差错',
      '不如海明码可靠',
    ],
    answer: 'B',
    explanation: 'CRC 是检错率极高的检错码——突发长度为 r+1 的突发错误检出率可达 (1 − 2<sup>−(r−1)</sup>)，突发长度大于 r+1 的检出率可达 (1 − 2<sup>−r</sup>)，如 r=16 时达 99.99% 以上。CRC 并非逐字符检查，也未必漏检偶数个错。',
    tags: [{ deck: 4, sec: 'sec-ch4-error-h4', text: 'CRC 检错能力' }],
  },
  {
    id: 'p3-s9',
    kind: 'single',
    question: '（　）是指将数字信号转变成可以在电话线上传输的模拟信号的过程。',
    options: ['解调', '采样', '调制', '压缩'],
    answer: 'C',
    explanation: '发送端把数字信号变换成适合模拟信道传输的模拟信号的过程是调制；接收端的反过程是解调；采样是信源编码的第一步。',
    tags: [
      { deck: 3, sec: 'sec-ch3-process-h3', text: '数字调制' },
      { deck: 3, sec: 'sec-ch3-basic-h2', text: '调制与解调' },
    ],
  },
  {
    id: 'p3-s10',
    kind: 'single',
    question: '利用模拟通信信道传输数据信号的方法称为（　）。',
    options: ['频带传输', '基带传输', '异步传输', '同步传输'],
    answer: 'A',
    explanation: '利用模拟信道传输数字信号需要先调制到载波频段上，这种方法称为频带传输；基带传输指直接传送原始基带电信号。',
    tags: [{ deck: 3, sec: 'sec-ch3-basic-h2', text: '数据传输类型' }],
  },
  {
    id: 'p3-s11',
    kind: 'single',
    question: 'Internet 网络层采用的服务模型是（　）。',
    options: ['电路交换', '报文交换', '数据报', '虚电路'],
    answer: 'C',
    explanation: 'IP 提供无连接的数据报服务——每个 IP 分组携带完整源/目的地址独立选路，不保证可靠、按序到达。',
    tags: [
      { deck: 5, sec: 'sec-ch5-vc-h2', text: '数据报' },
      { deck: 5, sec: 'sec-ch5-ip-h1', text: 'IP 服务模型' },
    ],
  },
  {
    id: 'p3-s12',
    kind: 'single',
    question: '如何标识一个网络通信的进程？（　）',
    options: ['IP 地址', 'MAC 地址', 'MAC 地址+端口号', 'IP 地址+端口号'],
    answer: 'D',
    explanation: '按本题四个选项，使用 IP 地址与端口号可标识网络通信的本地端点，选 D。但严格说这不能一般性地唯一标识某个操作系统进程：一个进程可持有多个套接字，多个进程也可能借助端口复用机制共享端口；完整 TCP 连接通常由源 IP、源端口、目的 IP、目的端口及协议语境标识。',
    tags: [{ deck: 6, sec: 'sec-ch6-overview-h3', text: '端口与 TSAP' }],
  },
  {
    id: 'p3-s13',
    kind: 'single',
    question: '主机 A 和 B 建立了一个 TCP 连接，A 向 B 连续发送了两个报文段，第一个报文段序号为 90，第二个报文段序号为 150。假设第一个报文段丢失，而第二个报文段正确到达 B，则 B 返回给 A 的报文中，确认号为（　）。',
    options: ['0', '150', '90', '240'],
    answer: 'C',
    explanation: '确认号是期望收到的下一个字节的序号。第一个报文段（90 起）丢失，B 只能期望从序号 90 开始接收——即使第二段（150 起）正确到达，累积确认的确认号仍为 90。',
    tags: [{ deck: 6, sec: 'sec-ch6-tcp-h2', text: '确认号字段' }],
  },
  {
    id: 'p3-s14',
    kind: 'single',
    question: '有一个 TCP 连接，最大报文段 MSS 长度为 2KB，拥塞窗口为 24KB 时发生快重传，采用快恢复算法，拥塞窗口大小为（　）。',
    options: ['1KB', '2KB', '12KB', '24KB'],
    answer: 'C',
    explanation: '按本课程《第七章传输层》课件第 132 页采用的简化快恢复模型，收到三个重复 ACK 后将拥塞窗口从 24 KB 减半为 12 KB，并进入拥塞避免，故选 C。注意该题采用课堂模型；在更细化的 TCP Reno 实现中，进入快恢复时还可能暂时将拥塞窗口增加 3 个 MSS，不能将各实现阶段的窗口值混同。',
    tags: [{ deck: 6, sec: 'sec-ch6-congestion-h3', text: '快重传与快恢复' }],
  },
  {
    id: 'p3-s15',
    kind: 'single',
    question: 'UDP 协议提供了（　）服务。',
    options: ['流量控制', '端口复用和分用', '连接管理', '拥塞控制'],
    answer: 'B',
    explanation: 'UDP 在 IP 数据报服务之上只增加了很少功能——端口的功能（复用与分用）和差错检测（校验和），不提供流量控制、连接管理与拥塞控制。',
    tags: [{ deck: 6, sec: 'sec-ch6-udp-h1', text: 'UDP 特点' }],
  },
  {
    id: 'p3-s16',
    kind: 'single',
    question: '关于 HTTP 协议，正确的是（　）。',
    options: [
      '采用 HTTP 协议，在通信之前需要建立应用层连接',
      'HTTP 协议本身是无状态的，服务端不记录客户端的信息',
      'HTTP 报文采用 UDP 进行传输',
      '采用持续连接的 HTTP 协议，连接永久打开',
    ],
    answer: 'B',
    explanation: 'HTTP 协议语义本身无状态，服务器不会仅凭两次请求之间的 HTTP 协议状态自动关联用户；Cookie 或会话机制可用于维护应用状态，因此按原卷口径 B 对。HTTP/1.1、HTTP/2 通常运行于 TCP，而 HTTP/3 通过 QUIC/UDP 传输；C 未限定 HTTP 版本，不能笼统说所有 HTTP 报文都采用 UDP。持续连接并非永久打开（D 错）；HTTP 通常不要求先建立独立的“应用层连接”（A 错）。',
    tags: [{ deck: 7, sec: 'sec-ch7-http-h2', text: 'HTTP 特点' }],
  },
  {
    id: 'p3-s17',
    kind: 'single',
    question: '关于 ARP 协议，下列说法正确的是（　）。',
    options: [
      'ARP 协议只能工作在同一个 LAN 中',
      '主机维持一个静态的 ARP 缓存',
      '主机广播发送 ARP 响应分组',
      'ARP 分组封装在 IP 数据报中发送',
    ],
    answer: 'A',
    explanation: '普通以太网中 ARP 报文直接封装为链路层帧（EtherType 0x0806），不会作为 IP 数据报载荷，故 D 错。ARP 缓存一般动态维护（B 错），ARP 请求通常广播、应答通常单播（C 错）。ARP 请求一般限定于本地二层广播域，不会被路由器跨网段转发；跨网段通信时主机会在本地链路解析下一跳网关的 MAC 地址，按本题 LAN 口径选 A。',
    tags: [
      { deck: 5, sec: 'sec-ch5-arp-h1', text: 'ARP 工作原理' },
      { deck: 5, sec: 'sec-ch5-arp-h2', text: 'ARP 报文' },
    ],
  },
  {
    id: 'p3-s18',
    kind: 'single',
    question: '关于以太网交换机，下列说法正确的是（　）。',
    options: [
      '交换机互连的以太网是一个冲突域',
      '交换机的转发表根据 IP 地址进行寻址',
      '交换机不隔离广播域',
      '交换机是一个物理层设备',
    ],
    answer: 'C',
    explanation: '交换机隔离冲突域但<strong>不隔离广播域</strong>——整个交换式网络仍是一个广播域（需 VLAN 划分广播域）。交换机是数据链路层设备（多接口网桥），转发表按 MAC 地址建立。',
    tags: [{ deck: 4, sec: 'sec-ch4-broadcast-h5', text: '以太网交换机' }],
  },
  {
    id: 'p3-s19',
    kind: 'single',
    question: '关于 BGP 协议，下列说法正确的是（　）。',
    options: [
      '用于一个 AS 内部的路由协议',
      'BGP 协议采用距离矢量路由算法',
      'BGP 报文交换的路由是 AS 之间',
      'BGP 协议只在边界路由器上运行',
    ],
    answer: 'C',
    explanation: 'BGP 是不同自治域（AS）间的外部网关协议，在相邻 AS 之间交换网络可达性信息（C 对）。BGP 是<strong>路径矢量（Path Vector）协议</strong>，与距离向量算法有历史联系，但并非 RIP 那样仅依据跳数更新的距离矢量算法（B 不准确）；它是域间协议而非域内协议（A 错）；D 所说“只在边界路由器上运行”不对：AS 内也可在非边界设备上建立 iBGP 会话，BGP 对等体不必物理直连。',
    tags: [{ deck: 5, sec: 'sec-ch5-protocol-h2', text: 'BGP 协议' }],
  },
  {
    id: 'p3-s20',
    kind: 'single',
    question: '主机的 IP 为 180.80.77.55，子网掩码 255.255.252.0。该主机所在网络的广播地址是（　）。',
    options: ['180.80.79.255', '180.80.78.255', '180.80.76.255', '180.80.77.255'],
    answer: 'A',
    explanation: '掩码 255.255.252.0 即 /22，第三字节块大小 4：77 = 01001101，落在 76（01001100）开始的 /22 块（76~79）。网络地址 180.80.76.0，主机位全置 1 得广播地址 <strong>180.80.79.255</strong>。',
    tags: [
      { deck: 5, sec: 'sec-ch5-ip-h3', text: '子网地址计算' },
      { deck: 5, sec: 'sec-ch5-ip-h5', text: 'CIDR 地址块' },
    ],
  },
  /* ---------------- 二、简答题（每题 5 分，共 5 题 25 分） ---------------- */
  {
    id: 'p3-e1',
    kind: 'essay',
    question: '在网络体系结构中，协议与服务的联系与区别。',
    answer: `
    <p><strong>定义</strong>：协议是控制对等层实体间进行数据交换的规则、约定和标准；服务是为保证上层对等实体间的通信，由下层向上层提供的功能。</p>
    <p><strong>区别</strong>：</p>
    <ul>
      <li><strong>方向不同</strong>——协议是水平的：影响范围仅限本层的对等实体之间；服务是垂直的：影响范围在上下相邻层之间。</li>
      <li><strong>可见性不同</strong>——上层实体只能看见下层提供的服务，看不见下层的协议；本层协议的实现要靠下层服务来支持，协议对上层是透明的。</li>
    </ul>
    <p><strong>联系</strong>：本层协议的实现依赖于下层提供的服务，同时本层协议又为上一层提供服务——协议是「实施」服务的基础，服务是协议对上的表现；二者配合完成对等层通信。</p>`,
    explanation: `要点：协议水平、服务垂直；上层只见服务不见协议；下层服务支撑本层协议、本层协议向上提供服务。`,
    tags: [
      { deck: 2, sec: 'sec-ch2-arch-h2', text: '实体协议服务' },
      { deck: 2, sec: 'sec-ch2-protocol', text: '网络协议' },
    ],
  },
  {
    id: 'p3-e2',
    kind: 'essay',
    question: '画出比特流 100101101 的曼彻斯特编码波形。',
    answer: `
    <p>比特序列 1 0 0 1 0 1 1 0 1（左端先发送），每位中间一次跳变——从高到低表示「0」，从低到高表示「1」：</p>
    <figure class="fig">
    <svg viewBox="0 0 420 90" role="img" aria-label="100101101 的曼彻斯特编码波形">
      <g stroke="var(--hairline-soft)" stroke-width="1">
        <line x1="30" y1="10" x2="30" y2="70"/>
        <line x1="70" y1="10" x2="70" y2="70"/><line x1="110" y1="10" x2="110" y2="70"/>
        <line x1="150" y1="10" x2="150" y2="70"/><line x1="190" y1="10" x2="190" y2="70"/>
        <line x1="230" y1="10" x2="230" y2="70"/><line x1="270" y1="10" x2="270" y2="70"/>
        <line x1="310" y1="10" x2="310" y2="70"/><line x1="350" y1="10" x2="350" y2="70"/>
        <line x1="390" y1="10" x2="390" y2="70"/>
      </g>
      <path stroke="var(--net)" stroke-width="2" fill="none" stroke-linejoin="round"
        d="M30 44 H50 V20 H70 H90 V44 H110 V20 H130 V44 H150 H170 V20 H190 H210 V44 H230 H250 V20 H270 V44 H290 V20 H310 H330 V44 H350 H370 V20 H390"/>
      <g class="tx tx-b" fill="var(--ink)">
        <text x="47" y="86">1</text><text x="87" y="86">0</text><text x="127" y="86">0</text><text x="167" y="86">1</text>
        <text x="207" y="86">0</text><text x="247" y="86">1</text><text x="287" y="86">1</text><text x="327" y="86">0</text>
        <text x="367" y="86">1</text>
      </g>
    </svg>
    <p class="fig-cap">100101101 的曼彻斯特编码（每位 40px，左端为发送起点）</p>
    </figure>`,
    explanation: `要点：每位中间必跳变，高→低为 0、低→高为 1；位 1 0 0 1 0 1 1 0 1 逐位给出前半反相、后半位值。`,
    tags: [{ deck: 3, sec: 'sec-ch3-process-h2', text: '曼彻斯特编码' }],
  },
  {
    id: 'p3-e3',
    kind: 'essay',
    question: '对于带宽为 50kHz 的信道，若有 16 种不同的物理状态来表示数据，信噪比为 20dB，问该信道最大的数据传输速率是多少？',
    answer: `
    <p><strong>① 奈奎斯特定理（无噪声）</strong>：16 种物理状态即每码元 16 个离散电平，V = 16，log<sub>2</sub>16 = 4：</p>
    <p class="formula">C<sub>1</sub> = 2B log<sub>2</sub>V = 2 × 50k × 4 = 400 kb/s</p>
    <p><strong>② 香农公式（有噪声）</strong>：信噪比 20dB 意味着 S/N = 10<sup>20/10</sup> = 100：</p>
    <p class="formula">C<sub>2</sub> = B log<sub>2</sub>(1 + S/N) = 50k × log<sub>2</sub>101 ≈ 50k × 6.66 ≈ 332.9 kb/s</p>
    <p><strong>③ 取两者中较小者</strong>：按本题采用的理想化计算模型，取两种理论上界中的较小者；实际可达速率还取决于调制、编码等条件——</p>
    <p class="formula">C = min(400, 332.9) ≈ <strong>332.9 kb/s</strong></p>`,
    explanation: `要点：16 状态 → 奈奎斯特 400kb/s；20dB → S/N=100 → 香农 ≈332.9kb/s；取小者 ≈332.9 kb/s。`,
    tags: [
      { deck: 3, sec: 'sec-ch3-basic-h1', text: '香农公式' },
      { deck: 3, sec: 'sec-ch3-basic-h3', text: '信道容量' },
    ],
  },
  {
    id: 'p3-e4',
    kind: 'essay',
    question: '路由器数据平面和控制平面的功能分别是什么？分别有哪些协议？',
    answer: `
    <p><strong>控制平面</strong>：负责「怎么建立路由表」——与相邻路由器交换路由信息，运行路由选择协议计算和生成路由表（决定分组从哪个端口转发）。</p>
    <ul>
      <li>域内（内部网关协议 IGP）：<strong>RIP</strong>（D-V 算法，基于跳数、UDP 520 端口）、<strong>OSPF</strong>（链路状态算法，Dijkstra 最短路径）、内部网关协议等；</li>
      <li>域间（外部网关协议）：<strong>BGP</strong>（路径矢量，利用 AS_PATH 等属性交换 AS 之间的网络可达性信息并执行策略路由）。</li>
    </ul>
    <p><strong>数据平面</strong>：负责「怎么转发分组」——对到达的每个 IP 分组，提取目的地址、计算/匹配网络前缀，查路由表执行最长前缀匹配，把分组从对应的最佳输出端口（下一跳）转发出去。</p>
    <p>数据平面使用转发表执行 IPv4 分组转发，包括 TTL 检查、下一跳确定与链路层封装；转发前可能需要利用 ARP 解析下一跳链路层地址。
    ICMP 用于差错报告或诊断，某些异常分组可能触发 ICMP 报文生成，但 <strong>ICMP 不是通常用来建立路由表的数据平面转发协议</strong>。
    控制平面主要运行 RIP、OSPF、BGP 等路由协议来获得路由；在教学比较中应区分转发动作、邻居解析以及异常报文生成。</p>`,
    explanation: `要点：控制平面通过 RIP/OSPF/BGP 等协议构建路由；数据平面负责 IP 分组的查表与转发，ARP 可辅助下一跳解析，ICMP 用于差错诊断，不能将三者都称为路由选择协议。`,
    tags: [
      { deck: 5, sec: 'sec-ch5-protocol', text: '路由协议' },
      { deck: 5, sec: 'sec-ch5-ip-h6', text: 'IP 分组路由' },
    ],
  },
  {
    id: 'p3-e5',
    kind: 'essay',
    question: '绘出 TCP 建立连接的三次握手过程（标志位、序号和确认号），建立连接的作用是什么？',
    answer: `
    <p><strong>三次握手过程</strong>（客户端 A、服务器 B）：</p>
    <ol>
      <li><strong>第一次</strong>：A → B。连接请求报文：SYN = 1，ACK = 0，选择初始序号 seq = x；</li>
      <li><strong>第二次</strong>：B → A。同意建立连接的同步确认报文：SYN = 1，ACK = 1，确认号 ack = x + 1，自己选择的序号 seq = y；</li>
      <li><strong>第三次</strong>：A → B。确认报文：ACK = 1（SYN 不再置 1），seq = x + 1，确认号 ack = y + 1。服务器收到确认后连接建立，双方 TCP 通知上层应用进程可以开始传送数据。</li>
    </ol>
    <p><strong>建立连接的作用</strong>：</p>
    <ul>
      <li>使通信双方都能够<strong>确知对方的存在</strong>；</li>
      <li>允许双方<strong>协商一些参数</strong>（如最大报文段长度 MSS、最大窗口大小、服务质量等）；</li>
      <li>能够对传输实体资源（如缓存大小、连接表中的项目等）进行<strong>分配</strong>。</li>
    </ul>`,
    explanation: `要点：SYN=1 seq=x → SYN=1 ACK=1 ack=x+1 seq=y → ACK=1 seq=x+1 ack=y+1；作用：确知对方存在、协商参数、分配传输实体资源。`,
    tags: [{ deck: 6, sec: 'sec-ch6-tcp-h3', text: '三次握手' }],
  },
  /* ---------------- 三、计算/论述题 ---------------- */
  {
    id: 'p3-e6',
    kind: 'essay',
    question: '主机 A 和 B 每个都通过 10Mbps 链路连接到交换机 S。在每条链路上的传播时延都是 20 微秒。S 是一个存储转发交换机，在它接收完一个分组后 35 微秒开始转发收到的分组。如果分组的大小是 500 比特，请计算把 50K 比特从 A 发送到 B 所需要的总时间。（7 分）',
    answer: `
    <p>已知：链路速率为 10 Mb/s，每个分组为 500 bit。通信中通常按十进制计算：50 kbit = 50 × 10<sup>3</sup> bit = 50000 bit，因此分组数为 <strong>50000 / 500 = 100 个</strong>。</p>
    <p><strong>基本量</strong>：</p>
    <ul>
      <li>每分组的发送时延 T<sub>D</sub> = 500 bit / 10 Mbps = 50 μs；</li>
      <li>每条链路传播时延 τ = 20 μs；</li>
      <li>交换机接收完一个分组到开始转发的处理时延 = 35 μs。</li>
    </ul>
    <p><strong>流水线分析</strong>：A 连续发送 100 个分组（每 50μs 一个）；交换机 S 接收完第 1 个分组后 35μs 才开始转发，之后以与输入相同的速率（每 50μs 一个分组）逐个转发，不会积压。</p>
    <p>① A 发送完最后一个分组：100 × 50 μs = 5000 μs；</p>
    <p>② S 接收完最后一个分组并开始转发它的时刻 = 5000 + 20（传播）+ 35（处理）= 5055 μs；</p>
    <p>③ S 转发最后一个分组：+50 μs → 5105 μs；</p>
    <p>④ 最后一个分组经 S→B 链路传播：+20 μs → <strong>5125 μs ≈ 5.125 ms</strong>。</p>
    <p>（若只计最后一个分组的端到端路径而不考虑流水线：50+20+35+50+20 = 175 μs——那是错的，因为分组要逐个通过交换机；正确答案是流水线充满后的总时间约 <strong>5.125 ms</strong>。）</p>`,
    explanation: `要点：发送时延 50μs/分组 ×100 = 5ms；末组经 20μs 传播 + 35μs 处理 + 50μs 交换机发送 + 20μs 传播 → 总时间约 5.125ms。`,
    tags: [
      { deck: 1, sec: 'sec-ch1-performance-h2', text: '发送与传播时延' },
      { deck: 1, sec: 'sec-ch1-work-h2', text: '存储转发' },
    ],
  },
  {
    id: 'p3-e7',
    kind: 'essay',
    question: '试述滑动窗口协议的基本原理，并比较基于该协议所产生的各种协议。（8 分）',
    answer: `
    <p><strong>基本原理</strong>：滑动窗口是一种流控方法，用于约束发送方可发送报文的数量——「窗口」是指发送方最多可发送未被确认报文的数量，「滑动」是指发送端根据确认结果推进窗口左边界，可一次跨过多个已确认帧；选择重传中收到失序确认不一定立即推进窗口。发送窗口内的帧才有资格发送；接收窗口内的帧序号才被接收；收发窗口按确认与递交逐格前移。</p>
    <p><strong>基于滑动窗口的三种协议</strong>（窗口尺寸、确认、缓存和重传策略均有差异）：</p>
    <table class="tbl">
      <thead><tr><th>协议</th><th>发送窗口</th><th>接收窗口</th><th>要点</th></tr></thead>
      <tbody>
        <tr><td>停—等协议</td><td>1</td><td>1</td><td>发送一帧后停止等待确认，简单，但传播时延相对发送时延较大时信道利用率较低（U = T<sub>D</sub>/(T<sub>D</sub>+RTT+T<sub>A</sub>)）</td></tr>
        <tr><td>回退 n（GO-Back-N）</td><td>&gt;1</td><td>1</td><td>连续发送 n 帧不出错时信道利用率高；最早未确认帧超时后重传该帧及随后仍未确认的帧；接收方仅按序接收，不缓存失序帧</td></tr>
        <tr><td>选择重传</td><td>&gt;1</td><td>&gt;1</td><td>出错的帧单独重传，后面正确到达的帧先存入接收窗口，缓存开销大但重传少</td></tr>
      </tbody>
    </table>
    <p><strong>窗口尺寸的限制</strong>：在选择重传 ARQ 中，若帧序号位数为 m，应满足 <strong>W<sub>T</sub> + W<sub>R</sub> ≤ 2<sup>m</sup></strong>，防止新帧与旧帧重发混淆。通常让发送窗口 W<sub>T</sub> 不小于接收窗口 W<sub>R</sub> 以避免接收缓存闲置，但后者不是正确性所必须的限制。停等协议可以看作窗口都为 1 的特例。</p>`,
    explanation: `要点：窗口=未确认帧上限、滑动=确认后前移；停等(1,1)/回退n(>1,1)/选择重传(>1,>1)；WT+WR ≤ 2^m。`,
    tags: [
      { deck: 4, sec: 'sec-ch4-flow-h2', text: '滑动窗口协议' },
      { deck: 6, sec: 'sec-ch6-reliable-h3', text: '连续 ARQ' },
    ],
  },
  {
    id: 'p3-e8',
    kind: 'essay',
    question: '以太网链路层采用 CSMA/CD 协议解决冲突问题，试回答以下问题：（1）CD 的工作方式是什么？（2）假设 1km 长的以太网，数据率为 1Gb/s，信号在信道上的传播速度变为 2×10<sup>8</sup>m/s，试计算其最短帧长。（10 分）',
    answer: `
    <p><strong>（1）CD（碰撞检测）的工作方式</strong>：结点<strong>边发送数据边检测</strong>信道上的信号电压大小——若多个结点同时发送数据，各结点信号电压叠加会使信道电压发生较大变化；当检测到信号电压变化值超过阈值时，就认为至少有两个结点同时在发送（发生了碰撞）。一旦发现碰撞，立即停止发送免得继续浪费网络资源，并发送若干比特<strong>干扰信号（jamming signal）</strong>通知其他结点，然后在等待一段随机时间（二进制指数退避）后再次发送。口诀：先听后说，边听边说，发生碰撞，随机避退。</p>
    <p><strong>（2）最短帧长计算</strong>：</p>
    <p>① 单程传播时延 τ = 1km / (2×10<sup>8</sup> m/s) = 1000 / 2×10<sup>8</sup> = 5 μs；</p>
    <p>② 争用期（碰撞窗口）= 2τ = 10 μs；</p>
    <p>③ 最短帧长 = 数据率 × 争用期 = 1 Gb/s × 10 μs = <strong>10000 bit（1250 字节）</strong>。</p>
    <p>含义：在题设的<strong>1 km、1 Gb/s 共享半双工 CSMA/CD 理想模型</strong>下，为在发送结束前发现远端碰撞，发送持续时间至少覆盖往返传播时延，所以得到 10000 bit 的<strong>理论最短发送长度</strong>。
    但不能将此直接当作真实 IEEE 802.3 以太网 MAC 的最小合法帧长：标准以太网 MAC 帧的最小长度仍为 <strong>64 字节</strong>；经典半双工千兆以太网还采用载波延伸，实际允许的碰撞域长度也受标准约束。因而“凡短于 1250 字节的以太网帧都无效”是错误结论。</p>`,
    explanation: `要点：CD=边发边检、碰撞即停并发 jamming 信号再指数避退；τ=5μs，2τ=10μs，最短帧长=1Gb/s×10μs=10000bit。`,
    tags: [{ deck: 4, sec: 'sec-ch4-broadcast-h2', text: 'CSMA/CD' }],
  },
  {
    id: 'p3-e9',
    kind: 'essay',
    question: '某单位分配到一个地址块 114.48.172.0/24，需要划分 3 个子网，其中 1 个子网需容纳 100 台主机，另外两个子网各容纳 50 台主机。试回答以下问题：（1）子网划分的目的是什么？（2）给出每个子网的网络前缀，采用前缀的形式描述（给出分配过程）；（3）每个子网可容纳的最大主机数是多少？给出每个子网可分配给主机使用的最小地址和最大地址。（10 分）',
    answer: `
    <p><strong>（1）子网划分的目的</strong>：将一个大的 IP 网络划分成几个较小的子网，多个物理网共享同一个 IP 网络前缀——便于按部门/需求分配地址、缩小广播域、提高地址利用率并便于路由管理（对外仍表现为一个网络）。</p>
    <p><strong>（2）分配过程</strong>：需求为 100、50、50 台主机。主机号位数：100 ≤ 2<sup>7</sup>−2（126），需 7 位主机号 → 前缀 /25；50 ≤ 2<sup>6</sup>−2（62），需 6 位 → 前缀 /26。</p>
    <table class="tbl">
      <thead><tr><th>子网</th><th>网络前缀</th><th>容量</th></tr></thead>
      <tbody>
        <tr><td>子网 1（100 台）</td><td>114.48.172.0/25</td><td>2<sup>7</sup>−2 = 126</td></tr>
        <tr><td>子网 2（50 台）</td><td>114.48.172.128/26</td><td>2<sup>6</sup>−2 = 62</td></tr>
        <tr><td>子网 3（50 台）</td><td>114.48.172.192/26</td><td>2<sup>6</sup>−2 = 62</td></tr>
      </tbody>
    </table>
    <p><strong>（3）可分配地址范围</strong>（每子网去掉主机号全 0 的网络地址与全 1 的广播地址）：</p>
    <table class="tbl">
      <thead><tr><th>子网</th><th>最大主机数</th><th>最小地址</th><th>最大地址</th></tr></thead>
      <tbody>
        <tr><td>114.48.172.0/25</td><td>126</td><td>114.48.172.1</td><td>114.48.172.126</td></tr>
        <tr><td>114.48.172.128/26</td><td>62</td><td>114.48.172.129</td><td>114.48.172.190</td></tr>
        <tr><td>114.48.172.192/26</td><td>62</td><td>114.48.172.193</td><td>114.48.172.254</td></tr>
      </tbody>
    </table>`,
    explanation: `要点：100→/25、50→/26；三个前缀 114.48.172.0/25、114.48.172.128/26、114.48.172.192/26；容量 126/62/62，首尾地址各去掉网络与广播地址。`,
    tags: [
      { deck: 5, sec: 'sec-ch5-ip-h3', text: '子网划分' },
      { deck: 5, sec: 'sec-ch5-ip-h4', text: 'VLSM' },
    ],
  },
];

const paper: NetPaper = {
  id: 'paper-2024',
  title: '2024～2025 学年第一学期期末试卷（A 卷）',
  source: '《计算机网络》2024-2025学年第一学期期末试卷.pdf',
  answerSource: '本站整理参考答案（原卷为扫描件未附答案）',
  meta: '单选 20 × 2 分 · 简答 5 × 5 分 · 计算/论述 4 题 35 分',
  sections: [
    { title: '一、单项选择题', short: '单选', questionIds: ['p3-s1', 'p3-s2', 'p3-s3', 'p3-s4', 'p3-s5', 'p3-s6', 'p3-s7', 'p3-s8', 'p3-s9', 'p3-s10', 'p3-s11', 'p3-s12', 'p3-s13', 'p3-s14', 'p3-s15', 'p3-s16', 'p3-s17', 'p3-s18', 'p3-s19', 'p3-s20'] },
    { title: '二、简答题', short: '简答', questionIds: ['p3-e1', 'p3-e2', 'p3-e3', 'p3-e4', 'p3-e5'] },
    { title: '三、计算与论述题', short: '计算论述', questionIds: ['p3-e6', 'p3-e7', 'p3-e8', 'p3-e9'] },
  ],
  questions,
};

export default paper;

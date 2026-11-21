/* 计算机网络 · 第1章 概论 —— 依据「课件/PPT-2024/第一章概论.pptx」整理 */
import type { NetChapter } from './types';

const ch: NetChapter = {
  id: 'ch1',
  no: '第1章',
  title: '概论',
  subtitle: '第 1 章 · 概论',
  lede: `
  本章回答「什么是计算机网络」。计算机网络是<strong>计算机技术与通信技术相结合</strong>的产物：
        从 ARPANET 起步，经历远程联机系统、计算机—计算机网络、开放式标准化网络三个阶段；
        按地理范围与拓扑结构分类，由网络边缘的主机与网络核心的路由器分工协作，以<strong>数据交换</strong>实现<strong>资源共享</strong>。
`,
  toc: [
    { id: 'sec-ch1-history', text: '1. 计算机网络的产生和发展', level: 2 },
    { id: 'sec-ch1-definition', text: '2. 计算机网络的定义', level: 2 },
    { id: 'sec-ch1-classify', text: '3. 计算机网络的分类', level: 2 },
    { id: 'sec-ch1-classify-h1', text: '★ 按地理范围分类', level: 3 },
    { id: 'sec-ch1-classify-h2', text: '★ 按拓扑结构分类', level: 3 },
    { id: 'sec-ch1-work', text: '4. 计算机网络的运行过程', level: 2 },
    { id: 'sec-ch1-work-h1', text: '网络边缘的主机系统：C/S 与 P2P', level: 3 },
    { id: 'sec-ch1-work-h2', text: '网络核心中的路由器与数据交换', level: 3 },
    { id: 'sec-ch1-work-h3', text: '★ 电路交换、报文交换与分组交换', level: 3 },
    { id: 'sec-ch1-performance', text: '5. 计算机网络的性能指标', level: 2 },
    { id: 'sec-ch1-performance-h1', text: '★ 速率、带宽与吞吐量', level: 3 },
    { id: 'sec-ch1-performance-h2', text: '★ 时延', level: 3 },
    { id: 'sec-ch1-performance-h3', text: '★ 利用率', level: 3 },
    { id: 'sec-ch1-internet', text: '6. 因特网概述', level: 2 },
    { id: 'sec-ch1-trend', text: '7. 计算机网络的发展趋势', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ch1-history',
      heading: '1. 计算机网络的产生和发展',
      blocks: [
        {
          type: 'html',
          html: `
          <div class="callout key">
            <p class="callout-h">本章荧光笔重点</p>
            <p><strong>网络定义及组成</strong> · <strong>资源子网/通信子网</strong> · <strong>拓扑结构</strong> · <strong>LAN/MAN/WAN</strong> · <strong>电路/报文/分组交换</strong> · <strong>速率/带宽/单位</strong> · <strong>时延/RTT</strong></p>
          </div>
          <p>
            计算机网络是<strong>计算机技术与通信技术的产物</strong>。世界上最早的计算机网络
            <strong>ARPANET</strong>（Internet 的前身）由美国国防部高级计划研究署（Advanced Research Projects Agency, ARPA）研制，
            于 <strong>1969 年开通</strong>。最初仅连接美国本土的四个主机系统（加州大学洛杉矶分校、加州大学圣塔芭芭拉分校、斯坦福研究所、犹他大学），
            随后网络规模不断扩大，并由最初的纯军事网络演变成为面向教育、科研、商业的全球性网络。
          </p>
          <p>计算机网络的发展经历了三个阶段：</p>
          <table class="tbl">
            <thead>
              <tr><th>阶段</th><th>时间</th><th>标志</th></tr>
            </thead>
            <tbody>
              <tr><td>远程联机系统</td><td>五十年代中期—六十年代中期</td><td>终端—计算机</td></tr>
              <tr><td>计算机—计算机网络</td><td>六十年代末—七十年代末</td><td>计算机—计算机</td></tr>
              <tr><td>开放式标准化网络</td><td>八十年代—至今</td><td>统一体系结构、国际标准</td></tr>
            </tbody>
          </table>
          <p>
            <strong>远程联机系统</strong>：多个远程终端用户可以同时向主机系统提交程序和命令。程序和命令通过通信线路传递到
            <strong>FEP</strong>（Front End Processor，前端处理机，通常由一台廉价的计算机担任，完成通信任务），由 FEP 进行差错控制和流量控制，
            并按一定次序向主机递交；主机依次处理，并将结果返回给 FEP，由 FEP 送到各相应终端。
            <strong>M</strong>（Modem，调制解调器）使数字信号转化为模拟信号以便在模拟信道上传输；
            <strong>TC</strong>（Terminal Controller，终端控制器）将多条低速线路汇集到一条高速线路上，从而提高了高速线路的利用率。
          </p>
          <p>典型应用：美国通用公司的 <strong>GE 网络</strong>（当时世界上最大的面向终端网络，覆盖美国本土、欧洲大部分、加拿大、日本及澳大利亚）；
            美国航空公司的飞机票预定系统 <strong>SABRE</strong>（由一台中心计算机和 2000 多个终端组成）。</p>
          <p>
            <strong>计算机—计算机网络</strong>：逻辑功能上网络划分为——
            <strong>通信子网</strong>由路由器和通信链路组成，完成网络通信任务（链路提供物理信道；路由器是一种专用计算机，具有存储转发、路由选择、差错控制、流量控制等功能）；
            <strong>资源子网</strong>由连接到通信子网的服务器和主机系统组成，为网络用户提供各种软硬件共享资源和数据处理能力
            （硬件共享资源包括 CPU、存储器、硬盘、磁带、打印机、绘图仪等；软件共享资源包括操作系统、数据库系统、工具软件和应用程序等）。
          </p>
          <p>
            与远程联机系统的<strong>本质区别</strong>：计—计网络以<strong>资源共享</strong>为目标，在网络协议的支持下，
            用户使用远方计算机系统的资源就好像使用本地计算机系统一样方便，几乎觉察不到地理位置的差别。
          </p>
          <p>
            <strong>开放式标准化网络</strong>：具有统一的网络体系结构，遵守国际标准化协议，便于网络互连、大规模生产、降低成本。如：
            <strong>OSI 参考模型</strong>、<strong>CCITT 建议</strong>、<strong>TCP/IP 协议族</strong>。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-definition',
      heading: '2. 计算机网络的定义',
      blocks: [
        {
          type: 'html',
          html: `
          <p>到目前为止，计算机网络尚未形成严格的定义，原因：</p>
          <ul>
            <li>计算机网络在不断发展，新的网络技术和网络产品不断涌现；</li>
            <li>各种规模的计算机网络（WAN、MAN、LAN）在体系结构、连接方式、硬件组成和通信方式的功能上差异较大；</li>
            <li>网络产品生产厂家出于商品利益考虑，在文字宣传上并非完全统一。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">定义</p>
            <p>
              将若干台具有<strong>独立功能</strong>的计算机系统，用某种或多种通信介质连接起来，通过完善的<strong>网络协议</strong>，
              在<strong>数据交换</strong>的基础上，实现<strong>网络资源共享</strong>的系统称为计算机网络。
            </p>
          </div>
          <ul>
            <li>「<strong>独立</strong>」的含义：每台计算机都可运行各自独立的操作系统，各计算机系统之间的地位平等，无主从之分，任何一台计算机不能干预或强行控制其他计算机的正常运行。</li>
            <li><strong>数据交换</strong>是网络的最基本功能，各种资源共享都是建立在数据交换的基础上的。</li>
            <li><strong>资源共享</strong>是网络最终目的。</li>
          </ul>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-classify',
      heading: '3. 计算机网络的分类',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch1-classify-h1">按地理范围分类</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜LAN、MAN、WAN</p>
            <p>按覆盖范围区分局域网、城域网、广域网，熟悉典型应用及网络互连。</p>
          </div>
          <table class="tbl">
            <thead>
              <tr><th>类别</th><th>覆盖范围</th><th>典型场景</th></tr>
            </thead>
            <tbody>
              <tr><td>局域网 LAN（Local Area Network）</td><td>一般不超过数公里</td><td>通常安装在一幢大楼内、大学校园内或厂区内</td></tr>
              <tr><td>城域网 MAN（Metropolitan Area Network）</td><td>一个大城市，大约数十公里到上百公里</td><td>城市范围</td></tr>
              <tr><td>广域网 WAN（Wide Area Network）</td><td>一般在数百公里以上</td><td>Internet 就是目前最大的广域网</td></tr>
            </tbody>
          </table>
          <h3 id="sec-ch1-classify-h2">按拓扑结构分类</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜总线与星形拓扑</p>
            <p>总线型共享传输介质、故障隔离困难；星形便于维护与扩展，但依赖中心设备。</p>
          </div>
          <p>
            拓扑学（Topology）是数学中的一个重要分支，研究的几何图形或空间在连续改变形状后还能保持不变的一些性质，
            最著名的例子是欧拉提出的「哥尼斯堡七桥问题」。<strong>计算机网络拓扑</strong>是指通信子网节点间连接结构的拓扑形式，
            通过结点与线段间的几何关系表示网络结构，反映网络中各实体的结构关系。
          </p>
          <table class="tbl">
            <thead>
              <tr><th>拓扑</th><th>连接方式</th><th>可靠性特点</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>星型网</strong></td>
                <td>传输介质从一个中央结点向外辐射连接其他节点；任何两个结点之间的信息交换必须经过中央结点转发</td>
                <td>中央结点的可靠性十分重要，一旦中央结点发生故障，会引起整个网络瘫痪</td>
              </tr>
              <tr>
                <td><strong>环形网</strong></td>
                <td>所有结点通过传输介质连接成一个闭环，任何两个结点的数据交换必须沿环进行</td>
                <td>一旦结点或链路发生故障，则环路断开，导致网络瘫痪</td>
              </tr>
              <tr>
                <td><strong>总线网络</strong></td>
                <td>一条总线连接所有的结点，任何一个结点发送数据，其他节点都能收到；特点是<strong>共享信道</strong></td>
                <td>任何结点故障都不会影响整个网络正常运行</td>
              </tr>
              <tr>
                <td><strong>不规则型网</strong></td>
                <td>每个结点至少要和其他两个结点连接；布线灵活，几乎不受任何拓扑结构的约束</td>
                <td>任何一个结点或一条链路发生故障都不会影响网络的连通性</td>
              </tr>
            </tbody>
          </table>
          <div class="callout tip">
            <p class="callout-h">小结</p>
            <p>局域网：总线型、星型、环型；广域网：不规则型。点—点通信（独占信道）：星型、不规则型；多点通信（共享信道）：总线型、环型。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-work',
      heading: '4. 计算机网络的运行过程',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            在计算机网络运行过程中，网络边缘的<strong>主机系统</strong>和网络核心的<strong>路由器</strong>各自发挥着完全不同的作用：
            主机系统关心的是与其他计算机通信方式以及通信的内容；路由器关心的是如何把收到的数据包转发到目的主机。
          </p>
          <h3 id="sec-ch1-work-h1">网络边缘的主机系统：C/S 与 P2P</h3>
          <p>
            两个计算机系统进行通信实际上是指两个分别位于不同计算机系统中的<strong>程序之间</strong>进行通信。
            在网络边缘的端系统（End System）中运行的程序之间的通信方式通常可划分为两大类：
            <strong>客户服务器方式</strong>（C/S 方式）与<strong>对等方式</strong>（P2P 模式）。
          </p>
          <p>
            <strong>C/S 方式</strong>（Client/Server 的简称）：客户和服务器都是指通信中所涉及的两个<strong>应用进程</strong>，
            客户服务器方式所描述的是进程之间<strong>服务和被服务</strong>的关系——客户是服务的请求方，服务器是服务的提供方。
            客户 A 向服务器 B 发出服务请求，而服务器 B 向客户 A 提供服务。
          </p>
          <table class="tbl">
            <thead>
              <tr><th>软件</th><th>特点</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>客户软件</strong></td>
                <td>被用户调用后运行，在打算通信时<strong>主动向远地服务器发起通信</strong>（服务请求），因此客户程序必须知道服务器程序的地址；不需要特殊的硬件和很复杂的操作系统。</td>
              </tr>
              <tr>
                <td><strong>服务器软件</strong></td>
                <td>一种专门用来提供某种服务的程序，可同时处理多个远地或本地客户的请求；系统启动后即自动调用并一直不断地运行着，<strong>被动地等待</strong>并接受来自各地的客户的通信请求，因此服务器程序不需要知道客户程序的地址；一般需要强大的硬件和高级的操作系统支持。</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>对等连接方式</strong>（peer-to-peer，P2P）：两个主机在通信时并不区分哪一个是服务请求方还是服务提供方，
            只要两个主机都运行了对等连接软件（P2P 软件），它们就可以进行平等的、对等连接通信，双方都可以下载对方已经存储在硬盘中的共享文档。
            对等连接方式从本质上看<strong>仍然是使用客户服务器方式</strong>，只是对等连接中的每一个主机<strong>既是客户又同时是服务器</strong>：
            例如主机 C 请求 D 的服务时，C 是客户，D 是服务器；但如果 C 又同时向 F 提供服务，那么 C 又同时起着服务器的作用。
          </p>
          <h3 id="sec-ch1-work-h2">网络核心中的路由器与数据交换</h3>
          <p>
            网络核心是计算机网络（特别是因特网）中最复杂的部分，要向网络边缘中的大量主机提供连通性，
            使边缘部分中的任何一个主机都能够与其他主机通信。<strong>路由器</strong>（Router）是网络核心中最主要的设备，
            其主要功能是<strong>数据交换</strong>——接收来自源主机系统的数据，并向目的主机系统转发。
            在计算机网络中，路由器转发的数据称为<strong>数据分组</strong>（Packet Switching）。
          </p>
          <p>
            常见的数据交换方式可以分为两大类：<strong>电路（线路）交换方式</strong>（Circuit Switching）和
            <strong>存储转发交换方式</strong>（Store and Forward Switching）；存储转发方式又可以分为<strong>报文交换</strong>和<strong>报文分组交换</strong>。
          </p>
          <h3 id="sec-ch1-work-h3">电路交换、报文交换与分组交换</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜三种交换方式</p>
            <p>能说清建立连接/存储转发/分组切分的差别；结合典型传送过程比较等待与时延。</p>
          </div>

          <p>
            <strong>电路交换</strong>：电话网络是电路交换的典型例子。N 部电话机两两相连需 N(N−1)/2 对电线，电话机数量很大时电线对数与电话机数的平方成正比，
            因此要使用<strong>交换机</strong>来完成全网的交换任务。「交换」（switching）的含义就是<strong>转接</strong>——把一条电话线转接到另一条电话线，使它们连通起来；
            从通信资源的分配角度来看，「交换」就是按照某种方式<strong>动态地分配传输线路的资源</strong>。
          </p>
          <p>电路交换的特点：</p>
          <ul>
            <li><strong>面向连接</strong>的通信方式，有明确的通信「三阶段」：<strong>建立连接 → 数据交换 → 释放连接</strong>；</li>
            <li>通信期间<strong>独占</strong>构成连接的整个信道；</li>
            <li>通信双方必须在收发速率、编码方式、数据格式、传输控制等方面完全匹配；</li>
            <li>传输时延短，且时延稳定，<strong>实时性强</strong>；</li>
            <li><strong>信道利用率低</strong>。</li>
          </ul>
          <p>
            <strong>报文交换</strong>（Message Switching）采用存储转发方式：节点先把接收到的报文存储起来，并根据报文的目的地址选择适合的转发信道，
            当信道空闲时发送出去。理论上，只要存储时间足够长，就能够把信道忙碌和空闲的状态均匀化。
            基本原理：源节点将要发送报文的目的节点地址附加在报文上一起发送到网络中；网络节点（通常是路由器）根据报文上的目的地址把报文发送到下一个节点，
            一直逐个节点地转送到目的节点；每个节点在收到整个报文后，先存储报文并进行差错检错——若有错，丢弃报文并通知发送方；若无错，
            则利用路由信息找出合适的下一个节点，并向其传送整个报文。
          </p>
          <p>报文交换的主要特点：</p>
          <ul>
            <li>以「存储-转发」方式传输，每次转发仅占相邻结点间的信道；</li>
            <li>通信前无需建立连接，结束后也无需释放连接，可以随时发送报文，甚至通信双方无需同时在线；</li>
            <li>因缓存，不同速率的通信双方可以通信，同样也可以进行编码、格式等的转换；</li>
            <li>信道利用率比电路交换更高；</li>
            <li>时延大，不适合实时和交互式通信；</li>
            <li>报文过大或缓存不足时会丢弃报文。</li>
          </ul>
          <p>
            <strong>分组交换</strong>：在发送端，先把较长的报文划分成较短的数据段（有长度上限，但不同分组不必等长），每一个数据段前面添加上<strong>首部</strong>构成<strong>分组</strong>
            （请注意：左边是「前面」）。分组交换网以「分组」作为数据传输单元，依次把各分组发送到接收端。
            每一个分组的首部都含有<strong>地址等控制信息</strong>，分组交换网中的结点交换机根据收到的分组首部中的地址信息，把分组转发到下一个结点交换机，
            用这样的存储转发方式，最后分组就能到达最终目的地。接收端收到分组后剥去首部还原成报文，最后在接收端把收到的数据恢复成为原来的报文
            （这里假定分组在传输过程中没有出现差错，在转发时也没有被丢弃）。
          </p>
          <p>
            <strong>分组的存储转发过程</strong>：主机是为用户进行信息处理的，并向网络发送分组，从网络接收分组；路由器对分组进行存储转发，
            最后把分组交付目的主机。在路由器中的输入和输出端口之间没有直接连线，路由器处理分组的过程是：
            把收到的分组先放入<strong>缓存</strong>（暂时存储）→ 查找<strong>路由表</strong>，找出到某个目的地址应从哪个端口转发 → 把分组送到适当的端口转发出去。
          </p>
          <div class="callout key">
            <p class="callout-h">分组交换的优点与问题</p>
            <p><strong>优点</strong>——高效：动态分配传输带宽，对通信链路是逐段占用；灵活：以分组为传送单位和查找路由；
              迅速：不必先建立连接就能向其他主机发送分组；可靠：保证可靠性的网络协议与分布式的路由选择协议使网络有很好的生存性。</p>
            <p><strong>问题</strong>——分组在各结点存储转发时需要排队，这就会造成一定的时延；分组必须携带的首部（里面有必不可少的控制信息）也造成了一定的开销。</p>
          </div>
          <p><strong>三种交换技术的比较</strong>：</p>
          <table class="tbl">
            <thead>
              <tr><th>方式</th><th>要点</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>电路交换</strong></td>
                <td>在数据传送开始之前必须先设置一条专用的通路；在线路释放之前，该通路由一对用户完全占用。对于猝发式的通信，电路交换效率不高。</td>
              </tr>
              <tr>
                <td><strong>报文交换</strong></td>
                <td>报文从源点传送到目的地采用「存储-转发」的方式，在传送报文时，一个时刻仅占用一段通道；在交换节点中需要缓冲存储，报文需要排队，故报文交换不能满足实时通信的要求。</td>
              </tr>
              <tr>
                <td><strong>分组交换</strong></td>
                <td>交换方式和报文交换方式类似，但报文被分成分组传送，并规定了最大的分组长度。在数据报分组交换中，目的地需要重新组装报文；在虚电路分组交换中，数据传送之前必须通过虚呼叫设置一条虚电路。分组交换技术是计算机网络中使用最广泛的一种交换技术。</td>
              </tr>
            </tbody>
          </table>
          <p>
            从时序上看：电路交换经历「连接建立 → 数据传送（比特流直达终点）→ 连接释放」；
            报文交换的整个报文连续地「存储转发」经过各结点；分组交换把报文切成 P1、P2、P3… 各分组，在结点上存储转发后到达终点。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-performance',
      heading: '5. 计算机网络的性能指标',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ch1-performance-h1">速率、带宽与吞吐量</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜速率、带宽与单位</p>
            <p>网络速率以 bit/s 计；k、M、G 通常按 10³、10⁶、10⁹ 换算，存储容量的 K、M、G 常按 2¹⁰、2²⁰、2³⁰ 换算。</p>
          </div>
          <p>
            <strong>速率</strong>：比特（bit）是计算机中数据量的单位，也是信息论中使用的信息量的单位，来源于 binary digit，
            一个比特就是二进制数字中的一个 1 或 0。速率即数据率（data rate）或比特率（bit rate），是计算机网络中最重要的一个性能指标，
            单位是 b/s，或 kb/s、Mb/s、Gb/s 等。速率往往是指<strong>额定速率或标称速率</strong>。
          </p>
          <p>
            <strong>带宽</strong>（bandwidth）：本来是指信号具有的频带宽度，单位是赫（或千赫、兆赫、吉赫等）；
            现在「带宽」是数字信道所能传送的「<strong>最高数据率</strong>」的同义语，单位是「比特每秒」，即 b/s (bit/s)。
            更常用的带宽单位是千比每秒 kb/s（10<sup>3</sup> b/s）、兆比每秒 Mb/s（10<sup>6</sup> b/s）、吉比每秒 Gb/s（10<sup>9</sup> b/s）、
            太比每秒 Tb/s（10<sup>12</sup> b/s）。在时间轴上信号的宽度随带宽的增大而变窄——带宽为 1 Mb/s 时每秒 10<sup>6</sup> 个比特，
            带宽为 4 Mb/s 时每秒 4×10<sup>6</sup> 个比特。
          </p>
          <p>
            <strong>吞吐量</strong>（throughput）：表示在单位时间内通过某个网络（或信道、接口）的数据量。
            吞吐量更经常地用于对现实世界中的网络的一种测量，了解实际上到底有多少数据量能够通过网络；
            吞吐量受网络的带宽或网络的额定速率的限制。
          </p>
          <h3 id="sec-ch1-performance-h2">时延</h3>
          <div class="callout key">
            <p class="callout-h">重点 A｜发送时延 ≠ 传播时延</p>
            <p>发送时延 = 分组比特数 ÷ 发送速率；传播时延 = 链路长度 ÷ 传播速度。分辨速率、带宽、RTT 的物理意义再计算。</p>
          </div>

          <p>
            <strong>发送时延</strong>（传输时延）：是发送数据时，数据块从结点进入到传输介质所需要的时间，
            也就是从发送数据块的第一个比特算起，到该块的最后一个比特发送完毕所需的时间。
          </p>
          <p class="formula">发送时延 = 数据块长度（比特） / 信道带宽（比特/秒）</p>
          <p><strong>传播时延</strong>：是电磁波在信道中需要传播一定的距离而花费的时间。
            信号传输速率（即发送速率）和信号在信道上的传播速率是完全不同的概念。</p>
          <p class="formula">传播时延 = 信道长度（米） / 信号在信道上的传播速率（米/秒）</p>
          <p>
            <strong>处理时延</strong>：是交换结点为存储转发而进行一些必要的处理所花费的时间。
            <strong>排队时延</strong>：是结点缓存队列中分组排队所经历的时延，其长短往往取决于网络中当时的通信量。
            数据经历的总时延就是四种时延之和：
          </p>
          <p class="formula">总时延 = 发送时延 + 传播时延 + 处理时延 + 排队时延</p>
          <p>四种时延产生的地方：发送时延在发送器产生；传播时延在链路上产生；处理时延和排队时延在结点（路由器）中产生。</p>
          <div class="callout warn">
            <p class="callout-h">容易产生的错误概念</p>
            <p>对于高速网络链路，我们提高的仅仅是数据的<strong>发送速率</strong>而不是比特在链路上的<strong>传播速率</strong>。
              提高链路带宽只能减小数据的发送时延，并不能提高传播速率。</p>
          </div>
          <h3 id="sec-ch1-performance-h3">利用率</h3>
          <div class="callout tip">
            <p class="callout-h">重点 B｜RTT 与性能</p>
            <p>RTT 表示往返时间；分析网络性能时结合速率、时延及利用率，不能只看标称带宽。</p>
          </div>
          <p>
            <strong>信道利用率</strong>指出某个信道在测量周期内，数据占用的时间与整个测量周期时间之比，完全空闲的信道的利用率为零；
            <strong>网络利用率</strong>则是全网络的信道利用率的加权平均值。<strong>信道利用率并非越高越好</strong>。
          </p>
          <p>
            根据排队理论，当某个信道的利用率增大时，该信道引起的时延也就迅速增加。
            若令 D<sub>0</sub> 表示网络空闲时的时延，D 表示网络当前的时延，则在适当的假定条件下，可以用下面的简单公式表示 D 和 D<sub>0</sub> 之间的关系
            （U 是信道利用率，数值在 0 到 1 之间）：
          </p>
          <p class="formula">D = D<sub>0</sub> / (1 &minus; U)</p>
          <p>时延 D 随利用率 U 的增大而急剧增大——当 U 接近 1 时，时延急剧上升。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-internet',
      heading: '6. 因特网概述',
      blocks: [
        {
          type: 'html',
          html: `
          <p>
            <strong>网络的网络</strong>：网络（network）由若干结点（node）和连接这些结点的链路（link）组成；
            互联网是「<strong>网络的网络</strong>」（network of networks）——网络把许多计算机连接在一起，因特网则把许多网络连接在一起；
            连接在因特网上的计算机都称为<strong>主机</strong>（host）。起源于美国的因特网现已发展成为世界上最大的国际性计算机互联网。
          </p>
          <p><strong>因特网发展的三个阶段</strong>：</p>
          <table class="tbl">
            <thead>
              <tr><th>阶段</th><th>主要事件</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>第一阶段</strong>：从单个 ARPANET 向互联网发展</td>
                <td>
                  1950 年代末，美国国防部成立高级研究计划局（ARPA）；1962 年 ARPA 提出「星际计算机网络」设想；1969 年 10 月第一次实现两台计算机之间的通信；
                  1969 年 12 月由 UCLA、Stanford Research Institute、UCSB 和 University of Utah 四台主计算机相连的阿帕网诞生；
                  1973 年 ARPANET 首次跨越大西洋；<strong>1983 年 TCP/IP 协议簇成为 ARPANET 的标准协议，1983 年也被称为因特网元年</strong>。
                </td>
              </tr>
              <tr>
                <td><strong>第二阶段</strong>：构建三级结构的因特网</td>
                <td>
                  1980 年代初 ARPANET 分拆为军用与非军用网络，NSF 资助 CSNet 建设；1986 年 NSF 建成国家科学基金网 NSFNet，
                  逐渐形成主干网、地区网和园区网（校园网、企业网）的三级结构；1989 年发明万维网；1990 年 ARPANET 退役，NSFNet 成为互联网主干网络。
                </td>
              </tr>
              <tr>
                <td><strong>第三阶段</strong>：形成基于多层次 ISP 结构的因特网</td>
                <td>
                  1990 年代多个商业网络开始建设并快速发展，出现了不同领域、不同范围的因特网服务供应商（ISP）；
                  1993 年起多个商业互联网主干建成并逐渐取代 NSFNet；1995 年 NSFNet 停止运行；IP 地址、域名等管理权交给专门的非盈利组织。
                  至此，因特网完成了从军事网到教育科研网（精英网）再到商业、娱乐网（大众网）的变迁。
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Internet 和 internet 的区别</strong>：以小写字母 i 开始的 internet（互联网或互连网）是一个<strong>通用名词</strong>，
            泛指由多个计算机网络互连而成的网络；以大写字母 I 开始的 Internet（因特网）则是一个<strong>专用名词</strong>，
            指当前全球最大的、开放的、由众多网络相互连接而成的特定计算机网络，采用 TCP/IP 协议族作为通信的规则，其前身就是美国的 ARPANET。
          </p>
          <p>
            <strong>用户通过 ISP 上网</strong>：ISP（Internet Service Provider，因特网服务提供者）根据提供服务的覆盖面积大小以及所拥有的 IP 地址数目的不同，
            分为不同的层次。主机 A → 本地 ISP → 第二层 ISP → NAP → 第一层 ISP → NAP → 第二层 ISP → 本地 ISP → 主机 B。
          </p>
          <p>
            <strong>因特网的标准化工作</strong>：因特网协会 ISOC 下设因特网体系结构研究委员会 IAB；
            IAB 下分因特网工程部 IETF（由领域与工作组 WG 组成，下设因特网工程指导小组 IESG）
            与因特网研究部 IRTF（由研究组 RG 组成，下设因特网研究指导小组 IRSG）。
          </p>
          `,
        },
      ],
    },
    {
      id: 'sec-ch1-trend',
      heading: '7. 计算机网络的发展趋势',
      blocks: [
        {
          type: 'html',
          html: `
          <p>从通信网络本身来看，计算机网络今后的发展趋势大致会在以下几个方面：</p>
          <ul>
            <li>
              <strong>更快、更大、更远</strong>：随着通信科学与技术的发展，特别是光通信技术，计算机网络将在网络带宽、吞吐量、
              直接邻居距离等方面出现长足的进步，天地互连、深空传送等会更加成熟。
            </li>
            <li>
              <strong>更智能、更安全</strong>：人工智能、大数据、量子通信等科学技术的发展，将会促使计算机网络朝着更加智能
              （如拥塞控制、流量控制、路由选择等）和更加安全的方面发展。
            </li>
            <li>
              <strong>更广泛、更小型</strong>：智能材料、传感器、IOT、智能机械等科学技术的发展，将会促使计算机网络真正实现万物互联，
              人体网络（即体域网）、可穿戴网络、车联网等将进一步成熟。
            </li>
          </ul>
          `,
        },
      ],
    },
  ],
};

export default ch;

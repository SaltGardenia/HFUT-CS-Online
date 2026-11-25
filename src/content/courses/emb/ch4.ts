/* 第 4 章 嵌入式存储器系统 —— 依据课件（80 页）整理（课件 PDF 中文字体映射损坏，章节结构按课件目录与图页核对） */
import type { GenChapter } from '../types';

const ch4: GenChapter = {
  id: 'deck4',
  no: '第4章',
  title: '嵌入式存储器系统',
  subtitle: '存储器的类型 · 存储器系统结构 · 外部存储器芯片连接 · NOR Flash · NAND Flash · 存储器控制寄存器',
  lede:
    '<p>嵌入式系统的存储器层次与通用计算机相似，但更强调「启动介质」与「片外扩展」。本章按课件顺序讲：存储器的分类（按介质、按存取方式）、以 S3C2440 为例的存储器系统结构（Bank0～Bank7、NOR/NAND 启动、SDRAM 与片内 SRAM）、外部存储器芯片与处理器的引脚连接，以及 NOR Flash、NAND Flash 两类非易失存储器的特点与连接方式，最后是存储器控制寄存器的配置。</p>',
  toc: [
    { id: 'sec-emb4-type', text: '4.1 嵌入式存储器的类型', level: 2 },
    { id: 'sec-emb4-struct', text: '4.2 嵌入式存储器系统的结构', level: 2 },
    { id: 'sec-emb4-connect', text: '4.3 外部存储器芯片连接', level: 2 },
    { id: 'sec-emb4-nor', text: '4.4 NOR Flash 及其连接', level: 2 },
    { id: 'sec-emb4-nand', text: '4.5 NAND Flash 及其连接', level: 2 },
    { id: 'sec-emb4-reg', text: '4.6 存储器控制寄存器', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb4-type',
      heading: '4.1 嵌入式存储器的类型',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>按存储介质分类</strong>：<strong>半导体存储器</strong>是主流——采用大规模集成电路技术把大量存储单元制作在一个芯片中，使用最广泛，主要用作主存储器、高速缓冲存储器 Cache，甚至外部辅助存储器；<strong>光盘存储器</strong>利用介质材料的光效应，以被照射部分的平面（LAND）与凹坑（PIT）光反射率不同表示 0 或 1，主要用作辅助存储器；<strong>磁表面存储器</strong>采用磁矩材料作为磁记录载体，在磁场作用下使各个局部区域产生相应的磁化状态来记录 0 和 1。</p>
            <p><strong>按存取方式分类</strong>：</p>
            <table class="tbl">
              <thead><tr><th>类型</th><th>特点</th><th>典型用途</th></tr></thead>
              <tbody>
                <tr><td>随机存取存储器 RAM</td><td>可随机选中任一存储单元，可读可写，对每个单元的读写时间相同</td><td>主存储器、高速缓存</td></tr>
                <tr><td>顺序存取存储器 SAM</td><td>以文件或数据形式按顺序存放，不同地址的读写时间不同，容量大、价格低但速度慢</td><td>光盘等外存</td></tr>
                <tr><td>直接存取存储器 DAM</td><td>先指向一个区域，再在区域内顺序检索，存取时间与信息所在地址有关</td><td>磁盘</td></tr>
                <tr><td>只读存储器 ROM</td><td>使用前写入，运行时只能读出，断电后信息不丢失</td><td>存放系统固化程序</td></tr>
                <tr><td>闪速存储器 Flash</td><td>既可在不加电时长期保存信息，又能在线快速擦除与重写，兼具 ROM 与 RAM 的优点</td><td>BIOS、启动介质、数据存储</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-emb4-struct',
      heading: '4.2 嵌入式存储器系统的结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>以 S3C2440 为例，存储器系统由<strong>片内存储器</strong>、<strong>片外存储器</strong>与<strong>存储器控制器</strong>构成。片内有 Cache + SRAM（Steppingstone，启动用 4KB 内部 SRAM）；片外通过 8 个 Bank（Bank0～Bank7）扩展，每个 Bank 由 nGCS0～nGCS7 片选信号选中，可接 NOR Flash、SDRAM、网卡等设备。</p>
            <p><strong>启动方式</strong>有两种：从 <strong>NOR Flash</strong> 启动时，NOR 直接映射到 Bank0，程序可在 NOR 上原地执行；从 <strong>NAND Flash</strong> 启动时，硬件先把 NAND 的前 4KB 内容自动复制到片内 Steppingstone（映射到地址 0），由它开始执行，启动代码再把整个程序搬到 SDRAM 运行。这一机制使 NAND 这类不能随机寻址的存储器也能作为启动介质。</p>
            <p>存储器映射的要点：Bank0 的起始地址为 0x00000000；每个 Bank 有固定的基地址与可编程的访问宽度、等待周期；SDRAM 挂在 Bank6/Bank7 上，需要配置刷新周期与模式寄存器。系统上电后由启动代码完成这些配置，C 语言程序才能在 SDRAM 中运行。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb4-connect',
      heading: '4.3 外部存储器芯片连接',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件以「8 位存储器芯片构成 8 位存储器系统」为例说明连接方法（S3C2440）：</p>
            <ul>
              <li>存储器的 8 位数据线 <code>DQ₇～DQ₀</code> 与 S3C2440 的低 8 位数据总线 <code>DATA₇～DATA₀</code> 相连；</li>
              <li>存储器的地址线 <code>A₁、A₀…</code> 与 S3C2440 的地址总线 <code>ADDR₁、ADDR₀…</code> 相连；</li>
              <li>存储器的允许输出信号 <code>nOE</code> 端接 S3C2440 的 <code>nOE</code> 引脚；</li>
              <li>存储器的写信号 <code>nWE</code> 端接 S3C2440 的 <code>nWE</code> 引脚；</li>
              <li>存储器的片选信号 <code>nCE</code> 端接 S3C2440 的 <code>nGCSn</code> 引脚。</li>
            </ul>
            <p>连接时要考虑三件事：<strong>位宽</strong>——8 位、16 位、32 位器件的地址线接法不同（16 位器件常把处理器的 ADDR1 接到存储器的 A0）；<strong>容量与地址范围</strong>——由片选 Bank 的基地址与器件容量决定；<strong>时序</strong>——根据器件的访问速度配置等待周期。多片并联时可做位扩展（增加字长）或字扩展（增加容量），与通用计算机存储器的扩展原理一致。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb4-nor',
      heading: '4.4 NOR Flash 及其连接',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>NOR Flash</strong> 的特点是<strong>随机访问、按字节寻址</strong>，读写接口与 SRAM 类似，可以直接在其上执行代码（Execute In Place, XIP），因此常作为启动介质直接映射到 Bank0。缺点是写入与擦除速度慢、单位容量成本高、容量一般较小。</p>
            <p>连接方式与 SRAM 相同：地址线、数据线、<code>nOE</code>、<code>nWE</code>、<code>nCE</code> 一一对应，处理器可直接从 NOR 取指执行，无需搬运。对 NOR 的写操作需要先执行解锁与命令序列，按扇区擦除后再写入，不能像 RAM 一样随意改写。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb4-nand',
      heading: '4.5 NAND Flash 及其连接',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>NAND Flash</strong> 的特点是<strong>按页读写、按块擦除</strong>，不能随机按字节寻址，接口为复用的 I/O 线加命令锁存（CLE）、地址锁存（ALE）、片选（CE）、读使能（RE）、写使能（WE）、忙闲（R/B）等控制信号。NAND 的容量大、单位成本低、写入速度快，适合存放大量数据与文件系统，但不能原地执行代码。</p>
            <p>由于不能直接寻址，NAND 启动依赖处理器的 <strong>Steppingstone</strong> 机制：上电时硬件自动把 NAND 前 4KB 读到片内 SRAM 并从地址 0 开始执行，启动代码再完成剩余程序的搬运。NAND 还有两个固有问题：<strong>坏块</strong>（出厂即有坏块，需坏块管理）与<strong>位翻转</strong>（需 ECC 校验），因此文件系统（如 YAFFS、UBIFS）与驱动要配合处理。</p>
            <p><strong>NOR 与 NAND 的对比</strong>：NOR 可随机访问、可 XIP、可靠性高但容量小价格高；NAND 容量大、成本低、写入快但只能按页访问、需 ECC 与坏块管理。实际系统常用「NOR 存启动代码 + NAND 存文件系统」或「NAND 启动 + SDRAM 运行」的组合。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb4-reg',
      heading: '4.6 存储器控制寄存器',
      blocks: [
        {
          type: 'html',
          html: `
            <p>S3C2440 的存储器控制器通过一组寄存器配置 8 个 Bank：<strong>BWSCON</strong> 设置各 Bank 的数据总线宽度与等待状态使能；<strong>BANKCON0～BANKCON5</strong> 设置片选的建立/保持时间等访问时序；<strong>BANKCON6/7</strong> 额外选择 SDRAM 类型；<strong>REFRESH</strong> 设置 SDRAM 刷新周期；<strong>BANKSIZE</strong> 设置 Bank 大小与 SDRAM 电源模式；<strong>MRSRB6/7</strong> 写 SDRAM 模式寄存器（突发长度、CAS 延迟等）。</p>
            <p>配置顺序一般为：先设置总线宽度与时序，再配置 SDRAM 的刷新与模式寄存器，最后才访问 SDRAM。启动代码（Bootloader 的第一阶段）必须尽早完成这些配置，因为 C 语言运行环境需要把栈与数据放在 SDRAM 中。</p>`,
        },
      ],
    },
  ],
};

export default ch4;

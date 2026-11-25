/* 第 8 章 CPU 的结构与功能 —— 依据课件「第8章 CPU的结构与功能」（60 页）整理 */
import type { GenChapter } from '../types';

const ch8: GenChapter = {
  id: 'deck8',
  no: '第8章',
  title: 'CPU 的结构与功能',
  subtitle: 'CPU 功能与寄存器 · 指令周期与数据流 · 数据通路 · 指令流水 · 中断系统',
  lede:
    '<p>CPU 由运算器与控制器组成，其功能可归纳为指令控制、操作控制、时间控制与数据加工。本章先给出 CPU 的寄存器配置与结构框图，再讲<strong>指令周期</strong>（取指、间址、执行、中断四个阶段）与各阶段的数据流，说明<strong>数据通路</strong>的单总线/多总线/专用通路三种结构，然后讨论<strong>指令流水</strong>（结构冒险、数据冒险、控制冒险与超标量）以及<strong>中断系统</strong>（中断隐指令、中断向量、中断响应与服务）。</p>',
  toc: [
    { id: 'sec-co8-struct', text: '8.1 CPU 的结构', level: 2 },
    { id: 'sec-co8-cycle', text: '8.2 指令周期与数据流', level: 2 },
    { id: 'sec-co8-path', text: '8.2 数据通路', level: 2 },
    { id: 'sec-co8-pipeline', text: '8.3 指令流水', level: 2 },
    { id: 'sec-co8-intr', text: '8.4 中断系统', level: 2 },
  ],
  sections: [
    {
      id: 'sec-co8-struct',
      heading: '8.1 CPU 的结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>控制器的功能</strong>：取指令、分析指令、执行指令并发出各种操作命令、控制程序输入及结果的输出、总线管理、处理异常情况和特殊请求。其核心作用是<strong>指令控制、操作控制、时间控制</strong>。<strong>运算器的功能</strong>是实现算术运算和逻辑运算，即<strong>数据加工</strong>。</p>
            <p><strong>CPU 中的主要寄存器</strong>：</p>
            <ul>
              <li><strong>PC</strong>（程序计数器）：存放当前欲执行指令的地址，具有计数功能；</li>
              <li><strong>IR</strong>（指令寄存器）：存放当前正在执行的指令；</li>
              <li><strong>MAR</strong>（地址寄存器）：存放欲访问的主存单元地址；</li>
              <li><strong>MDR</strong>（数据寄存器）：存放从主存读出或写入主存的数据；</li>
              <li><strong>ACC、MQ、X</strong> 等运算器寄存器；</li>
              <li><strong>PSW</strong>（程序状态字）：存放标志位与状态信息；</li>
              <li>通用寄存器组与暂存寄存器。</li>
            </ul>
            <p>CPU 的结构框图把这些寄存器、ALU、控制单元（CU）与内部总线连接起来，控制单元根据 IR 的操作码、时序信号与状态标志产生全部控制信号。</p>`,
        },
      ],
    },
    {
      id: 'sec-co8-cycle',
      heading: '8.2 指令周期与数据流',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>指令周期</strong>是 CPU 取出并执行一条指令所需的全部时间，通常由若干个机器周期（CPU 周期）组成。完整的指令周期包括四个阶段：<strong>取指周期</strong>、<strong>间址周期</strong>（仅间接寻址指令需要）、<strong>执行周期</strong>、<strong>中断周期</strong>（有中断请求时）。每个阶段对应一组微操作。</p>
            <table class="tbl">
              <thead><tr><th>阶段</th><th>主要数据流</th></tr></thead>
              <tbody>
                <tr><td>取指周期</td><td>PC → MAR → M（读）→ MDR → IR；PC + 1 → PC</td></tr>
                <tr><td>间址周期</td><td>Ad(IR) 或 Ad(MDR) → MAR → M（读）→ MDR（取有效地址）</td></tr>
                <tr><td>执行周期</td><td>不同指令的数据流不同（如取数、存数、运算、转移）</td></tr>
                <tr><td>中断周期</td><td>① 保存程序断点（PC → MDR → M）；② 寻找中断服务程序入口地址；③ 关中断</td></tr>
              </tbody>
            </table>
            <p><strong>指令执行方案</strong>有三种：单周期 CPU（一条指令一个时钟周期，CPI=1 但周期长）、多周期 CPU（一条指令分多个时钟周期，各周期可不等长）、流水线 CPU（多条指令重叠执行）。</p>`,
        },
      ],
    },
    {
      id: 'sec-co8-path',
      heading: '8.2 数据通路',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>数据通路</strong>是数据在功能部件之间传送的路径，包括路径上流经的部件（ALU、通用寄存器、状态寄存器、异常和中断处理逻辑等），描述信息从什么地方开始、中间经过哪个寄存器或多路开关、最后传送到哪个寄存器，这些都需要由<strong>控制信号</strong>建立。</p>
            <p>数据通路的基本结构有三种：<strong>CPU 内部单总线方式</strong>——所有寄存器通过一条内部总线交换数据，结构简单但同一时刻只能有一个数据传送，效率低；<strong>多总线方式</strong>——设置两条或三条内部总线，可同时传送多个数据；<strong>专用数据通路方式</strong>——在寄存器之间设置专用连线，速度最快但控制复杂。此外还要区分内部总线（同一部件内部）与系统总线（各部件之间）。</p>
            <p>数据通路建立的三类操作：寄存器之间的数据传送、主存与 CPU 之间的数据传送、执行算术或逻辑运算。数据通路结构直接影响 CPU 内各种信息的传送路径，数据通路不同，指令执行过程的微操作序列安排也不同，它关系着微操作信号形成部件的设计。</p>`,
        },
      ],
    },
    {
      id: 'sec-co8-pipeline',
      heading: '8.3 指令流水',
      blocks: [
        {
          type: 'html',
          html: `
            <p>指令流水把指令执行过程分成若干阶段（如取指 IF、译码 ID、执行 EX、访存 MEM、写回 WB），各阶段由独立的功能部件完成，多条指令的不同阶段在时间上重叠，从而提高吞吐率。</p>
            <p><strong>流水线的性能</strong>：设流水线有 k 段、每段时间为 Δt，执行 n 条指令的时间为 <code>(k + n − 1)·Δt</code>，而不流水时需 <code>k·n·Δt</code>；当 n 很大时吞吐率接近 <code>1/Δt</code>，加速比接近 k。</p>
            <p><strong>三种冒险</strong>：</p>
            <ul>
              <li><strong>结构冒险</strong>（资源冲突）：多条指令在同一时刻争用同一部件，如取指与访存同时访问存储器——解决方法是分离指令存储器与数据存储器（哈佛结构）或设置指令 Cache 与数据 Cache；</li>
              <li><strong>数据冒险</strong>（数据相关）：后一条指令需要前一条指令尚未写回的结果——解决方法有停顿（插入气泡）、<strong>数据旁路</strong>（转发）与编译器调度；</li>
              <li><strong>控制冒险</strong>（控制相关）：转移指令改变执行流，导致已取入的指令作废——解决方法有延迟转移、分支预测（静态/动态）与预取目标地址。</li>
            </ul>
            <p><strong>超标量</strong>流水线每个时钟周期发射多条指令，需要多条流水线与更复杂的调度；<strong>动态流水线</strong>（如 Tomasulo 算法）允许指令乱序执行、顺序提交，用保留站与重排序缓冲解决数据相关。超标量与动态流水都依赖指令级并行（ILP）。</p>`,
        },
      ],
    },
    {
      id: 'sec-co8-intr',
      heading: '8.4 中断系统',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>中断</strong>是 CPU 暂停现行程序、转去处理更紧急事件、处理完再返回的机制。按中断源分内中断（异常，由 CPU 内部事件引起，如除零、溢出、缺页、断点）与外中断（由外部设备请求引起）；按中断服务程序入口地址的获取方式分向量中断与非向量中断。</p>
            <p><strong>中断响应</strong>的条件是：中断请求未被屏蔽、当前指令已执行完毕、没有更高优先级的中断正在处理。响应时 CPU 通过<strong>中断隐指令</strong>（由硬件自动执行、不是程序中的指令）完成三件事：关中断、保存断点（PC）、引出中断服务程序。</p>
            <p><strong>中断向量</strong>是中断服务程序的入口地址。向量中断由硬件直接形成入口地址，CPU 响应后根据向量地址转入相应服务程序；非向量中断则由软件查询确定中断源和入口地址。</p>
            <p><strong>中断服务程序</strong>一般包括：保护现场（保存寄存器与 PSW）、开中断（允许更高级中断嵌套）、执行设备服务、关中断、恢复现场、开中断、中断返回。课件以 8086 的中断向量表为例说明入口地址 200、300、400 的组织方式。</p>`,
        },
      ],
    },
  ],
};

export default ch8;

/* 第 2 章 ARM 微处理器与编程模型 —— 依据课件（134 页）整理 */
import type { GenChapter } from '../types';

const ch2: GenChapter = {
  id: 'deck2',
  no: '第2章',
  title: 'ARM 微处理器与编程模型',
  subtitle: '微处理器相关概念 · ARM 概述与结构 · 7 种运行模式 · ARM/Thumb 工作状态 · 寄存器组织 · 存储器格式 · 异常处理',
  lede:
    '<p>ARM 有三层含义：一家英国知识产权核（IP）设计公司、一类微处理器的通称、一种技术的名称。ARM 处理器属于 <strong>RISC</strong> 结构，采用 <strong>Load/Store</strong> 方式访问存储器，具有 37 个寄存器（31 个 32 位通用寄存器 + 6 个 32 位状态寄存器）和 7 种运行模式。本章讲清这些编程模型要素：运行模式、工作状态、寄存器组织、存储器格式与异常处理。</p>',
  toc: [
    { id: 'sec-emb2-concept', text: '2.1 微处理器相关概念', level: 2 },
    { id: 'sec-emb2-overview', text: '2.2～2.3 ARM 概述与芯片结构', level: 2 },
    { id: 'sec-emb2-mode', text: '2.4 运行模式', level: 2 },
    { id: 'sec-emb2-state', text: '2.5 工作状态', level: 2 },
    { id: 'sec-emb2-reg', text: '2.6 寄存器组织', level: 2 },
    { id: 'sec-emb2-mem', text: '2.7～2.8 存储器格式与异常处理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb2-concept',
      heading: '2.1 微处理器相关概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>计算机体系结构</strong>（Computer Architecture）指计算机的机器语言程序员或编译程序编写者所看到的计算机属性，即概念性的结构与功能特性；<strong>计算机组成</strong>则是这些属性的具体实现。二者一个回答「做什么」，一个回答「怎么做」。</p>
            <p>微处理器是把运算器与控制器集成在一块芯片上的中央处理单元；嵌入式微处理器在此基础上强调低功耗、小体积、丰富的外设接口与可裁剪性。指令集体系结构（ISA）是软件与硬件的界面，ARM 的 ISA 规定了指令格式、寄存器、寻址方式与异常模型。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb2-overview',
      heading: '2.2～2.3 ARM 概述与芯片结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ARM 公司本身不生产芯片，而是设计 IP 核并授权给半导体厂商（如三星、TI、NXP、ST），由厂商集成外设后形成具体芯片（如 S3C2440、S3C6410、STM32）。ARM 处理器采用 <strong>RISC</strong> 设计：指令长度固定、寻址方式简单、只有 Load/Store 指令访存、大量通用寄存器、指令流水线执行。</p>
            <p>ARM 芯片内部通常包含 ARM 内核（含 MMU/Cache）、片上存储器（SRAM、Boot ROM）、存储器控制器、中断控制器、定时器、UART、GPIO、LCD 控制器、USB 控制器、DMA 控制器等外设，通过片上总线（AMBA：AHB/APB）连接。课件以 S3C2440/S3C6410 的框图为例说明「内核 + 总线 + 外设」的组织方式。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb2-mode',
      heading: '2.4 运行模式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ARM 处理器支持 <strong>7 种运行模式</strong>：</p>
            <table class="tbl">
              <thead><tr><th>模式</th><th>用途</th></tr></thead>
              <tbody>
                <tr><td>USR（用户模式）</td><td>ARM 处理器正常的程序执行状态</td></tr>
                <tr><td>FIQ（快速中断模式）</td><td>用于高速数据传输或通道处理</td></tr>
                <tr><td>IRQ（外部中断模式）</td><td>用户通用的中断处理</td></tr>
                <tr><td>SVC（管理模式）</td><td>操作系统使用的保护模式，处理软件中断</td></tr>
                <tr><td>ABT（数据访问中止模式）</td><td>当数据或指令预取中止时进入，可用于虚拟存储器和存储器保护</td></tr>
                <tr><td>UND（未定义指令模式）</td><td>当未定义的指令执行时进入，可用于支持硬件协处理器的软件仿真</td></tr>
                <tr><td>SYS（系统模式）</td><td>运行具有特权的操作系统任务</td></tr>
              </tbody>
            </table>
            <p>除用户模式外，其余 6 种模式称为<strong>特权模式</strong>：程序可以访问所有的系统资源（内部寄存器和片内外设），可以任意地进行处理器模式的切换。用户模式下大多数应用程序运行于此，不能访问某些被保护的系统资源，不能直接切换到其它特权模式，但可以通过产生异常在异常处理中间接实现模式切换。</p>
            <p>除用户和系统模式外，其余 5 种模式称为<strong>异常模式</strong>，用于处理异常（包括中断）和访问受保护的系统资源。系统模式不能由异常直接进入，且使用与用户模式完全相同的寄存器组，但它是特权模式，OS 在该模式下可以访问用户模式的寄存器，特权任务可以使用该模式访问一些受控的资源。每种异常模式都有一些独立的寄存器，以避免异常退出时用户模式的状态不可靠。系统复位后进入<strong>管理模式 SVC</strong>，之后可通过程序或异常切换到其它模式。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb2-state',
      heading: '2.5 工作状态',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ARM 处理器有两种工作状态：<strong>ARM 状态</strong>——执行 32 位字对齐的 ARM 指令；<strong>Thumb 状态</strong>——执行 16 位半字对齐的 Thumb 指令。Thumb 指令是 ARM 指令的子集，代码密度高、节省存储空间，但功能与性能略低。</p>
            <p>状态切换用 <strong>BX 指令</strong>：当寄存器 Rm 的状态位 bit[0]=1 时，执行 <code>BX Rm</code> 使处理器从 ARM 状态切换到 Thumb 状态；bit[0]=0 时从 Thumb 状态切换到 ARM 状态。即跳转地址的最低位决定切换后的状态。</p>
            <pre><code>CODE16                 ; Thumb 代码段
LDR  R0, =Lable        ; 取标号地址
BX   R0                ; 切换到 ARM 状态
CODE32
Lable
MOV  R1, #10           ; ARM 指令</code></pre>
            <p>处理器处于 Thumb 状态时若发生异常（IRQ、FIQ、Undef、Abort、SWI 等），异常处理时默认切换到 ARM 状态，异常返回时自动切换回 Thumb 状态。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb2-reg',
      heading: '2.6 寄存器组织',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ARM 微处理器共有 <strong>37 个寄存器</strong>：31 个 32 位通用寄存器（R0～R30）与 6 个 32 位状态寄存器。在 ARM 状态下程序可见 27 个寄存器，Thumb 状态下的寄存器组是 ARM 状态下寄存器组的子集。</p>
            <p>ARM 状态下各寄存器的用途：</p>
            <ul>
              <li><strong>R0～R7</strong>：不分组通用寄存器，在所有模式下指向同一物理寄存器；</li>
              <li><strong>R8～R12</strong>：分组通用寄存器，FIQ 模式有自己独立的 R8_fiq～R12_fiq；</li>
              <li><strong>R13（SP）</strong>：堆栈指针，各异常模式有独立的 SP；</li>
              <li><strong>R14（LR）</strong>：链接寄存器，保存子程序返回地址；异常模式下保存异常返回地址；</li>
              <li><strong>R15（PC）</strong>：程序计数器，指向当前指令地址（流水线下读 PC 有偏移）；</li>
              <li><strong>CPSR</strong>：当前程序状态寄存器，含条件标志位（N、Z、C、V）、中断禁止位（I、F）、T 状态位与模式位；</li>
              <li><strong>SPSR</strong>：备份程序状态寄存器，各异常模式各有一个，异常发生时保存 CPSR。</li>
            </ul>
            <p>寄存器分组是 ARM 异常处理高效的关键：异常发生时硬件自动切换到对应模式的寄存器组，无需保存全部通用寄存器，FIQ 更有独立的 R8～R12 可直接使用。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb2-mem',
      heading: '2.7～2.8 存储器格式与异常处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>存储器格式</strong>：ARM 支持<strong>大端</strong>与<strong>小端</strong>两种存储格式。小端格式把字的最低字节存放在最低地址，大端格式把字的最高字节存放在最低地址。存储器组织还要求地址对齐：字访问的地址应为 4 的倍数，半字访问的地址应为 2 的倍数，非对齐访问可能产生异常或被硬件转换为对齐访问。</p>
            <p><strong>异常</strong>是处理器正常执行流程之外的事件。ARM 的异常类型及对应模式为：复位（SVC）、未定义指令（UND）、软件中断 SWI（SVC）、指令预取中止（ABT）、数据访问中止（ABT）、外部中断 IRQ（IRQ）、快速中断 FIQ（FIQ）。异常发生时，处理器把当前 PC 保存到对应模式的 LR、把 CPSR 保存到 SPSR、切换到异常模式并跳转到异常向量表中的固定入口（地址 0x00～0x1C）；异常返回时从 SPSR 恢复 CPSR、从 LR 恢复 PC，并清除相应的中断禁止位。</p>
            <p>异常向量表固定在存储器低端（或高端，由配置决定），每个异常占 4 个字节，通常放一条跳转指令，跳到真正的处理程序。FIQ 的向量放在最后，可以省略跳转、直接开始执行，以缩短响应时间。</p>`,
        },
      ],
    },
  ],
};

export default ch2;

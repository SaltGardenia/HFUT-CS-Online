/* 第 1 章 绪论 —— 依据课件「第一章 绪论」（32 页）整理 */
import type { GenChapter } from '../types';

const ch1: GenChapter = {
  id: 'deck1',
  no: '第1章',
  title: '绪论',
  subtitle: '嵌入式系统的概念 · 与桌面通用系统的区别 · 发展历程 · 结构 · 分类与应用',
  lede:
    '<p>嵌入式系统是嵌入到对象体系中的、用于执行独立功能的<strong>专用计算机系统</strong>。IEEE 的定义是「控制、监视或者辅助设备、机器和车间运行的装置」（devices used to control, monitor, or assist the operation of equipment, machinery or plants）。更完整的表述是：以应用为中心，以计算机、通信、控制等技术为基础，采用<strong>可剪裁</strong>软硬件，适用于对功能、可靠性、成本、体积、功耗等有严格要求的专用计算机系统。</p>',
  toc: [
    { id: 'sec-emb1-concept', text: '1.1 嵌入式系统的概念与三要素', level: 2 },
    { id: 'sec-emb1-diff', text: '1.1 与桌面通用系统的区别', level: 2 },
    { id: 'sec-emb1-history', text: '1.2 嵌入式系统的发展历程', level: 2 },
    { id: 'sec-emb1-struct', text: '1.3 嵌入式系统的结构', level: 2 },
    { id: 'sec-emb1-class', text: '1.4 嵌入式系统的分类', level: 2 },
    { id: 'sec-emb1-apply', text: '1.5 嵌入式系统的应用', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb1-concept',
      heading: '1.1 嵌入式系统的概念与三要素',
      blocks: [
        {
          type: 'html',
          html: `
            <p>计算机系统按定位可分为桌面通用型、高端服务型与小型专用型：前者面向信息化，后者面向自动化。嵌入式系统属于<strong>小型专用型</strong>。</p>
            <p>从形式上分两类：<strong>简单的嵌入式系统</strong>——仅有执行单一功能的控制能力，在唯一的 ROM 中仅有实现单一功能的控制程序，无微型操作系统（如单片机、DSP 系统）；<strong>复杂的嵌入式系统</strong>——具有数据运算、处理以及控制等多种能力，有一定数量的应用程序与嵌入式操作系统（如 PDA、平板电脑）。一个大型的嵌入式系统可由若干个小型嵌入式系统组成，如汽车中的尾灯控制、后车门控制、前车门控制、座椅控制、发动机控制等子系统，每一个都是完整的嵌入式系统。</p>
            <p><strong>三要素</strong>：① <strong>嵌入性</strong>——嵌入到对象体系中；② <strong>专用性</strong>——面向特定应用；③ <strong>计算机系统</strong>——具备处理器、存储器、I/O 与软件。三者共同满足配置要求、环境要求与控制要求。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb1-diff',
      heading: '1.1 与桌面通用系统的区别',
      blocks: [
        {
          type: 'html',
          html: `
            <p>嵌入式系统与桌面通用系统在多个方面不同：</p>
            <ul>
              <li><strong>任务确定</strong>：嵌入式系统中运行的任务是专用而确定的（如心脏监视器只需运行信号输入、信号处理、心电图显示任务），更改任务需要对整个系统重新设计或在线维护；桌面通用系统需支持大量需求多样的应用程序，对系统中运行的程序不作假设，程序升级、更新方便。</li>
              <li><strong>实时性要求高</strong>：实时系统指能在限定的响应时间内提供所需水平的服务。嵌入式实时系统分为强实时型（响应时间 μs～ms 级）、一般实时（ms～s 级）与弱实时型（s 级以上）。常用嵌入式实时操作系统有 VxWorks、Windows CE、pSOS、QNX、μC/OS-II，以及 HOPEN、DeltaOS、supOS、HarmonyOS、iFLYOS 等。</li>
              <li><strong>可靠性要求高</strong>：需要在无人值守的条件下长时间运行，运行环境恶劣，对故障的容忍能力较弱。</li>
              <li><strong>功耗约束</strong>：如钢结构健康监测系统等靠电池或取能供电的场合。</li>
              <li><strong>内核小、资源少</strong>：资源配置遵循「够用就行」，追求低成本、低功耗，因此伴随一个热词——<strong>裁剪</strong>。</li>
              <li><strong>开发方式特殊</strong>：开发用交叉编译、交叉链接；调试用仿真器、虚拟机；更新用在线升级等专用工具和方法。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-emb1-history',
      heading: '1.2 嵌入式系统的发展历程',
      blocks: [
        {
          type: 'html',
          html: `
            <p>二十世纪四十至七十年代，计算机从通用计算机系统走向嵌入式计算机系统；<strong>单片机</strong>的出现开创了嵌入式系统独立发展之路。微处理器经历了 Intel 4004、8008、8080、8086、80286、80386、80486、Pentium 到酷睿 i9 的演进，一般划分为五代。</p>
            <p>单片机同样不断演进：Intel 的 MCS-48（8048）、MCS-51（8051/8751）、MCS-96（8098）系列，Zilog Z80 单板机，以及德州仪器 MSP430、飞思卡尔 MC9S12、Microchip PIC、凌阳 SPCE061、STM32（ARM Cortex-M3）、PIC32（MIPS）、AT91M40400（ARM7）、S3C6410（ARM11）等，呈现「复杂化、智能化」的趋势。</p>
            <p>2000 年前后进入<strong>后 PC 时代</strong>：3C 产品（Computer、Communication、Consume Electronic）兴起，嵌入式技术成为客户终端设备的核心技术，特点是轻巧便利、易于控制、具有某些特定功能；此后出现基于 ARM 的树莓派微型电脑主板，以及集成 GPU、NPU 的 AI 芯片与智能终端设备。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb1-struct',
      heading: '1.3 嵌入式系统的结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>嵌入式系统通常由<strong>硬件层</strong>、<strong>中间层</strong>（板级支持包 BSP 与硬件抽象层 HAL）、<strong>系统软件层</strong>（嵌入式操作系统、文件系统、图形用户接口、网络协议栈等）与<strong>应用软件层</strong>组成。硬件层以嵌入式处理器为核心，配以存储器（ROM/Flash、RAM）与外围接口电路；软件层按应用需要裁剪配置，规模可小到几百 KB、大到数十 MB。</p>
            <p>这种分层结构使同一套应用软件可以在不同硬件平台上移植，也使硬件升级不必重写全部软件——BSP/HAL 正是两者之间的隔离层。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb1-class',
      heading: '1.4 嵌入式系统的分类',
      blocks: [
        {
          type: 'html',
          html: `
            <p>按用途与规模可分为：<strong>单片微型计算机</strong>（把 CPU、存储器、定时器、I/O 集成在一块芯片上，如 8051、STM32）、<strong>单板机</strong>（一块印制板上集成 CPU、存储器与接口）、<strong>嵌入式处理器系统</strong>（以 ARM、MIPS、PowerPC 等 32/64 位处理器为核心，运行嵌入式操作系统）。</p>
            <p>按实时性分为强实时、一般实时与弱实时系统；按软件结构分为无操作系统的前后台系统（超级循环 + 中断）与带嵌入式操作系统的多任务系统。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb1-apply',
      heading: '1.5 嵌入式系统的应用',
      blocks: [
        {
          type: 'html',
          html: `
            <p>嵌入式系统应用极广：工业控制（PLC、数控机床、机器人）、汽车电子（发动机控制、ABS、车载娱乐）、消费电子（手机、平板、智能家电、数码相机）、医疗电子（心脏监视器、CT、可穿戴设备）、通信设备（路由器、基站、交换机）、航空航天与国防、智能家居与物联网终端等。</p>
            <p>随着 AI 芯片与边缘计算的兴起，嵌入式系统正从「控制」走向「感知 + 计算 + 决策」，但专用性、实时性、可靠性与低功耗这些基本约束没有改变。</p>`,
        },
      ],
    },
  ],
};

export default ch1;

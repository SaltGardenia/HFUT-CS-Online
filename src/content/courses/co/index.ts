/** 计算机组成原理课程数据：第 1、3～10 章（原课程无第 2 章文件） */
import type { GenPaper } from '../types';
import ch1 from './ch1';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import ch9 from './ch9';
import ch10 from './ch10';
import co2022a from './paper-co2022a';

const coPapers: GenPaper[] = [co2022a];

export { coPapers };

const coHome = {
  lede: `<p>依据课程组课件（杨毅老师《计算机组成原理》PPT-2025 系列）整理的课程精讲：概述、系统总线、存储器、输入输出系统、运算、
  指令系统、CPU 的结构与功能、控制单元的功能与设计。原课程无第 2 章课件，章号按课件保持 1、3～10。</p>`,
  cards: [
    {
      title: '课程信息',
      html: `<p>章节目录与课件一致：第 1 章概述、第 3 章系统总线、第 4 章存储器、第 5 章输入输出系统（带练习版）、第 6 章运算、
      第 7 章指令系统（带课题练习）、第 8 章 CPU 的结构与功能、第 9 章控制单元的功能、第 10 章控制单元的设计。课件另存有 PPT-旧 与
      <code>课件/</code> 目录下的历年同章 PDF，作为附件保留。</p>`,
    },
    {
      title: '资料构成',
      html: `<p>站点整理自 <strong>9 章课件</strong>与<strong>期末试卷</strong>（2022 年宣城校区 A 卷已整理为在线练习，历年扫描原卷收入附件）；
      课件中的存储器芯片连接图、微指令格式图以文字说明保留其结构。</p>`,
    },
  ],
  blurbs: {
    deck1: '计算机系统与软硬件层次、ISA 界面；冯·诺依曼结构与五大部件；运算器/存储器/控制器的组成与指令执行过程；吞吐量、响应时间、CPI、CPU 时间、MIPS 与 MFLOPS。',
    deck3: '总线的概念与分类；机械/电气/功能/时间特性与带宽指标；单总线/双总线结构与通道；链式查询、计数器定时查询、独立请求三种仲裁；同步与异步定时。',
    deck4: '存储器分类与三级层次；SRAM/DRAM/ROM/Flash；容量扩展（位/字/字位）；海明码与 CRC；Cache 三种映射、FIFO/LRU 替换与写策略；磁盘与 RAID；页式/段式虚存与 TLB。',
    deck5: 'I/O 系统四个发展阶段；接口功能与分类；程序查询方式；程序中断（请求、判优、响应、服务、返回）；DMA 三种传送方式；通道与 I/O 处理机。',
    deck6: '原码/补码/反码/移码；定点与浮点表示、IEEE 754；补码加减与溢出判断；原码一位乘、Booth 算法、加减交替除法；浮点加减四步；加法器与 ALU。',
    deck7: '指令格式与操作码扩展；操作数类型与操作类型；立即/直接/间接/寄存器/寄存器间接/基址/变址/相对/堆栈寻址；指令格式举例；CISC 与 RISC。',
    deck8: 'CPU 功能与寄存器；指令周期四阶段的数据流；数据通路三种结构；指令流水与三类冒险、超标量；中断系统与中断隐指令、中断向量。',
    deck9: '取指/间址/执行/中断周期的操作命令分析；CPU 内部、送往总线、来自总线的三类控制信号；机器周期、节拍、工作脉冲三级时序。',
    deck10: '组合逻辑设计的步骤与优缺点；微程序设计思想、微指令格式（水平型/垂直型）；直接编码、字段直接编码、字段间接编码；微地址形成与微程序控制单元。',
  },
};

const coUnits = [
  { id: 'u1', label: '基础', short: '基础', chapters: ['deck1', 'deck3'] },
  { id: 'u2', label: '存储与I/O', short: '存储', chapters: ['deck4', 'deck5'] },
  { id: 'u3', label: '运算与控制', short: 'CPU', chapters: ['deck6', 'deck7', 'deck8', 'deck9', 'deck10'] },
];

export const coSpec = {
  key: 'co',
  base: '/co',
  name: '计算机组成原理',
  tip: '计算机组成原理 · 九章课件精讲与期末试卷',
  unit: '章' as const,
  chapters: [ch1, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10],
  papers: coPapers,
  units: coUnits,
  home: coHome,
};

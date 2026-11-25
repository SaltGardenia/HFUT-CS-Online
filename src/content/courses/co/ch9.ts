/* 第 9 章 控制单元的功能 —— 依据课件「第9章 控制单元的功能」（47 页）整理 */
import type { GenChapter } from '../types';

const ch9: GenChapter = {
  id: 'deck9',
  no: '第9章',
  title: '控制单元的功能',
  subtitle: '操作命令的分析 · 控制信号 · 时序信号 · 控制单元的功能',
  lede:
    '<p>控制单元（CU）是全机的指挥中心：它接收指令、时钟与状态信息，产生各种控制信号，控制各部件在正确的时刻完成正确的微操作。本章按四个阶段（取指、间址、执行、中断）分析操作命令，归纳 CPU 内部、送往系统总线与来自系统总线的三类控制信号，并说明机器周期、节拍与工作脉冲三级时序信号如何组织控制信号的发出时刻。</p>',
  toc: [
    { id: 'sec-co9-command', text: '9.1 操作命令的分析', level: 2 },
    { id: 'sec-co9-signal', text: '9.2 控制信号', level: 2 },
    { id: 'sec-co9-timing', text: '9.3 时序信号与控制单元的功能', level: 2 },
  ],
  sections: [
    {
      id: 'sec-co9-command',
      heading: '9.1 操作命令的分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一条指令的执行可分解为若干微操作，控制单元按<strong>取指、间址、执行、中断</strong>四个阶段发出相应的操作命令：</p>
            <ul>
              <li><strong>取指周期</strong>：<code>PC→MAR</code>，<code>1→R</code>（读命令），<code>M(MAR)→MDR</code>，<code>MDR→IR</code>，<code>OP(IR)→CU</code>（指令送至控制单元译码），<code>(PC)+1→PC</code>。</li>
              <li><strong>间址周期</strong>：<code>Ad(IR)→MAR</code>，<code>1→R</code>，<code>M(MAR)→MDR</code>，把形式地址中的有效地址取到 MDR（间接寻址指令才需要）。</li>
              <li><strong>执行周期</strong>：不同指令差别很大。以取数指令 <code>LDA X</code> 为例，<code>Ad(IR)→MAR</code>，<code>1→R</code>，<code>M(MAR)→MDR</code>，<code>MDR→ACC</code>；存数指令 <code>STA X</code> 则是 <code>Ad(IR)→MAR</code>，<code>1→W</code>，<code>ACC→MDR</code>，<code>MDR→M(MAR)</code>；加法指令需先取操作数再送 ALU 运算；转移指令把目标地址送入 PC。</li>
              <li><strong>中断周期</strong>：保存断点、寻找中断服务程序入口地址、关中断。</li>
            </ul>
            <p>把每个阶段的微操作按先后次序排列，就得到指令的<strong>微操作序列</strong>；控制单元的任务就是在恰当时刻发出这些微操作所需的控制信号。</p>`,
        },
      ],
    },
    {
      id: 'sec-co9-signal',
      heading: '9.2 控制信号',
      blocks: [
        {
          type: 'html',
          html: `
            <p>控制信号可分为三类：</p>
            <ol>
              <li><strong>CPU 内部的控制信号</strong>：寄存器之间的传送控制（如 <code>PC→MAR</code>、<code>MDR→IR</code>）、ALU 的运算选择、寄存器的打入与读出控制等；</li>
              <li><strong>送到系统总线的控制信号</strong>：如存储器读/写（<code>MREQ</code>、<code>R/W</code>）、I/O 读写（<code>IOR</code>、<code>IOW</code>）、中断响应等；</li>
              <li><strong>来自系统总线的控制信号</strong>：如时钟、复位、中断请求、总线请求、就绪/等待等。</li>
            </ol>
            <p>控制信号与操作码、寻址方式、时序阶段和状态标志都有关：同一个控制信号在不同指令、不同阶段可能有效或无效，因此控制单元的输出是这些输入的函数。课件用取数、存数、加法、转移等指令逐条列出了各阶段应发出的控制信号，作为设计控制单元的输入条件。</p>`,
        },
      ],
    },
    {
      id: 'sec-co9-timing',
      heading: '9.3 时序信号与控制单元的功能',
      blocks: [
        {
          type: 'html',
          html: `
            <p>控制信号必须在确定的时刻发出，因此需要<strong>时序信号</strong>。时序体制一般分三级：<strong>机器周期</strong>（完成一个阶段所需的时间，如取指周期、间址周期、执行周期、中断周期）、<strong>节拍</strong>（把一个机器周期分为若干等长的时间段，用节拍电位区分）、<strong>工作脉冲</strong>（在节拍内再给出脉冲，用于触发寄存器的打入）。</p>
            <p>时序信号可由<strong>时序信号产生器</strong>用计数器、译码器与门电路产生，也可用专门的时序芯片产生。控制单元在不同机器周期、不同节拍发出不同的控制信号，从而把微操作分配到正确的时刻。</p>
            <p><strong>控制单元的功能</strong>可概括为：① 接收指令与状态信息；② 进行指令译码与操作命令分析；③ 按规定的时序产生全部控制信号；④ 控制各部件完成微操作；⑤ 处理异常与中断请求。实现这一功能有两种基本方法：<strong>组合逻辑设计</strong>（硬布线）与<strong>微程序设计</strong>（存储逻辑），分别在下一章讨论。</p>`,
        },
      ],
    },
  ],
};

export default ch9;

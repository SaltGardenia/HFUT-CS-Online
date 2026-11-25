import type { DeckData } from '../types';

/** 第1章 基础知识 —— 课件 CHAP 1 */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1章',
  title: '基础知识',
  subtitle: '数制与编码 · 8086 CPU 结构 · 寄存器组 · 存储器组织 · 堆栈 · 标志寄存器',
  lede:
    '汇编语言直接面向处理器与存储器。本章复习二进制 / 十六进制与补码、BCD 与 ASCII 编码，介绍 8086 CPU 的内部结构、通用寄存器与段寄存器、物理地址的形成、存储器分段组织、堆栈操作和标志寄存器，为指令系统与程序设计打基础。',
  toc: [
    { id: 'sec-1-1', text: '1.1 数制、编码与补码', level: 2 },
    { id: 'sec-1-2', text: '1.2 8086 结构与寄存器组', level: 2 },
    { id: 'sec-1-3', text: '1.3 存储器组织与物理地址', level: 2 },
    { id: 'sec-1-4', text: '1.4 堆栈与标志寄存器', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '1.1 数制、编码与补码',
      blocks: [
        {
          type: 'html',
          html: `
<ul>
<li>二进制、八进制、十六进制与十进制互转；汇编中十六进制以 H 结尾（如 0FFH），以字母开头的数前加 0。</li>
<li><strong>原码、反码、补码</strong>：正数三码相同；负数反码为原码除符号位外取反，补码为反码加 1。补码把减法变为加法，8 位补码表示范围 −128～127。</li>
<li>8 位补码的真值：最高位为符号位，其余按权展开后减去 2<sup>7</sup>。</li>
<li><strong>BCD 码</strong>：用 4 位二进制表示 1 位十进制数；压缩 BCD 一个字节存两位。</li>
<li><strong>ASCII 码</strong>：数字 0～9 为 30H～39H，大写字母 A～Z 为 41H～5AH，小写字母 a～z 为 61H～7AH。</li>
</ul>
<div class="callout key">
<p class="callout-h">补码运算示例</p>
<p>−7 的 8 位补码：7 = 0000 0111B，取反 1111 1000B，加 1 得 1111 1001B = F9H。−1 的补码为 FFH。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '1.2 8086 结构与寄存器组',
      blocks: [
        {
          type: 'html',
          html: `
<p>8086 是 16 位微处理器，内部由<strong>总线接口单元 BIU</strong> 与<strong>执行单元 EU</strong> 组成，两者并行工作（指令预取）。</p>
<table class="tbl">
<thead><tr><th>寄存器</th><th>用途</th></tr></thead>
<tbody>
<tr><td>AX / BX / CX / DX</td><td>通用寄存器，可拆为 AH/AL、BH/BL、CH/CL、DH/DL</td></tr>
<tr><td>SP / BP</td><td>堆栈指针 / 基址指针（默认段寄存器 SS）</td></tr>
<tr><td>SI / DI</td><td>源变址 / 目的变址（默认段寄存器 DS）</td></tr>
<tr><td>CS / DS / SS / ES</td><td>代码段 / 数据段 / 堆栈段 / 附加段寄存器</td></tr>
<tr><td>IP</td><td>指令指针，与 CS 共同确定下一条指令地址</td></tr>
<tr><td>FLAGS</td><td>标志寄存器（状态标志 + 控制标志）</td></tr>
</tbody>
</table>
<p>专用用途：CX 常作循环计数；DX 在乘除法中存放高 16 位 / 余数；BX 常作基址；SI、DI 用于串操作。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '1.3 存储器组织与物理地址',
      blocks: [
        {
          type: 'html',
          html: `
<p>8086 有 20 位地址线，可寻址 1 MB；数据线 16 位，存储器按字节编址，字以低地址存放低字节（小端序）。</p>
<p>物理地址由段地址与偏移地址合成：</p>
<div class="formula"><p>物理地址 = 段地址 × 16 + 偏移地址</p></div>
<p>段地址放在段寄存器中，偏移地址由寻址方式给出。段可以重叠；每个段最大 64 KB。默认段搭配：取指令用 CS:IP；堆栈操作（PUSH/POP、BP 寻址）用 SS:SP/BP；数据访问默认 DS；串操作用 DS:SI、ES:DI。</p>
<p>逻辑地址写作「段地址:偏移地址」，如 1234H:0056H 对应物理地址 12340H + 0056H = 12396H。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '1.4 堆栈与标志寄存器',
      blocks: [
        {
          type: 'html',
          html: `
<h3>堆栈</h3>
<p>堆栈是<strong>后进先出</strong>的存储区，由 SS 与 SP 管理。8086 堆栈向<strong>低地址</strong>生长：</p>
<ul>
<li>PUSH AX：SP←SP−2，然后把 AX 送入 SS:SP；</li>
<li>POP AX：从 SS:SP 取出字送入 AX，然后 SP←SP+2。</li>
</ul>
<p>堆栈常用于保存现场、传递参数、子程序调用与中断。</p>
<h3>标志寄存器</h3>
<table class="tbl">
<thead><tr><th>标志</th><th>含义</th></tr></thead>
<tbody>
<tr><td>CF</td><td>进位 / 借位标志（无符号数溢出）</td></tr>
<tr><td>PF</td><td>奇偶标志（结果低 8 位中 1 的个数为偶时置 1）</td></tr>
<tr><td>AF</td><td>辅助进位（低 4 位向高 4 位进位）</td></tr>
<tr><td>ZF</td><td>零标志（结果为 0 时置 1）</td></tr>
<tr><td>SF</td><td>符号标志（结果最高位为 1 时置 1）</td></tr>
<tr><td>OF</td><td>溢出标志（有符号数溢出）</td></tr>
<tr><td>DF</td><td>方向标志（串操作地址增减）</td></tr>
<tr><td>IF</td><td>中断允许标志</td></tr>
<tr><td>TF</td><td>单步陷阱标志</td></tr>
</tbody>
</table>
<p>CF 与 OF 的区别：CF 用于无符号数，OF 用于有符号数。判断有符号数大小用 SF、OF、ZF 组合（如 JG/JL），无符号数用 CF、ZF（如 JA/JB）。</p>
`,
        },
      ],
    },
  ],
};

export default deck1;

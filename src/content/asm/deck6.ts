import type { DeckData } from '../types';

/** 第6章 高级汇编与模块化 —— 课件 CHAP 5-2、旧版第 6/7 章（中断、32 位与混编） */
const deck6: DeckData = {
  id: 'deck6',
  no: '第6章',
  title: '高级汇编与模块化',
  subtitle: '模块化设计 · 中断与 BIOS / DOS 调用 · 32 位指令与高级语言混编 · DEBUG 调试',
  lede:
    '本章讨论较大程序的工程化组织：模块化设计与段组合、中断机制与 BIOS/DOS 功能调用、32 位寄存器与指令扩展、汇编与高级语言混合编程，以及用 DEBUG 调试程序的基本命令。',
  toc: [
    { id: 'sec-6-1', text: '6.1 模块化设计与段组合', level: 2 },
    { id: 'sec-6-2', text: '6.2 中断与 BIOS / DOS 调用', level: 2 },
    { id: 'sec-6-3', text: '6.3 32 位指令与混合编程', level: 2 },
    { id: 'sec-6-4', text: '6.4 DEBUG 调试', level: 2 },
  ],
  sections: [
    {
      id: 'sec-6-1',
      heading: '6.1 模块化设计与段组合',
      blocks: [
        {
          type: 'html',
          html: `
<p>大程序可拆成多个源文件（模块），分别汇编后用链接程序连接。模块间共享的符号用 <code>PUBLIC</code> 导出、<code>EXTRN</code> 引入。</p>
<pre class="code"><code>; 模块 A
PUBLIC  SUB1
CODE SEGMENT
SUB1 PROC FAR
    ...
SUB1 ENDP
CODE ENDS

; 模块 B
EXTRN SUB1:FAR
CALL SUB1</code></pre>
<p>段组合用 <code>SEGMENT ... PARA STACK 'STACK'</code> 等属性；<code>GROUP</code> 可把多个段组合成一个段组，共用同一个段地址。模块化便于分工、复用与维护。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-2',
      heading: '6.2 中断与 BIOS / DOS 调用',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>中断</strong>是 CPU 暂停当前程序、转去执行中断处理程序，完成后返回的过程。8086 支持 256 个中断类型（0～255），中断向量表位于内存 0000H:0000H 起，每项 4 字节（偏移 + 段）。</p>
<ul>
<li><strong>内部中断</strong>：除法错、单步、断点、溢出、INT n；</li>
<li><strong>外部中断</strong>：NMI（不可屏蔽）、INTR（可屏蔽，由 IF 控制）。</li>
</ul>
<p><code>INT n</code> 的执行过程：标志压栈 → CS、IP 压栈 → 清 IF、TF → 从中断向量表取入口地址 → 转去执行；<code>IRET</code> 依次恢复 IP、CS、FLAGS。</p>
<h3>常用 BIOS / DOS 调用</h3>
<table class="tbl">
<thead><tr><th>调用</th><th>功能</th></tr></thead>
<tbody>
<tr><td>INT 21H, AH=01H</td><td>键盘输入一个字符到 AL</td></tr>
<tr><td>INT 21H, AH=02H</td><td>输出 DL 中的字符</td></tr>
<tr><td>INT 21H, AH=09H</td><td>输出 DS:DX 指向的以 '$' 结尾的字符串</td></tr>
<tr><td>INT 21H, AH=0AH</td><td>缓冲输入</td></tr>
<tr><td>INT 21H, AH=4CH</td><td>返回 DOS</td></tr>
<tr><td>INT 10H</td><td>BIOS 显示服务</td></tr>
<tr><td>INT 16H</td><td>BIOS 键盘服务</td></tr>
</tbody>
</table>
<p>N 号中断向量的段地址位于 0000H:(N×4+2)，偏移位于 0000H:(N×4)。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-3',
      heading: '6.3 32 位指令与混合编程',
      blocks: [
        {
          type: 'html',
          html: `
<p>80386 及以后扩展了 32 位寄存器：EAX、EBX、ECX、EDX、ESI、EDI、EBP、ESP，以及段寄存器 FS、GS；指令增加 32 位操作数、比例变址寻址（如 <code>[EBX+ESI*4+8]</code>）、位操作（BT/BTS/BTR/BTC）、条件传送（CMOVcc）、SETcc 等。</p>
<h3>混合编程</h3>
<ul>
<li>汇编调用 C：按 C 调用约定压参（从右到左），用 <code>EXTERN</code> 声明，注意名称修饰与参数清理；</li>
<li>C 调用汇编：汇编子程序导出为 <code>PUBLIC</code>，遵守 C 调用约定，返回值放 EAX；</li>
<li>内嵌汇编：在 C 中用 <code>__asm</code> 直接写汇编语句。</li>
</ul>
<p>混合编程可兼顾开发效率与底层性能，常用于驱动程序、嵌入式与性能关键代码。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-4',
      heading: '6.4 DEBUG 调试',
      blocks: [
        {
          type: 'html',
          html: `
<p>DEBUG 是 DOS 下的汇编级调试工具，可查看 / 修改寄存器与内存、单步执行、设置断点。常用命令：</p>
<table class="tbl">
<thead><tr><th>命令</th><th>功能</th></tr></thead>
<tbody>
<tr><td>A [地址]</td><td>汇编指令</td></tr>
<tr><td>U [地址]</td><td>反汇编</td></tr>
<tr><td>R</td><td>查看 / 修改寄存器</td></tr>
<tr><td>D [地址]</td><td>查看内存</td></tr>
<tr><td>E 地址 数据</td><td>修改内存</td></tr>
<tr><td>G [=地址] [断点]</td><td>运行到断点</td></tr>
<tr><td>T / P</td><td>单步 / 单步（跳过子程序）</td></tr>
<tr><td>Q</td><td>退出 DEBUG</td></tr>
</tbody>
</table>
<pre class="code"><code>; 在 DOSBox 中给 DS:100 处写入 1234H
MOUNT C E:\\zbh
C:
DEBUG
-E 100 34 12        ; 小端序：低字节 34 在前
-D 100              ; 查看
-Q</code></pre>
<div class="callout key">
<p class="callout-h">课程收束</p>
<p>汇编语言的学习路径：数制与硬件基础 → 指令系统 → 程序格式 → 三种基本结构 → 子程序 / 宏 → 中断、模块化与混合编程。核心能力是读懂并手写 8086 汇编程序，理解寄存器、标志、寻址与堆栈。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck6;

import type { DeckData } from '../types';

/** 第3章 汇编语言程序格式 —— 课件 CHAP 3 */
const deck3: DeckData = {
  id: 'deck3',
  no: '第3章',
  title: '汇编语言程序格式',
  subtitle: '语句格式 · 段定义 · 数据定义伪指令 · 符号与表达式 · 完整程序结构',
  lede:
    '汇编源程序由语句组成，语句分为指令语句、伪指令语句和宏指令语句。本章掌握汇编语句的格式、段定义与段分配伪指令、数据定义伪指令（DB/DW/DD 等）、符号、表达式与运算符，以及一个完整可运行程序的结构。',
  toc: [
    { id: 'sec-3-1', text: '3.1 汇编语句格式与操作数', level: 2 },
    { id: 'sec-3-2', text: '3.2 段定义与段分配', level: 2 },
    { id: 'sec-3-3', text: '3.3 数据定义伪指令', level: 2 },
    { id: 'sec-3-4', text: '3.4 符号、表达式与完整程序', level: 2 },
  ],
  sections: [
    {
      id: 'sec-3-1',
      heading: '3.1 汇编语句格式与操作数',
      blocks: [
        {
          type: 'html',
          html: `
<p>语句一般格式：</p>
<pre class="code"><code>[标号:] 助记符 [操作数[, 操作数]] [; 注释]</code></pre>
<ul>
<li><strong>标号</strong>：指令语句的符号地址，后跟冒号；数据项名 / 段名 / 过程名不带冒号；</li>
<li><strong>助记符</strong>：指令或伪指令名称；</li>
<li><strong>操作数</strong>：寄存器、存储器、立即数、表达式；</li>
<li><strong>注释</strong>：以分号开始。</li>
</ul>
<p>伪指令语句在汇编时由汇编程序处理，不生成机器码（如 SEGMENT、ENDS、DB、DW、EQU、ASSUME）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-2',
      heading: '3.2 段定义与段分配',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>DATA SEGMENT
    ; 数据定义
DATA ENDS

CODE SEGMENT
    ASSUME CS:CODE, DS:DATA, SS:STACK
START:
    MOV AX, DATA
    MOV DS, AX
    ; 程序主体
    MOV AH, 4CH
    INT 21H
CODE ENDS
    END START</code></pre>
<ul>
<li><code>SEGMENT / ENDS</code>：定义段的开始与结束，段名成对；</li>
<li><code>ASSUME</code>：告诉汇编程序段寄存器与段的对应关系（伪指令，不产生代码）；</li>
<li>程序入口用 <code>END 标号</code> 指定；</li>
<li>DS 必须在程序开头用 MOV 指令赋值（不能用立即数直接送段寄存器）；</li>
<li>返回 DOS：<code>MOV AH,4CH; INT 21H</code>。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-3-3',
      heading: '3.3 数据定义伪指令',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>伪指令</th><th>分配空间</th><th>示例</th></tr></thead>
<tbody>
<tr><td>DB</td><td>字节</td><td>X DB 12H；S DB '2022', '$'</td></tr>
<tr><td>DW</td><td>字（2 字节）</td><td>Y DW 1234H；Z DW OFFSET X</td></tr>
<tr><td>DD</td><td>双字（4 字节）</td><td>P DD 12345678H</td></tr>
<tr><td>DQ / DT</td><td>8 / 10 字节</td><td>—</td></tr>
<tr><td>DUP</td><td>重复</td><td>Y DB 50 DUP(1)；BUF DB 10 DUP(?)</td></tr>
</tbody>
</table>
<p><code>?</code> 表示初值不定；<code>DUP</code> 可嵌套；字符串用单引号括起，按字符依次存放。数据定义还可使用 <code>EQU</code>（等价，不分配空间）与 <code>=</code>（可重新定义）。</p>
<pre class="code"><code>DATA SEGMENT
    X   DW  ?                 ; 字变量，初值不定
    Y   DB  50 DUP(1)         ; 50 个字节，初值 1
    Z   DW  OFFSET X          ; X 的偏移地址
    S   DB  '2022', '$'       ; 字符串，'$' 为 DOS 显示结束符
DATA ENDS</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-3-4',
      heading: '3.4 符号、表达式与完整程序',
      blocks: [
        {
          type: 'html',
          html: `
<h3>符号与运算符</h3>
<ul>
<li>数值表达式：算术运算符 +、−、*、/、MOD；</li>
<li>地址表达式：<code>OFFSET</code>（取偏移）、<code>SEG</code>（取段）、<code>TYPE</code>（取类型）、<code>LENGTH</code>（取元素个数）、<code>SIZE</code>（取总字节数）；</li>
<li>属性运算符：<code>PTR</code>（临时改变类型）、<code>:</code>（段超越）、<code>SHORT</code>（短转移）。</li>
</ul>
<h3>完整程序示例：显示字符串</h3>
<pre class="code"><code>DATA SEGMENT
    MSG DB 'Hello, Assembly!', 0DH, 0AH, '$'
DATA ENDS

STACK SEGMENT STACK
    DB 100 DUP(?)
STACK ENDS

CODE SEGMENT
    ASSUME CS:CODE, DS:DATA, SS:STACK
START:
    MOV AX, DATA
    MOV DS, AX

    LEA DX, MSG          ; DS:DX 指向字符串
    MOV AH, 09H          ; DOS 显示字符串功能
    INT 21H

    MOV AH, 4CH          ; 返回 DOS
    INT 21H
CODE ENDS
    END START</code></pre>
<div class="callout key">
<p class="callout-h">DOS 常用功能调用（INT 21H）</p>
<p>01H 输入字符（AL）；02H 输出字符（DL）；09H 输出以 '$' 结尾的字符串（DS:DX）；0AH 缓冲输入；4CH 返回 DOS。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck3;

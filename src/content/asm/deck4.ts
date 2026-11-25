import type { DeckData } from '../types';

/** 第4章 基本汇编语言程序设计 —— 课件 CHAP 4 */
const deck4: DeckData = {
  id: 'deck4',
  no: '第4章',
  title: '基本程序设计',
  subtitle: '顺序结构 · 分支结构 · 循环结构 · 数组与字符串处理',
  lede:
    '本章用 8086 指令实现三种基本程序结构：顺序、分支、循环，并给出数组求和、统计、查找、排序、字符串处理等典型程序的设计思路与代码骨架。',
  toc: [
    { id: 'sec-4-1', text: '4.1 顺序程序设计', level: 2 },
    { id: 'sec-4-2', text: '4.2 分支程序设计', level: 2 },
    { id: 'sec-4-3', text: '4.3 循环程序设计', level: 2 },
    { id: 'sec-4-4', text: '4.4 数组与字符串处理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-4-1',
      heading: '4.1 顺序程序设计',
      blocks: [
        {
          type: 'html',
          html: `
<p>顺序程序按指令排列顺序依次执行，是最简单的结构。典型操作：数据传送、算术运算、输入输出。</p>
<pre class="code"><code>; 例：Z = X + Y（字变量）
MOV AX, X
ADD AX, Y
MOV Z, AX

; 例：从端口 255 读入一个字节，最高位取反、最低位清 0，再从 256 端口输出
IN  AL, 255
XOR AL, 80H
AND AL, 0FEH
OUT 256, AL</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-4-2',
      heading: '4.2 分支程序设计',
      blocks: [
        {
          type: 'html',
          html: `
<p>分支由 CMP/TEST 等指令设置标志，再用条件转移指令实现。</p>
<pre class="code"><code>; 例：比较 AX、BX（有符号数），大者送 CX
CMP AX, BX
JG  A_BIG
MOV CX, BX
JMP DONE
A_BIG:
MOV CX, AX
DONE:

; 多分支：跳转表
    CMP AL, 1
    JE  CASE1
    CMP AL, 2
    JE  CASE2
    JMP OTHER</code></pre>
<p>无符号数比较用 JA/JAE/JB/JBE，有符号数用 JG/JGE/JL/JLE。多分支可用跳转表（地址表）提高效率。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-3',
      heading: '4.3 循环程序设计',
      blocks: [
        {
          type: 'html',
          html: `
<p>循环三要素：初始化、循环体、循环控制（修改计数并判断）。</p>
<pre class="code"><code>; 例：求 1+2+…+100
    XOR AX, AX          ; 累加器清零
    MOV CX, 100         ; 循环次数
    MOV BX, 1
SUM_LOOP:
    ADD AX, BX
    INC BX
    LOOP SUM_LOOP       ; CX 减 1，非零则转移

; 例：统计 AX 中 1 的个数，结果存 BL
    MOV CX, 16
    XOR BL, BL
COUNT:
    SHL AX, 1           ; 最高位移入 CF
    JNC SKIP
    INC BL
SKIP:
    LOOP COUNT</code></pre>
<p>循环控制方式：计数循环（LOOP）、条件循环（CMP + 条件转移）、无限循环（JMP）。注意 LOOP 使用 CX，循环体内不要破坏 CX。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-4',
      heading: '4.4 数组与字符串处理',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>; 例：求字节数组 ARRAY 的和（长度 N）
    LEA SI, ARRAY
    MOV CX, N
    XOR AX, AX
AGAIN:
    ADD AL, [SI]
    ADC AH, 0
    INC SI
    LOOP AGAIN

; 例：在数组中查找关键字 KEY
    LEA SI, ARRAY
    MOV CX, N
    MOV AL, KEY
SEARCH:
    CMP AL, [SI]
    JE  FOUND
    INC SI
    LOOP SEARCH
    ; 未找到
FOUND:
    ; 找到，SI 指向该元素</code></pre>
<p>数组元素地址 = 首地址 + 下标 × 元素长度。字数组用 <code>ADD AX,[SI]</code> 并 <code>ADD SI,2</code>。字符串处理可用串指令（MOVS/CMPS/SCAS）配合 REP 前缀。</p>
<div class="callout key">
<p class="callout-h">冒泡排序骨架</p>
<p>外层循环控制趟数（n−1），内层循环相邻比较交换；用标志位记录本趟是否发生交换，可提前结束。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck4;

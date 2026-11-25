import type { DeckData } from '../types';

/** 第5章 子程序与宏 —— 课件 CHAP 5-1 */
const deck5: DeckData = {
  id: 'deck5',
  no: '第5章',
  title: '子程序与宏',
  subtitle: '子程序设计 · 参数传递 · 现场保护 · 宏定义 / 调用 / 展开 · 重复汇编与条件汇编',
  lede:
    '子程序与宏都是提高代码复用、简化源程序的手段。子程序在运行时调用，代码只有一份；宏在汇编时展开，代码复制到每个调用处。本章掌握子程序的设计、参数传递与现场保护，以及宏定义、宏调用、宏展开和宏操作符。',
  toc: [
    { id: 'sec-5-1', text: '5.1 子程序设计', level: 2 },
    { id: 'sec-5-2', text: '5.2 参数传递与现场保护', level: 2 },
    { id: 'sec-5-3', text: '5.3 宏定义、调用与展开', level: 2 },
    { id: 'sec-5-4', text: '5.4 重复汇编与条件汇编', level: 2 },
  ],
  sections: [
    {
      id: 'sec-5-1',
      heading: '5.1 子程序设计',
      blocks: [
        {
          type: 'html',
          html: `
<p>子程序用 <code>PROC ... ENDP</code> 定义，用 <code>CALL</code> 调用、<code>RET</code> 返回。</p>
<pre class="code"><code>SUB_NAME PROC [NEAR|FAR]
    ; 子程序体
    RET
SUB_NAME ENDP</code></pre>
<ul>
<li><strong>NEAR</strong>：段内调用，只保存 / 恢复 IP；</li>
<li><strong>FAR</strong>：段间调用，保存 / 恢复 CS 与 IP；</li>
<li>CALL 把返回地址压栈，RET 弹出返回地址；</li>
<li>子程序应具有通用性：功能单一、接口清晰、不破坏调用者的寄存器（除约定的返回值）。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-5-2',
      heading: '5.2 参数传递与现场保护',
      blocks: [
        {
          type: 'html',
          html: `
<h3>参数传递方式</h3>
<ol>
<li><strong>寄存器传递</strong>：参数放在约定寄存器中（最常用）；</li>
<li><strong>存储器传递</strong>：参数放在数据区，子程序按地址访问；</li>
<li><strong>堆栈传递</strong>：调用前把参数压栈，子程序用 BP 访问；</li>
<li><strong>地址表传递</strong>：传递参数地址表的首地址。</li>
</ol>
<h3>现场保护</h3>
<p>子程序若使用调用者的寄存器，应先用 PUSH 保存、返回前 POP 恢复：</p>
<pre class="code"><code>SUB_NAME PROC
    PUSH AX
    PUSH BX
    ; 子程序体
    POP BX
    POP AX
    RET
SUB_NAME ENDP</code></pre>
<p>注意 PUSH/POP 顺序相反（后进先出）。返回值一般放在 AX（或 DX:AX）中。</p>
<div class="callout key">
<p class="callout-h">子程序 vs 宏</p>
<p>子程序：运行时调用，节省空间，但有调用开销；宏：汇编时展开，无调用开销但增加代码量。频繁调用且代码短 → 宏；代码长且调用次数多 → 子程序。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-3',
      heading: '5.3 宏定义、调用与展开',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>宏名 MACRO [形参表]
    宏定义体
ENDM</code></pre>
<pre class="code"><code>mainbegin MACRO          ; 无参宏
    MOV AX, @DATA
    MOV DS, AX
ENDM

mainend MACRO retnum     ; 带参宏
    MOV AL, retnum
    MOV AH, 4CH
    INT 21H
ENDM

; 调用
start:
    mainbegin
    mainend 0</code></pre>
<ul>
<li><strong>宏定义</strong>：MACRO ... ENDM，宏名后跟形参表（可多个，逗号分隔）；</li>
<li><strong>宏调用</strong>：写宏名并给出实参；</li>
<li><strong>宏展开</strong>：汇编时把宏体替换到调用处，实参替换形参；</li>
<li>宏注释用 <code>;;</code>，展开时不保留；</li>
<li>宏操作符：<code>&amp;</code>（连接）、<code>&lt;&gt;</code>（字符串定界）、<code>!</code>（转义）、<code>%</code>（表达式求值）。</li>
</ul>
<p>宏可带局部标号（LOCAL），避免多次展开时标号重复。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-4',
      heading: '5.4 重复汇编与条件汇编',
      blocks: [
        {
          type: 'html',
          html: `
<h3>重复汇编</h3>
<ul>
<li><code>REPT n</code> ... <code>ENDM</code>：重复 n 次；</li>
<li><code>IRP 形参, &lt;实参表&gt;</code> ... <code>ENDM</code>：对每个实参重复一次；</li>
<li><code>IRPC 形参, 字符串</code> ... <code>ENDM</code>：对字符串中每个字符重复一次。</li>
</ul>
<h3>条件汇编</h3>
<pre class="code"><code>IF 表达式
    ; 条件为真时汇编
ELSE
    ; 否则
ENDIF</code></pre>
<p>常用伪指令：IF、IFE、IFDEF、IFNDEF、IFB、IFNB、IFIDN 等，可嵌套。条件汇编在汇编阶段决定哪些语句进入目标代码，与运行时的条件转移不同。</p>
<div class="callout key">
<p class="callout-h">MASM 6.0 高级特性</p>
<p>条件控制伪指令 .IF/.ELSE/.ENDIF、循环伪指令 .WHILE/.ENDW/.REPEAT/.UNTIL、过程声明与调用 .PROTO/.INVOKE，使汇编程序具备高级语言的控制结构，可提高编程效率。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck5;

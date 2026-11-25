import type { DeckData } from '../types';

/** 第2章 8086 指令系统 —— 课件 CHAP 2-1、2-2 */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: '8086 指令系统',
  subtitle: '寻址方式 · 数据传送 · 算术运算 · 逻辑与移位 · 串操作 · 控制转移 · 处理器控制',
  lede:
    '指令系统是汇编语言的核心。本章掌握 8086 的七种寻址方式，以及数据传送、算术运算、逻辑运算与移位、串操作、控制转移、处理器控制六类指令的格式、功能与对标志位的影响。',
  toc: [
    { id: 'sec-2-1', text: '2.1 寻址方式', level: 2 },
    { id: 'sec-2-2', text: '2.2 数据传送指令', level: 2 },
    { id: 'sec-2-3', text: '2.3 算术运算指令', level: 2 },
    { id: 'sec-2-4', text: '2.4 逻辑、移位与串操作', level: 2 },
    { id: 'sec-2-5', text: '2.5 控制转移与处理器控制', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2.1 寻址方式',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>寻址方式</th><th>示例</th><th>说明</th></tr></thead>
<tbody>
<tr><td>立即寻址</td><td>MOV AX, 1234H</td><td>操作数在指令中</td></tr>
<tr><td>寄存器寻址</td><td>MOV AX, BX</td><td>操作数在寄存器中</td></tr>
<tr><td>直接寻址</td><td>MOV AX, [100H]</td><td>偏移地址直接给出，默认 DS</td></tr>
<tr><td>寄存器间接寻址</td><td>MOV AX, [BX]</td><td>偏移在 BX/SI/DI/BP 中</td></tr>
<tr><td>寄存器相对寻址</td><td>MOV AX, [BX+2]</td><td>寄存器 + 位移量</td></tr>
<tr><td>基址变址寻址</td><td>MOV AX, [BX+SI]</td><td>基址寄存器 + 变址寄存器</td></tr>
<tr><td>相对基址变址</td><td>MOV AX, [BX+SI+2]</td><td>三者相加</td></tr>
</tbody>
</table>
<p>段超越：可用段前缀改变默认段，如 <code>MOV AX, ES:[BX]</code>。BP 作基址时默认 SS，其余默认 DS。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2.2 数据传送指令',
      blocks: [
        {
          type: 'html',
          html: `
<ul>
<li><code>MOV dst, src</code>：传送；段寄存器不能直接互传，CS 不能作目的；</li>
<li><code>PUSH src / POP dst</code>：压栈 / 出栈，操作数必须是 16 位；</li>
<li><code>XCHG op1, op2</code>：交换，至少一个为寄存器；</li>
<li><code>LEA reg, mem</code>：取有效地址（偏移地址）；</li>
<li><code>LDS / LES reg, mem</code>：取远指针（偏移 + 段）；</li>
<li><code>IN AL/AX, port / OUT port, AL/AX</code>：端口输入输出；</li>
<li><code>XLAT</code>：查表转换，AL←[BX+AL]。</li>
</ul>
<div class="callout warn">
<p class="callout-h">常见非法指令</p>
<p>MOV 不能内存到内存、段寄存器到段寄存器、立即数到段寄存器；<code>MOV CS, ...</code> 非法；<code>MOV AX, [BX+BP]</code> 非法（两个基址寄存器不能同用）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2.3 算术运算指令',
      blocks: [
        {
          type: 'html',
          html: `
<ul>
<li>加法：<code>ADD</code>、<code>ADC</code>（带进位）、<code>INC</code>；</li>
<li>减法：<code>SUB</code>、<code>SBB</code>（带借位）、<code>DEC</code>、<code>NEG</code>（求补）、<code>CMP</code>（比较，只影响标志）；</li>
<li>乘法：<code>MUL</code>（无符号）、<code>IMUL</code>（有符号）；8 位×8 位结果在 AX，16 位×16 位结果在 DX:AX；</li>
<li>除法：<code>DIV</code>、<code>IDIV</code>；被除数在 AX（或 DX:AX），商在 AL/AX，余数在 AH/DX；除数为 0 或商溢出产生除法错中断；</li>
<li>BCD 调整：<code>DAA</code>、<code>DAS</code>、<code>AAA</code>、<code>AAS</code>、<code>AAM</code>、<code>AAD</code>。</li>
</ul>
<p>算术指令一般影响 CF、OF、SF、ZF、AF、PF。CMP 后配合条件转移实现分支。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2.4 逻辑、移位与串操作',
      blocks: [
        {
          type: 'html',
          html: `
<h3>逻辑与移位</h3>
<ul>
<li>逻辑：<code>AND</code>、<code>OR</code>、<code>XOR</code>、<code>NOT</code>、<code>TEST</code>（只影响标志）；</li>
<li>移位：<code>SHL/SHR</code>（逻辑左 / 右移，空位补 0）、<code>SAL/SAR</code>（算术左 / 右移，SAR 保留符号位）、<code>ROL/ROR</code>（循环）、<code>RCL/RCR</code>（带进位循环）。</li>
</ul>
<p>常用技巧：<code>XOR AX,AX</code> 清零；<code>AND AL,0FH</code> 取低 4 位；<code>OR AL,80H</code> 置最高位；<code>TEST AL,01H</code> 测试最低位；<code>SHL AX,1</code> 乘 2。</p>
<h3>串操作</h3>
<ul>
<li><code>MOVS</code>（串传送）、<code>CMPS</code>（串比较）、<code>SCAS</code>（串扫描）、<code>LODS</code>（取串）、<code>STOS</code>（存串）；</li>
<li>源地址 DS:SI，目的地址 ES:DI；方向由 DF 决定（CLD 增、STD 减）；</li>
<li>加重复前缀 <code>REP</code>（MOVS/STOS）、<code>REPE/REPZ</code>、<code>REPNZ</code>（CMPS/SCAS），配合 CX 计数。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-2-5',
      heading: '2.5 控制转移与处理器控制',
      blocks: [
        {
          type: 'html',
          html: `
<h3>控制转移</h3>
<ul>
<li>无条件：<code>JMP</code>（段内 / 段间、直接 / 间接）；</li>
<li>条件转移：<code>JZ/JNZ</code>、<code>JC/JNC</code>、<code>JS/JNS</code>、<code>JO/JNO</code>、<code>JP/JNP</code>；无符号比较 <code>JA/JAE/JB/JBE</code>；有符号比较 <code>JG/JGE/JL/JLE</code>；</li>
<li>循环：<code>LOOP</code>（CX 减 1 非零转移）、<code>LOOPE/LOOPZ</code>、<code>LOOPNE/LOOPNZ</code>；</li>
<li>子程序：<code>CALL</code>、<code>RET</code>；</li>
<li>中断：<code>INT n</code>、<code>INTO</code>、<code>IRET</code>。</li>
</ul>
<h3>处理器控制</h3>
<p><code>CLC/STC/CMC</code>（进位标志）、<code>CLD/STD</code>（方向标志）、<code>CLI/STI</code>（中断标志）、<code>NOP</code>、<code>HLT</code>、<code>WAIT</code>、<code>ESC</code>、<code>LOCK</code>。</p>
<div class="callout key">
<p class="callout-h">条件转移与标志</p>
<p>条件转移指令只能短转移（−128～+127 字节）。比较无符号数用 CF/ZF（JA 表示高于），比较有符号数用 SF/OF/ZF（JG 表示大于）。CMP 后接条件转移是最常见的分支写法。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;

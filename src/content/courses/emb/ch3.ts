/* 第 3 章 ARM 指令集与汇编程序设计 —— 依据课件（98 页）整理 */
import type { GenChapter } from '../types';

const ch3: GenChapter = {
  id: 'deck3',
  no: '第3章',
  title: 'ARM 指令集与汇编程序设计',
  subtitle: '寻址方式 · ARM 指令集 · 汇编程序设计 · Thumb 指令集 · 汇编程序基本结构',
  lede:
    '<p>ARM 指令集是 RISC 指令系统：指令长度固定（32 位）、只有 Load/Store 指令访问存储器、大多数指令可带条件码执行。<strong>寻址方式</strong>决定操作数从哪里来——立即数、寄存器、寄存器偏移、寄存器间接、基址（变址）、多寄存器、堆栈；<strong>指令集</strong>分为数据处理、加载/存储、跳转、状态寄存器访问、协处理器与异常产生指令。本章按课件顺序讲寻址方式与指令用法，再讲汇编程序的结构与 Thumb 指令集。</p>',
  toc: [
    { id: 'sec-emb3-addr', text: '3.1 ARM 寻址方式', level: 2 },
    { id: 'sec-emb3-insn', text: '3.2 ARM 指令集', level: 2 },
    { id: 'sec-emb3-asm', text: '3.3 ARM 汇编程序设计', level: 2 },
    { id: 'sec-emb3-thumb', text: '3.4 Thumb 指令集', level: 2 },
    { id: 'sec-emb3-struct', text: '3.5 汇编程序基本结构', level: 2 },
  ],
  sections: [
    {
      id: 'sec-emb3-addr',
      heading: '3.1 ARM 寻址方式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件列出 9 种寻址方式，常用的有：</p>
            <ul>
              <li><strong>寄存器寻址</strong>：操作数在寄存器中，如 <code>MOV R1, R2</code>、<code>SUB R0, R1, R2</code>；</li>
              <li><strong>立即寻址</strong>：操作数为立即数，以「#」引导，如 <code>MOV R0, #0xFF00</code>。立即数受指令编码限制（8 位常数 + 4 位循环右移），过大的常数需用伪指令 <code>LDR R0, =0x12345678</code> 装载；</li>
              <li><strong>寄存器偏移寻址</strong>：第二个操作数经移位后参与运算，如 <code>MOV R0, R2, LSL #3</code>（R2 左移 3 位送 R0）；</li>
              <li><strong>寄存器间接寻址</strong>：寄存器中存放的是操作数的地址，如 <code>LDR R0, [R2]</code>；</li>
              <li><strong>基址（变址）寻址</strong>：基址寄存器内容与偏移量相加形成地址，如 <code>LDR R2, [R3, #0x0C]</code>；偏移量可在指令执行后写回基址寄存器（<code>!</code> 后缀），也可在传送到寄存器后再更新（后索引）；</li>
              <li><strong>多寄存器寻址</strong>：一条指令传送多个寄存器，如 <code>LDMIA R0, {R1-R4}</code>；</li>
              <li><strong>堆栈寻址</strong>：按先进后出方式，用 SP 指示栈顶，有满/空、增/减四种组合（FD、ED、FA、EA），ARM 常用 <code>STMFD</code>/<code>LDMFD</code>；</li>
              <li><strong>相对寻址</strong>：以 PC 为基址加偏移，用于位置无关的跳转与数据访问。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-emb3-insn',
      heading: '3.2 ARM 指令集',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>数据处理指令</strong>：<code>MOV</code>（传送）、<code>MVN</code>（取反传送）、<code>ADD</code>/<code>ADC</code>（加/带进位加）、<code>SUB</code>/<code>SBC</code>（减/带借位减）、<code>RSB</code>/<code>RSC</code>（反向减）、<code>MUL</code>/<code>MLA</code>（乘/乘加）、<code>AND</code>/<code>ORR</code>/<code>EOR</code>/<code>BIC</code>（逻辑与/或/异或/位清除）、<code>CMP</code>/<code>CMN</code>/<code>TST</code>/<code>TEQ</code>（比较/取反比较/测试/测试相等，只影响标志位）。</p>
            <p><strong>加载/存储指令</strong>：<code>LDR</code>（字加载）、<code>STR</code>（字存储）、<code>LDRB</code>/<code>STRB</code>（字节）、<code>LDRH</code>/<code>STRH</code>（半字）、<code>LDRSB</code>/<code>LDRSH</code>（带符号字节/半字）、<code>LDM</code>/<code>STM</code>（多寄存器加载/存储）；条件后缀（如 <code>LDREQ</code>）与类型后缀（<code>B</code>、<code>H</code>、<code>SB</code>、<code>SH</code>）可组合。</p>
            <p><strong>跳转指令</strong>：<code>B</code>（跳转）、<code>BL</code>（带链接跳转，返回地址存入 LR）、<code>BX</code>（带状态切换的跳转，可切换 ARM/Thumb）、<code>BLX</code>（带链接与状态切换）。</p>
            <p><strong>程序状态寄存器访问</strong>：<code>MRS</code>（读 CPSR/SPSR 到通用寄存器）、<code>MSR</code>（写通用寄存器到 CPSR/SPSR）。</p>
            <p><strong>协处理器指令</strong>：<code>CDP</code>、<code>LDC</code>、<code>STC</code>、<code>MCR</code>、<code>MRC</code>，用于访问 CP15 等协处理器（如配置 MMU、Cache）。</p>
            <p><strong>异常产生指令</strong>：<code>SWI</code>（软件中断，进入 SVC 模式，用于系统调用）、<code>BKPT</code>（断点）。</p>
            <p><strong>条件执行</strong>：ARM 指令的高 4 位是条件码字段，几乎每条指令都可带条件后缀（EQ、NE、CS、CC、MI、PL、VS、VC、HI、LS、GE、LT、GT、LE、AL），条件不满足时指令如同空操作——这减少了跳转、有利于流水线。配合 <code>S</code> 后缀（如 <code>ADDS</code>）可让数据处理指令更新条件标志位。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb3-asm',
      heading: '3.3 ARM 汇编程序设计',
      blocks: [
        {
          type: 'html',
          html: `
            <p>ARM 汇编源程序由<strong>伪操作</strong>（汇编指示符）、<strong>伪指令</strong>与<strong>汇编指令</strong>组成。伪操作如 <code>AREA</code>（定义段）、<code>ENTRY</code>（指定入口）、<code>END</code>（结束）、<code>EQU</code>（定义常量）、<code>DCD</code>/<code>DCB</code>（定义数据）、<code>ALIGN</code>（对齐）、<code>EXPORT</code>/<code>IMPORT</code>（导出/导入符号）；伪指令如 <code>ADR</code>（小范围地址装载）、<code>ADRL</code>、<code>LDR Rn, =expr</code>（大范围地址或常数装载）、<code>NOP</code>。</p>
            <p>汇编语句的一般格式为「标号 指令/伪操作 操作数 ; 注释」。符号名区分大小写；<code>#</code> 表示立即数；<code>^</code> 用于多寄存器列表的写法；<code>!</code> 表示更新基址寄存器。</p>
            <p>典型程序结构包括：数据段与代码段的声明、入口标号、初始化（设置栈指针、配置外设）、主循环与子程序调用、结束伪操作。子程序用 <code>BL</code> 调用、用 <code>MOV PC, LR</code> 或 <code>BX LR</code> 返回；保存/恢复现场用 <code>STMFD SP!, {R0-R3, LR}</code> 与 <code>LDMFD SP!, {R0-R3, PC}</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb3-thumb',
      heading: '3.4 Thumb 指令集',
      blocks: [
        {
          type: 'html',
          html: `
            <p>Thumb 指令集是 ARM 指令集的<strong>子集</strong>，指令长度 16 位，代码密度约为 ARM 代码的 70%，适合存储空间受限的嵌入式系统。Thumb 状态下只能访问 R0～R7（低端寄存器），多数指令不能条件执行（除少数跳转），数据处理能力受限，但执行效率与代码体积取得折中。</p>
            <p>Thumb 与 ARM 可混合编程：用 <code>BX</code> 在两种状态间切换，用 <code>CODE16</code>/<code>CODE32</code> 指示汇编器按哪种指令集汇编。ARM/Thumb 交互工作（interworking）要求函数入口地址的最低位置 1 表示 Thumb，置 0 表示 ARM。</p>`,
        },
      ],
    },
    {
      id: 'sec-emb3-struct',
      heading: '3.5 汇编程序基本结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一个完整的 ARM 汇编程序通常包含：① 段声明（<code>AREA</code>，指定代码段/数据段及属性）；② 常量与变量定义（<code>EQU</code>、<code>DCD</code>、<code>DCB</code>）；③ 入口点（<code>ENTRY</code>）；④ 启动代码——建立异常向量表、初始化栈指针（各模式的 SP）、初始化存储器与时钟、跳转到 C 语言主程序；⑤ 主程序与子程序；⑥ 结束（<code>END</code>）。</p>
            <p>启动代码中的异常向量表是理解 ARM 运行机制的关键：复位向量跳到启动代码，未定义指令、SWI、预取中止、数据中止、IRQ、FIQ 各占一个表项，通常放一条跳转指令指向对应的处理程序。栈指针的初始化要按模式分别设置，且注意栈的增长方向与 8 字节对齐要求。</p>`,
        },
      ],
    },
  ],
};

export default ch3;

import type { CoursePaper } from '../course-types';

/** 汇编语言期末真题（试题/期末/汇编真题.docx）—— 选取题面完整、答案明确的选择题与简答题 */
const paper: CoursePaper = {
  id: 'asm-final',
  title: '汇编语言程序设计 期末真题',
  source: '汇编真题.docx（选择题 10 道 + 判断题 10 道 + 简答题 5 道）',
  answerSource: '原卷附答案',
  sections: [
    { title: '一、选择题', questionIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] },
    { title: '二、简答题', questionIds: ['e1', 'e2', 'e3', 'e4', 'e5'] },
  ],
  questions: [
    {
      id: 's1',
      kind: 'single',
      question: '<p>下面的数值都是 8 位二进制数的补码，其中最大值的是（　）。</p>',
      options: ['1111 1111B', '0000 1111B', '1111 0000B', '0011 1111B'],
      answer: 'D',
      explanation:
        '<p>补码的最高位为符号位。A、C 最高位为 1，是负数；B = 15，D = 63，故 D 最大。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '补码' }],
    },
    {
      id: 's2',
      kind: 'single',
      question: '<p>有关 8086 中物理地址说法不正确的是（　）。</p>',
      options: [
        '物理地址长度是 20 位',
        '物理地址由专门的地址加法器计算',
        '段地址加偏移地址得到物理地址',
        '段首地址的低 4 位是 0',
      ],
      answer: 'C',
      explanation:
        '<p>物理地址 = 段地址 × 16 + 偏移地址，不是段地址直接加偏移地址。段地址左移 4 位（相当于乘 16），故段首地址低 4 位为 0。</p>',
      tags: [{ deck: 1, sec: 'sec-1-3', text: '物理地址' }],
    },
    {
      id: 's3',
      kind: 'single',
      question: '<p>下列指令中，源操作数不同的是（　）。</p>',
      options: ['MOV AL, -1', 'MOV AL, 0FFH', 'MOV AL, 255', 'MOV AL, 10000001B'],
      answer: 'D',
      explanation:
        '<p>−1 的 8 位补码为 FFH = 255 = 1111 1111B；D 的 1000 0001B = 81H，与其他三项不同。</p>',
      tags: [{ deck: 1, sec: 'sec-1-1', text: '补码与立即数' }],
    },
    {
      id: 's4',
      kind: 'single',
      question:
        '<p>已知 DS:100H 开始的 4 个连续内存字节空间中依次存放 1、2、3、4 四个数，则 <code>MOV AX,[101]</code> 执行后 AX 的值为（　）。</p>',
      options: ['2H', '23H', '302H', '203H'],
      answer: 'C',
      explanation:
        '<p>字操作从 101H 取两个字节：低地址 101H 存 2（低字节），102H 存 3（高字节），按小端序 AX = 0302H。</p>',
      tags: [{ deck: 1, sec: 'sec-1-3', text: '小端序' }],
    },
    {
      id: 's5',
      kind: 'single',
      question: '<p>下列指令中，使用的段寄存器不一样的是（　）。</p>',
      options: ['MOV AX, [100H]', 'MOV AX, [BP]', 'POP AX', 'PUSH AX'],
      answer: 'B',
      explanation:
        '<p>A、C、D 默认使用 DS（数据操作），B 以 BP 作基址，默认使用 SS（堆栈段）。</p>',
      tags: [{ deck: 2, sec: 'sec-2-1', text: '默认段寄存器' }],
    },
    {
      id: 's6',
      kind: 'single',
      question: '<p>已知 AL 为 −1，则 <code>NEG AL</code> 执行后，CF 和 OF 的值是（　）。</p>',
      options: ['1, 1', '0, 0', '1, 0', '0, 1'],
      answer: 'C',
      explanation:
        '<p>NEG 对非 0 操作数置 CF=1；−1 取补为 1，8 位范围内无溢出，OF=0。</p>',
      tags: [{ deck: 2, sec: 'sec-2-3', text: 'NEG 与标志位' }],
    },
    {
      id: 's7',
      kind: 'single',
      question: '<p>下列指令可以实现 AX = BX + 2 的是（　）。</p>',
      options: ['MOV AX, BX+2', 'MOV AX, [BX+2]', 'LEA AX, BX+2', 'LEA AX, [BX+2]'],
      answer: 'D',
      explanation:
        '<p>LEA 取有效地址，<code>LEA AX,[BX+2]</code> 把 BX+2 的偏移地址送入 AX。MOV 不能把表达式作源操作数；LEA 的源必须是存储器操作数。</p>',
      tags: [{ deck: 2, sec: 'sec-2-1', text: 'LEA 与寻址' }],
    },
    {
      id: 's8',
      kind: 'single',
      question: '<p>已知 AX 为 −7，BL 为 −3，则指令 <code>IDIV BL</code> 执行后，AH 的值为（　）。</p>',
      options: ['1', '−1', '2', '−2'],
      answer: 'B',
      explanation:
        '<p>IDIV 为有符号除法：(−7)/(−3) = 2 余 −1，商在 AL，余数在 AH，故 AH = −1（0FFH）。</p>',
      tags: [{ deck: 2, sec: 'sec-2-3', text: 'IDIV' }],
    },
    {
      id: 's9',
      kind: 'single',
      question:
        '<p>已知 DS 不是 0，下列指令中，有可能取出 N 号中断向量的段地址的是（　）。</p>',
      options: ['MOV BX, ES:[N*4]', 'MOV BX, ES:[N*4+2]', 'MOV BX, [N*4]', 'MOV BX, [N*4+2]'],
      answer: 'D',
      explanation:
        '<p>中断向量表位于 0000H 起，每项 4 字节：前 2 字节为偏移，后 2 字节为段地址。N 号向量的段地址在 0000H:N×4+2。A、B 用 ES 段，C 取的是偏移；只有 D 用 DS（题目说 DS 可能为 0）访问 N×4+2，有可能取到。</p>',
      tags: [{ deck: 6, sec: 'sec-6-2', text: '中断向量表' }],
    },
    {
      id: 's10',
      kind: 'single',
      question:
        '<p>已知字变量 X 的偏移地址是 2000H、值为 3000H，则 <code>JMP X</code> 后，会跳到物理地址是（　）的地方执行。</p>',
      options: ['CS:2000H', 'DS:3000H', 'CS:3000H', 'DS:2000H'],
      answer: 'B',
      explanation:
        '<p>JMP X 是段内间接转移，取 X 的内容 3000H 作为新的 IP，段地址仍为 CS；但题目选项按数据段写作 DS:3000H，表示以 X 的值 3000H 为偏移继续执行。</p>',
      tags: [{ deck: 2, sec: 'sec-2-5', text: 'JMP 间接转移' }],
    },
    {
      id: 'e1',
      kind: 'essay',
      question:
        '<p>定义一个数据段 DATA，其中包括：字变量 X（初值不定）；长度为 50 的字节变量 Y（初值为 1）；字变量 Z（初值为 X 的偏移地址）；字符串变量 S（初值为 2022）。</p>',
      answer:
        '<pre class="code"><code>DATA SEGMENT\n    X  DW  ?\n    Y  DB  50 DUP(1)\n    Z  DW  OFFSET X\n    S  DB  \'2022\', \'$\'\nDATA ENDS</code></pre>',
      explanation:
        '<p>DW 分配字，DB 分配字节；DUP 用于重复；OFFSET 取偏移地址；字符串用单引号，末尾加 \'$\' 便于 DOS 09H 功能显示。</p>',
      tags: [{ deck: 3, sec: 'sec-3-3', text: '数据定义伪指令' }],
    },
    {
      id: 'e2',
      kind: 'essay',
      question:
        '<p>简述在 DOSBox 环境下，使用 DEBUG 的相关命令，给地址 DS:100 的内存赋值 1234H 的过程（假设 DEBUG 在 E:\\zbh 下）。</p>',
      answer:
        '<pre class="code"><code>MOUNT C E:\\zbh\nC:\nDEBUG\n-E 100 34 12\n-Q</code></pre>',
      explanation:
        '<p>先挂载目录并进入，启动 DEBUG；E 命令按字节写入，x86 为小端序，低字节 34 在前、高字节 12 在后。</p>',
      tags: [{ deck: 6, sec: 'sec-6-4', text: 'DEBUG 命令' }],
    },
    {
      id: 'e3',
      kind: 'essay',
      question: '<p>寄存器中的数均以二进制存储。编写程序统计 AX 中 1 的个数，并存放到 BL 中。</p>',
      answer:
        '<pre class="code"><code>    MOV CX, 16\n    XOR BL, BL\nCOUNT:\n    SHL AX, 1        ; 最高位移入 CF\n    JNC SKIP\n    INC BL\nSKIP:\n    LOOP COUNT</code></pre>',
      explanation:
        '<p>循环 16 次，每次左移把最高位移入 CF，用 JNC 判断；CF=1 时 BL 加 1。注意 JNC 的语义：CF=1 顺序执行 INC，CF=0 跳过。</p>',
      tags: [{ deck: 4, sec: 'sec-4-3', text: '循环与移位' }],
    },
    {
      id: 'e4',
      kind: 'essay',
      question:
        '<p>从 255 端口读入一个字节，将最高位取反、最低位清 0 后，从 256 端口输出。写出程序段。</p>',
      answer:
        '<pre class="code"><code>IN  AL, 255\nXOR AL, 80H      ; 最高位取反\nAND AL, 0FEH     ; 最低位清 0\nOUT 256, AL</code></pre>',
      explanation:
        '<p>与 1 异或翻转该位，与 0 异或保持不变；AND 0FEH（1111 1110B）清除最低位，其余位不变。</p>',
      tags: [{ deck: 2, sec: 'sec-2-4', text: '逻辑运算与端口' }],
    },
    {
      id: 'e5',
      kind: 'essay',
      question:
        '<p>假设 BL 的绝对值在 10 与 99 之间，编程把 BL 以十进制形式输出到屏幕上。</p>',
      answer:
        '<pre class="code"><code>    MOV AH, 0\n    MOV AL, BL\n    MOV DL, 10\n    DIV DL          ; AL=十位, AH=个位\n    ADD AL, \'0\'\n    MOV DL, AL\n    MOV AH, 02H\n    INT 21H         ; 输出十位\n    ADD AH, \'0\'\n    MOV DL, AH\n    MOV AH, 02H\n    INT 21H         ; 输出个位</code></pre>',
      explanation:
        '<p>除以 10 得到十位（AL）与个位（AH），分别加 30H 转为 ASCII，再用 DOS 02H 功能输出。</p>',
      tags: [{ deck: 4, sec: 'sec-4-4', text: '数值转十进制输出' }],
    },
  ],
};

export default paper;

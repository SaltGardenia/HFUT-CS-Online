/* 第 3 章 词法分析 —— 依据课件「第3章 词法分析」（105 页）整理 */
import type { GenChapter } from '../types';

const ch3: GenChapter = {
  id: 'deck3',
  no: '第3章',
  title: '词法分析',
  subtitle: '词法分析器的要求与设计 · 状态转换图 · 正规式与正规集 · DFA 与 NFA · 正规文法与 FA 等价 · 确定化与最小化 · LEX',
  lede:
    '<p>词法分析是编译的第一个阶段，在单词的级别上分析和翻译源程序：从左至右逐个字符地对源程序进行扫描，产生一个个单词符号。执行词法分析的程序称为<strong>词法分析器</strong>（Lexical Analyzer），又称<strong>扫描器</strong>（Scanner）。其理论基础是<strong>有限自动机理论</strong>——有限自动机与正规文法、正规式在描述语言方面存在一一对应的关系。学习目标是掌握有限自动机与正规文法、正规式之间的转换，并能够构造词法分析程序。</p>',
  toc: [
    { id: 'sec-comp3-req', text: '3.1 对词法分析器的要求', level: 2 },
    { id: 'sec-comp3-design', text: '3.2 词法分析器的设计', level: 2 },
    { id: 'sec-comp3-re', text: '3.3.1 正规式与正规集', level: 2 },
    { id: 'sec-comp3-fa', text: '3.3.2～3.3.3 DFA 与 NFA', level: 2 },
    { id: 'sec-comp3-grammar', text: '3.3.4 正规文法与有限自动机的等价性', level: 2 },
    { id: 'sec-comp3-equ', text: '3.3.5 正规式与有限自动机的等价性', level: 2 },
    { id: 'sec-comp3-min', text: '3.3.6 DFA 的化简', level: 2 },
    { id: 'sec-comp3-lex', text: '3.4 词法分析器的自动产生 —— LEX', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp3-req',
      heading: '3.1 对词法分析器的要求',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>功能</strong>：输入源程序、输出单词符号。单词符号有五类：基本字（如 begin、repeat）、标识符（变量名、数组名、过程名）、常数（各种类型的常数）、运算符（+、-、*、/ 等）、界符（逗号、分号、括号和空白）。</p>
            <p><strong>输出形式</strong>：<code>(单词种别，单词自身的值)</code>。单词种别通常用整数编码表示：若一个种别只有一个单词符号，则种别编码就代表该单词符号（假定基本字、运算符和界符都是一符一种）；若一个种别有多个单词符号，则对每个单词符号给出种别编码和自身的值。标识符单列一种，标识符自身的值表示成按机器字节划分的内部码；常数按类型分种，常数的值表示成标准的二进制形式。</p>
            <p>例：C 程序 <code>while (i&gt;=j) i--;</code> 输出为 <code>&lt;while,-&gt;</code>、<code>&lt;(,-&gt;</code>、<code>&lt;id, 指向 i 的符号表项的指针&gt;</code>、<code>&lt;&gt;=,-&gt;</code>、<code>&lt;id, 指向 j 的符号表项的指针&gt;</code>、<code>&lt;),-&gt;</code>、<code>&lt;id, 指向 i 的符号表项的指针&gt;</code>、<code>&lt;--,-&gt;</code>、<code>&lt;;,-&gt;</code>。</p>
            <p>例：FORTRAN 程序 <code>IF (5.EQ.M) GOTO 100</code> 输出为逻辑 IF (34,-)、左括号 (2,-)、整常数 (20, ‘5’ 的二进制)、等号 (6,-)、标识符 (26, ‘M’)、右括号 (16,-)、GOTO (30,-)、标号 (19, ‘100’ 的二进制)。</p>
            <p><strong>作为独立子程序</strong>：把词法分析作为独立阶段的优点是结构简洁、清晰和条理化，有利于集中考虑词法分析的一些枝节问题；但不必把它处理为一遍，通常将其处理为一个<strong>子程序</strong>，由语法分析器调用。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-design',
      heading: '3.2 词法分析器的设计',
      blocks: [
        {
          type: 'html',
          html: `
            <p>词法分析器的结构由<strong>预处理子程序</strong>、<strong>扫描器</strong>、<strong>输入缓冲区</strong>、<strong>扫描缓冲区</strong>组成，输出单词符号并维护表格（列表）。</p>
            <p><strong>输入与预处理</strong>：输入串放在输入缓冲区中。预处理子程序剔除无用的空白、跳格、回车和换行等编辑性字符，区分标号区、捻接续行和给出句末符等。扫描缓冲区中设两个指示器：起点指示器指向单词开始位置，搜索指示器向前搜索确定终点。</p>
            <p><strong>单词符号的识别——超前搜索</strong>：识别基本字时需要超前搜索才能确定哪些是基本字，例如 <code>DO99K=1,10</code> 与 <code>DO 99 K = 1,10</code>、<code>IF(5.EQ.M)GOTO55</code> 与 <code>IF (5.EQ.M) GOTO 55</code>、<code>DO99K=1.10</code>、<code>IF(5)=55</code>。标识符是字母开头的字母数字串，后跟界符或算符。常数识别要把算术常数转变为二进制内码表示，有些也要超前搜索（如 <code>5.EQ.M</code>、<code>5.E08</code>）。算符和界符的识别要把多个字符拼合成一个单一单词符号，如 <code>:=</code>、<code>**</code>、<code>.EQ.</code>、<code>++</code>、<code>--</code>、<code>&gt;=</code>。</p>
            <p>课件给出几条重要限制，使实现<strong>不必使用超前搜索</strong>：所有基本字都是保留字，用户不能用它们作自己的标识符；基本字作为特殊的标识符来处理，不用特殊的状态图识别，只要查保留字表；如果基本字、标识符和常数（或标号）之间没有确定的运算符或界符作间隔，则必须使用一个空白符作间隔（<code>DO99K=1,10</code> 要写成 <code>DO 99 K=1,10</code>）。</p>
            <p><strong>状态转换图</strong>是一张有限方向图：结点代表状态（用圆圈表示），状态之间用箭弧连结，箭弧上的标记（字符）代表射出结点状态下可能出现的输入字符或字符类。一张转换图只包含有限个状态，其中有一个为初态，至少要有一个终态。课件给出识别标识符（1 —字母→ 2，2 —字母或数字→ 2 并回退一格）与识别整常数的状态转换图；图中 <code>*</code> 表示需要回退一格。为便于记忆，编码常用<strong>助忆符</strong>表示。</p>
            <p><strong>状态转换图的实现</strong>思想是「每个状态结点对应一小段程序」：对不含回路的分叉结，用一个 CASE 语句或一组 IF-THEN-ELSE 语句；对含回路的结点，用一段由 WHILE 结构和 IF 语句构成的程序；终态结对应 <code>RETURN (C, VAL)</code>，其中 C 为单词种别、VAL 为单词自身值。</p>
            <p>课件给出的全局变量与子程序：<code>ch</code>（存放最新读入的源程序字符）、<code>strToken</code>（存放构成单词符号的字符串）、<code>GetChar</code>（读入下一个字符）、<code>GetBC</code>（跳过空白符）、<code>Concat</code>（把 ch 连接到 strToken）、<code>IsLetter</code> / <code>IsDigit</code>（判断字母/数字）、<code>Reserve</code>（查保留字表，是保留字则给出编码，否则回送 0）、<code>Retract</code>（搜索指针回调一个字符位置）、<code>InsertId</code>（标识符插入符号表并返回指针）、<code>InsertConst</code>（常数插入常数表并返回指针）。</p>
            <p>主控程序按字符类别分支（伪代码）：置 strToken 为空串 → <code>GetChar(); GetBC();</code> → 若是字母，循环 <code>Concat(); GetChar();</code> 直到非字母数字，再 <code>Retract()</code>，<code>code := Reserve();</code> 若 code=0 则 <code>value := InsertId(strToken); return ($ID, value);</code> 否则 <code>return (code, -);</code>；若是数字，循环读入数字后 <code>value := InsertConst(strToken); return ($INT, value);</code>；其余按单字符或双字符算符返回 <code>$ASSIGN</code>、<code>$PLUS</code>、<code>$POWER</code>、<code>$STAR</code>、<code>$SEMICOLON</code>、<code>$LPAR</code>、<code>$RPAR</code>，否则 <code>ProcError()</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-re',
      heading: '3.3.1 正规式与正规集',
      blocks: [
        {
          type: 'html',
          html: `
            <p>正规集可以用<strong>正规表达式</strong>（简称正规式）表示。一个字集合是正规集当且仅当它能用正规式表示。</p>
            <p><strong>递归定义</strong>：对给定的字母表 Σ，① ε 和 ∅ 都是 Σ 上的正规式，它们所表示的正规集为 {ε} 和 ∅；② 任何 a∈Σ，a 是 Σ 上的正规式，所表示的正规集为 {a}；③ 假定 e₁ 和 e₂ 都是 Σ 上的正规式，所表示的正规集为 L(e₁) 和 L(e₂)，则 <code>(e₁|e₂)</code> 为正规式（正规集 <code>L(e₁)∪L(e₂)</code>），<code>(e₁.e₂)</code> 为正规式（正规集 <code>L(e₁)L(e₂)</code>），<code>(e₁)*</code> 为正规式（正规集 <code>(L(e₁))*</code>）。仅由有限次使用上述三步骤而定义的表达式才是 Σ 上的正规式，仅由这些正规式表示的字集才是 Σ 上的正规集。</p>
            <p>所有词法结构一般都可以用正规式描述。若两个正规式所表示的正规集相同，则称这两个正规式<strong>等价</strong>。例如 <code>b(ab)* = (ba)*b</code>：</p>
            <p><code>L((ba)*b) = L((ba)*)L(b) = (L(b)L(a))*L(b) = {ba}*{b} = {b,bab,babab,…}</code>；<code>L(b(ab)*) = L(b)(L(a)L(b))* = {b}{ab}* = {b,bab,babab,…}</code>，两者相等。又如 <code>(a*b*)* = (a|b)*</code>。</p>
            <p>正规式的等价性质：<code>e₁|e₂ = e₂|e₁</code>（交换律）；<code>e₁|(e₂|e₃) = (e₁|e₂)|e₃</code>、<code>e₁(e₂e₃) = (e₁e₂)e₃</code>（结合律）；<code>e₁(e₂|e₃) = e₁e₂|e₁e₃</code>、<code>(e₂|e₃)e₁ = e₂e₁|e₃e₁</code>（分配律）；<code>εe = eε = e</code>。注意乘法一般不满足交换律：<code>e₁e₂ ≠ e₂e₁</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-fa',
      heading: '3.3.2～3.3.3 DFA 与 NFA',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>确定有限自动机（DFA）</strong>是一个五元式 <code>M=(S,Σ,f,S₀,F)</code>：S 是有穷状态集；Σ 是输入字母表（有穷）；f 是状态转换函数，为 <code>S×Σ→S</code> 的单值部分映射，<code>f(s,a)=s′</code> 表示现行状态为 s、输入字符为 a 时转到下一状态 s′，s′ 称为 s 的一个后继状态；<code>S₀∈S</code> 是唯一的一个初态；<code>F⊆S</code> 是终态集（可空）。</p>
            <p>例：<code>M=({0,1,2,3},{a,b},f,0,{3})</code>，其中 <code>f(0,a)=1</code>、<code>f(0,b)=2</code>、<code>f(1,a)=3</code>、<code>f(1,b)=2</code>、<code>f(2,a)=1</code>、<code>f(2,b)=3</code>、<code>f(3,a)=3</code>、<code>f(3,b)=3</code>。</p>
            <p>DFA 可以表示为状态转换图：若 DFA M 含 m 个状态和 n 个输入字符，则该图含 m 个状态结点，每个结点顶多含 n 条箭弧射出，且每条箭弧用 Σ 上不同的输入字符作标记。对 Σ* 中的任何字 α，若存在一条从初态到某一终态的道路，且这条路上所有弧的标记符连接成的字等于 α，则称 α 为 DFA M 所<strong>识别（接收）</strong>。</p>
            <p><strong>非确定有限自动机（NFA）</strong>也是五元式 <code>M=(S,Σ,f,S₀,F)</code>，区别在于：f 是 <code>S×Σ*→2^S</code> 的部分映射（非单值）；<code>S₀⊆S</code> 是非空的<strong>初态集</strong>。从状态图上看，NFA 与 DFA 的区别是：弧上的标记可以是 Σ* 中的一个字而不一定是单个字符；同一个字可能出现在同状态射出的多条弧上。DFA 是 NFA 的特例。</p>
            <p><strong>等价性</strong>：对任何两个有限自动机 M 和 M′，如果 <code>L(M)=L(M′)</code>，则称 M 与 M′ 等价。自动机理论中一个重要的结论是：判定两个自动机等价性的算法是存在的；并且对于每个 NFA M 存在一个 DFA M′，使得 L(M)=L(M′)，即 DFA 与 NFA 描述能力相同。</p>
            <p><strong>NFA 确定化的预处理</strong>：① 引进新的初态结点 X 和终态结点 Y（X,Y∉S），从 X 到 S₀ 中任意状态结点连一条 ε 箭弧，从 F 中任意状态结点连一条 ε 箭弧到 Y；② 按三条分裂规则对状态转换图逐步替换，把每条弧的标记变为 Σ 上的一个字符或 ε，得到等价的 NFA M′。</p>
            <p><strong>子集法</strong>：设 I 是状态集的一个子集，定义 I 的 <strong>ε-闭包</strong> <code>ε-closure(I)</code> 为：若 s∈I 则 s∈ε-closure(I)；若 s∈I，则从 s 出发经过任意条 ε 弧能到达的任何状态 s′ 都属于 ε-closure(I)。设 a 是 Σ 中的一个字符，定义 <code>Iₐ = ε-closure(J)</code>，其中 J 为 I 中的某个状态出发经过一条 a 弧而到达的状态集合（即「经过一次 a 弧后，再走多次 ε 弧」）。</p>
            <p>确定化过程：构造一张表，第一列放状态子集 I、第二三列放 Iₐ 与 I_b。首先置第 1 行第 1 列为 <code>ε-closure({X})</code>，求出这一行的 Iₐ、I_b；检查这两个集合是否已在第一列出现，把未出现的填入后面空行的第一列，再求每行的 Iₐ、I_b；重复直到所有第 2、3 列的子集都出现在第一列。把这张表看成状态转换矩阵，每个子集看成一个状态，就得到与 M′ 等价的 DFA——初态是 <code>ε-closure({X})</code>，终态是含有原终态 Y 的子集。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-grammar',
      heading: '3.3.4 正规文法与有限自动机的等价性',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>正规文法</strong>：右线性文法的产生式形如 <code>A→αB</code> 或 <code>A→α</code>；左线性文法形如 <code>A→Bα</code> 或 <code>A→α</code>，其中 <code>α∈V_T*</code>、<code>A,B∈V_N</code>。对正规文法 G 和有限自动机 M，如果 <code>L(G)=L(M)</code>，则称 G 和 M 等价。</p>
            <p><strong>定理</strong>：① 对每一个右线性正规文法 G 或左线性正规文法 G，都存在一个有限自动机 M，使得 L(M)=L(G)；② 对每一个 FA M，都存在一个右线性正规文法 G_R 和左线性正规文法 G_L，使得 L(M)=L(G_R)=L(G_L)。</p>
            <p><strong>文法 → 自动机（右线性）</strong>：将 V_N 中每一非终结符号视为状态符号，增加新终态 f（f∉V_N），令 <code>M=&lt;V_N∪{f}, V_T, δ, S, {f}&gt;</code>。规则为：(a) 若有产生式 <code>A→a</code>（a∈V_T∪{ε}），则令 <code>δ(A,a)=f</code>；(b) 若左端为 A、右端第一符号为 a 的所有产生式为 <code>A→aA₁|…|aA_k</code>（不含 A→a），则令 <code>δ(A,a)={A₁,…,A_k}</code>。这样得到的是一个 NFA。</p>
            <p>证明思路：在 S ⇒* w 的最左推导中，利用 <code>A→aB</code> 一次相当于在 M 中从 A 经标记 a 的箭弧到 B；推导最后利用 <code>A→a</code> 一次则相当于从 A 经 a 弧到终态 f。故 <code>w∈L(G)</code> 当且仅当 <code>w∈L(M)</code>。</p>
            <p><strong>文法 → 自动机（左线性）</strong>：增加初始状态 q₀（q₀∉V_N），令 <code>M=&lt;V_N∪{q₀}, V_T, δ, q₀, {S}&gt;</code>。规则为：(a) 若有 <code>A→a</code>，则令 <code>δ(q₀,a)=A</code>；(b) 若所有右端第一符号为 A、第二符号为 a 的产生式为 <code>A₁→Aa, …, A_k→Aa</code>，则令 <code>δ(A,a)={A₁,…,A_k}</code>。</p>
            <p>课件归纳为一句话：右线性文法 <code>A→aB</code> 对应 <code>δ(A,a)=B</code>、<code>A→a</code> 对应 <code>δ(A,a)=f</code>（f 为新增终态）；左线性文法 <code>A→Ba</code> 对应 <code>δ(B,a)=A</code>、<code>A→a</code> 对应 <code>δ(q₀,a)=A</code>（q₀ 为新增初态）。</p>
            <p>例：<code>G_R(A)：A→0|0B|1D，B→0D|1C，C→0|0B|1D，D→0D|1D</code>，构造 <code>M=&lt;{A,B,C,D,f},{0,1},δ,A,{f}&gt;</code>，显然 L(M)=L(G_R)。</p>
            <p><strong>自动机 → 文法（右线性）</strong>：设 DFA <code>M=&lt;S,Σ,δ,s₀,F&gt;</code>。若 s₀∉F，令 <code>G_R=&lt;Σ,S,s₀,P&gt;</code>，对任何 a∈Σ 及 A,B∈S，若有 δ(A,a)=B，则当 B∉F 时令 <code>A→aB</code>，当 B∈F 时令 <code>A→a|aB</code>。若 s₀∈F，则 ε∈L(M) 而上述 G_R 不产生 ε（L(G_R)=L(M)-{ε}），需添加新的非终结符 s₀′ 与产生式 <code>s₀′→s₀|ε</code>，并以 s₀′ 为开始符号。左线性文法的构造类似：若有 δ(A,a)=B，则当 A=q₀ 时令 <code>B→a</code>，当 A≠q₀ 时令 <code>B→Aa</code>。</p>
            <p>例：DFA <code>M=&lt;{A,B,C,D},{0,1},δ,A,{B}&gt;</code>，L(M)=0(10)*，其右线性文法为上述 G_R（「看出弧」）；其左线性文法为 <code>G_L=&lt;{0,1},{B,C,D,f},f,P′&gt;</code>，其中 <code>f→0|C0，C→B1，B→0|C0，D→1|C1|D0|D1|B0</code>（「看入弧」）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-equ',
      heading: '3.3.5 正规式与有限自动机的等价性',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>定理</strong>：① 对任何 FA M，都存在一个正规式 r，使得 L(r)=L(M)；② 对任何正规式 r，都存在一个 FA M，使得 L(M)=L(r)。为便于处理，把转换图概念拓广：每条弧可用一个正规式作标记。</p>
            <p><strong>FA → 正规式</strong>：在 M 的转换图上加进两个状态 X 和 Y，从 X 用 ε 弧连接到 M 的所有初态结点，从 M 的所有终态结点用 ε 弧连接到 Y，形成新的 NFA M′（只有一个初态 X 和一个终态 Y），显然 L(M)=L(M′)。然后反复使用消去结点的规则（把经过某结点的两条弧合并为一条以 <code>V₁(U₁|U₂)*W₁</code> 之类正规式标记的弧），逐步消去所有结点，直到只剩下 X 和 Y，此时 X 到 Y 弧上的标记即为所求正规式。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-min',
      heading: '3.3.6 DFA 的化简',
      blocks: [
        {
          type: 'html',
          html: `
            <p>化简的思路是把 DFA 的状态划分成若干不相交的子集，使不同子集中的状态「可区分」、同一子集中的状态「等价」，最后每个子集只留一个代表状态。</p>
            <p><strong>划分法</strong>：先把状态集分成终态组与非终态组两个子集；然后反复检查：对某个输入字符 a 和某个子集 I⁽ⁱ⁾，若 <code>Iₐ⁽ⁱ⁾</code> 落入现行划分中的 N 个不同子集，则应把 I⁽ⁱ⁾ 划分成 N 个不相交的组，使每个组 J 的 Jₐ 都落入同一子集。这样构成新的划分；重复上述过程，直到划分所含子集数不再增长。对最后划分中的每个子集，选一个状态代表其他状态，得到化简后的 DFA M′；若某子集含有原来的初态，其代表为新的初态，若含有原来的终态，其代表为新的终态。</p>
            <p>课件以 <code>I⁽¹⁾={0,1,2}</code>、<code>I⁽²⁾={3,4,5,6}</code> 为例演示分裂过程：由 <code>Iₐ⁽¹⁾={1,3}</code> 把 I⁽¹⁾ 分成 <code>I⁽¹¹⁾={0,2}</code> 与 <code>I⁽¹²⁾={1}</code>；继续用 <code>Iₐ⁽¹¹⁾={1}</code>、<code>I_b⁽¹¹⁾={2,5}</code> 分成 <code>I⁽¹¹¹⁾={0}</code>、<code>I⁽¹¹²⁾={2}</code>，直至不再增长。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp3-lex',
      heading: '3.4 词法分析器的自动产生 —— LEX',
      blocks: [
        {
          type: 'html',
          html: `
            <p>词法分析程序自动产生器（LEX）以 LEX 源程序为输入，输出词法分析程序 L；LEX 源程序由<strong>辅助定义</strong>与<strong>识别规则</strong>两部分组成，生成物包括状态转换矩阵与控制执行程序。</p>
            <pre><code>AUXILIARY DEFINITION
letter → A|B|…|Z
digit  → 0|1|…|9
RECOGNITION RULES
1   DIM                      { RETURN (1,-) }
2   IF                       { RETURN (2,-) }
3   DO                       { RETURN (3,-) }
4   STOP                     { RETURN (4,-) }
5   END                      { RETURN (5,-) }
6   letter(letter|digit)*    { RETURN (6, TOKEN) }
7   digit(digit)*            { RETURN (7, DTB) }
8   =                        { RETURN (8,-) }
9   +                        { RETURN (9,-) }
10  *                        { RETURN (10,-) }
11  **                       { RETURN (11,-) }
12  ,                        { RETURN (12,-) }
13  (                        { RETURN (13,-) }
14  )                        { RETURN (14,-) }</code></pre>
            <p><strong>LEX 的工作过程</strong>：首先对每条识别规则 Pᵢ 构造一个相应的非确定有限自动机 Mᵢ；然后引进一个新初态 X，通过 ε 弧把这些自动机连接成一个新的 NFA；最后把该 NFA 确定化、最小化，生成该 DFA 的状态转换表和控制执行程序。</p>`,
        },
      ],
    },
  ],
};

export default ch3;

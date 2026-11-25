/* 第 5 章 语法分析——自下而上分析 —— 依据课件（181 页）整理 */
import type { GenChapter } from '../types';

const ch5: GenChapter = {
  id: 'deck5',
  no: '第5章',
  title: '语法分析——自下而上分析',
  subtitle: '移进-归约与规范归约 · 短语与句柄 · 算符优先分析 · LR(0) · SLR(1) · LR(1) · LALR(1)',
  lede:
    '<p>自下而上分析从输入符号串开始，从左到右扫描、边移入边分析，一旦栈顶符号串形成某个产生式的右部就用左部非终结符代替，称为<strong>归约</strong>；重复直到栈中只剩开始符号即分析成功——这就是「移进-归约」方法。其<strong>核心问题是如何识别可归约串</strong>：算符优先分析法用相邻终结符之间的优先关系找「最左素短语」，LR 分析法则通过求<strong>活前缀</strong>确定句柄。本章依次讨论规范归约与句柄、算符优先分析、LR(0) 项目集族，以及 SLR(1)、规范 LR(1)、LALR(1) 三种分析表的构造。</p>',
  toc: [
    { id: 'sec-comp5-reduce', text: '5.1.1 归约与移进-归约分析', level: 2 },
    { id: 'sec-comp5-canonical', text: '5.1.2 规范归约：短语、直接短语与句柄', level: 2 },
    { id: 'sec-comp5-stack', text: '5.1.3 符号栈的使用和分析树的表示', level: 2 },
    { id: 'sec-comp5-op', text: '5.2 算符优先分析', level: 2 },
    { id: 'sec-comp5-lr', text: '5.3.1 LR 分析器', level: 2 },
    { id: 'sec-comp5-lr0', text: '5.3.2 LR(0) 项目集族与 LR(0) 分析表', level: 2 },
    { id: 'sec-comp5-slr', text: '5.3.3～5.3.5 SLR(1)、LR(1) 与 LALR(1)', level: 2 },
    { id: 'sec-comp5-ambig', text: '5.3.6 二义性文法的应用', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp5-reduce',
      heading: '5.1.1 归约与移进-归约分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p>采用「移进-归约」思想进行自下而上分析：从输入符号串开始，从左到右扫描，将输入符号逐个移入一个栈中，边移入边分析；一旦栈顶符号串形成某个产生式的右部，就用该产生式的左部非终结符代替，称为<strong>归约</strong>。重复这一过程，直到归约到栈中只剩下文法的开始符号时分析成功。</p>
            <p>例：文法 <code>G(S)：① S→aAcBe ② A→b ③ A→Ab ④ B→d</code>，对 <code>abbcde</code> 的移进-归约过程为：</p>
            <table class="tbl">
              <thead><tr><th>句型</th><th>归约规则</th></tr></thead>
              <tbody>
                <tr><td>abbcde</td><td>(2) A→b</td></tr>
                <tr><td>aAbcde</td><td>(3) A→Ab</td></tr>
                <tr><td>aAcde</td><td>(4) B→d</td></tr>
                <tr><td>aAcBe</td><td>(1) S→aAcBe</td></tr>
                <tr><td>S</td><td>—</td></tr>
              </tbody>
            </table>
            <p>自下而上分析过程是边输入单词符号、边归约，核心问题就是<strong>识别可归约串</strong>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-canonical',
      heading: '5.1.2 规范归约：短语、直接短语与句柄',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>短语</strong>：令 G 是一个文法、S 是开始符号，假定 αβδ 是 G 的一个句型，如果有 <code>S ⇒* αAδ</code> 且 <code>A ⇒+ β</code>，则称 β 是句型 αβδ 相对于非终结符 A 的短语。特别地，如果有 <code>A ⇒ β</code>，则称 β 是句型 αβδ 相对于规则 <code>A→β</code> 的<strong>直接短语</strong>。一个句型的<strong>最左直接短语</strong>称为该句型的<strong>句柄</strong>。</p>
            <p>用语法树表述更直观：在一个句型对应的语法树中，以某非终结符为根的一棵子树的所有叶子自左至右排列起来，形成相对于该子树根的短语；<strong>仅有父子两代</strong>的一棵子树的所有叶子排列成直接短语；一个句型的分析树中<strong>最左那棵只有父子两代</strong>的子树的所有叶子排列成句柄。</p>
            <p>例：文法 <code>E→T|E+T，T→F|T*F，F→(E)|i</code>，句型 <code>i₁*i₂+i₃</code> 的推导为 <code>E ⇒ E+T ⇒ E+F ⇒ E+i₃ ⇒ T+i₃ ⇒ T*F+i₃ ⇒ T*i₂+i₃ ⇒ F*i₂+i₃ ⇒ i₁*i₂+i₃</code>，于是短语为 i₁、i₂、i₃、i₁*i₂、i₁*i₂+i₃；直接短语为 i₁、i₂、i₃；句柄为 i₁。</p>
            <p><strong>规范归约</strong>：假定 α 是文法 G 的一个句子，称序列 α_n, α_{n-1}, …, α₀ 是一个规范归约，如果 ① α_n=α；② α₀ 为文法的开始符号 S；③ 对任何 i（0≤i≤n），α_{i-1} 是从 α_i 经把<strong>句柄</strong>替换成为相应产生式左部符号而得到的。把上例倒过来写得到 <code>S ⇒ aAcBe ⇒ aAcde ⇒ aAbcde ⇒ abbcde</code>，显然这是一个<strong>最右推导</strong>。因此：规范归约是最右推导的逆过程，最左归约对应规范推导，由规范推导推出的句型称为<strong>规范句型</strong>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-stack',
      heading: '5.1.3 符号栈的使用和分析树的表示',
      blocks: [
        {
          type: 'html',
          html: `
            <p>移进-归约分析器使用一个<strong>分析栈</strong>和一个<strong>输入缓冲区</strong>，用「#」作为栈底符号。句型表示为「分析栈内容 + 输入缓冲区内容 = # 当前句型 #」，一般形式为「分析栈的内容 | 剩余输入串」；初态为「# | 输入串 #」，终态为「#S | #」。</p>
            <p>工作过程：自左至右把串 w 的符号一一移进栈里，一旦栈顶形成可归约的串（如句柄）就进行归约；这种归约可能持续多次，直至栈顶不再呈现句柄为止，然后继续移进符号，重复这个过程，直至最终形成「#S | #」的格局。利用修剪语法树的方法，可以直观阐述这一自下而上的分析过程。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-op',
      heading: '5.2 算符优先分析',
      blocks: [
        {
          type: 'html',
          html: `
            <p>四则运算的优先规则是「先乘除后加减，同级从左到右」。考虑二义文法 <code>G(E)：E→i|E+E|E-E|E*E|E/E|(E)</code>，它的句子有几种不同的规范归约——归约即计算表达式的值，归约顺序不同则计算顺序与结果也不同。如果<strong>规定算符的优先次序</strong>并按这种规定归约，归约过程就是唯一的。</p>
            <p>例如句子 <code>i+i-i*(i+i)</code> 的归约过程为：i+i-i*(i+i) → E+i-i*(i+i) → E+E-i*(i+i) → E-i*(i+i) → E-E*(i+i) → E-E*(E+i) → E-E*(E+E) → E-E*(E) → E-E*E → E-E → E。</p>
            <p>起决定作用的是相邻两个算符之间的优先关系。算符优先分析法就是定义算符之间的某种优先关系，借助这种关系寻找「可归约串」和进行归约；其思想源于表达式的分析，把句型中的终结符号当作「算符」。</p>
            <p><strong>三种优先关系</strong>：<code>a ⋖ b</code>（a 的优先级低于 b）、<code>a ≐ b</code>（相等）、<code>a ⋗ b</code>（高于）。注意这与数学上的 <code>&lt; &gt; =</code> 不同：a ⋖ b 并不意味着 b ⋗ a。</p>
            <p><strong>算符文法</strong>：一个文法如果它的任一产生式的右部都不含两个相继（并列）的非终结符，即不含 <code>…QR…</code> 形式的右部，则称为算符文法。</p>
            <p>假定 G 是一个不含 ε-产生式的算符文法，对任何一对终结符 a、b：</p>
            <ol>
              <li><code>a ≐ b</code> 当且仅当 G 中含有形如 <code>P→…ab…</code> 或 <code>P→…aQb…</code> 的产生式；</li>
              <li><code>a ⋖ b</code> 当且仅当 G 中含有形如 <code>P→…aR…</code> 的产生式，而 <code>R ⇒+ b…</code> 或 <code>R ⇒+ Qb…</code>；</li>
              <li><code>a ⋗ b</code> 当且仅当 G 中含有形如 <code>P→…Rb…</code> 的产生式，而 <code>R ⇒+ …a</code> 或 <code>R ⇒+ …aQ</code>。</li>
            </ol>
            <p>如果一个算符文法 G 中的任何终结符对 (a,b) <strong>至多只满足</strong>上述三种关系之一，则称 G 是一个<strong>算符优先文法</strong>。</p>
            <p>例：<code>G(E)：E→E+T|T，T→T*F|F，F→P↑F|P，P→(E)|i</code>。由 P→(E) 得 <code>( ≐ )</code>；由 E→E+T 与 <code>T ⇒ T*F</code> 得 <code>+ ⋖ *</code>；由 T→T*F 与 <code>F ⇒ P↑F</code> 得 <code>* ⋖ ↑</code>；由 E→E+T 与 <code>E ⇒ E+T</code> 得 <code>+ ⋖ +</code>；由 F→P↑F 与 <code>F ⇒ P↑F</code> 得 <code>↑ ⋖ ↑</code>；由 P→(E) 与 E 的多步推导得 <code>( ⋖ +</code>、<code>( ⋖ *</code>、<code>( ⋖ ↑</code>、<code>( ⋖ i</code>。</p>
            <p><strong>构造优先表</strong>：先对每个非终结符 P 构造两个集合 <code>FIRSTVT(P)</code> 与 <code>LASTVT(P)</code>，再由产生式的候选式确定关系：候选形为 <code>…aP…</code> 时对任何 <code>b∈FIRSTVT(P)</code> 有 a ⋖ b；候选形为 <code>…Pb…</code> 时对任何 <code>a∈LASTVT(P)</code> 有 a ⋗ b；候选形中相邻或隔一个非终结符的两个终结符满足 ≐。</p>
            <p>FIRSTVT(P) 的构造规则：① 若有产生式 <code>P→a…</code> 或 <code>P→Qa…</code>，则 a∈FIRSTVT(P)；② 若 a∈FIRSTVT(Q) 且有 <code>P→Q…</code>，则 a∈FIRSTVT(P)。实现时用布尔数组 <code>F[P,a]</code> 与一个栈：先按规则 ① 赋初值并把所有为真的 (P,a) 压栈；然后反复弹出栈顶 (Q,a)，对每个形如 <code>P→Q…</code> 的产生式，若 F[P,a] 为假则置真并把 (P,a) 压栈，直到栈空。LASTVT 的构造与之对称。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-lr',
      heading: '5.3.1 LR 分析器',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>LR 分析法的优缺点</strong>：比其他「移进-归约」分析法（如算符优先）使用更广泛、识别效率高；能用 LL(1) 分析的所有文法都能用 LR 方法分析；在自左至右扫描输入串的过程中就能发现其中的任何错误，并能准确指出出错位置。缺点是手工构造分析表工作量太大，必须使用自动生成器（如专用工具 YACC）。</p>
            <p>LR 分析法与算符优先方法一样通过求句柄逐步归约，但算符优先靠算符优先关系得到可归约串（最左素短语），LR 方法中的句柄是通过求<strong>活前缀</strong>而求得。</p>
            <p>LR 分析的基本思想：在规范归约过程中，一方面记住已移进和归约出的整个符号串（<strong>历史</strong>），另一方面根据所用产生式推测未来可能碰到的输入符号（<strong>展望</strong>），再结合当前的输入符号（<strong>现实</strong>），判断栈顶符号串是否构成真正的句柄。</p>
            <p>一个 LR 分析器由三部分组成：</p>
            <ul>
              <li><strong>LR 分析程序</strong>（总控程序）：所有 LR 分析器都相同；</li>
              <li><strong>分析表</strong>：不同文法不同，同一文法采用不同的 LR 分析器时也不同；分为动作表 ACTION 与状态转换表 GOTO，均可用二维数组表示；</li>
              <li><strong>分析栈</strong>：包括文法符号栈与相应的状态栈，均为先进后出栈；<code>(s₀,#)</code> 是预先放到栈中的初始状态和符号。</li>
            </ul>
            <p>分析器实际上是一个带有先进后出栈的确定的有穷自动机：把「历史」和「展望」综合成<strong>状态</strong>，状态概括了从分析开始直到某一归约阶段的全部历史和展望资料，只需根据栈顶状态和输入符号就可唯一决定下一个动作。文法符号串 X₁X₂…X_m 其实是多余的，已被概括到状态里。</p>
            <p>分析表的核心：<code>ACTION[s,a]</code> 规定状态 s 面临输入符号 a 时应采取的动作；<code>GOTO[s,X]</code> 给出状态 s 面对文法符号 X 时的下一状态。ACTION 有四种动作：</p>
            <ol>
              <li><strong>移进</strong>：把 (s,a) 的下一状态 s′ 和输入符号 a 推进栈，下一输入符号变成现行输入符号；</li>
              <li><strong>归约</strong>：用某产生式 A→β 归约。若 β 的长度为 r，则去除栈顶 r 项，使 s_{m-r} 变成栈顶状态，然后把 <code>(s_{m-r}, A)</code> 的下一状态 <code>s′=GOTO[s_{m-r},A]</code> 和文法符号 A 推进栈；</li>
              <li><strong>接受</strong>：宣布分析成功，停止分析器工作；</li>
              <li><strong>报错</strong>。</li>
            </ol>
            <p>分析开始时格局为 <code>(s₀, #, a₁a₂…a_n#)</code>，以后每步为 <code>(s₀s₁…s_m, #X₁…X_m, a_ia_{i+1}…a_n#)</code>，按 ACTION(s_m,a_i) 转移。</p>
            <p><strong>LR 文法</strong>：对于一个文法，如果能够构造一张分析表使它的每个入口均是唯一确定的，则称该文法为 LR 文法；如果能用一个每步顶多向前检查 k 个输入符号的 LR 分析器分析，则称为 LR(k) 文法。LR 文法不是二义的，二义文法肯定不会是 LR 的（如 <code>S→iCtS | iCtSeS</code> 在栈为 …iCtS、输入以 e 开头时无法决定是否归约）。</p>
            <p>课件给出表达式文法的 LR 分析表（列为 i、+、*、(、)、# 与 GOTO 的 E、T、F），其中 <code>S_i</code> 表示把当前输入符号移进栈、第 i 个状态进状态栈，<code>r_i</code> 表示按第 i 个产生式归约，<code>i</code> 表示转第 i 个状态，空白表示出错。对输入串 <code>i*i+i</code> 的分析过程依次为 0 → 05(#i) → 03(#F) → 02(#T) → 027(#T*) → 0275(#T*i) → 02710(#T*F) → 02(#T) → 01(#E) → 016(#E+) → 0165(#E+i) → 0163(#E+F) → 0169(#E+T) → 01(#E) → 接受。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-lr0',
      heading: '5.3.2 LR(0) 项目集族与 LR(0) 分析表',
      blocks: [
        {
          type: 'html',
          html: `
            <p>规范归约过程中，栈内符号串与扫描剩下的输入符号串构成一个规范句型；栈内如果出现句柄，句柄一定在栈的<strong>顶部</strong>，栈内永远不会出现句柄之后的符号。</p>
            <p><strong>活前缀</strong>：字的前缀是指字的任意首部（如 abc 的前缀有 ε、a、ab、abc）。活前缀是指规范句型的一个前缀，这种前缀<strong>不含句柄之后的任何符号</strong>：对于规范句型 αβδ（β 为句柄），如果 αβ=u₁u₂…u_r，则 u₁u₂…u_i（1≤i≤r）是 αβδ 的活前缀。对文法 G 可以构造一个 DFA，它能识别 G 的所有活前缀。</p>
            <p>例：<code>G[S]：⑴ S→aAcBe ⑵ A→b ⑶ A→Ab ⑷ B→d</code>，为每条产生式尾部加上序号后用最右推导识别 abbcde：<code>S → aAcBe[1] → aAcd[4]e[1] → aAb[3]cd[4]e[1] → ab[2]b[3]cd[4]e[1]</code>；最左归约完全是它的逆过程。规范句型 abbcde 的活前缀有 ε、a、ab；aAbcde 的有 ε、a、aA、aAb；aAcde 的有 ε、a、aA、aAc、aAcd；aAcBe 的有 ε、a、aA、aAc、aAcB、aAcBe。识别活前缀的本质就是<strong>识别句柄</strong>。</p>
            <p><strong>活前缀与句柄的三种关系</strong>：① 活前缀已含句柄的全部符号——产生式 A→α 的右部 α 已出现在栈顶，可以归约，称<strong>可归约（归态）活前缀</strong>；② 活前缀只含句柄的一部分——右部子串 α₁ 已出现在栈顶，期待从输入串看到 α₂ 推导出的符号串；③ 活前缀不含句柄的任何符号——期待从输入串看到该句柄对应产生式右部所推导出的符号串。</p>
            <p><strong>LR(0) 项目</strong>：在产生式右部某个位置加一个圆点，表示已识别到该位置，如 <code>A→·αβ</code>、<code>A→α·β</code>、<code>A→αβ·</code>。项目分为移进项目（圆点后是终结符）、待约项目（圆点后是非终结符）、归约项目（圆点在末尾）；<strong>接受项目</strong>是增广文法开始符号的归约项目 <code>S′→S·</code>。用<strong>闭包 CLOSURE</strong> 与 <strong>GO 函数</strong>构造项目集规范族：若 I 是项目集，<code>CLOSURE(I)</code> 加入 I 的全部项目，并对每个 <code>A→α·Bβ</code>（B∈V_N）把 <code>B→·γ</code> 加入；<code>GO(I,X)=CLOSURE({A→αX·β | A→α·Xβ∈I})</code>。以 <code>CLOSURE({S′→·S})</code> 为初态，反复求 GO 直到不产生新项目集，即得 LR(0) 项目集规范族。</p>
            <p><strong>LR(0) 分析表的构造</strong>：对每个项目集 I_i（状态 i），① 若 <code>A→α·aβ∈I_i</code> 且 <code>GO(I_i,a)=I_j</code>（a 为终结符），则置 <code>ACTION[i,a]=S_j</code>；② 若归约项目 <code>A→α·∈I_i</code>，则对任何终结符 a（或 #）置 <code>ACTION[i,a]=r_j</code>（j 为产生式编号）；③ 若接受项目 <code>S′→S·∈I_i</code>，置 <code>ACTION[i,#]=acc</code>；④ 若 <code>GO(I_i,A)=I_j</code>（A 为非终结符），置 <code>GOTO[i,A]=j</code>。含<strong>移进-归约冲突</strong>或<strong>归约-归约冲突</strong>的项目集说明该文法不是 LR(0) 文法。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-slr',
      heading: '5.3.3～5.3.5 SLR(1)、LR(1) 与 LALR(1)',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>SLR(1)</strong>：当 LR(0) 项目集出现移进-归约冲突时，用 FOLLOW 集来消解——对归约项目 <code>A→α·</code>，只有当面临的输入符号 <code>a∈FOLLOW(A)</code> 时才用该产生式归约。这样构造的分析表称为 SLR(1) 分析表（Simple LR）。它比 LR(0) 强，但仍可能因 FOLLOW 集不够精确而残留冲突。</p>
            <p><strong>规范 LR(1)</strong>：把项目扩充为 <code>[A→α·β, a]</code>，其中 a 是<strong>向前看符号</strong>（搜索符），表示归约后应跟随的终结符。构造时闭包规则变为：若 <code>[A→α·Bβ, a]∈I</code>，<code>B→γ</code> 是产生式，则对每个 <code>b∈FIRST(βa)</code> 把 <code>[B→·γ, b]</code> 加入闭包。归约动作只在向前看符号匹配时发生，因此能解决 SLR 解决不了的冲突；代价是项目集（状态）数量大幅增加。</p>
            <p><strong>LALR(1)</strong>：把 LR(1) 项目集中<strong>同心</strong>的项目集（核心项目相同、仅向前看符号不同）合并成一个，从而在保持 LR(1) 分析能力的同时把状态数降到与 LR(0) 相同。合并可能把原本不冲突的 LR(1) 项目集并出归约-归约冲突，因此存在「是 LR(1) 但不是 LALR(1)」的文法；但 LALR(1) 不会产生移进-归约冲突（若原 LR(1) 无冲突）。YACC 生成的就是 LALR(1) 分析表。</p>
            <p>三种表的能力关系为：LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1)，而 LR(1) 与 LL(1) 互不包含（LR 能处理的文法范围更大）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp5-ambig',
      heading: '5.3.6 二义性文法的应用',
      blocks: [
        {
          type: 'html',
          html: `
            <p>二义性文法都不是 LR 的，但<strong>某些二义性文法是有用的</strong>：可以简洁地描述某些结构；可以隔离某些语法结构并对其特殊处理。对某些二义性文法，可以通过<strong>消除二义性规则</strong>来保证每个句子只有一棵语法分析树，并且可以在 LR 分析器中实现这个规则。</p>
            <p>课件以 <code>E→E+E | E*E | (E) | id</code> 为例：它等价于无二义文法 <code>E→E+T|T，T→T*F|F，F→(E)|id</code>。二义性文法的优点是——容易修改算符的优先级和结合性；简洁，若有多个优先级，无二义文法将引入太多非终结符；高效，不需要处理 <code>E→T</code> 这样的归约。</p>
            <p>该文法的 LR(0) 项集中，I₇、I₈ 存在冲突，且<strong>不可能通过向前看符号解决</strong>。冲突原因：栈顶状态为 7 时，栈中文法符号序列为 …E+E；若下一个输入符号不等于 +、*，则应归约（归约之后早晚会报错）；若下一个符号为 + 或 *，就要在移入与归约之间选择。</p>
            <p>用优先级与结合性消解：设 <code>*</code> 的优先级大于 <code>+</code> 且 <code>+</code> 是左结合的，则状态 7 遇 <code>+</code> 时把 E+E 归约为 E，遇 <code>*</code> 时移入 *，期待引入下一个符号；状态 8 执行归约。按此规则得到的 SLR(1) 分析表与等价的<strong>无二义文法</strong>的分析表类似。</p>
            <p><strong>本章小结</strong>：LR 分析法是一类归约法的统称，课件介绍其中最基本的 LR(0)、SLR(1)、LR(1) 和 LALR(1) 四种，重点是可归约前缀的作用、识别活前缀 DFA 的构造、分析表的构造、各分析法的适用条件以及分析程序结构与算法。核心概念包括可归前缀、活前缀、LR(0) 项目、移进项目、待约项目、归约项目、接受项目、移进-归约冲突与归约-归约冲突的项目集、LR(0) 项目集规范族、搜索符与搜索集、同心项目集等。四种分析方法构造语法分析程序的技术线路一致：设计上下文无关文法 → 构造识别活前缀的 DFA（LR(1) 还需搜索符）→ 判定文法属于哪一类 → 据此构造分析表。</p>`,
        },
      ],
    },
  ],
};

export default ch5;

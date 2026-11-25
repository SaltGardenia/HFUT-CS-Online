/* 第 4 章 语法分析——自上而下分析 —— 依据课件（94 页）整理 */
import type { GenChapter } from '../types';

const ch4: GenChapter = {
  id: 'deck4',
  no: '第4章',
  title: '语法分析——自上而下分析',
  subtitle: '语法分析器的功能 · 回溯与左递归 · 消除左递归 · 提左因子与 FIRST 集 · LL(1) 条件 · 递归下降分析 · 预测分析程序',
  lede:
    '<p>语法分析器按照文法的产生式（语言的语法规则）识别输入符号串是否为一个句子（合式程序），是编译程序的<strong>核心部分</strong>。本章讨论<strong>自上而下</strong>分析法：从文法的开始符号出发，反复使用各种产生式，寻找「匹配」的推导；主旨是对任何输入串，试图用一切可能的办法，从文法开始符号（根结点）出发自上而下地为输入串建立一棵语法树，也就是为输入串寻找一个<strong>最左推导</strong>。带回溯的分析直观但效率低，因此引出 LL(1) 分析法：消除左递归、克服回溯，用递归下降或预测分析表实现无回溯分析。</p>',
  toc: [
    { id: 'sec-comp4-func', text: '4.1 语法分析器的功能', level: 2 },
    { id: 'sec-comp4-problem', text: '4.2 自上而下分析面临的问题', level: 2 },
    { id: 'sec-comp4-elim', text: '4.3.1 左递归的消除', level: 2 },
    { id: 'sec-comp4-factor', text: '4.3.2 消除回溯、提左因子', level: 2 },
    { id: 'sec-comp4-ll1', text: '4.3.3 LL(1) 分析条件', level: 2 },
    { id: 'sec-comp4-rd', text: '4.4 递归下降分析程序构造', level: 2 },
    { id: 'sec-comp4-predict', text: '4.5 预测分析程序', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp4-func',
      heading: '4.1 语法分析器的功能',
      blocks: [
        {
          type: 'html',
          html: `
            <p>语法分析的任务是分析一个文法的句子结构：按照文法的产生式（语言的语法规则），识别输入符号串是否为一个句子（合式程序）。</p>
            <p>语法分析有两类方法：</p>
            <ul>
              <li><strong>自下而上分析法（Bottom-up）</strong>：从输入串开始，逐步进行「归约」，直到文法的开始符号——即从树末端开始构造语法树。归约是指根据产生式规则把产生式的右部替换成左部符号。代表方法有算符优先分析法（按算符的优先关系和结合性质分析，适合分析表达式）与 LR 分析法（规范归约）。</li>
              <li><strong>自上而下分析法（Top-down）</strong>：从文法的开始符号出发，反复使用各种产生式，寻找「匹配」的推导。包括递归下降分析法（对每一语法变量构造一个相应的子程序，通过子程序间的信息反馈和联合作用识别输入串）与预测分析程序。优点是直观、简单和宜于手工实现。</li>
            </ul>
            <p>自上而下与自下而上不是割裂的：同一棵语法树，自顶向下看是推导，自底向上看是归约，二者是辩证统一的关系。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp4-problem',
      heading: '4.2 自上而下分析面临的问题',
      blocks: [
        {
          type: 'html',
          html: `
            <p>例：文法 <code>G(S)：S→xAy，A→**|*</code>，分析输入串 <code>x*y</code>。当用 A 的第一个候选 <code>**</code> 匹配时，只读到一个 <code>*</code> 就发现匹配失败，只能退回重试另一个候选 <code>*</code>。</p>
            <p>当某个非终结符有多个产生式候选时，可能带来两个问题：</p>
            <ol>
              <li><strong>回溯</strong>：分析过程中，当一个非终结符用某一个候选匹配成功时，这种匹配可能是暂时的；出错时不得不「回溯」，重新扫描已读入的符号。</li>
              <li><strong>左递归</strong>：一个文法是含有左递归的，如果存在非终结符 P 使得 <code>P ⇒+ Pα</code>（经过若干步推导又以 P 开头）。含有左递归的文法将使自上而下的分析陷入<strong>无限循环</strong>。</li>
            </ol>
            <p>因此构造不带回溯的自上而下分析算法，要做两件事：<strong>消除文法的左递归性</strong>、<strong>克服回溯</strong>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp4-elim',
      heading: '4.3.1 左递归的消除',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>直接左递归</strong>：假定关于非终结符 P 的规则为 <code>P→Pα | β</code>，其中 β 不以 P 开头。可以把 P 的规则等价地改写为非直接左递归形式：</p>
            <pre><code>P → βP′
P′ → αP′ | ε</code></pre>
            <p>即 <code>L(G)={βαⁿ | n≥0}</code>，把左递归变成了右递归。一般而言，假定 P 的全部产生式是</p>
            <pre><code>P → Pα₁ | Pα₂ | … | Pα_m | β₁ | β₂ | … | β_n</code></pre>
            <p>其中每个 α 都不等于 ε、每个 β 都不以 P 开头，则消除 P 的直接左递归就是改写为</p>
            <pre><code>P → β₁P′ | β₂P′ | … | β_nP′
P′ → α₁P′ | α₂P′ | … | α_mP′ | ε</code></pre>
            <p>例：文法 <code>E→E+T | T，T→T*F | F，F→(E) | i</code> 经消去直接左递归后变成</p>
            <pre><code>E → TE′          E′ → +TE′ | ε
T → FT′          T′ → *FT′ | ε
F → (E) | i</code></pre>
            <p><strong>间接左递归</strong>：例如 <code>S→Qc|c，Q→Rb|b，R→Sa|a</code> 虽没有直接左递归，但 S、Q、R 都是左递归的（<code>S ⇒ Qc ⇒ Rbc ⇒ Sabc</code>）。一个文法消除左递归的条件是：不含以 ε 为右部的产生式；不含回路。</p>
            <p><strong>消除左递归的算法</strong>：</p>
            <ol>
              <li>把文法 G 的所有非终结符按任一种顺序排列成 P₁, P₂, …, P_n，按此顺序执行；</li>
              <li>FOR i:=1 TO n DO：BEGIN FOR j:=1 TO i-1 DO 把形如 <code>P_i→P_jγ</code> 的规则改写成 <code>P_i→δ₁γ|δ₂γ|…|δ_kγ</code>（其中 <code>P_j→δ₁|δ₂|…|δ_k</code> 是关于 P_j 的所有规则）；消除关于 P_i 规则的直接左递归性 END；</li>
              <li>化简第 2 步所得的文法，去除那些从开始符号出发永远无法到达的非终结符的产生规则。</li>
            </ol>
            <p>注意事项：算法适用于已消除 <code>P→P</code> 产生式和不以 ε 为右部的产生式的文法。第二步可以理解为：有直接左递归就消除；右部最左符号是非终结符且序号<strong>大于</strong>左部时不作替换；序号<strong>小于</strong>左部时用其右部串替换后再消除新的直接左递归——原则是「高→低，则替换」，每次替换的非终结符都是前面已经处理过的。</p>
            <p>例：对 <code>S→Qc|c，Q→Rb|b，R→Sa|a</code>，令排序为 R、Q、S。R 无直接左递归且 S 序号大于 R，不替换；Q→Rb|b 中 R 序号小于 Q，代入得 <code>Q→Sab|ab|b</code>；S→Qc|c 中 Q 序号小于 S，代入得 <code>S→Sabc|abc|bc|c</code>，消除 S 的直接左递归后为</p>
            <pre><code>S → abcS′ | bcS′ | cS′
S′ → abcS′ | ε
Q → Sab | ab | b
R → Sa | a</code></pre>
            <p>Q、R 的规则已不可达，化简后只剩 S 与 S′ 两条规则。注意：非终结符排序不同，最后所得文法的形式可能不一样，但可以证明它们都是等价的（例如按 S、Q、R 排序会得到另一组等价的产生式）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp4-factor',
      heading: '4.3.2 消除回溯、提左因子',
      blocks: [
        {
          type: 'html',
          html: `
            <p>产生回溯的原因是：推导时若产生式存在多个候选式，选择哪个进行推导存在不确定性。要消除回溯，就必须保证对文法的任何非终结符，当要它去匹配输入串时，能够根据它所面临的输入符号<strong>准确地指派</strong>它的一个候选去执行任务，并且此候选的工作结果应是确信无疑的。</p>
            <p>令 G 是一个不含左递归的文法，对 G 的所有非终结符的每个候选 α 定义<strong>终结首符集 FIRST(α)</strong>：由 α 出发能推导出的所有可能的开头终结符组成的集合（若 α 能推出 ε，则 ε∈FIRST(α)）。如果非终结符 A 的所有候选首符集两两不相交，即任何两个不同候选 αᵢ 和 αⱼ 满足 <code>FIRST(αᵢ) ∩ FIRST(αⱼ) = ∅</code>，则当要求 A 匹配输入串时，A 就能根据它所面临的第一个输入符号 a 准确地指派某一个候选——即那个首符集含 a 的 α。</p>
            <p><strong>提取公共左因子</strong>：假定关于 A 的规则是</p>
            <pre><code>A → δβ₁ | δβ₂ | … | δβ_n | γ₁ | γ₂ | … | γ_m</code></pre>
            <p>（其中每个 γ 不以 δ 开头），则改写为</p>
            <pre><code>A → δA′ | γ₁ | γ₂ | … | γ_m
A′ → β₁ | β₂ | … | β_n</code></pre>
            <p>经过反复提取左因子，就能把每个非终结符（包括新引进者）的所有候选首符集变成两两不相交。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp4-ll1',
      heading: '4.3.3 LL(1) 分析条件',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>构造不带回溯的自上而下分析的文法条件</strong>：</p>
            <ol>
              <li>文法不含左递归；</li>
              <li>对于文法中每一个非终结符 A 的各个产生式的候选首符集两两不相交，即若 <code>A→α₁|α₂|…|αₙ</code>，则 <code>FIRST(αᵢ)∩FIRST(αⱼ)=∅ (i≠j)</code>；</li>
              <li>对文法中的每个非终结符 A，若它存在某个候选首符集包含 ε，则 <code>FIRST(αᵢ)∩FOLLOW(A)=∅ (i=1,…,n)</code>。</li>
            </ol>
            <p>满足以上条件的文法 G 称为 <strong>LL(1) 文法</strong>：自左向右扫描、最左推导、向前看 1 步。</p>
            <p>对满足条件的文法，可以对输入串进行有效的无回溯分析。假设要用非终结符 A 进行匹配、面临的输入符号为 a，A 的所有产生式为 <code>A→α₁|α₂|…|αₙ</code>：</p>
            <ol>
              <li>若 <code>a∈FIRST(αᵢ)</code>，则指派 αᵢ 执行匹配任务；</li>
              <li>若 a 不属于任何一个候选首符集，则：若 ε 属于某个 FIRST(αᵢ) 且 <code>a∈FOLLOW(A)</code>，则让 A 与 ε 自动匹配；否则 a 的出现是一种语法错误。</li>
            </ol>
            <p><strong>构造 FIRST(X)</strong>（X∈V_T∪V_N），连续使用下列规则直到每个集合不再增大：① 若 X∈V_T，则 <code>FIRST(X)={X}</code>；② 若 X∈V_N 且有产生式 <code>X→a…</code>，则把 a 加入 FIRST(X)；若 <code>X→ε</code> 也是产生式，则把 ε 也加入；③ 若 <code>X→Y…</code> 是产生式且 Y∈V_N，则把 FIRST(Y) 中所有非 ε 元素加入 FIRST(X)；若 <code>X→Y₁Y₂…Y_k</code> 且 Y₁,…,Y_{i-1} 都能推出 ε，则把 FIRST(Yᵢ) 中所有非 ε 元素加入 FIRST(X)；特别地，若所有 FIRST(Yⱼ) 均含 ε（j=1..k），则把 ε 加入 FIRST(X)。</p>
            <p>对符号串 <code>α=X₁X₂…X_n</code>：置 <code>FIRST(α)=FIRST(X₁)\{ε}</code>；若对任何 1≤j≤i-1 有 ε∈FIRST(Xⱼ)，则把 FIRST(Xᵢ)\{ε} 加入 FIRST(α)；若所有 FIRST(Xⱼ) 均含 ε，则把 ε 也加入 FIRST(α)。显然 α=ε 时 FIRST(α)={ε}。</p>
            <p><strong>构造 FOLLOW(A)</strong>：连续使用下列规则直到每个集合不再增大：① 对于开始符号 S，置 # 于 FOLLOW(S) 中；② 若 <code>A→αBβ</code> 是一个产生式，则把 <code>FIRST(β)\{ε}</code> 加至 FOLLOW(B) 中；③ 若 <code>A→αB</code> 或 <code>A→αBβ</code> 且 <code>ε∈FIRST(β)</code>，则把 FOLLOW(A) 加至 FOLLOW(B) 中。</p>
            <p>课件的小结很形象：FIRST 集合主要看产生式<strong>左边</strong>，自下而上求；FOLLOW 集合只看产生式<strong>右边</strong>，自上而下求。</p>
            <p>例：对文法 <code>E→TE′，E′→+TE′|ε，T→FT′，T′→*FT′|ε，F→(E)|i</code>，有</p>
            <table class="tbl">
              <thead><tr><th>非终结符</th><th>FIRST</th><th>FOLLOW</th></tr></thead>
              <tbody>
                <tr><td>E</td><td>{( , i}</td><td>{) , #}</td></tr>
                <tr><td>E′</td><td>{+ , ε}</td><td>{) , #}</td></tr>
                <tr><td>T</td><td>{( , i}</td><td>{+ , ) , #}</td></tr>
                <tr><td>T′</td><td>{* , ε}</td><td>{+ , ) , #}</td></tr>
                <tr><td>F</td><td>{( , i}</td><td>{* , + , ) , #}</td></tr>
              </tbody>
            </table>`,
        },
      ],
    },
    {
      id: 'sec-comp4-rd',
      heading: '4.4 递归下降分析程序构造',
      blocks: [
        {
          type: 'html',
          html: `
            <p>递归下降分析器由一组递归过程组成，文法中每个非终结符对应一个过程（因为文法的定义通常是递归的）。需要几个全局过程和变量：<code>ADVANCE</code>（把输入串指示器 IP 指向下一个输入符号）、<code>SYM</code>（IP 当前所指的输入符号）、<code>ERROR</code>（出错处理子程序）。</p>
            <p>对 <code>E→TE′，E′→+TE′|ε，T→FT′，T′→*FT′|ε，F→(E)|i</code>，对应的递归下降子程序为：</p>
            <pre><code>PROCEDURE E；
BEGIN  T；E′  END；

PROCEDURE E′；
IF SYM='+' THEN
BEGIN  ADVANCE； T； E′  END
ELSE IF SYM&lt;&gt;'#' AND SYM&lt;&gt;')' THEN ERROR
/* ε 的情形，用 FOLLOW 集判断 */

PROCEDURE T；
BEGIN  F；T′  END；

PROCEDURE T′；
IF SYM='*' THEN
BEGIN  ADVANCE； F； T′  END

PROCEDURE F；
IF SYM='i' THEN ADVANCE
ELSE IF SYM='(' THEN
BEGIN  ADVANCE； E；
       IF SYM=')' THEN ADVANCE ELSE ERROR  END
ELSE ERROR;

PROGRAM PARSER;      /* 主程序 */
BEGIN  ADVANCE； E； IF SYM&lt;&gt;'#' THEN ERROR  END;</code></pre>
            <p>若一个非终结符有多个候选（如 <code>E→TE′ | BC</code>），则在子程序入口按 <code>SYM∈FIRST(...)</code> 选择分支；候选为 ε 时用 FOLLOW 集判断是否合法结束。课件还用<strong>扩充的巴科斯范式</strong>（{α} 表示闭包 α*，[α] 表示 α 可有可无）给出更紧凑的写法：<code>E→T{+T}</code>、<code>T→F{*F}</code>、<code>F→i|(E)</code>，对应子程序用 WHILE 循环实现，如 <code>PROCEDURE E；BEGIN T；WHILE SYM='+' DO BEGIN ADVANCE；T END END;</code>。</p>
            <p>扩充巴科斯范式也便于描述实数之类结构：<code>decimal→[sign]integer.{digit}[exponent]</code>，<code>exponent→E[sign]integer</code>，<code>integer→digit{digit}</code>，<code>sign→+|-</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp4-predict',
      heading: '4.5 预测分析程序',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>预测分析程序（LL(1) 分析法）</strong>由三部分组成：总控程序；分析表 <code>M[A,a]</code> 矩阵（A∈V_N，a∈V_T 或 #）；分析栈 STACK（存放文法符号）。</p>
            <p><strong>总控程序</strong>根据现行栈顶符号 X 和当前输入符号 a，执行三种动作之一：</p>
            <ol>
              <li>若 X=a='#'，则宣布分析成功，停止分析；</li>
              <li>若 X=a≠'#'，则把 X 从 STACK 栈顶逐出，让 a 指向下一个输入符号（匹配成功）；</li>
              <li>若 X 是一个非终结符，则查看分析表 M：若 M[X,a] 中存放着关于 X 的一个产生式，把 X 逐出栈顶，把产生式右部符号串<strong>按反序</strong>一一推进 STACK 栈（右部为 ε 则不推任何东西），同时做该产生式相应的语义动作；若 M[X,a] 中存放「出错标志」，则调用出错诊察程序 ERROR。</li>
            </ol>
            <p>总控程序（伪代码）：</p>
            <pre><code>BEGIN
  首先把 '#' 然后把文法开始符号推进 STACK 栈；
  把第一个输入符号读进 a；
  FLAG := TRUE;
  WHILE FLAG DO
  BEGIN
    把 STACK 栈顶符号上托出去并放在 X 中；
    IF X∈V_T THEN
       IF X=a THEN 把下一输入符号读进 a ELSE ERROR
    ELSE IF X='#' THEN
       IF X=a THEN FLAG := FALSE ELSE ERROR
    ELSE IF M[X,a]={X→X₁X₂…X_k} THEN
       把 X_k, X_{k-1}, …, X₁ 一一推进 STACK 栈
    ELSE ERROR
  END OF WHILE;
  STOP  /* 分析成功 */
END</code></pre>
            <p>例：对上述表达式文法分析 <code>i₁*i₂+i₃</code>，分析过程为：<code>#E</code> ⇒ E→TE′ → <code>#E′T</code> ⇒ T→FT′ → <code>#E′T′F</code> ⇒ F→i → <code>#E′T′i</code>，匹配 i₁ 后 <code>#E′T′</code>，遇 * 用 T′→*FT′，读入 i₂，遇 + 用 T′→ε，再用 E′→+TE′ 展开，读入 i₃ 后依次用 F→i、T′→ε、E′→ε 收缩，最后栈与输入同为 #，分析成功。</p>
            <p><strong>分析表 M[A,a] 的构造</strong>：先构造 FIRST(α) 与 FOLLOW(A)，然后对每个产生式 <code>A→α</code>：① 对每个终结符 a∈FIRST(α)，把 <code>A→α</code> 加至 M[A,a]；② 若 ε∈FIRST(α)，则对任何 b∈FOLLOW(A) 把 <code>A→α</code> 加至 M[A,b]；③ 把所有无定义的 M[A,a] 标上「出错标志」。</p>
            <p>课件最后给出一个重要结论：如果 G 是左递归或二义的，那么 M 至少含有一个<strong>多重定义入口</strong>；因此消除左递归和提取左因子有助于获得无多重定义的分析表。可以证明，一个文法 G 的预测分析表 M 不含多重定义入口，<strong>当且仅当</strong>该文法为 LL(1) 的。</p>`,
        },
      ],
    },
  ],
};

export default ch4;

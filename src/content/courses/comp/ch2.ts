/* 第 2 章 高级语言及其语法描述 —— 依据课件「第2章 高级语言及其语法描述」（74 页）整理 */
import type { GenChapter } from '../types';

const ch2: GenChapter = {
  id: 'deck2',
  no: '第2章',
  title: '高级语言及其语法描述',
  subtitle: '程序语言的定义 · 高级语言的一般特性 · 上下文无关文法 · 推导与语法树 · 二义性 · Chomsky 形式语言体系',
  lede:
    '<p>本章先说明程序语言由<strong>语法</strong>与<strong>语义</strong>两方面定义，再概述高级语言的分类、程序结构、数据类型与语句控制结构，最后把语法描述落实到<strong>上下文无关文法</strong>：四元式定义、推导、语法树、二义性，并以 Chomsky 的四型文法给形式语言一个总体鸟瞰。这一章是后续词法分析与语法分析的形式基础。</p>',
  toc: [
    { id: 'sec-comp2-define', text: '2.1 程序语言的定义', level: 2 },
    { id: 'sec-comp2-feature', text: '2.2 高级语言的一般特性', level: 2 },
    { id: 'sec-comp2-grammar', text: '2.3.1 上下文无关文法', level: 2 },
    { id: 'sec-comp2-derive', text: '2.3.2 推导、句型与语言', level: 2 },
    { id: 'sec-comp2-tree', text: '2.3.3 语法树与二义性', level: 2 },
    { id: 'sec-comp2-chomsky', text: '2.3.4 形式语言鸟瞰', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp2-define',
      heading: '2.1 程序语言的定义',
      blocks: [
        {
          type: 'html',
          html: `
            <p>程序语言是一个记号系统，由<strong>语法</strong>、<strong>语义</strong>、<strong>语用</strong>三方面定义：程序本质上是一定字符集上的字符串；语法是一组规则，用它可以形成和产生一个合式（well-formed）的程序，即形式上正确的程序。</p>
            <p><strong>语法</strong>又分为两部分：</p>
            <ul>
              <li><strong>词法规则</strong>：单词符号的形成规则。单词符号是语言中具有独立意义的最基本结构，一般包括常数、标识符、基本字、算符、界符等；描述工具是<strong>有限自动机</strong>。</li>
              <li><strong>语法规则</strong>：语法单位的形成规则，规定如何从单词符号形成语法单位（表达式、语句、分程序、过程、函数、程序等）；描述工具是<strong>上下文无关文法</strong>。</li>
            </ul>
            <p>例如只含加、乘的表达式文法：<code>E → i</code>、<code>E → E+E</code>、<code>E → E*E</code>、<code>E → (E)</code>。语法规则和词法规则定义了程序的形式结构，是判断输入字符串是否构成一个形式上正确的程序的依据；而定义语法单位的意义属于<strong>语义</strong>问题。</p>
            <p><strong>语义</strong>：对某种语言定义一组规则，用它可以定义一个程序的意义，称为语义规则。描述方法有两种：自然语言描述（隐藏错误、二义性和不完整性）；形式描述（操作语义如 PL/1、指称语义如 ADA、代数语义如 PASCAL）。目前大多数编译程序使用基于<strong>属性文法</strong>的语法制导翻译方法来分析语义。</p>
            <p><strong>程序语言的基本功能</strong>：描述数据和对数据的运算。程序本质上说是描述一定数据的处理过程。程序的层次结构为：程序 → 子程序或分程序、过程、函数 → 语句 → 表达式 → 数据引用、算符、函数调用。程序语言每个组成成分都同时具有「抽象的数学意义」与「具体的计算机实现意义」。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp2-feature',
      heading: '2.2 高级语言的一般特性',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件按程序结构把高级语言分为四类：</p>
            <table class="tbl">
              <thead><tr><th>类型</th><th>特点</th><th>代表语言</th></tr></thead>
              <tbody>
                <tr><td>强制式语言（Imperative，又称过程式语言）</td><td>命令驱动，面向语句</td><td>FORTRAN、C、PASCAL、Ada</td></tr>
                <tr><td>应用式语言（Applicative）</td><td>注重程序所表示的功能，而不是一个语句接一个语句地执行</td><td>LISP、ML</td></tr>
                <tr><td>基于规则的语言（Rule-based）</td><td>检查一定的条件，条件满足则执行适当的动作</td><td>Prolog</td></tr>
                <tr><td>面向对象语言（Object-Oriented）</td><td>封装性、继承性和多态性</td><td>Smalltalk、C++、Java</td></tr>
              </tbody>
            </table>
            <p><strong>FORTRAN 的程序结构</strong>：一个程序由一个主程序段和若干辅程序段（子程序、函数段或数据块）组成；每个程序段由一系列说明语句和执行语句组成，各段可以独立编译；模块结构，没有嵌套和递归；各程序段中的名字相互独立，同一个标识符在不同的程序段中代表不同的名字。</p>
            <p><strong>PASCAL 的程序结构</strong>：PASCAL 程序本身可以看成是一个操作系统所调用的过程，过程可以嵌套和递归。一个 PASCAL 过程由过程头、说明段、执行体组成。名字的<strong>作用域</strong>是一个名字能被使用的区域范围，遵循<strong>最近嵌套原则</strong>：在子程序 B1 中说明的名字 X 只在 B1 中有效；若 B2 是 B1 的内层子程序且 B2 中对 X 没有新的说明，则原名字 X 在 B2 中仍有效；若 B2 对 X 重新说明，则 B2 中对 X 的任何引用都指重新说明的这个 X。PASCAL 还提供丰富的数据类型和运算方式，允许用户动态地申请和退还存储空间。</p>
            <p><strong>ADA 的程序包（package）</strong>把数据和操作代码封装在一起，支持数据抽象，分为可见的规范说明部分（定义程序包外面可以访问的对象）与程序包体（实现细节）。例如 <code>package STACKS is</code> 中声明 <code>push</code>、<code>pop</code> 的接口，<code>package body STACKS is</code> 中给出实现。</p>
            <p><strong>JAVA</strong> 是面向对象语言，具有类（Class）、继承（Inheritance）、多态性（Polymorphism）和动态绑定（Dynamic binding）。</p>
            <p><strong>数据类型与操作</strong>：一个数据类型通常包括三种要素——用于区别这种类型数据对象的属性、这种类型的数据对象可以具有的值、可以作用于这种类型数据对象的操作。初等数据类型包括数值类型（整型、实型、复数、双精度，运算为 +、-、*、/ 等）、逻辑类型（∨、∧、┑）、字符类型、指针类型。</p>
            <p><strong>标识符与名字</strong>有本质区别：标识符是语法概念，名字有确切的意义和属性。名字的「值」是单元中的内容，「属性」是类型和作用域。名字性质的说明方式有三种：由说明语句明确规定；隐含说明（FORTRAN 以 I、J、K、…、N 为首的名字代表整型，否则为实型）；动态确定。</p>
            <p><strong>数据结构</strong>：数组逻辑上是同一类型数据组成的 n 维矩形结构，沿每一维的距离称为下标；按编译时能否确定存储空间大小分为可变数组与不可变数组；存放方式有按行存放与按列存放。例如数组 <code>A[10,20]</code> 的 <code>A[1,1]</code> 地址为 a、各维下标从 1 起、按行存放时，<code>A[i,j]</code> 的地址为 <code>a+(i-1)*20+(j-1)</code>。数组的有关信息记录在<strong>内情向量</strong>中，必须包括维数、各维的上下限、首地址以及数组元素的类型。记录由已知类型的数据组合而成，访问形式如 <code>CARD[k].NAME</code>，连续存放，域的地址用相对于记录结构起点的偏移（OFFSET）计算。此外还有字符串、表格（本质上是记录结构）、线性表、栈（后进先出，POP、PUSH）。</p>
            <p><strong>抽象数据类型</strong>包括：数据对象的一个集合；作用于这些对象的抽象运算的集合；这种类型对象的封装（除类型中定义的运算外，用户不能对这些对象进行操作）。Ada 通过程序包提供封装支持，Smalltalk、C++、Java 通过类提供支持。</p>
            <p><strong>语句与控制结构</strong>：表达式由运算量（操作数，即数据引用或函数调用）和算符组成，形式有中缀、前缀、后缀（<code>X*Y</code>、<code>-A</code>、<code>P↑</code>）。算符有优先次序与结合性：PASCAL 规定左结合 <code>A+B+C=(A+B)+C</code>；FORTRAN 对满足左、右结合的算符可任取一种。有两点要注意：代数性质能引用到什么程度视具体语言而定；数学上成立的代数性质在计算机上未必完全成立。</p>
            <p>语句分为赋值语句（<code>A := B</code>；名字的<strong>左值</strong>是该名字代表的存储单元地址，<strong>右值</strong>是该单元的内容）、控制语句（无条件转移 <code>goto L</code>；条件语句 <code>if B then S</code>、<code>if B then S1 else S2</code>；循环语句 <code>while B do S</code>、<code>repeat S until B</code>、<code>for i:=E1 step E2 until E3 do S</code>；过程调用 <code>call P(X1,…,Xn)</code>；返回 <code>return (E)</code>）与说明语句（定义变量或运算、定义名字的性质）。不包含其他语句成分的为简单句，句中有句的为复合句。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp2-grammar',
      heading: '2.3.1 上下文无关文法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>先复习几个符号集合的概念。设有穷<strong>字母表 Σ</strong>，其中每个元素称为一个字符（语言中最基本的不可再分单位）。Σ 上的<strong>字</strong>（字符串、符号串）是由 Σ 中字符构成的有穷序列；不包含任何字符的序列称为<strong>空字</strong>（空串），记为 ε；<code>Σ*</code> 表示 Σ 上所有字的全体（含 ε）。例如 <code>Σ={a,b}</code> 时 <code>Σ*={ε,a,b,aa,ab,ba,bb,aaa,…}</code>。</p>
            <p>Σ* 的子集 U 和 V 的<strong>连接（积）</strong>定义为 <code>UV={αβ | α∈U 且 β∈V}</code>。设 <code>U={a,aa}</code>、<code>V={b,bb}</code>，则 <code>UV={ab,abb,aab,aabb}</code>。V 自身的 n 次积记为 <code>Vⁿ=VV…V</code>，规定 <code>V⁰={ε}</code>，<code>V*=V⁰∪V¹∪V²∪…</code> 称为 V 的<strong>闭包</strong>，<code>V⁺=VV*</code> 称为 V 的<strong>正规闭包</strong>。例如 <code>U={a,aa}</code> 时 <code>U*={ε,a,aa,aaa,…}</code>，<code>U⁺={a,aa,aaa,…}</code>。</p>
            <p><strong>文法</strong>是描述语言语法结构的形式规则。课件先用自然语言举例：</p>
            <pre><code>&lt;句子&gt; → &lt;主语&gt;&lt;谓语&gt;&lt;间接宾语&gt;&lt;直接宾语&gt;
&lt;主语&gt; → &lt;代词&gt;        &lt;谓语&gt; → &lt;动词&gt;
&lt;间接宾语&gt; → &lt;代词&gt;    &lt;直接宾语&gt; → &lt;冠词&gt;&lt;名词&gt;
&lt;代词&gt; → He | me      &lt;名词&gt; → book
&lt;冠词&gt; → a            &lt;动词&gt; → gave</code></pre>
            <p>由此可推导出 <code>&lt;句子&gt; ⇒ … ⇒ He gave me a book</code>。</p>
            <p><strong>上下文无关文法</strong>的定义：一个上下文无关文法 G 是一个四元式 <code>G=(V_T, V_N, S, P)</code>，其中 <code>V_T</code> 是终结符集合（非空），<code>V_N</code> 是非终结符集合（非空）且 <code>V_T ∩ V_N = ∅</code>，<code>S</code> 是文法的开始符号且 <code>S∈V_N</code>，<code>P</code> 是产生式集合（有限），每个产生式的形式为 <code>P→α</code>，其中 <code>P∈V_N</code>、<code>α∈(V_T∪V_N)*</code>。开始符 S 至少必须在某个产生式的左部出现一次。</p>
            <p>例：只含 +、* 的算术表达式的文法 <code>G=&lt;{i,+,*,(,)},{E},E,P&gt;</code>，产生式为 <code>E → i</code>、<code>E → E+E</code>、<code>E → E*E</code>、<code>E → (E)</code>。</p>
            <p>几点规定：「→」也可以用「::=」表示，这种表示称为<strong>巴科斯范式（BNF）</strong>；左部相同的产生式 <code>P→α₁</code>、<code>P→α₂</code>、…、<code>P→αₙ</code> 可缩写为 <code>P→α₁|α₂|…|αₙ</code>，其中「|」读成「或」，每个 αᵢ 称为 P 的一个<strong>候选式</strong>。表示一个文法时通常只给出开始符号和产生式，如上例可写作 <code>G(E)：E → i | E+E | E*E | (E)</code>。</p>
            <p><strong>直接推出</strong>：称 <code>αAβ ⇒ αγβ</code> 为直接推出，仅当 <code>A→γ</code> 是一个产生式且 <code>α,β∈(V_T∪V_N)*</code>。如果 <code>α₁ ⇒ α₂ ⇒ … ⇒ αₙ</code>，则称这个序列是从 α₁ 到 αₙ 的一个<strong>推导</strong>；若存在从 α₁ 到 αₙ 的推导，则称 α₁ 可以推导出 αₙ。例如对上述文法 <code>E ⇒ (E) ⇒ (E+E) ⇒ (i+E) ⇒ (i+i)</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp2-derive',
      heading: '2.3.2 推导、句型与语言',
      blocks: [
        {
          type: 'html',
          html: `
            <p>例：证明 <code>(i*i+i)</code> 是文法 <code>G(E)：E → i | E+E | E*E | (E)</code> 的一个句子。证明过程为 <code>E ⇒ (E) ⇒ (E+E) ⇒ (E*E+E) ⇒ (i*E+E) ⇒ (i*i+E) ⇒ (i*i+i)</code>；其中 E、(E)、(E*E+E)、…、(i*i+i) 都是<strong>句型</strong>，最后不含非终结符的 (i*i+i) 是<strong>句子</strong>。</p>
            <p>由文法求语言的几个例子：</p>
            <ul>
              <li><code>G₁(A)：A → c | Ab</code>，语言 <code>L(G₁)={c,cb,cbb,…}</code>，即以 c 开头、后继若干个 b。</li>
              <li><code>G₂(S)：S → AB，A → aA|a，B → bB|b</code>，语言 <code>L(G₂)={aᵐbⁿ | m,n&gt;0}</code>。</li>
              <li>产生语言 <code>{aⁿbⁿ | n≥1}</code> 的文法：<code>G₃(S)：S → aSb | ab</code>。</li>
              <li>产生语言 <code>{aᵐbⁿ | 1≤n≤m≤2n}</code> 的文法：<code>G₄(S)：S → aSb | aaSb | ab | aab</code>。</li>
            </ul>
            <p>从一个句型到另一个句型的推导往往不唯一：<code>E+E ⇒ i+E ⇒ i+i</code> 与 <code>E+E ⇒ E+i ⇒ i+i</code> 都成立。于是区分：<strong>最左推导</strong>——任何一步 α ⇒ β 都是对 α 中的最左非终结符进行替换；<strong>最右推导</strong>——任何一步都是对最右非终结符进行替换。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp2-tree',
      heading: '2.3.3 语法树与二义性',
      blocks: [
        {
          type: 'html',
          html: `
            <p>用一张图表示一个句型的推导，称为<strong>语法树</strong>。例如 (i*i+i) 的语法树对应推导 <code>E ⇒ (E) ⇒ (E+E) ⇒ (E*E+E) ⇒ (i*E+E) ⇒ (i*i+E) ⇒ (i*i+i)</code>，也可对应 <code>E ⇒ (E) ⇒ (E+E) ⇒ (E+i) ⇒ (E*E+i) ⇒ (E*i+i) ⇒ (i*i+i)</code>。一棵语法树是不同推导过程的<strong>共性抽象</strong>；如果使用最左（右）推导，则一个最左（右）推导与语法树一一对应。</p>
            <p>但一个句型不一定只对应唯一一棵语法树。<strong>二义文法</strong>的定义：如果一个文法存在某个句子对应两棵不同的语法树，则说这个文法是二义的。上述 <code>G(E)：E → i | E+E | E*E | (E)</code> 就是二义文法——(i*i+i) 既可先算 i*i 也可先算 i+i。</p>
            <p><strong>语言的二义性</strong>：一个语言是二义性的，如果对它不存在无二义性的文法。可能存在 G 和 G′，一个为二义的、一个为无二义的，但 <code>L(G)=L(G′)</code>。二义性问题是<strong>不可判定问题</strong>：不存在一个算法能在有限步骤内确切判定一个文法是否二义；但可以找到一组无二义文法的充分条件。</p>
            <p>把上面的二义文法改写为无二义文法（引入表达式、项、因子三级）：</p>
            <pre><code>E → T | E+T
T → F | T*F
F → (E) | i</code></pre>
            <p>此时 (i*i+i) 的唯一推导为 <code>E ⇒ T ⇒ F ⇒ (E) ⇒ (E+T) ⇒ (T+T) ⇒ (T*F+T) ⇒ (F*F+T) ⇒ (i*F+T) ⇒ (i*i+T) ⇒ (i*i+F) ⇒ (i*i+i)</code>。</p>
            <p>描述程序设计语言时，对上下文无关文法通常加两条限制：不含 <code>P→P</code> 形式的产生式；每个非终结符 P 必须有用处。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp2-chomsky',
      heading: '2.3.4 形式语言鸟瞰',
      blocks: [
        {
          type: 'html',
          html: `
            <p>Chomsky 于 1956 年建立形式语言体系，把文法分成 0、1、2、3 四种类型。它们与上下文无关文法一样都由四部分组成，但对产生式的限制有所不同。</p>
            <table class="tbl">
              <thead><tr><th>类型</th><th>名称与识别器</th><th>产生式形式</th><th>限制</th></tr></thead>
              <tbody>
                <tr><td>0 型</td><td>短语文法，图灵机</td><td>α → β</td><td>α∈(V_T∪V_N)* 且至少含一个非终结符；β∈(V_T∪V_N)*</td></tr>
                <tr><td>1 型</td><td>上下文有关文法，线性界限自动机</td><td>α → β</td><td>|α| ≤ |β|，仅 S→ε 例外</td></tr>
                <tr><td>2 型</td><td>上下文无关文法，非确定下推自动机</td><td>A → β</td><td>A∈V_N；β∈(V_T∪V_N)*</td></tr>
                <tr><td>3 型</td><td>正规文法，有限自动机</td><td>A → αB 或 A → α（右线性）；A → Bα 或 A → α（左线性）</td><td>α∈V_T*；A,B∈V_N</td></tr>
              </tbody>
            </table>
            <p>四种类型的描述能力依次减弱（0 型最强、3 型最弱）。课件用两个语言说明边界：</p>
            <ul>
              <li><code>L₅={aⁿbⁿ | n≥1}</code> 不能由正规文法产生，但可由上下文无关文法产生：<code>G₅(S)：S → aSb | ab</code>。</li>
              <li><code>L₆={aⁿbⁿcⁿ | n≥1}</code> 不能由上下文无关文法产生，但可由上下文有关文法产生：<code>G₆(S)：S → aSBC | aBC，CB → BC，aB → ab，bB → bb，bC → bc，cC → cc</code>。</li>
            </ul>
            <p>程序设计语言<strong>不是</strong>上下文无关语言，甚至不是上下文有关语言。例如 <code>L₇={αcα | α∈(a|b)*}</code>（标识符引用）不能由上下文无关文法产生，甚至连上下文有关文法也不能产生，只能由 0 型文法产生；过程调用中「形-实参数的对应性」（如个数、顺序和类型一致性）同样超出上下文无关文法的能力。不过，现今程序设计语言的语言结构用上下文无关文法描述就足够了——这也是编译程序普遍采用上下文无关文法的原因。</p>`,
        },
      ],
    },
  ],
};

export default ch2;

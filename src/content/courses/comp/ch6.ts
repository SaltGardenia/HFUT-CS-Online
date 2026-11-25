/* 第 6 章 属性文法和语法制导翻译 —— 依据课件（79 页）整理 */
import type { GenChapter } from '../types';

const ch6: GenChapter = {
  id: 'deck6',
  no: '第6章',
  title: '属性文法和语法制导翻译',
  subtitle: '综合属性与继承属性 · 语义规则 · 依赖图与树遍历 · 抽象语法树 · S-属性文法 · L-属性文法与翻译模式',
  lede:
    '<p><strong>属性文法</strong>（也称属性翻译文法）由 Knuth 于 1968 年提出：在上下文无关文法的基础上，为每个文法符号（终结符或非终结符）配备若干相关的「值」，称为<strong>属性</strong>；属性代表与文法符号相关的信息，如类型、值、代码序列、符号表内容等，可以进行计算和传递。对于文法的每个产生式再配备一组<strong>语义规则</strong>（属性的计算规则），就得到属性文法。由源程序的语法结构所驱动的处理办法就是<strong>语法制导翻译法</strong>：对输入符号串的翻译也就是根据语义规则进行计算的结果。</p>',
  toc: [
    { id: 'sec-comp6-attr', text: '6.1 属性文法', level: 2 },
    { id: 'sec-comp6-process', text: '6.2 基于属性文法的处理方法', level: 2 },
    { id: 'sec-comp6-ast', text: '6.2.4 抽象语法树', level: 2 },
    { id: 'sec-comp6-s', text: '6.3 S-属性文法的自下而上计算', level: 2 },
    { id: 'sec-comp6-l', text: '6.4 L-属性文法和自顶向下翻译', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp6-attr',
      heading: '6.1 属性文法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>属性分两类：<strong>综合属性</strong>「自下而上」传递信息；<strong>继承属性</strong>「自上而下」传递信息。在一个属性文法中，对应于每个产生式 <code>A→α</code> 都有一套与之相关联的语义规则，每条规则的形式为 <code>b := f(c₁,c₂,…,c_k)</code>，其中或者 ① b 是 A 的一个综合属性且 c₁,…,c_k 是产生式右边文法符号的属性；或者 ② b 是产生式右边某个文法符号的一个继承属性且 c₁,…,c_k 是 A 或产生式右边任何文法符号的属性。称属性 b 依赖于属性 c₁,…,c_k。</p>
            <p><strong>属性文法的说明</strong>：</p>
            <ol>
              <li>终结符只有综合属性，由词法分析器提供。例如 <code>digit.lexval</code> 表示单词符号「数」的词法值，<code>id.entry</code> 表示标识符的符号表入口。</li>
              <li>非终结符既可以有综合属性也可以有继承属性，在语义规则中计算。</li>
              <li>关于属性计算的规定：文法的开始符号的所有继承属性作为属性计算前的初始值；一般来讲，对出现在产生式左部的非终结符 A 的综合属性和出现在右部的符号 X_i 的继承属性都必须提供一个计算规则。</li>
              <li>与产生式 <code>A→X₁X₂…X_n</code> 相关联的属性计算规则只能是 A 的综合属性和 X_i 的继承属性的计算，不能有 A 的继承属性和 X_i 的综合属性的计算规则。</li>
              <li>出现在左部的 A 的继承属性和出现在右部的 X_i 的综合属性不由该产生式的属性规则计算，它们由其它产生式的属性规则计算。</li>
              <li>属性计算规则中只能使用相应产生式中文法符号的属性，这有利于在产生式范围内「封装」属性的依赖性。</li>
            </ol>
            <p>语义规则所描述的工作可以是任何希望的翻译工作，如属性计算、静态语义检查、符号表操作、中间代码生成、报告出错等。语义规则可能产生<strong>副作用</strong>（如产生代码），也可能不是变元的严格函数（如给出可用的下一个数据单元的地址）；这样的语义规则通常写成过程调用或过程段，这时认为定义了一个<strong>虚属性</strong>。</p>
            <p>例：非终结符 A 有继承属性 a 和综合属性 b，B 有综合属性 c，C 有继承属性 d，产生式 A→BC 的规则可以是 <code>C.d := B.c+1</code>、<code>A.b := A.a+B.c</code>，而 A.a 和 B.c 在其它地方计算。</p>
            <p><strong>综合属性</strong>：在语法树中，一个结点的综合属性值由其子结点的属性值确定，使用自底向上的方法在每一个结点处使用语义规则计算。仅仅使用综合属性的属性文法称为 <strong>S-属性文法</strong>。例：</p>
            <table class="tbl">
              <thead><tr><th>产生式</th><th>语义规则</th></tr></thead>
              <tbody>
                <tr><td>L→En</td><td>print(E.val)</td></tr>
                <tr><td>E→E₁+T</td><td>E.val := E₁.val + T.val</td></tr>
                <tr><td>E→T</td><td>E.val := T.val</td></tr>
                <tr><td>T→T₁*F</td><td>T.val := T₁.val * F.val</td></tr>
                <tr><td>T→F</td><td>T.val := F.val</td></tr>
                <tr><td>F→(E)</td><td>F.val := E.val</td></tr>
                <tr><td>F→digit</td><td>F.val := digit.lexval</td></tr>
              </tbody>
            </table>
            <p>对 <code>3*5+4n</code> 的带注释语法树，自底向上计算得 F.val=3、T.val=3、F.val=5、T.val=15、E.val=15、F.val=4、T.val=4、E.val=19，最后 print(19)。</p>
            <p><strong>继承属性</strong>：在语法树中，一个结点的继承属性由此结点的父结点和/或兄弟结点的某些属性确定。用继承属性来表示程序设计语言结构中的上下文依赖关系很方便。例（变量声明）：</p>
            <table class="tbl">
              <thead><tr><th>产生式</th><th>语义规则</th></tr></thead>
              <tbody>
                <tr><td>D→TL</td><td>L.in := T.type</td></tr>
                <tr><td>T→int</td><td>T.type := integer</td></tr>
                <tr><td>T→real</td><td>T.type := real</td></tr>
                <tr><td>L→L₁,id</td><td>L₁.in := L.in；addtype(id.entry, L.in)</td></tr>
                <tr><td>L→id</td><td>addtype(id.entry, L.in)</td></tr>
              </tbody>
            </table>
            <p>对句子 <code>real id₁,id₂,id₃</code>，T.type=real 自上而下传给各级 L.in，每遇到一个 id 就调用 addtype 把类型登记进符号表。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp6-process',
      heading: '6.2 基于属性文法的处理方法',
      blocks: [
        {
          type: 'html',
          html: `
            <p>属性文法处理的总流程为：输入串 → 语法树 → 依赖图 → 语义规则计算次序。语义规则的计算包括产生代码、在符号表中存放信息、给出错误信息、执行任何其它动作。处理方法有三种：依赖图、树遍历、一遍扫描。</p>
            <p><strong>依赖图</strong>：语法树中结点的继承属性和综合属性之间的相互依赖关系，可以用一个称为依赖图的有向图描述。为每一个包含过程调用的语义规则引入一个<strong>虚综合属性</strong> b，把每条语义规则都写成 <code>b:=f(c₁,…,c_k)</code> 的形式；依赖图中为每一个属性设置一个结点，若属性 b 依赖于属性 c，则从 c 的结点有一条有向边连到 b 的结点。构造算法：对语法树中每一结点 n 的文法符号的每一个属性 a，在依赖图中建立一个结点；再对每个结点 n 所用产生式对应的每条语义规则 <code>b:=f(c₁,…,c_k)</code>，从每个 c_i 结点向 b 结点连一条有向边。</p>
            <p>依赖图的一个拓扑排序就是语义规则的一个计算次序；若依赖图中有环，说明属性之间存在循环依赖，该属性文法无法用这种方式计算。</p>
            <p><strong>树遍历</strong>：按深度优先遍历语法树，在访问结点时计算其属性。由于综合属性依赖子结点、继承属性依赖父/兄弟结点，遍历方向与属性类别的配合决定了计算能否一次完成。</p>
            <p><strong>一遍扫描</strong>：在语法分析的同时计算属性值，需要确定所采用的语法分析方法和属性的计算次序。结论是：<strong>L-属性文法</strong>适合于一遍扫描的自上而下分析，<strong>S-属性文法</strong>适合于一遍扫描的自下而上分析。所谓语法制导翻译法，直观上说就是为文法中每个产生式配上一组语义规则，并且在语法分析的同时执行这些规则：自上而下分析中，一个产生式匹配输入串成功时执行；自下而上分析中，一个产生式被用于归约时执行。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp6-ast',
      heading: '6.2.4 抽象语法树',
      blocks: [
        {
          type: 'html',
          html: `
            <p>在语法树中去掉那些对翻译不必要的信息，从而获得更有效的源程序中间表示，这种经变换后的语法树称为<strong>抽象语法树</strong>（Abstract Syntax Tree, AST）。例如 <code>S→if B then S₁ else S₂</code> 的抽象语法树只保留 if、条件、then 与 else 分支；<code>3*5+4</code> 只保留运算符与运算对象。</p>
            <p>建立表达式的抽象语法树用到三个函数：<code>mknode(op,left,right)</code> 建立一个运算符号结点，标号是 op，两个域 left 和 right 分别指向左、右子树；<code>mkleaf(id,entry)</code> 建立一个标识符结点，标号为 id，域 entry 指向标识符在符号表中的入口；<code>mkleaf(num,val)</code> 建立一个数结点，标号为 num，域 val 存放数的值。</p>
            <table class="tbl">
              <thead><tr><th>产生式</th><th>语义规则</th></tr></thead>
              <tbody>
                <tr><td>E→E₁+T</td><td>E.nptr := mknode('+', E₁.nptr, T.nptr)</td></tr>
                <tr><td>E→E₁-T</td><td>E.nptr := mknode('-', E₁.nptr, T.nptr)</td></tr>
                <tr><td>E→T</td><td>E.nptr := T.nptr</td></tr>
                <tr><td>T→(E)</td><td>T.nptr := E.nptr</td></tr>
                <tr><td>T→id</td><td>T.nptr := mkleaf(id, id.entry)</td></tr>
                <tr><td>T→num</td><td>T.nptr := mkleaf(num, num.val)</td></tr>
              </tbody>
            </table>
            <p>按此规则，<code>a-4+c</code> 的抽象语法树根为 <code>+</code>，左子树为 <code>-</code>（左叶子为指向 a 的 id 结点、右叶子为 num 4），右子树为指向 c 的 id 结点。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp6-s',
      heading: '6.3 S-属性文法的自下而上计算',
      blocks: [
        {
          type: 'html',
          html: `
            <p>S-属性文法只含有综合属性，综合属性可以在分析输入符号串的同时由自下而上的分析器来计算：分析器保存与栈中文法符号有关的综合属性值，每当归约时，新的属性值就由栈中正在归约的产生式右边符号的属性值来计算。实现方法是在分析栈中使用一个<strong>附加的域</strong>来存放综合属性值：若语义规则 <code>A.a:=f(X.x,Y.y,Z.z)</code> 对应于产生式 <code>A→XYZ</code>，则归约时用栈顶三項的属性值算出 A.a 并放入新栈顶。</p>
            <p>对 <code>L→En，E→E₁+T|T，T→T₁*F|F，F→(E)|digit</code>，把语义规则改写为栈操作代码段：</p>
            <table class="tbl">
              <thead><tr><th>产生式</th><th>代码段</th></tr></thead>
              <tbody>
                <tr><td>L→En</td><td>print(val[top])</td></tr>
                <tr><td>E→E₁+T</td><td>val[ntop] := val[top-2] + val[top]</td></tr>
                <tr><td>E→T</td><td>（值不变）</td></tr>
                <tr><td>T→T₁*F</td><td>val[ntop] := val[top-2] * val[top]</td></tr>
                <tr><td>T→F</td><td>（值不变）</td></tr>
                <tr><td>F→(E)</td><td>val[ntop] := val[top-1]</td></tr>
                <tr><td>F→digit</td><td>（值取 digit.lexval）</td></tr>
              </tbody>
            </table>
            <p>分析 <code>3*5+4n</code>：移进 3 后归约 F→digit、T→F；移进 * 与 5 后归约 F→digit，用 T→T*F 得 val=-15；再归约 E→T；移进 + 与 4 后归约 T→F，用 E→E+T 得 val=-19；最后 L→En 打印 19。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp6-l',
      heading: '6.4 L-属性文法和自顶向下翻译',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一个属性文法称为 <strong>L-属性文法</strong>，如果对于每个产生式 <code>A→X₁X₂…X_n</code>，其每个语义规则中的每个属性或者是综合属性，或者是 X_j（1≤j≤n）的一个继承属性，且这个继承属性仅依赖于：① 产生式 X_j 左边符号 X₁,X₂,…,X_{j-1} 的属性；② A 的继承属性。可以证明 S-属性文法一定是 L-属性文法。</p>
            <p>例：产生式 <code>A→LM</code> 的规则 <code>L.i:=l(A.i)</code>、<code>M.i:=m(L.s)</code> 中，M.i 只依赖左边的 L.s 与 A.i，符合 L-属性；而 <code>A→QR</code> 的规则 <code>R.i:=r(A.i)</code>、<code>Q.i:=q(R.s)</code>、<code>A.s:=f(Q.s)</code> 中 Q.i 依赖右边符号 R 的综合属性 R.s，<strong>不</strong>满足 L-属性条件。</p>
            <p><strong>翻译模式</strong>给出了使用语义规则进行计算的次序，从而可以把某些实现细节表示出来：和文法符号相关的属性与语义动作用花括号 { } 括起来，插入到产生式右部的合适位置上。</p>
            <p>例：把含 +、- 的中缀表达式翻译为后缀形式（<code>9-5+2</code> 的后缀为 <code>95-2+</code>）：</p>
            <pre><code>E → T R
R → addop T { print(addop.lexme) } R | ε
T → num      { print(num.lexme) }</code></pre>
            <p>把语义动作看作终结符号，按深度优先次序遍历分析树，即得到 9 5 - 2 + 的输出序列。</p>
            <p><strong>设计翻译模式的原则</strong>：必须保证当某个动作引用一个属性时它必须是有定义的；L-属性文法本身就能确保每个动作不会引用尚未计算出来的属性。建立翻译模式时：</p>
            <ol>
              <li>当只需要综合属性时，为每个语义规则建立一个包含赋值的动作，并把它放在相应产生式右部的<strong>末尾</strong>（如 <code>T→T₁*F {T.val:=T₁.val×F.val}</code>）。</li>
              <li>如果既有综合属性又有继承属性，必须保证：产生式右边符号的继承属性必须在这个符号<strong>以前</strong>的动作中计算出来；一个动作不能引用这个动作<strong>右边</strong>符号的综合属性；产生式左边非终结符的综合属性只有在它所引用的所有属性都计算出来以后才能计算，这种动作通常放在右端末尾。</li>
            </ol>
            <p>反例：<code>S→A₁A₂ {A₁.in:=1; A₂.in:=2}</code>、<code>A→a {print(A.in)}</code> 不满足第一条——A₁.in 在 A₁ 之后才赋值。改写为 <code>S→{A₁.in:=1} A₁ {A₂.in:=2} A₂</code> 即可。</p>
            <p><strong>自顶向下翻译</strong>：动作在处于相同位置上的符号被展开（匹配成功）时执行。为了构造不带回溯的自顶向下分析，必须消除文法中的左递归；消除左递归时要同时考虑属性——适合带综合属性的翻译模式。</p>
            <p>例：对算术表达式的左递归翻译模式 <code>E→E₁+T {E.val:=E₁.val+T.val}</code> 等，消除左递归后引入继承属性 R.i（R 前面子表达式的值）与综合属性 R.s（分析完 R 时子表达式的值）：</p>
            <pre><code>E → T   { R.i := T.val }
    R   { E.val := R.s }
R → + T { R₁.i := R.i + T.val } R₁ { R.s := R₁.s }
R → - T { R₁.i := R.i - T.val } R₁ { R.s := R₁.s }
R → ε   { R.s := R.i }
T → ( E ) { T.val := E.val }
T → num   { T.val := num.val }</code></pre>
            <p>计算 <code>9-5+2</code>：R.i 依次为 9、4、6，最后 R.s=6，E.val=6。一般方法：对翻译模式 <code>A→A₁Y {A.a:=g(A₁.a,Y.y)}</code>、<code>A→X {A.a:=f(X.x)}</code>（每个符号都有综合属性，g、f 为任意函数），消除左递归后变为 <code>A→XR</code>、<code>R→YR|ε</code>，翻译模式相应改为 <code>A→X {R.i:=f(X.x)} R {A.a:=R.s}</code>、<code>R→Y {R₁.i:=g(R.i,Y.y)} R₁ {R.s:=R₁.s}</code>、<code>R→ε {R.s:=R.i}</code>。</p>
            <p>课件的 EQN 排版例子（<code>E sub n</code>）用继承属性 ps（字号）影响盒子高度、综合属性 ht 表示高度，完整展示了 <code>B→B₁B₂</code>（并置）、<code>B→B₁ sub B₂</code>（下标，B₂ 字号缩小 30% 并下移）与 <code>B→text</code> 的翻译模式写法。</p>`,
        },
      ],
    },
  ],
};

export default ch6;

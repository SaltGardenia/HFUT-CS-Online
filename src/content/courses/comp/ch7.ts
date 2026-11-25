/* 第 7 章 语义分析和中间代码产生 —— 依据课件（104 页）整理 */
import type { GenChapter } from '../types';

const ch7: GenChapter = {
  id: 'deck7',
  no: '第7章',
  title: '语义分析和中间代码产生',
  subtitle: '静态语义检查 · 后缀式 · 图表示法 · 三地址代码 · 赋值语句翻译 · 布尔表达式 · 控制语句与回填 · 过程调用',
  lede:
    '<p>语义分析阶段在语法树的基础上做<strong>静态语义检查</strong>（类型检查、控制流检查、一致性检查、相关名字检查）与<strong>名字的作用域分析</strong>，并由中间代码产生器把源程序翻译成<strong>中间语言</strong>。中间语言的复杂性介于源语言和目标语言之间，好处是便于进行与机器无关的代码优化、易于移植、使编译程序的结构在逻辑上更为简单明确。本章介绍常用中间语言（后缀式、DAG 与抽象语法树、三地址代码及其三元式/四元式/间接三元式形式），以及说明语句、赋值语句、布尔表达式、控制语句与过程调用的翻译方法。</p>',
  toc: [
    { id: 'sec-comp7-postfix', text: '7.1.1 后缀式（逆波兰表示）', level: 2 },
    { id: 'sec-comp7-graph', text: '7.1.2 图表示法：DAG 与抽象语法树', level: 2 },
    { id: 'sec-comp7-three', text: '7.1.3 三地址代码', level: 2 },
    { id: 'sec-comp7-assign', text: '7.2～7.3 说明语句与赋值语句的翻译', level: 2 },
    { id: 'sec-comp7-bool', text: '7.4 布尔表达式的翻译', level: 2 },
    { id: 'sec-comp7-control', text: '7.5 控制语句的翻译与回填', level: 2 },
    { id: 'sec-comp7-call', text: '7.6 过程调用的处理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comp7-postfix',
      heading: '7.1.1 后缀式（逆波兰表示）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>后缀式表示法是 Lukasiewicz 发明的一种表示表达式的方法，又称<strong>逆波兰表示法</strong>。表达式 E 的后缀形式定义为：① 如果 E 是一个变量或常量，则 E 的后缀式是 E 自身；② 如果 E 是 <code>E₁ op E₂</code> 形式的表达式（op 为任何二元操作符），则 E 的后缀式为 <code>E₁′ E₂′ op</code>，其中 E₁′、E₂′ 分别为 E₁、E₂ 的后缀式；③ 如果 E 是 <code>(E₁)</code> 形式的表达式，则 E₁ 的后缀式就是 E 的后缀式。</p>
            <p>逆波兰表示法<strong>不用括号</strong>：只要知道每个算符的目数，对于后缀式不论从哪一端扫描，都能对它进行唯一分解。</p>
            <p><strong>后缀式的计算</strong>用一个栈实现：自左至右扫描后缀式，每碰到运算量就把它推进栈；每碰到 k 目运算符就把它作用于栈顶的 k 个项，并用运算结果代替这 k 个项。</p>
            <p>把表达式翻译成后缀式的语义规则：<code>E→E⁽¹⁾op E⁽²⁾</code> 的动作是 <code>E.code := E⁽¹⁾.code || E⁽²⁾.code || op</code>；<code>E→(E⁽¹⁾)</code> 的动作是 <code>E.code := E⁽¹⁾.code</code>；<code>E→id</code> 的动作是 <code>E.code := id</code>，其中「||」表示后缀形式的连接。若用数组 POST 存放后缀式（k 为下标、初值为 1），则可实现为：<code>E→E⁽¹⁾op E⁽²⁾ { POST[k]:=op; k:=k+1 }</code>、<code>E→(E⁽¹⁾) { }</code>、<code>E→i { POST[k]:=i; k:=k+1 }</code>。对输入串 <code>a+b+c</code>，POST 依次得到 a、b、+、c、+。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-graph',
      heading: '7.1.2 图表示法：DAG 与抽象语法树',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>无循环有向图（DAG）</strong>：对表达式中的每个子表达式，DAG 中都有一个结点；一个内部结点代表一个操作符，它的孩子代表操作数；代表<strong>公共子表达式</strong>的结点具有多个父结点。</p>
            <p>以 <code>a:=b*(-c)+b*(-c)</code> 为例，抽象语法树对应的代码要算两遍：</p>
            <pre><code>T1 := -c      T3 := -c
T2 := b*T1    T4 := b*T3
T5 := T2+T4   a := T5</code></pre>
            <p>而 DAG 因为共享了公共子表达式，代码变为：</p>
            <pre><code>T1 := -c
T2 := b*T1
T5 := T2+T2
a  := T5</code></pre>
            <p>产生赋值语句抽象语法树的属性文法：<code>S→id:=E</code> 的动作是 <code>S.nptr:=mknode('assign', mkleaf(id,id.place), E.nptr)</code>；<code>E→E₁+E₂</code> 与 <code>E→E₁*E₂</code> 分别用 <code>mknode('+', …)</code>、<code>mknode('*', …)</code>；<code>E→-E₁</code> 用 <code>mknode('uminus', E₁.nptr)</code>；<code>E→(E₁)</code> 直接继承；<code>E→id</code> 用 <code>mkleaf(id,id.place)</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-three',
      heading: '7.1.3 三地址代码',
      blocks: [
        {
          type: 'html',
          html: `
            <p>三地址代码的一般形式为 <code>x:=y op z</code>，可以看成是抽象语法树或 DAG 的一种<strong>线性表示</strong>。三地址语句的种类包括：<code>x:=y op z</code>；<code>x:=op y</code>；<code>x:=y</code>；<code>goto L</code>；<code>if x relop y goto L</code> 或 <code>if a goto L</code>；<code>param x</code>、<code>call p,n</code> 与返回语句 <code>return y</code>；索引赋值 <code>x:=y[i]</code>、<code>x[i]:=y</code>；地址和指针赋值 <code>x:=&amp;y</code>、<code>x:=*y</code>、<code>*x:=y</code>。</p>
            <p>生成三地址代码时，<strong>临时变量的名字对应抽象语法树的内部结点</strong>。对 <code>id:=E</code>，先对 E 求值并置于变量 T 中，再 <code>id.place:=T</code>。</p>
            <p><strong>四元式</strong>是一个带有四个域的记录结构，四个域分别称为 op、arg1、arg2 及 result。对 <code>a:=b*(-c)+b*(-c)</code>：</p>
            <table class="tbl">
              <thead><tr><th>序号</th><th>op</th><th>arg1</th><th>arg2</th><th>result</th></tr></thead>
              <tbody>
                <tr><td>(0)</td><td>uminus</td><td>c</td><td></td><td>T1</td></tr>
                <tr><td>(1)</td><td>*</td><td>b</td><td>T1</td><td>T2</td></tr>
                <tr><td>(2)</td><td>uminus</td><td>c</td><td></td><td>T3</td></tr>
                <tr><td>(3)</td><td>*</td><td>b</td><td>T3</td><td>T4</td></tr>
                <tr><td>(4)</td><td>+</td><td>T2</td><td>T4</td><td>T5</td></tr>
                <tr><td>(5)</td><td>:=</td><td>T5</td><td></td><td>a</td></tr>
              </tbody>
            </table>
            <p><strong>三元式</strong>只有 op、arg1、arg2 三个域，通过<strong>计算临时变量值的语句的位置</strong>来引用这个临时变量：</p>
            <table class="tbl">
              <thead><tr><th>序号</th><th>op</th><th>arg1</th><th>arg2</th></tr></thead>
              <tbody>
                <tr><td>(0)</td><td>uminus</td><td>c</td><td></td></tr>
                <tr><td>(1)</td><td>*</td><td>b</td><td>(0)</td></tr>
                <tr><td>(2)</td><td>uminus</td><td>c</td><td></td></tr>
                <tr><td>(3)</td><td>*</td><td>b</td><td>(2)</td></tr>
                <tr><td>(4)</td><td>+</td><td>(1)</td><td>(3)</td></tr>
                <tr><td>(5)</td><td>assign</td><td>a</td><td>(4)</td></tr>
              </tbody>
            </table>
            <p>索引赋值也有对应的三元式：<code>x[i]:=y</code> 先 <code>(0) [ ]= x i</code> 再 <code>(1) assign (0) y</code>；<code>x:=y[i]</code> 先 <code>(0) =[ ] y i</code> 再 <code>(1) assign x (0)</code>。</p>
            <p><strong>间接三元式</strong>：为了便于优化，用「三元式表 + 间接码表」表示中间代码。间接码表是一张指示器表，按运算的先后次序列出有关三元式在三元式表中的位置。优点是方便优化、节省空间：优化时只重排间接码表，不必移动三元式本身。例如 <code>X:=(A+B)*C; Y:=D↑(A+B)</code> 中 (A+B) 只存一份三元式，间接码表引用它两次。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-assign',
      heading: '7.2～7.3 说明语句与赋值语句的翻译',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>为赋值语句生成三地址代码的 S-属性文法</strong>：非终结符 S 有综合属性 S.code，代表赋值语句的三地址代码；E 有 <code>E.place</code>（存放 E 值的名字）与 <code>E.code</code>（对 E 求值的三地址语句序列）；函数 <code>newtemp</code> 每次调用返回一个不同的临时变量名（T1、T2、…）。</p>
            <table class="tbl">
              <thead><tr><th>产生式</th><th>语义规则</th></tr></thead>
              <tbody>
                <tr><td>S→id:=E</td><td>S.code := E.code ‖ gen(id.place ':=' E.place)</td></tr>
                <tr><td>E→E₁+E₂</td><td>E.place:=newtemp; E.code := E₁.code ‖ E₂.code ‖ gen(E.place ':=' E₁.place '+' E₂.place)</td></tr>
                <tr><td>E→E₁*E₂</td><td>E.place:=newtemp; E.code := E₁.code ‖ E₂.code ‖ gen(E.place ':=' E₁.place '*' E₂.place)</td></tr>
                <tr><td>E→-E₁</td><td>E.place:=newtemp; E.code := E₁.code ‖ gen(E.place ':=' 'uminus' E₁.place)</td></tr>
                <tr><td>E→(E₁)</td><td>E.place:=E₁.place; E.code := E₁.code</td></tr>
                <tr><td>E→id</td><td>E.place:=id.place; E.code := ''</td></tr>
              </tbody>
            </table>
            <p>查符号表时若 <code>lookup(id.name)</code> 返回 nil，应报错（未声明的标识符）。</p>
            <p><strong>数组元素的引用</strong>：数组元素存储在一个连续的存储块中，根据下标可以快速查找。一维数组 A 设基址 base、域宽 w、元素个数 high-low+1，则 <code>A[i]</code> 的位置为 <code>base+(i-low)*w = i*w + base - low*w</code>。</p>
            <p>二维数组设每维下界 low₁、low₂，上界 high₁、high₂，每维长度 n₁=high₁-low₁+1、n₂=high₂-low₂+1，域宽 w、基址 base，按行存放时 <code>A[i,j]</code> 的位置为 <code>base+((i-low₁)*n₂+(j-low₂))*w = (i*n₂+j)*w + base-(low₁*n₂+low₂)*w</code>。</p>
            <p>K 维数组按行存放时，<code>A[i₁,i₂,…,i_k]</code> 的位置为 <code>((…((i₁*n₂+i₂)*n₃+i₃)…)*n_k+i_k)*w + base - ((…((low₁*n₂+low₂)*n₃+low₃)…)*n_k+low_k)*w</code>，可递归计算：<code>e₁=i₁；e₂=e₁*n₂+i₂；e₃=e₂*n₃+i₃；…；e_k=e_{k-1}*n_k+i_k</code>。</p>
            <p>为使翻译在自下而上分析中完成，把引用数组元素的文法改写为 <code>L→id | Elist ]</code>、<code>Elist→Elist₁,E | id[E</code>，并设计属性：简单变量 <code>L.offset=null</code>、<code>L.place=符号表入口指针</code>；下标变量 <code>L.offset=计算公式第一项</code>（存放可变项 VARPART 的临时变量）、<code>L.place=计算公式第二项</code>（存放不变项 CONSPART 的临时变量）；Elist 有综合属性 <code>array</code>（数组名在符号表中的位置）、<code>ndim</code>（已识别出的下标表达式个数）、<code>place</code>（保存递推公式中 e_m 值的临时变量）。函数 <code>limit(array,j)</code> 返回第 j 维长度，<code>invariant(array)</code> 返回地址计算公式中的不变项。</p>
            <p>翻译方案要点：<code>S→L:=E</code> 时若 L.offset 为空（简单变量）生成 <code>L.place := E.place</code>，否则生成 <code>L.place[L.offset] := E.place</code>；<code>E→L</code> 时若 L 是下标变量则先 <code>E.place:=newtemp; emit(E.place ':=' L.place [ L.offset ])</code>。<strong>记录中域的引用</strong>同理：域的地址是相对记录起点的偏移，用 <code>L.place</code> 存记录基址、<code>L.offset</code> 存域偏移。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-bool',
      heading: '7.4 布尔表达式的翻译',
      blocks: [
        {
          type: 'html',
          html: `
            <p>布尔表达式有两个基本作用：用于逻辑演算、计算逻辑值；用于控制语句的条件式。产生布尔表达式的文法为 <code>E→E or E | E and E | not E | (E) | i rop i | i</code>。</p>
            <p>计算布尔表达式通常有两种方法：① 如同计算算术表达式一样一步步算，如 <code>1 or (not 0 and 0) or 0 = 1 or (1 and 0) or 0 = 1 or 0 or 0 = 1 or 0 = 1</code>；② 采用优化措施（短路求值）：把 <code>A or B</code> 解释成 <code>if A then true else B</code>，把 <code>A and B</code> 解释成 <code>if A then B else false</code>，把 <code>not A</code> 解释成 <code>if A then false else true</code>。</p>
            <p><strong>数值表示法</strong>：<code>a or b and not c</code> 翻译为 <code>T1:=not c；T2:=b and T1；T3:=a or T1</code>。关系表达式 <code>a&lt;b</code> 可等价写成 <code>if a&lt;b then 1 else 0</code>，即 <code>100: if a&lt;b goto 103；101: T:=0；102: goto 104；103: T:=1；104: …</code>。第一种翻译法（不短路）如 <code>A or B and C=D</code> 生成 <code>(=, C, D, T1)、(and, B, T1, T2)、(or, A, T2, T3)</code>；第二种翻译法适合作为条件表达式的布尔表达式使用。</p>
            <p><strong>作为条件控制</strong>：条件语句 <code>if E then S₁ else S₂</code> 赋予 E 两种出口——一真一假。<code>E.true</code> 是 E 为「真」时控制流转向的标号，<code>E.false</code> 是 E 为「假」时转向的标号，每次调用 <code>newlabel</code> 返回一个新标号。</p>
            <p>例：<code>if a&gt;c or b&lt;d then S₁ else S₂</code> 翻译为</p>
            <pre><code>      if a&gt;c goto L2       /* 真出口 */
      goto L1
L1:   if b&lt;d goto L2       /* 真出口 */
      goto L3               /* 假出口 */
L2:   (S₁ 的三地址代码)
      goto Lnext
L3:   (S₂ 的三地址代码)
Lnext:</code></pre>
            <p>语义规则：<code>E→E₁ or E₂</code> 时 <code>E₁.true:=E.true; E₁.false:=newlabel; E₂.true:=E.true; E₂.false:=E.false;</code> 代码为 E₁.code ‖ <code>gen(E₁.false ':')</code> ‖ E₂.code；<code>E→E₁ and E₂</code> 时 <code>E₁.true:=newlabel; E₁.false:=E.false; E₂.true:=E.true; E₂.false:=E.false;</code> 代码中插入 <code>gen(E₁.true ':')</code>；<code>E→not E₁</code> 交换 true/false 标号；<code>E→(E₁)</code> 直接继承；<code>E→id₁ relop id₂</code> 生成 <code>if id₁.place relop.op id₂.place goto E.true</code> 与 <code>goto E.false</code>；<code>E→true</code> 生成 <code>goto E.true</code>，<code>E→false</code> 生成 <code>goto E.false</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-control',
      heading: '7.5 控制语句的翻译与回填',
      blocks: [
        {
          type: 'html',
          html: `
            <p>控制语句的产生式为 <code>S→if E then S₁ | if E then S₁ else S₂ | while E do S₁</code>，其中 E 为布尔表达式。</p>
            <p><strong>if-then 语句</strong>的属性文法：<code>E.true:=newlabel; E.false:=S.next; S₁.next:=S.next;</code> 代码为 <code>E.code ‖ gen(E.true ':') ‖ S₁.code</code>。</p>
            <p><strong>if-then-else 语句</strong>：<code>E.true:=newlabel; E.false:=newlabel; S₁.next:=S.next; S₂.next:=S.next;</code> 代码为 <code>E.code ‖ gen(E.true ':') ‖ S₁.code ‖ gen('goto' S.next) ‖ gen(E.false ':') ‖ S₂.code</code>。</p>
            <p><strong>while-do 语句</strong>：<code>S.begin:=newlabel; E.true:=newlabel; E.false:=S.next; S₁.next:=S.begin;</code> 代码为 <code>gen(S.begin ':') ‖ E.code ‖ gen(E.true ':') ‖ S₁.code ‖ gen('goto' S.begin)</code>。</p>
            <p>例：<code>while a&lt;b do if c&lt;d then x:=y+z else x:=y-z</code> 生成</p>
            <pre><code>L1:   if a&lt;b goto L2
      goto Lnext
L2:   if c&lt;d goto L3
      goto L4
L3:   T1:=y+z
      x:=T1
      goto L1
L4:   T2:=y-z
      x:=T2
      goto L1
Lnext:</code></pre>
            <p><strong>一遍扫描与回填</strong>：上面的属性文法需要先知道后继标号才能生成转移指令，而一遍扫描时后继标号尚未确定。解决办法是「先填空再回填」：为每个布尔表达式设置 <code>E.truelist</code> 与 <code>E.falselist</code>（待回填真/假出口的转移指令表），语句设置 <code>S.nextlist</code>；用 <code>makelist(i)</code> 建只含指令 i 的表、<code>merge(p₁,p₂)</code> 合并、<code>backpatch(p,i)</code> 把表 p 中所有指令的目标填为 i，<code>nextquad</code> 给出下一条指令的位置。</p>
            <p>为此改写文法，插入标记非终结符 M（记录位置）与 N（生成待填的 goto）：<code>S→if E then M S₁</code>，<code>S→if E then M₁ S₁ N else M₂ S₂</code>，<code>S→while M₁ E do M₂ S₁</code>，<code>L→L₁; M S</code>，其中 <code>M→ε {M.quad:=nextquad}</code>、<code>N→ε {N.nextlist:=makelist(nextquad); emit('j,-,-,-')}</code>。</p>
            <p>翻译模式：</p>
            <pre><code>S→if E then M S₁
   { backpatch(E.truelist, M.quad);
     S.nextlist := merge(E.falselist, S₁.nextlist) }

S→if E then M₁ S₁ N else M₂ S₂
   { backpatch(E.truelist, M₁.quad);
     backpatch(E.falselist, M₂.quad);
     S.nextlist := merge(S₁.nextlist, N.nextlist, S₂.nextlist) }

S→while M₁ E do M₂ S₁
   { backpatch(S₁.nextlist, M₁.quad);
     backpatch(E.truelist, M₂.quad);
     S.nextlist := E.falselist;
     emit('j,-,-' M₁.quad) }

L→L₁; M S   { backpatch(L₁.nextlist, M.quad); L.nextlist := S.nextlist }
S→begin L end { S.nextlist := L.nextlist }
S→A          { S.nextlist := makelist() }
L→S          { L.nextlist := S.nextlist }</code></pre>
            <p><strong>标号与 goto</strong>：定义标号时把标号填入符号表并记下它对应的指令位置；<code>goto L</code> 若 L 已定义则直接生成目标地址，否则把该指令挂到 L 的待回填表上。<strong>CASE 语句</strong>通常翻译为一张转接表（跳转表）：先对选择表达式求值并检查范围，越界转默认分支，否则按表项间接跳转到各分支入口。</p>`,
        },
      ],
    },
    {
      id: 'sec-comp7-call',
      heading: '7.6 过程调用的处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p>过程调用主要对应两件事：<strong>传递参数</strong>与<strong>转子</strong>。以传地址为例：把实在参数的地址传递给相应的形式参数——调用段预先把实在参数的地址传递到被调用段可以拿到的地方；程序控制转入被调用段之后，被调用段首先把实在参数的地址抄进自己相应的形式单元中；过程体对形式参数的引用与赋值被处理成对形式单元的<strong>间接访问</strong>。</p>
            <p>翻译方法是把实参的地址逐一放在转子指令的前面。例如 <code>CALL S(A, X+Y)</code> 翻译为：计算 X+Y 置于 T 中的代码；<code>par A</code>（第一个参数的地址）；<code>par T</code>（第二个参数的地址）；<code>call S</code>（转子）。</p>
            <p>过程调用的文法为 <code>S→call id (Elist)</code>、<code>Elist→Elist,E | E</code>。参数的地址存放在一个队列中，最后对队列中的每一项生成一条 par 语句。翻译模式：<code>Elist→E</code> 时初始化 queue 仅包含 E.place；<code>Elist→Elist,E</code> 时把 E.place 加入队尾；<code>S→call id (Elist)</code> 时对队列中每一项 p 执行 <code>emit('param' p)</code>，再 <code>emit('call' id.place)</code>。</p>`,
        },
      ],
    },
  ],
};

export default ch7;

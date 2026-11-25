import type { DeckData } from '../types';

/** 第3章 集合与关系 —— 课件 PPT/3.1～3.10 + 第1章集合与计数、第5章关系模型（补充） */
const deck3: DeckData = {
  id: 'deck3',
  no: '第3章',
  title: '集合与关系',
  subtitle: '集合运算 · 序偶与笛卡尔积 · 关系及其表示 · 关系性质 · 等价 / 相容 / 偏序 · 复合与闭包',
  lede:
    '集合论是离散数学的基础。本章从集合的概念与运算出发，经序偶与笛卡尔积引入关系，讨论关系的矩阵与图表示、自反 / 对称 / 传递等性质，进而研究三类重要关系——等价关系与划分、相容关系与覆盖、偏序关系与哈斯图，最后给出复合关系、逆关系与闭包运算（含 Warshall 算法），并补充集合与计数基础、关系模型。',
  toc: [
    { id: 'sec-3-1', text: '3.1 集合的概念与运算', level: 2 },
    { id: 'sec-3-2', text: '3.2 序偶、笛卡尔积与计数基础', level: 2 },
    { id: 'sec-3-3', text: '3.3 关系及其表示', level: 2 },
    { id: 'sec-3-4', text: '3.4 关系的性质', level: 2 },
    { id: 'sec-3-5', text: '3.5 等价关系与划分', level: 2 },
    { id: 'sec-3-6', text: '3.6 相容关系与覆盖', level: 2 },
    { id: 'sec-3-7', text: '3.7 偏序关系与哈斯图', level: 2 },
    { id: 'sec-3-8', text: '3.8 复合关系、逆关系与闭包', level: 2 },
  ],
  sections: [
    {
      id: 'sec-3-1',
      heading: '3.1 集合的概念与运算',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>集合</strong>是一些确定对象的整体，对象称为元素。集合的表示法：枚举法 {a, b, c}、描述法 {x | P(x)}、文氏图。常用数集：N 自然数、Z 整数、Q 有理数、R 实数、C 复数。</p>
<ul>
<li>元素与集合的关系：a∈A 或 a∉A；</li>
<li>子集：A⊆B 当且仅当 ∀x (x∈A → x∈B)；真子集 A⊂B；</li>
<li>相等：A=B 当且仅当 A⊆B 且 B⊆A；</li>
<li>空集 ∅ 是任何集合的子集；</li>
<li><strong>幂集</strong> P(A) = {B | B⊆A}，若 |A| = n，则 |P(A)| = 2<sup>n</sup>。</li>
</ul>
<h3>集合运算</h3>
<table class="tbl">
<thead><tr><th>运算</th><th>定义</th></tr></thead>
<tbody>
<tr><td>并 A∪B</td><td>{x | x∈A 或 x∈B}</td></tr>
<tr><td>交 A∩B</td><td>{x | x∈A 且 x∈B}</td></tr>
<tr><td>差 A−B</td><td>{x | x∈A 且 x∉B}</td></tr>
<tr><td>补 ~A（相对全集 E）</td><td>E−A</td></tr>
<tr><td>对称差 A⊕B</td><td>(A−B)∪(B−A)</td></tr>
</tbody>
</table>
<p>运算律：交换律、结合律、分配律、幂等律、德摩根律、吸收律、同一律、零律、补律（A∪~A=E，A∩~A=∅）。集合恒等式可用「元素法」（任取 x，证两边等价）或「代数法」（用已知恒等式变形）证明。</p>
<div class="callout key">
<p class="callout-h">计数基础（补充课件）</p>
<p>有限集合的计数常用：加法原理（分类相加）、乘法原理（分步相乘）、排列 P(n,r) = n!/(n−r)!、组合 C(n,r) = n!/(r!(n−r)!)、容斥原理 |A∪B| = |A|+|B|−|A∩B|。这些是后续计数与概率的基础。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-2',
      heading: '3.2 序偶、笛卡尔积与计数基础',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>序偶</strong> (x, y) 由两个对象按固定次序组成，(x,y) = (u,v) 当且仅当 x=u 且 y=v。<strong>n 元组</strong> (x<sub>1</sub>,…,x<sub>n</sub>) 同理按位置区分。</p>
<h3>笛卡尔积</h3>
<div class="formula"><p>A × B = {(a, b) | a∈A, b∈B}</p></div>
<ul>
<li>|A×B| = |A|·|B|；</li>
<li>笛卡尔积不满足交换律：一般 A×B ≠ B×A；</li>
<li>不满足结合律：(A×B)×C ≠ A×(B×C)（前者元素为 ((a,b),c)，后者为 (a,(b,c))）；</li>
<li>对并、交满足分配律：A×(B∪C) = (A×B)∪(A×C)，A×(B∩C) = (A×B)∩(A∩C)；</li>
<li>若 A、B 中有一个为空集，则 A×B = ∅。</li>
</ul>
<p>A×A 常记作 A²。笛卡尔积是定义「关系」的基础：A 到 B 的二元关系就是 A×B 的子集。</p>
<h3>集合与计数补充</h3>
<ul>
<li>有限集 A 的子集个数 2<sup>|A|</sup>，真子集 2<sup>|A|</sup>−1；</li>
<li>从 n 元集到 m 元集的函数个数为 m<sup>n</sup>；</li>
<li>n 元集的二元关系个数为 2<sup>n²</sup>。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-3-3',
      heading: '3.3 关系及其表示',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>二元关系</strong> R 是 A×B 的子集；若 (a,b)∈R，记 aRb。A=B 时称 A 上的关系。关系的<strong>前域</strong> dom R = {a | ∃b (a,b)∈R}，<strong>值域</strong> ran R = {b | ∃a (a,b)∈R}，<strong>域</strong> fld R = dom R ∪ ran R。</p>
<h3>三种表示法</h3>
<ol>
<li><strong>集合表示</strong>：列举有序对，如 R = {(1,2), (2,3)}；</li>
<li><strong>关系矩阵</strong>：设 A={a<sub>1</sub>,…,a<sub>m</sub>}，B={b<sub>1</sub>,…,b<sub>n</sub>}，矩阵 M<sub>R</sub> 的第 i 行第 j 列为 1 当且仅当 (a<sub>i</sub>,b<sub>j</sub>)∈R，否则为 0；</li>
<li><strong>关系图</strong>：以 A∪B 的元素为顶点，若 (a,b)∈R 则画一条从 a 指向 b 的有向边；A 上的关系图中，自反关系每个顶点有自环。</li>
</ol>
<p><strong>恒等关系</strong> I<sub>A</sub> = {(a,a) | a∈A}；<strong>全域关系</strong> E<sub>A</sub> = A×A；<strong>空关系</strong> ∅。</p>
<h3>关系的基本运算</h3>
<p>关系作为集合，可进行并、交、差、补；另有逆关系 R<sup>−1</sup> = {(b,a) | (a,b)∈R} 与复合关系 R∘S = {(a,c) | ∃b ((a,b)∈R ∧ (b,c)∈S)}（不同教材复合次序可能相反，以课件定义为准）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-4',
      heading: '3.4 关系的性质',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 R 是集合 A 上的关系：</p>
<table class="tbl">
<thead><tr><th>性质</th><th>定义</th><th>矩阵 / 图特征</th></tr></thead>
<tbody>
<tr><td>自反</td><td>∀a∈A，(a,a)∈R</td><td>主对角线全 1；每个顶点有自环</td></tr>
<tr><td>反自反</td><td>∀a∈A，(a,a)∉R</td><td>主对角线全 0；无自环</td></tr>
<tr><td>对称</td><td>∀a,b，(a,b)∈R → (b,a)∈R</td><td>矩阵对称；边成对出现</td></tr>
<tr><td>反对称</td><td>∀a,b，(a,b)∈R 且 (b,a)∈R → a=b</td><td>矩阵中 i≠j 位置不同时为 1；无双向边</td></tr>
<tr><td>传递</td><td>∀a,b,c，(a,b)∈R 且 (b,c)∈R → (a,c)∈R</td><td>M<sub>R</sub>² 的非零项在 M<sub>R</sub> 中也为 1</td></tr>
</tbody>
</table>
<p>注意：自反与反自反互斥但不必有一个成立；对称与反对称可以同时成立（如恒等关系）；存在既不对称也不反对称的关系。</p>
<h3>判定与应用</h3>
<ul>
<li>自反 / 反自反看对角线；对称 / 反对称看矩阵关于主对角线的关系；传递性可用关系图（若 a→b、b→c 则必须有 a→c）或矩阵平方判定。</li>
<li>关系的性质是后续等价关系（自反 + 对称 + 传递）、相容关系（自反 + 对称）、偏序关系（自反 + 反对称 + 传递）的基础。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-3-5',
      heading: '3.5 等价关系与划分',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 A 上的关系 R 是<strong>自反、对称、传递</strong>的，则称 R 为<strong>等价关系</strong>。例如「等于」「同余模 n」「同姓」「同一班级」。</p>
<h3>等价类与商集</h3>
<p>设 R 是 A 上的等价关系，对 a∈A，a 的等价类</p>
<div class="formula"><p>[a]<sub>R</sub> = {x∈A | xRa}</p></div>
<p>性质：</p>
<ul>
<li>a∈[a]（非空）；</li>
<li>aRb ⇔ [a] = [b]；</li>
<li>若 [a] ≠ [b]，则 [a]∩[b] = ∅（等价类要么相同，要么不相交）；</li>
<li>所有等价类的并等于 A。</li>
</ul>
<p>所有等价类组成的集合称为<strong>商集</strong> A/R = {[a]<sub>R</sub> | a∈A}。</p>
<h3>划分</h3>
<p>若 A 的一族非空子集 {A<sub>i</sub>} 两两不交且并为 A，则称为 A 的一个<strong>划分</strong>，每个 A<sub>i</sub> 称为划分块。等价关系与划分一一对应：等价关系 → 商集是划分；划分 → 定义「同块」关系是等价关系。</p>
<div class="callout key">
<p class="callout-h">例：模 3 同余</p>
<p>Z 上定义 aRb ⇔ a≡b (mod 3)。等价类为 [0]={…,−3,0,3,…}、[1]={…,−2,1,4,…}、[2]={…,−1,2,5,…}，商集 Z/R = {[0],[1],[2]}，是 Z 的一个划分。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-6',
      heading: '3.6 相容关系与覆盖',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 A 上的关系 R 是<strong>自反、对称</strong>的，则称 R 为<strong>相容关系</strong>。相容关系不要求传递，因此相容类可以相交。</p>
<ul>
<li><strong>相容类</strong>：A 的子集 C，若 C 中任意两个元素都相容（aRb），则 C 为相容类；</li>
<li><strong>最大相容类</strong>：不能被其他相容类真包含的相容类；</li>
<li><strong>覆盖</strong>：A 的一族非空子集，其并为 A（允许相交，区别于划分）。</li>
</ul>
<p>相容关系与覆盖的关系：相容关系 R 的所有最大相容类构成 A 的一个覆盖；反之，给定 A 的覆盖，定义「同属于某个覆盖块」的关系，是 A 上的相容关系。这与「等价关系 ↔ 划分」的对应关系平行，但相容关系对应覆盖。</p>
<div class="callout key">
<p class="callout-h">等价 vs 相容</p>
<p>等价关系：自反 + 对称 + 传递 → 等价类互不相交 → 划分；相容关系：自反 + 对称（无传递）→ 相容类可以重叠 → 覆盖。传递性是两者的分水岭。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-7',
      heading: '3.7 偏序关系与哈斯图',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 A 上的关系 R 是<strong>自反、反对称、传递</strong>的，则称 R 为<strong>偏序关系</strong>，记 ≼，(A, ≼) 称为偏序集。若对任意 a,b 都有 a≼b 或 b≼a，则称为<strong>全序</strong>（线序）；若 A 的每个非空子集都有最小元，则称为<strong>良序</strong>。</p>
<h3>盖住关系与哈斯图</h3>
<p>若 a≺b（a≼b 且 a≠b）且不存在 c 使 a≺c≺b，则称 b <strong>盖住</strong> a。哈斯图：只画盖住关系，省略自环与传递边，并将小元素画在下方、大元素画在上方。</p>
<h3>特殊元素</h3>
<table class="tbl">
<thead><tr><th>概念</th><th>定义</th></tr></thead>
<tbody>
<tr><td>最大元</td><td>b∈B，∀x∈B 有 x≼b</td></tr>
<tr><td>最小元</td><td>b∈B，∀x∈B 有 b≼x</td></tr>
<tr><td>极大元</td><td>b∈B，不存在 x∈B 使 b≺x</td></tr>
<tr><td>极小元</td><td>b∈B，不存在 x∈B 使 x≺b</td></tr>
<tr><td>上界 / 下界</td><td>a∈A，∀x∈B 有 x≼a / a≼x</td></tr>
<tr><td>上确界 / 下确界</td><td>上界 / 下界中最小的 / 最大的</td></tr>
</tbody>
</table>
<p>最大元一定唯一，极大元可以不唯一；上确界、下确界若存在必唯一，且不一定属于 B。</p>
<div class="callout key">
<p class="callout-h">例：整除关系</p>
<p>正整数集上的整除关系是偏序。哈斯图中 1 在最下，素数在 1 之上；12 的盖住元素是 4、6；12 是 {4,6} 的上确界，2 是 {4,6} 的下确界。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-8',
      heading: '3.8 复合关系、逆关系与闭包',
      blocks: [
        {
          type: 'html',
          html: `
<h3>复合关系</h3>
<div class="formula"><p>R∘S = {(a,c) | ∃b ((a,b)∈R ∧ (b,c)∈S)}</p></div>
<p>复合满足结合律：(R∘S)∘T = R∘(S∘T)。关系矩阵上，R∘S 的矩阵等于 M<sub>R</sub> 与 M<sub>S</sub> 的布尔乘积（乘法用 ∧、加法用 ∨）。关系 R 的 n 次幂 R<sup>n</sup> = R∘R∘…∘R。</p>
<h3>逆关系</h3>
<div class="formula"><p>R<sup>−1</sup> = {(b,a) | (a,b)∈R}</p></div>
<p>性质：(R<sup>−1</sup>)<sup>−1</sup> = R；(R∪S)<sup>−1</sup> = R<sup>−1</sup>∪S<sup>−1</sup>；(R∩S)<sup>−1</sup> = R<sup>−1</sup>∩S<sup>−1</sup>；(R∘S)<sup>−1</sup> = S<sup>−1</sup>∘R<sup>−1</sup>。关系矩阵转置即逆关系的矩阵；关系图把每条边反向。</p>
<h3>闭包</h3>
<p>包含 R 且具有性质 P 的最小关系称为 R 的 P 闭包：</p>
<ul>
<li><strong>自反闭包</strong> r(R) = R ∪ I<sub>A</sub>；</li>
<li><strong>对称闭包</strong> s(R) = R ∪ R<sup>−1</sup>；</li>
<li><strong>传递闭包</strong> t(R) = R ∪ R² ∪ R³ ∪ …（有限集上只需并到 R<sup>n</sup>）。</li>
</ul>
<p>闭包性质：R 自反 ⇔ r(R)=R；R 对称 ⇔ s(R)=R；R 传递 ⇔ t(R)=R。闭包运算满足 r(s(R)) = s(r(R)) 等复合关系，但 t(s(R)) 与 s(t(R)) 一般不相等。</p>
<h3>Warshall 算法</h3>
<p>求传递闭包的高效算法，基于关系矩阵：</p>
<pre class="code"><code>M = R 的关系矩阵
for k in 1..n:
    for i in 1..n:
        if M[i][k] == 1:
            for j in 1..n:
                M[i][j] = M[i][j] or M[k][j]</code></pre>
<p>时间复杂度 O(n³)。算法结束后 M 即 t(R) 的关系矩阵。也可用「逐次幂并」或关系图的可达性（Floyd 思想）理解。</p>
`,
        },
      ],
    },
  ],
};

export default deck3;

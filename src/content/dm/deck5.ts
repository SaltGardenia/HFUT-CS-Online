import type { DeckData } from '../types';

/** 第5章 代数系统 —— 课件 PPT/5.1～5.8 */
const deck5: DeckData = {
  id: 'deck5',
  no: '第5章',
  title: '代数系统',
  subtitle: '运算及性质 · 幺元 / 零元 / 逆元 · 群 · 子群 · 陪集与拉格朗日定理 · 同态同构 · 循环群',
  lede:
    '代数系统研究集合上运算及其性质。本章从二元运算的封闭性、交换律、结合律、分配律出发，定义幺元、零元、逆元与独异点，进而给出群、子群、陪集与拉格朗日定理，讨论同态与同构，最后研究阿贝尔群与循环群的结构。',
  toc: [
    { id: 'sec-5-1', text: '5.1 运算及其性质', level: 2 },
    { id: 'sec-5-2', text: '5.2 幺元、零元和逆元', level: 2 },
    { id: 'sec-5-3', text: '5.3 群的基本概念与性质', level: 2 },
    { id: 'sec-5-4', text: '5.4 子群及其判定', level: 2 },
    { id: 'sec-5-5', text: '5.5 陪集与拉格朗日定理', level: 2 },
    { id: 'sec-5-6', text: '5.6 同态与同构', level: 2 },
    { id: 'sec-5-7', text: '5.7 阿贝尔群与循环群', level: 2 },
  ],
  sections: [
    {
      id: 'sec-5-1',
      heading: '5.1 运算及其性质',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 A 为非空集合，函数 f: A<sup>n</sup>→A 称为 A 上的 <strong>n 元运算</strong>。n=1 为一元运算，n=2 为二元运算。二元运算常用 ∗、∘、+、× 表示。</p>
<ul>
<li><strong>封闭性</strong>：对任意 a,b∈A，a∗b∈A；</li>
<li><strong>交换律</strong>：a∗b = b∗a；</li>
<li><strong>结合律</strong>：(a∗b)∗c = a∗(b∗c)；</li>
<li><strong>幂等律</strong>：a∗a = a；</li>
<li><strong>分配律</strong>：a∗(b∘c) = (a∗b)∘(a∗c)，(b∘c)∗a = (b∗a)∘(c∗a)；</li>
<li><strong>吸收律</strong>：a∗(a∘b) = a，a∘(a∗b) = a。</li>
</ul>
<p>集合 A 与 A 上的若干运算组成的系统称为<strong>代数系统</strong>，记 (A, ∗) 或 (A, ∗, ∘)。若运算满足结合律，则称<strong>半群</strong>；半群若有幺元，则称<strong>独异点</strong>（含幺半群）。</p>
<div class="callout key">
<p class="callout-h">运算表的判定</p>
<p>有限代数系统的运算可用运算表表示。交换律 ⇔ 运算表关于主对角线对称；幂等律 ⇔ 主对角线元素与行（列）标相同；结合律需逐组验证，不能只看表面对称。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-2',
      heading: '5.2 幺元、零元和逆元',
      blocks: [
        {
          type: 'html',
          html: `
<h3>幺元（单位元）</h3>
<p>若存在 e∈A，使对任意 a∈A 有 e∗a = a∗e = a，则称 e 为幺元。幺元若存在则唯一。</p>
<h3>零元</h3>
<p>若存在 θ∈A，使对任意 a∈A 有 θ∗a = a∗θ = θ，则称 θ 为零元。零元若存在则唯一。</p>
<h3>逆元</h3>
<p>设 e 为幺元，a∈A。若存在 b∈A 使 a∗b = b∗a = e，则称 b 为 a 的逆元，记 a<sup>−1</sup>。逆元若存在则唯一。若 a 的逆元是自身（a∗a=e），则称 a 为自逆元。</p>
<ul>
<li>幺元的逆元是幺元；零元一般没有逆元（除非 A 只有一个元素）；</li>
<li>若 a、b 都可逆，则 (a∗b)<sup>−1</sup> = b<sup>−1</sup>∗a<sup>−1</sup>；</li>
<li>在有幺元的半群中，逆元唯一；满足消去律的有限半群中，每个元素未必可逆，但群中必可逆。</li>
</ul>
<h3>独异点</h3>
<p>含有幺元的半群称为独异点。例如 (N, +) 是半群，幺元为 0，故是独异点；(N, ×) 幺元为 1，也是独异点；(Z, −) 不满足结合律，不是半群。</p>
<div class="callout key">
<p class="callout-h">例：运算表找特殊元</p>
<p>在有限运算表中：某行（列）与表头完全一致 → 该行对应的元素是幺元；某行（列）元素全相同 → 该行对应元素可能是零元（需双向验证）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-3',
      heading: '5.3 群的基本概念与性质',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 G 非空，∗ 为 G 上的二元运算。若满足</p>
<ol>
<li><strong>封闭性</strong>：∀a,b∈G，a∗b∈G；</li>
<li><strong>结合律</strong>：∀a,b,c∈G，(a∗b)∗c = a∗(b∗c)；</li>
<li><strong>幺元</strong>：存在 e∈G，∀a∈G，e∗a = a∗e = a；</li>
<li><strong>逆元</strong>：∀a∈G，存在 a<sup>−1</sup>∈G，a∗a<sup>−1</sup> = a<sup>−1</sup>∗a = e，</li>
</ol>
<p>则称 (G, ∗) 为<strong>群</strong>。若还满足交换律，则称为<strong>阿贝尔群</strong>（交换群）。群的元素个数称为阶，记 |G|。</p>
<h3>群的性质</h3>
<ul>
<li>群中幺元、逆元唯一；</li>
<li>消去律成立：a∗b = a∗c ⇒ b = c，b∗a = c∗a ⇒ b = c；</li>
<li>(a<sup>−1</sup>)<sup>−1</sup> = a；(a∗b)<sup>−1</sup> = b<sup>−1</sup>∗a<sup>−1</sup>；</li>
<li>方程 a∗x = b 与 y∗a = b 在群中都有唯一解 x = a<sup>−1</sup>∗b，y = b∗a<sup>−1</sup>；</li>
<li>群的运算表中每行、每列都是 G 的一个排列（拉丁方）。</li>
</ul>
<h3>常见群</h3>
<table class="tbl">
<thead><tr><th>群</th><th>运算</th><th>说明</th></tr></thead>
<tbody>
<tr><td>(Z, +)</td><td>加法</td><td>无限阿贝尔群，幺元 0</td></tr>
<tr><td>(Z<sub>n</sub>, +<sub>n</sub>)</td><td>模 n 加法</td><td>n 阶循环群</td></tr>
<tr><td>(R−{0}, ×)</td><td>乘法</td><td>阿贝尔群，幺元 1</td></tr>
<tr><td>n 元置换群 S<sub>n</sub></td><td>置换复合</td><td>n! 阶，非阿贝尔（n≥3）</td></tr>
</tbody>
</table>
`,
        },
      ],
    },
    {
      id: 'sec-5-4',
      heading: '5.4 子群及其判定',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 (G, ∗) 为群，H⊆G 非空。若 (H, ∗) 本身也构成群，则称 H 为 G 的<strong>子群</strong>，记 H≤G。任何群都有平凡子群 {e} 与 G 本身。</p>
<h3>子群的判定</h3>
<p><strong>判定定理一</strong>：非空 H⊆G 是子群当且仅当</p>
<ol>
<li>∀a,b∈H，a∗b∈H（封闭）；</li>
<li>∀a∈H，a<sup>−1</sup>∈H（逆元封闭）。</li>
</ol>
<p><strong>判定定理二（一步判定）</strong>：非空 H⊆G 是子群当且仅当 ∀a,b∈H，a∗b<sup>−1</sup>∈H。</p>
<p><strong>有限子群判定</strong>：若 H 是 G 的非空有限子集且对运算封闭，则 H 是子群（有限半群中消去律保证逆元存在）。</p>
<p>子群的性质：子群的交仍是子群；子群的并不一定是子群。H 的阶整除 G 的阶（拉格朗日定理）。</p>
<div class="callout key">
<p class="callout-h">例</p>
<p>(Z, +) 中，nZ = {nk | k∈Z} 是子群；({e}, ∗) 与 G 是平凡子群；S<sub>3</sub> 中偶置换全体 A<sub>3</sub> 是 3 阶子群。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-5',
      heading: '5.5 陪集与拉格朗日定理',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 H≤G，a∈G。集合</p>
<div class="formula"><p>aH = {a∗h | h∈H}（左陪集），Ha = {h∗a | h∈H}（右陪集）</p></div>
<p>性质：</p>
<ul>
<li>a∈aH；</li>
<li>aH = bH ⇔ a<sup>−1</sup>b∈H；</li>
<li>任意两个左陪集要么相等，要么不相交；</li>
<li>所有左陪集构成 G 的一个划分；</li>
<li>|aH| = |H|（映射 h↦a∗h 是双射）。</li>
</ul>
<p>H 在 G 中的左陪集个数称为 H 的<strong>指数</strong>，记 [G:H]。</p>
<h3>拉格朗日定理</h3>
<div class="formula"><p>若 G 为有限群，H≤G，则 |G| = |H| · [G:H]</p></div>
<p>推论：子群的阶整除群的阶；群中每个元素的阶整除群的阶；素数阶群只有平凡子群，必为循环群。</p>
<div class="callout key">
<p class="callout-h">例</p>
<p>G = Z<sub>6</sub>（模 6 加法），H = {0,3}。左陪集：H = {0,3}、1+H = {1,4}、2+H = {2,5}，指数为 3，|G| = 2×3。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-6',
      heading: '5.6 同态与同构',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 (G, ∗) 与 (G', ∘) 为两个群，映射 φ: G→G'。若对任意 a,b∈G 有</p>
<div class="formula"><p>φ(a∗b) = φ(a) ∘ φ(b)</p></div>
<p>则称 φ 为 G 到 G' 的<strong>同态映射</strong>（同态）。</p>
<ul>
<li>若 φ 是单射，称为<strong>单同态</strong>；</li>
<li>若 φ 是满射，称为<strong>满同态</strong>；</li>
<li>若 φ 是双射，称为<strong>同构</strong>，记 G ≅ G'。</li>
</ul>
<h3>同态的基本性质</h3>
<ul>
<li>φ(e) = e'（幺元映为幺元）；</li>
<li>φ(a<sup>−1</sup>) = φ(a)<sup>−1</sup>；</li>
<li>φ(a<sup>n</sup>) = φ(a)<sup>n</sup>；</li>
<li><strong>同态核</strong> ker φ = {a∈G | φ(a)=e'} 是 G 的子群；</li>
<li>φ 是单同态 ⇔ ker φ = {e}；</li>
<li>同构关系是等价关系（自反、对称、传递）。</li>
</ul>
<p>同构的两个群在同构意义下「结构完全相同」——元素名称与运算符号可不同，但运算表结构一致。同态则保持运算，但不要求一一对应。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-7',
      heading: '5.7 阿贝尔群与循环群',
      blocks: [
        {
          type: 'html',
          html: `
<h3>阿贝尔群</h3>
<p>运算满足交换律的群称为阿贝尔群。判定：G 为阿贝尔群 ⇔ 对任意 a,b∈G，(a∗b)² = a²∗b² ⇔ (a∗b)<sup>−1</sup> = a<sup>−1</sup>∗b<sup>−1</sup>。</p>
<h3>循环群</h3>
<p>若群 G 中存在元素 a，使 G = {a<sup>n</sup> | n∈Z}，则称 G 为<strong>循环群</strong>，a 为<strong>生成元</strong>，记 G = ⟨a⟩。</p>
<ul>
<li>循环群一定是阿贝尔群；</li>
<li>循环群的子群仍是循环群；</li>
<li>无限循环群 ⟨a⟩ 与 (Z, +) 同构；</li>
<li>n 阶循环群与 (Z<sub>n</sub>, +<sub>n</sub>) 同构；</li>
<li>n 阶循环群的生成元个数为 φ(n)（欧拉函数），生成元为 a<sup>k</sup>，其中 gcd(k,n)=1；</li>
<li>n 阶循环群对每个正因子 d|n 恰有一个 d 阶子群。</li>
</ul>
<p>元素的<strong>阶</strong>：使 a<sup>m</sup>=e 的最小正整数 m；若不存在则称无限阶。有限群中元素的阶整除群的阶（拉格朗日定理推论）。</p>
<div class="callout key">
<p class="callout-h">例：Z<sub>8</sub></p>
<p>Z<sub>8</sub> 是 8 阶循环群，生成元为 1、3、5、7（与 8 互素），共 φ(8)=4 个。3 的阶为 8：3,6,1,4,7,2,5,0。子群按因子 1,2,4,8 各有一个。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck5;

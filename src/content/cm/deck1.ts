import type { DeckData } from '../types';

/** 第1章 插值方法 —— 课件 PPT-2024/第1章 插值方法-1～4 */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1章',
  title: '插值方法',
  subtitle: 'Lagrange 插值 · Newton 差商与差分 · Hermite 插值 · 分段插值与样条 · 插值误差',
  lede:
    '插值是已知函数表求函数近似值的经典方法：构造一个简单函数（通常是多项式）使其在给定节点上与已知值相等，再用它近似其他点的函数值。本章依次讨论 Lagrange 插值、Newton 差商插值、Hermite 插值、分段低次插值与三次样条，并给出插值余项与误差估计。',
  toc: [
    { id: 'sec-1-1', text: '1.1 插值问题与多项式插值', level: 2 },
    { id: 'sec-1-2', text: '1.2 Lagrange 插值', level: 2 },
    { id: 'sec-1-3', text: '1.3 Newton 差商插值', level: 2 },
    { id: 'sec-1-4', text: '1.4 Hermite 插值', level: 2 },
    { id: 'sec-1-5', text: '1.5 分段插值与三次样条', level: 2 },
    { id: 'sec-1-6', text: '1.6 插值余项与 Runge 现象', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '1.1 插值问题与多项式插值',
      blocks: [
        {
          type: 'html',
          html: `
<p>给定 n+1 个互异节点 x<sub>0</sub>, x<sub>1</sub>, …, x<sub>n</sub> 及函数值 y<sub>i</sub> = f(x<sub>i</sub>)，求一个简单函数 P(x)，使</p>
<div class="formula"><p>P(x<sub>i</sub>) = y<sub>i</sub>　（i = 0, 1, …, n）</p></div>
<p>P 称为<strong>插值函数</strong>，节点为插值节点，条件为插值条件。</p>
<h3>多项式插值的存在唯一性</h3>
<p>次数不超过 n 的多项式 P<sub>n</sub>(x) 满足 n+1 个插值条件时，存在且唯一。证明：设 P<sub>n</sub> 的一般形式，代入条件得到关于系数的 n+1 元线性方程组，其系数行列式为 Vandermonde 行列式</p>
<div class="formula"><p>V = ∏<sub>0≤i&lt;j≤n</sub> (x<sub>j</sub> − x<sub>i</sub>) ≠ 0</p></div>
<p>故方程组有唯一解。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '1.2 Lagrange 插值',
      blocks: [
        {
          type: 'html',
          html: `
<p>构造 n 次插值基函数</p>
<div class="formula"><p>l<sub>i</sub>(x) = ∏<sub>j≠i</sub> (x − x<sub>j</sub>) / (x<sub>i</sub> − x<sub>j</sub>)　（i = 0,1,…,n）</p></div>
<p>满足 l<sub>i</sub>(x<sub>j</sub>) = δ<sub>ij</sub>。于是 Lagrange 插值多项式</p>
<div class="formula"><p>L<sub>n</sub>(x) = Σ<sub>i=0</sub><sup>n</sup> y<sub>i</sub> · l<sub>i</sub>(x)</p></div>
<h3>余项</h3>
<p>若 f 在包含节点的区间 [a,b] 上有 n+1 阶连续导数，则对任意 x∈[a,b]，存在 ξ∈(a,b) 使</p>
<div class="formula"><p>R<sub>n</sub>(x) = f(x) − L<sub>n</sub>(x) = f<sup>(n+1)</sup>(ξ) / (n+1)! · ω<sub>n+1</sub>(x)</p></div>
<p>其中 ω<sub>n+1</sub>(x) = (x−x<sub>0</sub>)(x−x<sub>1</sub>)…(x−x<sub>n</sub>)。</p>
<p>优点：公式对称、便于理论分析；缺点：增加节点时所有基函数都要重算，计算量大。</p>
<h3>线性与二次插值</h3>
<ul>
<li>n=1：L<sub>1</sub>(x) = y<sub>0</sub>(x−x<sub>1</sub>)/(x<sub>0</sub>−x<sub>1</sub>) + y<sub>1</sub>(x−x<sub>0</sub>)/(x<sub>1</sub>−x<sub>0</sub>)；</li>
<li>n=2：过三点的抛物线插值。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '1.3 Newton 差商插值',
      blocks: [
        {
          type: 'html',
          html: `
<h3>差商</h3>
<p>一阶差商 f[x<sub>i</sub>, x<sub>j</sub>] = (f(x<sub>j</sub>) − f(x<sub>i</sub>)) / (x<sub>j</sub> − x<sub>i</sub>)；k 阶差商递推：</p>
<div class="formula"><p>f[x<sub>0</sub>,…,x<sub>k</sub>] = (f[x<sub>1</sub>,…,x<sub>k</sub>] − f[x<sub>0</sub>,…,x<sub>k−1</sub>]) / (x<sub>k</sub> − x<sub>0</sub>)</p></div>
<p>差商与节点次序无关，且 f[x<sub>0</sub>,…,x<sub>k</sub>] = f<sup>(k)</sup>(ξ)/k!。</p>
<h3>Newton 插值公式</h3>
<div class="formula"><p>N<sub>n</sub>(x) = f(x<sub>0</sub>) + f[x<sub>0</sub>,x<sub>1</sub>](x−x<sub>0</sub>) + f[x<sub>0</sub>,x<sub>1</sub>,x<sub>2</sub>](x−x<sub>0</sub>)(x−x<sub>1</sub>) + … + f[x<sub>0</sub>,…,x<sub>n</sub>]∏<sub>i=0</sub><sup>n−1</sup>(x−x<sub>i</sub>)</p></div>
<p>余项：R<sub>n</sub>(x) = f[x<sub>0</sub>,…,x<sub>n</sub>,x]·ω<sub>n+1</sub>(x)。</p>
<p>优点：增加节点时只需在末尾追加一项，前面的差商可复用；适合逐步加密节点。</p>
<h3>差分形式（等距节点）</h3>
<p>节点等距 h 时，可用向前差分 Δf<sub>i</sub> = f<sub>i+1</sub> − f<sub>i</sub> 表示：</p>
<div class="formula"><p>N<sub>n</sub>(x<sub>0</sub>+th) = f<sub>0</sub> + tΔf<sub>0</sub> + t(t−1)/2!·Δ²f<sub>0</sub> + … + t(t−1)…(t−n+1)/n!·Δ<sup>n</sup>f<sub>0</sub></p></div>
<p>另有向后差分、中心差分形式，分别适合外推与内插。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '1.4 Hermite 插值',
      blocks: [
        {
          type: 'html',
          html: `
<p>若不仅要求插值函数在节点上函数值相等，还要求导数值相等，则称为 <strong>Hermite 插值</strong>。给定 n+1 个节点上的函数值与一阶导数值（共 2n+2 个条件），可唯一确定次数不超过 2n+1 的多项式 H<sub>2n+1</sub>(x)。</p>
<p>两点三次 Hermite 插值（x<sub>0</sub>, x<sub>1</sub>，已知 y<sub>0</sub>, y<sub>1</sub>, y′<sub>0</sub>, y′<sub>1</sub>）：</p>
<div class="formula"><p>H<sub>3</sub>(x) = y<sub>0</sub>α<sub>0</sub>(x) + y<sub>1</sub>α<sub>1</sub>(x) + y′<sub>0</sub>β<sub>0</sub>(x) + y′<sub>1</sub>β<sub>1</sub>(x)</p></div>
<p>其中 α<sub>i</sub>、β<sub>i</sub> 为三次基函数，满足 α<sub>i</sub>(x<sub>j</sub>)=δ<sub>ij</sub>、α′<sub>i</sub>(x<sub>j</sub>)=0，β<sub>i</sub>(x<sub>j</sub>)=0、β′<sub>i</sub>(x<sub>j</sub>)=δ<sub>ij</sub>。</p>
<p>余项：</p>
<div class="formula"><p>R<sub>3</sub>(x) = f<sup>(4)</sup>(ξ)/4! · (x−x<sub>0</sub>)²(x−x<sub>1</sub>)²</p></div>
<p>Hermite 插值的优点是能保持函数的光滑性（一阶导数连续），常用于需要导数信息的场合。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '1.5 分段插值与三次样条',
      blocks: [
        {
          type: 'html',
          html: `
<p>高次多项式插值会出现 Runge 现象（区间边缘剧烈振荡），因此实际计算常用<strong>分段低次插值</strong>。</p>
<h3>分段线性插值</h3>
<p>在每个小区间 [x<sub>i</sub>, x<sub>i+1</sub>] 上用直线连接两点。计算简单、不会振荡，但曲线在节点处不可导，光滑性差。</p>
<h3>三次样条插值</h3>
<p>在每个小区间上构造三次多项式 S(x)，并满足：</p>
<ol>
<li>S(x<sub>i</sub>) = y<sub>i</sub>；</li>
<li>S、S′、S″ 在内部节点连续；</li>
<li>边界条件：自然边界 S″(x<sub>0</sub>)=S″(x<sub>n</sub>)=0，或给定端点一阶导数 / 周期边界。</li>
</ol>
<p>三次样条具有二阶连续导数，光滑性好，且不会出现高次插值的振荡。其构造归结为解一个三对角线性方程组（用追赶法求解）。</p>
<div class="callout key">
<p class="callout-h">选择建议</p>
<p>节点少且函数光滑：可用 Lagrange / Newton；节点多：用分段线性 / 三次样条；需要导数连续：Hermite 或样条。高次（n 较大）Lagrange 插值一般不用。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-6',
      heading: '1.6 插值余项与 Runge 现象',
      blocks: [
        {
          type: 'html',
          html: `
<p>插值余项的统一形式：</p>
<div class="formula"><p>R<sub>n</sub>(x) = f<sup>(n+1)</sup>(ξ)/(n+1)! · ∏<sub>i=0</sub><sup>n</sup>(x − x<sub>i</sub>)</p></div>
<p>误差上界可用 |f<sup>(n+1)</sup>(x)| 的最大值 M<sub>n+1</sub> 估计：</p>
<div class="formula"><p>|R<sub>n</sub>(x)| ≤ M<sub>n+1</sub>/(n+1)! · |ω<sub>n+1</sub>(x)|</p></div>
<h3>Runge 现象</h3>
<p>对 f(x) = 1/(1+x²) 在 [−5,5] 上取等距节点作高次 Lagrange 插值，随着节点数增加，区间边缘的插值误差不降反增，出现剧烈振荡——这就是 Runge 现象。</p>
<p>原因：高次多项式的导数增长很快，且等距节点下 ω<sub>n+1</sub>(x) 在边缘很大。解决办法：</p>
<ul>
<li>使用分段低次插值或三次样条；</li>
<li>使用 Chebyshev 节点（节点向区间两端加密）；</li>
<li>避免使用过高次数的多项式。</li>
</ul>
`,
        },
      ],
    },
  ],
};

export default deck1;

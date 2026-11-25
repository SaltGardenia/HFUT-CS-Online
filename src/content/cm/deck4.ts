import type { DeckData } from '../types';

/** 第4章 方程求根的迭代法 —— 课件 PPT-2024/第4章 */
const deck4: DeckData = {
  id: 'deck4',
  no: '第4章',
  title: '方程求根的迭代法',
  subtitle: '二分法 · 不动点迭代 · 收敛性与收敛阶 · Newton 法 · 弦截法',
  lede:
    '求非线性方程 f(x)=0 的根，除少数情形外没有求根公式，只能用迭代法逐次逼近。本章介绍二分法、不动点迭代及其收敛性判定、Newton 法与弦截法，并比较它们的收敛速度与适用条件。',
  toc: [
    { id: 'sec-4-1', text: '4.1 二分法', level: 2 },
    { id: 'sec-4-2', text: '4.2 不动点迭代与收敛性', level: 2 },
    { id: 'sec-4-3', text: '4.3 Newton 法', level: 2 },
    { id: 'sec-4-4', text: '4.4 弦截法与加速方法', level: 2 },
  ],
  sections: [
    {
      id: 'sec-4-1',
      heading: '4.1 二分法',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 f∈C[a,b] 且 f(a)·f(b) &lt; 0，由零点定理，[a,b] 内至少有一个根。二分法每次取中点 x<sub>m</sub>=(a+b)/2，判断根在哪个半区间，反复缩小区间。</p>
<pre class="code"><code>while (b - a) / 2 > tol:
    xm = (a + b) / 2
    if f(xm) == 0: break
    if f(a) * f(xm) < 0: b = xm
    else: a = xm</code></pre>
<p>经过 n 次二分，区间长度为 (b−a)/2<sup>n</sup>，误差不超过 (b−a)/2<sup>n+1</sup>。二分法<strong>必然收敛</strong>，但只利用函数值的符号，收敛速度为线性（误差每次减半），且不能求偶数重根。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-2',
      heading: '4.2 不动点迭代与收敛性',
      blocks: [
        {
          type: 'html',
          html: `
<p>把 f(x)=0 改写为 x = φ(x)，构造迭代</p>
<div class="formula"><p>x<sub>k+1</sub> = φ(x<sub>k</sub>)　（k=0,1,2,…）</p></div>
<p>若序列收敛到 x*，且 φ 连续，则 x* = φ(x*)，即 x* 为 φ 的不动点，也是 f 的根。</p>
<h3>收敛性定理</h3>
<p>若 φ 在 [a,b] 上满足：</p>
<ol>
<li>∀x∈[a,b]，φ(x)∈[a,b]（自映射）；</li>
<li>存在 L&lt;1，使 ∀x,y∈[a,b]，|φ(x)−φ(y)| ≤ L|x−y|（压缩映射），</li>
</ol>
<p>则对任意初值 x<sub>0</sub>∈[a,b]，迭代收敛到唯一不动点，且有误差估计</p>
<div class="formula"><p>|x<sub>k</sub> − x*| ≤ L<sup>k</sup>/(1−L) · |x<sub>1</sub> − x<sub>0</sub>|</p></div>
<p>若 φ 在 x* 附近可导，则 |φ′(x*)|&lt;1 时局部收敛；|φ′(x*)|&gt;1 时发散。收敛阶：若 φ′(x*)≠0，为线性收敛；若 φ′(x*)=…=φ<sup>(p−1)</sup>(x*)=0 且 φ<sup>(p)</sup>(x*)≠0，则为 p 阶收敛。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-3',
      heading: '4.3 Newton 法',
      blocks: [
        {
          type: 'html',
          html: `
<p>取迭代函数</p>
<div class="formula"><p>φ(x) = x − f(x)/f′(x)</p></div>
<p>得到 <strong>Newton 迭代公式</strong>：</p>
<div class="formula"><p>x<sub>k+1</sub> = x<sub>k</sub> − f(x<sub>k</sub>)/f′(x<sub>k</sub>)</p></div>
<p>几何意义：用 x<sub>k</sub> 处的切线与 x 轴的交点作为下一次近似。</p>
<h3>收敛性</h3>
<p>若 f′(x*)≠0，f″ 连续，则 Newton 法在 x* 附近<strong>平方收敛</strong>（二阶）。但要求初值足够接近根；f′(x<sub>k</sub>)=0 时失效；对重根收敛退化为线性（可用修正 Newton 法 x<sub>k+1</sub>=x<sub>k</sub>−m·f/f′，m 为重数）。</p>
<div class="callout key">
<p class="callout-h">Newton 法的优缺点</p>
<p>优点：收敛快（二阶），是求根的主流方法；缺点：需计算导数 f′，每步计算量大，初值敏感，可能发散或循环。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-4-4',
      heading: '4.4 弦截法与加速方法',
      blocks: [
        {
          type: 'html',
          html: `
<h3>弦截法（割线法）</h3>
<p>用差商代替 Newton 法中的导数：</p>
<div class="formula"><p>x<sub>k+1</sub> = x<sub>k</sub> − f(x<sub>k</sub>)·(x<sub>k</sub> − x<sub>k−1</sub>) / (f(x<sub>k</sub>) − f(x<sub>k−1</sub>))</p></div>
<p>不需要计算导数，但需要两个初值；收敛阶约为 1.618（超线性），略慢于 Newton 法。</p>
<h3>Steffensen 加速</h3>
<p>对线性收敛的不动点迭代，用 Aitken Δ² 加速：</p>
<div class="formula"><p>x̂<sub>k</sub> = x<sub>k</sub> − (x<sub>k+1</sub> − x<sub>k</sub>)² / (x<sub>k+2</sub> − 2x<sub>k+1</sub> + x<sub>k</sub>)</p></div>
<p>可把线性收敛加速为平方收敛。</p>
<table class="tbl">
<thead><tr><th>方法</th><th>收敛阶</th><th>是否需要导数</th><th>初值要求</th></tr></thead>
<tbody>
<tr><td>二分法</td><td>1（线性）</td><td>否</td><td>需变号区间</td></tr>
<tr><td>不动点迭代</td><td>取决于 φ</td><td>否</td><td>压缩映射</td></tr>
<tr><td>Newton 法</td><td>2（平方）</td><td>是</td><td>接近根</td></tr>
<tr><td>弦截法</td><td>≈1.618</td><td>否</td><td>两个初值</td></tr>
</tbody>
</table>
`,
        },
      ],
    },
  ],
};

export default deck4;

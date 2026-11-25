import type { DeckData } from '../types';

/** 第2章 数值积分 —— 课件 PPT-2024/第2章 数值积分-1～2 */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: '数值积分',
  subtitle: 'Newton-Cotes 公式 · 梯形 / Simpson · 复化求积 · 余项 · Romberg 积分 · Gauss 求积',
  lede:
    '数值积分用节点上的函数值加权求和近似定积分。本章介绍插值型求积公式的构造、Newton-Cotes 公式（梯形、Simpson、Cotes）、复化求积与余项、Romberg 加速，以及代数精度最高的 Gauss 求积。',
  toc: [
    { id: 'sec-2-1', text: '2.1 插值型求积与 Newton-Cotes 公式', level: 2 },
    { id: 'sec-2-2', text: '2.2 梯形公式与 Simpson 公式', level: 2 },
    { id: 'sec-2-3', text: '2.3 复化求积与余项', level: 2 },
    { id: 'sec-2-4', text: '2.4 Romberg 积分与 Gauss 求积', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2.1 插值型求积与 Newton-Cotes 公式',
      blocks: [
        {
          type: 'html',
          html: `
<p>用插值多项式 L<sub>n</sub>(x) 近似 f(x)，积分得</p>
<div class="formula"><p>∫<sub>a</sub><sup>b</sup> f(x)dx ≈ Σ<sub>i=0</sub><sup>n</sup> A<sub>i</sub> f(x<sub>i</sub>)，A<sub>i</sub> = ∫<sub>a</sub><sup>b</sup> l<sub>i</sub>(x)dx</p></div>
<p>称为<strong>插值型求积公式</strong>，A<sub>i</sub> 为求积系数。</p>
<p>将 [a,b] 等分，x<sub>i</sub> = a + ih，h = (b−a)/n，则得到 <strong>Newton-Cotes 公式</strong>：</p>
<div class="formula"><p>∫<sub>a</sub><sup>b</sup> f(x)dx ≈ (b−a) Σ<sub>i=0</sub><sup>n</sup> C<sub>i</sub><sup>(n)</sup> f(x<sub>i</sub>)</p></div>
<p>C<sub>i</sub><sup>(n)</sup> 为 Cotes 系数，满足 ΣC<sub>i</sub><sup>(n)</sup> = 1。</p>
<h3>代数精度</h3>
<p>若求积公式对次数不超过 m 的多项式都精确成立，而对 m+1 次不精确，则称其<strong>代数精度为 m</strong>。n+1 个节点的插值型求积公式至少具有 n 次代数精度。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2.2 梯形公式与 Simpson 公式',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>公式</th><th>表达式</th><th>余项</th><th>代数精度</th></tr></thead>
<tbody>
<tr><td>梯形</td><td>(b−a)/2 · [f(a)+f(b)]</td><td>−(b−a)³/12 · f″(ξ)</td><td>1</td></tr>
<tr><td>Simpson</td><td>(b−a)/6 · [f(a)+4f((a+b)/2)+f(b)]</td><td>−(b−a)⁵/2880 · f<sup>(4)</sup>(ξ)</td><td>3</td></tr>
<tr><td>Cotes (n=4)</td><td>(b−a)/90 · [7f<sub>0</sub>+32f<sub>1</sub>+12f<sub>2</sub>+32f<sub>3</sub>+7f<sub>4</sub>]</td><td>—</td><td>5</td></tr>
</tbody>
</table>
<p>当 n 为偶数时，Newton-Cotes 公式的代数精度可达到 n+1。Simpson 公式用三个节点（含中点），代数精度为 3。</p>
<div class="callout key">
<p class="callout-h">几何意义</p>
<p>梯形公式用直线代替曲线；Simpson 公式用抛物线代替曲线，因此精度更高。实际计算中通常把区间分成若干小区间，在每段上用低阶公式再求和（复化）。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2.3 复化求积与余项',
      blocks: [
        {
          type: 'html',
          html: `
<p>把 [a,b] 等分为 n 个子区间，步长 h = (b−a)/n，x<sub>i</sub> = a+ih。</p>
<h3>复化梯形公式</h3>
<div class="formula"><p>T<sub>n</sub> = h/2 · [f(a) + 2Σ<sub>i=1</sub><sup>n−1</sup> f(x<sub>i</sub>) + f(b)]</p></div>
<div class="formula"><p>R<sub>T</sub> = −(b−a)/12 · h² · f″(ξ)</p></div>
<h3>复化 Simpson 公式</h3>
<div class="formula"><p>S<sub>n</sub> = h/6 · [f(a) + 4Σ<sub>i=0</sub><sup>n−1</sup> f(x<sub>i+1/2</sub>) + 2Σ<sub>i=1</sub><sup>n−1</sup> f(x<sub>i</sub>) + f(b)]</p></div>
<div class="formula"><p>R<sub>S</sub> = −(b−a)/180 · (h/2)⁴ · f<sup>(4)</sup>(ξ)</p></div>
<p>复化梯形误差为 O(h²)，复化 Simpson 为 O(h⁴)。当 f″ 或 f<sup>(4)</sup> 变化不大时，可用余项估计所需步长；二分步长可用 <strong>Runge 事后误差估计</strong>：|I − T<sub>2n</sub>| ≈ |T<sub>2n</sub> − T<sub>n</sub>|/3。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2.4 Romberg 积分与 Gauss 求积',
      blocks: [
        {
          type: 'html',
          html: `
<h3>Romberg 积分</h3>
<p>由复化梯形公式的误差展开，用 Richardson 外推消去低阶误差项：</p>
<div class="formula"><p>T<sub>m,k</sub> = (4<sup>k</sup> T<sub>m,k−1</sub> − T<sub>m−1,k−1</sub>) / (4<sup>k</sup> − 1)</p></div>
<p>其中 T<sub>m,0</sub> 为步长 h<sub>m</sub>=(b−a)/2<sup>m</sup> 的复化梯形值。Romberg 表逐行加密、逐列加速，收敛快，便于程序实现。</p>
<h3>Gauss 求积</h3>
<p>选择节点与权，使求积公式的代数精度尽可能高。n+1 个节点的 Gauss 公式具有 <strong>2n+1 次代数精度</strong>，节点为 Legendre 多项式的零点。</p>
<div class="formula"><p>∫<sub>−1</sub><sup>1</sup> f(x)dx ≈ Σ<sub>i=0</sub><sup>n</sup> A<sub>i</sub> f(x<sub>i</sub>)</p></div>
<p>常用两点 Gauss：x = ±1/√3，A<sub>i</sub>=1；三点 Gauss：x = 0, ±√(3/5)，权 8/9, 5/9。区间 [a,b] 需作线性变换 t = (2x−a−b)/(b−a)。</p>
<div class="callout key">
<p class="callout-h">方法比较</p>
<p>梯形 / Simpson 节点等距、实现简单；Romberg 通过外推快速提高精度；Gauss 在节点数相同时代数精度最高，但节点不等距、需查表。考试常考：复化梯形 / Simpson 的计算与余项、代数精度判定。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;

import type { DeckData } from '../types';

/** 第4章 随机变量的数字特征 —— 课件 4-2 方差、4-5 矩 */
const deck4: DeckData = {
  id: 'deck4',
  no: '第4章',
  title: '随机变量的数字特征',
  subtitle: '数学期望 · 方差 · 协方差与相关系数 · 矩 · 常见分布的期望与方差',
  lede:
    '分布函数完整描述随机变量，但实际问题常只需几个特征数。本章讨论数学期望、方差、协方差与相关系数、矩，给出它们的性质与计算公式，并汇总常见分布的期望与方差。',
  toc: [
    { id: 'sec-4-1', text: '4.1 数学期望', level: 2 },
    { id: 'sec-4-2', text: '4.2 方差', level: 2 },
    { id: 'sec-4-3', text: '4.3 协方差与相关系数', level: 2 },
    { id: 'sec-4-4', text: '4.4 矩与常见分布汇总', level: 2 },
  ],
  sections: [
    {
      id: 'sec-4-1',
      heading: '4.1 数学期望',
      blocks: [
        {
          type: 'html',
          html: `
<p>离散型：E(X)=Σ x<sub>k</sub>p<sub>k</sub>（绝对收敛时）；连续型：E(X)=∫<sub>−∞</sub><sup>+∞</sup> x f(x)dx。</p>
<p>随机变量函数 Y=g(X) 的期望：E[g(X)]=Σg(x<sub>k</sub>)p<sub>k</sub> 或 ∫g(x)f(x)dx（无需求 Y 的分布）。</p>
<p>性质：</p>
<ul>
<li>E(C)=C；E(CX)=C·E(X)；</li>
<li>E(X+Y)=E(X)+E(Y)（无需独立）；</li>
<li>若 X、Y 独立，则 E(XY)=E(X)E(Y)；</li>
<li>E(aX+b)=aE(X)+b。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-4-2',
      heading: '4.2 方差',
      blocks: [
        {
          type: 'html',
          html: `
<p>方差刻画随机变量取值与其均值（期望）之间的偏离程度：</p>
<div class="formula"><p>D(X) = E{[X−E(X)]²} = E(X²) − [E(X)]²</p></div>
<p>标准差 σ(X)=√D(X)。</p>
<p>性质：</p>
<ul>
<li>D(C)=0；D(CX)=C²D(X)；</li>
<li>D(X+a)=D(X)；</li>
<li>若 X、Y 独立，则 D(X±Y)=D(X)+D(Y)；</li>
<li>D(X)=0 ⇔ X 以概率 1 取常数。</li>
</ul>
<p>常用计算式：D(X)=E(X²)−μ²，其中 μ=E(X)。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-3',
      heading: '4.3 协方差与相关系数',
      blocks: [
        {
          type: 'html',
          html: `
<div class="formula"><p>Cov(X,Y) = E{[X−E(X)][Y−E(Y)]} = E(XY) − E(X)E(Y)</p></div>
<div class="formula"><p>ρ<sub>XY</sub> = Cov(X,Y) / (√D(X)·√D(Y))</p></div>
<p>协方差性质：Cov(X,X)=D(X)；Cov(X,Y)=Cov(Y,X)；Cov(aX+b, cY+d)=ac·Cov(X,Y)；Cov(X+Y,Z)=Cov(X,Z)+Cov(Y,Z)。</p>
<p>相关系数 ρ<sub>XY</sub> ∈ [−1,1]。ρ=±1 表示 X、Y 以概率 1 线性相关；ρ=0 称不相关。独立 ⇒ 不相关，反之不成立（正态分布除外）。</p>
<p>D(X±Y)=D(X)+D(Y)±2Cov(X,Y)；当 X、Y 不相关时 Cov=0，方差可加。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-4',
      heading: '4.4 矩与常见分布汇总',
      blocks: [
        {
          type: 'html',
          html: `
<p>k 阶原点矩：E(X<sup>k</sup>)；k 阶中心矩：E{[X−E(X)]<sup>k</sup>}。期望是一阶原点矩，方差是二阶中心矩。混合矩：E(X<sup>k</sup>Y<sup>l</sup>)。</p>
<table class="tbl">
<thead><tr><th>分布</th><th>E(X)</th><th>D(X)</th></tr></thead>
<tbody>
<tr><td>0-1 分布 B(1,p)</td><td>p</td><td>p(1−p)</td></tr>
<tr><td>二项分布 B(n,p)</td><td>np</td><td>np(1−p)</td></tr>
<tr><td>泊松分布 P(λ)</td><td>λ</td><td>λ</td></tr>
<tr><td>几何分布 G(p)</td><td>1/p</td><td>(1−p)/p²</td></tr>
<tr><td>均匀分布 U(a,b)</td><td>(a+b)/2</td><td>(b−a)²/12</td></tr>
<tr><td>指数分布 E(λ)</td><td>1/λ</td><td>1/λ²</td></tr>
<tr><td>正态分布 N(μ,σ²)</td><td>μ</td><td>σ²</td></tr>
</tbody>
</table>
<div class="callout key">
<p class="callout-h">切比雪夫不等式</p>
<p>对任意 ε&gt;0，P{|X−E(X)| ≥ ε} ≤ D(X)/ε²。它不依赖具体分布，用于估计偏离均值的概率，也是大数定律的证明工具。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck4;

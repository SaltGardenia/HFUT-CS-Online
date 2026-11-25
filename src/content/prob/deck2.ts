import type { DeckData } from '../types';

/** 第2章 一维随机变量及其分布 —— 课件 2-1、第二章（1-2）（3-4） */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: '一维随机变量及其分布',
  subtitle: '分布函数 · 离散型与连续型 · 常见分布 · 随机变量函数的分布',
  lede:
    '随机变量把样本点映射为实数，使概率问题可以用函数工具研究。本章定义分布函数，讨论离散型随机变量的分布律与连续型随机变量的概率密度，列出 0-1、二项、泊松、几何、超几何、均匀、指数、正态等常见分布，并给出随机变量函数的分布求法。',
  toc: [
    { id: 'sec-2-1', text: '2.1 随机变量与分布函数', level: 2 },
    { id: 'sec-2-2', text: '2.2 离散型随机变量与常见分布', level: 2 },
    { id: 'sec-2-3', text: '2.3 连续型随机变量与常见分布', level: 2 },
    { id: 'sec-2-4', text: '2.4 随机变量函数的分布', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2.1 随机变量与分布函数',
      blocks: [
        {
          type: 'html',
          html: `
<p>随机变量 X 是定义在样本空间 Ω 上的实值函数。分布函数</p>
<div class="formula"><p>F(x) = P{X ≤ x}　（−∞ &lt; x &lt; +∞）</p></div>
<p>性质：</p>
<ul>
<li>单调不减；</li>
<li>右连续；</li>
<li>F(−∞)=0，F(+∞)=1；</li>
<li>P{a &lt; X ≤ b} = F(b) − F(a)。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2.2 离散型随机变量与常见分布',
      blocks: [
        {
          type: 'html',
          html: `
<p>离散型随机变量取有限或可列个值，分布律 p<sub>k</sub> = P{X=x<sub>k</sub>}，满足 p<sub>k</sub>≥0、Σp<sub>k</sub>=1。F(x) 为阶梯函数。</p>
<table class="tbl">
<thead><tr><th>分布</th><th>分布律</th><th>背景</th></tr></thead>
<tbody>
<tr><td>0-1 分布</td><td>P{X=1}=p，P{X=0}=1−p</td><td>一次伯努利试验</td></tr>
<tr><td>二项分布 B(n,p)</td><td>P{X=k}=C(n,k)p<sup>k</sup>(1−p)<sup>n−k</sup></td><td>n 重伯努利试验成功次数</td></tr>
<tr><td>泊松分布 P(λ)</td><td>P{X=k}=λ<sup>k</sup>e<sup>−λ</sup>/k!</td><td>稀有事件计数；二项近似</td></tr>
<tr><td>几何分布 G(p)</td><td>P{X=k}=(1−p)<sup>k−1</sup>p</td><td>首次成功所需试验次数</td></tr>
<tr><td>超几何分布</td><td>P{X=k}=C(M,k)C(N−M,n−k)/C(N,n)</td><td>无放回抽样</td></tr>
</tbody>
</table>
<p>泊松定理：当 n 很大、p 很小、np→λ 时，B(n,p) 近似 P(λ)，P{X=k}≈λ<sup>k</sup>e<sup>−λ</sup>/k!。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2.3 连续型随机变量与常见分布',
      blocks: [
        {
          type: 'html',
          html: `
<p>若存在非负可积函数 f(x)，使 F(x)=∫<sub>−∞</sub><sup>x</sup> f(t)dt，则称 X 为连续型随机变量，f 为概率密度。性质：f(x)≥0；∫<sub>−∞</sub><sup>+∞</sup>f(x)dx=1；P{a&lt;X≤b}=∫<sub>a</sub><sup>b</sup>f(x)dx；连续型随机变量取单点概率为 0。</p>
<table class="tbl">
<thead><tr><th>分布</th><th>密度 / 区间</th><th>说明</th></tr></thead>
<tbody>
<tr><td>均匀分布 U(a,b)</td><td>f(x)=1/(b−a)，a&lt;x&lt;b</td><td>等可能落在区间</td></tr>
<tr><td>指数分布 E(λ)</td><td>f(x)=λe<sup>−λx</sup>，x&gt;0</td><td>无记忆性</td></tr>
<tr><td>正态分布 N(μ,σ²)</td><td>f(x)=1/(√(2π)σ)·e<sup>−(x−μ)²/(2σ²)</sup></td><td>标准化 Z=(X−μ)/σ ~ N(0,1)</td></tr>
</tbody>
</table>
<p>正态分布的 3σ 原则：P{|X−μ|&lt;σ}≈0.6826，&lt;2σ≈0.9544，&lt;3σ≈0.9974。标准正态分布函数 Φ(x) 可查表，Φ(−x)=1−Φ(x)。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2.4 随机变量函数的分布',
      blocks: [
        {
          type: 'html',
          html: `
<p>已知 X 的分布，求 Y=g(X) 的分布。</p>
<ul>
<li><strong>离散型</strong>：列出 Y 的可能取值，合并对应概率；</li>
<li><strong>连续型（分布函数法）</strong>：先求 F<sub>Y</sub>(y)=P{g(X)≤y}，再对 y 求导得密度；</li>
<li><strong>单调可导情形</strong>：若 g 严格单调、反函数 h，则 f<sub>Y</sub>(y)=f<sub>X</sub>(h(y))·|h′(y)|。</li>
</ul>
<p>例：X~N(μ,σ²)，则 Y=aX+b ~ N(aμ+b, a²σ²)（a≠0）。特别地，(X−μ)/σ ~ N(0,1)。</p>
<div class="callout warn">
<p class="callout-h">注意</p>
<p>连续型随机变量函数的密度公式要求 g 单调；非单调时应分段用分布函数法，不能直接套公式。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;

import type { DeckData } from '../types';

/** 第6章 数理统计的基础知识 —— 课件 6-1 数理统计的基本概念 */
const deck6: DeckData = {
  id: 'deck6',
  no: '第6章',
  title: '数理统计的基础知识',
  subtitle: '总体与样本 · 统计量 · 抽样分布 · χ² / t / F 分布 · 参数估计初步',
  lede:
    '数理统计从样本推断总体。本章介绍总体、个体、样本与统计量的概念，常用统计量（样本均值、样本方差、极值、经验分布函数），以及正态总体下的三大抽样分布 χ²、t、F，为参数估计与假设检验打基础。',
  toc: [
    { id: 'sec-6-1', text: '6.1 总体、样本与统计量', level: 2 },
    { id: 'sec-6-2', text: '6.2 常用统计量与经验分布', level: 2 },
    { id: 'sec-6-3', text: '6.3 抽样分布：χ²、t、F', level: 2 },
    { id: 'sec-6-4', text: '6.4 参数估计初步', level: 2 },
  ],
  sections: [
    {
      id: 'sec-6-1',
      heading: '6.1 总体、样本与统计量',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>总体</strong>是研究对象的全体（其分布称为总体分布）；<strong>个体</strong>是每个对象。<strong>样本</strong> X<sub>1</sub>,…,X<sub>n</sub> 是从总体中抽取的 n 个个体，n 为样本容量。简单随机样本要求：独立、同分布（与总体同分布）。</p>
<p><strong>统计量</strong>是样本的函数，不含任何未知参数。例如样本均值、样本方差、样本极值。统计量的分布称为<strong>抽样分布</strong>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-2',
      heading: '6.2 常用统计量与经验分布',
      blocks: [
        {
          type: 'html',
          html: `
<div class="formula"><p>样本均值 X̄ = (1/n)ΣX<sub>i</sub></p></div>
<div class="formula"><p>样本方差 S² = 1/(n−1) · Σ(X<sub>i</sub>−X̄)²</p></div>
<p>（除以 n−1 是为了无偏；样本二阶中心矩为 (1/n)Σ(X<sub>i</sub>−X̄)²。）</p>
<p>样本 k 阶原点矩 A<sub>k</sub>=(1/n)ΣX<sub>i</sub><sup>k</sup>；样本 k 阶中心矩 B<sub>k</sub>=(1/n)Σ(X<sub>i</sub>−X̄)<sup>k</sup>。</p>
<p><strong>经验分布函数</strong> F<sub>n</sub>(x) = (1/n)·#{X<sub>i</sub> ≤ x}，它是总体分布函数 F(x) 的相合估计（格利文科定理）。</p>
<p>样本均值的期望与方差：E(X̄)=μ，D(X̄)=σ²/n。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-3',
      heading: '6.3 抽样分布：χ²、t、F',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 X<sub>1</sub>,…,X<sub>n</sub> 来自 N(μ,σ²) 的样本。</p>
<h3>χ² 分布</h3>
<p>若 Z<sub>1</sub>,…,Z<sub>n</sub> 独立同服从 N(0,1)，则 χ² = ΣZ<sub>i</sub>² ~ χ²(n)（自由度为 n）。期望 n，方差 2n。</p>
<div class="formula"><p>(n−1)S²/σ² ~ χ²(n−1)</p></div>
<h3>t 分布</h3>
<p>若 Z~N(0,1)，Y~χ²(n)，且 Z、Y 独立，则 T = Z/√(Y/n) ~ t(n)。t 分布关于 0 对称，n→∞ 时趋于 N(0,1)。</p>
<div class="formula"><p>(X̄ − μ) / (S/√n) ~ t(n−1)</p></div>
<h3>F 分布</h3>
<p>若 U~χ²(n<sub>1</sub>)、V~χ²(n<sub>2</sub>) 且独立，则 F=(U/n<sub>1</sub>)/(V/n<sub>2</sub>) ~ F(n<sub>1</sub>,n<sub>2</sub>)。性质：1/F ~ F(n<sub>2</sub>,n<sub>1</sub>)。</p>
<div class="formula"><p>(S<sub>1</sub>²/σ<sub>1</sub>²) / (S<sub>2</sub>²/σ<sub>2</sub>²) ~ F(n<sub>1</sub>−1, n<sub>2</sub>−1)</p></div>
<p>三大分布的分位数可查表；实际计算中常用对称性与倒数关系。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-4',
      heading: '6.4 参数估计初步',
      blocks: [
        {
          type: 'html',
          html: `
<h3>矩估计</h3>
<p>用样本矩代替总体矩，解出参数。例如正态总体：μ̂ = X̄，σ̂² = (1/n)Σ(X<sub>i</sub>−X̄)²。</p>
<h3>最大似然估计</h3>
<p>构造似然函数 L(θ)=∏f(x<sub>i</sub>;θ)，取使 L 最大的 θ̂。常对 ln L 求导令其为 0。</p>
<h3>估计量的评价标准</h3>
<ul>
<li><strong>无偏性</strong>：E(θ̂)=θ；</li>
<li><strong>有效性</strong>：方差越小越有效；</li>
<li><strong>一致性（相合性）</strong>：n→∞ 时 θ̂ 依概率收敛于 θ。</li>
</ul>
<h3>区间估计</h3>
<p>正态总体均值 μ 的置信区间（σ 未知）：X̄ ± t<sub>α/2</sub>(n−1)·S/√n；σ 已知时用 Z<sub>α/2</sub>·σ/√n。置信度 1−α 表示区间包含真值的概率。</p>
<div class="callout key">
<p class="callout-h">本章定位</p>
<p>本章是概率论向统计推断的过渡：样本与统计量 → 抽样分布 → 参数估计。后续假设检验、方差分析、回归分析都建立在这些概念上。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck6;

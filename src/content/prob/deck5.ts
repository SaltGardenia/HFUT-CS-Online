import type { DeckData } from '../types';

/** 第5章 大数定律与中心极限定理 */
const deck5: DeckData = {
  id: 'deck5',
  no: '第5章',
  title: '大数定律与中心极限定理',
  subtitle: '切比雪夫不等式 · 伯努利 / 辛钦大数定律 · 林德伯格-列维定理 · 棣莫弗-拉普拉斯定理',
  lede:
    '大数定律说明大量独立重复试验中频率稳定于概率、样本均值稳定于期望；中心极限定理说明大量独立随机变量之和近似服从正态分布。两者是概率论与数理统计之间的桥梁，也是用正态分布做近似计算的理论依据。',
  toc: [
    { id: 'sec-5-1', text: '5.1 切比雪夫不等式', level: 2 },
    { id: 'sec-5-2', text: '5.2 大数定律', level: 2 },
    { id: 'sec-5-3', text: '5.3 中心极限定理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-5-1',
      heading: '5.1 切比雪夫不等式',
      blocks: [
        {
          type: 'html',
          html: `
<div class="formula"><p>P{|X − E(X)| ≥ ε} ≤ D(X) / ε²　（ε &gt; 0）</p></div>
<p>等价形式：P{|X − E(X)| &lt; ε} ≥ 1 − D(X)/ε²。它说明方差越小，X 越集中在期望附近。该不等式对任意分布成立，但估计较粗糙。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-2',
      heading: '5.2 大数定律',
      blocks: [
        {
          type: 'html',
          html: `
<h3>切比雪夫大数定律</h3>
<p>设 X<sub>1</sub>, X<sub>2</sub>, … 相互独立，方差一致有界（D(X<sub>i</sub>)≤C），则对任意 ε&gt;0，</p>
<div class="formula"><p>lim<sub>n→∞</sub> P{|(1/n)ΣX<sub>i</sub> − (1/n)ΣE(X<sub>i</sub>)| &lt; ε} = 1</p></div>
<p>即样本均值依概率收敛于期望均值。</p>
<h3>伯努利大数定律</h3>
<p>n 重伯努利试验中，事件 A 发生次数 n<sub>A</sub>，频率 n<sub>A</sub>/n 依概率收敛于概率 p：</p>
<div class="formula"><p>lim<sub>n→∞</sub> P{|n<sub>A</sub>/n − p| &lt; ε} = 1</p></div>
<p>这是「频率稳定于概率」的严格表述。</p>
<h3>辛钦大数定律</h3>
<p>设 X<sub>1</sub>, X<sub>2</sub>, … 独立同分布，E(X<sub>i</sub>)=μ 存在，则 (1/n)ΣX<sub>i</sub> 依概率收敛于 μ（不要求方差存在）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-3',
      heading: '5.3 中心极限定理',
      blocks: [
        {
          type: 'html',
          html: `
<h3>林德伯格-列维定理</h3>
<p>设 X<sub>1</sub>, X<sub>2</sub>, … 独立同分布，E(X<sub>i</sub>)=μ，D(X<sub>i</sub>)=σ²&gt;0，则</p>
<div class="formula"><p>(ΣX<sub>i</sub> − nμ) / (σ√n) → N(0,1)（依分布收敛）</p></div>
<p>即当 n 充分大时，ΣX<sub>i</sub> 近似 N(nμ, nσ²)，样本均值 X̄ 近似 N(μ, σ²/n)。</p>
<h3>棣莫弗-拉普拉斯定理</h3>
<p>二项分布 B(n,p) 当 n 充分大时近似正态：</p>
<div class="formula"><p>ΣX<sub>i</sub> ~ N(np, np(1−p))；P{a ≤ ΣX<sub>i</sub> ≤ b} ≈ Φ((b−np)/√(np(1−p))) − Φ((a−np)/√(np(1−p)))</p></div>
<p>实际计算中常加连续性修正（±0.5）。</p>
<div class="callout key">
<p class="callout-h">应用</p>
<p>用正态近似计算二项分布、泊松分布的概率；估计样本量；说明测量误差、保险赔付等近似正态。考试常考：标准化、查 Φ 表、连续性修正。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck5;

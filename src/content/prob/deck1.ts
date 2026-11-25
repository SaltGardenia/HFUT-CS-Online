import type { DeckData } from '../types';

/** 第1章 随机事件及其概率 —— 课件 PPT/第一章（1-2）（3-4）、绪论 */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1章',
  title: '随机事件及其概率',
  subtitle: '样本空间 · 事件关系与运算 · 古典概型 · 条件概率 · 全概率与贝叶斯 · 独立性',
  lede:
    '概率论研究随机现象的数量规律。本章建立随机试验、样本空间与随机事件的概念，讨论事件的关系与运算、概率的公理化定义与性质，给出古典概型、几何概型的计算，以及条件概率、乘法公式、全概率公式、贝叶斯公式和事件独立性。',
  toc: [
    { id: 'sec-1-1', text: '1.1 随机试验、样本空间与事件', level: 2 },
    { id: 'sec-1-2', text: '1.2 概率的定义与性质', level: 2 },
    { id: 'sec-1-3', text: '1.3 古典概型与几何概型', level: 2 },
    { id: 'sec-1-4', text: '1.4 条件概率与乘法公式', level: 2 },
    { id: 'sec-1-5', text: '1.5 全概率公式与贝叶斯公式', level: 2 },
    { id: 'sec-1-6', text: '1.6 事件的独立性', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '1.1 随机试验、样本空间与事件',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>随机试验</strong> E 满足：可在相同条件下重复进行；所有可能结果已知；每次试验前不能确定哪个结果出现。样本空间 Ω 是全部样本点的集合，样本点 ω 是基本结果。</p>
<p><strong>随机事件</strong>是 Ω 的子集。必然事件 Ω，不可能事件 ∅。事件的关系：</p>
<ul>
<li>包含 A⊂B；相等 A=B；</li>
<li>和事件 A∪B（至少一个发生）；积事件 A∩B（同时发生）；</li>
<li>差事件 A−B（A 发生而 B 不发生）；</li>
<li>互斥（互不相容）AB=∅；对立事件 Ā，A∪Ā=Ω 且 AĀ=∅。</li>
</ul>
	<p>运算律：交换律、结合律、分配律、德摩根律：<strong>非(A 或 B) = 非A 且 非B</strong>；<strong>非(A 且 B) = 非A 或 非B</strong>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '1.2 概率的定义与性质',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>公理化定义</strong>：设 Ω 为样本空间，对每个事件 A 赋一个实数 P(A)，满足</p>
<ol>
<li>非负性：P(A) ≥ 0；</li>
<li>规范性：P(Ω) = 1；</li>
<li>可列可加性：若 A<sub>1</sub>, A<sub>2</sub>, … 两两互斥，则 P(∪A<sub>i</sub>) = ΣP(A<sub>i</sub>)。</li>
</ol>
<p>性质：P(∅)=0；P(Ā)=1−P(A)；若 A⊂B，则 P(B−A)=P(B)−P(A)，P(A)≤P(B)；加法公式 P(A∪B)=P(A)+P(B)−P(AB)；一般地 P(A∪B∪C)=ΣP(A)−ΣP(AB)+P(ABC)。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '1.3 古典概型与几何概型',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>古典概型</strong>：样本空间有限且每个基本事件等可能。此时</p>
<div class="formula"><p>P(A) = A 包含的基本事件数 / Ω 中基本事件总数</p></div>
<p>常用计数工具：加法原理、乘法原理、排列 P(n,r)、组合 C(n,r)、可重复排列、分组分配。</p>
<p><strong>几何概型</strong>：样本空间为可度量的几何区域，事件 A 的概率为</p>
<div class="formula"><p>P(A) = m(A) / m(Ω)（长度 / 面积 / 体积之比）</p></div>
<div class="callout key">
<p class="callout-h">典型问题</p>
<p>摸球问题（有放回 / 无放回）、生日问题、抽签公平性、会面问题（几何概型）、Buffon 投针。解题关键是正确构造样本空间并计数。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '1.4 条件概率与乘法公式',
      blocks: [
        {
          type: 'html',
          html: `
<p>在事件 B 发生的条件下，事件 A 的条件概率</p>
<div class="formula"><p>P(A|B) = P(AB) / P(B)　（P(B) &gt; 0）</p></div>
<p>乘法公式：P(AB) = P(A)P(B|A) = P(B)P(A|B)；多个事件：P(A<sub>1</sub>A<sub>2</sub>…A<sub>n</sub>) = P(A<sub>1</sub>)P(A<sub>2</sub>|A<sub>1</sub>)…P(A<sub>n</sub>|A<sub>1</sub>…A<sub>n−1</sub>)。</p>
<p>条件概率满足概率的三条公理，因此也具有 P(Ā|B)=1−P(A|B)、加法公式等性质。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '1.5 全概率公式与贝叶斯公式',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 B<sub>1</sub>, B<sub>2</sub>, …, B<sub>n</sub> 为 Ω 的一个划分（两两互斥、并为 Ω、P(B<sub>i</sub>)&gt;0），则</p>
<div class="formula"><p>全概率公式：P(A) = Σ<sub>i</sub> P(B<sub>i</sub>)P(A|B<sub>i</sub>)</p></div>
<div class="formula"><p>贝叶斯公式：P(B<sub>j</sub>|A) = P(B<sub>j</sub>)P(A|B<sub>j</sub>) / Σ<sub>i</sub>P(B<sub>i</sub>)P(A|B<sub>i</sub>)</p></div>
<p>全概率公式由「原因」推「结果」，贝叶斯公式由「结果」反推「原因」（后验概率）。P(B<sub>i</sub>) 为先验概率，P(B<sub>i</sub>|A) 为后验概率。</p>
<div class="callout key">
<p class="callout-h">解题步骤</p>
<p>先设事件并找完备事件组（划分），写出各先验概率与条件概率，再用全概率公式求总概率；若已知结果发生，用贝叶斯公式求某个原因的概率。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-6',
      heading: '1.6 事件的独立性',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 P(AB)=P(A)P(B)，则称 A、B 相互独立。独立与互斥不同：独立指一个事件发生不影响另一个的概率；互斥指不能同时发生（若 P(A)&gt;0、P(B)&gt;0，互斥必不独立）。</p>
<p>n 个事件相互独立要求：任意 k 个事件的积概率等于各自概率的积（k=2,…,n）。两两独立不能推出相互独立。</p>
<p>性质：若 A、B 独立，则 A 与 B̄、Ā 与 B、Ā 与 B̄ 也独立。独立性的应用：独立重复试验（伯努利试验）中，n 次试验恰有 k 次成功的概率为 C(n,k)p<sup>k</sup>(1−p)<sup>n−k</sup>。</p>
`,
        },
      ],
    },
  ],
};

export default deck1;

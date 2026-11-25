import type { DeckData } from '../types';

/** 第0章 引论 —— 课件 PPT-2024/第0章 引论-01 */
const deck0: DeckData = {
  id: 'deck0',
  no: '第0章',
  title: '引论：误差与算法',
  subtitle: '误差来源 · 绝对 / 相对误差 · 有效数字 · 截断与舍入 · 算法稳定性与收敛阶',
  lede:
    '计算方法研究用计算机求解数学问题的近似方法。由于模型近似、数据观测、截断与舍入，计算结果必然带有误差。本章讨论误差的来源与度量、有效数字、误差传播，以及算法的稳定性、收敛性与计算量，为后续各章建立误差分析的基本语言。',
  toc: [
    { id: 'sec-0-1', text: '0.1 误差的来源与度量', level: 2 },
    { id: 'sec-0-2', text: '0.2 有效数字与误差传播', level: 2 },
    { id: 'sec-0-3', text: '0.3 算法的稳定性与收敛性', level: 2 },
  ],
  sections: [
    {
      id: 'sec-0-1',
      heading: '0.1 误差的来源与度量',
      blocks: [
        {
          type: 'html',
          html: `
<p>误差来源主要有四类：</p>
<ol>
<li><strong>模型误差</strong>：数学模型对实际问题的近似；</li>
<li><strong>观测误差</strong>：测量数据本身的误差；</li>
<li><strong>截断误差</strong>：用有限过程代替无限过程（如用 Taylor 多项式近似函数）；</li>
<li><strong>舍入误差</strong>：计算机浮点数只能表示有限位，运算结果四舍五入。</li>
</ol>
<p>设精确值 x，近似值 x*：</p>
<div class="formula"><p>绝对误差 e = x* − x；绝对误差限 |e| ≤ ε</p></div>
<div class="formula"><p>相对误差 e<sub>r</sub> = (x* − x) / x ≈ (x* − x) / x*；相对误差限 ε<sub>r</sub> = ε / |x*|</p></div>
<p>相对误差更能反映近似程度，常用于比较不同量级的近似值。</p>
`,
        },
      ],
    },
    {
      id: 'sec-0-2',
      heading: '0.2 有效数字与误差传播',
      blocks: [
        {
          type: 'html',
          html: `
<p>若近似值 x* 的绝对误差限不超过某一位的半个单位，则称 x* 准确到该位。从第一个非零数字到该位为止的所有数字称为<strong>有效数字</strong>。</p>
<p>设 x* = ±0.d<sub>1</sub>d<sub>2</sub>…d<sub>n</sub>×10<sup>m</sup>（d<sub>1</sub>≠0），若</p>
<div class="formula"><p>|x* − x| ≤ 0.5×10<sup>m−n</sup></p></div>
<p>则称 x* 有 n 位有效数字。有效数字位数与相对误差限的关系：若 x* 有 n 位有效数字，则其相对误差限约为 0.5×10<sup>1−n</sup>。</p>
<h3>误差传播</h3>
<p>对一元函数 y = f(x)，由 Taylor 展开：</p>
<div class="formula"><p>Δy ≈ f′(x)·Δx</p></div>
<p>多元函数 y = f(x<sub>1</sub>,…,x<sub>n</sub>)：</p>
<div class="formula"><p>Δy ≈ Σ<sub>i</sub> (∂f/∂x<sub>i</sub>)·Δx<sub>i</sub></p></div>
<div class="callout warn">
<p class="callout-h">避免有效数字损失</p>
<p>两个相近数相减会严重损失有效数字（<em>相近数相减</em>）；除以很小的数、大数吃小数也会放大误差。计算中应改变公式以避免这类运算，例如把 √(x+1)−√x 改写为 1/(√(x+1)+√x)。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-0-3',
      heading: '0.3 算法的稳定性与收敛性',
      blocks: [
        {
          type: 'html',
          html: `
<h3>算法评价</h3>
<ul>
<li><strong>可靠性</strong>：能给出满足精度要求的结果；</li>
<li><strong>计算量</strong>：乘除法次数、函数调用次数等；</li>
<li><strong>存储量</strong>：所需内存；</li>
<li><strong>稳定性</strong>：初始误差与舍入误差在计算过程中是否被控制。</li>
</ul>
<p>若输入数据的微小扰动只引起结果的微小变化，则问题<strong>良态</strong>；否则为<strong>病态</strong>。算法对舍入误差不敏感称为<strong>数值稳定</strong>。</p>
<h3>收敛性与收敛阶</h3>
<p>迭代序列 {x<sub>k</sub>} 收敛到 x*，若存在常数 C 与 p≥1 使</p>
<div class="formula"><p>|x<sub>k+1</sub> − x*| ≤ C·|x<sub>k</sub> − x*|<sup>p</sup></p></div>
<p>则称 p 阶收敛。p=1 为线性收敛，p=2 为平方收敛（二次收敛），p>1 为超线性收敛。p 越大收敛越快。</p>
<div class="callout key">
<p class="callout-h">本章在课程中的位置</p>
<p>后续插值、数值积分、常微分方程差分、方程求根、线性方程组求解各章，都会用本章的误差、稳定性和收敛阶概念评价算法。考试中常考：误差限计算、有效数字位数、迭代法收敛阶判断。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck0;

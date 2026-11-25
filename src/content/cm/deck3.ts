import type { DeckData } from '../types';

/** 第3章 常微分方程的差分方法 —— 课件 PPT-2024/第3章 -1～2 */
const deck3: DeckData = {
  id: 'deck3',
  no: '第3章',
  title: '常微分方程的差分方法',
  subtitle: 'Euler 法 · 后退 Euler · 改进 Euler · Runge-Kutta · 收敛性与稳定性',
  lede:
    '求初值问题 y′ = f(x,y)，y(x₀)=y₀ 的数值解，常用差分方法：把导数用差商代替，得到递推公式。本章介绍 Euler 法、后退 Euler 法、改进 Euler 法与经典四阶 Runge-Kutta 法，并讨论局部截断误差、阶、收敛性与稳定性。',
  toc: [
    { id: 'sec-3-1', text: '3.1 Euler 法与后退 Euler 法', level: 2 },
    { id: 'sec-3-2', text: '3.2 改进 Euler 法与梯形法', level: 2 },
    { id: 'sec-3-3', text: '3.3 Runge-Kutta 方法', level: 2 },
    { id: 'sec-3-4', text: '3.4 收敛性、稳定性与阶', level: 2 },
  ],
  sections: [
    {
      id: 'sec-3-1',
      heading: '3.1 Euler 法与后退 Euler 法',
      blocks: [
        {
          type: 'html',
          html: `
<p>将区间 [x<sub>0</sub>, x<sub>N</sub>] 等分，步长 h，节点 x<sub>n</sub> = x<sub>0</sub> + nh，记 y<sub>n</sub> ≈ y(x<sub>n</sub>)。</p>
<h3>Euler 法（显式）</h3>
<p>用向前差商代替导数：</p>
<div class="formula"><p>y<sub>n+1</sub> = y<sub>n</sub> + h·f(x<sub>n</sub>, y<sub>n</sub>)</p></div>
<p>局部截断误差：y(x<sub>n+1</sub>) − y<sub>n+1</sub> = (h²/2)·y″(ξ)，为 O(h²)，方法<strong>一阶</strong>。</p>
<h3>后退 Euler 法（隐式）</h3>
<p>用向后差商：</p>
<div class="formula"><p>y<sub>n+1</sub> = y<sub>n</sub> + h·f(x<sub>n+1</sub>, y<sub>n+1</sub>)</p></div>
<p>右端含 y<sub>n+1</sub>，需解方程（或用迭代）。局部截断误差 O(h²)，也是一阶方法。隐式法稳定性更好。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-2',
      heading: '3.2 改进 Euler 法与梯形法',
      blocks: [
        {
          type: 'html',
          html: `
<h3>梯形法</h3>
<p>对 y(x<sub>n+1</sub>) − y(x<sub>n</sub>) = ∫ f dx 用梯形公式：</p>
<div class="formula"><p>y<sub>n+1</sub> = y<sub>n</sub> + h/2 · [f(x<sub>n</sub>, y<sub>n</sub>) + f(x<sub>n+1</sub>, y<sub>n+1</sub>)]</p></div>
<p>隐式、二阶。可用 Euler 法预测、梯形法校正，得到<strong>改进 Euler 法</strong>：</p>
<div class="formula"><p>ỹ<sub>n+1</sub> = y<sub>n</sub> + h f(x<sub>n</sub>, y<sub>n</sub>)（预测）<br/>
y<sub>n+1</sub> = y<sub>n</sub> + h/2 · [f(x<sub>n</sub>, y<sub>n</sub>) + f(x<sub>n+1</sub>, ỹ<sub>n+1</sub>)]（校正）</p></div>
<p>改进 Euler 法是显式二阶方法，局部截断误差 O(h³)。</p>
<div class="callout key">
<p class="callout-h">预测—校正思想</p>
<p>先用显式公式预测一个初值，再代入隐式公式校正。这样既避免解隐式方程，又提高了精度。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-3',
      heading: '3.3 Runge-Kutta 方法',
      blocks: [
        {
          type: 'html',
          html: `
<p>在 [x<sub>n</sub>, x<sub>n+1</sub>] 内取若干点，用 f 的线性组合构造高阶公式：</p>
<div class="formula"><p>y<sub>n+1</sub> = y<sub>n</sub> + h Σ<sub>i=1</sub><sup>s</sup> b<sub>i</sub> k<sub>i</sub></p></div>
<p>其中 k<sub>i</sub> = f(x<sub>n</sub> + c<sub>i</sub>h, y<sub>n</sub> + h Σ<sub>j&lt;i</sub> a<sub>ij</sub> k<sub>j</sub>)。</p>
<h3>经典四阶 Runge-Kutta（RK4）</h3>
<pre class="code"><code>k1 = f(xn, yn)
k2 = f(xn + h/2, yn + h*k1/2)
k3 = f(xn + h/2, yn + h*k2/2)
k4 = f(xn + h,   yn + h*k3)
yn+1 = yn + h/6 * (k1 + 2*k2 + 2*k3 + k4)</code></pre>
<p>RK4 是四阶方法，局部截断误差 O(h⁵)，精度高、稳定性较好，是工程计算中最常用的方法之一。代价是每步需计算 4 次 f。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-4',
      heading: '3.4 收敛性、稳定性与阶',
      blocks: [
        {
          type: 'html',
          html: `
<h3>阶与局部截断误差</h3>
<p>若局部截断误差为 O(h<sup>p+1</sup>)，则称方法为 p 阶。Euler 一阶、改进 Euler 二阶、RK4 四阶。整体误差通常比局部误差低一阶。</p>
<h3>收敛性</h3>
<p>当 h→0 时，数值解 y<sub>n</sub> 收敛到精确解 y(x<sub>n</sub>)。单步法收敛的充分条件：增量函数 φ(x,y,h) 关于 y 满足 Lipschitz 条件，且 φ(x,y,0)=f(x,y)。</p>
<h3>绝对稳定性</h3>
<p>用试验方程 y′ = λy（λ 为复数）讨论。Euler 法的稳定条件 |1 + hλ| ≤ 1；后退 Euler 法对 Re(λ)<0 无条件稳定；RK4 的稳定区域为复平面上的一块有界区域。</p>
<div class="callout key">
<p class="callout-h">刚性方程</p>
<p>若方程含变化尺度差异很大的分量（刚性），显式方法需要极小步长才能稳定，宜用隐式方法（后退 Euler、梯形法、隐式 RK）。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck3;

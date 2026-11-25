/* 第 3 章 递推关系 —— 依据课件 3.1～3.6 共 5 份 PPT 整理 */
import type { GenChapter } from '../types';

const ch3: GenChapter = {
  id: 'deck3',
  no: '第3章',
  title: '递推关系',
  subtitle: '递推关系的建立 · 常系数线性齐次递推 · 常系数线性非齐次递推 · Catalan 数 · 差分表与 Stirling 数',
  lede:
    '<p>递推关系用「前面的项」表示「后面的项」，是描述离散过程的自然语言。本章先讲如何从计数问题建立递推式，再系统求解<strong>常系数线性递推</strong>：齐次情形用特征方程与特征根，非齐次情形叠加特解；最后讨论 Catalan 数这一经典递推，以及差分表与 Stirling 数。</p>',
  toc: [
    { id: 'sec-comb3-build', text: '3.1 递推关系的建立', level: 2 },
    { id: 'sec-comb3-homo', text: '3.2 常系数线性齐次递推关系', level: 2 },
    { id: 'sec-comb3-nonhomo', text: '3.3 常系数线性非齐次递推关系', level: 2 },
    { id: 'sec-comb3-catalan', text: '3.5 Catalan 数', level: 2 },
    { id: 'sec-comb3-diff', text: '3.6 差分表和 Stirling 数', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comb3-build',
      heading: '3.1 递推关系的建立',
      blocks: [
        {
          type: 'html',
          html: `
            <p>建立递推式的常用思路：<strong>考察规模为 n 的问题与规模更小的问题之间的关系</strong>——按「最后一个元素如何选取」「第一刀切在哪里」「最大元素放在哪里」分类，把方案数写成前若干项的组合。</p>
            <p>经典例子：<strong>Fibonacci 数列</strong> <code>f_n=f_{n−1}+f_{n−2}</code>（n≥3），<code>f_1=f_2=1</code>——n 级台阶每次走 1 级或 2 级，最后一步要么从 n−1 级走 1 级、要么从 n−2 级走 2 级；<strong>汉诺塔</strong> <code>h_n=2h_{n−1}+1</code>，<code>h_1=1</code>；<strong>平面分割</strong> <code>a_n=a_{n−1}+n</code> 等。</p>
            <p>建立递推关系后还要给出<strong>初始条件</strong>（边界值），否则递推不唯一确定数列。递推关系 + 初始条件 = 数列的完整定义，解递推就是求通项公式。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb3-homo',
      heading: '3.2 常系数线性齐次递推关系',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>k 阶常系数线性齐次递推关系</strong>：</p>
            <pre><code>a_n = c₁a_{n−1} + c₂a_{n−2} + … + c_k a_{n−k}    (3.2.1)</code></pre>
            <p>其中 c₁,…,c_k 是实常数、c_k≠0。<strong>特征方程</strong>由代入 <code>a_n=xⁿ</code>（x≠0）得到：</p>
            <pre><code>x^k − c₁x^{k−1} − c₂x^{k−2} − … − c_{k−1}x − c_k = 0    (3.2.2)</code></pre>
            <p>其根称为<strong>特征根</strong>。基本结论：</p>
            <ul>
              <li><strong>定理 3.2.1</strong>：若 x=q（非零复数）是特征根，则 <code>a_n=qⁿ</code> 是递推式的解；</li>
              <li><strong>定理 3.2.2</strong>：若 h₁(n),…,h_k(n) 都是解，则其线性组合 <code>A₁h₁(n)+…+A_kh_k(n)</code> 也是解（叠加原理）；</li>
              <li><strong>定理 3.2.3</strong>：若特征方程有 k 个<strong>不同</strong>复根 x₁,…,x_k，则通解为 <code>a_n=A₁x₁ⁿ+A₂x₂ⁿ+…+A_kx_kⁿ</code>，常数由初始条件确定；</li>
              <li><strong>重根情形</strong>：若 x 是 m 重根，则对应的解为 <code>(A₀+A₁n+…+A_{m−1}n^{m−1})xⁿ</code>。</li>
            </ul>
            <p>例 3.2.1（Fibonacci）：<code>f_n=f_{n−1}+f_{n−2}</code> 的特征方程为 <code>x²−x−1=0</code>，两根为 <code>(1±√5)/2</code>，通解 <code>f_n=A((1+√5)/2)ⁿ+B((1−√5)/2)ⁿ</code>，代入 f₁=f₂=1 得 <code>f_n=((1+√5)/2)ⁿ⁺¹−((1−√5)/2)ⁿ⁺¹)/√5</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb3-nonhomo',
      heading: '3.3 常系数线性非齐次递推关系',
      blocks: [
        {
          type: 'html',
          html: `
            <p>非齐次递推形如 <code>a_n = c₁a_{n−1}+…+c_k a_{n−k} + f(n)</code>，其通解为<strong>齐次通解 + 一个特解</strong>：<code>a_n = a_n^{(h)} + a_n^{(p)}</code>。</p>
            <p>特解的设法取决于 f(n) 的形式（待定系数法）：</p>
            <ul>
              <li>f(n) 为常数 → 特解设为常数；</li>
              <li>f(n) 为 n 的多项式 → 特解设为同次多项式（若 1 是特征根则乘 n）；</li>
              <li>f(n) 为 <code>c·rⁿ</code> → 特解设为 <code>A·rⁿ</code>（若 r 是 m 重特征根则乘 <code>n^m</code>）。</li>
            </ul>
            <p>例：<code>a_n=2a_{n−1}+1</code>，<code>a_1=2</code>。齐次解 <code>A·2ⁿ</code>；设特解为常数 C，代入得 <code>C=2C+1</code>，C=−1；故 <code>a_n=A·2ⁿ−1</code>，由 a₁=2 得 A=3/2，即 <code>a_n=3·2^{n−1}−1</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb3-catalan',
      heading: '3.5 Catalan 数',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Catalan 数</strong>由递推 <code>C_n = Σ_{k=0..n−1} C_k C_{n−1−k}</code>（<code>C_0=1</code>）定义，通项为</p>
            <pre><code>C_n = C(2n, n) / (n+1) = (2n)! / (n!(n+1)!)</code></pre>
            <p>前几项为 1, 1, 2, 5, 14, 42, 132, …。推导可用生成函数：令 <code>C(x)=ΣC_n xⁿ</code>，由递推得 <code>C(x)=1+xC(x)²</code>，解二次方程取收敛分支得 <code>C(x)=(1−√(1−4x))/(2x)</code>，展开即得通项。</p>
            <p>Catalan 数计数的经典对象：n 对括号的合法匹配方案数、n 个节点的不同二叉树形态数、凸 n+2 边形的三角剖分数、栈的合法出栈序列数、n×n 网格中不越过对角线的路径数。这些问题表面不同，递推结构相同，因此答案都是 Catalan 数。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb3-diff',
      heading: '3.6 差分表和 Stirling 数',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>差分表</strong>：对数列 <code>a_0,a_1,a_2,…</code> 依次求相邻差 <code>Δa_n=a_{n+1}−a_n</code>、二阶差 <code>Δ²a_n=Δa_{n+1}−Δa_n</code>……排成三角形即差分表。若数列是 n 的 m 次多项式，则第 m+1 阶差分为 0；反之可用差分表恢复通项（牛顿插值公式）：</p>
            <pre><code>a_n = Σ_{k=0..m} C(n,k) Δ^k a_0</code></pre>
            <p><strong>Stirling 数</strong>分两类：<strong>第一类</strong> <code>s(n,k)</code> 计数「n 个元素排成 k 个轮换」的方案数，其生成函数与上升阶乘 <code>x(x+1)…(x+n−1)</code> 的展开系数有关；<strong>第二类</strong> <code>S(n,k)</code> 计数「把 n 个不同球放入 k 个相同盒且无空盒」的方案数，满足递推</p>
            <pre><code>S(n,k) = k·S(n−1,k) + S(n−1,k−1)</code></pre>
            <p>其含义是：第 n 个球要么放进已有的 k 个盒之一（k 种），要么单独占一个新盒。第二类 Stirling 数与幂和、以及 <code>xⁿ = Σ S(n,k)·x(x−1)…(x−k+1)</code> 的展开式密切相关，也是「不同球放入相同盒」模型的标准答案。</p>`,
        },
      ],
    },
  ],
};

export default ch3;

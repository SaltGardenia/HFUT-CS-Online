import type { DeckData } from '../types';

/** 第5章 线性方程组的解法（迭代法）—— 课件 PPT-2024/第5章 -1～2 */
const deck5: DeckData = {
  id: 'deck5',
  no: '第5章',
  title: '线性方程组的迭代解法',
  subtitle: 'Jacobi 迭代 · Gauss-Seidel 迭代 · SOR 方法 · 收敛性与谱半径',
  lede:
    '对大型稀疏线性方程组 Ax=b，迭代法只需存储矩阵非零元、便于并行，比直接法更实用。本章介绍 Jacobi、Gauss-Seidel 与逐次超松弛（SOR）迭代，并用迭代矩阵的谱半径判定收敛性。',
  toc: [
    { id: 'sec-5-1', text: '5.1 迭代法的基本思想', level: 2 },
    { id: 'sec-5-2', text: '5.2 Jacobi 与 Gauss-Seidel 迭代', level: 2 },
    { id: 'sec-5-3', text: '5.3 SOR 方法', level: 2 },
    { id: 'sec-5-4', text: '5.4 收敛性判定', level: 2 },
  ],
  sections: [
    {
      id: 'sec-5-1',
      heading: '5.1 迭代法的基本思想',
      blocks: [
        {
          type: 'html',
          html: `
<p>将 A 分裂为 A = D − L − U（D 为对角部分，L 为严格下三角，U 为严格上三角），Ax=b 化为</p>
<div class="formula"><p>x = D<sup>−1</sup>(L+U)x + D<sup>−1</sup>b</p></div>
<p>构造迭代 x<sup>(k+1)</sup> = Bx<sup>(k)</sup> + g，B 为迭代矩阵。若迭代收敛，则极限 x* 满足 x* = Bx* + g，即 Ax*=b。</p>
<p>收敛的充要条件：<strong>谱半径 ρ(B) &lt; 1</strong>。谱半径是迭代矩阵特征值模的最大值。ρ(B) 越小收敛越快。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-2',
      heading: '5.2 Jacobi 与 Gauss-Seidel 迭代',
      blocks: [
        {
          type: 'html',
          html: `
<h3>Jacobi 迭代</h3>
<p>用旧的 x<sup>(k)</sup> 同时更新所有分量：</p>
<div class="formula"><p>x<sub>i</sub><sup>(k+1)</sup> = (b<sub>i</sub> − Σ<sub>j≠i</sub> a<sub>ij</sub>x<sub>j</sub><sup>(k)</sup>) / a<sub>ii</sub></p></div>
<p>迭代矩阵 B<sub>J</sub> = D<sup>−1</sup>(L+U)。</p>
<h3>Gauss-Seidel 迭代</h3>
<p>计算 x<sub>i</sub><sup>(k+1)</sup> 时，已更新的 x<sub>j</sub><sup>(k+1)</sup>（j&lt;i）立即使用：</p>
<div class="formula"><p>x<sub>i</sub><sup>(k+1)</sup> = (b<sub>i</sub> − Σ<sub>j&lt;i</sub> a<sub>ij</sub>x<sub>j</sub><sup>(k+1)</sup> − Σ<sub>j&gt;i</sub> a<sub>ij</sub>x<sub>j</sub><sup>(k)</sup>) / a<sub>ii</sub></p></div>
<p>迭代矩阵 B<sub>G</sub> = (D−L)<sup>−1</sup>U。通常比 Jacobi 收敛快，且只需一组存储。</p>
<div class="callout key">
<p class="callout-h">对角占优</p>
<p>若 A 严格对角占优（|a<sub>ii</sub>| &gt; Σ<sub>j≠i</sub>|a<sub>ij</sub>|），则 Jacobi 与 Gauss-Seidel 均收敛。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-3',
      heading: '5.3 SOR 方法',
      blocks: [
        {
          type: 'html',
          html: `
<p>在 Gauss-Seidel 基础上引入松弛因子 ω：</p>
<div class="formula"><p>x<sub>i</sub><sup>(k+1)</sup> = (1−ω)x<sub>i</sub><sup>(k)</sup> + ω/a<sub>ii</sub> · (b<sub>i</sub> − Σ<sub>j&lt;i</sub> a<sub>ij</sub>x<sub>j</sub><sup>(k+1)</sup> − Σ<sub>j&gt;i</sub> a<sub>ij</sub>x<sub>j</sub><sup>(k)</sup>)</p></div>
<ul>
<li>ω=1：即 Gauss-Seidel；</li>
<li>0&lt;ω&lt;1：低松弛（欠松弛），用于稳定化；</li>
<li>1&lt;ω&lt;2：超松弛（过松弛），用于加速收敛。</li>
</ul>
<p>SOR 收敛的必要条件：0&lt;ω&lt;2。对严格对角占优矩阵，0&lt;ω&lt;2 时收敛。最佳 ω 与矩阵特征值有关，实际问题中常通过试验选取。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-4',
      heading: '5.4 收敛性判定',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>判定</th><th>结论</th></tr></thead>
<tbody>
<tr><td>ρ(B) &lt; 1</td><td>迭代收敛（充要条件）</td></tr>
<tr><td>||B|| &lt; 1（某种相容范数）</td><td>迭代收敛（充分条件）</td></tr>
<tr><td>A 严格对角占优</td><td>Jacobi、Gauss-Seidel 收敛</td></tr>
<tr><td>A 对称正定</td><td>Gauss-Seidel 收敛；SOR 在 0&lt;ω&lt;2 收敛</td></tr>
<tr><td>A 对称正定且 0&lt;ω&lt;2</td><td>SOR 收敛</td></tr>
</tbody>
</table>
<p>收敛速度由 ρ(B) 决定：ρ 越接近 1 收敛越慢。实际计算中常用残差 ||b−Ax<sup>(k)</sup>|| 或相邻两次迭代差 ||x<sup>(k+1)</sup>−x<sup>(k)</sup>|| 作为停止准则。</p>
<div class="callout warn">
<p class="callout-h">常见误区</p>
<p>Gauss-Seidel 并不总是比 Jacobi 快：存在 Jacobi 收敛而 Gauss-Seidel 发散的例子。判定收敛应看谱半径，不能仅凭方法名称。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck5;

import type { DeckData } from '../types';

/** 第6章 线性方程组的直接法 —— 课件 PPT-2024/第6章 -1～2 */
const deck6: DeckData = {
  id: 'deck6',
  no: '第6章',
  title: '线性方程组的直接解法',
  subtitle: 'Gauss 消元 · 列主元 · LU 分解 · 平方根法 · 追赶法 · 条件数与误差',
  lede:
    '直接法通过有限步算术运算求出线性方程组的精确解（在无舍入误差意义下）。本章介绍 Gauss 消元与列主元消元、LU / Doolittle 分解、对称正定矩阵的平方根法、三对角方程组的追赶法，以及条件数与误差分析。',
  toc: [
    { id: 'sec-6-1', text: '6.1 Gauss 消元与列主元', level: 2 },
    { id: 'sec-6-2', text: '6.2 LU 分解与 Doolittle 方法', level: 2 },
    { id: 'sec-6-3', text: '6.3 平方根法与追赶法', level: 2 },
    { id: 'sec-6-4', text: '6.4 条件数与误差分析', level: 2 },
  ],
  sections: [
    {
      id: 'sec-6-1',
      heading: '6.1 Gauss 消元与列主元',
      blocks: [
        {
          type: 'html',
          html: `
<p>Gauss 消元通过初等行变换把 Ax=b 化为上三角方程组，再回代求解。</p>
<ol>
<li><strong>消元</strong>：对 k=1,…,n−1，用第 k 行消去第 k+1…n 行的第 k 列元素；</li>
<li><strong>回代</strong>：从最后一个方程开始依次求出 x<sub>n</sub>, x<sub>n−1</sub>, …, x<sub>1</sub>。</li>
</ol>
<p>乘数 m<sub>ik</sub> = a<sub>ik</sub>/a<sub>kk</sub>。若主元 a<sub>kk</sub>=0 或很小，会导致除法溢出或误差放大，因此需选主元。</p>
<h3>列主元消元</h3>
<p>在第 k 列的第 k 行及其下方选取绝对值最大的元素作为主元，交换行后再消元。列主元法能有效控制舍入误差，是实际计算的标准做法。全主元（在剩余子矩阵中选最大）更稳定但计算量大。</p>
<p>计算量：Gauss 消元约 n³/3 次乘除法，回代约 n²/2 次。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-2',
      heading: '6.2 LU 分解与 Doolittle 方法',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 A 可分解为 A = LU，其中 L 为单位下三角矩阵、U 为上三角矩阵，则 Ax=b 化为 Ly=b、Ux=y 两个三角形方程组，分别前代、回代。</p>
<h3>Doolittle 分解</h3>
<p>L 的对角元为 1。分解公式：</p>
<div class="formula"><p>u<sub>kj</sub> = a<sub>kj</sub> − Σ<sub>r=1</sub><sup>k−1</sup> l<sub>kr</sub>u<sub>rj</sub>　（j≥k）<br/>
l<sub>ik</sub> = (a<sub>ik</sub> − Σ<sub>r=1</sub><sup>k−1</sup> l<sub>ir</sub>u<sub>rk</sub>) / u<sub>kk</sub>　（i&gt;k）</p></div>
<p>存在唯一 LU 分解的充分条件：A 的各阶顺序主子式非零。若需选主元，则分解为 PA=LU（P 为置换矩阵）。</p>
<p>LU 分解的优点是：对多个右端向量 b，只需分解一次，后续每次求解只需 O(n²) 次运算；也常用于求逆矩阵和行列式（det A = det U）。</p>
<h3>Crout 分解</h3>
<p>与 Doolittle 对称，U 的对角元为 1，L 的一般元素由公式给出。两者本质相同，只是归一化方式不同。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-3',
      heading: '6.3 平方根法与追赶法',
      blocks: [
        {
          type: 'html',
          html: `
<h3>平方根法（Cholesky 分解）</h3>
<p>若 A 对称正定，则存在唯一的分解</p>
<div class="formula"><p>A = LL<sup>T</sup></p></div>
<p>其中 L 为下三角矩阵，对角元为正。计算公式：</p>
<div class="formula"><p>l<sub>ii</sub> = √(a<sub>ii</sub> − Σ<sub>k&lt;i</sub> l<sub>ik</sub>²)<br/>
l<sub>ij</sub> = (a<sub>ij</sub> − Σ<sub>k&lt;j</sub> l<sub>ik</sub>l<sub>jk</sub>) / l<sub>jj</sub>　（j&lt;i）</p></div>
<p>平方根法无需选主元，计算量约为 LU 的一半，且数值稳定，适合对称正定方程组。</p>
<h3>追赶法（三对角方程组）</h3>
<p>对三对角方程组，用 Thomas 算法：先消元得到上三角，再回代。由于每行只有三个非零元，计算量为 O(n)，存储量为 O(n)，是解三对角方程组的最优方法。三次样条插值的求解正是三对角方程组。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-4',
      heading: '6.4 条件数与误差分析',
      blocks: [
        {
          type: 'html',
          html: `
<p>方程组的<strong>条件数</strong>定义为</p>
<div class="formula"><p>cond(A) = ||A|| · ||A<sup>−1</sup>||</p></div>
<p>条件数刻画方程组对右端 b 和系数矩阵 A 扰动的敏感程度。cond(A) ≥ 1；条件数越大，问题越病态。</p>
<ul>
<li>cond(A) 很大时，b 的微小扰动会引起解的很大变化；</li>
<li>选主元、LU 分解等可减小舍入误差，但不能改变问题的病态性；</li>
<li>常用 1-范数、2-范数、∞-范数定义条件数，其中 2-范数条件数为 σ<sub>max</sub>/σ<sub>min</sub>。</li>
</ul>
<div class="callout key">
<p class="callout-h">直接法小结</p>
<p>Gauss 消元（列主元）是通用方法；LU 分解适合多右端；平方根法适合对称正定；追赶法适合三对角。误差分析看条件数：良态问题用稳定算法即可，病态问题需更高精度或正则化。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck6;

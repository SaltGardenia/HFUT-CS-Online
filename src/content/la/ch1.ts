/* 线性代数 · 第1章 行列式 —— 依据课件 ch1-1（概念）、ch1-2（性质）、ch1-3（Cramer 法则）与教材第一章整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch1',
  no: '第1章',
  title: '行列式',
  subtitle: '第 1 章 · 行列式',
  lede: `
  行列式是线性代数最重要的工具之一：它给出方阵可逆与否的判据、线性方程组唯一解的公式，也是特征值与二次型的基础。
  本章从二阶、三阶行列式引入，建立排列与逆序数的语言，给出 n 阶行列式的递归定义、性质与计算方法，最后是<strong>克拉默法则</strong>。
`,
  toc: [
    { id: 'sec-la1-concept', text: '1. 行列式的概念', level: 2 },
    { id: 'sec-la1-prop', text: '2. 行列式的性质', level: 2 },
    { id: 'sec-la1-cramer', text: '3. 克拉默法则', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la1-concept',
      heading: '1. 行列式的概念',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-la1-concept-h1">二阶与三阶行列式</h3>
          <p>二元线性方程组 a<sub>11</sub>x<sub>1</sub> + a<sub>12</sub>x<sub>2</sub> = b<sub>1</sub>，a<sub>21</sub>x<sub>1</sub> + a<sub>22</sub>x<sub>2</sub> = b<sub>2</sub> 用消元法求解，分母出现 a<sub>11</sub>a<sub>22</sub> − a<sub>12</sub>a<sub>21</sub>。把它记为二阶行列式：</p>
          <div class="formula">D = | a<sub>11</sub> a<sub>12</sub>; a<sub>21</sub> a<sub>22</sub> | = a<sub>11</sub>a<sub>22</sub> − a<sub>12</sub>a<sub>21</sub></div>
          <p>即「主对角线乘积减去副对角线乘积」。类似地，三阶行列式按对角线法则展开：</p>
          <div class="formula">D = a<sub>11</sub>a<sub>22</sub>a<sub>33</sub> + a<sub>12</sub>a<sub>23</sub>a<sub>31</sub> + a<sub>13</sub>a<sub>21</sub>a<sub>32</sub> − a<sub>13</sub>a<sub>22</sub>a<sub>31</sub> − a<sub>11</sub>a<sub>23</sub>a<sub>32</sub> − a<sub>12</sub>a<sub>21</sub>a<sub>33</sub></div>
          <p>三阶以上不能用对角线法则，必须用排列或按行（列）展开。</p>
          <h3 id="sec-la1-concept-h2">排列与逆序数</h3>
          <p>由 1, 2, …, n 组成的有序数组称为一个 <strong>n 级排列</strong>。在一个排列中，若较大的数排在较小的数之前，称这两个数构成一个<strong>逆序</strong>；逆序的总数称为该排列的<strong>逆序数</strong>，记作 τ(i<sub>1</sub>i<sub>2</sub>…i<sub>n</sub>)。逆序数为偶数的排列称偶排列，为奇数的称奇排列。</p>
          <p>对换排列中任意两个元素，排列的奇偶性改变。这一结论是行列式性质与展开定理的基础。</p>
          <h3 id="sec-la1-concept-h3">n 阶行列式的定义</h3>
          <p>n 阶行列式是 n! 项的代数和，每一项取自不同行、不同列的 n 个元素之积，符号由列下标排列的逆序数决定：</p>
          <div class="formula">D = Σ (−1)<sup>τ(j<sub>1</sub>j<sub>2</sub>…j<sub>n</sub>)</sup> a<sub>1j<sub>1</sub></sub>a<sub>2j<sub>2</sub></sub>…a<sub>nj<sub>n</sub></sub></div>
          <p>特别地，上（下）三角行列式等于主对角线元素之积；对角行列式同样如此。主对角线以下（上）全为零的行列式，值等于对角线乘积。</p>
          <div class="callout key">
            <p class="callout-h">余子式与代数余子式</p>
            <p>划去元素 a<sub>ij</sub> 所在的第 i 行与第 j 列，余下元素按原次序构成的 n−1 阶行列式称为 a<sub>ij</sub> 的<strong>余子式</strong> M<sub>ij</sub>；A<sub>ij</sub> = (−1)<sup>i+j</sup>M<sub>ij</sub> 称为<strong>代数余子式</strong>。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la1-prop',
      heading: '2. 行列式的性质',
      blocks: [
        {
          type: 'html',
          html: `
          <p>直接按定义计算 n 阶行列式需要 n! 项，代价极高。利用下列性质可把行列式化为三角形再求值。</p>
          <ol>
            <li><strong>转置不变</strong>：D<sup>T</sup> = D，因此行列式的行与列地位对称，凡对行成立的性质对列也成立；</li>
            <li><strong>互换两行（列）</strong>，行列式变号；</li>
            <li>某行（列）有公因子 k，可提到行列式外面；即某行（列）元素全乘以 k，行列式乘以 k；</li>
            <li>两行（列）相同或成比例，行列式为 0；</li>
            <li>某行（列）元素都是两组数之和，可拆成两个行列式之和；</li>
            <li>把某行（列）的 k 倍加到另一行（列），行列式<strong>不变</strong>。</li>
          </ol>
          <div class="formula">r<sub>i</sub> + k·r<sub>j</sub> → r<sub>i</sub>：D 不变；r<sub>i</sub> ↔ r<sub>j</sub>：D 变号</div>
          <h3 id="sec-la1-prop-h1">按行（列）展开</h3>
          <p><strong>展开定理</strong>：行列式等于任一行（列）的各元素与其对应代数余子式乘积之和：</p>
          <div class="formula">D = a<sub>i1</sub>A<sub>i1</sub> + a<sub>i2</sub>A<sub>i2</sub> + … + a<sub>in</sub>A<sub>in</sub></div>
          <p>而某行元素与<strong>另一行</strong>对应元素的代数余子式乘积之和为 0：</p>
          <div class="formula">a<sub>i1</sub>A<sub>j1</sub> + … + a<sub>in</sub>A<sub>jn</sub> = 0（i ≠ j）</div>
          <p>计算策略：先用初等行变换把某行（列）化出尽可能多的 0，再按该行（列）展开，把 n 阶降为 n−1 阶。</p>
          <div class="callout tip">
            <p class="callout-h">范德蒙德行列式</p>
            <p>V<sub>n</sub> = ∏<sub>1≤j&lt;i≤n</sub>(x<sub>i</sub> − x<sub>j</sub>)；当且仅当 x<sub>1</sub>, …, x<sub>n</sub> 互不相同时非零。这是常用的结论。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la1-cramer',
      heading: '3. 克拉默法则',
      blocks: [
        {
          type: 'html',
          html: `
          <p>设 n 个未知数、n 个方程的线性方程组 Ax = b，其系数行列式 D = |A|。若 D ≠ 0，则方程组有<strong>唯一解</strong>：</p>
          <div class="formula">x<sub>j</sub> = D<sub>j</sub> / D（j = 1, 2, …, n）</div>
          <p>其中 D<sub>j</sub> 是把 D 的第 j 列换成常数列 b 后得到的行列式。</p>
          <p>推论：</p>
          <ul>
            <li>若 D ≠ 0，方程组有唯一解；</li>
            <li>若 D = 0 且方程组有解，则解不唯一（无穷多解）；</li>
            <li>齐次方程组 Ax = 0 有非零解的充要条件是 D = 0。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">适用条件</p>
            <p>克拉默法则要求<strong>方程个数等于未知数个数</strong>且 D ≠ 0。它给出解的公式，但计算 n+1 个 n 阶行列式代价大，实际求解仍用消元法。</p>
          </div>
          <p><strong>例</strong> 解方程组 x<sub>1</sub> + 2x<sub>2</sub> = 3，3x<sub>1</sub> + 4x<sub>2</sub> = 5。D = 1×4 − 2×3 = −2 ≠ 0；D<sub>1</sub> = 3×4 − 2×5 = 2，D<sub>2</sub> = 1×5 − 3×3 = −4；故 x<sub>1</sub> = −1，x<sub>2</sub> = 2。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

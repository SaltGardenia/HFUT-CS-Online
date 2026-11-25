/* 线性代数 · 第2章 矩阵 —— 依据课件 ch2-1…ch2-6 与教材第二章整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch2',
  no: '第2章',
  title: '矩阵',
  subtitle: '第 2 章 · 矩阵',
  lede: `
  矩阵是线性代数的核心对象：线性方程组、线性变换、二次型都用矩阵表示。
  本章依次讨论矩阵的定义与运算、逆矩阵、分块矩阵、初等变换与矩阵的秩，为后续向量组与方程组理论打基础。
`,
  toc: [
    { id: 'sec-la2-def', text: '1. 矩阵的定义与运算', level: 2 },
    { id: 'sec-la2-inv', text: '2. 逆矩阵', level: 2 },
    { id: 'sec-la2-block', text: '3. 分块矩阵', level: 2 },
    { id: 'sec-la2-rank', text: '4. 初等变换与矩阵的秩', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la2-def',
      heading: '1. 矩阵的定义与运算',
      blocks: [
        {
          type: 'html',
          html: `
          <p>由 m×n 个数 a<sub>ij</sub> 排成的 m 行 n 列数表称为 <strong>m×n 矩阵</strong>，记 A = (a<sub>ij</sub>)<sub>m×n</sub>。m = n 时称<strong>方阵</strong>，n 称为阶数。行数与列数相同的两个矩阵称为同型矩阵。</p>
          <p>特殊矩阵：零矩阵 O；单位矩阵 E（主对角线为 1，其余为 0）；对角矩阵；上（下）三角矩阵；对称矩阵 A<sup>T</sup> = A；反对称矩阵 A<sup>T</sup> = −A。</p>
          <h3 id="sec-la2-def-h1">矩阵的运算</h3>
          <ul>
            <li><strong>加法</strong>：同型矩阵对应元素相加，满足交换律、结合律；</li>
            <li><strong>数乘</strong>：kA 的每个元素乘以 k，满足 k(A + B) = kA + kB、(kl)A = k(lA)；</li>
            <li><strong>乘法</strong>：A = (a<sub>ij</sub>)<sub>m×s</sub>，B = (b<sub>ij</sub>)<sub>s×n</sub>，则 C = AB 为 m×n 矩阵，c<sub>ij</sub> = Σ<sub>k=1</sub><sup>s</sup> a<sub>ik</sub>b<sub>kj</sub>；</li>
            <li><strong>转置</strong>：(A<sup>T</sup>)<sup>T</sup> = A，(A + B)<sup>T</sup> = A<sup>T</sup> + B<sup>T</sup>，(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>。</li>
          </ul>
          <div class="callout warn">
            <p class="callout-h">乘法不满足交换律</p>
            <p>一般 AB ≠ BA；AB = 0 也不一定有 A = 0 或 B = 0；消去律不成立。矩阵乘法满足结合律 (AB)C = A(BC) 与分配律。</p>
          </div>
          <p>方阵的幂：A<sup>k</sup> 为 k 个 A 相乘，A<sup>0</sup> = E；一般 (AB)<sup>k</sup> ≠ A<sup>k</sup>B<sup>k</sup>。方阵的行列式满足 |AB| = |A||B|，|kA| = k<sup>n</sup>|A|，|A<sup>T</sup>| = |A|。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-la2-inv',
      heading: '2. 逆矩阵',
      blocks: [
        {
          type: 'html',
          html: `
          <p>设 A 为 n 阶方阵，若存在 n 阶方阵 B 使 AB = BA = E，则称 A <strong>可逆</strong>，B 为 A 的逆矩阵，记 A<sup>−1</sup>。逆矩阵若存在则唯一。</p>
          <p><strong>可逆的充要条件</strong>：|A| ≠ 0（此时称 A 为非奇异矩阵）。且</p>
          <div class="formula">A<sup>−1</sup> = (1/|A|) · A*，其中 A* 为 A 的伴随矩阵，A* = (A<sub>ji</sub>)</div>
          <p>伴随矩阵由各元素的代数余子式转置排列而成，满足 AA* = A*A = |A|E。</p>
          <p>逆矩阵的性质：</p>
          <ul>
            <li>(A<sup>−1</sup>)<sup>−1</sup> = A；</li>
            <li>(kA)<sup>−1</sup> = (1/k)A<sup>−1</sup>（k ≠ 0）；</li>
            <li>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>（A、B 均可逆）；</li>
            <li>(A<sup>T</sup>)<sup>−1</sup> = (A<sup>−1</sup>)<sup>T</sup>；|A<sup>−1</sup>| = 1/|A|。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">初等变换求逆</p>
            <p>对 (A | E) 施行初等行变换，当左半变为 E 时，右半即为 A<sup>−1</sup>，即 (A | E) → (E | A<sup>−1</sup>)。这是比伴随矩阵法更实用的方法。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la2-block',
      heading: '3. 分块矩阵',
      blocks: [
        {
          type: 'html',
          html: `
          <p>用若干条横线与竖线把矩阵分成若干小块，以子块为元素的形式称为<strong>分块矩阵</strong>。分块后可按块进行加法、数乘与乘法，但相乘时要求左矩阵列的分法与右矩阵行的分法一致。</p>
          <p>分块矩阵的转置：先把子块看作元素转置，再把每个子块转置：</p>
          <div class="formula">[A B; C D]<sup>T</sup> = [A<sup>T</sup> C<sup>T</sup>; B<sup>T</sup> D<sup>T</sup>]</div>
          <p>分块对角矩阵（准对角矩阵）diag(A<sub>1</sub>, A<sub>2</sub>, …, A<sub>s</sub>) 的行列式与逆都很方便：</p>
          <div class="formula">|diag(A<sub>1</sub>,…,A<sub>s</sub>)| = |A<sub>1</sub>|…|A<sub>s</sub>|；diag(A<sub>1</sub>,…,A<sub>s</sub>)<sup>−1</sup> = diag(A<sub>1</sub><sup>−1</sup>,…,A<sub>s</sub><sup>−1</sup>)</div>
          <p>分块矩阵把高阶问题化为低阶子块问题，是证明秩不等式、求逆与讨论线性方程组的重要工具。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-la2-rank',
      heading: '4. 初等变换与矩阵的秩',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>初等行变换</strong>：① 交换两行；② 某行乘以非零常数 k；③ 某行的 k 倍加到另一行。把「行」换成「列」得初等列变换。初等变换可逆，且不改变矩阵的秩。</p>
          <p>初等矩阵：对单位矩阵施行一次初等变换所得的矩阵。用初等矩阵左乘 A 相当于对 A 作相应的初等行变换，右乘相当于列变换。</p>
          <h3 id="sec-la2-rank-h1">矩阵的秩</h3>
          <p>矩阵 A 中非零子式的最高阶数称为 A 的<strong>秩</strong>，记 r(A) 或 R(A)。规定零矩阵的秩为 0。r(A) ≤ min(m, n)。</p>
          <p><strong>行阶梯形矩阵</strong>：非零行在零行之上；每行首个非零元（主元）的列标随行数严格递增。行阶梯形中非零行的行数就是矩阵的秩。任一矩阵都可通过初等行变换化为行阶梯形，进一步可化为<strong>行最简形</strong>（主元为 1，且主元所在列其余元素为 0）。</p>
          <p>秩的性质：</p>
          <ul>
            <li>r(A) = r(A<sup>T</sup>)；</li>
            <li>r(AB) ≤ min(r(A), r(B))；</li>
            <li>若 A 可逆，则 r(AB) = r(B)，r(BA) = r(B)；</li>
            <li>r(A + B) ≤ r(A) + r(B)。</li>
          </ul>
          <div class="callout tip">
            <p class="callout-h">判断线性相关性</p>
            <p>把向量按列排成矩阵，只作初等行变换化为行阶梯形；非零行数即向量组的秩，秩小于向量个数则线性相关。第 3 章将系统展开。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

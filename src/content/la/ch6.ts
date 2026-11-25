/* 线性代数 · 第6章 二次型 —— 依据课件 ch6（37 页）与教材第五章整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch6',
  no: '第6章',
  title: '二次型',
  subtitle: '第 6 章 · 二次型',
  lede: `
  二次型是只含二次项的多元多项式，可用对称矩阵统一表示。
  本章讨论二次型的矩阵表示、用正交变换或配方法化标准形，以及<strong>正定二次型</strong>的判定。
`,
  toc: [
    { id: 'sec-la6-form', text: '1. 二次型及其矩阵表示', level: 2 },
    { id: 'sec-la6-standard', text: '2. 化二次型为标准形', level: 2 },
    { id: 'sec-la6-positive', text: '3. 正定二次型', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la6-form',
      heading: '1. 二次型及其矩阵表示',
      blocks: [
        {
          type: 'html',
          html: `
          <p>含有 n 个变量 x<sub>1</sub>, …, x<sub>n</sub> 的二次齐次多项式</p>
          <div class="formula">f(x<sub>1</sub>,…,x<sub>n</sub>) = Σ<sub>i=1</sub><sup>n</sup> Σ<sub>j=1</sub><sup>n</sup> a<sub>ij</sub>x<sub>i</sub>x<sub>j</sub>（a<sub>ij</sub> = a<sub>ji</sub>）</div>
          <p>称为<strong>二次型</strong>。取 a<sub>ij</sub> = a<sub>ji</sub>（把交叉项系数平分），则二次型可写成矩阵形式</p>
          <div class="formula">f = x<sup>T</sup>Ax，x = (x<sub>1</sub>,…,x<sub>n</sub>)<sup>T</sup>，A<sup>T</sup> = A</div>
          <p>称 A 为二次型的<strong>矩阵</strong>，A 的秩称为二次型的秩。二次型与对称矩阵一一对应。</p>
          <p>例：f = x<sub>1</sub><sup>2</sup> + 2x<sub>1</sub>x<sub>2</sub> + 3x<sub>2</sub><sup>2</sup> 的矩阵为 [1 1; 1 3]；交叉项 2x<sub>1</sub>x<sub>2</sub> 的系数 2 平分到 a<sub>12</sub>、a<sub>21</sub> 各 1。</p>
          <div class="callout tip">
            <p class="callout-h">合同</p>
            <p>若存在可逆矩阵 C 使 C<sup>T</sup>AC = B，称 A 与 B <strong>合同</strong>。作可逆线性变换 x = Cy，二次型 f = x<sup>T</sup>Ax 化为 y<sup>T</sup>(C<sup>T</sup>AC)y，矩阵合同变换。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la6-standard',
      heading: '2. 化二次型为标准形',
      blocks: [
        {
          type: 'html',
          html: `
          <p>只含平方项、不含交叉项的二次型称为<strong>标准形</strong>：f = d<sub>1</sub>y<sub>1</sub><sup>2</sup> + … + d<sub>n</sub>y<sub>n</sub><sup>2</sup>。化标准形有两类方法：</p>
          <h3 id="sec-la6-standard-h1">正交变换法</h3>
          <p>因 A 实对称，存在正交矩阵 Q 使 Q<sup>T</sup>AQ = Λ = diag(λ<sub>1</sub>,…,λ<sub>n</sub>)。令 x = Qy，则</p>
          <div class="formula">f = λ<sub>1</sub>y<sub>1</sub><sup>2</sup> + λ<sub>2</sub>y<sub>2</sub><sup>2</sup> + … + λ<sub>n</sub>y<sub>n</sub><sup>2</sup></div>
          <p>标准形的系数就是 A 的特征值。步骤：求特征值 → 求特征向量 → 正交化、单位化 → 以它们为列构造 Q。正交变换保持向量长度与内积不变。</p>
          <h3 id="sec-la6-standard-h2">配方法</h3>
          <p>若二次型含某变量的平方项，把含该变量的项集中配方，消去交叉项；若不含平方项但含交叉项，先作可逆变换制造平方项再配方。配方法不要求正交，所得标准形系数不唯一，但正、负惯性指数相同。</p>
          <div class="callout key">
            <p class="callout-h">惯性定理</p>
            <p>二次型的标准形中正系数个数 p（正惯性指数）与负系数个数 q（负惯性指数）由二次型本身唯一确定，与所用的可逆变换无关；p + q = 秩。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la6-positive',
      heading: '3. 正定二次型',
      blocks: [
        {
          type: 'html',
          html: `
          <p>若对任意非零向量 x，都有 f(x) = x<sup>T</sup>Ax &gt; 0，则称二次型 f <strong>正定</strong>，其矩阵 A 称为<strong>正定矩阵</strong>。类似可定义半正定、负定、不定。</p>
          <p><strong>正定的判定</strong>（等价条件）：</p>
          <ul>
            <li>正惯性指数 p = n（标准形全部系数为正）；</li>
            <li>A 的全部特征值大于 0；</li>
            <li>A 的各阶<strong>顺序主子式</strong>全大于 0（Sylvester 判别法）；</li>
            <li>A 与单位矩阵合同，即存在可逆 C 使 A = C<sup>T</sup>C；</li>
            <li>A 可逆且 A<sup>−1</sup> 正定。</li>
          </ul>
          <div class="formula">Δ<sub>1</sub> &gt; 0，Δ<sub>2</sub> &gt; 0，…，Δ<sub>n</sub> = |A| &gt; 0</div>
          <p>其中 Δ<sub>k</sub> 是 A 左上角 k 阶子式。注意：|A| &gt; 0 只是正定的<strong>必要</strong>条件，不能单独作为判据。</p>
          <p>例：A = [2 1; 1 2]，Δ<sub>1</sub> = 2 &gt; 0，Δ<sub>2</sub> = 3 &gt; 0，故 A 正定；对应二次型 2x<sub>1</sub><sup>2</sup> + 2x<sub>1</sub>x<sub>2</sub> + 2x<sub>2</sub><sup>2</sup> &gt; 0（x ≠ 0）。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

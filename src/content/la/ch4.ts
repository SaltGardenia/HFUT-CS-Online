/* 线性代数 · 第4章 线性方程组 —— 依据教材第四章（§4.1 齐次、§4.2 非齐次、§4.3 矩阵方程）与课件 ch4-2…ch4-4 整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch4',
  no: '第4章',
  title: '线性方程组',
  subtitle: '第 4 章 · 线性方程组',
  lede: `
  本章用矩阵的秩给出线性方程组解的判定与结构：齐次方程组的基础解系、非齐次方程组的通解，
  以及矩阵方程 AX = B 的可解条件。核心工具仍是<strong>初等行变换化行最简形</strong>。
`,
  toc: [
    { id: 'sec-la4-homo', text: '1. 齐次线性方程组', level: 2 },
    { id: 'sec-la4-nonhomo', text: '2. 非齐次线性方程组', level: 2 },
    { id: 'sec-la4-matrix', text: '3. 简单矩阵方程', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la4-homo',
      heading: '1. 齐次线性方程组',
      blocks: [
        {
          type: 'html',
          html: `
          <p>齐次方程组 Ax = 0（A 为 m×n 矩阵）总有零解。其解集的结构由系数矩阵的秩决定：</p>
          <ul>
            <li>r(A) = n（未知数个数）⇒ 只有零解；</li>
            <li>r(A) &lt; n ⇒ 有非零解，且有无穷多解。</li>
          </ul>
          <p>当 m &lt; n（方程个数少于未知数个数）时必有非零解；当 m = n 时，有非零解 ⇔ |A| = 0。</p>
          <h3 id="sec-la4-homo-h1">基础解系</h3>
          <p>齐次方程组的解集对加法与数乘封闭，构成向量空间（解空间）。解空间的一组基称为<strong>基础解系</strong> ξ<sub>1</sub>, …, ξ<sub>n−r</sub>，通解为</p>
          <div class="formula">x = k<sub>1</sub>ξ<sub>1</sub> + k<sub>2</sub>ξ<sub>2</sub> + … + k<sub>n−r</sub>ξ<sub>n−r</sub>（k<sub>i</sub> 任意）</div>
          <p>基础解系含 n − r 个线性无关的解向量，其中 r = r(A)。</p>
          <p><strong>求法</strong>：对 A 作初等行变换化为行最简形；主元对应的未知量用自由未知量表示；令自由未知量依次取单位向量，得到 n−r 个解向量，即为基础解系。</p>
          <div class="callout tip">
            <p class="callout-h">例</p>
            <p>x<sub>1</sub> + x<sub>2</sub> − x<sub>3</sub> = 0，2x<sub>1</sub> + 2x<sub>2</sub> − 2x<sub>3</sub> = 0。r(A) = 1，n−r = 2；取 x<sub>2</sub>, x<sub>3</sub> 为自由未知量，得基础解系 ξ<sub>1</sub> = (−1,1,0)<sup>T</sup>，ξ<sub>2</sub> = (1,0,1)<sup>T</sup>。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la4-nonhomo',
      heading: '2. 非齐次线性方程组',
      blocks: [
        {
          type: 'html',
          html: `
          <p>非齐次方程组 Ax = b。记增广矩阵 <strong>Ā = (A | b)</strong>，则：</p>
          <ul>
            <li>r(A) &lt; r(Ā) ⇒ 无解；</li>
            <li>r(A) = r(Ā) = n ⇒ 有唯一解；</li>
            <li>r(A) = r(Ā) = r &lt; n ⇒ 有无穷多解。</li>
          </ul>
          <p>这就是<strong>解的判定定理</strong>（相容性定理）：方程组有解 ⇔ r(A) = r(A | b)。</p>
          <h3 id="sec-la4-nonhomo-h1">解的结构</h3>
          <p>若 η* 是 Ax = b 的一个<strong>特解</strong>，ξ 是导出组 Ax = 0 的任一解，则 η* + ξ 仍是 Ax = b 的解；反之 Ax = b 的任一解都可写成 η* + ξ。因此通解为</p>
          <div class="formula">x = η* + k<sub>1</sub>ξ<sub>1</sub> + … + k<sub>n−r</sub>ξ<sub>n−r</sub></div>
          <p>即「非齐次通解 = 一个特解 + 导出组通解」。求特解时令全部自由未知量为 0，从行最简形直接读出。</p>
          <div class="callout key">
            <p class="callout-h">几何意义</p>
            <p>非齐次方程组的解集是不过原点的「平移」了解空间的仿射集；齐次解空间过原点。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la4-matrix',
      heading: '3. 简单矩阵方程',
      blocks: [
        {
          type: 'html',
          html: `
          <p>形如 AX = B 的矩阵方程，其中 A 为 m×n，B 为 m×l，X 为 n×l。把 X、B 按列分块：X = (x<sub>1</sub>,…,x<sub>l</sub>)，B = (b<sub>1</sub>,…,b<sub>l</sub>)，则 AX = B 等价于 l 个线性方程组 Ax<sub>j</sub> = b<sub>j</sub>。</p>
          <p>因此 AX = B 有解的充要条件是</p>
          <div class="formula">r(A) = r(A | B)</div>
          <p>若 A 为可逆方阵，则解唯一：X = A<sup>−1</sup>B。也可对增广矩阵 (A | B) 作初等行变换，化为 (E | A<sup>−1</sup>B) 求得。</p>
          <p>类似地，XA = B 在 A 可逆时解为 X = BA<sup>−1</sup>；AXB = C 在 A、B 可逆时解为 X = A<sup>−1</sup>CB<sup>−1</sup>。注意矩阵乘法不可交换，左乘与右乘的逆要对应。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

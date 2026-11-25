/* 线性代数 · 第5章 特征值与特征向量 —— 依据课件 ch5-1…ch5-3 整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch5',
  no: '第5章',
  title: '特征值与特征向量',
  subtitle: '第 5 章 · 特征值与特征向量',
  lede: `
  特征值刻画方阵在特定方向上的伸缩，是矩阵相似对角化的钥匙。
  本章讨论特征值与特征向量的定义与求法、相似矩阵的性质与对角化条件，最后给出<strong>实对称矩阵</strong>的正交对角化结论。
`,
  toc: [
    { id: 'sec-la5-eigen', text: '1. 方阵的特征值与特征向量', level: 2 },
    { id: 'sec-la5-similar', text: '2. 相似矩阵', level: 2 },
    { id: 'sec-la5-symmetric', text: '3. 实对称矩阵的对角化', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la5-eigen',
      heading: '1. 方阵的特征值与特征向量',
      blocks: [
        {
          type: 'html',
          html: `
          <p>设 A 为 n 阶方阵，若存在数 λ 和非零列向量 x，使</p>
          <div class="formula">Ax = λx（x ≠ 0）</div>
          <p>则称 λ 为 A 的<strong>特征值</strong>，x 为对应于 λ 的<strong>特征向量</strong>。</p>
          <p>把 Ax = λx 改写为 (λE − A)x = 0。由于 x ≠ 0，该齐次方程组有非零解，故</p>
          <div class="formula">|λE − A| = 0</div>
          <p>左端是关于 λ 的 n 次多项式，称<strong>特征多项式</strong>；其根即特征值（含重根）。对每个特征值 λ<sub>i</sub>，解齐次方程组 (λ<sub>i</sub>E − A)x = 0，其基础解系就是对应的线性无关特征向量。</p>
          <p><strong>性质</strong>：</p>
          <ul>
            <li>Σλ<sub>i</sub> = tr(A)（迹，主对角线元素之和）；∏λ<sub>i</sub> = |A|；</li>
            <li>A 可逆 ⇔ 所有特征值非零；</li>
            <li>λ 是 A 的特征值 ⇒ λ<sup>k</sup> 是 A<sup>k</sup> 的特征值；f(A) 的特征值为 f(λ)；</li>
            <li>A 可逆时，λ<sup>−1</sup> 是 A<sup>−1</sup> 的特征值，|A|/λ 是 A* 的特征值；</li>
            <li>属于不同特征值的特征向量线性无关。</li>
          </ul>
          <div class="callout tip">
            <p class="callout-h">重数与特征向量个数</p>
            <p>特征值 λ<sub>i</sub> 的代数重数 ≥ 其几何重数（对应线性无关特征向量的个数）。两者相等是可否对角化的关键。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la5-similar',
      heading: '2. 相似矩阵',
      blocks: [
        {
          type: 'html',
          html: `
          <p>设 A、B 都是 n 阶矩阵，若存在可逆矩阵 P 使</p>
          <div class="formula">P<sup>−1</sup>AP = B</div>
          <p>则称 A 与 B <strong>相似</strong>，记 A ~ B；P 称为相似变换矩阵。</p>
          <p><strong>相似矩阵的性质</strong>：</p>
          <ul>
            <li>相似关系具有反身性、对称性、传递性；</li>
            <li>相似矩阵有相同的特征多项式，从而特征值相同（含重数）；</li>
            <li>|A| = |B|，tr(A) = tr(B)，r(A) = r(B)；</li>
            <li>A 可逆 ⇔ B 可逆，且 A<sup>−1</sup> ~ B<sup>−1</sup>；A<sup>k</sup> ~ B<sup>k</sup>。</li>
          </ul>
          <h3 id="sec-la5-similar-h1">对角化条件</h3>
          <p>若 A 相似于对角矩阵 Λ = diag(λ<sub>1</sub>,…,λ<sub>n</sub>)，称 A <strong>可对角化</strong>。此时 P 的列就是 A 的 n 个线性无关特征向量，Λ 的对角元为对应特征值。</p>
          <p><strong>定理</strong>：n 阶矩阵 A 可对角化 ⇔ A 有 n 个线性无关的特征向量 ⇔ 每个特征值的几何重数等于代数重数。</p>
          <p>推论：若 A 有 n 个<strong>互不相同</strong>的特征值，则 A 必可对角化（充分不必要）。</p>
          <div class="callout key">
            <p class="callout-h">对角化的用途</p>
            <p>若 A = PΛP<sup>−1</sup>，则 A<sup>k</sup> = PΛ<sup>k</sup>P<sup>−1</sup>，把矩阵幂转化为对角元的幂，计算大大简化。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la5-symmetric',
      heading: '3. 实对称矩阵的对角化',
      blocks: [
        {
          type: 'html',
          html: `
          <p>实对称矩阵（A<sup>T</sup> = A）具有比一般矩阵更强的性质：</p>
          <ol>
            <li>特征值全为<strong>实数</strong>；</li>
            <li>属于不同特征值的特征向量<strong>相互正交</strong>；</li>
            <li>必可对角化，且存在<strong>正交矩阵</strong> Q 使 Q<sup>−1</sup>AQ = Q<sup>T</sup>AQ = Λ（对角形）。</li>
          </ol>
          <p><strong>正交对角化步骤</strong>：</p>
          <ol>
            <li>求 |λE − A| = 0 的全部特征值；</li>
            <li>对每个特征值解 (λ<sub>i</sub>E − A)x = 0，求基础解系；</li>
            <li>对同一特征值下的多个特征向量作 Schmidt 正交化，再单位化；</li>
            <li>把全部单位正交特征向量按列排成 Q，则 Q<sup>T</sup>AQ = diag(λ<sub>1</sub>,…,λ<sub>n</sub>)。</li>
          </ol>
          <p>不同特征值的特征向量已自动正交，只需单位化；同一特征值内部才需要正交化。</p>
          <div class="formula">Q<sup>T</sup>AQ = Λ，Q<sup>T</sup>Q = E，Q<sup>−1</sup> = Q<sup>T</sup></div>
          `,
        },
      ],
    },
  ],
};

export default ch;

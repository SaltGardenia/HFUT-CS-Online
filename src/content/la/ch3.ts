/* 线性代数 · 第3章 向量组 —— 依据课件 ch3-1…ch3-5 与教材第三章整理 */
import type { LaChapter } from './types';

const ch: LaChapter = {
  id: 'ch3',
  no: '第3章',
  title: '向量组',
  subtitle: '第 3 章 · 向量组',
  lede: `
  向量组把线性方程组的每一列看成一个向量，用<strong>线性表示、线性相关、秩</strong>刻画向量之间的关系。
  本章建立这套语言，并讨论向量空间与标准正交向量组（Schmidt 正交化）。
`,
  toc: [
    { id: 'sec-la3-repr', text: '1. 向量组的线性表示', level: 2 },
    { id: 'sec-la3-dep', text: '2. 向量组的线性相关性', level: 2 },
    { id: 'sec-la3-rank', text: '3. 向量组的秩与极大无关组', level: 2 },
    { id: 'sec-la3-space', text: '4. 向量空间与标准正交向量组', level: 2 },
  ],
  sections: [
    {
      id: 'sec-la3-repr',
      heading: '1. 向量组的线性表示',
      blocks: [
        {
          type: 'html',
          html: `
          <p>n 个数组成的有序数组 (a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>) 称为 <strong>n 维向量</strong>，第 i 个数称为第 i 个分量。写成一行是行向量，写成一列是列向量；本课程默认讨论列向量。</p>
          <p>向量组 A: α<sub>1</sub>, α<sub>2</sub>, …, α<sub>m</sub>，若存在数 k<sub>1</sub>, …, k<sub>m</sub> 使</p>
          <div class="formula">β = k<sub>1</sub>α<sub>1</sub> + k<sub>2</sub>α<sub>2</sub> + … + k<sub>m</sub>α<sub>m</sub></div>
          <p>则称 β 可由向量组 A <strong>线性表示</strong>。这等价于线性方程组 x<sub>1</sub>α<sub>1</sub> + … + x<sub>m</sub>α<sub>m</sub> = β 有解，也等价于矩阵方程 AX = β 有解。</p>
          <p><strong>判定</strong>：把 α<sub>1</sub>, …, α<sub>m</sub>, β 按列排成矩阵，作初等行变换。若 r(α<sub>1</sub>,…,α<sub>m</sub>) = r(α<sub>1</sub>,…,α<sub>m</sub>,β)，则 β 可表示；若秩不等，则不能表示。</p>
          <div class="callout tip">
            <p class="callout-h">表示系数</p>
            <p>把增广矩阵化为行最简形，主元外的自由未知量取 0，即可读出一组表示系数；若有无穷多解，表示法不唯一。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-la3-dep',
      heading: '2. 向量组的线性相关性',
      blocks: [
        {
          type: 'html',
          html: `
          <p>对向量组 A: α<sub>1</sub>, …, α<sub>m</sub>，若存在<strong>不全为零</strong>的数 k<sub>1</sub>, …, k<sub>m</sub> 使</p>
          <div class="formula">k<sub>1</sub>α<sub>1</sub> + k<sub>2</sub>α<sub>2</sub> + … + k<sub>m</sub>α<sub>m</sub> = 0</div>
          <p>则称 A <strong>线性相关</strong>；否则（只有全零系数才使组合为零）称<strong>线性无关</strong>。</p>
          <p>等价说法：向量组线性相关 ⇔ 其中至少有一个向量可由其余向量线性表示；线性无关 ⇔ 任一向量都不能由其余向量表示。</p>
          <h3 id="sec-la3-dep-h1">判定定理</h3>
          <ul>
            <li>n 维向量组 α<sub>1</sub>, …, α<sub>m</sub> 线性相关 ⇔ 以它们为列构成的矩阵 A 的秩 r(A) &lt; m；线性无关 ⇔ r(A) = m。</li>
            <li>m &gt; n 时，n 维向量组必线性相关（向量个数超过维数）。</li>
            <li>含零向量的向量组必线性相关；单个非零向量线性无关。</li>
            <li>部分组线性相关 ⇒ 整体线性相关；整体线性无关 ⇒ 任一部分组线性无关。</li>
            <li>线性无关组添上一个向量后线性相关 ⇔ 该向量可由原组唯一线性表示。</li>
          </ul>
          <div class="formula">α<sub>1</sub>,…,α<sub>m</sub> 线性无关 ⇔ 齐次方程组 Ax = 0 只有零解</div>
          <p>特别地，n 个 n 维向量线性无关 ⇔ 以它们为列的行列式 |A| ≠ 0。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-la3-rank',
      heading: '3. 向量组的秩与极大无关组',
      blocks: [
        {
          type: 'html',
          html: `
          <p>向量组 A 中能选出的线性无关向量的最大个数 r 称为 A 的<strong>秩</strong>，记 r(A)。若 A<sub>0</sub> 是 A 中 r 个线性无关的向量，且 A 中任一向量都可由 A<sub>0</sub> 线性表示，则称 A<sub>0</sub> 为 A 的一个<strong>极大线性无关组</strong>。</p>
          <p>极大无关组不唯一，但所含向量个数都等于秩。只含零向量的向量组秩为 0。</p>
          <p><strong>求法</strong>：把向量组按列排成矩阵，只作初等<strong>行</strong>变换化为行阶梯形。主元所在的列对应的原向量构成一个极大无关组；非零行数即秩。</p>
          <div class="callout key">
            <p class="callout-h">为什么只能用行变换</p>
            <p>初等行变换保持列向量之间的线性关系不变，因此能据此挑出极大无关组；若作列变换，会打乱原列的对应关系。</p>
          </div>
          <p><strong>等价向量组</strong>：两个向量组能互相线性表示。等价的向量组秩相同；向量组与它的极大无关组等价。</p>
          <p>矩阵的秩 = 行向量组的秩 = 列向量组的秩，这是矩阵秩与向量组秩统一的关键结论。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-la3-space',
      heading: '4. 向量空间与标准正交向量组',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>向量空间</strong>：n 维实向量的非空集合 V，若对加法与数乘封闭（α, β ∈ V ⇒ α + β ∈ V；k ∈ R, α ∈ V ⇒ kα ∈ V），则称 V 为向量空间。</p>
          <p>向量组 α<sub>1</sub>, …, α<sub>m</sub> 的所有线性组合构成的集合称为由它们<strong>生成</strong>的向量空间，记 L(α<sub>1</sub>,…,α<sub>m</sub>)。V 的一组线性无关的生成元称为 V 的<strong>基</strong>，基所含向量个数称为 V 的<strong>维数</strong>。</p>
          <h3 id="sec-la3-space-h1">内积与正交</h3>
          <p>n 维实向量 α、β 的内积 (α, β) = α<sup>T</sup>β = Σ a<sub>i</sub>b<sub>i</sub>。内积满足对称性、线性性与正定性，(α, α) ≥ 0，等号仅当 α = 0。</p>
          <p>向量长度 ‖α‖ = √(α, α)；长度为 1 的向量称单位向量。α、β 的夹角满足 cos θ = (α, β)/(‖α‖‖β‖)。(α, β) = 0 时称 α 与 β <strong>正交</strong>。</p>
          <p>两两正交的非零向量组必线性无关。<strong>标准正交向量组</strong>是两两正交且长度为 1 的向量组。</p>
          <h3 id="sec-la3-space-h2">Schmidt 正交化</h3>
          <p>由线性无关组 α<sub>1</sub>, …, α<sub>m</sub> 构造正交组 β<sub>1</sub>, …, β<sub>m</sub>：</p>
          <div class="formula">β<sub>1</sub> = α<sub>1</sub>；β<sub>k</sub> = α<sub>k</sub> − Σ<sub>i=1</sub><sup>k−1</sup> [(α<sub>k</sub>, β<sub>i</sub>)/(β<sub>i</sub>, β<sub>i</sub>)] β<sub>i</sub></div>
          <p>再令 e<sub>k</sub> = β<sub>k</sub>/‖β<sub>k</sub>‖，得到标准正交组。正交矩阵：满足 Q<sup>T</sup>Q = E 的方阵，其列（行）向量构成标准正交组，且 |Q| = ±1。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

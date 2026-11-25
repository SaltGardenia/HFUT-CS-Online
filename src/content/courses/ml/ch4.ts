/* 第 4 讲 支持向量机 —— 依据课件「10-支持向量机」（34 页）整理 */
import type { GenChapter } from '../types';

const ch4: GenChapter = {
  id: 'deck4',
  no: '第4讲',
  title: '支持向量机',
  subtitle: '从逻辑回归到 SVM · 大间距分类器 · 支持向量与 C 的作用 · 核函数 · 软间隔',
  lede:
    '<p>支持向量机（SVM）是逻辑回归的「极端化」改造：把交叉熵代价曲线改成折线、去掉 1/m、把正则化参数换成 C，就得到 SVM 的优化目标。改动的结果是一个<strong>大间距分类器</strong>——它不只要求把样本分对，还要求分界面与最近样本之间留出尽可能大的间隔。本章按「代价函数改造 → 最大边界 → 支持向量 → 核函数 → 参数选择」的顺序展开。</p>',
  toc: [
    { id: 'sec-ml4-cost', text: '4.1 从逻辑回归到 SVM', level: 2 },
    { id: 'sec-ml4-margin', text: '4.2 大间距分类器', level: 2 },
    { id: 'sec-ml4-vector', text: '4.3 支持向量与 C 的作用', level: 2 },
    { id: 'sec-ml4-kernel', text: '4.4 核函数', level: 2 },
    { id: 'sec-ml4-soft', text: '4.5 软间隔与参数选择', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ml4-cost',
      heading: '4.1 从逻辑回归到 SVM',
      blocks: [
        {
          type: 'html',
          html: `
            <p>逻辑回归中，若 y=1 我们希望假设函数接近 1（<code>θᵀx ≫ 0</code>）；若 y=0 希望假设函数接近 0（<code>θᵀx ≪ 0</code>）。逻辑回归的代价函数由两条平滑的交叉熵曲线构成，SVM 对它做四次改动：</p>
            <ol>
              <li>把代价曲线从平滑曲线改成<strong>折线</strong>（y=1 时在 <code>z≥1</code> 后代价为 0，y=0 时在 <code>z≤−1</code> 后代价为 0）；</li>
              <li>去掉常数 <code>1/m</code>（不影响最优解）；</li>
              <li>把正则化项与代价项的权重关系写成 <code>C</code>；</li>
              <li>把正则化参数 <code>λ</code> 换成 <code>C = 1/λ</code>。</li>
            </ol>
            <p>于是得到 SVM 的优化目标：<code>min C·Σ[y⁽ⁱ⁾cost₁(θᵀx⁽ⁱ⁾) + (1−y⁽ⁱ⁾)cost₀(θᵀx⁽ⁱ⁾)] + ½Σθⱼ²</code>。与逻辑回归的差别在于：SVM 的输出<strong>不会给出 0.4、0.2 这样的概率</strong>，而是直接给出类别（0 或 1）。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml4-margin',
      heading: '4.2 大间距分类器',
      blocks: [
        {
          type: 'html',
          html: `
            <p>折线代价带来的关键变化是：SVM 不仅要求 <code>θᵀx ≥ 0</code>（分对即可），而是要求 <code>θᵀx ≥ 1</code>（y=1）或 <code>θᵀx ≤ −1</code>（y=0）——不仅分对，还要<strong>留出安全余量</strong>。因此 SVM 的决策边界是线性可分情况下「最大边界分类器」：决策边界到最近样本点的距离（<strong>间隔</strong>）最大。</p>
            <p>从数学上看，决策边界由 <code>θᵀx = 0</code> 给出，间隔与 <code>||θ||</code> 成反比（间隔为 <code>2/||θ||</code>）；最小化 <code>½Σθⱼ²</code> 就是最大化间隔——约束条件把样本「尽量分开」，这正是大间距的来历。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml4-vector',
      heading: '4.3 支持向量与 C 的作用',
      blocks: [
        {
          type: 'html',
          html: `
            <p>落在间隔边界上（即满足等号约束）的样本向量称为<strong>支持向量</strong>，真正决定决策边界位置的只有它们；其余样本即使删掉，边界也不变。这是 SVM 稀疏性的来源，也是它对异常值相对稳健的原因之一。</p>
            <p><strong>参数 C</strong> 相当于逻辑回归中 <code>1/λ</code> 的作用：<strong>C 较大</strong>时对误分类的惩罚大，模型倾向于把每个样本都分对，边界会更贴合数据、复杂度高、低偏差高方差（容易过拟合）；<strong>C 较小</strong>时允许一些样本落在间隔内或被错分，边界更平滑、偏差高方差低。课件给出的经验是：当数据中存在异常值时，C 不宜太小，否则边界会被异常样本拉偏。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml4-kernel',
      heading: '4.4 核函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>线性 SVM 只能产生线性决策边界。要处理非线性可分问题，SVM 用<strong>核函数</strong>把「样本与样本之间的内积」替换为「样本之间的相似度」，从而在高维特征空间中隐式地构造非线性边界。</p>
            <p>常用的<strong>高斯核函数</strong>：<code>K(x, l) = exp(−||x − l||² / (2σ²))</code>，其中 l 为标记点（landmark）。样本 x 与 l 越接近，核函数值越接近 1；越远越接近 0。它衡量的是<strong>相似性</strong>：每个标记点产生一个「钟形」影响，多个标记点叠加形成复杂的决策边界。</p>
            <p>核函数的选择：特征维数高、样本数少时适合<strong>线性核</strong>（无核函数）；样本数中等、特征维数不高时适合<strong>高斯核</strong>；此外还有多项式核、Sigmoid 核等。核函数必须满足 Mercer 条件（对应某个特征空间的内积），否则优化问题可能不收敛。参数 σ 控制影响范围：σ 大则边界平滑（欠拟合），σ 小则边界曲折（过拟合）。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml4-soft',
      heading: '4.5 软间隔与参数选择',
      blocks: [
        {
          type: 'html',
          html: `
            <p>现实数据往往线性不可分或含噪声，硬间隔（要求全部分对）会过拟合甚至无解，因此引入<strong>软间隔</strong>：允许少量样本违反间隔约束，用松弛变量度量违反程度，并在目标函数中惩罚。C 控制「间隔最大」与「违反约束最少」之间的权衡。</p>
            <p>参数选择要点：<strong>C</strong> 大 → 低偏差高方差；C 小 → 高偏差低方差。<strong>高斯核的 σ</strong> 大 → 相似度衰减慢、边界平滑、高偏差；σ 小 → 衰减快、边界曲折、高方差。实际使用中常配合交叉验证在网格上搜索 C 与 σ。</p>`,
        },
      ],
    },
  ],
};

export default ch4;

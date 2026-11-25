/* 第 2 章 生成函数 —— 依据课件 2.1～2.6 共 6 份 PPT 整理 */
import type { GenChapter } from '../types';

const ch2: GenChapter = {
  id: 'deck2',
  no: '第2章',
  title: '生成函数',
  subtitle: '生成函数的概念 · 运算 · 幂级数展开式 · 指数生成函数 · 应用补充 · 正整数的拆分',
  lede:
    '<p>生成函数（又称母函数）把「数列」变成「形式幂级数的系数」，从而把计数问题转化为代数运算：相同球放入不同盒、重集的组合、整数拆分等问题，都可以写成「若干个幂级数相乘，取某一项的系数」。本章讲生成函数的定义与运算、常用展开式、指数生成函数（处理排列问题）及其应用。</p>',
  toc: [
    { id: 'sec-comb2-def', text: '2.1 生成函数的概念', level: 2 },
    { id: 'sec-comb2-op', text: '2.2 生成函数的运算', level: 2 },
    { id: 'sec-comb2-expand', text: '2.3 生成函数的幂级数展开式', level: 2 },
    { id: 'sec-comb2-egf', text: '2.4 指数生成函数', level: 2 },
    { id: 'sec-comb2-app', text: '2.5 生成函数的应用补充', level: 2 },
    { id: 'sec-comb2-split', text: '2.6 正整数的拆分', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comb2-def',
      heading: '2.1 生成函数的概念',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>定义 2.1.1</strong>：设 x 是抽象符号，a_n（n=0,1,2,…）为实数列，若 F(x) 可表示成</p>
            <pre><code>F(x) = a₀x⁰ + a₁x¹ + a₂x² + …</code></pre>
            <p>则称 F(x) 为数列 a_n 的<strong>生成函数</strong>。约定若某个 a_i=0 则该项可略去，x⁰ 简记为 1。由于只关心系数，x 只是形式符号，不必讨论收敛性——这就是「形式幂级数」的含义。</p>
            <p>例：无穷序列 1,1,1,… 的生成函数为 <code>F(x)=x⁰+x¹+x²+…=1/(1−x)</code>；序列 1,a,a²,… 的生成函数为 <code>1/(1−ax)</code>。</p>
            <p><strong>相同球放入不同盒</strong>：例 2.1.1——把 9 个相同球放入 5 个不同盒，盒 1 只能放奇数个、盒 2 只能放偶数个、盒 3 最少 2 个最多 5 个、盒 4 与 5 容量不限，求方案数 a₉。用 x^k 表示放 k 个球，每个盒子对应一个幂级数：</p>
            <pre><code>F(x) = (x¹+x³+x⁵+…)(x⁰+x²+x⁴+…)(x²+x³+x⁴+x⁵)(x⁰+x¹+x²+…)(x⁰+x¹+x²+…)</code></pre>
            <p>展开式中 x⁹ 项的系数（未合并同类项前逐项对应一种分配方案）就是 a₉。这一「为每个盒子写一个幂级数、相乘取系数」的方法，是生成函数解计数问题的标准套路。</p>
            <p><strong>重集的组合</strong>：例 2.1.2——重集 S={2·a₁, 1·a₂, ∞·a₃, 9·a₄} 的 7 组合个数 b₇，对应 <code>(1+x+x²)(1+x)(1+x+x²+…)(1+x+…+x⁹)</code> 中 x⁷ 的系数。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb2-op',
      heading: '2.2 生成函数的运算',
      blocks: [
        {
          type: 'html',
          html: `
            <p>生成函数把数列的运算对应为幂级数的运算：</p>
            <ul>
              <li><strong>加法</strong>：<code>Σa_n xⁿ + Σb_n xⁿ = Σ(a_n+b_n)xⁿ</code>，对应数列逐项相加；</li>
              <li><strong>数乘</strong>：<code>c·Σa_n xⁿ = Σ(c·a_n)xⁿ</code>；</li>
              <li><strong>乘法（卷积）</strong>：<code>(Σa_n xⁿ)(Σb_n xⁿ) = Σc_n xⁿ</code>，其中 <code>c_n = Σ_{k=0..n} a_k b_{n−k}</code>——这正是「把两个独立的计数过程组合起来」的代数表达；</li>
              <li><strong>移位</strong>：<code>x^m F(x)</code> 把数列右移 m 位；</li>
              <li><strong>求导与积分</strong>：可用于生成 <code>n a_n</code>、<code>a_n/(n+1)</code> 之类的新数列。</li>
            </ul>
            <p>卷积是生成函数最常用的性质：若一个方案由「第一部分」与「第二部分」独立组合而成，则总方案数的生成函数就是两个生成函数之积。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb2-expand',
      heading: '2.3 生成函数的幂级数展开式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>常用展开式（|x|&lt;1 时收敛，形式幂级数意义下恒成立）：</p>
            <pre><code>1/(1−x)   = 1 + x + x² + x³ + …
1/(1−x)²  = 1 + 2x + 3x² + 4x³ + …          （系数 n+1）
1/(1−x)^k = Σ C(n+k−1, k−1) xⁿ
1/(1−ax)  = 1 + ax + a²x² + …
e^x       = 1 + x + x²/2! + x³/3! + …</code></pre>
            <p>求系数的一般方法：<strong>部分分式分解</strong>——把有理生成函数拆成若干个 <code>1/(1−ax)^k</code> 之和，再用上表逐项取系数。这与线性递推的特征根方法本质相同：分母的根就是特征根，重数决定 <code>n^j aⁿ</code> 形式的项。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb2-egf',
      heading: '2.4 指数生成函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>普通生成函数适合处理「组合」（不计顺序）问题；处理「排列」（计顺序）问题要用<strong>指数生成函数</strong>：</p>
            <pre><code>F(x) = Σ a_n xⁿ / n!</code></pre>
            <p>两个指数生成函数之积对应「二项式卷积」：<code>c_n = Σ C(n,k) a_k b_{n−k}</code>，恰好表达了「先从 n 个位置中选 k 个放第一类、其余放第二类」的计数方式。</p>
            <p>典型应用：重集的全排列数 <code>n!/(n₁!…n_k!)</code> 正是 <code>(Σx^{n_i}/n_i!)</code> 乘积中 <code>xⁿ/n!</code> 的系数；带限制条件的排列问题（如某些元素必须成对出现）也可用指数生成函数求解。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb2-app',
      heading: '2.5 生成函数的应用补充',
      blocks: [
        {
          type: 'html',
          html: `
            <p>生成函数的应用不限于计数：它可以证明组合恒等式（比较两边系数）、求递推关系的通项（把递推式乘以 xⁿ 求和，化为关于 F(x) 的代数方程）、分析算法的平均复杂度（概率生成函数）。</p>
            <p>解递推的典型步骤：设 <code>F(x)=Σa_n xⁿ</code> → 把递推式两边乘 xⁿ 并对 n 求和 → 利用移位性质得到 F(x) 的方程 → 解出 F(x) → 部分分式展开取系数。这条路线与第 3 章的特征方程法互为表里。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb2-split',
      heading: '2.6 正整数的拆分',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>整数拆分</strong>：把正整数 n 写成若干个正整数之和（不计次序），记拆分数的个数为 p(n)。例如 5 的拆分为 5、4+1、3+2、3+1+1、2+2+1、2+1+1+1、1+1+1+1+1，共 p(5)=7。</p>
            <p>生成函数为</p>
            <pre><code>Σ p(n)xⁿ = 1 / ((1−x)(1−x²)(1−x³)…)</code></pre>
            <p>因为每个部分 k 可取 0 个、1 个、2 个……对应因子 <code>1+x^k+x^{2k}+…=1/(1−x^k)</code>。这一公式把「无序拆分」转化为「有序的因子相乘」，是生成函数威力的典型体现。</p>
            <p>由生成函数还可证明许多拆分恒等式，例如「各部分互不相同的拆分数」等于「各部分均为奇数的拆分数」——只需注意到 <code>1+x^k = (1−x^{2k})/(1−x^k)</code>，两种拆分的生成函数可以相互转化。</p>`,
        },
      ],
    },
  ],
};

export default ch2;

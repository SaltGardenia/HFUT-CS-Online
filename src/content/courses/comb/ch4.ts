/* 第 4 章 容斥原理 —— 依据课件「4.1-4.2容斥原理」（42 页）整理 */
import type { GenChapter } from '../types';

const ch4: GenChapter = {
  id: 'deck4',
  no: '第4章',
  title: '容斥原理',
  subtitle: '集合的运算 · 容斥原理的简单形式与一般形式 · Jordan 公式',
  lede:
    '<p>计数时如果直接数「满足条件的对象」很困难，可以先数「不满足条件」的对象，再用全集减去——这就是容斥原理的思想。本章先复习集合运算与运算律，再给出容斥原理的<strong>简单形式</strong>（两个、三个集合）与<strong>一般形式</strong>（n 个集合的并），最后介绍 Jordan 公式。</p>',
  toc: [
    { id: 'sec-comb4-set', text: '4.1.1 集合的运算', level: 2 },
    { id: 'sec-comb4-simple', text: '4.1.2 容斥原理的简单形式', level: 2 },
    { id: 'sec-comb4-general', text: '4.1.3 容斥原理的一般形式', level: 2 },
    { id: 'sec-comb4-jordan', text: '4.1.4 Jordan 公式', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comb4-set',
      heading: '4.1.1 集合的运算',
      blocks: [
        {
          type: 'html',
          html: `
            <p>基本运算：<strong>交</strong> <code>A∩B={x | x∈A 且 x∈B}</code>；<strong>并</strong> <code>A∪B={x | x∈A 或 x∈B}</code>；<strong>差</strong> <code>A−B={x | x∈A 且 x∉B}</code>（B 相对 A 的补）；<strong>绝对补</strong> <code>Ā=E−A</code>，其中 E 为全集。</p>
            <p>运算律：对合律 <code>Ā̄=A</code>；幂等律 <code>A∩A=A</code>、<code>A∪A=A</code>；交换律 <code>A∩B=B∩A</code>、<code>A∪B=B∪A</code>；结合律 <code>(A∩B)∩C=A∩(B∩C)</code>、<code>(A∪B)∪C=A∪(B∪C)</code>；分配律 <code>A∩(B∪C)=(A∩B)∪(A∩C)</code>、<code>A∪(B∩C)=(A∪B)∩(A∪C)</code>；否定律 <code>A∩Ā=∅</code>、<code>A∪Ā=E</code>；零律 <code>A∩∅=∅</code>、<code>A∪E=E</code>；同一律 <code>A∩E=A</code>、<code>A∪∅=A</code>；吸收律 <code>A∩(A∪B)=A</code>、<code>A∪(A∩B)=A</code>；德摩根律 <code>‾(A∪B)=Ā∩B̄</code>、<code>‾(A∩B)=Ā∪B̄</code>。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb4-simple',
      heading: '4.1.2 容斥原理的简单形式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>两个集合：<code>|A∪B| = |A| + |B| − |A∩B|</code>——相加时交集被算了两次，要减掉一次。</p>
            <p>三个集合：<code>|A∪B∪C| = |A|+|B|+|C| − |A∩B|−|A∩C|−|B∩C| + |A∩B∩C|</code>——单集合相加、两两交集相减、三三交集加回，符号交替。</p>
            <p>「不满足任何一个条件」的对象数为 <code>|Ā∩B̄∩C̄| = |E| − |A∪B∪C|</code>。这一形式常用于「1 到 n 中与 m 互素的数有多少个」「错排问题」等经典计数。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb4-general',
      heading: '4.1.3 容斥原理的一般形式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>对 n 个集合 A₁,…,A_n：</p>
            <pre><code>|A₁∪…∪A_n| = Σ|A_i| − Σ_{i&lt;j}|A_i∩A_j| + Σ_{i&lt;j&lt;k}|A_i∩A_j∩A_k| − … + (−1)^{n−1}|A₁∩…∩A_n|</code></pre>
            <p>即「奇数个集合的交相加、偶数个集合的交相减」。等价地，若用 <code>N(k)</code> 表示「恰好属于 k 个集合」的对象数、<code>S_j</code> 表示所有 j 个集合交集的大小之和，则</p>
            <pre><code>N(k) = Σ_{j≥k} (−1)^{j−k} C(j,k) S_j</code></pre>
            <p>证明思路：对任一元素 x，设它属于 m 个集合，则它在右端被计入的次数为 <code>Σ_{j} (−1)^{j}C(m,j)</code>，由二项式定理该和当且仅当 m=0 时为 1，否则为 0——于是恰好筛出「不属于任何集合」的元素。</p>
            <p>应用举例：<strong>错排问题</strong>（n 个元素的排列中没有一个在原来位置上）的方案数为 <code>n!·Σ_{k=0..n} (−1)^k / k!</code>，当 n 较大时约为 <code>n!/e</code>；<strong>欧拉函数</strong> <code>φ(m)=m·Π(1−1/p)</code> 也可由容斥推出。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb4-jordan',
      heading: '4.1.4 Jordan 公式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>Jordan 公式是容斥原理的推广形式，用于计算「至少满足 k 个性质」或「恰好满足 k 个性质」的对象数。设 <code>S_j</code> 为所有 j 个性质同时成立的对象数之和，则至少满足 k 个性质的对象数为</p>
            <pre><code>W(k) = Σ_{j≥k} (−1)^{j−k} C(j−1, k−1) S_j</code></pre>
            <p>它把容斥原理中「至少一个」（k=1）的情形推广到任意 k：当 k=1 时退化为普通的容斥公式。Jordan 公式在筛法、概率计算与组合设计中都有应用，也是「恰好 k 个」型计数问题的通用工具。</p>
            <p>本章的方法可以概括为一句话：<strong>正面计数困难时，转而数反面，用交集的大小与符号交替把重复计算的部分修正回来</strong>。</p>`,
        },
      ],
    },
  ],
};

export default ch4;

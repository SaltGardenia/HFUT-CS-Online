import type { DeckData } from '../types';

/** 第4章 函数 —— 课件 PPT/4.1～4.4 */
const deck4: DeckData = {
  id: 'deck4',
  no: '第4章',
  title: '函数',
  subtitle: '函数的基本概念 · 特殊函数 · 复合函数与逆函数 · 置换 · 可数集与不可数集',
  lede:
    '函数是特殊的关系：对定义域中每个元素，值域中恰有一个元素与之对应。本章用关系语言重新定义函数，讨论单射、满射、双射等特殊函数，复合函数与逆函数的存在条件，置换的表示与运算，以及可数集与不可数集的基数理论。',
  toc: [
    { id: 'sec-4-1', text: '4.1 函数的基本概念与特殊函数', level: 2 },
    { id: 'sec-4-2', text: '4.2 复合函数与逆函数', level: 2 },
    { id: 'sec-4-3', text: '4.3 置换', level: 2 },
    { id: 'sec-4-4', text: '4.4 可数集与不可数集', level: 2 },
  ],
  sections: [
    {
      id: 'sec-4-1',
      heading: '4.1 函数的基本概念与特殊函数',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 X、Y 为非空集合，f 是 X 到 Y 的关系。若对每个 x∈X，存在唯一的 y∈Y 使 (x,y)∈f，则称 f 为 X 到 Y 的<strong>函数</strong>（映射），记 f: X→Y，y = f(x)。X 为定义域，Y 为陪域，f(X) = {f(x) | x∈X} 为值域（像集）。</p>
<p>函数与一般关系的区别：定义域中每个元素都必须有像，且像唯一。</p>
<h3>特殊函数</h3>
<table class="tbl">
<thead><tr><th>类型</th><th>定义</th></tr></thead>
<tbody>
<tr><td>单射（入射）</td><td>x<sub>1</sub>≠x<sub>2</sub> → f(x<sub>1</sub>)≠f(x<sub>2</sub>)；或 f(x<sub>1</sub>)=f(x<sub>2</sub>) → x<sub>1</sub>=x<sub>2</sub></td></tr>
<tr><td>满射</td><td>f(X) = Y，即 Y 中每个元素都有原像</td></tr>
<tr><td>双射（一一对应）</td><td>既是单射又是满射</td></tr>
<tr><td>恒等函数</td><td>I<sub>X</sub>: X→X，I<sub>X</sub>(x)=x</td></tr>
<tr><td>常函数</td><td>f(x)=c（c 为常数）</td></tr>
<tr><td>特征函数</td><td>χ<sub>A</sub>(x)=1（x∈A），0（x∉A）</td></tr>
</tbody>
</table>
<p>有限集情形：若 |X| = |Y| = n，则 f 是单射 ⇔ 满射 ⇔ 双射。无限集不成立（如 f: N→N，f(n)=2n 是单射但非满射）。</p>
<h3>函数的相等与限制</h3>
<p>两个函数相等要求定义域相同且对每个 x 函数值相同。f 在子集 A⊆X 上的<strong>限制</strong> f|<sub>A</sub> 是只对 A 中元素定义的函数。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-2',
      heading: '4.2 复合函数与逆函数',
      blocks: [
        {
          type: 'html',
          html: `
<h3>复合函数</h3>
<p>设 f: X→Y，g: Y→Z，则复合函数 g∘f: X→Z 定义为</p>
<div class="formula"><p>(g∘f)(x) = g(f(x))</p></div>
<p>复合满足结合律：h∘(g∘f) = (h∘g)∘f；一般不满足交换律。恒等函数是复合的单位元：f∘I<sub>X</sub> = I<sub>Y</sub>∘f = f。</p>
<p>性质：若 f、g 都是单射，则 g∘f 是单射；若 f、g 都是满射，则 g∘f 是满射；若 f、g 都是双射，则 g∘f 是双射。反之，g∘f 单射 ⇒ f 单射；g∘f 满射 ⇒ g 满射。</p>
<h3>逆函数</h3>
<p>若 f: X→Y 是双射，则其逆关系 f<sup>−1</sup>: Y→X 也是函数，称为<strong>逆函数</strong>，满足</p>
<div class="formula"><p>f<sup>−1</sup>∘f = I<sub>X</sub>，f∘f<sup>−1</sup> = I<sub>Y</sub></p></div>
<p>只有双射才有逆函数：单射保证逆关系的像唯一，满射保证 Y 中每个元素都有原像。逆函数性质：(f<sup>−1</sup>)<sup>−1</sup> = f；(g∘f)<sup>−1</sup> = f<sup>−1</sup>∘g<sup>−1</sup>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-3',
      heading: '4.3 置换',
      blocks: [
        {
          type: 'html',
          html: `
<p>有限集 X = {1,2,…,n} 到自身的双射称为 <strong>n 元置换</strong>，常记为</p>
<div class="formula"><p>σ = ( 1 2 … n / σ(1) σ(2) … σ(n) )</p></div>
<p>n 元置换共有 n! 个；恒等置换 e 是单位元。</p>
<h3>置换的积与逆</h3>
<p>置换的复合称为置换的<strong>积</strong>，按从右到左（或从左到右，依教材约定）依次作用；置换的逆即把上下两行交换后重排。所有 n 元置换在复合运算下构成<strong>对称群 S<sub>n</sub></strong>。</p>
<h3>轮换</h3>
<p>若置换把 i<sub>1</sub>→i<sub>2</sub>→…→i<sub>k</sub>→i<sub>1</sub>，其余元素不变，则称为一个 k 轮换，记 (i<sub>1</sub> i<sub>2</sub> … i<sub>k</sub>)。任何置换都可分解为若干不相交轮换的乘积，且分解在不计次序时唯一。2 轮换称为对换。</p>
<h3>奇置换与偶置换</h3>
<p>若置换可分解为奇数个对换之积，称为<strong>奇置换</strong>；偶数个对换之积称为<strong>偶置换</strong>。一个置换的奇偶性是确定的（与分解方式无关）。偶置换的全体构成交错群 A<sub>n</sub>，|A<sub>n</sub>| = n!/2（n≥2）。</p>
<div class="callout key">
<p class="callout-h">例</p>
<p>σ = (1 2 3)(4 5) 是一个 3 轮换与一个 2 轮换的积。3 轮换 = 2 个对换，2 轮换 = 1 个对换，故 σ 是奇置换。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-4-4',
      heading: '4.4 可数集与不可数集',
      blocks: [
        {
          type: 'html',
          html: `
<p>集合的<strong>基数</strong>刻画集合的大小。若存在 X 到 Y 的双射，则称 X 与 Y <strong>等势</strong>，记 |X| = |Y|。</p>
<ul>
<li><strong>有限集</strong>：与某个 {1,2,…,n} 等势；</li>
<li><strong>可数集</strong>（可列集）：与自然数集 N 等势的集合，基数记 ℵ<sub>0</sub>；有限集与可数集统称<strong>至多可数集</strong>；</li>
<li><strong>不可数集</strong>：不是可数集的无限集，如实数集 R，基数记 ℵ（连续统）。</li>
</ul>
<h3>重要结论</h3>
<ul>
<li>整数集 Z、有理数集 Q 都是可数集；</li>
<li>可数集的有限并、可数并仍可数；可数个可数集的并仍可数；</li>
<li>实数集 R 不可数（Cantor 对角线法）；</li>
<li>任何无限集都包含一个可数子集；</li>
<li>无限集可以与其真子集等势（如 N 与偶数集），这是无限集的特征性质。</li>
</ul>
<div class="callout key">
<p class="callout-h">Cantor 对角线法</p>
<p>假设 (0,1) 内实数可枚举为 r<sub>1</sub>, r<sub>2</sub>, …，把每个 r<sub>i</sub> 写成小数，构造一个新数 d，使其第 i 位与 r<sub>i</sub> 的第 i 位不同；则 d 不在列表中，矛盾。故 (0,1) 不可数，R 也不可数。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck4;

/* 第 1 章 基本计数问题 —— 依据课件 1.1～1.7 共 7 份 PPT 整理 */
import type { GenChapter } from '../types';

const ch1: GenChapter = {
  id: 'deck1',
  no: '第1章',
  title: '基本计数问题',
  subtitle: '加法原则与乘法原则 · 集合的排列与组合 · 重集的排列与组合 · 分配问题 · 生成算法 · 二项式系数',
  lede:
    '<p>计数是组合数学的起点。本章从两条最基本的计数原则（加法原则、乘法原则）出发，依次讨论集合的排列与组合、圆排列、重集的排列与组合、分配问题（球与盒的模型）、排列与组合的生成算法，最后给出二项式系数及其性质。</p>',
  toc: [
    { id: 'sec-comb1-principle', text: '1.1 加法原则与乘法原则', level: 2 },
    { id: 'sec-comb1-perm', text: '1.2 集合的排列与组合', level: 2 },
    { id: 'sec-comb1-multi', text: '1.3 重集的排列与组合', level: 2 },
    { id: 'sec-comb1-dist', text: '1.4 分配问题', level: 2 },
    { id: 'sec-comb1-gen', text: '1.5～1.6 排列与组合的生成算法', level: 2 },
    { id: 'sec-comb1-binom', text: '1.7 二项式系数', level: 2 },
  ],
  sections: [
    {
      id: 'sec-comb1-principle',
      heading: '1.1 加法原则与乘法原则',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>加法原则</strong>（addition principle）：全体等于它各部分的和。要计数的集合 S 划分成不太多的易于处理的块 S₁, S₂, …, Sₙ，则 <code>|S| = |S₁| + |S₂| + … + |Sₙ|</code>。</p>
            <p><strong>乘法原则</strong>（multiplication principle）：完成一件事分 n 步，第 i 步有 rᵢ 种方式，则总方式数为 <code>r₁ × r₂ × … × rₙ</code>。注意：后步结果可随前步结果而变化，但每步完成方式的数量却是固定不变、不依赖任何一步。</p>
            <p>例 1.1.1：在 1000 到 9999 之间有多少个各位数字不同的奇数？分四步：个位可取 1、3、5、7、9 共 5 种；千位不能取 0、也不能取个位已选定的数字，有 8 种；百位有 8 种；十位有 7 种。故共 <code>5×8×8×7 = 2240</code> 个。（若先定千位再定个位，则个位选法要分「千位为奇数/偶数」讨论，这正是「步的顺序会影响计数难度」的例子。）</p>
            <p>例 1.1.2：用 a,b,c,d,e,f 做三字母串，字母可重复且要包含字母 e，共构成多少个？解一按 e 的位置分三类：<code>e□□</code> 有 6×6=36 个；<code>□e□</code>（首位不能取 e）有 5×6=30 个；<code>□□e</code>（前两位都不能取 e）有 5×5=25 个，合计 36+30+25=91。解二按 e 的个数分类：含一个 e 的三类各 25 个、含两个 e 的三类各 5 个、含三个 e 的 1 个（eee），合计 25+25+25+5+5+5+1=91。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb1-perm',
      heading: '1.2 集合的排列与组合',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>r 排列</strong>：从 n 个元素的集合 S 中任取 r 个元素，按一定次序排成一列；取 r=n 时称为全排列。r 排列的个数记为 <code>P(n,r)</code>：若 r&gt;n 则 P(n,r)=0；对任意正整数 n，P(n,1)=n；规定 P(n,0)=1。</p>
            <p><strong>定理 1.2.1</strong>：设 n、r 为正整数且 r≤n，则</p>
            <pre><code>P(n,r) = n(n−1)…(n−r+1) = n! / (n−r)!</code></pre>
            <p>证明：r 排列的第 1 位从 n 个元素中任取一个，第 2 位从剩下 n−1 个中任取一个……第 r 位从剩下 n−r+1 个中任取一个，由乘法原则即得。</p>
            <p><strong>r 组合</strong>：从 n 个元素中任取 r 个元素，无序地放在一起（即组成 S 的一个子集），个数记为 <code>C(n,r)</code>。规定 C(n,0)=1、C(n,n)=1，r&gt;n 时为 0。</p>
            <p><strong>定理 1.2.2</strong>：<code>C(n,r) = P(n,r) / r! = n! / (r!(n−r)!)</code>。证明：r 排列可两步产生——先从 S 中取 r 个元素（C(n,r) 种），再把 r 个元素排成一列（r! 种），由乘法原则得 <code>P(n,r)=C(n,r)·r!</code>。</p>
            <p><strong>定理 1.2.3</strong>：<code>C(n,0)+C(n,1)+…+C(n,n) = 2ⁿ</code>。证明：一方面 S 的全部组合按大小分类；另一方面构造组合时逐个元素决定「取或不取」，每个元素 2 种选择，共 2ⁿ 种。</p>
            <p><strong>圆排列</strong>：在圆周上排列，只考虑元素彼此间的相邻位置。n 个元素的圆排列数为 <code>(n−1)!</code>（线排列 n! 种，每种圆排列被重复计算 n 次）。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb1-multi',
      heading: '1.3 重集的排列与组合',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>重集</strong>是允许元素重复出现的集合，记作 <code>S = {n₁·a₁, n₂·a₂, …, n_k·a_k}</code>（n_i 为元素 a_i 的重复次数，可为 ∞）。</p>
            <p><strong>重集的排列</strong>：设 S 有 k 种元素、第 i 种重复 n_i 次、总数 n=n₁+…+n_k，则 S 的全排列数为</p>
            <pre><code>n! / (n₁! n₂! … n_k!)</code></pre>
            <p>理由是先从 n 个位置中选出 n₁ 个放 a₁、再选 n₂ 个放 a₂……由乘法原则与组合数即得。</p>
            <p><strong>重集的组合</strong>：从重集 S 中取 r 个元素的组合数，等价于「把 r 个相同的球放入 k 个不同的盒子」的非负整数解个数。当每种元素都可重复取（∞）时，r 组合数为</p>
            <pre><code>C(k+r−1, r)</code></pre>
            <p>这一结果可用「隔板法」理解：把 r 个相同的球排成一列，用 k−1 块隔板分成 k 段，方案数即从 r+k−1 个位置中选 k−1 个放隔板。<strong>1.4 分配问题</strong>正是用「球是否相同、盒是否相同、容量是否受限」把这些模型系统化。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb1-dist',
      heading: '1.4 分配问题',
      blocks: [
        {
          type: 'html',
          html: `
            <p>分配问题按三个维度分类：球<strong>相同/不同</strong>、盒<strong>相同/不同</strong>、容量<strong>是否受限</strong>。常见模型与计数结果：</p>
            <table class="tbl">
              <thead><tr><th>球</th><th>盒</th><th>容量</th><th>方案数</th></tr></thead>
              <tbody>
                <tr><td>不同</td><td>不同</td><td>不限</td><td>kⁿ（每个球独立选择盒子）</td></tr>
                <tr><td>不同</td><td>不同</td><td>每盒至多 1 个</td><td>P(n,k)（n 个球中取 k 个排列）</td></tr>
                <tr><td>相同</td><td>不同</td><td>不限</td><td>C(n+k−1, n)（隔板法）</td></tr>
                <tr><td>相同</td><td>不同</td><td>每盒至少 1 个</td><td>C(n−1, k−1)</td></tr>
                <tr><td>相同</td><td>相同</td><td>不限</td><td>整数拆分 p(n)，无简单闭式</td></tr>
                <tr><td>不同</td><td>相同</td><td>不限</td><td>第二类 Stirling 数 S(n,k)</td></tr>
              </tbody>
            </table>
            <p>解题的关键是先判断「球是否可区分」「盒是否可区分」「容量约束」，再选择相应的模型；同一问题换一种视角（如「相同球放入不同盒」与「重集的组合」）往往能得到相同的计数公式。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb1-gen',
      heading: '1.5～1.6 排列与组合的生成算法',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>排列的生成</strong>：字典序法——从当前排列出发，找最右边的「升序对」位置 i，在 i 右侧找比 a_i 大的最小元素与之交换，再把 i 右侧元素反转为升序，即得下一个排列。n 个元素的全部排列可按字典序不重不漏地枚举。</p>
            <p><strong>组合的生成</strong>：把组合表示为递增序列 <code>c₁&lt;c₂&lt;…&lt;c_r</code>，从 <code>{1,2,…,r}</code> 开始，每次从右向左找到第一个还能增大的位置、把它加 1、并把右侧元素重置为连续值，即得下一个组合。字典序生成的好处是无需存储全部结果、可逐个处理。</p>
            <p>这些生成算法是回溯搜索与枚举类算法的基础：先定义「下一个」的规则，就能用循环遍历所有方案，并可在生成过程中剪枝。</p>`,
        },
      ],
    },
    {
      id: 'sec-comb1-binom',
      heading: '1.7 二项式系数',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>二项式定理</strong>：<code>(x+y)ⁿ = Σ_{r=0..n} C(n,r) x^{n−r} y^r</code>，其中 C(n,r) 称为二项式系数。它可由「从 n 个因式中选 r 个取 y」的计数解释直接得到。</p>
            <p>基本性质：<code>C(n,r)=C(n,n−r)</code>（对称性）；<code>C(n,r)=C(n−1,r−1)+C(n−1,r)</code>（Pascal 公式，构成杨辉三角）；<code>Σ C(n,r)=2ⁿ</code>；<code>Σ (−1)^r C(n,r)=0</code>（n≥1）。</p>
            <p>组合恒等式常用两种方法证明：<strong>代数法</strong>（利用公式变形）与<strong>组合法</strong>（对同一计数对象用两种方式计数，即「算两次」）。后者往往更简洁，也更能体现组合数学的思想。</p>`,
        },
      ],
    },
  ],
};

export default ch1;

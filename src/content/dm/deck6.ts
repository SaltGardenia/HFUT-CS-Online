import type { DeckData } from '../types';

/** 第6章 环与格 —— 课件 PPT/6.1（环、理想与特征、分配格与有补格、布尔代数） */
const deck6: DeckData = {
  id: 'deck6',
  no: '第6章',
  title: '环与格',
  subtitle: '环的定义与性质 · 特殊环与域 · 子环 · 理想与特征 · 分配格与有补格 · 布尔代数',
  lede:
    '在群的基础上增加第二种运算，就得到环；在集合上定义偏序并引入交、并运算，就得到格。本章先讨论环的定义、性质、特殊环（整环、域）、子环、理想与特征，再讨论格的代数定义、分配格、有补格与布尔代数，把代数结构与序结构联系起来。',
  toc: [
    { id: 'sec-6-1', text: '6.1 环的定义与性质', level: 2 },
    { id: 'sec-6-2', text: '6.2 特殊环、域与子环', level: 2 },
    { id: 'sec-6-3', text: '6.3 理想与特征', level: 2 },
    { id: 'sec-6-4', text: '6.4 格、分配格与有补格', level: 2 },
    { id: 'sec-6-5', text: '6.5 布尔代数', level: 2 },
  ],
  sections: [
    {
      id: 'sec-6-1',
      heading: '6.1 环的定义与性质',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 R 非空，定义两种二元运算 +（加法）与 ·（乘法）。若满足</p>
<ol>
<li>(R, +) 是<strong>阿贝尔群</strong>（加法封闭、结合、有幺元 0、每个元素有负元、交换）；</li>
<li>(R, ·) 是<strong>半群</strong>（乘法封闭、结合）；</li>
<li>乘法对加法满足<strong>分配律</strong>：a·(b+c)=a·b+a·c，(b+c)·a=b·a+c·a，</li>
</ol>
<p>则称 (R, +, ·) 为<strong>环</strong>。</p>
<h3>基本性质</h3>
<ul>
<li>a·0 = 0·a = 0；</li>
<li>a·(−b) = (−a)·b = −(a·b)；(−a)·(−b) = a·b；</li>
<li>n·a 表示 a 的 n 倍（加法群中的倍数），满足分配律；</li>
<li>若乘法还满足交换律，称为<strong>交换环</strong>；若乘法有幺元 1，称为<strong>含幺环</strong>。</li>
</ul>
<p>环中可以有零因子：若 a≠0、b≠0 但 a·b=0，则 a、b 为零因子。例如 Z<sub>6</sub> 中 2·3=0。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-2',
      heading: '6.2 特殊环、域与子环',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>结构</th><th>条件</th></tr></thead>
<tbody>
<tr><td>交换环</td><td>乘法交换</td></tr>
<tr><td>含幺环</td><td>乘法有幺元 1</td></tr>
<tr><td>无零因子环</td><td>a·b=0 ⇒ a=0 或 b=0</td></tr>
<tr><td>整环</td><td>交换、含幺、无零因子、1≠0</td></tr>
<tr><td>除环（体）</td><td>每个非零元对乘法有逆元</td></tr>
<tr><td>域</td><td>交换的除环</td></tr>
</tbody>
</table>
<p>关系：域 ⇒ 整环；有限整环必为域。例：Z 是整环但不是域；Q、R、C 是域；Z<sub>p</sub>（p 为素数）是有限域；Z<sub>n</sub>（n 合数）有零因子，不是整环。</p>
<h3>子环</h3>
<p>若 S⊆R 非空，且 S 对 R 的加法与乘法构成环，则称 S 为 R 的子环。判定：S 非空，对减法与乘法封闭（∀a,b∈S，a−b∈S，a·b∈S）即可。</p>
<p>例：nZ 是 Z 的子环；Z 是 Q 的子环；Q 是 R 的子环。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-3',
      heading: '6.3 理想与特征',
      blocks: [
        {
          type: 'html',
          html: `
<p>设 I 是环 R 的非空子集。若</p>
<ol>
<li>I 是 R 的加法子群；</li>
<li>对任意 a∈I、r∈R，有 r·a∈I 且 a·r∈I（吸收性），</li>
</ol>
<p>则称 I 为 R 的<strong>理想</strong>。理想是特殊的子环，用于构造商环。</p>
<ul>
<li>{0} 与 R 称为平凡理想；</li>
<li>若 R 是交换环，a∈R，则 (a) = {r·a | r∈R} 是由 a 生成的<strong>主理想</strong>；</li>
<li>除环（域）只有平凡理想；</li>
<li>理想的和、交仍是理想。</li>
</ul>
<h3>特征</h3>
<p>环 R 的特征 char R 是使 n·1 = 0 的最小正整数 n；若不存在，则特征为 0。整环的特征或为 0 或为素数。例：Z、Q、R 的特征为 0；Z<sub>p</sub> 的特征为 p。</p>
<div class="callout key">
<p class="callout-h">结构层次</p>
<p>半群 → 独异点 → 群 → 阿贝尔群；环 = 加法阿贝尔群 + 乘法半群 + 分配律；整环 → 域。理想是环论中构造商结构的关键，正如正规子群在群论中的地位。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-6-4',
      heading: '6.4 格、分配格与有补格',
      blocks: [
        {
          type: 'html',
          html: `
<h3>格的两种定义</h3>
<p><strong>序定义</strong>：设 (L, ≼) 为偏序集，若对任意 a,b∈L，{a,b} 都有最小上界（并 a∨b）与最大下界（交 a∧b），则称 L 为<strong>格</strong>。</p>
<p><strong>代数定义</strong>：设 L 非空，∨、∧ 为 L 上的二元运算，若满足交换律、结合律、吸收律（a∨(a∧b)=a，a∧(a∨b)=a），则称 (L, ∨, ∧) 为格。两种定义等价。</p>
<h3>格的性质</h3>
<ul>
<li>幂等律：a∨a=a，a∧a=a（由吸收律推出）；</li>
<li>a∧b ≼ a ≼ a∨b；</li>
<li>a ≼ b ⇔ a∧b=a ⇔ a∨b=b；</li>
<li>保序性：若 a≼b、c≼d，则 a∨c≼b∨d，a∧c≼b∧d。</li>
</ul>
<h3>分配格</h3>
<p>若格中运算满足分配律：a∧(b∨c)=(a∧b)∨(a∧c)，a∨(b∧c)=(a∨b)∧(a∨c)，则称为<strong>分配格</strong>。判定：格是分配格 ⇔ 不含与 M<sub>5</sub>（五边形）或 N<sub>5</sub>（钻石）同构的子格。链（全序集）都是分配格。</p>
<h3>有补格</h3>
<p>若格 L 有最大元 1 与最小元 0，且对每个 a∈L 存在 b∈L 使 a∨b=1、a∧b=0，则称 b 为 a 的补元，L 为<strong>有补格</strong>。补元不一定唯一；分配格中补元若存在则唯一。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-5',
      heading: '6.5 布尔代数',
      blocks: [
        {
          type: 'html',
          html: `
<p>有补的分配格称为<strong>布尔代数</strong>，记 (B, ∨, ∧, ¬, 0, 1)。它同时具备格运算与补运算，是最重要的代数结构之一。</p>
<h3>运算律</h3>
<table class="tbl">
<thead><tr><th>律</th><th>形式</th></tr></thead>
<tbody>
<tr><td>交换律</td><td>a∨b=b∨a，a∧b=b∧a</td></tr>
<tr><td>结合律</td><td>(a∨b)∨c=a∨(b∨c)，(a∧b)∧c=a∧(b∧c)</td></tr>
<tr><td>分配律</td><td>a∧(b∨c)=(a∧b)∨(a∧c)，a∨(b∧c)=(a∨b)∧(a∨c)</td></tr>
<tr><td>同一律</td><td>a∨0=a，a∧1=a</td></tr>
<tr><td>支配律</td><td>a∨1=1，a∧0=0</td></tr>
<tr><td>补律</td><td>a∨¬a=1，a∧¬a=0</td></tr>
<tr><td>双重否定</td><td>¬¬a=a</td></tr>
<tr><td>德摩根律</td><td>¬(a∨b)=¬a∧¬b，¬(a∧b)=¬a∨¬b</td></tr>
<tr><td>吸收律</td><td>a∨(a∧b)=a，a∧(a∨b)=a</td></tr>
</tbody>
</table>
<h3>典型例子</h3>
<ul>
<li>幂集布尔代数 (P(S), ∪, ∩, ~, ∅, S)；</li>
<li>二值布尔代数 ({0,1}, ∨, ∧, ¬, 0, 1)，即命题逻辑的真值代数；</li>
<li>n 元布尔代数与 {0,1}<sup>n</sup> 同构（每个有限布尔代数的元素个数为 2<sup>n</sup>）。</li>
</ul>
<p>布尔代数与命题逻辑、数字电路一一对应：∨ 对应析取 / 或门，∧ 对应合取 / 与门，¬ 对应否定 / 非门，0、1 对应假、真。命题公式的主析取范式、主合取范式正是布尔函数的标准表示。</p>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>环在加法群上叠加乘法半群与分配律；理想用于构造商环；格把偏序与交并运算统一；分配格 + 有补 = 布尔代数。布尔代数是命题逻辑与数字电路的共同代数基础。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck6;

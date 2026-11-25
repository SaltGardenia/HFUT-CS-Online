import type { DeckData } from '../types';

/** 第1章 命题逻辑 —— 课件 PPT/1.1～1.9（命题联结词、真值表、等价、蕴含、范式、推理） */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1章',
  title: '命题逻辑',
  subtitle: '命题与联结词 · 真值表 · 逻辑等价 · 蕴含 · 全功能集 · 范式 · 命题推理',
  lede:
    '数理逻辑用数学方法研究推理的形式结构。命题逻辑以命题为最小单位，研究由联结词组合而成的复合命题及其真值规律。本章掌握五个基本联结词、命题公式与真值表、等价式与蕴含式、全功能集、析取 / 合取范式与主范式，以及有效推理的判定与证明方法。',
  toc: [
    { id: 'sec-1-1', text: '1.1 命题与联结词', level: 2 },
    { id: 'sec-1-2', text: '1.2 命题公式与真值表', level: 2 },
    { id: 'sec-1-3', text: '1.3 逻辑等价与命题定律', level: 2 },
    { id: 'sec-1-4', text: '1.4 蕴含式', level: 2 },
    { id: 'sec-1-5', text: '1.5 联结词的全功能集', level: 2 },
    { id: 'sec-1-6', text: '1.6 范式与主范式', level: 2 },
    { id: 'sec-1-7', text: '1.7 命题逻辑推理理论', level: 2 },
    { id: 'sec-1-8', text: '1.8 主范式的应用', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '1.1 命题与联结词',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>命题</strong>是能判断真假的陈述句；真值为真记 T（1），为假记 F（0）。不能判断真假的句子、疑问句、祈使句、感叹句都不是命题。命题分为<strong>原子命题</strong>（不能再分解）与<strong>复合命题</strong>（由原子命题通过联结词组合）。</p>
<table class="tbl">
<thead><tr><th>联结词</th><th>符号</th><th>读法</th><th>真值规则</th></tr></thead>
<tbody>
<tr><td>否定</td><td>¬P</td><td>非 P</td><td>P 真则 ¬P 假，P 假则 ¬P 真</td></tr>
<tr><td>合取</td><td>P ∧ Q</td><td>P 且 Q</td><td>仅当 P、Q 都真时为真</td></tr>
<tr><td>析取</td><td>P ∨ Q</td><td>P 或 Q</td><td>仅当 P、Q 都假时为假（可兼或）</td></tr>
<tr><td>条件</td><td>P → Q</td><td>若 P 则 Q</td><td>仅当 P 真 Q 假时为假</td></tr>
<tr><td>双条件</td><td>P ↔ Q</td><td>P 当且仅当 Q</td><td>P、Q 真值相同时为真</td></tr>
</tbody>
</table>
<h3>各联结词要点</h3>
<ul>
<li><strong>否定</strong>：一元联结词，把真变假、假变真。</li>
<li><strong>合取</strong>：与自然语言「并且、不但…而且、虽然…但是」对应；交换律成立。</li>
<li><strong>析取</strong>：自然语言「或」有「可兼或」与「排斥或」之分；命题逻辑的 ∨ 是可兼或。排斥或可表示为 (P∧¬Q)∨(¬P∧Q)。</li>
<li><strong>条件</strong>：P 为前件、Q 为后件。P→Q 在 P 假时恒为真（善意推定 / 空真）。自然语言中「只要…就、只有…才、除非…否则」等需先辨清前件后件。</li>
<li><strong>双条件</strong>：P↔Q 等价于 (P→Q)∧(Q→P)，也等价于 P、Q 同真同假。</li>
</ul>
<h3>混合运算的优先级</h3>
<p>一般约定：¬ 最高，其次 ∧，再次 ∨，然后 →，最后 ↔；同级从左到右。需要改变次序时加括号。例如 ¬P∧Q→R 理解为 ((¬P)∧Q)→R。</p>
<div class="callout key">
<p class="callout-h">翻译练习的步骤</p>
<ol>
<li>找出原子命题并符号化（P、Q、R…）；</li>
<li>识别自然语言中的联结词，注意「不…」「除非」「只有」的否定与条件方向；</li>
<li>按优先级补全括号，得到命题公式。</li>
</ol>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '1.2 命题公式与真值表',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>命题变元</strong>是以「真、假」为取值范围的变量；由命题变元、联结词和括号按规则组成的符号串称为<strong>命题公式</strong>（合式公式）。公式的<strong>赋值</strong>是对其中每个命题变元指定一个真值。</p>
<h3>真值表</h3>
<p>列出公式在所有赋值下真值的表称为真值表。构造步骤：</p>
<ol>
<li>列出所有命题变元，按二进制顺序写出 2<sup>n</sup> 组赋值；</li>
<li>由内向外逐层计算各子公式的真值；</li>
<li>最后一列给出整个公式的真值。</li>
</ol>
<pre class="code"><code>P  Q | ¬P | P∧Q | P∨Q | P→Q | P↔Q
T  T |  F |  T  |  T  |  T  |  T
T  F |  F |  F  |  T  |  F  |  F
F  T |  T |  F  |  T  |  T  |  F
F  F |  T |  F  |  F  |  T  |  T</code></pre>
<h3>命题公式的分类</h3>
<ul>
<li><strong>重言式（永真式）</strong>：所有赋值下都为真，如 P∨¬P；</li>
<li><strong>矛盾式（永假式）</strong>：所有赋值下都为假，如 P∧¬P；</li>
<li><strong>可满足式</strong>：至少存在一组赋值使其为真。重言式一定是可满足式，反之不然。</li>
</ul>
<p>判定方法：真值表法（枚举全部赋值）、等值演算法（化简为已知重言式）、主范式法（主析取范式含全部小项则为重言式）。</p>
<h3>翻译</h3>
<p>把自然语言命题翻译为命题公式时，先明确各原子命题的含义，再按语义选择联结词。例：「如果明天不下雨并且气温高于 20℃，我们就去爬山」可表示为 (¬R ∧ T) → C。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '1.3 逻辑等价与命题定律',
      blocks: [
        {
          type: 'html',
          html: `
<p>若公式 A、B 在所有赋值下真值都相同，则称 A 与 B <strong>逻辑等价</strong>，记 A ⇔ B（或 A = B）。注意 ⇔ 是元语言符号，表示两个公式等价；↔ 是对象语言中的双条件联结词。A ⇔ B 当且仅当 A↔B 是重言式。</p>
<h3>基本等价式（命题定律）</h3>
<table class="tbl">
<thead><tr><th>名称</th><th>等价式</th></tr></thead>
<tbody>
<tr><td>双重否定</td><td>¬¬P ⇔ P</td></tr>
<tr><td>幂等律</td><td>P∨P ⇔ P，P∧P ⇔ P</td></tr>
<tr><td>交换律</td><td>P∨Q ⇔ Q∨P，P∧Q ⇔ Q∧P</td></tr>
<tr><td>结合律</td><td>(P∨Q)∨R ⇔ P∨(Q∨R)，(P∧Q)∧R ⇔ P∧(Q∧R)</td></tr>
<tr><td>分配律</td><td>P∨(Q∧R) ⇔ (P∨Q)∧(P∨R)；P∧(Q∨R) ⇔ (P∧Q)∨(P∧R)</td></tr>
<tr><td>德摩根律</td><td>¬(P∨Q) ⇔ ¬P∧¬Q，¬(P∧Q) ⇔ ¬P∨¬Q</td></tr>
<tr><td>吸收律</td><td>P∨(P∧Q) ⇔ P，P∧(P∨Q) ⇔ P</td></tr>
<tr><td>同一律</td><td>P∨F ⇔ P，P∧T ⇔ P</td></tr>
<tr><td>零律</td><td>P∨T ⇔ T，P∧F ⇔ F</td></tr>
<tr><td>排中律</td><td>P∨¬P ⇔ T</td></tr>
<tr><td>矛盾律</td><td>P∧¬P ⇔ F</td></tr>
<tr><td>蕴涵等值式</td><td>P→Q ⇔ ¬P∨Q</td></tr>
<tr><td>等价等值式</td><td>P↔Q ⇔ (P→Q)∧(Q→P)</td></tr>
<tr><td>假言易位</td><td>P→Q ⇔ ¬Q→¬P</td></tr>
<tr><td>等价否定</td><td>P↔Q ⇔ ¬P↔¬Q</td></tr>
<tr><td>归谬论</td><td>(P→Q)∧(P→¬Q) ⇔ ¬P</td></tr>
</tbody>
</table>
<h3>等值演算</h3>
<p>从某个公式出发，反复使用等价式替换子公式，得到与之等价的公式，称为等值演算。常用技巧：消去 → 和 ↔；用德摩根律把 ¬ 内移；用分配律化为析取 / 合取形式；用吸收律、幂等律化简。</p>
<div class="callout key">
<p class="callout-h">示例</p>
<p>证明 P→(Q→R) ⇔ (P∧Q)→R：<br/>
左 = ¬P∨(¬Q∨R) = (¬P∨¬Q)∨R = ¬(P∧Q)∨R = (P∧Q)→R。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '1.4 蕴含式',
      blocks: [
        {
          type: 'html',
          html: `
<p>若 A→B 是重言式，则称 A <strong>蕴含</strong> B，记 A ⇒ B。A ⇒ B 与 A→B 的区别同 ⇔ 与 ↔：前者是公式间的推理关系，后者是联结词。</p>
<h3>证明蕴含的常用方法</h3>
<ol>
<li><strong>真值表法</strong>：验证 A→B 在所有赋值下为真；</li>
<li><strong>等值演算法</strong>：把 A→B 化为 T；</li>
<li><strong>假设前件真法</strong>：假定 A 为真，推出 B 为真；</li>
<li><strong>假设后件假法</strong>：假定 B 为假，推出 A 为假（逆否）；</li>
<li><strong>主范式法</strong>：A 的主析取范式的小项集合包含于 B 的主析取范式。</li>
</ol>
<h3>常用蕴含式</h3>
<table class="tbl">
<thead><tr><th>名称</th><th>蕴含式</th></tr></thead>
<tbody>
<tr><td>附加律</td><td>P ⇒ P∨Q</td></tr>
<tr><td>化简律</td><td>P∧Q ⇒ P，P∧Q ⇒ Q</td></tr>
<tr><td>假言推理（分离规则）</td><td>(P→Q)∧P ⇒ Q</td></tr>
<tr><td>拒取式</td><td>(P→Q)∧¬Q ⇒ ¬P</td></tr>
<tr><td>析取三段论</td><td>(P∨Q)∧¬P ⇒ Q</td></tr>
<tr><td>假言三段论</td><td>(P→Q)∧(Q→R) ⇒ P→R</td></tr>
<tr><td>等价三段论</td><td>(P↔Q)∧(Q↔R) ⇒ P↔R</td></tr>
<tr><td>构造性二难</td><td>(P→Q)∧(R→S)∧(P∨R) ⇒ Q∨S</td></tr>
<tr><td>破坏性二难</td><td>(P→Q)∧(R→S)∧(¬Q∨¬S) ⇒ ¬P∨¬R</td></tr>
</tbody>
</table>
<h3>蕴含的性质</h3>
<ul>
<li>自反性：A ⇒ A；</li>
<li>反对称性：若 A ⇒ B 且 B ⇒ A，则 A ⇔ B；</li>
<li>传递性：若 A ⇒ B 且 B ⇒ C，则 A ⇒ C；</li>
<li>若 A ⇒ B 且 A ⇒ C，则 A ⇒ B∧C；</li>
<li>若 A ⇒ C 且 B ⇒ C，则 A∨B ⇒ C。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '1.5 联结词的全功能集',
      blocks: [
        {
          type: 'html',
          html: `
<p>若任一命题公式都可用联结词集合 S 中的联结词等价表示，则称 S 为<strong>全功能集</strong>（功能完备集）。例如 {¬, ∧, ∨}、{¬, →} 都是全功能集。</p>
<h3>与非、或非、条件否定、异或</h3>
<table class="tbl">
<thead><tr><th>联结词</th><th>符号</th><th>定义</th></tr></thead>
<tbody>
<tr><td>与非（Sheffer 竖）</td><td>P ↑ Q</td><td>¬(P∧Q)</td></tr>
<tr><td>或非（Peirce 箭头）</td><td>P ↓ Q</td><td>¬(P∨Q)</td></tr>
<tr><td>条件否定</td><td>P ↛ Q</td><td>¬(P→Q) ⇔ P∧¬Q</td></tr>
<tr><td>异或</td><td>P ⊕ Q</td><td>(P∧¬Q)∨(¬P∧Q)，P、Q 不同时为真</td></tr>
</tbody>
</table>
<h3>最小全功能集</h3>
<ul>
<li>{↑} 与 {↓} 都是最小全功能集：¬P ⇔ P↑P，P∧Q ⇔ (P↑Q)↑(P↑Q)，P∨Q ⇔ (P↑P)↑(Q↑Q)；</li>
<li>{¬, ∧}、{¬, ∨}、{¬, →} 也是全功能集；</li>
<li>{∧, ∨} 不是全功能集（无法表示否定）。</li>
</ul>
<p>异或的性质：交换律、结合律成立；P⊕P ⇔ F，P⊕F ⇔ P，P⊕T ⇔ ¬P；异或与双条件互为否定：P⊕Q ⇔ ¬(P↔Q)。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-6',
      heading: '1.6 范式与主范式',
      blocks: [
        {
          type: 'html',
          html: `
<h3>基本积与基本和</h3>
<ul>
<li><strong>基本积</strong>（小项式的合取式）：有限个命题变元或其否定的合取，每个变元最多出现一次；</li>
<li><strong>基本和</strong>：有限个命题变元或其否定的析取，每个变元最多出现一次。</li>
</ul>
<h3>析取范式与合取范式</h3>
<ul>
<li><strong>析取范式</strong>：基本积的析取，形如 A<sub>1</sub>∨A<sub>2</sub>∨…∨A<sub>n</sub>；</li>
<li><strong>合取范式</strong>：基本和的合取，形如 B<sub>1</sub>∧B<sub>2</sub>∧…∧B<sub>n</sub>。</li>
</ul>
<p>求法：消去 →、↔；用德摩根律把 ¬ 内移；用分配律展开并化简。任何公式都存在与之等价的析取范式和合取范式，但形式不唯一。</p>
<h3>小项与大项</h3>
<p>设公式含 n 个命题变元 P<sub>1</sub>,…,P<sub>n</sub>：</p>
<ul>
<li><strong>小项</strong> m<sub>i</sub>：n 个变元或其否定的合取，且每个变元恰出现一次；共 2<sup>n</sup> 个小项。小项仅在一种赋值下为真。</li>
<li><strong>大项</strong> M<sub>i</sub>：n 个变元或其否定的析取，且每个变元恰出现一次；共 2<sup>n</sup> 个大项。大项仅在一种赋值下为假。</li>
<li>m<sub>i</sub> 与 M<sub>i</sub> 互为否定：¬m<sub>i</sub> ⇔ M<sub>i</sub>。</li>
</ul>
<p>编码约定：变元按 P<sub>1</sub>…P<sub>n</sub> 排列，取 1 表示原变元、取 0 表示否定；把该二进制串对应的十进制数作为下标。例如两个变元 P、Q：m<sub>00</sub> = ¬P∧¬Q = m<sub>0</sub>，m<sub>01</sub> = ¬P∧Q = m<sub>1</sub>，m<sub>10</sub> = P∧¬Q = m<sub>2</sub>，m<sub>11</sub> = P∧Q = m<sub>3</sub>。</p>
<h3>主析取范式与主合取范式</h3>
<ul>
<li><strong>主析取范式</strong>：由小项组成的析取范式（每个小项含全部 n 个变元）；</li>
<li><strong>主合取范式</strong>：由大项组成的合取范式。</li>
</ul>
<p>求主析取范式：写真值表，取公式为真的行对应的小项，析取起来；求主合取范式：取公式为假的行对应的大项，合取起来。两者关系：若主析取范式含小项下标集合 S，则主合取范式含大项下标集合为补集。</p>
<div class="callout key">
<p class="callout-h">唯一性</p>
<p>任何命题公式的主析取范式（在不计小项次序时）是唯一的；主合取范式同理。因此主范式可用于判定两个公式是否等价、判断公式类型、计数可满足赋值。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-7',
      heading: '1.7 命题逻辑推理理论',
      blocks: [
        {
          type: 'html',
          html: `
<p>推理是从前提集合 Γ 推出结论 B 的思维过程，记 Γ ⊢ B。若对任意赋值，只要 Γ 中所有公式为真就有 B 为真，则称推理<strong>有效</strong>（Γ ⇒ B）。</p>
<h3>有效推理的判定</h3>
<ol>
<li><strong>真值表法</strong>：检查所有使前提全真的赋值下结论是否为真；</li>
<li><strong>等值演算法</strong>：证明 (A<sub>1</sub>∧…∧A<sub>n</sub>)→B 是重言式；</li>
<li><strong>主析取范式法</strong>：前提合取式的主析取范式小项集合包含结论的主析取范式小项集合；</li>
<li><strong>形式证明法</strong>：由前提出发，反复使用推理规则推出结论。</li>
</ol>
<h3>推理规则</h3>
<table class="tbl">
<thead><tr><th>规则</th><th>形式</th></tr></thead>
<tbody>
<tr><td>前提引入</td><td>前提可随时引入</td></tr>
<tr><td>结论引入</td><td>已推出的结论可作为后续前提</td></tr>
<tr><td>置换规则</td><td>公式中的子公式可用等值式替换</td></tr>
<tr><td>假言推理</td><td>P→Q，P ⊢ Q</td></tr>
<tr><td>拒取式</td><td>P→Q，¬Q ⊢ ¬P</td></tr>
<tr><td>析取三段论</td><td>P∨Q，¬P ⊢ Q</td></tr>
<tr><td>假言三段论</td><td>P→Q，Q→R ⊢ P→R</td></tr>
<tr><td>化简 / 附加</td><td>P∧Q ⊢ P；P ⊢ P∨Q</td></tr>
<tr><td>合取</td><td>P，Q ⊢ P∧Q</td></tr>
<tr><td>构造性二难</td><td>P→Q，R→S，P∨R ⊢ Q∨S</td></tr>
</tbody>
</table>
<h3>证明方法</h3>
<ul>
<li><strong>直接证明</strong>：从前提出发逐步推出结论；</li>
<li><strong>附加前提法（CP 规则）</strong>：要证 Γ ⊢ P→Q，可把 P 加入前提，证 Γ∪{P} ⊢ Q；</li>
<li><strong>归谬法（反证法）</strong>：要证 Γ ⊢ Q，可把 ¬Q 加入前提，推出矛盾（如 R∧¬R）。</li>
</ul>
<div class="callout key">
<p class="callout-h">例：构造性二难的证明</p>
<p>前提：P→Q，R→S，P∨R；结论：Q∨S。<br/>
由 P∨R，分情况：若 P 真，由 P→Q 得 Q；若 R 真，由 R→S 得 S。故无论哪种情况都有 Q∨S。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-8',
      heading: '1.8 主范式的应用',
      blocks: [
        {
          type: 'html',
          html: `
<h3>证明命题公式等价</h3>
<p>分别求两个公式的主析取范式，若小项集合相同则等价。例：证明 P→Q ⇔ ¬P∨Q。两者主析取范式均为 m<sub>0</sub>∨m<sub>1</sub>∨m<sub>3</sub>（以 P、Q 为变元）。</p>
<h3>判断命题公式的类型</h3>
<ul>
<li>主析取范式含全部 2<sup>n</sup> 个小项 ⇔ 重言式；</li>
<li>主析取范式为空（不含任何小项）⇔ 矛盾式；</li>
<li>否则为可满足式。</li>
</ul>
<h3>逻辑推断</h3>
<p>把「前提 ⇒ 结论」转化为判断 (前提合取)→结论 是否为重言式，可用主范式或等值演算完成。</p>
<h3>逻辑电路设计</h3>
<p>把逻辑要求写成真值表 → 求主析取范式 → 用与门、或门、非门实现；也可用卡诺图化简，或用与非门 / 或非门实现（全功能集）。</p>
<pre class="code"><code># 用真值表求主析取范式的思路（伪代码）
for 每种赋值 in 全部 2^n 种:
    若 公式在该赋值下为真:
        记录对应小项 m_i
主析取范式 = 所有记录的小项之析取</code></pre>
<div class="callout tip">
<p class="callout-h">范式与主范式的区别</p>
<p>范式只要求「基本积 / 基本和的组合」，形式不唯一；主范式要求每个基本积 / 基本和都包含全部变元，形式唯一。考试中「求主析取范式」通常要求写出小项编号，如 Σm(0,1,3)。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck1;

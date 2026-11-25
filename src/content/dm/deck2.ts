import type { DeckData } from '../types';

/** 第2章 谓词逻辑 —— 课件 PPT/2.1～2.5 */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: '谓词逻辑',
  subtitle: '个体与谓词 · 命题函数与量词 · 约束变元 · 谓词等价式与蕴含式 · 谓词推理',
  lede:
    '命题逻辑把原子命题视为不可分的整体，无法刻画「所有」「存在」以及命题内部的个体—属性结构。谓词逻辑引入个体、谓词与量词，把命题分解为个体词、谓词和量词，从而能表达更丰富的推理形式。本章掌握谓词公式的构成、约束变元与自由变元、谓词等价式与蕴含式，以及谓词演算的推理规则。',
  toc: [
    { id: 'sec-2-1', text: '2.1 个体与谓词', level: 2 },
    { id: 'sec-2-2', text: '2.2 命题函数与量词', level: 2 },
    { id: 'sec-2-3', text: '2.3 谓词公式与约束变元', level: 2 },
    { id: 'sec-2-4', text: '2.4 谓词等价式与蕴含式', level: 2 },
    { id: 'sec-2-5', text: '2.5 谓词演算的推理理论', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2.1 个体与谓词',
      blocks: [
        {
          type: 'html',
          html: `
<ul>
<li><strong>个体</strong>：能够独立存在的具体或抽象的对象。个体常元用 a、b、c 表示，个体变元用 x、y、z 表示；个体变元的取值范围称为<strong>个体域</strong>（论域），包含一切事物的个体域称为全总个体域。</li>
<li><strong>谓词</strong>：刻画个体性质或个体之间关系的词。表示一个个体性质的谓词是一元谓词，表示 n 个个体关系的谓词是 n 元谓词。谓词常元用 P、Q、R 表示，谓词变元用 F、G、H 表示。</li>
<li><strong>命题函数</strong>：谓词与个体变元的组合，如 P(x)、R(x, y)，本身不是命题，只有对变元赋值（或量化）后才成为命题。</li>
</ul>
<p>例：「张三是大学生」可表示为 S(张三)，其中 S 表示「是大学生」；「3 大于 2」可表示为 G(3, 2)。谓词的<strong>元数</strong>由所跟个体词的个数决定。</p>
<div class="callout key">
<p class="callout-h">命题逻辑与谓词逻辑</p>
<p>命题逻辑：原子命题不可分，推理依赖真值表；谓词逻辑：原子命题可分解为个体词 + 谓词 + 量词，能表达「所有 x 都有性质 P」「存在 x 使 Q(x)」这类结构，推理能力更强。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2.2 命题函数与量词',
      blocks: [
        {
          type: 'html',
          html: `
<h3>全称量词与存在量词</h3>
<ul>
<li><strong>全称量词</strong> ∀x：表示「对所有 x」「任意 x」；∀x P(x) 读作「对所有 x，P(x) 成立」。</li>
<li><strong>存在量词</strong> ∃x：表示「存在 x」「至少有一个 x」；∃x P(x) 读作「存在 x 使 P(x) 成立」。</li>
</ul>
<p>量词后的变元称为<strong>指导变元</strong>，其后紧跟的公式称为<strong>辖域</strong>（作用域）。量词的优先级高于所有联结词。</p>
<h3>翻译要点</h3>
<table class="tbl">
<thead><tr><th>自然语言</th><th>符号化（个体域为全总域）</th></tr></thead>
<tbody>
<tr><td>所有大学生都爱学习</td><td>∀x (S(x) → L(x))</td></tr>
<tr><td>有些大学生爱学习</td><td>∃x (S(x) ∧ L(x))</td></tr>
<tr><td>没有不犯错的人</td><td>¬∃x (P(x) ∧ ¬M(x))，等价 ∀x (P(x) → M(x))</td></tr>
<tr><td>并非所有鸟都会飞</td><td>¬∀x (B(x) → F(x))，等价 ∃x (B(x) ∧ ¬F(x))</td></tr>
</tbody>
</table>
<div class="callout warn">
<p class="callout-h">量词与联结词的搭配</p>
<p>全称量词常与 → 搭配（∀x (S(x)→P(x))），存在量词常与 ∧ 搭配（∃x (S(x)∧P(x))）。若个体域已限定为「大学生」，则「所有大学生都爱学习」可直接写 ∀x L(x)。</p>
</div>
<h3>量词的否定</h3>
<div class="formula"><p>¬∀x P(x) ⇔ ∃x ¬P(x)　；　¬∃x P(x) ⇔ ∀x ¬P(x)</p></div>
<p>这两个等价式是量词否定的核心，常与德摩根律配合把否定深入到量词内部。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2.3 谓词公式与约束变元',
      blocks: [
        {
          type: 'html',
          html: `
<h3>谓词公式</h3>
<p>由个体常元、个体变元、谓词、量词、联结词和括号按规则构成的合式公式称为谓词公式。原子公式是 n 元谓词作用于 n 个项；由原子公式经 ¬、∧、∨、→、↔ 及量词作用得到更复杂的公式。</p>
<h3>约束变元与自由变元</h3>
<ul>
<li>若变元 x 出现在 ∀x 或 ∃x 的辖域内，则称 x 在该处的出现是<strong>约束</strong>的；</li>
<li>否则称 x 的出现是<strong>自由</strong>的；</li>
<li>一个公式中某变元既有约束出现又有自由出现时，要分别看待；公式的真值依赖于自由变元。</li>
</ul>
<p><strong>闭式</strong>：没有自由变元的公式，闭式是命题，有确定的真值。</p>
<h3>换名规则与代入规则</h3>
<ul>
<li><strong>约束变元换名</strong>：把量词辖域内受该量词约束的变元全部换成辖域内未出现的新变元，公式含义不变；</li>
<li><strong>自由变元代入</strong>：把公式中某自由变元处处用同一个项代入，注意代入后不能产生新的约束关系（避免变元捕获）。</li>
</ul>
<h3>谓词翻译</h3>
<p>翻译时先确定个体域；若为全总域，需用谓词把对象范围限定出来（全称用 →，存在用 ∧）。再按语义叠加量词与联结词，注意量词的先后顺序会影响含义：∀x∃y L(x,y)（每个人都有一个爱的人）与 ∃y∀x L(x,y)（存在一个人被所有人爱）不同。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2.4 谓词等价式与蕴含式',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>赋值</strong>：对谓词公式中的自由变元指定个体域中的个体，对谓词变元指定具体谓词，得到命题。若公式在所有赋值下都为真，则为永真式；都为假则为永假式；否则为可满足式。</p>
<h3>基本等价式</h3>
<table class="tbl">
<thead><tr><th>名称</th><th>等价式</th></tr></thead>
<tbody>
<tr><td>量词否定</td><td>¬∀x P(x) ⇔ ∃x ¬P(x)；¬∃x P(x) ⇔ ∀x ¬P(x)</td></tr>
<tr><td>量词分配（∀ 对 ∧）</td><td>∀x (P(x)∧Q(x)) ⇔ ∀x P(x) ∧ ∀x Q(x)</td></tr>
<tr><td>量词分配（∃ 对 ∨）</td><td>∃x (P(x)∨Q(x)) ⇔ ∃x P(x) ∨ ∃x Q(x)</td></tr>
<tr><td>量词收缩 / 扩张</td><td>若 x 不在 Q 中自由出现：∀x (P(x)∨Q) ⇔ ∀x P(x)∨Q；∃x (P(x)∧Q) ⇔ ∃x P(x)∧Q</td></tr>
<tr><td>全称蕴含存在</td><td>个体域非空时：∀x P(x) ⇒ ∃x P(x)</td></tr>
<tr><td>量词交换</td><td>∀x∀y P(x,y) ⇔ ∀y∀x P(x,y)；∃x∃y P(x,y) ⇔ ∃y∃x P(x,y)</td></tr>
</tbody>
</table>
<div class="callout warn">
<p class="callout-h">不能随意分配</p>
<p>∀ 不能对 ∨ 分配：∀x (P(x)∨Q(x)) 与 ∀x P(x)∨∀x Q(x) 不等价；∃ 不能对 ∧ 分配：∃x (P(x)∧Q(x)) 与 ∃x P(x)∧∃x Q(x) 不等价。反例可用具体个体域构造。</p>
</div>
<h3>前束范式</h3>
<p>所有量词都位于公式最前面、辖域延伸到公式末尾的范式，形如 Q<sub>1</sub>x<sub>1</sub>Q<sub>2</sub>x<sub>2</sub>…Q<sub>n</sub>x<sub>n</sub>M，其中 M 无量词。求法：消去 →、↔；用量词否定把 ¬ 内移；必要时换名以避免变元冲突；把量词依次前移。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-5',
      heading: '2.5 谓词演算的推理理论',
      blocks: [
        {
          type: 'html',
          html: `
<p>谓词演算的推理在命题推理规则基础上，增加量词的消去与引入规则。</p>
<h3>量词规则</h3>
<table class="tbl">
<thead><tr><th>规则</th><th>形式</th><th>限制</th></tr></thead>
<tbody>
<tr><td>全称例示（UI）</td><td>∀x P(x) ⊢ P(c)</td><td>c 为个体域中任意个体常元</td></tr>
<tr><td>全称推广（UG）</td><td>P(c) ⊢ ∀x P(x)</td><td>c 必须是任意个体，且 P(c) 中 c 不被约束</td></tr>
<tr><td>存在例示（EI）</td><td>∃x P(x) ⊢ P(c)</td><td>c 必须是未在前提中出现过的新常元</td></tr>
<tr><td>存在推广（EG）</td><td>P(c) ⊢ ∃x P(x)</td><td>c 为个体常元或已出现的个体</td></tr>
</tbody>
</table>
<h3>推理示例</h3>
<p>前提：∀x (M(x)→D(x))（所有人都会死），M(苏格拉底)（苏格拉底是人）；结论：D(苏格拉底)。</p>
<pre class="code"><code>1. ∀x (M(x) → D(x))     前提
2. M(苏格拉底)           前提
3. M(苏格拉底) → D(苏格拉底)   1, UI
4. D(苏格拉底)           2,3 假言推理</code></pre>
<p>使用 EI 时尤其要注意「新常元」限制：若 ∃x P(x) 与 ∃x Q(x) 分别例示，不能共用同一个常元 c，否则会错误地推出 ∃x (P(x)∧Q(x))。</p>
<div class="callout key">
<p class="callout-h">本章要点</p>
<p>谓词逻辑 = 命题逻辑 + 个体/谓词/量词。核心是量词的语义（∀ 配 →、∃ 配 ∧）、量词否定、约束与自由、前束范式，以及 UI/UG/EI/EG 四条量词规则。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;

/* 电路与电子技术基础 · 电路部分（第 1～6 章）
 * 依据课件：第1章 电路的基本概念与定律、第2章 电路的等效变换、第3章 电路的基本分析方法、
 * 第4章 电路的基本定理、第5章 动态电路分析、第6章 正弦稳态分析（PPT-新 PDF/PPTX）。 */
import type { EeChapter } from './types';

export const c1: EeChapter = {
  id: 'c1',
  no: '第1章',
  title: '电路的基本概念与定律',
  subtitle: '电路部分 · 第 1 章',
  lede: `<p>本章建立电路分析的基本语言：<strong>电路模型</strong>、电流电压的参考方向、功率、电阻/电感/电容与独立源，以及贯穿全课程的<strong>基尔霍夫定律</strong>。</p>`,
  toc: [
    { id: 'sec-ee1-model', text: '1. 电路与电路模型', level: 2 },
    { id: 'sec-ee1-var', text: '2. 电路的基本变量', level: 2 },
    { id: 'sec-ee1-kcl', text: '3. 基尔霍夫定律', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee1-model',
      heading: '1. 电路与电路模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>电路</strong>：各种电器元件（电源、开关、负载等）按一定方式连接构成的电流通路。电路可实现电能的传输与转换，也可完成信号的传送、处理与放大，以及信息的存储与测量。</p>
          <p>实际元件在工作时往往伴随多种物理效应。为便于分析，抓住主要电磁性质，用<strong>理想电路元件</strong>或其组合近似代替实际元件，构成的图形称为<strong>电路模型</strong>。例如灯泡用电阻 R<sub>L</sub> 表示，电池用理想电压源 E 串联内阻 R<sub>S</sub> 表示。</p>
          <div class="callout key">
            <p class="callout-h">分析前提</p>
            <p>本课程讨论<strong>集总参数电路</strong>：电路尺寸远小于工作信号波长，可忽略电磁波沿电路的传播效应，用基尔霍夫定律与元件伏安关系分析。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee1-var',
      heading: '2. 电路的基本变量',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>电流</strong>：单位时间内通过导体截面的电量，i = dq/dt，单位 A。电流的实际方向为正电荷移动方向。分析时先假定<strong>参考方向</strong>：计算结果为正表示实际方向与参考方向一致，为负则相反。直流用大写 I，交流用小写 i。</p>
          <p><strong>电压</strong>：单位正电荷从 a 点移到 b 点电场力所做的功，u = dw/dq，单位 V。电压的参考方向用「+」「−」极性或箭头表示。电流与电压参考方向一致称<strong>关联参考方向</strong>，否则称非关联。</p>
          <p><strong>功率</strong>：p = ui。关联参考方向下，p &gt; 0 表示吸收功率（负载），p &lt; 0 表示发出功率（电源）；非关联时结论相反。</p>
          <div class="formula">关联：p = ui；非关联：p = −ui；电阻上 p = i<sup>2</sup>R = u<sup>2</sup>/R &gt; 0（始终吸收）</div>
          <p>理想元件：<strong>电阻</strong> R 满足 u = Ri（欧姆定律）；<strong>电感</strong> L 满足 u = L di/dt，直流时相当于短路；<strong>电容</strong> C 满足 i = C du/dt，直流时相当于开路。</p>
          <p>独立电源：理想电压源的端电压由自身决定、与电流无关；理想电流源的电流由自身决定、与端电压无关。实际电源可用「电压源串联内阻」或「电流源并联内阻」两种模型表示。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee1-kcl',
      heading: '3. 基尔霍夫定律',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>基尔霍夫电流定律（KCL）</strong>：任一时刻，流入（或流出）任一结点的电流代数和为零，即</p>
          <div class="formula">Σ i = 0（流出取正、流入取负，或相反）</div>
          <p>KCL 体现电荷守恒。它不仅适用于结点，也适用于任一<strong>闭合面</strong>（广义结点）。</p>
          <p><strong>基尔霍夫电压定律（KVL）</strong>：任一时刻，沿任一闭合回路，各段电压的代数和为零，即</p>
          <div class="formula">Σ u = 0（沿绕行方向，电压降取正、电压升取负）</div>
          <p>KVL 体现能量守恒（保守场）。它适用于任何集总参数电路，与元件性质无关。</p>
          <div class="callout tip">
            <p class="callout-h">列方程要点</p>
            <p>先标出各支路电流的参考方向与回路绕行方向；KCL 对结点、KVL 对回路，联立元件伏安关系即可求解。KCL、KVL 与元件 VAR 是分析一切电路的三大基础。</p>
          </div>
          <p>常用术语：<strong>支路</strong>（流过同一电流的分支）、<strong>结点</strong>（三条及以上支路的连接点）、<strong>回路</strong>（闭合路径）、<strong>网孔</strong>（内部不含支路的回路）。</p>
          `,
        },
      ],
    },
  ],
};

export const c2: EeChapter = {
  id: 'c2',
  no: '第2章',
  title: '电路的等效变换',
  subtitle: '电路部分 · 第 2 章',
  lede: `<p>等效变换把复杂电路化简为简单电路：若两个二端网络的<strong>端口伏安关系完全相同</strong>，则二者等效。本章讨论电阻的串并联与 Y-Δ 变换、电源模型的等效互换及受控源的等效。</p>`,
  toc: [
    { id: 'sec-ee2-concept', text: '1. 等效电路的概念', level: 2 },
    { id: 'sec-ee2-res', text: '2. 电阻的等效变换', level: 2 },
    { id: 'sec-ee2-source', text: '3. 电源的等效变换', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee2-concept',
      heading: '1. 等效电路的概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p>若二端网络 N<sub>1</sub> 的端口伏安关系与 N<sub>2</sub> 完全相同，则 N<sub>1</sub> 与 N<sub>2</sub> 互为<strong>等效网络</strong>。等效是<strong>对外等效</strong>：端口以外的电路工作状态不变，但网络内部并不等效（内部功率可能不同）。</p>
          <p>等效变换的目的：在不改变待求量的前提下，把含多个元件的二端网络用一个元件代替，逐步化简电路。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee2-res',
      heading: '2. 电阻的等效变换',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>串联</strong>：各电阻流过同一电流，等效电阻为各电阻之和，分压与阻值成正比：</p>
          <div class="formula">R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + … + R<sub>n</sub>；u<sub>k</sub> = u · R<sub>k</sub>/R<sub>eq</sub></div>
          <p><strong>并联</strong>：各电阻承受同一电压，等效电导为各电导之和，分流与电导成正比：</p>
          <div class="formula">G<sub>eq</sub> = G<sub>1</sub> + G<sub>2</sub> + …；两个电阻并联 R<sub>eq</sub> = R<sub>1</sub>R<sub>2</sub>/(R<sub>1</sub>+R<sub>2</sub>)</div>
          <p><strong>Y-Δ 变换</strong>：三个电阻接成星形（Y）与三角形（Δ）时可互相等效。Δ→Y：</p>
          <div class="formula">R<sub>1</sub> = R<sub>12</sub>R<sub>31</sub>/(R<sub>12</sub>+R<sub>23</sub>+R<sub>31</sub>)（其余轮换）</div>
          <p>Y→Δ：R<sub>12</sub> = (R<sub>1</sub>R<sub>2</sub>+R<sub>2</sub>R<sub>3</sub>+R<sub>3</sub>R<sub>1</sub>)/R<sub>3</sub>（其余轮换）。对称时 Y 的每个电阻是 Δ 的 1/3。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee2-source',
      heading: '3. 电源的等效变换',
      blocks: [
        {
          type: 'html',
          html: `
          <p>实际电压源（u<sub>S</sub> 串联 R<sub>S</sub>）与电流源（i<sub>S</sub> 并联 R<sub>S</sub>）对外可等效互换，条件是</p>
          <div class="formula">i<sub>S</sub> = u<sub>S</sub>/R<sub>S</sub>，R<sub>S</sub> 不变；注意电压源极性与电流源方向对应（电流源箭头指向电压源正极）</div>
          <p>互换时内阻不变，但理想电压源（R<sub>S</sub> = 0）与理想电流源（R<sub>S</sub> = ∞）不能互换。受控源也可按同样规则等效，但控制量必须保留在变换后的电路中。</p>
          <div class="callout warn">
            <p class="callout-h">注意</p>
            <p>电源等效变换只对外电路等效，电源内部的功率关系会改变，不能用变换后的电路计算原电源的功率。</p>
          </div>
          <p>受控源：电压控制电压源（VCVS）、电流控制电压源（CCVS）、电压控制电流源（VCCS）、电流控制电流源（CCCS）。受控源不能单独作为激励，其输出由控制量决定。</p>
          `,
        },
      ],
    },
  ],
};

export const c3: EeChapter = {
  id: 'c3',
  no: '第3章',
  title: '电路的基本分析方法',
  subtitle: '电路部分 · 第 3 章',
  lede: `<p>本章把 KCL、KVL 系统化为列方程的方法：<strong>支路电流法</strong>、<strong>节点电压法</strong>与<strong>回路（网孔）电流法</strong>，并说明如何选择独立方程。</p>`,
  toc: [
    { id: 'sec-ee3-graph', text: '1. 电路的图与独立方程', level: 2 },
    { id: 'sec-ee3-branch', text: '2. 支路电流法', level: 2 },
    { id: 'sec-ee3-node', text: '3. 节点电压法', level: 2 },
    { id: 'sec-ee3-loop', text: '4. 回路电流法', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee3-graph',
      heading: '1. 电路的图与独立方程',
      blocks: [
        {
          type: 'html',
          html: `
          <p>把电路的支路抽象为线段、结点抽象为点，得到<strong>电路的图</strong>。设结点数 n、支路数 b，则独立的 KCL 方程数为 <strong>n − 1</strong>，独立的 KVL 方程数为 <strong>b − n + 1</strong>。二者之和等于支路数 b，恰好可解出 b 个支路电流。</p>
          <p>树：连通图的一个子图，包含全部结点且不含回路，含 n−1 条树支；其余 b−n+1 条为连支。单连支回路（基本回路）彼此独立，可作为 KVL 的独立回路。</p>
          <div class="formula">独立 KCL：n − 1；独立 KVL：b − n + 1；合计 b</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee3-branch',
      heading: '2. 支路电流法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>以各支路电流为未知量：对 n−1 个独立结点列 KCL；对 b−n+1 个独立回路列 KVL（用支路电流表示元件电压）。联立求解 b 个方程。</p>
          <p>步骤：① 标出各支路电流参考方向；② 选 n−1 个结点列 KCL；③ 选独立回路列 KVL；④ 解方程，必要时校验功率平衡。</p>
          <p>支路电流法直观、方程数等于支路数，适合支路较少的电路；支路多时方程数多，计算量大。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee3-node',
      heading: '3. 节点电压法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>选一个结点为参考点（电位为零），其余 n−1 个结点的电压为未知量。对每个非参考结点列 KCL，用节点电压表示支路电流，得到节点电压方程。</p>
          <p>对于只含独立电流源与电阻的电路，节点电压方程的标准形式为</p>
          <div class="formula">G<sub>ii</sub>U<sub>i</sub> − Σ<sub>j≠i</sub> G<sub>ij</sub>U<sub>j</sub> = I<sub>Si</sub></div>
          <p>其中 G<sub>ii</sub> 是连接到结点 i 的各支路电导之和（自电导），G<sub>ij</sub> 是结点 i、j 之间支路电导（互电导，取负），I<sub>Si</sub> 是流入结点 i 的电流源电流代数和。</p>
          <p>含理想电压源的支路：若一端接参考点，则该结点电压已知；否则需设支路电流为附加未知量，补充约束方程。节点电压法方程数为 n−1，适合结点少、支路多的电路。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee3-loop',
      heading: '4. 回路电流法',
      blocks: [
        {
          type: 'html',
          html: `
          <p>以独立回路电流为未知量，对每个独立回路列 KVL。回路电流自动满足 KCL，因此只需 b−n+1 个方程。平面电路常取网孔电流，方程形式为</p>
          <div class="formula">R<sub>ii</sub>I<sub>i</sub> + Σ<sub>j≠i</sub> R<sub>ij</sub>I<sub>j</sub> = U<sub>Si</sub></div>
          <p>R<sub>ii</sub> 为回路 i 的自电阻（各电阻之和），R<sub>ij</sub> 为回路 i、j 的互电阻（公共支路电阻，回路电流方向相同取正、相反取负），U<sub>Si</sub> 为回路内电压源电压的代数和。</p>
          <p>回路电流法适合回路数少于结点数的电路；含电流源时，若电流源只属于一个回路，则该回路电流已知，可减少方程。</p>
          <div class="callout tip">
            <p class="callout-h">方法选择</p>
            <p>结点少 → 节点电压法；回路少 → 回路电流法；支路少 → 支路电流法。三种方法本质都是 KCL + KVL，方程数不同。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export const c4: EeChapter = {
  id: 'c4',
  no: '第4章',
  title: '电路的基本定理',
  subtitle: '电路部分 · 第 4 章',
  lede: `<p>本章讨论线性电路的四条基本定理：<strong>叠加定理</strong>、<strong>替代定理</strong>、<strong>戴维南/诺顿定理</strong>与<strong>最大功率传输定理</strong>，它们把复杂电路化为简单电源与电阻的组合。</p>`,
  toc: [
    { id: 'sec-ee4-super', text: '1. 叠加定理', level: 2 },
    { id: 'sec-ee4-sub', text: '2. 替代定理', level: 2 },
    { id: 'sec-ee4-thevenin', text: '3. 戴维南与诺顿定理', level: 2 },
    { id: 'sec-ee4-power', text: '4. 最大功率传输定理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee4-super',
      heading: '1. 叠加定理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>在线性电路中，多个独立电源共同作用时，任一支路的电流（或电压）等于各独立电源<strong>单独作用</strong>时在该支路产生的电流（或电压）的代数和。</p>
          <p>单独作用：保留一个电源，其余电压源置零（短路）、电流源置零（开路），但<strong>受控源必须保留</strong>，因为受控源不是独立激励。</p>
          <div class="callout warn">
            <p class="callout-h">适用范围</p>
            <p>叠加定理只适用于线性电路的电压、电流，<strong>不能</strong>直接用于功率（功率与电流/电压是二次关系）。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee4-sub',
      heading: '2. 替代定理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>若已知某支路的电压 u<sub>k</sub> 或电流 i<sub>k</sub>，则可用一个电压为 u<sub>k</sub> 的电压源或电流为 i<sub>k</sub> 的电流源替代该支路，电路其余部分的电压、电流保持不变。</p>
          <p>替代定理对线性与非线性电路都成立，前提是被替代支路与电路其余部分<strong>无耦合</strong>（不是受控源的控制支路）。它是戴维南定理证明与电路化简的基础。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee4-thevenin',
      heading: '3. 戴维南与诺顿定理',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>戴维南定理</strong>：任一线性含源二端网络，对外电路而言，可等效为一个理想电压源 U<sub>OC</sub> 串联一个电阻 R<sub>eq</sub>。U<sub>OC</sub> 是端口<strong>开路电压</strong>，R<sub>eq</sub> 是网络内独立源置零后的<strong>等效电阻</strong>。</p>
          <p><strong>诺顿定理</strong>：同一网络也可等效为一个理想电流源 I<sub>SC</sub> 并联 R<sub>eq</sub>，I<sub>SC</sub> 是端口<strong>短路电流</strong>。二者关系为</p>
          <div class="formula">U<sub>OC</sub> = I<sub>SC</sub> · R<sub>eq</sub></div>
          <p>求 R<sub>eq</sub> 的方法：① 独立源置零后求端口等效电阻；② 开路电压除以短路电流；③ 外加电源法（加压求流或加流求压）。</p>
          <p>戴维南/诺顿定理把「含源复杂网络」化为简单电源模型，特别适合只关心某一支路响应的场合。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee4-power',
      heading: '4. 最大功率传输定理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>含源二端网络向可变负载 R<sub>L</sub> 供电，当</p>
          <div class="formula">R<sub>L</sub> = R<sub>eq</sub></div>
          <p>时，负载获得最大功率，称为<strong>最大功率匹配</strong>。最大功率为</p>
          <div class="formula">P<sub>max</sub> = U<sub>OC</sub><sup>2</sup> / (4R<sub>eq</sub>)</div>
          <p>此时传输效率为 50%（内阻与负载各消耗一半功率）。电力系统追求高效率，一般不采用匹配；电子线路（如放大器）常追求最大功率传输。</p>
          `,
        },
      ],
    },
  ],
};

export const c5: EeChapter = {
  id: 'c5',
  no: '第5章',
  title: '动态电路分析',
  subtitle: '电路部分 · 第 5 章',
  lede: `<p>含电容、电感的电路称为<strong>动态电路</strong>，其响应与历史状态有关。本章讨论换路定律、一阶电路的零输入/零状态/全响应与<strong>三要素法</strong>，并简述二阶电路。</p>`,
  toc: [
    { id: 'sec-ee5-element', text: '1. 动态元件', level: 2 },
    { id: 'sec-ee5-switch', text: '2. 换路定律与初始值', level: 2 },
    { id: 'sec-ee5-first', text: '3. 一阶电路的响应', level: 2 },
    { id: 'sec-ee5-second', text: '4. 二阶电路简介', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee5-element',
      heading: '1. 动态元件',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>电容</strong>：i = C du/dt，电压不能跃变（否则电流无穷大）。电容储存电场能 W<sub>C</sub> = ½Cu<sup>2</sup>。直流稳态时 du/dt = 0，电容相当于开路。</p>
          <p><strong>电感</strong>：u = L di/dt，电流不能跃变。电感储存磁场能 W<sub>L</sub> = ½Li<sup>2</sup>。直流稳态时 di/dt = 0，电感相当于短路。</p>
          <div class="formula">电容：i = C du/dt，u<sub>C</sub>(t) = u<sub>C</sub>(0) + (1/C)∫<sub>0</sub><sup>t</sup> i dτ；电感：u = L di/dt</div>
          <p>电容电压与电感电流称为<strong>状态变量</strong>，它们决定电路的初始状态。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee5-switch',
      heading: '2. 换路定律与初始值',
      blocks: [
        {
          type: 'html',
          html: `
          <p>换路瞬间（t = 0<sub>−</sub> → 0<sub>+</sub>），若电容电流、电感电压为有限值，则</p>
          <div class="formula">u<sub>C</sub>(0<sub>+</sub>) = u<sub>C</sub>(0<sub>−</sub>)；i<sub>L</sub>(0<sub>+</sub>) = i<sub>L</sub>(0<sub>−</sub>)</div>
          <p>这就是<strong>换路定律</strong>。求初始值的步骤：① 由换路前稳态求 u<sub>C</sub>(0<sub>−</sub>)、i<sub>L</sub>(0<sub>−</sub>)；② 用换路定律得 0<sub>+</sub> 时刻值；③ 画 0<sub>+</sub> 等效电路（电容用电压源、电感用电流源代替），求其它量的初始值。</p>
          <div class="callout tip">
            <p class="callout-h">直流稳态</p>
            <p>换路前若电路已稳定，电容视为开路、电感视为短路，据此求 0<sub>−</sub> 值。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee5-first',
      heading: '3. 一阶电路的响应',
      blocks: [
        {
          type: 'html',
          html: `
          <p>只含一个独立动态元件（或可等效为一个）的电路称为<strong>一阶电路</strong>，其响应由一阶微分方程描述，时间常数为</p>
          <div class="formula">τ = RC（RC 电路）或 τ = L/R（RL 电路）</div>
          <p><strong>零输入响应</strong>（无外加激励，仅由初始储能引起）：u<sub>C</sub> = U<sub>0</sub>e<sup>−t/τ</sup>，按指数规律衰减。</p>
          <p><strong>零状态响应</strong>（初始储能为零，由激励引起）：u<sub>C</sub> = U<sub>S</sub>(1 − e<sup>−t/τ</sup>)。</p>
          <p><strong>全响应</strong> = 零输入响应 + 零状态响应，也可写成</p>
          <div class="formula">f(t) = f(∞) + [f(0<sub>+</sub>) − f(∞)]e<sup>−t/τ</sup></div>
          <p>这就是<strong>三要素法</strong>：只要求出初始值 f(0<sub>+</sub>)、稳态值 f(∞) 与时间常数 τ，即可写出一阶电路任一响应的表达式。</p>
          <p>τ 的物理意义：响应衰减到初始值 36.8% 所需时间；工程上认为经过 (3～5)τ 后过渡过程基本结束。τ 越小，过渡过程越快。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee5-second',
      heading: '4. 二阶电路简介',
      blocks: [
        {
          type: 'html',
          html: `
          <p>含两个独立动态元件的电路为二阶电路，其响应由二阶微分方程描述。以 RLC 串联电路为例，特征方程为</p>
          <div class="formula">LCs<sup>2</sup> + RCs + 1 = 0</div>
          <p>根据特征根的不同，响应分为三种情况：</p>
          <ul>
            <li><strong>过阻尼</strong>（R &gt; 2√(L/C)）：两个不等负实根，响应单调衰减；</li>
            <li><strong>临界阻尼</strong>（R = 2√(L/C)）：两个相等负实根，响应最快达到稳态而不振荡；</li>
            <li><strong>欠阻尼</strong>（R &lt; 2√(L/C)）：共轭复根，响应为衰减振荡。</li>
          </ul>
          <p>二阶电路的初始值仍由换路定律确定；分析时先列微分方程，再由初始条件定常数。</p>
          `,
        },
      ],
    },
  ],
};

export const c6: EeChapter = {
  id: 'c6',
  no: '第6章',
  title: '正弦稳态分析',
  subtitle: '电路部分 · 第 6 章',
  lede: `<p>正弦激励下的稳态响应称为<strong>正弦稳态</strong>。本章引入<strong>相量法</strong>，把微分方程化为复数代数方程，讨论阻抗/导纳、功率、谐振与三相电路。</p>`,
  toc: [
    { id: 'sec-ee6-phasor', text: '1. 正弦量与相量', level: 2 },
    { id: 'sec-ee6-impedance', text: '2. 阻抗与导纳', level: 2 },
    { id: 'sec-ee6-power', text: '3. 正弦稳态功率', level: 2 },
    { id: 'sec-ee6-resonance', text: '4. 谐振与三相电路', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee6-phasor',
      heading: '1. 正弦量与相量',
      blocks: [
        {
          type: 'html',
          html: `
          <p>正弦量 i(t) = I<sub>m</sub>cos(ωt + φ) 由<strong>幅值</strong> I<sub>m</sub>、<strong>角频率</strong> ω 与<strong>初相</strong> φ 三要素确定。周期 T = 2π/ω，频率 f = 1/T。</p>
          <p>同一频率的正弦量可用<strong>相量</strong>表示：有效值相量 İ = I∠φ（I = I<sub>m</sub>/√2）。相量是复数，只保留幅值与初相，频率隐含在变换中。</p>
          <div class="formula">i = √2 I cos(ωt + φ) ⇔ İ = I∠φ；相量加减对应同频正弦量加减</div>
          <p>相量法的依据：正弦量对时间的求导对应乘以 jω，积分对应除以 jω，因此 R、L、C 的伏安关系化为复数代数关系。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee6-impedance',
      heading: '2. 阻抗与导纳',
      blocks: [
        {
          type: 'html',
          html: `
          <p>无源二端网络端口电压相量与电流相量之比称为<strong>阻抗</strong> Z = U̇/İ = |Z|∠φ，其中 |Z| 为阻抗模，φ 为阻抗角。导纳 Y = 1/Z。</p>
          <div class="formula">R：Z<sub>R</sub> = R；L：Z<sub>L</sub> = jωL；C：Z<sub>C</sub> = 1/(jωC) = −j/(ωC)</div>
          <p>阻抗串联 Z = ΣZ<sub>k</sub>，并联 1/Z = Σ1/Z<sub>k</sub>，与电阻电路的形式完全相同。因此直流电路的分析方法（KCL、KVL、节点法、戴维南等）可推广到相量域。</p>
          <p>φ &gt; 0 表示电压超前电流（感性），φ &lt; 0 表示电压滞后电流（容性），φ = 0 为阻性。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee6-power',
      heading: '3. 正弦稳态功率',
      blocks: [
        {
          type: 'html',
          html: `
          <p>瞬时功率 p = ui 在一个周期内的平均值称为<strong>有功功率</strong>（平均功率）：</p>
          <div class="formula">P = UI cos φ（单位 W）</div>
          <p>其中 cos φ 为<strong>功率因数</strong>。无功功率 Q = UI sin φ（单位 var），视在功率 S = UI（单位 V·A），三者满足</p>
          <div class="formula">S<sup>2</sup> = P<sup>2</sup> + Q<sup>2</sup>；复功率 S̃ = U̇İ* = P + jQ</div>
          <p>电阻消耗有功，电感与电容只交换无功（不消耗平均功率）。提高功率因数可减小线路电流与损耗，常采用并联电容补偿。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee6-resonance',
      heading: '4. 谐振与三相电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>串联谐振</strong>：RLC 串联电路端口电压与电流同相（φ = 0），此时</p>
          <div class="formula">ω<sub>0</sub> = 1/√(LC)，f<sub>0</sub> = 1/(2π√(LC))</div>
          <p>谐振时阻抗最小（Z = R），电流最大；电感与电容电压可能远高于电源电压，称电压谐振。品质因数 Q = ω<sub>0</sub>L/R = 1/(ω<sub>0</sub>CR)。</p>
          <p><strong>并联谐振</strong>：端口电压与电流同相，阻抗最大，电流最小。</p>
          <p><strong>三相电路</strong>：三相对称电源幅值相等、频率相同、相位互差 120°。星形（Y）连接线电压是相电压的 √3 倍且超前 30°；三角形（Δ）连接线电压等于相电压。对称三相电路可用一相计算，三相总功率 P = √3 U<sub>L</sub>I<sub>L</sub>cos φ。</p>
          `,
        },
      ],
    },
  ],
};

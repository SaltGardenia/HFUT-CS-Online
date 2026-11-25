/* 电路与电子技术基础 · 模拟电子部分（第 7～15 章）
 * 依据课件：模电 ch01（绪论）、ch02（运算放大器）、ch03（二极管）、ch04（场效应管）、
 * ch05（BJT 及其放大电路）、ch07（模拟集成电路）、ch08（反馈）、ch09（功率放大）、ch11（直流电源）。 */
import type { EeChapter } from './types';

export const c7: EeChapter = {
  id: 'c7',
  no: '第7章',
  title: '绪论：信号与放大电路',
  subtitle: '模拟电子部分 · 第 1 章',
  lede: `<p>模拟电子技术处理的是连续变化的<strong>模拟信号</strong>。本章介绍信号的表示与频谱、模拟/数字信号的区别、放大电路模型及其主要性能指标，是后续各章的共同语言。</p>`,
  toc: [
    { id: 'sec-ee7-signal', text: '1. 信号与频谱', level: 2 },
    { id: 'sec-ee7-model', text: '2. 放大电路模型', level: 2 },
    { id: 'sec-ee7-index', text: '3. 放大电路的主要性能指标', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee7-signal',
      heading: '1. 信号与频谱',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>信号</strong>是信息的载体或表达形式。电信号常用电压或电流随时间的变化表示。按时间连续性分为<strong>模拟信号</strong>（时间和幅值都连续）与<strong>数字信号</strong>（时间和幅值离散，通常只有高低两电平）。</p>
          <p>任何满足一定条件的信号都可分解为不同频率正弦分量的叠加，各频率分量的幅值/相位随频率的分布称为<strong>频谱</strong>。周期信号的频谱是离散的谱线；非周期信号的频谱是连续的。</p>
          <p>模拟信号处理关注波形不失真与信噪比；数字信号处理关注采样、量化与编码。本课程讨论模拟电路对模拟信号的处理。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee7-model',
      heading: '2. 放大电路模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>放大</strong>：用较小的输入信号控制较大的输出信号，本质是能量的控制与转换，能量来自直流电源。</p>
          <p>放大电路可用二端口模型描述：输入端等效为输入电阻 R<sub>i</sub>，输出端等效为受控电压源 A<sub>vo</sub>u<sub>i</sub> 串联输出电阻 R<sub>o</sub>。根据输入/输出量是电压还是电流，分为电压放大、电流放大、互阻放大与互导放大四种模型。</p>
          <div class="formula">电压增益 A<sub>v</sub> = u<sub>o</sub>/u<sub>i</sub>；源电压增益 A<sub>vs</sub> = u<sub>o</sub>/u<sub>s</sub></div>
          <p>理想电压放大器：R<sub>i</sub> → ∞（不从信号源取电流），R<sub>o</sub> → 0（带载能力强）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee7-index',
      heading: '3. 放大电路的主要性能指标',
      blocks: [
        {
          type: 'html',
          html: `
          <ul>
            <li><strong>增益</strong>：电压增益 A<sub>v</sub>、电流增益 A<sub>i</sub>、功率增益 A<sub>p</sub>；工程上用分贝表示：A<sub>v</sub>(dB) = 20lg|A<sub>v</sub>|；</li>
            <li><strong>输入电阻</strong> R<sub>i</sub>：从输入端看进去的等效电阻，越大对信号源负载越轻；</li>
            <li><strong>输出电阻</strong> R<sub>o</sub>：从输出端看进去的等效电阻，越小带负载能力越强；</li>
            <li><strong>通频带</strong>：增益下降到中频增益的 0.707 倍（−3 dB）所对应的频率范围；</li>
            <li><strong>非线性失真</strong>：输出波形与输入波形不一致，用谐波失真度衡量；</li>
            <li><strong>最大输出幅度</strong>、效率、噪声等。</li>
          </ul>
          <div class="callout key">
            <p class="callout-h">放大与失真</p>
            <p>放大的前提是<strong>不失真</strong>：输出波形应保持输入波形的形状，只改变幅值（必要时移相）。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export const c8: EeChapter = {
  id: 'c8',
  no: '第8章',
  title: '运算放大器',
  subtitle: '模拟电子部分 · 第 2 章',
  lede: `<p>运算放大器是高增益直接耦合多级放大器，配以反馈网络可实现加减、积分、微分等运算。本章以<strong>理想运放</strong>模型讨论基本线性应用。</p>`,
  toc: [
    { id: 'sec-ee8-ideal', text: '1. 集成运放与理想运放', level: 2 },
    { id: 'sec-ee8-basic', text: '2. 基本线性运放电路', level: 2 },
    { id: 'sec-ee8-app', text: '3. 加减与积分微分电路', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee8-ideal',
      heading: '1. 集成运放与理想运放',
      blocks: [
        {
          type: 'html',
          html: `
          <p>集成运放内部由差分输入级、中间放大级、输出级与偏置电路组成，有两个输入端（同相端 +、反相端 −）和一个输出端。开环增益 A<sub>od</sub> 极大（10<sup>4</sup>～10<sup>7</sup>），输入电阻很大，输出电阻很小。</p>
          <p><strong>理想运放</strong>：A<sub>od</sub> → ∞，R<sub>id</sub> → ∞，R<sub>o</sub> → 0，带宽无限。工作在线性区时有两个重要结论：</p>
          <div class="formula">虚短：u<sub>+</sub> = u<sub>−</sub>（差模电压为零）；虚断：i<sub>+</sub> = i<sub>−</sub> = 0</div>
          <p>虚短由 A<sub>od</sub> → ∞ 且输出有限推出；虚断由 R<sub>id</sub> → ∞ 推出。二者是分析线性运放电路的基本工具。</p>
          <p>运放工作在非线性区（开环或正反馈）时，输出只有两种状态：u<sub>o</sub> = +U<sub>om</sub> 或 −U<sub>om</sub>，此时虚短不成立，但虚断仍成立。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee8-basic',
      heading: '2. 基本线性运放电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>反相放大电路</strong>：输入经 R<sub>1</sub> 接反相端，同相端接地，反馈电阻 R<sub>f</sub> 接在输出与反相端之间。由虚短 u<sub>−</sub> = 0、虚断得</p>
          <div class="formula">A<sub>v</sub> = u<sub>o</sub>/u<sub>i</sub> = −R<sub>f</sub>/R<sub>1</sub>；R<sub>i</sub> = R<sub>1</sub></div>
          <p>输出与输入反相，输入电阻由 R<sub>1</sub> 决定。当 R<sub>f</sub> = R<sub>1</sub> 时为单位增益反相器。</p>
          <p><strong>同相放大电路</strong>：输入接同相端，反相端经 R<sub>1</sub> 接地、经 R<sub>f</sub> 接输出。由虚短 u<sub>−</sub> = u<sub>i</sub> 得</p>
          <div class="formula">A<sub>v</sub> = 1 + R<sub>f</sub>/R<sub>1</sub>；R<sub>i</sub> → ∞</div>
          <p>输出与输入同相，增益不小于 1。R<sub>1</sub> → ∞（开路）时变为<strong>电压跟随器</strong>，A<sub>v</sub> = 1，常用作缓冲隔离。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee8-app',
      heading: '3. 加减与积分微分电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>反相加法电路</strong>：多个输入各经电阻 R<sub>k</sub> 接反相端，反馈电阻 R<sub>f</sub>：</p>
          <div class="formula">u<sub>o</sub> = −R<sub>f</sub>(u<sub>1</sub>/R<sub>1</sub> + u<sub>2</sub>/R<sub>2</sub> + …)</div>
          <p><strong>同相加法/减法电路</strong>：利用叠加定理分别求各输入单独作用时的输出再相加；减法电路常取 R<sub>1</sub> = R<sub>2</sub>、R<sub>3</sub> = R<sub>f</sub>，得 u<sub>o</sub> = (R<sub>f</sub>/R<sub>1</sub>)(u<sub>2</sub> − u<sub>1</sub>)。</p>
          <p><strong>积分电路</strong>：反相端经 R 接输入，反馈元件为电容 C：</p>
          <div class="formula">u<sub>o</sub> = −(1/RC)∫u<sub>i</sub>dt</div>
          <p><strong>微分电路</strong>：输入端为电容 C，反馈元件为 R：u<sub>o</sub> = −RC du<sub>i</sub>/dt。</p>
          <div class="callout tip">
            <p class="callout-h">分析步骤</p>
            <p>① 判断运放工作在线性区；② 用虚短、虚断列节点方程；③ 解出输出与输入的关系。积分/微分电路的结论只在理想运放与线性工作条件下成立。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export const c9: EeChapter = {
  id: 'c9',
  no: '第9章',
  title: '二极管及其基本电路',
  subtitle: '模拟电子部分 · 第 3 章',
  lede: `<p>本章从半导体物理出发，介绍 PN 结的单向导电性、二极管伏安特性与几种常用模型，以及整流、限幅等基本电路和稳压二极管等特殊器件。</p>`,
  toc: [
    { id: 'sec-ee9-semi', text: '1. 半导体与 PN 结', level: 2 },
    { id: 'sec-ee9-diode', text: '2. 二极管及其模型', level: 2 },
    { id: 'sec-ee9-circuit', text: '3. 二极管基本电路', level: 2 },
    { id: 'sec-ee9-special', text: '4. 特殊二极管', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee9-semi',
      heading: '1. 半导体与 PN 结',
      blocks: [
        {
          type: 'html',
          html: `
          <p>本征半导体中自由电子与空穴成对出现，导电能力弱且随温度升高而增强。掺入五价元素（磷）得 <strong>N 型</strong>半导体（多子为电子）；掺入三价元素（硼）得 <strong>P 型</strong>半导体（多子为空穴）。</p>
          <p>P 型与 N 型半导体接触，交界处多子扩散并留下不能移动的离子，形成<strong>空间电荷区（耗尽层）</strong>与内建电场，阻止进一步扩散，达到动态平衡。这个区域就是 <strong>PN 结</strong>。</p>
          <p>PN 结加<strong>正向电压</strong>（P 接正、N 接负）时耗尽层变窄，多子扩散加强，形成较大正向电流；加<strong>反向电压</strong>时耗尽层变宽，只有很小的反向饱和电流。这就是<strong>单向导电性</strong>。</p>
          <div class="formula">PN 结伏安特性：i = I<sub>S</sub>(e<sup>u/U<sub>T</sub></sup> − 1)，U<sub>T</sub> ≈ 26 mV（室温）</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee9-diode',
      heading: '2. 二极管及其模型',
      blocks: [
        {
          type: 'html',
          html: `
          <p>二极管由一个 PN 结加引线封装而成，P 端为阳极，N 端为阴极。伏安特性：正向导通后电压近似恒定（硅管约 0.7 V，锗管约 0.2 V）；反向时只有微小饱和电流，超过反向击穿电压后电流急剧增大。</p>
          <p>常用模型：</p>
          <ul>
            <li><strong>理想模型</strong>：正偏导通视为短路（u<sub>D</sub> = 0），反偏视为开路；</li>
            <li><strong>恒压降模型</strong>：正偏导通时 u<sub>D</sub> = U<sub>D(on)</sub>（硅管 0.7 V），反偏开路；</li>
            <li><strong>折线模型</strong>：导通段用电压源 U<sub>th</sub> 串联动态电阻 r<sub>D</sub> 近似；</li>
            <li><strong>小信号模型</strong>：在静态工作点附近线性化，r<sub>d</sub> = U<sub>T</sub>/I<sub>D</sub>。</li>
          </ul>
          <p>主要参数：最大整流电流 I<sub>F</sub>、最高反向工作电压 U<sub>R</sub>、反向饱和电流 I<sub>S</sub>、最高工作频率。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee9-circuit',
      heading: '3. 二极管基本电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>整流电路</strong>：利用单向导电性把交流变为脉动直流。半波整流输出平均值 U<sub>O(AV)</sub> ≈ 0.45U<sub>2</sub>；桥式全波整流 U<sub>O(AV)</sub> ≈ 0.9U<sub>2</sub>。</p>
          <p><strong>限幅电路</strong>：把输出幅度限制在一定范围。串联限幅、并联限幅（削波）通过二极管与直流电源的组合实现。</p>
          <p><strong>开关电路</strong>：二极管在正偏/反偏间切换，可作逻辑门或保护电路。</p>
          <div class="callout tip">
            <p class="callout-h">分析方法</p>
            <p>先假设二极管断开，求其两端电压；若正偏电压大于导通电压则导通，用相应模型替代后重新计算。含多个二极管时需判断哪个优先导通。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee9-special',
      heading: '4. 特殊二极管',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>稳压二极管</strong>：工作在反向击穿区，击穿后电压基本不变，用于稳压。使用时必须串联限流电阻，保证电流在允许范围内。</p>
          <p><strong>发光二极管（LED）</strong>：正向导通时发光，颜色取决于半导体材料；需串联限流电阻。</p>
          <p><strong>光电二极管</strong>：反向工作时，反向电流随光照强度变化，用于光检测。</p>
          <p><strong>变容二极管</strong>：反偏时结电容随反向电压变化，用于调谐电路。</p>
          `,
        },
      ],
    },
  ],
};

export const c10: EeChapter = {
  id: 'c10',
  no: '第10章',
  title: '场效应管及其放大电路',
  subtitle: '模拟电子部分 · 第 4 章',
  lede: `<p>场效应管（FET）是电压控制型器件，输入电阻极高。本章以 MOSFET 为主，讨论其结构、特性、共源放大电路及图解/小信号分析方法。</p>`,
  toc: [
    { id: 'sec-ee10-mosfet', text: '1. MOSFET 的结构与特性', level: 2 },
    { id: 'sec-ee10-cs', text: '2. 共源极放大电路', level: 2 },
    { id: 'sec-ee10-analysis', text: '3. 图解与小信号分析', level: 2 },
    { id: 'sec-ee10-other', text: '4. 共漏与共栅电路', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee10-mosfet',
      heading: '1. MOSFET 的结构与特性',
      blocks: [
        {
          type: 'html',
          html: `
          <p>MOSFET 由源极 S、漏极 D、栅极 G 与衬底 B 构成，栅极与沟道之间有很薄的二氧化硅绝缘层，输入电阻可达 10<sup>9</sup>～10<sup>15</sup> Ω。</p>
          <p>按沟道类型分 N 沟道与 P 沟道；按导通方式分<strong>增强型</strong>（u<sub>GS</sub> = 0 时无沟道）与<strong>耗尽型</strong>（u<sub>GS</sub> = 0 时已有沟道）。N 沟道增强型 MOSFET 当 u<sub>GS</sub> &gt; U<sub>TN</sub> 时形成沟道。</p>
          <p>输出特性分可变电阻区、恒流区（饱和区）与截止区。放大电路应工作在<strong>恒流区</strong>。恒流区近似方程：</p>
          <div class="formula">i<sub>D</sub> = ½K<sub>n</sub>(u<sub>GS</sub> − U<sub>TN</sub>)<sup>2</sup>（忽略沟道长度调制）</div>
          <p>跨导 g<sub>m</sub> = ∂i<sub>D</sub>/∂u<sub>GS</sub> = K<sub>n</sub>(u<sub>GS</sub> − U<sub>TN</sub>) = √(2K<sub>n</sub>I<sub>D</sub>)，是衡量栅压控制漏流能力的参数。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee10-cs',
      heading: '2. 共源极放大电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p>共源极电路：源极接地，输入加在栅极，输出从漏极取出。为保证工作在恒流区，需设置合适的<strong>静态工作点</strong>（分压式偏置、自给偏置等）。</p>
          <p>中频小信号电压增益（带源极旁路电容时）：</p>
          <div class="formula">A<sub>v</sub> = −g<sub>m</sub>(R<sub>D</sub> ∥ R<sub>L</sub>)；R<sub>i</sub> ≈ R<sub>g</sub>；R<sub>o</sub> ≈ R<sub>D</sub></div>
          <p>输出与输入反相。若不接旁路电容，源极电阻 R<sub>S</sub> 引入电流串联负反馈，增益降为 A<sub>v</sub> = −g<sub>m</sub>R<sub>D</sub>/(1 + g<sub>m</sub>R<sub>S</sub>)，但工作更稳定。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee10-analysis',
      heading: '3. 图解与小信号分析',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>图解法</strong>：在输出特性曲线上作直流负载线 u<sub>DS</sub> = V<sub>DD</sub> − i<sub>D</sub>R<sub>D</sub>，与 u<sub>GS</sub> 对应的曲线交点即静态工作点 Q。再用交流负载线分析动态范围与失真。</p>
          <p><strong>小信号模型法</strong>：在 Q 点附近把 FET 线性化，栅源间视为开路（R<sub>gs</sub> → ∞），漏源间用受控电流源 g<sub>m</sub>u<sub>gs</sub> 并联 r<sub>ds</sub> 表示。把电路中的电容短路、直流电源置零，得到小信号等效电路，再求增益、输入/输出电阻。</p>
          <div class="callout key">
            <p class="callout-h">分析顺序</p>
            <p>先直流分析（求 Q 点与 g<sub>m</sub>），再交流小信号分析（求动态指标）。两者不能混在一起。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee10-other',
      heading: '4. 共漏与共栅电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>共漏极电路</strong>（源极跟随器）：输入加在栅极，输出从源极取出，漏极接电源。电压增益略小于 1 且同相，输入电阻很大、输出电阻很小，常用作缓冲级。</p>
          <div class="formula">A<sub>v</sub> = g<sub>m</sub>(R<sub>S</sub> ∥ R<sub>L</sub>)/(1 + g<sub>m</sub>(R<sub>S</sub> ∥ R<sub>L</sub>)) ≈ 1；R<sub>o</sub> ≈ 1/g<sub>m</sub></div>
          <p><strong>共栅极电路</strong>：输入从源极加入，栅极交流接地，输出从漏极取出。输入电阻小、频带宽，常用于高频或电流缓冲场合。</p>
          <p>与 BJT 相比，FET 是电压控制、输入电阻高、噪声低、热稳定性好，但跨导较小、增益一般低于 BJT。</p>
          `,
        },
      ],
    },
  ],
};

export const c11: EeChapter = {
  id: 'c11',
  no: '第11章',
  title: '双极结型三极管及其放大电路',
  subtitle: '模拟电子部分 · 第 5 章',
  lede: `<p>双极结型三极管（BJT）是电流控制型器件，有三个工作区。本章讨论其结构、原理、特性与参数，以及共射、共集、共基三种基本放大电路。</p>`,
  toc: [
    { id: 'sec-ee11-bjt', text: '1. BJT 的结构与工作原理', level: 2 },
    { id: 'sec-ee11-ce', text: '2. 共射极放大电路', level: 2 },
    { id: 'sec-ee11-cc', text: '3. 共集与共基电路', level: 2 },
    { id: 'sec-ee11-compare', text: '4. 三种组态比较与多级放大', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee11-bjt',
      heading: '1. BJT 的结构与工作原理',
      blocks: [
        {
          type: 'html',
          html: `
          <p>BJT 由两个 PN 结组成：发射结（发射区—基区）与集电结（基区—集电区），分 NPN 与 PNP 两种。基区很薄且掺杂浓度低，这是电流放大的结构基础。</p>
          <p>放大条件：<strong>发射结正偏、集电结反偏</strong>。发射区多子大量注入基区，少部分复合形成基极电流，大部分扩散到集电结被收集，形成集电极电流。因此</p>
          <div class="formula">i<sub>C</sub> = βi<sub>B</sub>，i<sub>E</sub> = i<sub>B</sub> + i<sub>C</sub> = (1 + β)i<sub>B</sub></div>
          <p>三个工作区：<strong>截止区</strong>（发射结反偏，i<sub>C</sub> ≈ 0）、<strong>放大区</strong>（发射结正偏、集电结反偏，i<sub>C</sub> = βi<sub>B</sub>）、<strong>饱和区</strong>（两结均正偏，u<sub>CE</sub> 很小，i<sub>C</sub> 不再随 i<sub>B</sub> 增大）。</p>
          <p>主要参数：电流放大系数 β、穿透电流 I<sub>CEO</sub>、集电极最大电流 I<sub>CM</sub>、集电极最大功耗 P<sub>CM</sub>、反向击穿电压 U<sub>(BR)CEO</sub>。温度升高时 β 增大、U<sub>BE</sub> 减小、I<sub>CBO</sub> 增大，需采取稳定措施。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee11-ce',
      heading: '2. 共射极放大电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p>共射极电路：发射极交流接地，输入加在基极，输出从集电极取出。它是电压反相放大器，既有电压增益又有电流增益，应用最广。</p>
          <p>静态工作点由偏置电路决定。分压式偏置 + 发射极电阻 R<sub>E</sub> 可稳定 Q 点：当温度升高使 I<sub>C</sub> 增大时，U<sub>E</sub> 升高、U<sub>BE</sub> 减小，从而抑制 I<sub>C</sub> 增大。</p>
          <p>中频小信号指标（带旁路电容）：</p>
          <div class="formula">A<sub>v</sub> = −β(R<sub>C</sub> ∥ R<sub>L</sub>)/r<sub>be</sub>；R<sub>i</sub> = R<sub>b</sub> ∥ r<sub>be</sub>；R<sub>o</sub> ≈ R<sub>C</sub></div>
          <p>其中 r<sub>be</sub> = r<sub>bb'</sub> + (1 + β)U<sub>T</sub>/I<sub>EQ</sub> 为 BJT 输入电阻。输出与输入反相。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee11-cc',
      heading: '3. 共集与共基电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>共集电极电路</strong>（射极跟随器）：集电极交流接地，输入加在基极，输出从发射极取出。电压增益略小于 1 且同相，输入电阻大、输出电阻小，用作缓冲级。</p>
          <div class="formula">A<sub>v</sub> = (1+β)(R<sub>E</sub>∥R<sub>L</sub>)/[r<sub>be</sub>+(1+β)(R<sub>E</sub>∥R<sub>L</sub>)] ≈ 1；R<sub>i</sub> = R<sub>b</sub>∥[r<sub>be</sub>+(1+β)(R<sub>E</sub>∥R<sub>L</sub>)]</div>
          <p><strong>共基极电路</strong>：基极交流接地，输入从发射极加入，输出从集电极取出。电流增益略小于 1，电压增益大且同相，输入电阻小、频带宽，常用于高频放大。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee11-compare',
      heading: '4. 三种组态比较与多级放大',
      blocks: [
        {
          type: 'html',
          html: `
          <table class="tbl">
            <thead><tr><th>组态</th><th>A<sub>v</sub></th><th>R<sub>i</sub></th><th>R<sub>o</sub></th><th>相位</th><th>主要用途</th></tr></thead>
            <tbody>
              <tr><td>共射</td><td>大</td><td>中</td><td>中</td><td>反相</td><td>电压放大</td></tr>
              <tr><td>共集</td><td>≈1</td><td>大</td><td>小</td><td>同相</td><td>缓冲、阻抗变换</td></tr>
              <tr><td>共基</td><td>大</td><td>小</td><td>中</td><td>同相</td><td>高频、宽带</td></tr>
            </tbody>
          </table>
          <p><strong>多级放大电路</strong>：各级级联，总增益为各级增益之积（分贝相加）；后级输入电阻是前级的负载，前级输出电阻影响后级源增益。耦合方式有阻容耦合、直接耦合、变压器耦合与光电耦合。</p>
          <p>直接耦合存在零点漂移问题，差分放大电路是抑制零漂的有效结构（见第 12 章）。</p>
          `,
        },
      ],
    },
  ],
};

/* 电路与电子技术基础 · 模拟电子部分（第 12～15 章）
 * 依据课件：ch07 模拟集成电路、ch08 反馈放大电路、ch09 功率放大电路、ch11 直流电源电路。 */
import type { EeChapter } from './types';

export const c12: EeChapter = {
  id: 'c12',
  no: '第12章',
  title: '模拟集成电路',
  subtitle: '模拟电子部分 · 第 7 章',
  lede: `<p>模拟集成电路把大量元件集成在同一芯片上，电阻精度低、电容难集成，因此大量使用<strong>电流源偏置</strong>与<strong>差分放大</strong>结构。本章讨论电流源、差分放大电路与集成运放内部电路。</p>`,
  toc: [
    { id: 'sec-ee12-current', text: '1. 直流偏置与电流源', level: 2 },
    { id: 'sec-ee12-diff', text: '2. 差分式放大电路', level: 2 },
    { id: 'sec-ee12-opamp', text: '3. 集成运放电路与参数', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee12-current',
      heading: '1. 直流偏置与电流源',
      blocks: [
        {
          type: 'html',
          html: `
          <p>集成电路中做大电阻不经济，常用<strong>恒流源</strong>代替高阻值电阻作为偏置与有源负载。基本形式：</p>
          <ul>
            <li><strong>镜像电流源</strong>：两只参数相同的管子，基准电流 I<sub>REF</sub> = (V<sub>CC</sub> − U<sub>BE</sub>)/R，输出电流 I<sub>C2</sub> ≈ I<sub>REF</sub>；</li>
            <li><strong>比例电流源</strong>：通过发射极电阻比例改变输出电流；</li>
            <li><strong>微电流源</strong>：利用很小的 U<sub>BE</sub> 差值获得微安级电流；</li>
            <li><strong>威尔逊电流源</strong>：提高输出电阻与精度。</li>
          </ul>
          <p>电流源的交流等效电阻很大，作为有源负载可显著提高单级电压增益。BJT 与 MOSFET 都可构成电流源，后者更易集成。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee12-diff',
      heading: '2. 差分式放大电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p>差分放大电路由两只对称的放大管组成，有两个输入端和两个输出端，能有效抑制<strong>共模信号</strong>（如温度漂移、电源波动），放大<strong>差模信号</strong>。</p>
          <p>定义差模输入 u<sub>id</sub> = u<sub>i1</sub> − u<sub>i2</sub>，共模输入 u<sub>ic</sub> = (u<sub>i1</sub> + u<sub>i2</sub>)/2。理想对称时，共模增益 A<sub>vc</sub> = 0，共模输出为零。</p>
          <div class="formula">差模增益 A<sub>vd</sub> = −β(R<sub>C</sub>∥R<sub>L</sub>)/r<sub>be</sub>（双端输出）；共模抑制比 K<sub>CMR</sub> = |A<sub>vd</sub>/A<sub>vc</sub>|</div>
          <p>长尾电阻 R<sub>E</sub> 越大，共模抑制能力越强；但 R<sub>E</sub> 太大影响静态工作点，故常用恒流源代替 R<sub>E</sub>。差分电路有双端输入/单端输入、双端输出/单端输出四种接法，增益与抑制能力不同。</p>
          <p>差分放大电路是集成运放输入级的核心，也是抑制零点漂移的基本手段。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee12-opamp',
      heading: '3. 集成运放电路与参数',
      blocks: [
        {
          type: 'html',
          html: `
          <p>集成运放内部通常为：差分输入级（抑制零漂、提供高输入电阻）→ 中间放大级（提供高增益，常用有源负载共射/共源）→ 输出级（互补对称功率输出，低输出电阻）→ 偏置电路（电流源）。</p>
          <p>主要参数：开环差模增益 A<sub>od</sub>、输入失调电压 U<sub>IO</sub> 与温漂、输入失调电流 I<sub>IO</sub>、输入偏置电流 I<sub>IB</sub>、共模抑制比 K<sub>CMR</sub>、开环带宽与单位增益带宽、转换速率 S<sub>R</sub>、最大输出电压与输出电流。</p>
          <div class="callout tip">
            <p class="callout-h">选用要点</p>
            <p>高精度直流放大关注失调与温漂；宽带/高速关注单位增益带宽与转换速率；大信号关注输出幅度与功率。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export const c13: EeChapter = {
  id: 'c13',
  no: '第13章',
  title: '反馈放大电路',
  subtitle: '模拟电子部分 · 第 8 章',
  lede: `<p>反馈把输出量送回输入回路。负反馈虽降低增益，却能稳定增益、扩展频带、减小失真、改变输入/输出电阻。本章讨论反馈的分类、增益表达式、负反馈的影响与稳定性。</p>`,
  toc: [
    { id: 'sec-ee13-concept', text: '1. 反馈的基本概念与分类', level: 2 },
    { id: 'sec-ee13-gain', text: '2. 负反馈增益的一般表达式', level: 2 },
    { id: 'sec-ee13-effect', text: '3. 负反馈对性能的影响', level: 2 },
    { id: 'sec-ee13-stable', text: '4. 深度负反馈与稳定性', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee13-concept',
      heading: '1. 反馈的基本概念与分类',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>反馈</strong>：把输出回路的电量（电压或电流）以一定方式送回输入回路，参与控制。有反馈的放大电路称闭环，无反馈称开环。</p>
          <p>分类：</p>
          <ul>
            <li><strong>正反馈/负反馈</strong>：反馈信号使净输入增大为正反馈，减小为负反馈。判断用<strong>瞬时极性法</strong>；</li>
            <li><strong>直流反馈/交流反馈</strong>：反馈通路中只有直流量为直流反馈（稳定 Q 点），只有交流量为交流反馈；</li>
            <li><strong>串联/并联</strong>：反馈信号与输入信号在输入端以电压求和为串联，以电流求和为并联；</li>
            <li><strong>电压/电流</strong>：反馈信号取自输出电压为电压反馈（输出端短路则反馈消失），取自输出电流为电流反馈（输出端开路则反馈消失）。</li>
          </ul>
          <p>四种组态：电压串联、电压并联、电流串联、电流并联负反馈。</p>
          <div class="callout key">
            <p class="callout-h">判断口诀</p>
            <p>先看输入端（串联/并联），再看输出端（电压/电流），最后用瞬时极性判断正负。输出短路法判断电压/电流反馈最可靠。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee13-gain',
      heading: '2. 负反馈增益的一般表达式',
      blocks: [
        {
          type: 'html',
          html: `
          <p>设开环增益 A，反馈系数 F，则闭环增益为</p>
          <div class="formula">A<sub>f</sub> = A/(1 + AF)</div>
          <p>其中 1 + AF 称为<strong>反馈深度</strong>。|1 + AF| &gt; 1 为负反馈，|1 + AF| &lt; 1 为正反馈，1 + AF = 0 时电路自激振荡。</p>
          <p>不同组态的 A、F、A<sub>f</sub> 量纲不同（电压增益无量纲、互阻增益为 Ω、互导增益为 S），但表达式形式一致。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee13-effect',
      heading: '3. 负反馈对性能的影响',
      blocks: [
        {
          type: 'html',
          html: `
          <ul>
            <li><strong>降低增益</strong>：闭环增益是开环增益的 1/(1+AF)；</li>
            <li><strong>稳定增益</strong>：dA<sub>f</sub>/A<sub>f</sub> = (1/(1+AF))·dA/A，增益的相对变化减小到 1/(1+AF)；</li>
            <li><strong>扩展频带</strong>：上限频率提高 (1+AF) 倍，下限频率降低 (1+AF) 倍，增益带宽积基本不变；</li>
            <li><strong>减小非线性失真</strong>：对环路内产生的失真抑制为 1/(1+AF)，但可能产生新的频率成分；</li>
            <li><strong>改变输入/输出电阻</strong>：串联负反馈增大 R<sub>i</sub>，并联负反馈减小 R<sub>i</sub>；电压负反馈减小 R<sub>o</sub>，电流负反馈增大 R<sub>o</sub>。</li>
          </ul>
          <table class="tbl">
            <thead><tr><th>组态</th><th>R<sub>i</sub></th><th>R<sub>o</sub></th></tr></thead>
            <tbody>
              <tr><td>电压串联</td><td>增大</td><td>减小</td></tr>
              <tr><td>电压并联</td><td>减小</td><td>减小</td></tr>
              <tr><td>电流串联</td><td>增大</td><td>增大</td></tr>
              <tr><td>电流并联</td><td>减小</td><td>增大</td></tr>
            </tbody>
          </table>
          <p>负反馈只能改善反馈环内的性能；对输入信号本身的失真无能为力。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee13-stable',
      heading: '4. 深度负反馈与稳定性',
      blocks: [
        {
          type: 'html',
          html: `
          <p>当 |1 + AF| ≫ 1（深度负反馈）时，A<sub>f</sub> ≈ 1/F。闭环增益几乎只由反馈网络决定，与开环增益无关，因此稳定、可预测。</p>
          <div class="formula">深度负反馈：A<sub>f</sub> ≈ 1/F；虚短虚断可用于近似计算</div>
          <p>负反馈可能引起<strong>自激振荡</strong>：若环路增益 AF 在某个频率上满足 |AF| ≥ 1 且附加相移为 180°，则 1 + AF = 0，电路振荡。判断稳定性用<strong>环路增益的幅频/相频特性</strong>（波特图）：相位裕度与增益裕度足够大才稳定。</p>
          <p>防止自激：减小反馈深度、主极点补偿（加补偿电容）、超前/滞后补偿等。运放内部通常已做频率补偿，使用时注意负载电容的影响。</p>
          `,
        },
      ],
    },
  ],
};

export const c14: EeChapter = {
  id: 'c14',
  no: '第14章',
  title: '功率放大电路',
  subtitle: '模拟电子部分 · 第 9 章',
  lede: `<p>功率放大电路向负载提供足够大的不失真功率，重点关注<strong>输出功率</strong>与<strong>效率</strong>。本章讨论甲类、乙类、甲乙类互补对称电路与 D 类功放。</p>`,
  toc: [
    { id: 'sec-ee14-basic', text: '1. 功率放大电路的一般问题', level: 2 },
    { id: 'sec-ee14-class', text: '2. 甲类、乙类与甲乙类', level: 2 },
    { id: 'sec-ee14-d', text: '3. D 类功放与功率管', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee14-basic',
      heading: '1. 功率放大电路的一般问题',
      blocks: [
        {
          type: 'html',
          html: `
          <p>电压放大电路关注不失真电压增益；功率放大电路关注<strong>输出功率</strong>、<strong>效率</strong>与<strong>失真</strong>。功放管工作在大信号状态，接近极限运用。</p>
          <p>主要指标：</p>
          <div class="formula">输出功率 P<sub>o</sub> = U<sub>o</sub>I<sub>o</sub>（有效值）；效率 η = P<sub>o</sub>/P<sub>V</sub> × 100%（P<sub>V</sub> 为电源提供的功率）</div>
          <p>按导通角分类：甲类（360°）、乙类（180°）、甲乙类（180°～360°）、丙类（&lt;180°）、丁类（开关状态）。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee14-class',
      heading: '2. 甲类、乙类与甲乙类',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>甲类</strong>：管子全程导通，波形不失真，但静态电流大、效率低（最高约 50%）。射极输出器是甲类功放的典型例子。</p>
          <p><strong>乙类双电源互补对称电路（OCL）</strong>：NPN 与 PNP 管轮流导通，正负半周分别放大。理想最大输出功率与效率：</p>
          <div class="formula">P<sub>om</sub> = V<sub>CC</sub><sup>2</sup>/(2R<sub>L</sub>)；η<sub>max</sub> = π/4 ≈ 78.5%</div>
          <p>乙类存在<strong>交越失真</strong>：在过零附近两管都未导通。</p>
          <p><strong>甲乙类互补对称电路</strong>：给两管加适当正向偏置，使静态时微导通，消除交越失真；效率略低于乙类。OTL 电路采用单电源 + 输出电容，原理类似。</p>
          <p>功放管选择：集电极最大电流 I<sub>CM</sub> &gt; V<sub>CC</sub>/R<sub>L</sub>，反向击穿电压 U<sub>(BR)CEO</sub> &gt; 2V<sub>CC</sub>，最大功耗 P<sub>CM</sub> &gt; 0.2P<sub>om</sub>。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee14-d',
      heading: '3. D 类功放与功率管',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>D 类功放</strong>：管子工作在开关状态，用 PWM 调制音频信号，再经低通滤波还原。理想效率接近 100%，体积小、发热少，广泛用于便携音频设备。</p>
          <p>功率管（大功率 BJT、MOSFET、IGBT）需安装散热器，注意结温与安全工作区（SOA）。实际应用中应留有余量，避免二次击穿。</p>
          <div class="callout tip">
            <p class="callout-h">效率与失真</p>
            <p>甲类失真最小、效率最低；乙类效率高但有交越失真；甲乙类折中；D 类效率最高，但需滤波与电磁兼容设计。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export const c15: EeChapter = {
  id: 'c15',
  no: '第15章',
  title: '直流电源电路',
  subtitle: '模拟电子部分 · 第 11 章',
  lede: `<p>直流电源把电网交流电变为稳定的直流电，为放大电路提供能量。本章按「变压 → 整流 → 滤波 → 稳压」的顺序讨论各环节。</p>`,
  toc: [
    { id: 'sec-ee15-compose', text: '1. 直流电源的组成', level: 2 },
    { id: 'sec-ee15-rect', text: '2. 整流与滤波', level: 2 },
    { id: 'sec-ee15-reg', text: '3. 稳压电路', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ee15-compose',
      heading: '1. 直流电源的组成',
      blocks: [
        {
          type: 'html',
          html: `
          <p>直流稳压电源一般由四部分组成：</p>
          <ol>
            <li><strong>电源变压器</strong>：把 220 V 交流电降压到合适的交流电压；</li>
            <li><strong>整流电路</strong>：把交流变为脉动直流（二极管单向导电）；</li>
            <li><strong>滤波电路</strong>：滤除脉动成分，得到较平滑的直流；</li>
            <li><strong>稳压电路</strong>：在电网电压或负载变化时保持输出稳定。</li>
          </ol>
          <div class="formula">220 V/50 Hz → 变压 → 整流 → 滤波 → 稳压 → 直流输出</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ee15-rect',
      heading: '2. 整流与滤波',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>单相半波整流</strong>：只有正半周导通，输出平均值 U<sub>O(AV)</sub> ≈ 0.45U<sub>2</sub>，脉动大、效率低。</p>
          <p><strong>单相桥式整流</strong>：四个二极管组成桥式电路，正负半周都有输出，U<sub>O(AV)</sub> ≈ 0.9U<sub>2</sub>，脉动减小，应用最广。每个二极管承受的最大反向电压为 √2U<sub>2</sub>。</p>
          <p><strong>电容滤波</strong>：电容与负载并联，利用电容充放电平滑输出。滤波电容越大、负载电阻越大，输出电压越平滑，但二极管冲击电流增大。工程上按 R<sub>L</sub>C ≥ (3～5)T/2 选取电容。</p>
          <p>其他滤波：电感滤波（适用于大电流负载）、LC 滤波、π 型滤波。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ee15-reg',
      heading: '3. 稳压电路',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>稳压二极管稳压电路</strong>：稳压管与负载并联、串联限流电阻，利用反向击穿区电压基本不变的特性。结构简单，但输出电流小、稳压精度一般。</p>
          <p><strong>串联型稳压电路</strong>：调整管与负载串联，取样电路检测输出电压，与基准电压比较后控制调整管，形成负反馈稳压。包含调整管、基准电压、取样电路与比较放大四部分。</p>
          <p><strong>集成稳压器</strong>：如 78XX（正电压）、79XX（负电压）系列，三端器件，内部含调整管、基准与保护电路，使用方便。可调输出用 LM317/LM337。</p>
          <div class="formula">78XX：输出固定正电压；输入输出压差一般不小于 2～3 V，并需就近接滤波电容</div>
          <p>开关型稳压电源效率高（可达 90% 以上），但输出纹波与电磁干扰较大，广泛用于计算机与消费电子。</p>
          `,
        },
      ],
    },
  ],
};

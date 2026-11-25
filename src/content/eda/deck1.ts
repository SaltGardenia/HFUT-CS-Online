import type { DeckData } from '../types';

/** EDA 实训 —— 课件：EDA实训学习参考资料02-EDA相关知识介绍（79 页） */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1讲',
  title: 'EDA 技术与 Altium Designer 实训',
  subtitle: 'AD 软件 · PCB 基础 · 原理图设计 · PCB 设计流程 · 布局走线 · 封装绘制 · 电路仿真',
  lede:
    'EDA 实训以 Altium Designer（AD）为平台，完成「电路原理图设计 → 编译与网络表 → PCB 板图设计 → 规则检查 → 制板」的完整流程。本讲按课件顺序梳理 AD 的功能与常用操作、印制电路板基础知识、原理图与 PCB 的设计步骤、元件布局与走线原则、自定义元件封装的绘制方法，以及 AD 的电路仿真功能。',
  toc: [
    { id: 'sec-1-1', text: '一、Altium Designer 与 PCB 基础', level: 2 },
    { id: 'sec-1-2', text: '二、电路原理图设计', level: 2 },
    { id: 'sec-1-3', text: '三、PCB 设计流程', level: 2 },
    { id: 'sec-1-4', text: '四、布局走线原则与封装绘制', level: 2 },
    { id: 'sec-1-5', text: '五、电路仿真', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '一、Altium Designer 与 PCB 基础',
      blocks: [
        {
          type: 'html',
          html: `
<p>主要教学内容：基础知识（AD 软件简介、印刷电路板基本知识、设计流程、制作）、电路原理图设计、电路板设计与制作、电路仿真。</p>
<h3>Altium Designer 简介</h3>
<p>Altium Designer 是功能强大的通用电路板设计软件，简称 AD。发展历程：1985 TANGO → 1988 Protel for DOS → 2000 Protel 99 SE → 2001 Protel DXP → 2004 Protel DXP 2004 → 2006 Altium Designer 6.0 → 2009 Altium Designer Winter 09（8.3）→ 2013 Altium Designer Winter 14。</p>
<p>主要功能：</p>
<ol>
<li>电路原理图设计：SCH、SCHLIB、各种文本编辑器；</li>
<li>印刷电路板设计：PCB、PCBLIB、电路板组件管理器；</li>
<li>电路模拟仿真；</li>
<li>FPGA 及逻辑器设计；</li>
<li>高级信号完整性分析。</li>
</ol>
<p>主要特点：功能强大，支持多国语言，完全兼容 Protel 各版本。</p>
<h3>两个基本概念</h3>
<ul>
<li><strong>电路原理图（schematic）</strong>：说明电路中各个元器件电气连接关系的图纸，不涉及元器件的具体大小、形状，只关心类型与相互连接情况。</li>
<li><strong>印刷电路板（PCB）</strong>：用来安装、固定各个实际电路元器件，并利用铜箔走线实现其正确连接关系的一块基板。作用是安装、固定支撑元器件，并用铜箔走线把各种元器件连接起来形成电流通路。</li>
</ul>
<p>分类：刚性板与柔性板；酚醛树脂板、环氧树脂板、聚酰亚胺、聚酯薄膜等；目前常用单层、双面、四层、六层板等。</p>
<ul>
<li>单面板：早期电路板主要连接较大体积元器件，受制造工艺限制，以单面板为主。</li>
<li>双面板：集成电路出现后布局更复杂，两面都可以走线。</li>
<li>多层板：除顶面、底面走线层外，板子中间还有走线层（含电源 / 接地层、过孔、绝缘层、沉孔、螺丝孔、导电孔、插件孔等）。</li>
</ul>
<h3>PCB 设计流程</h3>
<p>原理图设计（.SchDoc）→ 编译原理图 → 生成网络表（.Net）→ 规划电路板 → 调取网络表 → 设计电路板（.PcbDoc）→ 规则检查（.html）。工程文件为 .PrjPcb。</p>
<p>一般步骤：</p>
<ol>
<li>建立 PCB 设计工程文件（.PrjPcb）；</li>
<li>绘制电路原理图，对元件属性赋值（.SchDoc）；</li>
<li>编译原理图，以消息方式显示错误；</li>
<li>生成网络表（.NET，系统自动生成）；</li>
<li>生成 PCB 板图，绘制板框（.PcbDoc）；</li>
<li>调入网络表，完成元件位置布置，设置布线规则，完成全部布线；</li>
<li>电路板规则检查（.html，系统自动生成）。</li>
</ol>
<h3>实验室手工制板</h3>
<p>流程：电路设计 → 打印图纸 → 转印图纸 → 修补线条 → 腐蚀铜箔 → 去除碳膜 → 打孔 → 清洗 → 涂助焊剂。</p>
<p>软件汉化后需重启生效。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '二、电路原理图设计',
      blocks: [
        {
          type: 'html',
          html: `
<h3>设计流程</h3>
<ol>
<li>在 E 盘建立以自己学号命名的文件夹，新建 PCB 项目工程并保存，名字改为「电子实习」；</li>
<li>右键「电子实习.PrjPcb」为工程添加原理图文件，保存为「练习1」（其后为练习2、3…）；</li>
<li>设置文档选项：在图纸上点击鼠标右键；</li>
<li>安装所有元件库，包括原理图符库和元件封装库；</li>
<li>添加图中所有元件，依据原理图进行元器件间的电气联接。画导线快捷 <code>P W</code>；注意要捕捉到元件的电气节点才能画正确的线；</li>
<li>双击元件编辑修改其属性：标识、参数、封装等；</li>
<li>编译（规则检查）：没有错误时 Messages 为空白，有错误 / 警告要修改；</li>
<li>生成网络表文件（练习1.NET）。</li>
</ol>
<div class="callout tip">
<p class="callout-h">常用元件库</p>
<p><code>Miscellaneous Devices.SCHLIB</code>：包含常用的电阻、电容、二极管、三极管、接插件（端口）、MOS 管等符号；<code>Protel DOS Schematic 4000 CMOS / Intel / Linear / Operational Amplifiers / Voltage Regulators.SCHLIB</code> 等。若标准库里没有，需要自定义其图符及封装。</p>
</div>
<h3>自定义数码管图符</h3>
<ol>
<li>在工程中新建一个 Schematic Library 文件并打开；</li>
<li>放置一个大小合适的矩形；</li>
<li>用画直线和椭圆的命令绘制「8.8.8.」；</li>
<li>放置 10 个元件管脚，管脚上的十字叉朝外；双击每个管脚，修改名称和编号；</li>
<li>修改元件名称，把绘制完成的数码管文件安装到库中即可正常使用。</li>
</ol>
<h3>常用快捷操作</h3>
<table class="tbl">
<thead><tr><th>快捷键</th><th>功能</th></tr></thead>
<tbody>
<tr><td>Ctrl+C / X / V</td><td>复制 / 剪切 / 粘贴</td></tr>
<tr><td>Ctrl+R</td><td>复制多个</td></tr>
<tr><td>Ctrl+D</td><td>复制一个（先选中元件）</td></tr>
<tr><td>SA / XA</td><td>选中所有元件 / 释放被选中的所有元件</td></tr>
<tr><td>选中元件 + X / Y</td><td>元件方向水平 / 垂直切换</td></tr>
<tr><td>选中元件 + Tab</td><td>打开元件属性编辑器</td></tr>
<tr><td>选中元件 + 空格</td><td>元器件旋转</td></tr>
<tr><td>PP</td><td>放置元器件</td></tr>
</tbody>
</table>
<p>快捷键要在输入法为英文状态时才起作用。</p>
<h3>常用元件说明（封装 / SCHLIB 名称）</h3>
<table class="tbl">
<thead><tr><th>名称</th><th>封装 footprint</th><th>SCHLIB 名称</th></tr></thead>
<tbody>
<tr><td>直插电阻</td><td>AXIAL0.3</td><td>RES2</td></tr>
<tr><td>无极性电容</td><td>RAD0.1</td><td>CAP</td></tr>
<tr><td>电解电容</td><td>RB.1/.2</td><td>ELECTRO1</td></tr>
<tr><td>普通二极管</td><td>DIODE0.4</td><td>DIODE</td></tr>
<tr><td>发光二极管</td><td>LED</td><td>LED（自定义）</td></tr>
<tr><td>三极管</td><td>TO92C</td><td>NPN、PNP</td></tr>
<tr><td>LM741</td><td>DIP8</td><td>LM741</td></tr>
<tr><td>CD4049</td><td>DIP16</td><td>4049</td></tr>
<tr><td>单片机</td><td>DIP40</td><td>8051</td></tr>
<tr><td>数码管</td><td>DIS</td><td>DIS（自定义）</td></tr>
<tr><td>按钮开关</td><td>SW</td><td>SW-PB（自定义）</td></tr>
<tr><td>晶振</td><td>CRYSTAL</td><td>CRYSTAL（自定义）</td></tr>
<tr><td>单列直插接口</td><td>SIP2 / SIP3</td><td>CON2 / CON3</td></tr>
</tbody>
</table>
<p>贴片元件：电容 10pF～10uF、电阻几欧～数百 K，常用封装 0603 / 0805 / 1005；集成电路 SO4～SO20，依据 IC 手册选用；三极管 SOT-23、SOT-89。选用贴片集成电路时一定要查阅器件手册，确保封装符合元件尺寸要求。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '三、PCB 设计流程',
      blocks: [
        {
          type: 'html',
          html: `
<h3>绘图单位与层</h3>
<p>AD 提供英制（imperial）与公制（Metric）两种单位，单位切换快捷键 <code>Q</code>。1000mil = 25.4mm = 1 英寸。绝大多数器件管脚间距以英制定义：电阻 AXIAL0.3 表示管脚间距 300mil = 7.62mm；电容 RAD0.2 间距 200mil = 5.08mm；直插 IC 相邻管脚间距 100mil = 2.54mm。</p>
<table class="tbl">
<thead><tr><th>层</th><th>含义</th></tr></thead>
<tbody>
<tr><td>Top Layer</td><td>顶层走线层（默认红色）</td></tr>
<tr><td>Bottom Layer</td><td>底层走线层（默认蓝色）</td></tr>
<tr><td>Top Overlayer</td><td>顶层丝印层，用于字符丝网露印（默认黄色）</td></tr>
<tr><td>Bottom Overlayer</td><td>底层丝印层（可选）</td></tr>
<tr><td>Keep Out Layer</td><td>禁止层，用于定义 PCB 板框</td></tr>
<tr><td>Multi Layer</td><td>穿透层（焊盘镀锡层）</td></tr>
<tr><td>Mechanical Layer 1~4</td><td>机械层，用于尺寸标注等</td></tr>
</tbody>
</table>
<p>常用封装库：<code>PCB Footprints.PCBLIB</code>（大多数常见元件封装：贴片 / 直插电阻、电容、二三极管、DIP 直插集成电路、电位器等）；<code>Transistors.PCBLIB</code>（晶体管封装）；各厂家一般也有自己的元件库。建议把常用元件封装整理成单独的库文件。</p>
<h3>PCB 设计步骤</h3>
<ol>
<li>建立 PCB 文件并保存，名字改成「练习1」；</li>
<li>安装标准 PCB 封装库和自定义元件封装库（PCB Footprints、Transistors 及自绘封装）；</li>
<li>加载网络表，如果有错返回原理图修改；元件被调出后，元件之间由<strong>飞线</strong>连接——飞线代表连接关系，并不存在于 PCB 中；</li>
<li>按照一定原则排列元件；</li>
<li>规划电路板大小：在层选择中选中 Keep-Out Layer（禁止布线层），用画线命令画一个比排列元件稍大一些的矩形；也可用菜单重新定义板子外形；</li>
<li>定义布线规则：最小间距改为 20mil；线宽最小 15mil、最大 30mil、首选 20mil；走线层把 Top Layer 上的勾去掉则为单面板；</li>
<li>手工画线或自动布线，再手工修改不合适的线；</li>
<li>布线规则检查：Messages 对话框应为空白，有错再修改 PCB 文件；</li>
<li>电路板三维 / 3D 显示（可翻转）；</li>
<li>PCB 后续处理：加泪滴（修改布线前要先删除泪滴）、铺铜网（单面板只在底层铺铜，双面板铺顶层和底层；可删除铜网）、放置字符串。</li>
</ol>
<p>元件变绿（报警）的修改方法：修改电路前先删除已布好的线，保留几个勾。<strong>用向导建立 PCB 文件</strong>的方法可指定尺寸（示例 55mm × 88mm）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '四、布局走线原则与封装绘制',
      blocks: [
        {
          type: 'html',
          html: `
<h3>元件布局原则</h3>
<ul>
<li>电路板尺寸长宽以 3:2 或 4:3 为最佳；当大于 200mm 长、150mm 宽时考虑强度；</li>
<li>高频元器件之间的连线越短越好；隶属于输入或输出电路的元器件之间距离越远越好；</li>
<li>具有高电位差的元器件应加大与其他连线的距离，一般 200V/mm 比较合适；</li>
<li>发热元器件应远离热敏元器件；</li>
<li>可调元器件应放在比较容易调节的地方，要与整机面板一致；</li>
<li>太重或发热量多的元器件不宜安装在电路板上。</li>
</ul>
<h3>按电路功能布局</h3>
<ul>
<li>如无特殊要求，尽可能按原理图的元件安排布局：信号从左边进入、右边输出，从上边输入、下边输出；</li>
<li>按电路流程安排各功能电路单元的位置，使信号流通更顺畅并保持一致；</li>
<li>以每个功能电路为核心，围绕核心电路布局，元件安排应均匀、整齐、紧凑；</li>
<li>数字部分与模拟部分的地线分开。</li>
</ul>
<h3>布线要求</h3>
<ul>
<li><strong>线长</strong>：铜线尽可能短，拐角为圆角或斜角；</li>
<li><strong>线宽</strong>：一般 1–1.5mm 线宽可流过 2A 电流，但一般选择大于 0.3mm；手工制板大于 0.5mm；</li>
<li><strong>线间距</strong>：相邻铜线间距应满足电气安全要求并便于生产，越宽越好，最小间距应能承受所加电压峰值；</li>
<li><strong>屏蔽与接地</strong>：公共地尽可能放在电路板边缘，尽可能多保留铜箔做地线以增强屏蔽能力，地线形状最好做成环路或网络状；</li>
<li>顶层、底层走线尽量相互垂直、避免相互平行，尽量减少过孔数量。</li>
</ul>
<h3>自定义封装绘制</h3>
<p>封装库里没有的元件必须精确绘制封装，否则可能导致整块电路板报废。绘制前先测量元件管脚直径、形状、外形长宽。要点：</p>
<ul>
<li>焊盘钻孔直径比测量管脚直径大 0.2~0.4mm（经验值），焊盘外径 X、Y 尺寸比孔径大 0.6~0.8mm；</li>
<li>元件外形一般在顶层丝印层绘制（PCB 上的白色文字）；</li>
<li>必须定义参考原点，否则在 PCB 中找不到该元件或无法移动。</li>
</ul>
<p>步骤：向工程添加 PCB Library 并保存为「自定义封装」→ 设置栅格（工具-器件库选项，栅格 1、2 改为 10mil 和 100mil）→ 在 Top Overlayer 绘制外形、放焊盘（PP），焊盘外径 1.8mm、孔径 0.6mm → 修改封装名字（工具-元件属性，改成要求的 footprint 名称）→ 设置参考点（编辑-设置参考-1 脚）→ 绘制第二个元件，步骤同上。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '五、电路仿真',
      blocks: [
        {
          type: 'html',
          html: `
<p>传统方法使用面包板搭建实际电路，之后对关键节点逐点测试，通过示波器波形判断电路是否达到设计要求；现在使用软件进行电路仿真，把上述过程全部搬到计算机中。</p>
<p>Altium Designer 中允许的分析类型：</p>
<ol>
<li>直流工作点分析；</li>
<li>瞬态分析和傅立叶分析；</li>
<li>交流小信号分析；</li>
<li>阻抗特性分析；</li>
<li>噪声分析；</li>
<li>Pole-Zero（临界点）分析；</li>
<li>传递函数分析。</li>
</ol>
<div class="callout key">
<p class="callout-h">实训要点回顾</p>
<p>原理图只表达电气连接；PCB 才承载实际元件与铜箔走线。设计链路的四份关键文件：.<code>PrjPcb</code>（工程）、.<code>SchDoc</code>（原理图）、.<code>Net</code>（网络表）、.<code>PcbDoc</code>（板图），最后由规则检查生成 .<code>html</code> 报告。布局决定信号流向与散热，走线决定电气性能与可制造性；封装错误会让整板报废。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck1;

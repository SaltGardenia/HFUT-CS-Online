import type { DeckData } from '../types';

/** 第1章 Python 课程概述 —— 课件 PPT/第一章Python课程概述2023（85 页） */
const deck1: DeckData = {
  id: 'deck1',
  no: '第1章',
  title: 'Python 课程概述',
  subtitle: '语言特点 · 安装与启动 · 对象模型与变量 · 数字与字符串 · 运算符 · 内置函数 · 代码规范 · 快速入门',
  lede:
    'Python 是一门跨平台、开源、免费的解释型高级动态编程语言，支持命令式、函数式与面向对象编程，被称为「胶水语言」。本章从课程概况与开发环境入手，建立 Python 的对象模型、变量与类型、运算符与内置函数等基础，最后以三个小案例完成快速入门。',
  toc: [
    { id: 'sec-1-1', text: '1.1 引言：Python 语言与课程概况', level: 2 },
    { id: 'sec-1-2', text: '1.2 安装、启动与 pip', level: 2 },
    { id: 'sec-1-3', text: '1.3.1 基础知识：对象、变量与类型', level: 2 },
    { id: 'sec-1-4', text: '1.3.5 运算符、表达式与内置函数', level: 2 },
    { id: 'sec-1-5', text: '1.3.8 模块导入、文件类型与 __name__', level: 2 },
    { id: 'sec-1-6', text: '1.4 代码规范', level: 2 },
    { id: 'sec-1-7', text: '1.5 快速入门案例与小结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '1.1 引言：Python 语言与课程概况',
      blocks: [
        {
          type: 'html',
          html: `
<p>Python 由 <strong>Guido van Rossum（吉多·范罗苏姆）</strong>于 1989 年创立，名称取自喜剧团体 <em>Monty Python's Flying Circus</em>。版本信息见 <code>https://www.python.org/doc/versions/</code>。</p>
<h3>Python 语言的魅力</h3>
<ul>
<li>跨平台、开源、免费的<strong>解释型高级动态编程语言</strong>；</li>
<li>支持伪编译，把源程序转换为字节码以优化程序、提高运行速度；</li>
<li>可用 py2exe、pyinstaller 或 cx_Freeze 把 Python 程序转换为二进制可执行文件；</li>
<li>支持命令式编程（How to do）与函数式编程（What to do），完全支持面向对象程序设计；</li>
<li>语法简洁清晰，拥有大量几乎支持所有领域应用开发的成熟扩展库；</li>
<li><strong>胶水语言</strong>：可把多种不同语言编写的程序融合到一起实现无缝拼接，更好发挥不同语言和工具的优势。</li>
</ul>
<p>典型应用方向：Web 开发（Django、Pyramid、Flask）；科学计算（NumPy、SciPy、Matplotlib）；桌面 GUI（PyQT、WXPython、TkInter）；软件开发、商业应用、教育等。</p>
<h3>课程概况</h3>
<table class="tbl">
<thead><tr><th>项目</th><th>内容</th></tr></thead>
<tbody>
<tr><td>课程名称</td><td>Python 语言与系统设计（课程代码 0521760X）</td></tr>
<tr><td>开课单位</td><td>计算机与信息学院</td></tr>
<tr><td>课程类型</td><td>专业选修课程</td></tr>
<tr><td>开课学期</td><td>第三学期</td></tr>
<tr><td>学时 / 学分</td><td>(24 理论 + 8 实践) / 2</td></tr>
<tr><td>选课对象</td><td>主要面向计算机科学与技术专业</td></tr>
</tbody>
</table>
<p>教材：董付国《Python 程序设计》（第 2 版 / 第 3 版），清华大学出版社。</p>
<table class="tbl">
<thead><tr><th>教学方式</th><th>学时</th><th>占比</th></tr></thead>
<tbody>
<tr><td>PM1 讲授法教学</td><td>16</td><td>66.7%</td></tr>
<tr><td>PM3 案例教学</td><td>6</td><td>25.0%</td></tr>
<tr><td>PM2 研讨式学习</td><td>2</td><td>8.3%</td></tr>
</tbody>
</table>
<table class="tbl">
<thead><tr><th>评估方式</th><th>占比</th></tr></thead>
<tbody>
<tr><td>EM1 课堂测试</td><td>20%</td></tr>
<tr><td>EM3 期末考试</td><td>40%</td></tr>
<tr><td>EM5 实验分析报告</td><td>20%</td></tr>
<tr><td>EM11 设计报告</td><td>20%</td></tr>
</tbody>
</table>
<div class="callout key">
<p class="callout-h">课程内容安排（理论 10 次 + 实验 3 次）</p>
<ol>
<li>第一章：Python 基础知识（2 学时）</li>
<li>第二章：Python 序列与复杂数据结构（4 学时）</li>
<li>第三章：程序的控制结构（2 学时）</li>
<li>第四章：字符串与正则表达式（2 学时）</li>
<li>第五章：函数设计与使用（2 学时）</li>
<li>第六章：面向对象程序设计（4 学时）</li>
<li>第七章：文件操作与异常处理（2 学时）</li>
<li>第八章：科学计算与可视化（选学，2 学时）</li>
<li>第九章：GUI 编程（选学，2 学时）</li>
<li>第十一章：多线程与多进程编程（选学，2 学时）</li>
<li>实验一：Python 序列与复杂数据结构；实验二：判断、循环、函数、文件；实验三：综合设计实验（面向实际应用问题编程设计算法）</li>
</ol>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '1.2 安装、启动与 pip',
      blocks: [
        {
          type: 'html',
          html: `
<h3>开发环境</h3>
<p>默认编程环境：<strong>IDLE</strong>（Integrated Development &amp; Learning Environment）。其他常用环境：PyCharm、Anaconda3、Eclipse + PyDev、wingIDE、Eric、PythonWin、zwPython。</p>
<p>重要网址：<code>https://www.python.org/</code>、<code>https://www.python.org/doc/</code>、<code>http://bugs.python.org/</code>、<code>https://hackerone.com/python</code>、<code>http://stackoverflow.com/questions/tagged/python</code>、<code>https://www.runoob.com/python/python-intro.html</code>。</p>
<h3>安装</h3>
<ul>
<li>下载地址：<code>www.python.org/downloads/</code>；安装时需勾选 <strong>Add python.exe to Path</strong>。</li>
<li>高级别的 3.0 系列<strong>不兼容</strong> 2.0 系列，Python 3.x 已成为主流。</li>
<li>多版本共存的简便方法：修改系统环境变量 Path。</li>
</ul>
<h3>用 pip 管理第三方包</h3>
<table class="tbl">
<thead><tr><th>pip 命令示例</th><th>说明</th></tr></thead>
<tbody>
<tr><td><code>pip download SomePackage[==version]</code></td><td>下载扩展库的指定版本，不安装</td></tr>
<tr><td><code>pip freeze [&gt; requirements.txt]</code></td><td>以 requirements 的格式列出已安装模块</td></tr>
<tr><td><code>pip list</code></td><td>列出当前已安装的所有模块</td></tr>
<tr><td><code>pip install SomePackage[==version]</code></td><td>在线安装指定版本</td></tr>
<tr><td><code>pip install SomePackage.whl</code></td><td>通过 whl 文件离线安装扩展库</td></tr>
<tr><td><code>pip install package1 package2 ...</code></td><td>依次在线安装多个扩展模块</td></tr>
<tr><td><code>pip install -r requirements.txt</code></td><td>安装文件中指定的扩展库</td></tr>
<tr><td><code>pip install --upgrade SomePackage</code></td><td>升级模块</td></tr>
<tr><td><code>pip uninstall SomePackage[==version]</code></td><td>卸载指定版本</td></tr>
</tbody>
</table>
<h3>启动方式</h3>
<ol>
<li>启动 Windows 命令行工具，输入 <code>python</code>；</li>
<li>调用 IDLE 启动图形化运行环境；</li>
<li>在资源管理器中切换到相应文件夹，Shift + 鼠标右键直接进入命令提示符；</li>
<li>用任意文本编辑器编写代码，保存为 <code>.py</code> 或 <code>.pyw</code> 文件；</li>
<li>在 IDLE 中按 Ctrl+N 新建窗口，输入语句并保存，按 F5（Run Module）运行；</li>
<li>将 Python 集成到 Eclipse、PyCharm 等面向较大规模项目开发的 IDE 中。</li>
</ol>
<p>IDLE 常用快捷键：Alt+P / Alt+N 浏览历史命令（上一条 / 下一条）；Ctrl+F6 重启 Shell（之前定义的对象和导入的模块全部失效）；F1 打开帮助文档；Alt+/ 自动补全曾出现过的单词；Ctrl+] / Ctrl+[ 缩进 / 取消缩进代码块；Alt+3 / Alt+4 注释 / 取消注释代码块；Tab 补全单词。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '1.3.1 基础知识：对象、变量与类型',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>对象</strong>是 Python 中最基本的概念——在 Python 中处理的一切都是对象。许多内置对象可直接使用，如数字、字符串、列表、<code>del</code> 等；非内置对象需要导入模块才能使用，如正弦函数 <code>sin(x)</code>、随机数产生函数 <code>random()</code> 等。</p>
<table class="tbl">
<thead><tr><th>对象类型</th><th>类型名称</th><th>示例</th><th>简要说明</th></tr></thead>
<tbody>
<tr><td>数字</td><td>int, float, complex</td><td>1234, 3.14, 1.3e5, 3+4j</td><td>数字大小没有限制，内置支持复数及其运算</td></tr>
<tr><td>字符串</td><td>str</td><td>'swfu', "I'm student", '''Python ''', r'abc'</td><td>单引号、双引号、三引号作定界符；r/R 引导原始字符串</td></tr>
<tr><td>字节串</td><td>bytes</td><td>b'hello world'</td><td>以字母 b 引导，可用单 / 双 / 三引号作定界符</td></tr>
<tr><td>列表</td><td>list</td><td>[1, 2, 3]，['a', 'b', ['c', 2]]</td><td>方括号，逗号分隔，元素可为任意类型</td></tr>
<tr><td>字典</td><td>dict</td><td>{1:'food', 2:'taste', 3:'import'}</td><td>大括号，元素形式为「键:值」</td></tr>
<tr><td>元组</td><td>tuple</td><td>(2, -5, 6), (3,)</td><td>不可变；只有一个元素时后面的逗号不能省略</td></tr>
<tr><td>集合</td><td>set / frozenset</td><td>{'a', 'b', 'c'}</td><td>元素不重复；set 可变，frozenset 不可变</td></tr>
<tr><td>布尔型</td><td>bool</td><td>True, False</td><td>关系、成员测试、同一性测试表达式的值</td></tr>
<tr><td>空类型</td><td>NoneType</td><td>None</td><td>空值</td></tr>
<tr><td>异常</td><td>Exception、ValueError、TypeError</td><td>—</td><td>内置大量异常类，分别对应不同类型异常</td></tr>
<tr><td>文件</td><td>—</td><td>f = open('data.dat', 'rb')</td><td>open 按指定模式打开文件，返回文件对象</td></tr>
<tr><td>其他可迭代对象</td><td>—</td><td>生成器、range、zip、enumerate、map、filter 对象</td><td>具有惰性求值特点；除 range 外元素只能看一次</td></tr>
<tr><td>编程单元</td><td>—</td><td>函数（def）、类（class）、模块（module）</td><td>类和函数都是可调用对象；模块集中存放函数、类、常量等</td></tr>
</tbody>
</table>
<h3>变量</h3>
<p>Python 中<strong>不需事先声明变量名及其类型</strong>，直接赋值即可创建各种类型的对象变量。变量并不直接存储值，而是存储了值的内存地址（引用），这也是变量类型随时可以改变的原因。</p>
<pre class="code"><code>&gt;&gt;&gt; x = 3                       # 创建整型变量 x
&gt;&gt;&gt; x = 'Hello world.'          # 再赋值后 x 变成字符串变量
&gt;&gt;&gt; type(x)                     # 查看变量类型
&lt;class 'str'&gt;
&gt;&gt;&gt; isinstance(3, int)          # 测试对象是否是某个类型的实例
True</code></pre>
<ul>
<li>Python 属于<strong>强类型</strong>编程语言，解释器根据赋值或运算自动推断变量类型；同时是<strong>动态类型</strong>语言，变量类型可随时变化。</li>
<li>变量出现在赋值运算符（或 +=、*= 等复合赋值）左边表示创建或修改变量，否则表示引用其值。</li>
<li>字符串和元组属于不可变序列，不能通过下标修改元素值，例如 <code>x = (1,2,3); x[1] = 5</code> 会抛出 <code>TypeError: 'tuple' object does not support item assignment</code>。</li>
<li>多个变量可指向同一个值；修改其中一个变量的值后其内存地址会变化，但不影响另一变量。Python 采用<strong>基于值的内存管理</strong>：为不同变量赋相同值时，该值在内存中只有一份。</li>
</ul>
<div class="callout warn">
<p class="callout-h">变量命名规则</p>
<ul>
<li>必须以字母或下划线开头（以下划线开头在 Python 中有特殊含义）；</li>
<li>不能包含空格及标点符号；</li>
<li>不能使用关键字作变量名（共 33 个，可用 <code>print(keyword.kwlist)</code> 查看）；</li>
<li>不建议使用系统内置模块名、类型名、函数名或已导入模块名作变量名（可用 <code>dir(__builtins__)</code> 查看内置对象）；</li>
<li>对英文字母大小写敏感，<code>student</code> 与 <code>Student</code> 是不同变量。</li>
</ul>
</div>
<p>赋值语句的执行过程：先计算等号右侧表达式的值，再在内存中寻找位置存放该值，最后创建变量并指向这个内存地址。Python 具有<strong>自动内存管理</strong>功能：对于没有任何变量指向的值会自动删除；显式使用 <code>del</code> 删除不需要的值或关闭资源仍是好习惯。</p>
<h3>数字类型</h3>
<p>数字是<strong>不可变对象</strong>，可表示任意大小的数字；IDLE 交互界面可当作简便计算器。Python 的数字类型有三类：整数、浮点数与复数。</p>
<ul>
<li>十进制整数：0、-1、9、123；</li>
<li>十六进制：以 <code>0x</code> 开头，如 0x10、0xfa、0xabcdef；</li>
<li>八进制：以 <code>0o</code> 开头，如 0o35、0o11；</li>
<li>二进制：以 <code>0b</code> 开头，如 0b101、0b100；</li>
<li>浮点数：15.0、0.37、-11.2、1.2e2、314.15e-2；</li>
<li>复数：如 <code>a = 3+4j</code>，<code>c.real</code> 取实部、<code>c.imag</code> 取虚部、<code>a.conjugate()</code> 返回共轭复数。</li>
</ul>
<p>Python 3.6.x 起支持在数字中间使用单个下划线分隔以提高可读性：<code>1_000_000</code> → 1000000，<code>1_2.3_45</code> → 12.345。</p>
<h3>字符串类型</h3>
<p>用单引号、双引号或三引号界定的符号系列称为字符串；单引号、双引号、三单引号、三双引号可以互相嵌套以表示复杂字符串，例如 <code>'''Tom said, "Let's go"'''</code>。字符串属于<strong>不可变序列</strong>，空字符串表示为 <code>''</code> 或 <code>""</code>；三引号字符串可以换行，也可在程序中表示较长的注释。</p>
<ul>
<li>字符串之间可以用 <code>+</code> 连接、用 <code>*</code> 重复；<code>len()</code> 返回字符串长度；相邻字面量可直接拼接（<code>'1234''abcd'</code>），但变量与字面量之间不能这样连接。</li>
<li>常用转义字符：<code>\\b</code> 退格、<code>\\f</code> 换页、<code>\\n</code> 换行、<code>\\r</code> 回车、<code>\\t</code> 水平制表、<code>\\v</code> 垂直制表、<code>\\\\</code> 反斜线、<code>\\'</code> 单引号、<code>\\"</code> 双引号、<code>\\ooo</code> 三位八进制、<code>\\xhh</code> 两位十六进制、<code>\\uhhhh</code> 四位 Unicode。</li>
<li>字符串定界符前加字母 r 或 R 表示<strong>原始字符串</strong>，其中特殊字符不转义（最后一个字符不能是反斜线），主要用于正则表达式、文件路径或 URL。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; path = r'C:\\Windows\\notepad.exe'
&gt;&gt;&gt; print(path)
C:\\Windows\\notepad.exe</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '1.3.5 运算符、表达式与内置函数',
      blocks: [
        {
          type: 'html',
          html: `
<h3>运算符与功能</h3>
<table class="tbl">
<thead><tr><th>运算符</th><th>功能说明</th></tr></thead>
<tbody>
<tr><td>+</td><td>算术加法；列表、元组、字符串合并与连接；正号</td></tr>
<tr><td>-</td><td>算术减法；集合差集；相反数</td></tr>
<tr><td>*</td><td>算术乘法；序列重复</td></tr>
<tr><td>/</td><td>真除法</td></tr>
<tr><td>//</td><td>求整商；操作数中有实数时结果为实数形式的整数</td></tr>
<tr><td>%</td><td>求余数；字符串格式化</td></tr>
<tr><td>**</td><td>幂运算</td></tr>
<tr><td>&lt;、&lt;=、&gt;、&gt;=、==、!=</td><td>值的大小比较；集合的包含关系比较</td></tr>
<tr><td>or、and、not</td><td>逻辑或、逻辑与、逻辑非</td></tr>
<tr><td>in</td><td>成员测试</td></tr>
<tr><td>is</td><td>对象同一性测试（是否为同一对象 / 内存地址是否相同）</td></tr>
<tr><td>|、^、&amp;、&lt;&lt;、&gt;&gt;、~</td><td>位或、位异或、位与、左移、右移、位求反</td></tr>
<tr><td>&amp;、|、^、-</td><td>集合交集、并集、对称差集、差集</td></tr>
</tbody>
</table>
<ul>
<li><code>+</code> 还可用于列表、元组、字符串的连接，但不支持不同类型的对象相加；Python 内部把 True 当作 1、False 当作 0。</li>
<li><code>*</code> 用于列表、字符串、元组与整数运算时表示内容重复并返回新对象。</li>
<li><code>/</code> 为真除法（<code>3/5 = 0.6</code>），<code>//</code> 为整商（<code>3//5 = 0</code>、<code>-13//10 = -2</code>）。</li>
<li><code>%</code> 求余数的符号与右侧运算数一致：<code>-17 % 4 = 3</code>，<code>17 % -4 = -3</code>。</li>
<li>关系运算符可以连用，<code>1 &lt; 3 &lt; 5</code> 等价于 <code>1 &lt; 3 and 3 &lt; 5</code>；不同类型对象一般不能比较。</li>
<li>位运算符只能用于整数：先把整数转换为二进制、右对齐（必要时左侧补 0），按位运算后再转回十进制。以 a = 60（0011 1100）、b = 13（0000 1101）为例：<code>a&amp;b = 12</code>、<code>a|b = 61</code>、<code>a^b = 49</code>、<code>~a = -61</code>。</li>
<li>集合的交、并、对称差借助位运算符实现，差集用减号：<code>{1,2,3}|{3,4,5} = {1,2,3,4,5}</code>、<code>&amp;</code> 得 <code>{3}</code>、<code>^</code> 得 <code>{1,2,4,5}</code>、<code>-</code> 得 <code>{1,2}</code>。创建空集合必须用 <code>set()</code>，因为 <code>{}</code> 创建的是空字典。</li>
</ul>
<div class="callout key">
<p class="callout-h">惰性求值与特殊说明</p>
<p><code>and</code> 和 <code>or</code> 具有惰性求值特点，只计算必须计算的表达式，最后一个计算的表达式的值作为整个表达式的值：<code>3&lt;5 or a&gt;3</code> 返回 True（不计算后面），<code>3&gt;5 or a&gt;3</code> 因 a 未定义而报 NameError；<code>3 and 5</code> 返回 5；<code>not</code> 的结果只能是 True 或 False。</p>
<p>Python <strong>不支持 ++ 和 -- 运算符</strong>：<code>++i</code> 是「正正得正」，<code>i++</code> 是语法错误。逗号不是运算符，只是普通分隔符：<code>x = 3, 5</code> 得到元组 <code>(3, 5)</code>。</p>
</div>
<h3>常用内置函数</h3>
<p>内置函数不需要导入任何模块即可使用，执行 <code>dir(__builtins__)</code> 可列出全部内置函数。课件按类给出：</p>
<table class="tbl">
<thead><tr><th>函数</th><th>功能简要说明</th></tr></thead>
<tbody>
<tr><td>abs(x)</td><td>返回数字 x 的绝对值或复数 x 的模</td></tr>
<tr><td>all(iterable) / any(iterable)</td><td>全部元素为真返回 True（空可迭代对象为 True）/ 存在真元素返回 True（空为 False）</td></tr>
<tr><td>ascii(obj) / repr(obj)</td><td>转换为 ASCII 表示形式 / 规范化字符串表示形式</td></tr>
<tr><td>bin(x) / oct(x) / hex(x)</td><td>整数转二进制 / 八进制 / 十六进制串（参数必须为整数）</td></tr>
<tr><td>bool(x)</td><td>返回与 x 等价的布尔值</td></tr>
<tr><td>bytes(x)</td><td>生成字节串或把对象转换为字节串</td></tr>
<tr><td>callable(obj)</td><td>测试对象是否可调用（类、函数、含 __call__() 的对象）</td></tr>
<tr><td>compile() / eval(s) / exec(x)</td><td>编译代码 / 计算字符串表达式的值 / 执行代码</td></tr>
<tr><td>complex(real[, imag])</td><td>返回复数</td></tr>
<tr><td>chr(x) / ord(x)</td><td>Unicode 编码转字符 / 字符转 Unicode 编码（互逆）</td></tr>
<tr><td>delattr(obj, name)</td><td>删除属性，等价于 del obj.name</td></tr>
<tr><td>dir(obj)</td><td>返回对象的成员列表；不带参数返回当前作用域标识符</td></tr>
<tr><td>divmod(x, y)</td><td>返回 (x//y, x%y) 元组</td></tr>
<tr><td>enumerate(iterable[, start])</td><td>返回 (索引, 值) 形式的迭代器对象</td></tr>
<tr><td>filter(func, seq)</td><td>返回使 func 为 True 的元素；func 为 None 时返回等价于 True 的元素</td></tr>
<tr><td>float(x) / int(x[, d])</td><td>转浮点数 / 取整数部分或按 d 进制转换字符串</td></tr>
<tr><td>frozenset([x])</td><td>创建不可变集合</td></tr>
<tr><td>getattr / setattr / hasattr</td><td>获取 / 设置 / 测试对象属性</td></tr>
<tr><td>globals() / locals()</td><td>返回全局 / 局部变量字典</td></tr>
<tr><td>hash(x)</td><td>返回对象哈希值（不可哈希则抛异常）</td></tr>
<tr><td>help(obj)</td><td>返回对象帮助信息</td></tr>
<tr><td>id(obj)</td><td>返回对象标识（内存地址）</td></tr>
<tr><td>input([提示])</td><td>显示提示、接收键盘输入，<strong>返回字符串</strong></td></tr>
<tr><td>isinstance(obj, 类型)</td><td>测试对象是否为指定类型的实例</td></tr>
<tr><td>iter(obj) / next(iterator[, default])</td><td>返回迭代器 / 取下一个元素</td></tr>
<tr><td>len(obj)</td><td>返回对象包含的元素个数</td></tr>
<tr><td>list / set / tuple / dict</td><td>类型转换或创建空容器</td></tr>
<tr><td>map(func, *iterables)</td><td>把函数映射到每个元素，返回 map 对象</td></tr>
<tr><td>max(x) / min(x) / sum(x, start=0)</td><td>最大值 / 最小值 / 求和</td></tr>
<tr><td>open(name[, mode])</td><td>按模式打开文件并返回文件对象</td></tr>
<tr><td>pow(x, y, z=None)</td><td>x 的 y 次方，或 (x ** y) % z</td></tr>
<tr><td>print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)</td><td>基本输出函数</td></tr>
<tr><td>range([start,] end[, step])</td><td>返回左闭右开区间内以 step 为步长的整数序列</td></tr>
<tr><td>reversed(seq)</td><td>返回逆序迭代器对象</td></tr>
<tr><td>round(x[, 小数位数])</td><td>四舍五入</td></tr>
<tr><td>sorted(iterable, key=None, reverse=False)</td><td>返回排序后的新列表，不改变原对象</td></tr>
<tr><td>str(obj) / type(obj)</td><td>转字符串 / 返回对象类型</td></tr>
<tr><td>zip(seq1[, seq2 [...]])</td><td>把多个可迭代对象对应位置元素压成元组，长度取最短者</td></tr>
</tbody>
</table>
<h3>典型用法示例</h3>
<pre class="code"><code>&gt;&gt;&gt; print(3, 5, 7, sep=',')       # 指定分隔符
3,5,7
&gt;&gt;&gt; for i in range(10, 20):
...     print(i, end=' ')           # 不换行
10 11 12 13 14 15 16 17 18 19
&gt;&gt;&gt; bin(32), oct(32), hex(555)
('0b100000', '0o40', '0x20')
&gt;&gt;&gt; int(-3.5), int('101', 2)
(-3, 5)
&gt;&gt;&gt; list(range(1, 10, 2))
[1, 3, 5, 7, 9]
&gt;&gt;&gt; eval("1.1 + 2.2")
3.3
&gt;&gt;&gt; ord('a'), chr(65)
(97, 'A')
&gt;&gt;&gt; x = ['aaaa', 'bc', 'd', 'b', 'ba']
&gt;&gt;&gt; sorted(x, key=lambda item: (len(item), item))
['b', 'd', 'ba', 'bc', 'aaaa']
&gt;&gt;&gt; list(zip('abcd', '1234'))
[('a', '1'), ('b', '2'), ('c', '3'), ('d', '4')]
&gt;&gt;&gt; list(filter(str.isalnum, ['foo', 'x41', '?!', '***']))
['foo', 'x41']
&gt;&gt;&gt; list(enumerate('abcd'))
[(0, 'a'), (1, 'b'), (2, 'c'), (3, 'd')]
&gt;&gt;&gt; list(map(str, range(5)))
['0', '1', '2', '3', '4']</code></pre>
<div class="callout warn">
<p class="callout-h">惰性对象只能遍历一次</p>
<p>map、filter、enumerate、zip 等对象不仅具有惰性求值特点，<strong>访问过的元素不可再次访问</strong>：<code>x = map(str, range(10)); list(x)</code> 得到列表后，再 <code>list(x)</code> 得到 <code>[]</code>。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '1.3.8 模块导入、文件类型与 __name__',
      blocks: [
        {
          type: 'html',
          html: `
<h3>对象的删除</h3>
<p>Python 解释器会跟踪所有值，一旦发现某个值不再有任何变量指向就自动删除。<code>del</code> 命令显式删除对象并解除与值之间的指向关系；del 无法删除元组或字符串中的元素（不可变序列），只能删除整个对象。</p>
<pre class="code"><code>&gt;&gt;&gt; y = 3
&gt;&gt;&gt; z = y
&gt;&gt;&gt; del y
&gt;&gt;&gt; print(y)
NameError: name 'y' is not defined
&gt;&gt;&gt; print(z)
3</code></pre>
<h3>模块的导入与使用</h3>
<p>Python 启动时只加载很少一部分模块，需要时由程序员显式导入（可能需先安装），从而减小运行压力。可用 <code>sys.modules.items()</code> 查看所有预加载模块。</p>
<ul>
<li><code>import 模块名</code>；</li>
<li><code>from 模块名 import 对象名 [as 别名]</code>；</li>
<li><code>from math import *</code>。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; from math import sin
&gt;&gt;&gt; sin(3)
0.1411200080598672
&gt;&gt;&gt; from math import sin as f
&gt;&gt;&gt; f(3)
0.141120008059867</code></pre>
<p>重新导入模块在 3.x 中需要使用 imp 模块的 reload 函数。导入模块时的文件搜索顺序：<strong>当前文件夹 → sys.path 变量指定的文件夹</strong>；可用 <code>sys.path</code> 查看搜索路径，也可 append 自定义目录扩展路径。优先导入 pyc 文件；若 pyc 与 py 时间不相符，则导入 py 并重新编译。导入多个模块的建议顺序：标准库 → 成熟的第三方扩展库 → 自己开发的库。</p>
<h3>Python 文件类型</h3>
<ul>
<li><code>.py</code>：Python 源文件，由解释器负责解释执行；</li>
<li><code>.pyw</code>：Python 源文件，常用于图形界面程序；</li>
<li><code>.pyc</code>：Python 字节码文件，无法用文本编辑器直接查看，可用于隐藏源码和提高运行速度；模块第一次被导入时编译为字节码，再次导入优先使用 pyc；非模块文件直接执行时并不生成 pyc，可用 py_compile 的 compile() 编译；compileall 模块的 compile_dir()、compile_file()、compile_path() 支持批量编译；</li>
<li><code>.pyd</code>：一般由其他语言编写并编译的二进制文件，常用作软件工具的 Python 编程接口插件或动态链接库。</li>
</ul>
<h3>脚本的 __name__ 属性</h3>
<p>每个 Python 脚本运行时都有一个 <code>__name__</code> 属性：作为模块被导入时，其值自动设为<strong>模块名</strong>；独立运行时，其值自动设为 <code>"__main__"</code>。</p>
<pre class="code"><code># nametest.py
print(__name__)

# 直接运行 → __main__
# &gt;&gt;&gt; import nametest → nametest</code></pre>
<p>利用该属性可控制程序的运行方式。例如希望某模块只能被导入使用而不直接运行：</p>
<pre class="code"><code>if __name__ == '__main__':
    print('Please use me as a module.')</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-1-6',
      heading: '1.4 代码规范',
      blocks: [
        {
          type: 'html',
          html: `
<h3>缩进</h3>
<p>缩进指每一行代码开始前的空白区域，用来表示代码之间的包含和层次关系；<strong>1 个缩进 = 4 个空格</strong>。类定义、函数定义、选择结构、循环结构、with 块，行尾的冒号表示缩进的开始。Python 程序依靠代码块的缩进来体现代码之间的逻辑关系，缩进结束就表示一个代码块结束。</p>
<h3>注释</h3>
<ul>
<li>以 <code>#</code> 开始，表示本行 # 之后的内容为注释；</li>
<li>包含在一对三引号 <code>'''...'''</code> 或 <code>"""..."""</code> 之间且不属于任何语句的内容，被解释器认为是注释。</li>
</ul>
<h3>语句过长与空格空行</h3>
<ul>
<li>可在行尾加续行符 <code>\\</code> 换行分成多行；更建议使用括号包含多行内容。</li>
<li>运算符两侧、逗号后面建议增加一个空格，如 <code>x = 1, 2</code>。</li>
<li>不同功能的代码块之间、不同的函数定义之间建议增加一个空行以增加可读性。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-1-7',
      heading: '1.5 快速入门案例与小结',
      blocks: [
        {
          type: 'html',
          html: `
<h3>用计算机解决问题的一般过程</h3>
<ol>
<li>分析问题，分析问题的计算部分；</li>
<li>划分边界，划分问题的功能边界；</li>
<li>设计算法，设计问题的求解算法；</li>
<li>编写程序，编写问题的计算程序；</li>
<li>调试测试，调试和测试程序；</li>
<li>升级维护，适应问题的升级维护。</li>
</ol>
<p><strong>IPO 程序编写方法</strong>：输入（Input）数据——文件输入、控制台输入、交互界面输出、随机数据输入等；处理（Process）数据——对输入数据进行计算产生输出结果，处理方法统称为「算法」；输出（Output）数据——控制台输出、图形输出、文件输出、网络输出、操作系统内部变量输出等。</p>
<h3>例 1-1：拆出三位自然数的百位、十位、个位</h3>
<pre class="code"><code>x = input('请输入一个三位数：')
x = int(x)
a = x // 100
b = x // 10 % 10
c = x % 10
print(a, b, c)

# 解法 2：divmod(a, b) 返回 (a // b, a % b)
x = int(input('请输入一个三位数：'))
a, b = divmod(x, 100)
b, c = divmod(b, 10)
print(a, b, c)

# 解法 3（Pythonic）
a, b, c = map(int, input('请输入一个三位数：'))
print(a, b, c)</code></pre>
<h3>例 1-2：已知两边长及夹角，求第三边长</h3>
<pre class="code"><code>import math
x = input('输入两边长及夹角（度）：')
a, b, theta = map(float, x.split())
c = math.sqrt(a**2 + b**2 - 2*a*b*math.cos(theta*math.pi/180))
print('c=', c)</code></pre>
<h3>例 1-3：任意输入三个英文单词，按字典顺序输出</h3>
<pre class="code"><code>s = input('x, y, z=')
x, y, z = s.split(',')
if x &gt; y:
    x, y = y, x
if x &gt; z:
    x, z = z, x
if y &gt; z:
    y, z = z, y
print(x, y, z)

# 更简单：sorted 返回排序后的列表
x, y, z = sorted(s.split(','))
print(x, y, z)</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：Python 基础知识（变量、数字类型、字符串类型、常用内置函数等）、Python 代码规范、Python 案例入门。思考：如何编写自己的 Python 代码？</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck1;

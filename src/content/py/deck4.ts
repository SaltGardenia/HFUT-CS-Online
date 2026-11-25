import type { DeckData } from '../types';

/** 第4章 字符串与正则表达式 —— 课件 PPT/第四章 字符串与正则表达式2023【New】（98 页） */
const deck4: DeckData = {
  id: 'deck4',
  no: '第4章',
  title: '字符串与正则表达式',
  subtitle: '编码与驻留 · %/format/f-string 格式化 · 常用方法 · 分词应用 · 正则语法 · re 模块 · match 对象',
  lede:
    '字符串是 Python 中的不可变序列，除支持序列通用操作外，还提供大量专用方法。本章先梳理字符编码与 Python 3 的字符串模型，系统掌握 % 格式、format() 与 f-string 三种格式化方式和常用字符串方法；随后进入正则表达式：元字符与子模式语法、re 模块的主要函数、正则对象与 match 对象，并用分词、电话号码提取、网页 iframe 检查等案例落地。',
  toc: [
    { id: 'sec-4-1', text: '4.1.1 字符串概述与编码', level: 2 },
    { id: 'sec-4-2', text: '4.1.2 三种字符串格式化', level: 2 },
    { id: 'sec-4-3', text: '4.1.3 字符串常用方法', level: 2 },
    { id: 'sec-4-4', text: '4.1.4 字符串相关标准库与应用', level: 2 },
    { id: 'sec-4-5', text: '4.3 正则表达式语法与 re 模块', level: 2 },
    { id: 'sec-4-6', text: '4.3 正则对象、match 对象与子模式扩展', level: 2 },
    { id: 'sec-4-7', text: '4.4 正则应用案例与本章小结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-4-1',
      heading: '4.1.1 字符串概述与编码',
      blocks: [
        {
          type: 'html',
          html: `
<p>最早的字符串编码是 ASCII，仅对 10 个数字、26 个大写英文字母、26 个小写英文字母及一些其他符号编码；采用 1 个字节，最多表示 256 个符号。常见编码还有 UTF-8、UTF-16、UTF-32、GB2312、GBK、CP936、base64、CP437 等。</p>
<ul>
<li><strong>GB2312</strong> 是我国制定的中文编码，1 个字节表示英语、2 个字节表示中文；</li>
<li><strong>GBK</strong> 是 GB2312 的扩充，<strong>CP936</strong> 是微软在 GBK 基础上开发的编码方式；三者都用 2 个字节表示中文；</li>
<li><strong>UTF-8</strong> 对全世界所有国家需要用到的字符编码：1 个字节表示英语字符（兼容 ASCII），3 个字节表示常见汉字，俄语、希腊语等符号用 2 个字节或 4 个字节。</li>
</ul>
<table class="tbl">
<thead><tr><th>编码</th><th>单个英文</th><th>单个汉字</th><th>备注</th></tr></thead>
<tbody>
<tr><td>ASCII</td><td>1 字节</td><td>不支持</td><td>美国</td></tr>
<tr><td>GB2312</td><td>1 字节</td><td>2 字节</td><td>中国</td></tr>
<tr><td>GBK</td><td>1 字节</td><td>2 字节</td><td>扩展 GB2312</td></tr>
<tr><td>CP936</td><td>1 字节</td><td>2 字节</td><td>微软 GBK</td></tr>
<tr><td>UTF-8</td><td>1 字节</td><td>3 字节</td><td>Unicode 变长模式</td></tr>
<tr><td>Unicode</td><td>1 字节</td><td>2 字节</td><td>常见 UCS-16，等长；存储 / 传输不划算</td></tr>
</tbody>
</table>
<p>Python 3.x 完全支持中文字符，默认使用 UTF-8 编码。无论数字、英文字母还是汉字，统计字符串长度时都按一个字符对待：</p>
<pre class="code"><code>&gt;&gt;&gt; s = '合肥工业大学'
&gt;&gt;&gt; len(s)
6
&gt;&gt;&gt; s = '合肥工业大学HFUT'   # 中文与英文同样对待
&gt;&gt;&gt; len(s)
10
&gt;&gt;&gt; 姓名 = '张三'             # 可以使用中文变量名
&gt;&gt;&gt; print(姓名)
张三</code></pre>
<p>字符串属于<strong>不可变序列</strong>，除支持序列通用方法（含分片）外，还支持专用字符串方法。Python 有<strong>字符串驻留机制</strong>：短字符串赋给多个不同对象时，内存中只有一个副本，多个对象共享；长字符串不遵守驻留机制。</p>
<p>编码与解码：<code>str.encode(encoding='UTF-8', errors='strict')</code> 按指定编码把字符串编码为字节串；<code>bytes.decode(encoding='utf-8', errors='strict')</code> 解码 bytes 对象。errors 可取 strict（默认，编码错误引发 UnicodeError）、ignore、replace、xmlcharrefreplace、backslashreplace 或 codecs.register_error() 注册的值。</p>
<pre class="code"><code>&gt;&gt;&gt; import zlib
&gt;&gt;&gt; x = 'Python程序设计系列图书，董付国编著，清华大学出版社'.encode()
&gt;&gt;&gt; len(x)
72
&gt;&gt;&gt; y = zlib.compress(x)
&gt;&gt;&gt; len(y)
83                              # 重复度小的信息，压缩比小
&gt;&gt;&gt; x = ('Python系列图书' * 3).encode()
&gt;&gt;&gt; len(x)
54
&gt;&gt;&gt; len(zlib.compress(x))
30</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-4-2',
      heading: '4.1.2 三种字符串格式化',
      blocks: [
        {
          type: 'html',
          html: `
<h3>% 格式</h3>
<table class="tbl">
<thead><tr><th>格式字符</th><th>说明</th></tr></thead>
<tbody>
<tr><td>%s</td><td>字符串（采用 str() 的显示）</td></tr>
<tr><td>%r</td><td>字符串（采用 repr() 的显示）</td></tr>
<tr><td>%c</td><td>单个字符</td></tr>
<tr><td>%d / %i</td><td>十进制整数</td></tr>
<tr><td>%o</td><td>八进制整数</td></tr>
<tr><td>%x</td><td>十六进制整数</td></tr>
<tr><td>%e / %E</td><td>指数（基底写为 e / E）</td></tr>
<tr><td>%f / %F</td><td>浮点数</td></tr>
<tr><td>%g / %G</td><td>指数或浮点数（根据显示长度）</td></tr>
<tr><td>%%</td><td>一个字符「%」</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; x = 1235
&gt;&gt;&gt; "%o" % x        # '2323'
&gt;&gt;&gt; "%x" % x        # '4d3'
&gt;&gt;&gt; "%e" % x        # '1.235000e+03'
&gt;&gt;&gt; "%s" % 65       # '65'
&gt;&gt;&gt; "%s" % [1, 2, 3]   # '[1, 2, 3]'
&gt;&gt;&gt; "%d" % "555"    # TypeError: %d format: a number is required, not str</code></pre>
<p><code>str()</code> 把值转化为适于人阅读的字符串形式，<code>repr()</code> 转化为供解释器读取的字符串形式（字符串会带引号）。<code>eval()</code> 执行字符串表达式并返回其值：</p>
<pre class="code"><code>&gt;&gt;&gt; x = 7
&gt;&gt;&gt; eval('3 * x')          # 21
&gt;&gt;&gt; eval('pow(2, 2)')      # 4
&gt;&gt;&gt; eval('"*".join(map(str, range(1, 6)))')   # '1*2*3*4*5'
&gt;&gt;&gt; eval("__import__('os').system('md testtest')")   # 危险！</code></pre>
<div class="callout warn">
<p class="callout-h">eval() 非常危险</p>
<p>eval 会把输入当作代码执行，例如 <code>__import__('os').startfile(...)</code> 可打开本机程序、<code>system('md testtest')</code> 可创建目录。不要对不可信输入直接使用 eval。</p>
</div>
<h3>format() 方法</h3>
<p>基本格式：<code>&lt;模板字符串&gt;.format(&lt;逗号分隔的参数&gt;)</code>。槽内部样式为 <code>{&lt;参数序号&gt;: &lt;格式控制标记&gt;}</code>，格式控制标记依次为 <strong>填充、对齐、宽度、逗号、精度、类型</strong> 6 个字段。</p>
<pre class="code"><code>&gt;&gt;&gt; "{} {}".format("hello", "world")          # 'hello world'
&gt;&gt;&gt; "{0} {1}".format("hello", "world")
&gt;&gt;&gt; "{1} {0} {1}".format("hello", "world")    # 'world hello world'
&gt;&gt;&gt; "{:.2f}".format(3.1415926)                # '3.14'
&gt;&gt;&gt; "The number {0:,} in hex is: {0:#x}, the number {1} in oct is {1:#o}".format(5555, 55)
The number 5,555 in hex is: 0x15b3, the number 55 in oct is 0o67
&gt;&gt;&gt; position = (5, 8, 13)
&gt;&gt;&gt; "X:{0[0]};Y:{0[1]};Z:{0[2]}".format(position)   # X:5;Y:8;Z:13
&gt;&gt;&gt; '{0:&lt;8d},{0:^8d},{0:&gt;8d}'.format(65)
'65      ,   65   ,      65'</code></pre>
<p>对齐符：<code>&lt;</code> 左对齐、<code>^</code> 居中、<code>&gt;</code> 右对齐；宽度不足时填充（默认空格）；数值超过槽宽时「挤爆」，宽度不再起约束作用；居中对齐剩余槽宽不对称时左少右多。</p>
<pre class="code"><code>weather = [("Monday", "rainy"), ("Tuesday", "sunny"),
           ("Wednesday", "sunny"), ("Thursday", "rainy"),
           ("Friday", "cloudy")]
formatter = "Weather of '{0[0]}' is '{0[1]}'".format
for item in map(formatter, weather):
    print(item)
for item in weather:               # 与上面等价
    print(formatter(item))</code></pre>
<h3>f-string</h3>
<p>Python 3.6.x 起支持 Formatted String Literals，在字符串前加字母 f，含义与 format() 类似：</p>
<pre class="code"><code>&gt;&gt;&gt; name = 'Python'
&gt;&gt;&gt; age = 1
&gt;&gt;&gt; f'My name is {name}, and I am {age} years old.'
'My name is Python, and I am 1 years old.'
&gt;&gt;&gt; width = 10
&gt;&gt;&gt; precision = 4
&gt;&gt;&gt; value = 11 / 3
&gt;&gt;&gt; f'result:{value:{width}.{precision}}'
'result:     3.667'</code></pre>
<p>这里的 precision 并不是「小数位数」而是显示的总位数（不含小数点）：位数不少于数值时正常显示，否则按指数方式显示并保证 e 前位数为 n。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-3',
      heading: '4.1.3 字符串常用方法',
      blocks: [
        {
          type: 'html',
          html: `
<table class="tbl">
<thead><tr><th>操作</th><th>含义</th></tr></thead>
<tbody>
<tr><td>+ / *</td><td>连接 / 重复</td></tr>
<tr><td>s[ ]，index()、rindex()</td><td>索引</td></tr>
<tr><td>s[ : ]</td><td>切片</td></tr>
<tr><td>len(s)</td><td>长度</td></tr>
<tr><td>upper()、lower()</td><td>字母大 / 小写</td></tr>
<tr><td>capitalize()、title()、swapcase()</td><td>首字母大写、每个单词首字母大写、大小写交换</td></tr>
<tr><td>strip()</td><td>去两边空格及指定字符</td></tr>
<tr><td>split()、rsplit()、lstrip()</td><td>按指定字符分割</td></tr>
<tr><td>join()</td><td>连接字符串序列</td></tr>
<tr><td>find()、rfind()</td><td>搜索指定字符串</td></tr>
<tr><td>replace()</td><td>替换</td></tr>
<tr><td>startswith()、endswith()、center()、ljust()、rjust()、zfill()、isalnum() 等</td><td>判断首尾、居中 / 左右对齐、左侧补 0、是否为数字 / 字母</td></tr>
</tbody>
</table>
<h3>查找与计数</h3>
<p>find() / rfind() 返回子串在指定范围（默认整个字符串）中首次 / 最后一次出现的位置，不存在返回 -1；index() / rindex() 相同但不存在时抛异常；count() 返回出现次数。</p>
<pre class="code"><code>&gt;&gt;&gt; s = "apple,peach,banana,peach,pear"
&gt;&gt;&gt; s.find("peach")        # 6
&gt;&gt;&gt; s.find("peach", 7)     # 19
&gt;&gt;&gt; s.find("peach", 7, 20) # -1
&gt;&gt;&gt; s.rfind('p')           # 25
&gt;&gt;&gt; s.index('pe')          # 6
&gt;&gt;&gt; s.index('ppp')         # ValueError: substring not found
&gt;&gt;&gt; s.count('p')           # 5
&gt;&gt;&gt; s.count('ppp')         # 0</code></pre>
<pre class="code"><code># 查找字符串中每个字符第一次出现的位置
text = '''
东边来个小朋友叫小松，手里拿着一捆葱。
西边来个小朋友叫小丛，手里拿着小闹钟。
'''
for index, ch in enumerate(text):
    if index == text.index(ch):
        print((index, ch), end=' ')</code></pre>
<h3>分隔与连接</h3>
<pre class="code"><code>&gt;&gt;&gt; s = "apple,peach,banana,pear"
&gt;&gt;&gt; s.split(",")            # ['apple', 'peach', 'banana', 'pear']
&gt;&gt;&gt; s.partition(',')        # ('apple', ',', 'peach,banana,pear')
&gt;&gt;&gt; s.rpartition(',')       # ('apple,peach,banana', ',', 'pear')
&gt;&gt;&gt; s.rpartition('banana')  # ('apple,peach,', 'banana', ',pear')
&gt;&gt;&gt; "2020-5-20".split("-")  # ['2020', '5', '20']
&gt;&gt;&gt; list(map(int, "2020-5-20".split("-")))   # [2020, 5, 20]</code></pre>
<ul>
<li>不指定分隔符时，任何空白符号（空格、换行、制表符等）都视为分隔符，<strong>连续多个空白看作一个分隔符</strong>；</li>
<li>明确指定分隔符时，每个分隔符都独立起作用：<code>'a,,,bb,,ccc'.split(',')</code> → <code>['a','','','bb','','ccc']</code>；</li>
<li>第二个参数为最大分割次数（默认 -1 全部分割）：<code>s.split(None, 1)</code>、<code>s.rsplit(None, 2)</code>、<code>s.split(maxsplit=6)</code>。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; li = ["apple", "peach", "banana", "pear"]
&gt;&gt;&gt; ','.join(li)      # 'apple,peach,banana,pear'
&gt;&gt;&gt; '::'.join(li)      # 'apple::peach::banana::pear'

# 应用：重复 s 共 n 次并用 separator 连接，末尾不带分隔符
def concat(s, n, separator):
    return separator.join([s] * n)
print(concat('good', 5, ','))   # good,good,good,good,good</code></pre>
<div class="callout key">
<p class="callout-h">连接大量字符串优先用 join()</p>
<p>课件用 timeit 对 10000 个长字符串连接 1000 次：join 约 0.102 s，而 <code>result = result + strtemp</code> 约 1.415 s。类型转换时 <code>map()</code> 效率最高：<code>"-".join(map(str, range(100)))</code> 约 0.211 s，生成器版 0.306 s，列表版 0.272 s。</p>
</div>
<h3>大小写、替换与映射</h3>
<pre class="code"><code>&gt;&gt;&gt; s = "What is Your Name?"
&gt;&gt;&gt; s.lower()          # 'what is your name?'
&gt;&gt;&gt; s.upper()          # 'WHAT IS YOUR NAME?'
&gt;&gt;&gt; s.capitalize()     # 'What is your name?'
&gt;&gt;&gt; s.title()          # 'What Is Your Name?'
&gt;&gt;&gt; s.swapcase()       # 'wHAT IS yOUR nAME?'

&gt;&gt;&gt; "中国，中国".replace("中国", "中华人民共和国")
'中华人民共和国，中华人民共和国'

# 敏感词替换
&gt;&gt;&gt; words = ('测试', '非法', '暴力', '话')
&gt;&gt;&gt; text = '这句话里含有非法内容'
&gt;&gt;&gt; for word in words:
...     if word in text:
...         text = text.replace(word, '***')
&gt;&gt;&gt; text          # '这句***里含有***内容'</code></pre>
<p><code>maketrans()</code> 生成字符映射表，<code>translate()</code> 按表逐字符转换；两个字符串长度必须相同、一一对应：</p>
<pre class="code"><code>&gt;&gt;&gt; table = ''.maketrans('abcdef123', 'uvwxyz@#$')
&gt;&gt;&gt; s = "Python is a greate programming language. I like it!"
&gt;&gt;&gt; s.translate(table)
'Python is u gryuty progrumming lunguugy. I liky it!'</code></pre>
<h3>strip / 大小写判断 / 对齐填充</h3>
<pre class="code"><code>&gt;&gt;&gt; '\n\nhello world   \n\n'.strip()   # 'hello world'
&gt;&gt;&gt; "aaaassddf".strip("a")            # 'ssddf'
&gt;&gt;&gt; "aaaassddfaaa".rstrip("a")        # 'aaaassddf'
&gt;&gt;&gt; "aaaassddfaaa".lstrip("a")        # 'ssddfaaa'
&gt;&gt;&gt; 'aabbccddeeeffg'.strip('af')      # 'bbccddeeeffg'（f 不在两侧）
&gt;&gt;&gt; 'aabbccddeeeffg'.strip('gaf')     # 'bbccddeee'
&gt;&gt;&gt; 'aabbccddeeeffg'.strip('gbaef')   # 'ccdd'</code></pre>
<p>strip 的参数不是整体匹配，而是从外往里逐字符剔除「参数串中出现过的字符」，顺序不限但不能跨着剥。</p>
<pre class="code"><code>&gt;&gt;&gt; '1234abcd'.isalnum()   # True
&gt;&gt;&gt; '1234abcd'.isalpha()   # False
&gt;&gt;&gt; '1234'.isdigit()       # True
&gt;&gt;&gt; '1234.0'.isdigit()     # False
&gt;&gt;&gt; '九'.isnumeric()       # True（支持汉字数字）
&gt;&gt;&gt; '九'.isdigit()         # False
&gt;&gt;&gt; 'ⅣⅢⅩ'.isnumeric()     # True（支持罗马数字）
&gt;&gt;&gt; 'abc'.zfill(5)         # '00abc'
&gt;&gt;&gt; 'Hello world!'.center(20, '=')   # '====Hello world!===='
&gt;&gt;&gt; 'Hello world!'.ljust(20, '=')    # 'Hello world!========'
&gt;&gt;&gt; 'Hello world!'.rjust(20, '=')    # '========Hello world!'
&gt;&gt;&gt; 'Beautiful is better than ugly.'.startswith('Be')      # True
&gt;&gt;&gt; 'Beautiful is better than ugly.'.startswith('Be', 5)   # False</code></pre>
<p>字符串也支持 len()、max()、min()、zip() 等内置函数与切片（切片只读，不能修改原字符串）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-4-4',
      heading: '4.1.4 字符串相关标准库与应用',
      blocks: [
        {
          type: 'html',
          html: `
<h3>string 模块常量与随机密码</h3>
<pre class="code"><code>&gt;&gt;&gt; import string
&gt;&gt;&gt; string.digits          # '0123456789'
&gt;&gt;&gt; string.ascii_letters   # 'abc...xyzABC...XYZ'
&gt;&gt;&gt; string.ascii_lowercase
&gt;&gt;&gt; string.ascii_uppercase
&gt;&gt;&gt; string.punctuation     # '!"#$%&amp;\\'()*+,-./:;&lt;=&gt;?@[\\\\]^_&#96;{|}~'

&gt;&gt;&gt; characters = string.digits + string.ascii_letters
&gt;&gt;&gt; import random
&gt;&gt;&gt; ''.join([random.choice(characters) for i in range(8)])   # 'J5Cuofhy'</code></pre>
<h3>可原地修改的字符串对象</h3>
<p>字符串不可变，若确实需要支持原地修改的 Unicode 对象，可用 io.StringIO 或 array 模块：</p>
<pre class="code"><code>&gt;&gt;&gt; import io
&gt;&gt;&gt; sio = io.StringIO("Hello, world")
&gt;&gt;&gt; sio.seek(7)
&gt;&gt;&gt; sio.write("there!")
&gt;&gt;&gt; sio.getvalue()          # 'Hello, there!'

&gt;&gt;&gt; import array
&gt;&gt;&gt; arr = array.array('u', '123456abc')
&gt;&gt;&gt; arr[0] = 'y'
&gt;&gt;&gt; arr.tounicode()         # 'y23456abc'</code></pre>
<h3>中英文分词（jieba / snownlp）</h3>
<pre class="code"><code>&gt;&gt;&gt; import jieba
&gt;&gt;&gt; x = '分词的准确度直接影响了后续文本处理和挖掘算法的最终效果。'
&gt;&gt;&gt; list(jieba.cut(x))
['分词', '的', '准确度', '直接', '影响', '了', '后续', '文本处理', '和', '挖掘', '算法', '的', '最终', '效果', '。']
&gt;&gt;&gt; jieba.lcut('Python可以这样学，Python程序设计开发宝典')
['Python', '可以', '这样', '学', '，', 'Python', '程序设计', '开发', '宝典']
&gt;&gt;&gt; list(jieba.cut('花纸杯'))
['花', '纸杯']
&gt;&gt;&gt; jieba.add_word('花纸杯')      # 增加词条
&gt;&gt;&gt; list(jieba.cut('花纸杯'))
['花纸杯']

&gt;&gt;&gt; from jieba import posseg        # 分词 + 词性
&gt;&gt;&gt; for word, tag in posseg.cut(text):
...     print(word, tag, sep=':')
分词:n / 的:uj / 准确度:n / 直接:ad / 影响:vn / 了:ul / 后续:v ...

&gt;&gt;&gt; import snownlp
&gt;&gt;&gt; snownlp.SnowNLP('学而时习之，不亦说乎').words
['学而', '时习', '之', '，', '不亦', '说乎']</code></pre>
<h3>字符串应用：单词倒置与最长数字子串</h3>
<pre class="code"><code># I like python. → python. like I
def rev1(s):
    return ' '.join(reversed(s.split()))

def rev2(s):
    t = s.split()
    t.reverse()
    return ' '.join(t)

def rev5(s):
    t = ''.join(reversed(s)).split()
    t = map(lambda x: ''.join(reversed(x)), t)
    return ' '.join(t)</code></pre>
<pre class="code"><code># 查找最长数字子串（逐字符扫描）
s = input("input string:")
result, t = [], []
for ch in s:
    if '0' &lt;= ch &lt;= '9':
        t.append(ch)
    elif t:
        result.append(''.join(t))
        t = []
if t:                       # 原串以数字结束
    result.append(''.join(t))
print(max(result, key=len) if result else 'No')</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-4-5',
      heading: '4.3 正则表达式语法与 re 模块',
      blocks: [
        {
          type: 'html',
          html: `
<p>正则表达式用预定义的模式匹配一类具有共同特征的字符串，主要用于字符串的快速、准确查找与替换，在文本编辑处理、网页爬虫等场合有重要应用。Python 的 <code>re</code> 模块提供正则表达式功能。<strong>正则中通常含反斜杠，最好用原始字符串 r'...' 表示。</strong></p>
<h3>元字符</h3>
<table class="tbl">
<thead><tr><th>元字符</th><th>功能说明</th></tr></thead>
<tbody>
<tr><td>.</td><td>匹配除换行符以外的任意单个字符</td></tr>
<tr><td>*</td><td>前一字符 / 子模式重复 0 次或多次，等价 {0,}</td></tr>
<tr><td>+</td><td>前一字符 / 子模式重复 1 次或多次，等价 {1,}</td></tr>
<tr><td>-</td><td>在 [] 内表示范围</td></tr>
<tr><td>|</td><td>匹配 | 之前或之后的字符</td></tr>
<tr><td>^</td><td>匹配行首（以 ^ 后字符开头的字符串）</td></tr>
<tr><td>$</td><td>匹配行尾（以 $ 前字符结束的字符串）</td></tr>
<tr><td>?</td><td>前一字符 0 或 1 次（等价 {0,1}）；紧跟在 *、+、?、{n}、{n,}、{n,m} 后表示非贪心，尽可能短</td></tr>
<tr><td>\\</td><td>转义字符</td></tr>
<tr><td>\\num</td><td>num 为正整数，匹配第 num 个子模式的内容；如 <code>(.)\\1</code> 匹配两个连续相同字符，多个连续重复用 <code>(.)\\1+</code></td></tr>
<tr><td>\\f \\n \\r</td><td>换页符 / 换行符 / 回车符</td></tr>
<tr><td>\\b / \\B</td><td>单词边界 / 非单词边界；'er\\b' 匹配 never 中的 er，不匹配 verb 中的 er</td></tr>
<tr><td>\\d / \\D</td><td>数字 [0-9] / 非数字 [^0-9]</td></tr>
<tr><td>\\s / \\S</td><td>空白字符（空格、制表、换页、换行、回车）/ 非空白</td></tr>
<tr><td>\\w / \\W</td><td>字母、数字、下划线 [a-zA-Z0-9_] / 其反</td></tr>
<tr><td>()</td><td>把括号内内容作为整体（子模式）</td></tr>
<tr><td>{m,n}</td><td>前一字符 / 子模式重复至少 m 次、至多 n 次</td></tr>
<tr><td>[] / [^xyz] / [a-z] / [^a-z]</td><td>字符集 / 反向字符集 / 范围 / 反向范围</td></tr>
</tbody>
</table>
<div class="callout warn">
<p class="callout-h">^[a-z] 与 [^a-z] 不同</p>
<p><code>^[a-z]</code> 表示「以小写字母开头」；<code>[^a-z]</code> 表示「任意非小写字母的字符」。</p>
</div>
<h3>模式示例</h3>
<pre class="code"><code>'[pjc]ython'        # 匹配 python、jython、cython
'[a-zA-Z0-9]'      # 任意大小写字母或数字
'[^abc]'           # 除 a、b、c 之外的任意字符
'python|perl'      或  'p(ython|erl)'
r'(http://)?(www\\.)?python\\.org'   # 可匹配四种组合
'^http'             # 以 http 开头
'(pattern)*' / '(pattern)+' / '(pattern){m,n}'
'(a|b)*c'           # 多个（含 0 个）a 或 b 后紧跟 c
'ab{1,}'            # 等价 ab+
'^[a-zA-Z]{1}([a-zA-Z0-9._]){4,19}$'   # 5-20 位，字母开头
'^(\\w){6,20}$'      # 6-20 位字母数字下划线
'^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$'   # IPv4
r'^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$'   # 手机号
'^[a-zA-Z]+$'      # 只含英文字母
'^\\w+@(\\w+\\.)+\\w+$'   # 邮箱
r'(\\w)(?!.*\\1)'    # 不再重复出现的字符
r'(\\w)(?=.*\\1)'    # 所有重复出现的字符</code></pre>
<h3>re 模块的主要方法</h3>
<table class="tbl">
<thead><tr><th>方法</th><th>功能说明</th></tr></thead>
<tbody>
<tr><td>compile(pattern[, flags])</td><td>编译正则表达式，生成 Pattern 对象，供 match() / search() 使用</td></tr>
<tr><td>escape(string)</td><td>转义字符串中所有特殊正则字符</td></tr>
<tr><td>findall(pattern, string[, flags])</td><td>返回所有匹配项组成的列表</td></tr>
<tr><td>finditer(pattern, string, flags=0)</td><td>返回所有匹配项的迭代对象（每项是 match 对象）</td></tr>
<tr><td>fullmatch(pattern, string, flags=0)</td><td>模式作用于整个字符串，返回 match 或 None</td></tr>
<tr><td>match(pattern, string[, flags])</td><td>从字符串开始处匹配，返回 match 或 None</td></tr>
<tr><td>search(pattern, string[, flags])</td><td>扫描整个字符串，返回第一个成功匹配，或 None</td></tr>
<tr><td>split(pattern, string[, maxsplit=0])</td><td>按匹配项分隔字符串，返回列表；maxsplit=1 只分割一次</td></tr>
<tr><td>sub(pat, repl, string[, count=0])</td><td>用 repl 替换所有匹配项，返回新字符串；repl 可为字符串或可调用对象</td></tr>
<tr><td>subn(pat, repl, string[, count=0])</td><td>同 sub，返回 (新字符串, 替换次数)</td></tr>
<tr><td>purge()</td><td>清空正则表达式缓存</td></tr>
</tbody>
</table>
<p>match 只匹配字符串开头，开头不符合即返回 None；search 扫描整个字符串直到找到第一个匹配。match 与 search 只匹配一次，findall 匹配所有。</p>
<pre class="code"><code>&gt;&gt;&gt; import re
&gt;&gt;&gt; text = 'alpha. beta....gamma delta'
&gt;&gt;&gt; re.split('[. ]+', text)
['alpha', 'beta', 'gamma', 'delta']
&gt;&gt;&gt; re.split('[. ]+', text, maxsplit=1)
['alpha', 'beta....gamma delta']
&gt;&gt;&gt; re.findall('[a-zA-Z]+', text)
['alpha', 'beta', 'gamma', 'delta']

# 把单词中间误写的大写字母改为小写
def checkModify(s):
    return re.sub(r'\\b(\\w)(\\w+)(\\w)\\b',
                  lambda x: x.group(1) + x.group(2).lower() + x.group(3), s)
print(checkModify('aBc ABBC D eeee fFFFfF'))     # abc AbbC D eeee fffffF</code></pre>
<h3>re.sub 参数详解</h3>
<p>语法 <code>re.sub(pattern, repl, string, count=0, flags=0)</code>：前三个必选；repl 可为字符串或函数，字符串中的 <code>\\n</code> 表示第 n 个分组、<code>\\g&lt;name&gt;</code> 对应命名分组；count 限定替换个数（默认 0 表示全部）；flags 可用按位或组合：re.I 忽略大小写、re.L 区域设置、re.M 多行模式、re.S 使 . 匹配换行、re.U Unicode 字符集。注意不要把 flags 传到 count 位置，否则会部分替换或替换不完整。</p>
<pre class="code"><code>&gt;&gt;&gt; re.sub('a|s|d', 'good', 'a s d')          # 'good good good'
&gt;&gt;&gt; s = "It's a very good good idea"
&gt;&gt;&gt; re.sub(r'(\\b\\w+) \\1', r'\\1', s)         # "It's a very good idea"
&gt;&gt;&gt; re.sub(r'((\\w+) )\\1', r'\\2', s)        # "It's a very goodidea"
&gt;&gt;&gt; re.sub('[a-z]', lambda x: x.group(0).upper(), 'aaa abc abde')
'AAA ABC ABDE'
&gt;&gt;&gt; re.subn('a', 'dfg', 'aaa abc abde')
('dfgdfgdfg dfgbc dfgbde', 5)
&gt;&gt;&gt; re.escape('http://www.python.org')
'http://www\\.python\\.org'
&gt;&gt;&gt; re.sub('[' + punctuation + ']', '', 'abcd,.e!f/?')   # 'abcdef'</code></pre>
<h3>贪心与非贪心</h3>
<pre class="code"><code>&gt;&gt;&gt; example = 'Beautiful is better than ugly.'
&gt;&gt;&gt; re.findall('\\\\bb.+?\\\\b', example)   # ['better']
&gt;&gt;&gt; re.findall('\\\\bb.+\\\\b', example)    # ['better than ugly']
&gt;&gt;&gt; re.findall('\\\\bb\\w*\\\\b', example)   # ['better']
&gt;&gt;&gt; re.findall('\\\\Bh.+?\\\\b', example)   # ['han']
&gt;&gt;&gt; re.findall('\\\\b\\w.+?\\\\b', example)
['Beautiful', 'is', 'better', 'than', 'ugly']</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-4-6',
      heading: '4.3 正则对象、match 对象与子模式扩展',
      blocks: [
        {
          type: 'html',
          html: `
<h3>编译后的正则对象</h3>
<p><code>re.compile()</code> 把模式编译为正则对象，再用对象方法处理字符串，可提高速度并提供更强功能。对象的 match(string[, pos[, endpos]]) 在字符串开头或指定位置搜索；search() 在整个字符串或指定范围搜索；findall() 查找所有匹配并返回列表；sub() / subn() / split() 与模块级函数对应。</p>
<pre class="code"><code>&gt;&gt;&gt; import re
&gt;&gt;&gt; example = 'Hefei University of Technology'
&gt;&gt;&gt; pattern = re.compile(r'\\bH\\w+\\b')
&gt;&gt;&gt; pattern.findall(example)      # ['Hefei']
&gt;&gt;&gt; re.compile(r'\\w+y\\b').findall(example)   # ['University', 'Technology']
&gt;&gt;&gt; re.compile(r'\\b[a-zA-Z]{2}\\b').findall(example)   # ['of']
&gt;&gt;&gt; s = 'ab134ab98723jafjweoruiagab'
&gt;&gt;&gt; m = re.search(r'((ab).*){2}.*(ab)', s)   # 第 3 次出现 ab
&gt;&gt;&gt; m.group(3), m.span(3)
('ab', (24, 26))

&gt;&gt;&gt; pattern = re.compile(r'\\bb\\w*\\b', re.I)   # 以 b/B 开头的单词
&gt;&gt;&gt; pattern.sub('*', example, 1)               # 只替换 1 次
&gt;&gt;&gt; pattern.split(example)
&gt;&gt;&gt; re.compile(r'[\\s,.\\d]+').split(example)   # 允许分隔符重复</code></pre>
<h3>子模式与 match 对象</h3>
<p>用 () 表示子模式，括号内内容作为一个整体处理，如 <code>(red)+</code> 可匹配 redred、redredred 等。匹配成功后返回 match 对象，主要方法：</p>
<table class="tbl">
<thead><tr><th>方法</th><th>说明</th></tr></thead>
<tbody>
<tr><td>group()</td><td>返回匹配的一个或多个子模式内容（group(0) 为整个模式）</td></tr>
<tr><td>groups()</td><td>返回所有子模式内容组成的元组（无子模式时为空元组）</td></tr>
<tr><td>groupdict()</td><td>返回所有命名子模式内容组成的字典</td></tr>
<tr><td>start() / end()</td><td>指定子模式内容的起始位置 / 结束位置前一个位置</td></tr>
<tr><td>span()</td><td>返回 (start, end) 元组</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; m = re.match(r"(\\w+) (\\w+)", "Isaac Newton, physicist")
&gt;&gt;&gt; m.group(0)        # 'Isaac Newton'
&gt;&gt;&gt; m.group(1)        # 'Isaac'
&gt;&gt;&gt; m.group(2)        # 'Newton'
&gt;&gt;&gt; m.group(1, 2)     # ('Isaac', 'Newton')
&gt;&gt;&gt; m.groups()        # ('Isaac', 'Newton')

&gt;&gt;&gt; m = re.match(r"(?P&lt;first_name&gt;\\w+) (?P&lt;last_name&gt;\\w+)", "Malcolm Reynolds")
&gt;&gt;&gt; m.group('first_name'), m.group('last_name')
('Malcolm', 'Reynolds')
&gt;&gt;&gt; m.groupdict()
{'first_name': 'Malcolm', 'last_name': 'Reynolds'}

&gt;&gt;&gt; m = re.match(r"(\\d+)\\.(\\d+)", "24.1632")
&gt;&gt;&gt; m.groups()        # ('24', '1632')</code></pre>
<p>注意：match 对象没有 match 属性或方法；<code>\\1</code> 这类对子模式的引用只用于 pattern 中的模式匹配要求，与命名子模式的引用不是一回事。group(0) 是模式匹配串，groups() 是由各子模式分组组成的元组。</p>
<h3>子模式扩展语法</h3>
<table class="tbl">
<thead><tr><th>语法</th><th>含义</th></tr></thead>
<tbody>
<tr><td>(?P&lt;groupname&gt;)</td><td>为子模式命名</td></tr>
<tr><td>(?iLmsux)</td><td>设置匹配标志，字母含义与编译标志相同</td></tr>
<tr><td>(?:...)</td><td>匹配但不捕获该子表达式</td></tr>
<tr><td>(?P=groupname)</td><td>引用之前命名为 groupname 的子模式</td></tr>
<tr><td>(?#...)</td><td>注释</td></tr>
<tr><td>(?=...)</td><td>正向肯定预查：= 后内容出现则匹配，但不返回其内容</td></tr>
<tr><td>(?!...)</td><td>正向否定预查：! 后内容不出现则匹配，不返回其内容</td></tr>
<tr><td>(?&lt;=...)</td><td>反向肯定预查，位于模式之前，含义同 (?=...)</td></tr>
<tr><td>(?&lt;!...)</td><td>反向否定预查，位于模式之前，含义同 (?!...)</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; re.findall(r'\\d+(?=[a-z]+)', '12ab 34cd 56')   # 数字后跟小写字母
&gt;&gt;&gt; re.findall(r'\\d+(?![a-z]+)', '12ab 34cd 56')
&gt;&gt;&gt; re.findall(r'(?&lt;=[a-z])\\d+', 'a12 b34 56')
&gt;&gt;&gt; re.findall(r'\\d{3}(?!\\d)', '1234 567 89')
&gt;&gt;&gt; re.findall(r'\\b((?!abc)\\w)+\\b', text)       # 不含连续 abc 的单词
&gt;&gt;&gt; re.findall(r'(?&lt;![a-z])\\d{7}', text)         # 前面不是小写字母的 7 位数字
&gt;&gt;&gt; re.findall(r"(?&lt;=&lt;(\\w{4})&gt;)(.*)(?=&lt;/\\1&gt;)", "<span>hello</span>")

&gt;&gt;&gt; pattern = re.compile(r'(?&lt;=\\w\\s)never')     # 不是第一个单词的 never
&gt;&gt;&gt; pattern.search(exampleString).span()          # (156, 161)
&gt;&gt;&gt; pattern = re.compile(r'(?:is\\s)better(\\sthan)')
&gt;&gt;&gt; m = pattern.search(exampleString)
&gt;&gt;&gt; m.group(0), m.groups(), m.group(1)
('is better than', (' than',), ' than')

&gt;&gt;&gt; pattern = re.compile(r'\\b(?i)n\\w+\\b')       # 不区分大小写匹配 n 开头单词
&gt;&gt;&gt; pattern = re.compile(r'(?&lt;!not\\s)be\\b')      # 前面没有 not 的 be
&gt;&gt;&gt; pattern = re.compile(r'(\\b\\w*(?P&lt;f&gt;\\w+)(?P=f)\\w*\\b)')   # 含连续相同字母的单词</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-4-7',
      heading: '4.4 正则应用案例与本章小结',
      blocks: [
        {
          type: 'html',
          html: `
<h3>提取电话号码</h3>
<pre class="code"><code>import re
telNumber = '''Suppose my Phone No. is 0551-1234567,
yours is 010-12345678, his is 025-87654321.'''
pattern = re.compile(r'(\\d{3,4})-(\\d{7,8})')
print(pattern.findall(telNumber))
# [('0535', '1234567'), ('010', '12345678'), ('025', '87654321')]

# 用 search + 循环逐个匹配，观察 group/start/end/span
index = 0
while True:
    m = pattern.search(telNumber, index)
    if not m:
        break
    for i in range(3):
        print(m.group(i), m.start(i), m.end(i), m.span(i))
    index = m.end(2)</code></pre>
<h3>批量检查被 iframe 嵌入的网页</h3>
<pre class="code"><code>import os, re

def detectIframe(fn):
    content = []
    with open(fn, encoding='utf8') as fp:
        for line in fp:
            content.append(line.strip())
    content = ' '.join(content)
    m = re.findall(r'&lt;iframe\\s+src=.*?&gt;&lt;/iframe&gt;', content)
    return {fn: m} if m else False

for fn in (f for f in os.listdir('.') if f.endswith(('.html', '.htm'))):
    r = detectIframe(fn)
    if not r:
        continue
    for k, v in r.items():
        print(k)
        for vv in v:
            print('\\t', vv)</code></pre>
<h3>查找字符串中每个字符的首次出现</h3>
<p>给定任意字符串，得到新字符串：重复字符只保留一个，且保持原串中首次出现的先后顺序。例如 abcdaaabe → abcde。</p>
<pre class="code"><code>from re import findall
from random import choice
from string import digits

def func1(text):
    result = set(text)
    return ''.join(sorted(result, key=lambda ch: text.index(ch)))

def func2(text):
    result = []
    for ch in text:
        if ch not in result:
            result.append(ch)
    return ''.join(result)

def func3(text):
    return ''.join(findall(r'(\\w)(?!.*\\1)', text[::-1]))[::-1]

text = ''.join(choice(digits) for _ in range(30))
print(text)
print(func1(text), func2(text), func3(text), sep='\\n')</code></pre>
<h3>最长数字子串（正则版）</h3>
<pre class="code"><code>import re
s = input("str:")
t = re.findall('\\d+', s)
print(max(t, key=len) if t else 'No')

# 或用非数字作为分隔符
t = re.split('[^\\d]+', s)
print(max(t, key=len) if t else 'No')</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：字符串的相关概念（格式化方法、常用方法）、正则表达式的规则。思考：正则表达式的应用。</p>
<p>附：str() 返回用户易读的字符串形式；repr() 返回解释器易读的形式（字符串带引号，可转义特殊字符）；eval() 执行字符串表达式并返回其值。例如 <code>str('Hello, HFUT')</code> 为 <code>Hello, HFUT</code>，而 <code>repr('Hello, HFUT')</code> 为 <code>'Hello, HFUT'</code>。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck4;

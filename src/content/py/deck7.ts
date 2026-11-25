import type { DeckData } from '../types';

/** 第7章 文件操作与应用 —— 课件 PPT/第七章 文件操作与应用2023（72 页） */
const deck7: DeckData = {
  id: 'deck7',
  no: '第7章',
  title: '文件操作与应用',
  subtitle: '文本 / 二进制文件 · open 与 with · 文件指针 · CSV / JSON · pickle / struct / shelve / marshal · os / shutil · 应用案例',
  lede:
    '为了长期保存数据以便重复使用、修改和共享，必须把数据以文件形式存储到外部存储介质中。文件是一个存储在辅助存储器上的数据序列，可包含任何数据内容。按数据组织形式分为文本文件与二进制文件，二者最主要的区别在于是否有统一的字符编码。文件内容操作三步走：打开、读写、关闭。本章依次掌握文本与二进制文件的读写、CSV/JSON 数据格式化、os/shutil 的文件级与目录操作，并以防火墙日志分析、Excel/Word 处理等案例收尾。',
  toc: [
    { id: 'sec-7-1', text: '7.1 概述：文件的类型', level: 2 },
    { id: 'sec-7-2', text: '7.2.1 文件基本操作', level: 2 },
    { id: 'sec-7-3', text: '7.2.2 文本文件读写与编码', level: 2 },
    { id: 'sec-7-4', text: '7.3 数据格式化：CSV 与 JSON', level: 2 },
    { id: 'sec-7-5', text: '7.4 二进制文件操作模块', level: 2 },
    { id: 'sec-7-6', text: '7.5 文件级与目录操作', level: 2 },
    { id: 'sec-7-7', text: '7.6 应用案例与本章小结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-7-1',
      heading: '7.1 概述：文件的类型',
      blocks: [
        {
          type: 'html',
          html: `
<p>单变量数据（整型、浮点型、复数）与组合数据类型（序列 str/tuple/list、集合 set、映射 dict）都保存在内存中，程序结束即消失。为了长期保存数据以便重复使用、修改和共享，必须将数据以<strong>文件</strong>形式存储到外部存储介质（磁盘、U 盘、光盘或云盘等）中。</p>
<p>文件操作在各类应用软件开发中占有重要地位：管理信息系统用数据库存储数据，而数据库最终仍以文件形式存储；应用程序的配置信息、图形图像、音视频、可执行文件等也都是以文件形式存储在磁盘上。</p>
<ul>
<li>文件是一个存储在辅助存储器上的数据序列，可包含任何数据内容；</li>
<li>概念上，文件是数据的集合和抽象，类似地，函数是程序的集合和抽象；</li>
<li>用文件形式组织和表达数据更有效、更灵活。</li>
</ul>
<h3>按数据的组织形式分类</h3>
<table class="tbl">
<thead><tr><th>类型</th><th>说明</th><th>示例</th></tr></thead>
<tbody>
<tr><td>文本文件（Text File）</td><td>存储常规字符串，由若干文本行组成，通常每行以换行符 '\\n' 结尾；可用记事本等文本编辑器正常显示、编辑，人类可直接阅读</td><td>英文字母、汉字、数字字符串、.py、.txt、.csv</td></tr>
<tr><td>二进制文件（Binary File）</td><td>把对象内容以字节串 bytes 存储，无法用普通文本编辑器编辑，通常也无法被人类直接阅读，需要专门软件解码后读取、显示、修改或执行</td><td>图形图像、音视频、可执行文件、资源文件、数据库文件、Office 文档</td></tr>
</tbody>
</table>
<p>二进制文件由比特 0 和比特 1 组成，没有统一的字符编码；<strong>二进制文件与文本文件最主要的区别在于是否有统一的字符编码</strong>（如 ASCII、GBK、UTF-8）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-7-2',
      heading: '7.2.1 文件基本操作',
      blocks: [
        {
          type: 'html',
          html: `
<p>文件内容操作三步走：<strong>打开、读写、关闭</strong>。</p>
<pre class="code"><code>open(file, mode='r', buffering=-1, encoding=None, errors=None,
     newline=None, closefd=True, opener=None)</code></pre>
<ul>
<li><code>file</code>：被打开的文件名称；</li>
<li><code>mode</code>：打开后的处理方式；</li>
<li><code>buffering</code>：读写缓存模式，0 不缓存、1 缓存、大于 1 表示缓冲区大小，默认缓存模式；</li>
<li><code>encoding</code>：文本编码 / 解码方式，只适用于文本模式，可用 GBK、utf8、CP936 等。</li>
</ul>
<p>执行正常时 open() 返回文件对象，通过它读写文件；若文件不存在、权限不够、磁盘空间不足等导致创建失败则抛出异常。操作完一定要关闭文件对象，才能保证修改确实保存到文件中。</p>
<pre class="code"><code>f1 = open('file1.txt', 'r')     # 读模式
f2 = open('file2.txt', 'w')     # 写模式
f1.close()
f2.close()</code></pre>
<div class="callout key">
<p class="callout-h">推荐 with 语句</p>
<p>即使写了 close()，也无法保证文件一定正常关闭：若打开后、关闭前发生错误导致程序崩溃，文件就无法关闭。推荐使用 with 上下文管理，异常时也能自动关闭：</p>
<pre class="code"><code>with open(filename, mode, encoding) as fp:
    # 通过 fp 读写

with open('test.txt', 'r') as src, open('test_new.txt', 'w') as dst:
    dst.write(src.read())</code></pre>
</div>
<h3>打开方式</h3>
<table class="tbl">
<thead><tr><th>模式</th><th>说明</th></tr></thead>
<tbody>
<tr><td>r</td><td>读模式（默认，可省略）；文件不存在则抛异常</td></tr>
<tr><td>w</td><td>写模式；文件已存在则先清空原内容</td></tr>
<tr><td>x</td><td>写模式，创建新文件；文件已存在则抛异常</td></tr>
<tr><td>a</td><td>追加模式，不覆盖原有内容</td></tr>
<tr><td>b</td><td>二进制模式（可与其他模式组合）</td></tr>
<tr><td>t</td><td>文本模式（默认，可省略）</td></tr>
<tr><td>+</td><td>读、写模式（可与其他模式组合）</td></tr>
</tbody>
</table>
<h3>文件对象常用属性与方法</h3>
<table class="tbl">
<thead><tr><th>属性 / 方法</th><th>说明</th></tr></thead>
<tbody>
<tr><td>buffer / closed / fileno / mode / name</td><td>缓冲区对象 / 是否关闭 / 文件号 / 打开模式 / 文件名</td></tr>
<tr><td>close()</td><td>把缓冲区内容写入文件，同时关闭文件并释放对象</td></tr>
<tr><td>detach()</td><td>分离并返回底层缓冲；分离后文件对象不再可用</td></tr>
<tr><td>flush()</td><td>把缓冲区内容写入文件，但不关闭文件</td></tr>
<tr><td>read([size])</td><td>文本文件读 size 个字符（3.x），二进制文件读指定字节；省略 size 读全部</td></tr>
<tr><td>readable() / writable() / seekable()</td><td>测试是否可读 / 可写 / 支持随机访问</td></tr>
<tr><td>readline() / readlines()</td><td>读一行 / 把每行作为字符串存入列表（大文件占内存，不建议）</td></tr>
<tr><td>seek(offset[, whence])</td><td>移动文件指针：whence 0 文件头、1 当前位置、2 文件尾，默认 0</td></tr>
<tr><td>tell()</td><td>返回文件指针当前位置</td></tr>
<tr><td>truncate([size])</td><td>删除当前指针到文件末尾的内容；指定 size 则只保留前 size 字节</td></tr>
<tr><td>write(s) / writelines(s)</td><td>写入字符串 / 写入字符串列表（不自动加换行）</td></tr>
</tbody>
</table>
<pre class="code"><code># 逐行读取（两种写法等价）
fo = open(fname, "r")
for line in fo.readlines():
    print(line, end="")
fo.close()

fo = open(fname, "r")
for line in fo:
    print(line, end="")
fo.close()

# 追加写入后读取：a+ 模式下指针在文件尾，直接读无内容，需 seek(0)
fo = open(fname, "a+")
ls = ["中国梦", "不忘初心 牢记使命", "青年强则国强"]
for item in ls:
    fo.write("\\n" + item)
fo.seek(0)
for line in fo:
    print(line)
fo.close()</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-7-3',
      heading: '7.2.2 文本文件读写与编码',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code># 例 7-1 写入后读出
s = 'Hello world\\n文本文件的读取方法\\n文本文件的写入方法\\n'
with open('sample.txt', 'w') as fp:      # 默认使用 cp936 编码
    fp.write(s)
with open('sample.txt') as fp:
    print(fp.read())

# 例 7-2 读取并显示前 5 个字符
with open('sample.txt', 'r') as f:
    s = f.read(5)
print('s=', s)
print('字符串s的长度(字符个数)=', len(s))</code></pre>
<h3>文件指针与中文编码（例 7-4）</h3>
<p>Python 2.x 和 3.x 的 seek() 都是把文件指针定位到指定<strong>字节</strong>位置；但 3.x 对中文支持更严格，定位到多字节字符中间时读取会抛异常。</p>
<pre class="code"><code>&gt;&gt;&gt; s = '合肥工业大学HFUT'
&gt;&gt;&gt; fp = open(r'D:\\sample.txt', 'w')
&gt;&gt;&gt; fp.write(s)
10
&gt;&gt;&gt; fp.close()
&gt;&gt;&gt; fp = open(r'D:\\sample.txt', 'r')
&gt;&gt;&gt; print(fp.read(3))     # 合肥工（文本模式 read 按字符计）
&gt;&gt;&gt; fp.seek(2)            # seek 按字节计
&gt;&gt;&gt; print(fp.read(1))     # 肥
&gt;&gt;&gt; fp.seek(13)
&gt;&gt;&gt; print(fp.read(1))     # F
&gt;&gt;&gt; fp.seek(3)            # 定位到汉字中间
&gt;&gt;&gt; print(fp.read(1))
UnicodeDecodeError: 'gbk' codec can't decode byte 0xa7 ...</code></pre>
<p>要点：<strong>read 在文本模式下按字符计数，seek 永远按字节</strong>；open 未声明编码时，Python 3 采用操作系统默认编码（简体中文 Windows 为 CP936/GBK，可用 cmd 的 <code>chcp</code> 查看代码页）。</p>
<h3>例 7-5：整数排序后再写入</h3>
<pre class="code"><code>with open('data.txt') as fp:
    data = fp.readlines()
data.sort(key=int)
with open('data_new.txt', 'w') as fp:
    fp.writelines(data)</code></pre>
<h3>例 7-6：逐行加行号另存</h3>
<pre class="code"><code>filename = 'demo6.py'
with open(filename, 'r') as fp:
    lines = fp.readlines()
maxLength = len(max(lines, key=len))
lines = [line.rstrip().ljust(maxLength) + '#' + str(index) + '\\n'
         for index, line in enumerate(lines)]
with open(filename[:-3] + '_new.py', 'w') as fp:
    fp.writelines(lines)</code></pre>
<h3>同时读写：w+ 与指针</h3>
<pre class="code"><code>text = '这是一段测试文本'
with open('test.txt', 'w+', encoding='utf8') as fp:
    fp.write(text)
    fp.seek(12)            # utf8 中一个汉字 3 字节
    print(fp.read())       # 从当前位置读剩余内容
    fp.seek(12)
    fp.write('模拟')        # 覆盖原内容
    fp.seek(9)
    fp.write('个')
    fp.seek(0, 2)          # 定位到文件尾
    fp.write('，结束。')
    fp.seek(0)
    print(fp.read())</code></pre>
<h3>批量修改记事本文件编码</h3>
<pre class="code"><code>import os
fns = (fn for fn in os.listdir() if fn.endswith('.txt'))
for fn in fns:
    try:
        with open(fn, encoding='utf8') as fp:
            fp.read()                    # 能按 UTF-8 读出则跳过
    except:
        with open(fn) as fp1:            # 默认 GBK 读
            with open('t.txt', 'w', encoding='utf8') as fp2:
                fp2.write(fp1.read())    # UTF-8 写
        os.remove(fn)
        os.rename('t.txt', fn)</code></pre>
<div class="callout tip">
<p class="callout-h">课程思政：防火墙日志分析</p>
<p>网络安全防护是一场攻防对抗。防火墙在可信任内部网络与不可信任外部网络之间建立屏障，按预编程规则监控、过滤流量。防火墙日志记录网络活动，可用于检测潜在威胁。案例任务：读取 txt 格式日志 → 格式分析 → 过滤「联入」记录 → 正则提取 IP → 统计高频 IP → 输出 CSV。代码要点：<code>with open(src, 'r', encoding='utf-8') as src, open(dst, 'a+', encoding='utf-8')</code> 批量过滤；<code>re.search(r"\\d+\\.\\d+\\.\\d+\\.\\d+", line).group(0)</code> 提取 IP；用字典累计次数，剔除 NTP / 云厂商等合规 IP，按次数降序写 CSV。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-7-4',
      heading: '7.3 数据格式化：CSV 与 JSON',
      blocks: [
        {
          type: 'html',
          html: `
<h3>数据组织的维度</h3>
<ul>
<li><strong>一维数据</strong>：由对等关系的有序或无序数据构成，采用线性方式组织，对应数组和集合。如「中国、美国、日本、德国……」。</li>
<li><strong>二维数据</strong>（表格数据）：由关联关系数据构成，采用表格方式组织，对应矩阵。如「城市 / 环比 / 同比 / 定基」表。</li>
<li><strong>高维数据</strong>：由键值对类型的数据构成，采用对象方式组织，整合度更好。HTML、XML、JSON 都是高维数据组织的语法结构。</li>
</ul>
<h3>CSV 格式</h3>
<p>逗号分隔值（Comma-Separated Values）是纯文本格式，通过单一编码表示字符，是通用、相对简单的文件格式，在商业和科学上广泛应用，尤其用于程序之间转移表格数据。基本规则：</p>
<ul>
<li>以行为单位，开头不留空行，行之间没有空行；</li>
<li>每行表示一个一维数据，多行表示二维数据；</li>
<li>以逗号分隔每列数据，列数据为空也要保留逗号；</li>
<li>可以包含或不包含列名，包含时列名放在文件第一行。</li>
</ul>
<pre class="code"><code>城市,环比,同比,定基
合肥,100.6,100.1,149
北京,100.2,100.2,135.6
上海,99.9,99.8,144.7
深圳,100.5,99.3,145.9
南京,99.9,98.1,144.4</code></pre>
<p>CSV 文件每行是一维数据，可用列表表示；整个 CSV 是二维数据，由表示每行的列表作为元素组成二维列表。文件一般以 .csv 为扩展名，可用记事本或 Excel 打开。</p>
<pre class="code"><code># 逐行处理 CSV
fo = open("price2018.csv", "r")
ls = []
for line in fo:
    line = line.replace("\\n", "")
    ls.append(line.split(","))
fo.close()

# 逐行格式化输出（制表符分隔）
fo = open("price2018.csv", "r")
for line in fo:
    line = line.replace("\\n", "")
    print("".join("{}\\t".format(s) for s in line.split(",")))
fo.close()

# 一维数据写入 CSV
fo = open("price2016bj.csv", "w")
ls = ['合肥', '100.6', '100.1', '149']
fo.write(",".join(ls) + "\\n")
fo.close()

# 二维数据写入 CSV
for row in ls:
    out.write(",".join(row) + "\\n")</code></pre>
<h3>JSON 格式</h3>
<p>JSON（JavaScript Object Notation）是轻量级的数据交换格式，易于阅读和理解。高维数据不采用任何结构形式，仅采用最基本的二元关系——键值对；万维网是高维数据最成功的典型应用。</p>
<pre class="code"><code>"key" : "value"</code></pre>
<p>多个键值对放在一起的规则：数据保存在键值对中；键值对之间由逗号分隔；大括号用于保存键值对组成的对象；方括号用于保存键值对组成的数组。</p>
<pre class="code"><code>{
  "Python语言与系统设计教师": [
    {"姓氏": "李", "名字": "培培", "单位": "合肥工业大学"},
    {"姓氏": "李", "名字": "俊照", "单位": "合肥工业大学"},
    {"姓氏": "马", "名字": "学森", "单位": "合肥工业大学"}
  ]
}</code></pre>
<p>把对象转换为可通过网络传输或可存储到本地磁盘的数据格式（XML、JSON 或特定格式字节串）的过程称为<strong>序列化</strong>，反之称为<strong>反序列化</strong>。Python 标准库 json 完美实现该格式，用法类似 marshal 和 pickle。</p>
<pre class="code"><code>&gt;&gt;&gt; import json
&gt;&gt;&gt; json.dumps(['a', 'b', 'c'])
'["a", "b", "c"]'
&gt;&gt;&gt; json.loads(_)
['a', 'b', 'c']
&gt;&gt;&gt; json.dumps({'a': 1, 'b': 2, 'c': 3})
'{"a": 1, "b": 2, "c": 3}'
&gt;&gt;&gt; json.loads(_)
{'a': 1, 'b': 2, 'c': 3}

&gt;&gt;&gt; json.dumps([1, 2, 3, {'4': 5, '6': 7}])
'[1, 2, 3, {"4": 5, "6": 7}]'
&gt;&gt;&gt; json.dumps([1, 2, 3, {'4': 5, '6': 7}], separators=(',', ':'))
'[1,2,3,{"4":5,"6":7}]'          # 压缩存储

&gt;&gt;&gt; json.dumps('合肥工业大学')
'"\\\\u5408\\\\u80a5\\\\u5de5\\\\u4e1a\\\\u5927\\\\u5b66"'
&gt;&gt;&gt; json.loads(_)
'合肥工业大学'</code></pre>
<pre class="code"><code>&gt;&gt;&gt; json.dumps({1, 2, 3, 4})
TypeError: Object of type 'set' is not JSON serializable

class setEncoder(json.JSONEncoder):      # 自定义序列化编码器
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

class setDecoder(json.JSONDecoder):      # 自定义反序列化解码器
    def decode(self, obj):
        return set(json.JSONDecoder.decode(self, obj))

&gt;&gt;&gt; json.dumps({1, 2, 3, 4}, cls=setEncoder)   # '[1, 2, 3, 4]'
&gt;&gt;&gt; json.loads(_, cls=setDecoder)              # {1, 2, 3, 4}</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-7-5',
      heading: '7.4 二进制文件操作模块',
      blocks: [
        {
          type: 'html',
          html: `
<p>数据库文件、图像文件、可执行文件、音视频文件、Office 文档等均属于二进制文件，无法用记事本正常读写，也无法通过 Python 文件对象直接读取和理解其内容——必须正确理解二进制文件结构和序列化规则，才能准确理解内容并设计正确的反序列化规则。</p>
<p><strong>序列化</strong>就是把内存中的数据在不丢失类型信息的情况下转成对象的二进制形式；正确反序列化后应能准确无误地恢复原对象。Python 常用序列化模块：struct、pickle、marshal、shelve。</p>
<h3>pickle</h3>
<pre class="code"><code>import pickle
i = 13000000
a = 99.056
s = '中国人民123abc'
lst = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
tu = (-5, 10, 8)
coll = {4, 5, 6}
dic = {'a': 'apple', 'b': 'banana', 'g': 'grape', 'o': 'orange'}
data = [i, a, s, lst, tu, coll, dic]

with open('sample_pickle.dat', 'wb') as f:
    try:
        pickle.dump(len(data), f)     # 先写数据个数
        for item in data:
            pickle.dump(item, f)
    except:
        print('写文件异常!')

# 读取
with open('sample_pickle.dat', 'rb') as f:
    n = pickle.load(f)
    for i in range(n):
        print(pickle.load(f))</code></pre>
<h3>struct</h3>
<pre class="code"><code>import struct
n = 1300000000
x = 96.45
b = True
s = 'a1@中国'
sn = struct.pack('if?', n, x, b)     # 序列化
with open('sample_struct.dat', 'wb') as fp:
    fp.write(sn)
    fp.write(s.encode())

# 读取
with open('sample_struct.dat', 'rb') as fp:
    sn = fp.read(9)
    tu = struct.unpack('if?', sn)    # 返回解包后的元组
    n, x, bl = tu
    s = fp.read(9).decode()</code></pre>
<p>为什么读取 9 字节？<code>struct.pack('if?', 13000, 56.0, True)</code> 中 i 为 4 字节、f 为 4 字节、? 为 1 字节，共 9 字节；<code>len('a1@中国'.encode())</code> 也恰为 9 字节（UTF-8：a、1、@ 各 1 字节，中国各 3 字节）。</p>
<h3>shelve</h3>
<p>shelve 可像字典赋值一样写二进制文件，也像字典一样读取：</p>
<pre class="code"><code>&gt;&gt;&gt; import shelve
&gt;&gt;&gt; zhangsan = {'age': 38, 'sex': 'Male', 'address': 'SDIBT'}
&gt;&gt;&gt; lisi = {'age': 40, 'sex': 'Male', 'qq': '1234567', 'tel': '7654321'}
&gt;&gt;&gt; with shelve.open('shelve_test.dat') as fp:
...     fp['zhangsan'] = zhangsan
...     fp['lisi'] = lisi
...     for i in range(5):
...         fp[str(i)] = str(i)
&gt;&gt;&gt; with shelve.open('shelve_test.dat') as fp:
...     print(fp['zhangsan'])
...     print(fp['zhangsan']['age'])
...     print(fp['lisi']['qq'])
...     print(fp['3'])</code></pre>
<h3>marshal</h3>
<pre class="code"><code>&gt;&gt;&gt; import marshal
&gt;&gt;&gt; x1, x2, x3, x4, x5, x6 = 30, 5.0, [1, 2, 3], (4, 5, 6), {'a': 1, 'b': 2, 'c': 3}, {7, 8, 9}
&gt;&gt;&gt; x = [eval('x' + str(i)) for i in range(1, 7)]
&gt;&gt;&gt; with open('test.dat', 'wb') as fp:
...     marshal.dump(len(x), fp)
...     for item in x:
...         marshal.dump(item, fp)
&gt;&gt;&gt; with open('test.dat', 'rb') as fp:
...     n = marshal.load(fp)
...     for i in range(n):
...         print(marshal.load(fp))</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-7-6',
      heading: '7.5 文件级与目录操作',
      blocks: [
        {
          type: 'html',
          html: `
<p>处理文件路径可用 os.path 模块；命令行读取文件内容可用 fileinput；创建临时文件和文件夹可用 tempfile；Python 3.4 之后 pathlib 模块提供大量表示和处理文件系统路径的类。</p>
<h3>os 模块常用文件操作</h3>
<table class="tbl">
<thead><tr><th>方法 / 属性</th><th>说明</th></tr></thead>
<tbody>
<tr><td>access(path, mode)</td><td>测试是否能按 mode 权限访问文件</td></tr>
<tr><td>chdir(path)</td><td>把 path 设为当前工作目录</td></tr>
<tr><td>chmod(path, mode, ...)</td><td>改变文件访问权限</td></tr>
<tr><td>curdir / sep / extsep</td><td>当前文件夹 / 路径分隔符 / 扩展名分隔符</td></tr>
<tr><td>environ</td><td>系统环境变量与值的字典</td></tr>
<tr><td>getcwd()</td><td>返回当前工作目录</td></tr>
<tr><td>listdir(path)</td><td>返回目录下的文件和目录列表</td></tr>
<tr><td>open(path, flags, mode=0o777)</td><td>按权限打开文件（默认可读可写可执行）</td></tr>
<tr><td>popen(cmd) / system() / startfile()</td><td>创建进程、启动外部程序 / 用关联程序打开文件</td></tr>
<tr><td>remove(path)</td><td>删除文件（需删除权限，且无只读等特殊属性）</td></tr>
<tr><td>rename(src, dst) / replace(old, new)</td><td>重命名或移动；rename 目标存在则异常，replace 直接覆盖；均不能跨磁盘分区</td></tr>
<tr><td>scandir(path='.')</td><td>返回 DirEntry 迭代对象，遍历比 listdir 高效</td></tr>
<tr><td>stat(path)</td><td>返回文件所有属性</td></tr>
<tr><td>truncate(path, length)</td><td>截断文件，只保留指定长度</td></tr>
<tr><td>write(fd, data)</td><td>把 bytes 写入文件描述符 fd</td></tr>
</tbody>
</table>
<h3>os.path 常用函数</h3>
<table class="tbl">
<thead><tr><th>函数</th><th>说明</th></tr></thead>
<tbody>
<tr><td>abspath / realpath</td><td>返回绝对路径</td></tr>
<tr><td>basename(path)</td><td>返回路径最后一个组成部分</td></tr>
<tr><td>commonpath / commonprefix</td><td>多个路径的最长公共路径 / 前缀</td></tr>
<tr><td>dirname(p)</td><td>返回文件夹部分</td></tr>
<tr><td>exists(path)</td><td>判断文件是否存在</td></tr>
<tr><td>getatime / getctime / getmtime / getsize</td><td>最后访问时间 / 创建时间 / 最后修改时间 / 文件大小</td></tr>
<tr><td>isabs / isdir / isfile</td><td>是否绝对路径 / 是否文件夹 / 是否文件</td></tr>
<tr><td>join(path, *paths)</td><td>连接两个或多个路径</td></tr>
<tr><td>relpath(path)</td><td>返回相对路径（不能跨盘）</td></tr>
<tr><td>samefile(f1, f2)</td><td>两个路径是否引用同一文件</td></tr>
<tr><td>split / splitext / splitdrive</td><td>以最后斜线分成 (目录, 文件名) / 分离扩展名 / 分离驱动器名</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; import os, os.path
&gt;&gt;&gt; os.path.exists('test1.txt')      # False
&gt;&gt;&gt; os.rename('c:\\\\test1.txt', 'c:\\\\test2.txt')
FileNotFoundError: [WinError 2] 系统找不到指定的文件。
&gt;&gt;&gt; os.rename('c:\\\\dfg.txt', 'c:\\\\test2.txt')    # 改名 / 移动
&gt;&gt;&gt; path = 'd:\\\\mypython_exp\\\\new_test.txt'
&gt;&gt;&gt; os.path.dirname(path)      # 'd:\\\\mypython_exp'
&gt;&gt;&gt; os.path.split(path)        # ('d:\\\\mypython_exp', 'new_test.txt')
&gt;&gt;&gt; os.path.splitdrive(path)   # ('d:', '\\\\mypython_exp\\\\new_test.txt')
&gt;&gt;&gt; os.path.splitext(path)     # ('d:\\\\mypython_exp\\\\new_test', '.txt')

# 列出当前目录下所有 .pyc 文件
&gt;&gt;&gt; [f for f in os.listdir(os.getcwd()) if os.path.isfile(f) and f.endswith('.pyc')]</code></pre>
<h3>shutil 模块</h3>
<table class="tbl">
<thead><tr><th>方法</th><th>说明</th></tr></thead>
<tbody>
<tr><td>copy(src, dst)</td><td>复制文件及同样的文件属性；目标存在则异常</td></tr>
<tr><td>copy2(src, dst)</td><td>复制文件及原文件完全一样的属性（创建 / 修改 / 访问时间）</td></tr>
<tr><td>copyfile(src, dst)</td><td>只复制内容，不复制属性；目标存在直接覆盖</td></tr>
<tr><td>copyfileobj(fsrc, fdst)</td><td>在两个文件对象之间复制数据</td></tr>
<tr><td>copymode / copystat</td><td>复制模式位 / 复制模式位与访问时间等状态</td></tr>
<tr><td>copytree(src, dst)</td><td>递归复制文件夹</td></tr>
<tr><td>disk_usage(path)</td><td>查看磁盘使用情况</td></tr>
<tr><td>move(src, dst)</td><td>移动文件或递归移动文件夹，也可重命名</td></tr>
<tr><td>rmtree(path)</td><td>递归删除文件夹</td></tr>
<tr><td>make_archive(base_name, format, ...)</td><td>创建 tar 或 zip 压缩文件</td></tr>
<tr><td>unpack_archive(filename, extract_dir=None, format=None)</td><td>解压缩</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; import shutil
&gt;&gt;&gt; shutil.copyfile('C:\\\\dir.txt', 'C:\\\\dir1.txt')
&gt;&gt;&gt; shutil.make_archive('D:\\\\a', 'zip', 'C:\\\\Python34', 'Dlls')
&gt;&gt;&gt; shutil.unpack_archive('D:\\\\a.zip', 'D:\\\\a_unpack')
&gt;&gt;&gt; shutil.rmtree('D:\\\\a_unpack')</code></pre>
<h3>目录操作</h3>
<table class="tbl">
<thead><tr><th>函数</th><th>说明</th></tr></thead>
<tbody>
<tr><td>mkdir(path[, mode=0o777])</td><td>创建目录，要求上级目录存在</td></tr>
<tr><td>makedirs(path1/path2..., mode=511)</td><td>创建多级目录，自动创建中间缺失目录</td></tr>
<tr><td>rmdir(path)</td><td>删除目录，要求其中不能有文件或子文件夹</td></tr>
<tr><td>removedirs(path1/path2...)</td><td>删除多级目录</td></tr>
<tr><td>listdir(path)</td><td>返回目录下所有文件信息</td></tr>
<tr><td>getcwd() / chdir(path)</td><td>返回 / 设置当前工作目录</td></tr>
<tr><td>walk(top, topdown=True, onerror=None)</td><td>遍历目录树，返回 (所有路径名, 所有目录列表, 文件列表) 三元组</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; import os
&gt;&gt;&gt; os.getcwd()                      # 'C:\\\\Python35'
&gt;&gt;&gt; os.mkdir(os.getcwd() + '\\\\temp')
&gt;&gt;&gt; os.chdir(os.getcwd() + '\\\\temp')
&gt;&gt;&gt; os.getcwd()                      # 'C:\\\\Python35\\\\temp'
&gt;&gt;&gt; os.mkdir(os.getcwd() + '\\\\test')
&gt;&gt;&gt; os.listdir('.')                  # ['test']
&gt;&gt;&gt; os.rmdir('test')
&gt;&gt;&gt; os.listdir('.')                  # []</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-7-7',
      heading: '7.6 应用案例与本章小结',
      blocks: [
        {
          type: 'html',
          html: `
<h3>计算文本文件中最长行的长度</h3>
<pre class="code"><code>with open('d:\\\\test.txt', 'r') as f:
    allLineLens = [len(line.strip()) for line in f]
print(max(allLineLens))

with open('d:\\\\test.txt', 'r') as f:
    print(max(len(line.strip()) for line in f))</code></pre>
<h3>判断文件是否为 GIF 图像</h3>
<pre class="code"><code>&gt;&gt;&gt; def is_gif(fname):
...     with open(fname, 'rb') as fp:
...         first4 = fp.read(4)
...     return first4 == b'GIF8'
&gt;&gt;&gt; is_gif('a.gif')     # True
&gt;&gt;&gt; is_gif('a.png')     # False</code></pre>
<p>GIF 文件前 4 个字节固定为 <code>GIF8</code>。</p>
<h3>比较两个文本文件内容</h3>
<pre class="code"><code>import difflib
A = open('c:\\\\dir.txt', 'r')
B = open('c:\\\\dir1.txt', 'r')
contentA = A.read()
contentB = B.read()
s = difflib.SequenceMatcher(lambda x: x == "", contentA, contentB)
for tag, i1, i2, j1, j2 in s.get_opcodes():
    print("%s contentA[%d:%d]=%s contentB[%d:%d]=%s" %
          (tag, i1, i2, contentA[i1:i2], j1, j2, contentB[j1:j2]))</code></pre>
<h3>Excel：xlwt / xlrd / openpyxl</h3>
<pre class="code"><code>from xlwt import *
book = Workbook()
sheet1 = book.add_sheet("First")
al = Alignment()
al.horz = Alignment.HORZ_CENTER
al.vert = Alignment.VERT_CENTER
borders = Borders()
borders.bottom = Borders.THICK
style = XFStyle()
style.alignment = al
style.borders = borders
row0 = sheet1.row(0)
row0.write(0, 'test', style=style)
book.save(r'd:\\test.xls')

&gt;&gt;&gt; import xlrd
&gt;&gt;&gt; book = xlrd.open_workbook(r'd:\\\\test.xls')
&gt;&gt;&gt; sheet1 = book.sheet_by_name('First')
&gt;&gt;&gt; print(sheet1.row(0)[0].value)   # test</code></pre>
<pre class="code"><code>import openpyxl
from openpyxl import Workbook
fn = r'f:\\test.xlsx'
wb = Workbook()
ws = wb.create_sheet(title='你好，世界')
ws['A1'] = '这是第一个单元格'
ws['B1'] = 3.1415926
wb.save(fn)

wb = openpyxl.load_workbook(fn)
ws = wb.worksheets[1]
print(ws['A1'].value)
ws.append([1, 2, 3, 4, 5])
ws.merge_cells('F2:F3')
ws['F2'] = "=sum(A2:E2)"
for r in range(10, 15):
    for c in range(3, 8):
        ws.cell(row=r, column=c, value=r*c)
wb.save(fn)</code></pre>
<h3>Word：检查连续重复字</h3>
<pre class="code"><code>from docx import Document
doc = Document('《Python程序设计开发宝典》.docx')
contents = ''.join((p.text for p in doc.paragraphs))
words = []
for index, ch in enumerate(contents[:-2]):
    if ch == contents[index+1] or ch == contents[index+2]:
        word = contents[index:index+3]
        if word not in words:
            words.append(word)
            print(word)

# 正则版
import re
text = ''.join((p.text for p in doc.paragraphs))
result = re.findall(r'(([\\u4e00-\\u9fa5。、！：；，]).?\\2)', text)
for word in result:
    print(word[0])</code></pre>
<h3>统计文件夹大小与文件 / 子文件夹数量</h3>
<pre class="code"><code>import os
totalSize = 0
fileNum = 0
dirNum = 0

def visitDir(path):
    global totalSize, fileNum, dirNum
    for lists in os.listdir(path):
        sub_path = os.path.join(path, lists)
        if os.path.isfile(sub_path):
            fileNum += 1
            totalSize += os.path.getsize(sub_path)
        elif os.path.isdir(sub_path):
            dirNum += 1
            visitDir(sub_path)

def sizeConvert(size):
    K, M, G = 1024, 1024**2, 1024**3
    if size &gt;= G:
        return str(size / G) + 'G Bytes'
    elif size &gt;= M:
        return str(size / M) + 'M Bytes'
    elif size &gt;= K:
        return str(size / K) + 'K Bytes'
    else:
        return str(size) + 'Bytes'

def main(path):
    if not os.path.isdir(path):
        print('Error:"', path, '" is not a directory or does not exist.')
        return
    visitDir(path)

def output(path):
    print('The total size of ' + path + ' is:' + sizeConvert(totalSize) + '(' + str(totalSize) + ' Bytes)')
    print('The total number of files in ' + path + ' is:', fileNum)
    print('The total number of directories in ' + path + ' is:', dirNum)

if __name__ == '__main__':
    path = r'd:\\idapro6.5plus'
    main(path)
    output(path)</code></pre>
<h3>把记事本文件转成 Excel 2007+</h3>
<pre class="code"><code>from openpyxl import Workbook

def main(txtFileName):
    new_XlsxFileName = txtFileName[:-3] + 'xlsx'
    wb = Workbook()
    ws = wb.worksheets[0]
    with open(txtFileName) as fp:
        for line in fp:
            line = line.strip().split(',')
            ws.append(line)
    wb.save(new_XlsxFileName)

main('test.txt')</code></pre>
<h3>提取 docx 中的例题 / 插图 / 表格清单</h3>
<pre class="code"><code>from docx import Document
import re
result = {'li': [], 'fig': [], 'tab': []}
doc = Document(r'C:\\Python.docx')
for p in doc.paragraphs:
    t = p.text
    if re.match('例\\d+-\\d+ ', t):
        result['li'].append(t)
    elif re.match('图\\d+-\\d+ ', t):
        result['fig'].append(t)
    elif re.match('表\\d+-\\d+ ', t):
        result['tab'].append(t)
for key in result.keys():
    print('=' * 30)
    for value in result[key]:
        print(value)</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：文件操作的相关概念；两种文件形式及其操作模块；数据组织形式；实际应用。思考：如何把本章的文件操作与前面章节的数据结构、函数、类结合起来完成一个小型数据处理程序？</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck7;

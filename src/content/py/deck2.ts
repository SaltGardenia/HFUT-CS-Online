import type { DeckData } from '../types';

/** 第2章 Python 序列 —— 课件 PPT/第二章Python序列2023（105 页） */
const deck2: DeckData = {
  id: 'deck2',
  no: '第2章',
  title: 'Python 序列',
  subtitle: '序列概述 · 列表 · 元组与序列解包 · 字典 · 集合 · 堆 / 队列 / 栈 / 链表 / 二叉树 / 图',
  lede:
    'Python 序列类似于其他语言中的数组，但功能强大得多。列表、元组、字符串是支持双向索引的有序序列，字典与集合是无序序列；按可变性又分为可变序列（列表、字典、集合）与不可变序列（元组、字符串）。本章逐一掌握四类容器的创建、增删改查与排序，并用内置容器实现堆、队列、栈、链表、二叉树、图等复杂数据结构。',
  toc: [
    { id: 'sec-2-1', text: '2.1 序列概述与四种序列对比', level: 2 },
    { id: 'sec-2-2', text: '2.2.1 列表：创建与元素增加', level: 2 },
    { id: 'sec-2-3', text: '2.2.2 列表：删除、访问、切片与排序', level: 2 },
    { id: 'sec-2-4', text: '2.2.3 列表推导式及其应用', level: 2 },
    { id: 'sec-2-5', text: '2.3 元组、序列解包与生成器推导式', level: 2 },
    { id: 'sec-2-6', text: '2.4 字典', level: 2 },
    { id: 'sec-2-7', text: '2.5 集合', level: 2 },
    { id: 'sec-2-8', text: '2.6 复杂数据结构与本章小结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-2-1',
      heading: '2.1 序列概述与四种序列对比',
      blocks: [
        {
          type: 'html',
          html: `
<p>单变量数据只能表示一个值（整型、浮点型、复数等）。若给定一篇文本，要统计每个字符出现的次数，就需要能容纳多个元素的<strong>序列</strong>结构。</p>
<p>Python 中常用的序列：</p>
<ul>
<li><strong>有序序列</strong>：列表、元组、字符串（支持双向索引）；</li>
<li><strong>无序序列</strong>：字典、集合；</li>
<li>其他：range、zip、map、enumerate 等对象；</li>
<li>按可变性：可变序列为列表、字典、集合；不可变序列为元组、字符串及 zip 等对象。</li>
</ul>
<p>双向索引：从左到右为 0, 1, 2, …，从右到左为 -1, -2, -3, …。例如字符串 'python' 中 'p' 的索引是 0 或 -6，'n' 的索引是 5 或 -1。</p>
<table class="tbl">
<thead><tr><th>项目</th><th>列表</th><th>元组</th><th>字典</th><th>集合</th></tr></thead>
<tbody>
<tr><td>类型名称</td><td>list</td><td>tuple</td><td>dict</td><td>set</td></tr>
<tr><td>定界符</td><td>方括号 []</td><td>圆括号 ()</td><td>大括号 {}</td><td>大括号 {}</td></tr>
<tr><td>是否可变</td><td>是</td><td>否</td><td>是</td><td>是</td></tr>
<tr><td>是否有序</td><td>是</td><td>是</td><td>否</td><td>否</td></tr>
<tr><td>是否支持下标</td><td>是（序号）</td><td>是（序号）</td><td>是（「键」）</td><td>否</td></tr>
<tr><td>元素分隔符</td><td>逗号</td><td>逗号</td><td>逗号</td><td>逗号</td></tr>
<tr><td>对元素形式的要求</td><td>无</td><td>无</td><td>键:值</td><td>必须可哈希</td></tr>
<tr><td>对元素值的要求</td><td>无</td><td>无</td><td>「键」必须可哈希</td><td>必须可哈希</td></tr>
<tr><td>元素是否可重复</td><td>是</td><td>是</td><td>键不重复、值可重复</td><td>否</td></tr>
<tr><td>元素查找速度</td><td>非常慢</td><td>很慢</td><td>非常快</td><td>非常快</td></tr>
<tr><td>新增和删除速度</td><td>尾部快、其他位置慢</td><td>不允许</td><td>快</td><td>快</td></tr>
</tbody>
</table>
<div class="callout key">
<p class="callout-h">可哈希（hashable）</p>
<p>可哈希的数据类型即不可变的数据结构（字符串 str、元组 tuple、对象集 objects）；不可哈希的是可变的数据结构（字典 dict、列表 list、集合 set）。哈希把大体量数据转化为很小的数据（甚至一个数字），以便在固定时间复杂度下查询，对高效算法和数据结构很重要。</p>
<p>字典的值可以是任意 Python 对象，而键通常是不可变的标量类型（整数、浮点型、字符串）或元组（元组中的对象必须不可变）。可用 <code>hash()</code> 检测对象是否可作为字典的键：<code>hash((1, 2, [2, 3]))</code> 会报 <code>TypeError: unhashable type: 'list'</code>；若要用列表作键，可先把列表转为元组。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-2',
      heading: '2.2.1 列表：创建与元素增加',
      blocks: [
        {
          type: 'html',
          html: `
<p>列表是 Python 中内置的<strong>有序、可变序列</strong>，所有元素放在一对中括号中，用逗号分隔。当元素增加或删除时，列表对象自动扩展或收缩内存，保证元素之间没有缝隙。列表中元素的数据类型可以各不相同：</p>
<pre class="code"><code>[10, 20, 30, 40]
['frog', 'fish', 'bird']
['spam', 2.0, 5, [10, 20]]
[['file1', 200, 7], ['file2', 260, 9]]</code></pre>
<h3>列表的常用方法</h3>
<table class="tbl">
<thead><tr><th>方法</th><th>说明</th></tr></thead>
<tbody>
<tr><td>lst *= n</td><td>更新列表，元素重复 n 次</td></tr>
<tr><td>lst.append(x)</td><td>将元素 x 添加至列表尾部</td></tr>
<tr><td>lst.extend(L) / lst += L</td><td>将列表 L 中所有元素添加至尾部</td></tr>
<tr><td>lst.insert(index, x)</td><td>在指定位置插入 x，其后元素后移一位</td></tr>
<tr><td>lst.remove(x)</td><td>删除首次出现的指定元素，其后元素前移一位</td></tr>
<tr><td>lst.pop([index])</td><td>删除并返回下标为 index（默认 -1）的元素</td></tr>
<tr><td>lst.clear()</td><td>删除所有元素，但保留列表对象</td></tr>
<tr><td>lst.index(x)</td><td>返回第一个值为 x 的元素下标，不存在则抛异常</td></tr>
<tr><td>lst.count(x)</td><td>返回 x 在列表中的出现次数</td></tr>
<tr><td>lst.reverse()</td><td>对所有元素原地逆序</td></tr>
<tr><td>lst.sort(key=None, reverse=False)</td><td>原地排序，key 指定排序依据，reverse 决定升降序</td></tr>
<tr><td>lst.copy()</td><td>返回列表的浅复制</td></tr>
</tbody>
</table>
<h3>创建与删除</h3>
<pre class="code"><code>&gt;&gt;&gt; a_list = ['a', 'b', 'mpilgrim', 'z', 'example']
&gt;&gt;&gt; a_list = []
&gt;&gt;&gt; list((3, 5, 7, 9, 11))
[3, 5, 7, 9, 11]
&gt;&gt;&gt; list(range(1, 10, 2))
[1, 3, 5, 7, 9]
&gt;&gt;&gt; list('hello world')
['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
&gt;&gt;&gt; del aList        # 删除整个列表；若值不再被指向，Python 同时删除该值</code></pre>
<h3>列表元素的增加</h3>
<ul>
<li><strong>+ 运算符</strong>：<code>aList = aList + [7]</code> 并非真正添加元素，而是创建新列表并把原元素与新元素依次复制到新内存空间；涉及大量复制、速度较慢，大量元素添加时不建议使用。</li>
<li><strong>append()</strong>：在当前列表尾部追加元素，<em>原地修改</em>（不改变列表在内存中的首地址），速度较快。</li>
<li><strong>+= 与 append() 的共同点和区别</strong>：<code>x = []; x += '1234'</code> 得到 <code>['1','2','3','4']</code>；<code>x += range(3)</code> 得到 <code>[...0,1,2]</code>；<code>x += map(str, range(3))</code> 得到 <code>[..., '0','1','2']</code>。</li>
<li><strong>extend()</strong>：把另一个迭代对象的所有元素添加至尾部，也是原地操作。</li>
<li><strong>insert(index, x)</strong>：在指定位置插入元素。由于列表的自动内存管理，插入位置之后的所有元素都要移动，会影响速度；<code>remove()</code>、<code>pop()</code> 非尾部元素、<code>del</code> 非尾部元素同理。因此<strong>应尽量从列表尾部进行增加与删除</strong>。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; a = [1, 2, 3]
&gt;&gt;&gt; id(a)
46036232
&gt;&gt;&gt; a.extend([2, 3, 4])
&gt;&gt;&gt; id(a)
46036232
&gt;&gt;&gt; a.insert(3, 6)
&gt;&gt;&gt; a
[1, 2, 3, 6, 2, 3, 4]</code></pre>
<div class="callout key">
<p class="callout-h">课件性能对比（10000 个元素 × 10 次）</p>
<p><code>insert(0, i)</code> 从头部插入：Insert 约 0.345 s；<code>append(i)</code> 尾部追加：Append 约 0.009 s。结论：头插与尾插性能差近 40 倍。</p>
</div>
<h3>乘法扩展列表</h3>
<pre class="code"><code>&gt;&gt;&gt; aList = [3, 5, 7]
&gt;&gt;&gt; bList = aList
&gt;&gt;&gt; aList = aList * 3
&gt;&gt;&gt; aList, bList
([3, 5, 7, 3, 5, 7, 3, 5, 7], [3, 5, 7])</code></pre>
<div class="callout warn">
<p class="callout-h">重复嵌套列表只复制引用</p>
<p><code>x = [[None] * 2] * 3</code> 得到的三个子列表是同一对象的引用；执行 <code>x[0][0] = 5</code> 后，整个 x 变为 <code>[[5, None], [5, None], [5, None]]</code>。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-3',
      heading: '2.2.2 列表：删除、访问、切片与排序',
      blocks: [
        {
          type: 'html',
          html: `
<h3>列表元素的删除</h3>
<ul>
<li><code>del aList[1]</code>：删除指定位置上的元素；</li>
<li><code>aList.pop()</code>：删除并返回指定位置（默认最后一个）的元素，索引越界抛 <code>IndexError</code>；</li>
<li><code>aList.remove(7)</code>：删除<strong>首次出现</strong>的指定元素，不存在则抛异常。</li>
</ul>
<div class="callout warn">
<p class="callout-h">边遍历边删除的陷阱</p>
<p><code>for item in x: if item == 1: x.remove(item)</code>：对 <code>[1,2,1,2,1,2,1,2,1]</code> 恰巧能删干净，但对 <code>[1,2,1,2,1,1,1]</code> 结果为 <code>[2, 2, 1]</code>。原因是删除元素后列表自动收缩、后面元素前移，索引随之改变，循环跳过了元素。</p>
<p>正确做法：遍历切片副本 <code>for item in x[::]</code>，或从后往前删 <code>for i in range(len(x)-1, -1, -1)</code>。</p>
</div>
<h3>访问与计数</h3>
<pre class="code"><code>&gt;&gt;&gt; aList = [1, 2, 3]
&gt;&gt;&gt; aList[4]
IndexError: list index out of range
&gt;&gt;&gt; aList.index(2)
1
&gt;&gt;&gt; aList.index(100)
ValueError: 100 is not in list
&gt;&gt;&gt; [3, 4, 5, 5].count(5)
2
&gt;&gt;&gt; 3 in [[1], [2], [3]]
False</code></pre>
<h3>切片操作</h3>
<p>切片适用于列表、元组、字符串、range 对象等，作用于列表时功能最强大。切片用两个冒号分隔的三个数字完成：<code>[start:end:step]</code>，start 默认 0，end 默认列表长度（不含），step 默认 1。切片不会因下标越界抛异常，而是在列表尾部截断或返回空列表。</p>
<pre class="code"><code>&gt;&gt;&gt; aList = [3, 4, 5, 6, 7, 9, 11, 13, 15, 17]
&gt;&gt;&gt; aList[::-1]      # 逆序
[17, 15, 13, 11, 9, 7, 6, 5, 4, 3]
&gt;&gt;&gt; aList[::2]       # 偶数位置
[3, 5, 7, 11, 15]
&gt;&gt;&gt; aList[1::2]      # 奇数位置
[4, 6, 9, 13, 17]
&gt;&gt;&gt; aList[3:6]       # 下标 [3, 6)
[6, 7, 9]
&gt;&gt;&gt; aList[0:100:1]   # 自动截断
[3, 4, 5, 6, 7, 9, 11, 13, 15, 17]
&gt;&gt;&gt; aList[100:]      # 空列表
[]</code></pre>
<p>切片可原地修改列表内容，也可与 del 结合删除元素：</p>
<pre class="code"><code>&gt;&gt;&gt; aList = [3, 5, 7]
&gt;&gt;&gt; aList[:2] = [1, 2]
&gt;&gt;&gt; aList
[1, 2, 7]
&gt;&gt;&gt; aList = list(range(1, 11))
&gt;&gt;&gt; aList[::2] = [0]*5
[0, 2, 0, 4, 0, 6, 0, 8, 0, 10]
&gt;&gt;&gt; aList[::2] = [0]*3
ValueError: attempt to assign sequence of size 3 to extended slice of size 5
&gt;&gt;&gt; aList = [3, 5, 7, 9, 11]
&gt;&gt;&gt; del aList[1::2]      # 删除奇数位置上的元素
[3, 7, 11]</code></pre>
<h3>浅复制与深复制</h3>
<p>切片返回的是列表元素的<strong>浅复制</strong>：生成新列表，把原列表所有元素的引用复制到新列表。若原列表包含子列表等可变对象，修改子列表会同时影响两个列表；若只含整数、实数、复数、元组、字符串等不可变类型，一般没有问题。</p>
<pre class="code"><code>&gt;&gt;&gt; x = [1, 2, [3, 4]]
&gt;&gt;&gt; y = x[::]
&gt;&gt;&gt; x[0] = 5
&gt;&gt;&gt; y
[1, 2, [3, 4]]
&gt;&gt;&gt; x[2].append(6)
&gt;&gt;&gt; y
[1, 2, [3, 4, 6]]

&gt;&gt;&gt; import copy
&gt;&gt;&gt; y = copy.deepcopy(x)   # 深复制：递归复制所有值，互相独立</code></pre>
<h3>排序</h3>
<ul>
<li><code>lst.sort()</code>：原地排序，默认升序；<code>reverse=True</code> 降序；<code>key</code> 指定排序依据，如 <code>aList.sort(key=lambda x: len(str(x)))</code>；</li>
<li><code>sorted(lst)</code>：返回新列表，不修改原对象；</li>
<li><code>lst.reverse()</code>：原地逆序；<code>reversed(lst)</code>：返回迭代对象，一次性使用。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; import random
&gt;&gt;&gt; random.shuffle(aList)          # 随机打乱
&gt;&gt;&gt; aList.sort(reverse=True)        # 降序
&gt;&gt;&gt; sorted(aList)                   # 返回新列表
&gt;&gt;&gt; list(reversed(aList))</code></pre>
<h3>用于序列操作的内置函数</h3>
<pre class="code"><code>&gt;&gt;&gt; len(aList)              # 元素个数（列表/元组/字典/集合/字符串）
&gt;&gt;&gt; max(aList), min(aList)
&gt;&gt;&gt; sum(range(1, 11))       # 55
&gt;&gt;&gt; sum(range(1, 11), 5)    # 60，5 + sum(...)
&gt;&gt;&gt; sum([1, 2], 3)          # 6
&gt;&gt;&gt; sum([[1, 2], [3], [4]], [])   # [1, 2, 3, 4]
&gt;&gt;&gt; list(zip([1,2,3], [4,5,6]))
[(1, 4), (2, 5), (3, 6)]
&gt;&gt;&gt; list(enumerate('abcdef'))
[(0, 'a'), (1, 'b'), (2, 'c'), (3, 'd'), (4, 'e'), (5, 'f')]</code></pre>
<p>注意 <code>sum([1,2], [3])</code> 会报 <code>TypeError</code>（列表与整数不能相加）；<code>sum([[1,2],[3],[4]], [])</code> 以空列表为起点做拼接，占用空间较大，慎用。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-4',
      heading: '2.2.3 列表推导式及其应用',
      blocks: [
        {
          type: 'html',
          html: `
<p>列表推导式（列表解析式）用非常简洁的方式快速生成满足特定需求的列表。语法形式：</p>
<div class="formula"><p>[expression for expr1 in sequence1 if condition1<br/>for expr2 in sequence2 if condition2 ... for exprN in sequenceN if conditionN]</p></div>
<p><strong>执行顺序</strong>：各语句之间是嵌套关系，左边第二个语句是最外层，依次往右进一层，左边第一条语句是最后一层。</p>
<pre class="code"><code>[x*y for x in range(1,5) if x &gt; 2 for y in range(1,4) if y &lt; 3]

# 等价于
for x in range(1, 5):
    if x &gt; 2:
        for y in range(1, 4):
            if y &lt; 3:
                x * y</code></pre>
<pre class="code"><code>&gt;&gt;&gt; [x*x for x in range(10)]
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
# 等价于循环 append，也等价于 list(map(lambda x: x*x, range(10)))</code></pre>
<h3>典型应用</h3>
<pre class="code"><code># 阿凡提棋盘放米：64 格，每格是前一格的 2 倍
&gt;&gt;&gt; sum([2**i for i in range(64)])
18446744073709551615
&gt;&gt;&gt; int('1'*64, 2)
18446744073709551615

# 嵌套列表平铺
&gt;&gt;&gt; matrix = [[1, 2, 3], [4, 5, 6]]
&gt;&gt;&gt; [element for item in matrix for element in item]
[1, 2, 3, 4, 5, 6]
&gt;&gt;&gt; sum(matrix, [])          # 另一种写法

# 过滤元素
&gt;&gt;&gt; [element for element in [-1, -4, 6, 7.5, -2.3, 9, -11] if element &gt; 0]
[6, 7.5, 9]

# 多序列组合 + 条件
&gt;&gt;&gt; [(x, y) for x in range(3) for y in range(3)]
[(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
&gt;&gt;&gt; [(x, y) for x in [1, 2, 3] for y in [3, 1, 4] if x != y]

# 列出当前文件夹下的 Python 源文件
&gt;&gt;&gt; import os
&gt;&gt;&gt; [f for f in os.listdir('.') if f.endswith(('.py', '.pyw'))]

# 100 以内的素数
&gt;&gt;&gt; [p for p in range(2, 100) if 0 not in [p % d for d in range(2, int(p**0.5) + 1)]]
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]</code></pre>
<h3>矩阵转置</h3>
<pre class="code"><code>&gt;&gt;&gt; matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
&gt;&gt;&gt; [[row[i] for row in matrix] for i in range(4)]
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]

# 等价展开
result = []
for i in range(len(matrix[0])):
    temp = []
    for row in matrix:
        temp.append(row[i])
    result.append(temp)</code></pre>
<div class="callout key">
<p class="callout-h">执行顺序要看清</p>
<p>转置结果的第一项 <code>[1, 5, 9]</code> 是 matrix 中每一行的第 0 个元素；不要受线性代数「转置」思维诱导，把行列写反。外层 for 是 <code>for i in range(4)</code>，内层才是 <code>for row in matrix</code>。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-2-5',
      heading: '2.3 元组、序列解包与生成器推导式',
      blocks: [
        {
          type: 'html',
          html: `
<h3>元组的定义与创建</h3>
<p>元组与列表类似，但属于<strong>不可变序列</strong>，一旦创建就不能修改元素。定义时所有元素放在一对圆括号中：</p>
<pre class="code"><code>&gt;&gt;&gt; aTuple = ('a', 'b', 'mpilgrim', 'z', 'example')
&gt;&gt;&gt; a = (3,)          # 单元素元组，逗号不能省略
&gt;&gt;&gt; a = 3,            # 也可以这样写
&gt;&gt;&gt; x = ()            # 空元组
&gt;&gt;&gt; tuple('abcdefg')
('a', 'b', 'c', 'd', 'e', 'f', 'g')
&gt;&gt;&gt; tuple([-1, -4, 6, 7.5])
(-1, -4, 6, 7.5)
&gt;&gt;&gt; del aTuple        # 只能删除整个元组，不能删除其中元素</code></pre>
<h3>元组与列表的区别</h3>
<ul>
<li>元组没有 append()、extend()、insert() 等方法，无法添加元素；</li>
<li>没有 remove()、pop() 方法，不能 del 元组元素，无法删除元素；</li>
<li>元组速度比列表更快，遍历常量值序列时一般用元组；</li>
<li>元组对不需要改变的数据提供「写保护」，代码更安全；</li>
<li>元组可用作字典的「键」或集合的元素；列表永远不能（列表可变、不可哈希）。</li>
</ul>
<h3>序列解包</h3>
<p>当函数或方法返回元组时，把元组中的值赋给变量序列中的变量，称为序列解包。可用它对多个变量同时赋值：</p>
<pre class="code"><code>&gt;&gt;&gt; x, y, z = 1, 2, 3
&gt;&gt;&gt; (x, y, z) = (False, 3.5, 'exp')
&gt;&gt;&gt; x, y, z = range(3)
&gt;&gt;&gt; x, y, z = iter([1, 2, 3])
&gt;&gt;&gt; x, y, z = map(str, range(3))
&gt;&gt;&gt; a, b = b, a                  # 交换两个变量
&gt;&gt;&gt; a, b, c = 'ABC'
&gt;&gt;&gt; keys = ['a', 'b', 'c', 'd']
&gt;&gt;&gt; values = [1, 2, 3, 4]
&gt;&gt;&gt; for k, v in zip(keys, values):
...     print((k, v), end=' ')
('a', 1) ('b', 2) ('c', 3) ('d', 4)
&gt;&gt;&gt; for i, v in enumerate(['a', 'b', 'c']):
...     print('The value on position {0} is {1}'.format(i, v))</code></pre>
<p><code>str.format()</code> 自 Python 2.6 起提供，通过 <code>{}</code> 和 <code>:</code> 代替 <code>%</code> 做格式化；支持按名称、按字典解包 <code>**site</code>、按列表索引 <code>{0[0]}</code> 取参。</p>
<h3>生成器推导式</h3>
<p>把列表推导式的方括号改为圆括号即得到生成器对象。生成器对象具有<strong>惰性求值</strong>特点，只在需要时生成新元素，比列表推导式效率更高、空间占用非常少，尤其适合大数据处理。访问过的元素不能再次访问。</p>
<pre class="code"><code>&gt;&gt;&gt; g = ((i + 2) ** 2 for i in range(10))
&gt;&gt;&gt; g
&lt;generator object &lt;genexpr&gt; at 0x...&gt;
&gt;&gt;&gt; tuple(g)
(4, 9, 16, 25, 36, 49, 64, 81, 100, 121)
&gt;&gt;&gt; list(g)
[]                      # 已遍历完，无法再次访问
&gt;&gt;&gt; g = ((i + 2) ** 2 for i in range(10))
&gt;&gt;&gt; g.__next__()      # 4
&gt;&gt;&gt; next(g)           # 9</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-2-6',
      heading: '2.4 字典',
      blocks: [
        {
          type: 'html',
          html: `
<p>字典是<strong>无序、可变序列</strong>。定义时每个元素的键和值用冒号分隔，元素之间用逗号分隔，所有元素放在一对大括号中。字典中的键可以为任意不可变数据，如整数、实数、复数、字符串、元组等。<code>globals()</code> 返回当前作用域内所有全局变量与值的字典，<code>locals()</code> 返回局部变量与值的字典。</p>
<table class="tbl">
<thead><tr><th>函数和方法</th><th>描述</th></tr></thead>
<tbody>
<tr><td>d.keys()</td><td>返回所有键信息</td></tr>
<tr><td>d.values()</td><td>返回所有值信息</td></tr>
<tr><td>d.items()</td><td>返回所有键值对</td></tr>
<tr><td>d.get(key, default)</td><td>键存在返回相应值，否则返回默认值</td></tr>
<tr><td>d.pop(key, default)</td><td>键存在返回相应值并删除该键值对，否则返回默认值</td></tr>
<tr><td>d.popitem()</td><td>随机取出一个键值对，以 (key, value) 元组返回</td></tr>
<tr><td>d.clear()</td><td>删除所有键值对</td></tr>
<tr><td>del d[key]</td><td>删除某一个键值对</td></tr>
<tr><td>key in d</td><td>键在字典中返回 True</td></tr>
</tbody>
</table>
<h3>创建与删除</h3>
<pre class="code"><code>&gt;&gt;&gt; a_dict = {'server': 'db.diveintopython3.org', 'database': 'mysql'}
&gt;&gt;&gt; x = {}                       # 空字典
&gt;&gt;&gt; keys = ['a', 'b', 'c', 'd']
&gt;&gt;&gt; values = [1, 2, 3, 4]
&gt;&gt;&gt; dict(zip(keys, values))
{'a': 1, 'c': 3, 'b': 2, 'd': 4}
&gt;&gt;&gt; dict(name='Dong', age=37)
{'name': 'Dong', 'age': 37}
&gt;&gt;&gt; dict.fromkeys(['name', 'age', 'sex'])
{'age': None, 'name': None, 'sex': None}
&gt;&gt;&gt; a = dict(one=1, two=2, three=3)
&gt;&gt;&gt; b = {'one': 1, 'two': 2, 'three': 3}
&gt;&gt;&gt; c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
&gt;&gt;&gt; d = dict([('two', 2), ('one', 1), ('three', 3)])
&gt;&gt;&gt; e = dict({'three': 3, 'one': 1, 'two': 2})
&gt;&gt;&gt; f = dict({'one': 1, 'three': 3}, two=2)
&gt;&gt;&gt; a == b == c == d == e == f
True</code></pre>
<h3>元素读取</h3>
<pre class="code"><code>&gt;&gt;&gt; aDict = {'name': 'Dong', 'sex': 'male', 'age': 37}
&gt;&gt;&gt; aDict['name']
'Dong'
&gt;&gt;&gt; aDict['tel']               # 键不存在，抛 KeyError
&gt;&gt;&gt; aDict.get('address')       # None
&gt;&gt;&gt; aDict.get('address', 'SDIBT')   # 'SDIBT'
&gt;&gt;&gt; aDict['score'] = aDict.get('score', [])
&gt;&gt;&gt; aDict['score'].append(98)  # {'age': 37, 'score': [98], ...}</code></pre>
<p>遍历时：<code>for item in aDict.items()</code> 输出键值对；<code>for key in aDict</code> 默认输出键；<code>for key, value in aDict.items()</code> 用序列解包同时取键值。<code>items()</code> 是无参引用，<code>aDict.items(0)</code> 是错误的。</p>
<h3>添加、修改与删除</h3>
<ul>
<li>以指定键为下标赋值：键存在则修改该键的值，不存在则添加一个键值对；</li>
<li><code>update()</code>：把另一个字典的键值对添加到当前字典；</li>
<li><code>del d[key]</code> 删除指定键；<code>clear()</code> 清空；<code>pop(key)</code> 删除并返回指定键元素；<code>popitem()</code> 删除并返回最后一对键值。</li>
</ul>
<h3>字典应用案例：统计字符出现次数</h3>
<pre class="code"><code>import string, random
x = '0123456789'
y = random.choices(x, k=1000)     # 有放回抽取 k 个元素
z = ''.join(y)
d = dict()
for ch in z:
    d[ch] = d.get(ch, 0) + 1
print(d)

# 方法二：defaultdict，访问不存在的键时自动赋默认值，不抛 KeyError
from collections import defaultdict
frequences = defaultdict(int)
for item in z:
    frequences[item] += 1

# 方法三：Counter（dict 子类，用于计数可哈希对象），支持 most_common()
from collections import Counter
frequences = Counter(z)
print(frequences.most_common(1))      # 出现次数最多的字符
# 统计 hamlet.txt 中出现最多的 10 个单词
words = re.findall(r'\\w+', open('hamlet.txt').read().lower())
Counter(words).most_common(10)</code></pre>
<p>Python 内置字典无序；若需要记住插入顺序，可用 <code>collections.OrderedDict</code>。字典推导式：<code>{i: str(i) for i in range(1, 5)}</code>、<code>{i: j for i, j in zip(x, y)}</code>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-2-7',
      heading: '2.5 集合',
      blocks: [
        {
          type: 'html',
          html: `
<p>集合是<strong>无序、可变序列</strong>，用一对大括号界定，元素不可重复，同一个集合中每个元素唯一。集合中只能包含数字、字符串、元组等不可变（可哈希）类型，不能包含列表、字典、集合等可变类型。</p>
<pre class="code"><code>&gt;&gt;&gt; a = {3, 5}
&gt;&gt;&gt; a.add(7)
&gt;&gt;&gt; a
{3, 5, 7}
&gt;&gt;&gt; set(range(8, 14))
{8, 9, 10, 11, 12, 13}
&gt;&gt;&gt; set([0, 1, 2, 3, 0, 1, 2, 3, 7, 8])   # 自动去重
{0, 1, 2, 3, 7, 8}
&gt;&gt;&gt; set()          # 空集合
set()
&gt;&gt;&gt; type({})        # &lt;class 'dict'&gt;，空大括号是字典
&gt;&gt;&gt; type({4,})      # &lt;class 'set'&gt;</code></pre>
<p>删除方式：<code>del</code> 删除整个集合；<code>pop()</code> 弹出并删除其中一个元素；<code>remove()</code> 删除指定元素；<code>clear()</code> 清空。</p>
<table class="tbl">
<thead><tr><th>函数或方法</th><th>描述</th></tr></thead>
<tbody>
<tr><td>S.add(x)</td><td>x 不在集合 S 中时，将 x 增加进去</td></tr>
<tr><td>S.clear()</td><td>移除 S 中所有数据项</td></tr>
<tr><td>S.copy()</td><td>返回集合 S 的一个拷贝</td></tr>
<tr><td>S.pop()</td><td>随机返回并删除一个元素；S 为空产生 KeyError</td></tr>
<tr><td>S.discard(x)</td><td>x 在则移除，不在不报错</td></tr>
<tr><td>S.remove(x)</td><td>x 在则移除，不在产生 KeyError</td></tr>
<tr><td>S.isdisjoint(T)</td><td>S 与 T 不相交（无相同元素）返回 True</td></tr>
<tr><td>len(S)</td><td>返回元素个数</td></tr>
<tr><td>x in S / x not in S</td><td>成员测试</td></tr>
</tbody>
</table>
<table class="tbl">
<thead><tr><th>操作符</th><th>描述</th></tr></thead>
<tbody>
<tr><td>S - T 或 S.difference(T)</td><td>返回在 S 中但不在 T 中的元素组成的新集合</td></tr>
<tr><td>S -= T 或 S.difference_update(T)</td><td>更新 S 为在 S 中但不在 T 中的元素</td></tr>
<tr><td>S &amp; T 或 S.intersection(T)</td><td>返回同时在 S 和 T 中的元素</td></tr>
<tr><td>S &amp;= T 或 S.intersection_update(T)</td><td>更新 S 为同时在 S 和 T 中的元素</td></tr>
<tr><td>S ^ T 或 S.symmetric_difference(T)</td><td>返回 S、T 中元素但不包括同时在其中者</td></tr>
<tr><td>S |= T 或 S.update(T)</td><td>更新 S 为包含 S 和 T 所有元素</td></tr>
<tr><td>S &lt;= T 或 S.issubset(T)</td><td>S 与 T 相同或 S 是 T 的子集返回 True（S &lt; T 判真子集）</td></tr>
<tr><td>S &gt;= T 或 S.issuperset(T)</td><td>S 与 T 相同或 S 是 T 的超集返回 True（S &gt; T 判真超集）</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; s = set((1, 2, 3))
&gt;&gt;&gt; t = set((2, 3, 4))
&gt;&gt;&gt; s &amp; t, s.intersection(t)
({2, 3}, {2, 3})
&gt;&gt;&gt; s -= t
&gt;&gt;&gt; s, t
({1}, {2, 3, 4})</code></pre>
<h3>集合运用案例：生成不重复随机数</h3>
<pre class="code"><code>def RandomNumbersByList(number, start, end):
    data = []
    n = 0
    while True:
        element = random.randint(start, end)
        if element not in data:      # 列表成员测试很慢
            data.append(element)
            n += 1
        if n == number:
            break
    return data

def RandomNumbersBySet(number, start, end):
    data = set()
    while True:
        data.add(random.randint(start, end))
        if len(data) == number:
            break
    return data

# 取 50000 个不重复数字、重复测试 10 次：
# RandomNumbersByList 约 247.1 s；RandomNumbersBySet 约 1.26 s</code></pre>
<h3>集合推导式与 sorted()</h3>
<pre class="code"><code>&gt;&gt;&gt; {x.strip() for x in ('  he  ', 'she    ', '    I')}
{'I', 'she', 'he'}</code></pre>
<p>列表提供 <code>sort()</code> 原地排序；内置 <code>sorted()</code> 返回新列表，可对列表、元组、字典、range 等排序，两者都支持 key 参数。</p>
<pre class="code"><code>&gt;&gt;&gt; persons = [{'name': 'Li', 'age': 40}, {'name': 'Li', 'age': 37}, {'name': 'Dong', 'age': 43}]
# 先按姓名升序，姓名相同按年龄降序
&gt;&gt;&gt; sorted(persons, key=lambda x: (x['name'], -x['age']))

&gt;&gt;&gt; from operator import itemgetter
&gt;&gt;&gt; sorted(phonebook.items(), key=itemgetter(1))   # 按值排序

# 奇数在前、偶数在后：key 返回布尔值，False(0) 排在 True(1) 前
&gt;&gt;&gt; sorted(x, key=lambda item: item % 2 == 0)</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-2-8',
      heading: '2.6 复杂数据结构与本章小结',
      blocks: [
        {
          type: 'html',
          html: `
<h3>堆（Heap）</h3>
<p>堆是非线性的树形数据结构，包括最大堆与最小堆；<code>heapq</code> 库中的堆默认是<strong>最小堆</strong>。</p>
<pre class="code"><code>&gt;&gt;&gt; import heapq, random
&gt;&gt;&gt; data = list(range(10))
&gt;&gt;&gt; random.shuffle(data)
&gt;&gt;&gt; heap = []
&gt;&gt;&gt; for n in data:
...     heapq.heappush(heap, n)     # 建堆
&gt;&gt;&gt; heapq.heappop(heap)            # 出堆，自动重建
&gt;&gt;&gt; myheap = [1, 2, 3, 5, 7, 8, 9, 4, 10, 333]
&gt;&gt;&gt; heapq.heapify(myheap)
&gt;&gt;&gt; heapq.heapreplace(myheap, 6)   # 弹出最小元素并插入新元素
&gt;&gt;&gt; heapq.nlargest(3, myheap)      # 前 3 个最大
&gt;&gt;&gt; heapq.nsmallest(3, myheap)     # 前 3 个最小</code></pre>
<h3>队列（Queue）</h3>
<pre class="code"><code>&gt;&gt;&gt; import queue
&gt;&gt;&gt; q = queue.Queue()
&gt;&gt;&gt; q.put(0); q.put(1); q.put(2)
&gt;&gt;&gt; q.queue
deque([0, 1, 2])
&gt;&gt;&gt; q.get()            # 出队 0

&gt;&gt;&gt; from queue import LifoQueue     # 后进先出
&gt;&gt;&gt; q = LifoQueue(); q.put(2); q.put(3)
&gt;&gt;&gt; q.get()                         # 3

&gt;&gt;&gt; from queue import PriorityQueue # 优先级队列
&gt;&gt;&gt; q = PriorityQueue()
&gt;&gt;&gt; q.put(3); q.put(8); q.put(100); q.put(1); q.put(2)
&gt;&gt;&gt; q.get()                         # 1，每次返回优先级最低（数值最小）的元素</code></pre>
<p>用列表模拟队列：<code>x.pop(0)</code> 出队、<code>x.append(5)</code> 入队；空列表再 pop 会抛 <code>IndexError</code>。<code>queue.Queue</code> 是「后进后出」的 FIFO 队列，<code>LifoQueue</code> 是 LIFO，对空队列调用 get() 会阻塞当前线程。</p>
<h3>双端队列（deque）</h3>
<pre class="code"><code>&gt;&gt;&gt; from collections import deque
&gt;&gt;&gt; q = deque(maxlen=5)
&gt;&gt;&gt; for item in [3, 5, 7, 9, 11]:
...     q.append(item)
&gt;&gt;&gt; q.append(13); q.append(15)     # 队列满，自动溢出
&gt;&gt;&gt; q
deque([7, 9, 11, 13, 15], maxlen=5)
&gt;&gt;&gt; q.appendleft(5)                # 左侧添加，右侧自动溢出
deque([5, 7, 9, 11, 13], maxlen=5)</code></pre>
<h3>栈（Stack）</h3>
<p>栈是「后进先出（LIFO）」或「先进后出（FILO）」的数据结构。Python 列表本身即可实现栈：<code>append()</code> 入栈，<code>pop()</code> 出栈；但空栈 pop 会抛异常，也无法限制栈大小。可封装列表实现带容量限制的栈：</p>
<pre class="code"><code>class Stack:
    def __init__(self, size=10):
        self._content = []     # 用列表存放栈的元素
        self._size = size      # 初始栈大小
        self._current = 0      # 栈中元素个数

    def empty(self):
        self._content = []
        self._current = 0

    def isEmpty(self):
        return not self._content

    def setSize(self, size):
        if size &lt; self._current:          # 缩小栈空间时删除多余元素
            for i in range(size, self._current)[::-1]:
                del self._content[i]
            self._current = size
        self._size = size

    def isFull(self):
        return self._current == self._size

    def push(self, v):
        if len(self._content) &lt; self._size:
            self._content.append(v)
            self._current += 1
        else:
            print('Stack Full!')

    def pop(self):
        if self._content:
            self._current -= 1
            return self._content.pop()
        else:
            print('Stack is empty!')

    def show(self):
        print(self._content)

    def showRemainderSpace(self):
        print('Stack can still PUSH ', self._size - self._current, ' elements.')

if __name__ == '__main__':
    print('Please use me as a module.')</code></pre>
<h3>链表（Linked List）</h3>
<p>可直接用列表模拟：<code>append()</code> 追加、<code>insert(1, 4)</code> 插入、<code>remove(linkTable[1])</code> 删除。</p>
<h3>二叉树（Binary Tree）</h3>
<pre class="code"><code>class BinaryTree:
    def __init__(self, value):
        self.__left = None
        self.__right = None
        self.__data = value

    def insertLeftChild(self, value):
        if self.__left:
            print('__left child tree already exists.')
        else:
            self.__left = BinaryTree(value)
            return self.__left

    def insertRightChild(self, value):
        if self.__right:
            print('Right child tree already exists.')
        else:
            self.__right = BinaryTree(value)
            return self.__right

    def preOrder(self):          # 前序：根 → 左 → 右
        print(self.__data)
        if self.__left:
            self.__left.preOrder()
        if self.__right:
            self.__right.preOrder()

    def inOrder(self):           # 中序：左 → 根 → 右
        if self.__left:
            self.__left.inOrder()
        print(self.__data)
        if self.__right:
            self.__right.inOrder()

    def postOrder(self):         # 后序：左 → 右 → 根
        if self.__left:
            self.__left.postOrder()
        if self.__right:
            self.__right.postOrder()
        print(self.__data)</code></pre>
<p>用该类的对象不仅支持整棵二叉树的前 / 中 / 后序遍历，也支持任意「子树」的遍历（如 <code>b.inOrder()</code>）。</p>
<h3>有向图（Directed Graph）</h3>
<pre class="code"><code>def searchPath(graph, start, end):
    results = []
    __generatePath(graph, [start], end, results)
    results.sort(key=lambda x: len(x))
    return results

def __generatePath(graph, path, end, results):
    current = path[-1]
    if current == end:
        results.append(path)
    else:
        for n in graph[current]:
            if n not in path:
                __generatePath(graph, path + [n], end, results)

graph = {'A': ['B', 'C', 'D'], 'B': ['E'], 'C': ['D', 'F'],
         'D': ['B', 'E', 'G'], 'E': ['D'], 'F': ['D', 'G'], 'G': ['E']}
r1 = searchPath(graph, 'A', 'D')
showPath(r1)</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>可变序列：列表、字典、集合；不可变序列：元组、字符串、zip 等对象；复杂数据结构：堆、队列、栈、链表、二叉树、图。思考：如何编写复杂数据结构的 Python 代码？</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck2;

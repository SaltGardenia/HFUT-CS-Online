import type { DeckData } from '../types';

/** 第5章 函数的设计与使用 —— 课件 PPT/第五章 函数的设计与使用2023（53 页） */
const deck5: DeckData = {
  id: 'deck5',
  no: '第5章',
  title: '函数的设计与使用',
  subtitle: '定义与递归 · 形参与实参 · 参数类型 · return 与作用域 · lambda · map/filter/reduce · 生成器函数',
  lede:
    '把可能需要反复执行的代码封装为函数并在需要处调用，既能实现代码复用，又能保证代码一致性——只需修改函数，所有调用都会受影响。设计函数时应提高模块内聚性、降低隐式耦合，尽量减少副作用。本章依次掌握函数的定义与递归、形参与实参的传递规则、五类参数、return 与 LEGB 作用域、lambda 表达式，以及 map / filter / reduce、生成器函数、函数嵌套等高级话题。',
  toc: [
    { id: 'sec-5-1', text: '5.1 函数的定义与递归', level: 2 },
    { id: 'sec-5-2', text: '5.2 形参与实参', level: 2 },
    { id: 'sec-5-3', text: '5.3 参数类型（位置 / 默认 / 关键 / 可变长度 / 解包）', level: 2 },
    { id: 'sec-5-4', text: '5.4 return 语句与变量作用域', level: 2 },
    { id: 'sec-5-5', text: '5.5 Lambda 表达式', level: 2 },
    { id: 'sec-5-6', text: '5.6 高级话题与案例应用', level: 2 },
  ],
  sections: [
    {
      id: 'sec-5-1',
      heading: '5.1 函数的定义与递归',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>def &lt;函数名&gt;(&lt;参数列表&gt;):
    '''注释'''
    &lt;函数体&gt;
    return &lt;返回值列表&gt;</code></pre>
<ul>
<li>函数形参不需要声明类型，也不需要指定返回值类型；</li>
<li>即使不接收任何参数，也必须保留一对空圆括号；括号后的冒号必不可少；</li>
<li>函数体相对 def 必须保持缩进；</li>
<li>Python 允许<strong>嵌套定义函数</strong>。</li>
</ul>
<pre class="code"><code>def fib(n):
    a, b = 1, 1
    while a &lt; n:
        print(a, end=' ')
        a, b = b, a + b
    print()

fib(1000)        # n 是形参，1000 是实参</code></pre>
<p>函数开头的注释不是必需的，但写上注释可为用户提供友好提示。Python 中函数和自定义对象的成员可以随时改变，可为函数动态增加新成员：</p>
<pre class="code"><code>&gt;&gt;&gt; def func():
...     print(func.x)
&gt;&gt;&gt; func()          # AttributeError: 'function' object has no attribute 'x'
&gt;&gt;&gt; func.x = 3      # 动态增加成员
&gt;&gt;&gt; func()          # 3
&gt;&gt;&gt; del func.x
&gt;&gt;&gt; func()          # 再次 AttributeError</code></pre>
<h3>递归</h3>
<p>函数的递归调用是函数调用的一种特殊情况：在函数（子程序）执行过程中调用自身。有两种形式：<strong>直接递归</strong>——函数体内调用自身；<strong>间接递归</strong>——函数调用其他函数，再由其他函数调用自身。</p>
<p>递归更是一种程序设计（算法设计）技术，适用于：原问题可分解为若干子问题分别求解；适当合并子问题的解可得到原问题的解；子问题的求解方式与原问题相同。</p>
<p>递归常用于解决三类问题：</p>
<ol>
<li>数据的定义按递归定义——如 Fibonacci 函数；</li>
<li>问题的解法按递归算法实现——如 Hanoi 塔问题；</li>
<li>数据的结构形式按递归定义——如二叉树。</li>
</ol>
<p>递归调用会一层层调用下去，直到某个条件满足就不再调用，然后一层层返回，直到第一次调用的位置。可设置递归深度：</p>
<pre class="code"><code>import sys
sys.setrecursionlimit(3000)</code></pre>
<p>汉诺塔：n 个盘子和 A、B、C 三根柱子，起初所有盘子在 A 上，要求一个一个移到 B，移动过程可用 C，但盘子只能放在比它大的盘子上面。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-2',
      heading: '5.2 形参与实参',
      blocks: [
        {
          type: 'html',
          html: `
<p>函数定义时括号内为<strong>形参</strong>，一个函数可以没有形参，但括号必须有。函数调用时向形参传递<strong>实参</strong>，传递的是实参的引用。定义时对参数个数没有限制，多个形参用逗号分隔。</p>
<p>绝大多数情况下，在函数内部直接修改形参的值<strong>不会影响实参</strong>，而是创建一个新变量：</p>
<pre class="code"><code>&gt;&gt;&gt; def addOne(a):
...     print(id(a), ':', a)
...     a += 1
...     print(id(a), ':', a)
&gt;&gt;&gt; v = 3
&gt;&gt;&gt; addOne(v)
1599055008 : 3
1599055040 : 4        # a 指向了新值，地址改变
&gt;&gt;&gt; v
3                     # 实参 v 不受影响</code></pre>
<div class="callout key">
<p class="callout-h">什么时候能改到实参</p>
<p>如果传递给函数的是<strong>可变序列</strong>，并且在函数内部使用下标或可变序列自身的方法增加、删除、修改元素，实参也会相应改变：</p>
<pre class="code"><code>def modify(v):
    v[0] = v[0] + 1
a = [2]; modify(a); print(a)      # [3]

def modify(v, item):
    v.append(item)
a = [2]; modify(a, 3); print(a)   # [2, 3]

def modify(d):
    d['age'] = 38
a = {'name': 'zhang', 'age': 46, 'sex': 'Male'}
modify(a)                          # age 变为 38</code></pre>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-5-3',
      heading: '5.3 参数类型（位置 / 默认 / 关键 / 可变长度 / 解包）',
      blocks: [
        {
          type: 'html',
          html: `
<p>Python 定义函数时不指定形参类型，完全由调用者传递的实参类型以及解释器的推断决定，类似重载和泛型。也允许对参数和返回值类型进行标注，但实际不起作用，只是看起来方便：</p>
<pre class="code"><code>def test(x: int, y: int) -&gt; int:
    '''x and y must be integers, return an integer x+y'''
    assert isinstance(x, int), 'x must be integer'
    assert isinstance(y, int), 'y must be integer'
    z = x + y
    assert isinstance(z, int), 'must return an integer'
    return z

&gt;&gt;&gt; test(2, 3.0)
AssertionError: y must be integer</code></pre>
<h3>位置参数</h3>
<p>最常用形式：调用时实参与形参顺序必须严格一致，数量必须相同。</p>
<pre class="code"><code>&gt;&gt;&gt; def demo(a, b, c):
...     print(a, b, c)
&gt;&gt;&gt; demo(3, 4, 5)     # 3 4 5
&gt;&gt;&gt; demo(1, 2, 3, 4)  # TypeError: demo() takes 3 positional arguments but 4 were given</code></pre>
<h3>默认值参数</h3>
<pre class="code"><code>&gt;&gt;&gt; def say(message, times=1):
...     print(message * times)
&gt;&gt;&gt; say('hello')       # hello
&gt;&gt;&gt; say('hello', 3)    # hello hello hello

def DayUpFun(r, days=365):
    dayup = pow((1.0 + r), days)
    daydown = pow((1.0 - r), days)
    return dayup, daydown

&gt;&gt;&gt; def Join(List, sep=None):
...     return (sep or ' ').join(List)
&gt;&gt;&gt; Join(['a', 'b', 'c'])        # 'a b c'
&gt;&gt;&gt; Join(['a', 'b', 'c'], ',')   # 'a,b,c'</code></pre>
<p>默认值参数必须出现在参数列表最右端，任何默认值参数右边不能有非默认值参数：<code>def func(a=3, b, c=5)</code> 报 <code>SyntaxError: non-default argument follows default argument</code>。</p>
<div class="callout warn">
<p class="callout-h">可变对象作默认值的陷阱</p>
<pre class="code"><code>def demo(newitem, old_list=[]):
    old_list.append(newitem)
    return old_list

print(demo('5', [1, 2, 3, 4]))   # [1, 2, 3, 4, '5']
print(demo('aaa', ['a', 'b']))   # ['a', 'b', 'aaa']
print(demo('a'))                 # ['a']
print(demo('b'))                 # ['a', 'b']  ← 上一次的默认列表被复用了</code></pre>
<p>原因：<strong>默认值参数只在函数定义时被解释一次</strong>。默认值为可变序列时，后续运算可能修改它。解决：默认值用 None，在函数内判断后再创建新列表，并用切片复制：</p>
<pre class="code"><code>def demo(newitem, old_list=None):
    if old_list is None:
        old_list = []
    new_list = old_list[:]
    new_list.append(newitem)
    return new_list</code></pre>
<p>可用 <code>函数名.__defaults__</code> 查看所有默认参数的当前值。非可变默认值一般不会被改变：<code>i = 3; def f(n=i): ...</code> 之后修改 i 不影响 n 的默认值。</p>
</div>
<h3>关键参数</h3>
<p>通过关键参数，实参顺序可以与形参顺序不一致，不影响传递结果，免去记忆位置顺序的麻烦：</p>
<pre class="code"><code>&gt;&gt;&gt; def demo(a, b, c=5):
...     print(a, b, c)
&gt;&gt;&gt; demo(3, 7)              # 3 7 5
&gt;&gt;&gt; demo(a=7, b=3, c=6)     # 7 3 6
&gt;&gt;&gt; demo(c=8, a=9, b=0)     # 9 0 8</code></pre>
<h3>可变长度参数</h3>
<ul>
<li><code>*parameter</code>：接收多个位置实参并放到一个<strong>元组</strong>中；</li>
<li><code>**parameter</code>：接收多个关键参数并存放到<strong>字典</strong>中。</li>
</ul>
<pre class="code"><code>&gt;&gt;&gt; def demo(*p):
...     print(p)
&gt;&gt;&gt; demo(1, 2, 3)          # (1, 2, 3)

&gt;&gt;&gt; def demo(**p):
...     for item in p.items():
...         print(item)
&gt;&gt;&gt; demo(x=1, y=2, z=3)    # ('y', 2) ('x', 1) ('z', 3)</code></pre>
<p>多种参数可以混合，但不建议：</p>
<pre class="code"><code>&gt;&gt;&gt; def func_4(a, b, c=4, *aa, **bb):
...     print(a, b, c)
...     print(aa)
...     print(bb)
&gt;&gt;&gt; func_4(1, 2, 3, 4, 5, 6, 7, 8, 9, xx='1', yy='2', zz=3)
1 2 3
(4, 5, 6, 7, 8, 9)
{'yy': '2', 'xx': '1', 'zz': 3}</code></pre>
<h3>实参序列解包</h3>
<p>在实参序列前加一个星号可将其解包后传给多个单变量形参；字典前加两个星号等价于关键参数：</p>
<pre class="code"><code>&gt;&gt;&gt; def demo(a, b, c):
...     print(a + b + c)
&gt;&gt;&gt; demo(*[1, 2, 3])          # 6
&gt;&gt;&gt; demo(*(1, 2, 3))          # 6
&gt;&gt;&gt; demo(1, *(2, 3))          # 1 2 3
&gt;&gt;&gt; demo(1, *(2,), 3)         # 1 2 3
&gt;&gt;&gt; demo(**{'a': 1, 'b': 2, 'c': 3})   # 6
&gt;&gt;&gt; demo(a=1, *(2, 3))
TypeError: demo() got multiple values for argument 'a'
&gt;&gt;&gt; demo(c=1, *(2, 3))        # 2 3 1，序列解包相当于位置参数、优先处理
&gt;&gt;&gt; demo(**{'a': 1, 'b': 2}, *(3,))
SyntaxError: iterable argument unpacking follows keyword argument unpacking
&gt;&gt;&gt; demo(*(3,), **{'c': 1, 'b': 2})   # 3 2 1</code></pre>
<p>注意：单星号解包后的实参按普通位置参数对待，且在关键参数与双星号解包参数之前处理；序列解包不能放在关键参数解包之后。</p>
`,
        },
      ],
    },
    {
      id: 'sec-5-4',
      heading: '5.4 return 语句与变量作用域',
      blocks: [
        {
          type: 'html',
          html: `
<p>return 从一个函数中返回一个值，同时结束函数。以下三种情况 Python 认为函数以 <code>return None</code> 结束，返回空值：函数没有 return 语句；有 return 但没有执行到；有 return 但没有返回任何值。</p>
<pre class="code"><code>&gt;&gt;&gt; a_list = [1, 2, 3, 4, 9, 5, 7]
&gt;&gt;&gt; print(sorted(a_list))   # [1, 2, 3, 4, 5, 7, 9]，返回新列表
&gt;&gt;&gt; print(a_list)           # 原列表不变 [1, 2, 3, 4, 9, 5, 7]
&gt;&gt;&gt; print(a_list.sort())    # None，sort 原地排序无返回值
&gt;&gt;&gt; print(a_list)           # 原列表已排序</code></pre>
<p>调用函数或方法时一定要注意有没有返回值，这决定了它的用法。</p>
<h3>变量作用域</h3>
<p>变量起作用的代码范围称为作用域，不同作用域内变量名可以相同、互不影响。函数内部定义的普通变量只在函数内部起作用，称为<strong>局部变量</strong>；函数执行结束后局部变量自动删除。局部变量的引用比全局变量速度快，应优先使用。</p>
<p><strong>global</strong> 关键字用于定义全局变量，分两种情况：</p>
<ol>
<li>变量已在函数外定义，函数内需要赋值并把结果反映到函数外，可在函数内用 global 声明；</li>
<li>变量在函数外没有定义，也可在函数内直接定义为全局变量，函数执行后增加一个新的全局变量。</li>
</ol>
<pre class="code"><code>&gt;&gt;&gt; def demo():
...     global x
...     x = 3
...     y = 4
...     print(x, y)
&gt;&gt;&gt; x = 5
&gt;&gt;&gt; demo()      # 3 4
&gt;&gt;&gt; x           # 3
&gt;&gt;&gt; y           # NameError: name 'y' is not defined</code></pre>
<p>可这样理解：函数内只引用某变量而不赋新值，若可执行则为（隐式）全局变量；函数内任意位置只要有为变量赋新值的操作，该变量就被认为是（隐式）局部变量，除非用 global 显式声明。</p>
<pre class="code"><code>&gt;&gt;&gt; x = 3
&gt;&gt;&gt; def f():
...     print(x)
...     x = 5
...     print(x)
&gt;&gt;&gt; f()
UnboundLocalError: local variable 'x' referenced before assignment</code></pre>
<p>如果局部变量与全局变量同名，局部变量会在自己的作用域内隐藏同名全局变量：</p>
<pre class="code"><code>&gt;&gt;&gt; def demo():
...     x = 3
&gt;&gt;&gt; x = 5
&gt;&gt;&gt; demo()
&gt;&gt;&gt; x       # 5，函数执行不影响外面全局变量的值</code></pre>
<p>不同模块间共享全局变量可编写专门模块：A.py 定义 <code>global_variable = 0</code>；B.py 中 <code>import A; A.global_variable = 1</code>；C.py 中 <code>import A; print(A.global_variable)</code>。</p>
<h3>nonlocal 与 LEGB</h3>
<p><strong>nonlocal</strong> 声明介于局部与全局之间的变量，引用上行代码距离最近的非全局作用域变量，要求变量已存在，不会创建新变量。</p>
<pre class="code"><code>def scope_test():
    def do_local():
        spam = "我是局部变量"
    def do_nonlocal():
        nonlocal spam
        spam = "我不是局部变量，也不是全局变量"
    def do_global():
        global spam
        spam = "我是全局变量"
    spam = "原来的值"
    do_local()
    print("局部变量赋值后：", spam)      # 原来的值
    do_nonlocal()
    print("nonlocal变量赋值后：", spam)  # 我不是局部变量，也不是全局变量
    do_global()
    print("全局变量赋值后：", spam)      # 我不是局部变量，也不是全局变量
scope_test()
print("全局变量：", spam)                # 我是全局变量</code></pre>
<p>变量访问的 <strong>LEGB</strong> 顺序：Local → Enclosing → Global → Builtin（函数内部 → 内嵌函数之间 → 全局 → 内置作用域）。</p>
<pre class="code"><code>x = 3
def outer():
    y = 5
    def map():                 # 这个名字会拦截内置 map
        return '我是假的map()函数'
    def inner():
        x = 7
        y = 9
        print('inner:', x, y, max(x, y), map())
    inner()
    print('outer:', x, y, max(x, y), map())
outer()
print('outside:', x, y, max(x, y))   # y 不在全局/内置作用域，NameError</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-5-5',
      heading: '5.5 Lambda 表达式',
      blocks: [
        {
          type: 'html',
          html: `
<p>lambda 表达式用于声明匿名函数（lambda 函数），即没有函数名字、临时使用的小函数，尤其适合「需要一个函数作为另一个函数参数」的场合；也可以定义具名函数。</p>
<div class="formula"><p>&lt;函数名&gt; = lambda &lt;参数列表&gt;: &lt;表达式&gt;</p></div>
<p>它等价于：</p>
<pre class="code"><code>def &lt;函数名&gt;(&lt;参数列表&gt;):
    return &lt;表达式&gt;</code></pre>
<pre class="code"><code>&gt;&gt;&gt; f = lambda x, y, z: x + y + z
&gt;&gt;&gt; f(1, 2, 3)          # 6
&gt;&gt;&gt; g = lambda x, y=2, z=3: x + y + z
&gt;&gt;&gt; g(1)                # 6
&gt;&gt;&gt; g(2, z=4, y=5)      # 11</code></pre>
<h3>示例</h3>
<pre class="code"><code>&gt;&gt;&gt; def demo(n):
...     return n * n
&gt;&gt;&gt; list(map(lambda x: demo(x), [1, 2, 3, 4, 5]))
[1, 4, 9, 16, 25]

&gt;&gt;&gt; L = [(lambda x: x**2), (lambda x: x**3), (lambda x: x**4)]
&gt;&gt;&gt; print(L[0](2), L[1](2), L[2](2))
4 8 16

&gt;&gt;&gt; D = {'f1': (lambda: 2 + 3), 'f2': (lambda: 2 * 3), 'f3': (lambda: 2 ** 3)}
&gt;&gt;&gt; print(D['f1'](), D['f2'](), D['f3']())
5 6 8

&gt;&gt;&gt; L = [1, 2, 3, 4, 5]
&gt;&gt;&gt; list(map(lambda x: x + 10, L))
[11, 12, 13, 14, 15]
&gt;&gt;&gt; L        # 原列表不变</code></pre>
<h3>排序中的 key</h3>
<pre class="code"><code>&gt;&gt;&gt; data = list(range(20))
&gt;&gt;&gt; random.shuffle(data)
&gt;&gt;&gt; data.sort(key=lambda x: x)
&gt;&gt;&gt; data.sort(key=lambda x: len(str(x)))          # 按字符串长度升序
&gt;&gt;&gt; data.sort(key=lambda x: len(str(x)), reverse=True)   # 降序

&gt;&gt;&gt; x = [[random.randint(1, 10) for j in range(5)] for i in range(5)]
&gt;&gt;&gt; y = sorted(x, key=lambda item: (item[1], item[4]))
# 按子列表第 2 个元素升序、第 5 个元素升序排序</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-5-6',
      heading: '5.6 高级话题与案例应用',
      blocks: [
        {
          type: 'html',
          html: `
<h3>案例 5-1：计算圆的面积</h3>
<pre class="code"><code>from math import pi as PI

def CircleArea(r):
    if isinstance(r, (int, float)) and r &gt; 0:
        return PI * r * r
    else:
        print('You must give an integer or float as radius.')

print(CircleArea(3))</code></pre>
<h3>案例 5-2：列表分段逆序（循环左移）</h3>
<pre class="code"><code>def demo(lst, k):
    x = lst[:k]
    x.reverse()
    y = lst[k:]
    y.reverse()
    r = x + y
    r.reverse()
    return r

lst = list(range(1, 21))
print(demo(lst, 5))</code></pre>
<p>该操作实际是把列表中所有元素循环左移 k 位。collections 的 deque 对象已实现该功能；也可直接切片：</p>
<pre class="code"><code>&gt;&gt;&gt; import collections
&gt;&gt;&gt; x = collections.deque(range(20))
&gt;&gt;&gt; x.rotate(-3)

&gt;&gt;&gt; def shift(lst, k):
...     return lst[k:] + lst[:k]
&gt;&gt;&gt; shift(list(range(20)), 3)
[3, 4, 5, ..., 19, 0, 1, 2]
&gt;&gt;&gt; shift(list(range(20)), -3)
[17, 18, 19, 0, 1, ..., 16]</code></pre>
<h3>map / filter / reduce</h3>
<pre class="code"><code>&gt;&gt;&gt; list(map(str, range(5)))
['0', '1', '2', '3', '4']
&gt;&gt;&gt; def add5(v): return v + 5
&gt;&gt;&gt; list(map(add5, range(10)))
[5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
&gt;&gt;&gt; def add(x, y): return x + y
&gt;&gt;&gt; list(map(add, range(5), range(5)))
[0, 2, 4, 6, 8]

&gt;&gt;&gt; seq = ['foo', 'x41', '?!', '***']
&gt;&gt;&gt; def func(x): return x.isalnum()
&gt;&gt;&gt; list(filter(func, seq))            # ['foo', 'x41']
&gt;&gt;&gt; [x for x in seq if x.isalnum()]    # ['foo', 'x41']
&gt;&gt;&gt; list(filter(lambda x: x.isalnum(), seq))

&gt;&gt;&gt; from functools import reduce
&gt;&gt;&gt; reduce(lambda x, y: x + y, [1,2,3,4,5,6,7,8,9])   # 45
&gt;&gt;&gt; reduce(add, range(10))                            # 45
&gt;&gt;&gt; reduce(add, map(str, range(10)))                  # '0123456789'</code></pre>
<h3>生成器函数</h3>
<p>包含 yield 语句的函数可创建生成器对象，称为生成器函数。每次执行到 yield 返回一个值并<strong>暂停</strong>后续代码，下次通过 <code>__next__()</code>、next() 或 for 遍历时恢复执行。生成器对象具有惰性求值特点，适合大数据处理。</p>
<pre class="code"><code>&gt;&gt;&gt; def f():
...     a, b = 1, 1
...     while True:
...         yield a
...         a, b = b, a + b
&gt;&gt;&gt; a = f()
&gt;&gt;&gt; for i in range(10):
...     print(a.__next__(), end=' ')
1 1 2 3 5 8 13 21 34 55</code></pre>
<p>单步调试可看到：首次 <code>__next__()</code> 执行到 yield 返回 1 并暂停；再次调用从 yield 之后继续执行 <code>a, b = b, a+b</code>，然后回到 while 循环再次 yield。</p>
<h3>函数嵌套定义与可调用对象</h3>
<pre class="code"><code>&gt;&gt;&gt; def myMap(iterable, op, value):
...     if op not in '+-*/':
...         return 'Error operator'
...     def nested(item):                 # 嵌套定义
...         return eval(repr(item) + op + repr(value))
...     return map(nested, iterable)
&gt;&gt;&gt; list(myMap(range(5), '+', 5))      # [5, 6, 7, 8, 9]
&gt;&gt;&gt; list(myMap(range(5), '/', 5))      # [0.0, 0.2, 0.4, 0.6, 0.8]

def linear(a, b):
    def result(x):
        return a * x + b
    return result

taxes = linear(0.3, 2)   # 返回可调用对象
taxes(5)                  # 3.5</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：函数的相关概念；形参与实参、参数类型、参数作用；函数的其他应用。思考：函数的应用。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck5;

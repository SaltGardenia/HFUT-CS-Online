import type { DeckData } from '../types';

/** 第3章 程序的控制结构 —— 课件 PPT/第三章 程序的控制结构2023（57 页） */
const deck3: DeckData = {
  id: 'deck3',
  no: '第3章',
  title: '程序的控制结构',
  subtitle: '顺序 / 分支 / 循环 · 条件表达式 · 循环优化 · 案例集 · try-except 异常处理',
  lede:
    '程序由三种基本结构组成：顺序结构、分支结构、循环结构，它们都有一个入口和一个出口，任何程序都由这三种基本结构组合而成。本章在流程图与条件表达式的基础上掌握 if、while、for 的用法与优化技巧，并用一批经典案例（水仙花数、素数、组合数、百钱买百鸡、进制转换、蒙特卡罗、6174 猜想等）训练控制结构的组合运用，最后介绍 try-except 异常处理。',
  toc: [
    { id: 'sec-3-1', text: '3.1 程序的基本结构与条件表达式', level: 2 },
    { id: 'sec-3-2', text: '3.2 分支结构', level: 2 },
    { id: 'sec-3-3', text: '3.3 循环结构与优化', level: 2 },
    { id: 'sec-3-4', text: '3.4 案例集', level: 2 },
    { id: 'sec-3-5', text: '3.5 异常处理与本章小结', level: 2 },
  ],
  sections: [
    {
      id: 'sec-3-1',
      heading: '3.1 程序的基本结构与条件表达式',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>程序流程图</strong>用一系列图形、流程线和文字说明描述程序的基本操作和控制流程，是程序分析和过程描述的最基本方式。流程图的基本元素有 7 种：起止框、判断框、处理框、输入 / 输出框、注释框、流向线、连接点。</p>
<ul>
<li><strong>顺序结构</strong>：程序按照线性顺序依次执行。语句块 S1 和 S2 表示一个或一组顺序执行的语句。</li>
<li><strong>分支结构</strong>：根据条件判断结果选择不同向前执行路径，包括单分支、二分支（二分支组合形成多分支）。</li>
<li><strong>循环结构</strong>：根据条件判断结果向后反复执行，按循环体触发条件不同分为条件循环与遍历循环。</li>
</ul>
<h3>天天向上</h3>
<pre class="code"><code># 一年 365 天，第 1 天能力值为 1.0；每天努力提高 r，每天放任下降 r
import math
r = eval(input("ratio:"))
dayup = math.pow((1.0 + r), 365)
daydown = math.pow((1.0 - r), 365)
print("向上:{:.2f}, 向下:{:.2f}.".format(dayup, daydown))</code></pre>
<p>r = 0.001 时每天努力 1‰，一年提高 44%；r = 0.005 时提高 6 倍；r = 0.01 时提高 37 倍——这就是「天天向上的力量」。</p>
<pre class="code"><code># 一周 5 个工作日努力、周末放任：一年后仅为初始的 4.63 倍（r=0.01）
dayup, r = 1.0, 0.01
for i in range(365):
    if i % 7 in [6, 0]:       # 周六、周日
        dayup = dayup * (1 - r)
    else:
        dayup = dayup * (1 + r)
print("向上5天向下2天的力量: {:.2f}.".format(dayup))</code></pre>
<h3>条件表达式</h3>
<p>条件表达式的值只要不是 False、0（或 0.0、0j 等）、空值 None、空列表、空元组、空集合、空字典、空字符串、空 range 对象或其他空迭代对象，Python 解释器均认为与 True 等价。因此几乎所有的合法表达式都可以作为条件表达式，包括含函数调用的表达式。</p>
<p>可用的运算符：算术（+、-、*、/、//、%、**）、关系（&gt;、&lt;、==、&lt;=、&gt;=、!=）、测试（in、not in、is、is not）、逻辑（and、or、not）、位运算（~、&amp;、|、^、&lt;&lt;、&gt;&gt;）、矩阵乘法（@）。</p>
<pre class="code"><code>&gt;&gt;&gt; i = s = 0
&gt;&gt;&gt; while i &lt;= 10:          # 关系表达式作条件
...     s += i; i += 1
&gt;&gt;&gt; while True:             # 常量 True 作条件
...     s += i; i += 1
...     if i &gt; 10: break
&gt;&gt;&gt; if 3: print(5)          # 整数作条件，输出 5
&gt;&gt;&gt; if [1, 2, 3]: print('ok')   # 非空列表为真
&gt;&gt;&gt; if []: print('ok')
... else: print('empty')     # 输出 empty</code></pre>
<p>and、or 与关系运算符具有<strong>惰性求值</strong>（短路）特点：对 <code>表达式1 and 表达式2</code>，若表达式1 为 False，则不计表达式2；or 类似（并联 / 串联电路、not 为短路）。根据失败概率组织条件顺序可提高运行效率。条件表达式中<strong>不允许使用赋值运算符 =</strong>（<code>if a=3:</code> 报 SyntaxError）。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-2',
      heading: '3.2 分支结构',
      blocks: [
        {
          type: 'html',
          html: `
<h3>单分支与双分支</h3>
<pre class="code"><code>if &lt;表达式&gt;:
    &lt;语句块&gt;

if &lt;表达式&gt;:
    &lt;语句块1&gt;
else:
    &lt;语句块2&gt;</code></pre>
<pre class="code"><code>x = input('Input two number:')
a, b = map(int, x.split())
if a &gt; b:
    a, b = b, a
print(a, b)</code></pre>
<h3>条件表达式（三元运算）</h3>
<div class="formula"><p>value1 if condition else value2</p></div>
<p>当 condition 与 True 等价时表达式值为 value1，否则为 value2；value1、value2 中还可以使用复杂表达式，包括函数调用和基本输出语句；该结构同样具有惰性求值特点。</p>
<pre class="code"><code>&gt;&gt;&gt; a = 5
&gt;&gt;&gt; print(6) if a &gt; 3 else print(5)   # 6
&gt;&gt;&gt; print(6 if a &gt; 3 else 5)          # 6
&gt;&gt;&gt; b = 6 if a &gt; 13 else 9            # 9</code></pre>
<div class="callout key">
<p class="callout-h">惰性求值的实际效果</p>
<p><code>x = math.sqrt(9) if 5&gt;3 else random.randint(1, 100)</code>：未导入 math 时先报 NameError；导入 math 后，因条件为 True，不会计算 random 分支，所以即使未导入 random 也能正常运行。条件改为 <code>2&gt;3</code> 时才会计算 random 分支并报错。</p>
</div>
<h3>多分支结构</h3>
<pre class="code"><code>score = eval(input("score:"))
if score &gt; 100:
    print('wrong score.must &lt;= 100.')
elif score &gt;= 90:
    print('A')
elif score &gt;= 80:
    print('B')
elif score &gt;= 70:
    print('B')
elif score &gt;= 60:
    print('C')
elif score &gt;= 0:
    print('E')
else:
    print('wrong score.must &gt;0')</code></pre>
<h3>选择语句的嵌套与跳转表</h3>
<p>嵌套时缩进必须正确且一致。利用列表、元组或字典可构建<strong>跳转表</strong>，在某些场合更快地实现类似多分支的功能：</p>
<pre class="code"><code>score = eval(input("score:"))
degree = 'DCBAAE'
if score &gt; 100 or score &lt; 0:
    print('wrong score.must between 0 and 100.')
else:
    index = (score - 60) // 10
    if index &gt;= 0:
        print(degree[index])
    else:
        print(degree[-1])

funcDict = {'1': lambda: print('You input 1'),
            '2': lambda: print('You input 2'),
            '3': lambda: print('You input 3')}
x = input('Input an integer to call different function:')
func = funcDict.get(x, None)
if func:
    func()
else:
    print('Wrong integer.')</code></pre>
<h3>分支应用：求平均分</h3>
<pre class="code"><code>numbers = []
while True:
    x = input('请输入一个成绩：')
    try:
        numbers.append(float(x))
    except:
        print('不是合法成绩')
    while True:
        flag = input('继续输入吗？（yes/no）').lower()
        if flag not in ('yes', 'no'):
            print('只能输入yes或no')
        else:
            break
    if flag == 'no':
        break
print(sum(numbers) / len(numbers))</code></pre>
<h3>分支应用：判断今天是今年的第几天</h3>
<pre class="code"><code>import time
date = time.localtime()               # struct_time
year, month, day = date[:3]
day_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):   # 闰年
    day_month[1] = 29
if month == 1:
    print(day)
else:
    print(sum(day_month[:month-1]) + day)

# 闰年判断也可直接用 calendar 模块
&gt;&gt;&gt; import calendar
&gt;&gt;&gt; calendar.isleap(2016)     # True
&gt;&gt;&gt; calendar.isleap(2015)     # False</code></pre>
<p>Python 用 time 和 calendar 模块格式化日期与时间；时间间隔以秒为单位的浮点小数表示，时间戳表示从 1970 年 1 月 1 日午夜（历元）起经过的时间。struct_time 元组用 9 组数字处理时间。</p>
<pre class="code"><code>&gt;&gt;&gt; import datetime
&gt;&gt;&gt; datetime.date.today().timetuple().tm_yday
133
&gt;&gt;&gt; datetime.date(2020, 5, 12).timetuple().tm_yday
133
&gt;&gt;&gt; today = datetime.date.today()
&gt;&gt;&gt; firstDay = datetime.date(today.year, 1, 1)
&gt;&gt;&gt; daysDelta = today - firstDay + datetime.timedelta(days=1)
&gt;&gt;&gt; daysDelta.days
133
&gt;&gt;&gt; now = datetime.datetime.now()
&gt;&gt;&gt; now.strftime('%Y-%m-%d %H:%M:%S')
&gt;&gt;&gt; now.replace(second=30)              # 替换秒
&gt;&gt;&gt; now + datetime.timedelta(days=5)    # 5 天后
&gt;&gt;&gt; now + datetime.timedelta(weeks=-5)  # 5 周前</code></pre>
<p>datetime 提供 date、time、datetime、timedelta、tzinfo 等类；strftime() 按格式串输出，常用格式符：%y 两位年、%Y 四位年、%m 月、%d 日、%H 24 时、%I 12 时、%M 分、%S 秒、%a / %A 简化 / 完整星期名、%b / %B 简化 / 完整月份名、%j 年内第几天（001–366）、%p AM/PM、%U / %W 周数、%w 星期（0–6）、%x / %X 本地日期 / 时间、%Z 时区名、%% 百分号本身。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-3',
      heading: '3.3 循环结构与优化',
      blocks: [
        {
          type: 'html',
          html: `
<p>Python 提供 while 和 for 两种基本循环。<strong>while</strong> 一般用于循环次数难以提前确定的情况，也可用于次数确定的情况；<strong>for</strong> 一般用于次数可以提前确定的情况，尤其适合枚举序列或迭代对象中的元素。两者都可带 else：<strong>若循环因 break 结束，则不执行 else</strong>。</p>
<pre class="code"><code>while &lt;条件表达式&gt;:
    &lt;循环体&gt;
[else:
    &lt;else子句代码块&gt;]

for &lt;取值 in 序列或迭代对象&gt;:
    &lt;循环体&gt;
[else:
    &lt;else子句代码块&gt;]</code></pre>
<h3>循环结构的优化</h3>
<p>编写循环时应<strong>尽量减少循环内部不必要的计算</strong>，把与循环变量无关的代码尽量提取到循环之外；多重循环嵌套同理。</p>
<pre class="code"><code># 优化前：每次内层都做 i*100 + j*10 + k
digits = (1, 2, 3, 4)
for i in range(1000):
    result = []
    for i in digits:
        for j in digits:
            for k in digits:
                result.append(i*100 + j*10 + k)

# 优化后：把 i*100、j*10 提到对应层外
digits = (1, 2, 3, 4)
for i in range(1000):
    result = []
    for i in digits:
        i = i * 100
        for j in digits:
            j = j * 10
            for k in digits:
                result.append(i + j + k)

# 进一步用集合去重、剪枝
digits = {1, 2, 3, 4}
for i in range(1000):
    result = set()
    for i in digits:
        if i == 0: continue
        ii = i * 100
        for j in digits - {i}:
            jj = j * 10
            for k in digits - {i, j}:
                result.add(ii + jj + k)</code></pre>
<p>课件实测三段运行时间分别约 0.036 s、0.026 s、0.016 s。</p>
<p>循环中应尽量引用<strong>局部变量</strong>，局部变量的查询和访问速度比全局变量略快；使用模块中的方法时，可直接导入以减少查询次数：</p>
<pre class="code"><code>import time, math
start = time.time()
for i in range(10000000):
    math.sin(i)
print('Time Used:', time.time() - start)     # 约 2.567 s

loc_sin = math.sin
start = time.time()
for i in range(10000000):
    loc_sin(i)
print('Time Used:', time.time() - start)     # 约 2.083 s</code></pre>
<h3>break 与 continue</h3>
<ul>
<li><strong>break</strong>：在 while 和 for 中都可使用，一般放在 if 选择结构中，一旦执行就使整个循环提前结束；除非能让代码更简单或更清晰，否则不要轻易使用。</li>
<li><strong>continue</strong>：终止当前循环，忽略其后的语句，回到循环顶端提前进入下一次循环。</li>
</ul>
<pre class="code"><code># 求小于 100 的最大素数：注意 break 与 else 子句的配合
&gt;&gt;&gt; for n in range(100, 1, -1):
...     for i in range(2, n):
...         if n % i == 0:
...             break
...     else:
...         print(n)
...         break
97</code></pre>
<div class="callout warn">
<p class="callout-h">continue 造成的死循环</p>
<p><code>i = 0; while i &lt; 10: if i % 2 == 0: continue; print(i); i += 1</code> 中 i=0 时 continue 跳过了 <code>i += 1</code>，循环永不结束，需 Ctrl+C 终止。修订方式：在 continue 前先 <code>i += 1</code>，或改用 for 循环。</p>
<p>for 循环中 <code>i += 1</code> 不会影响循环执行：每次进入循环时的 i 已由迭代器给出新的值（课件用 <code>id(i)</code> 演示每次都是不同对象）。</p>
</div>
<pre class="code"><code>&gt;&gt;&gt; for s in "Hello Python":
...     if s == "o":
...         continue
...     print(s, end="")
... else:
...     print("exit")
Hell Pythnexit</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-3-4',
      heading: '3.4 案例集',
      blocks: [
        {
          type: 'html',
          html: `
<h3>求 1+2+…+100 与遍历序列</h3>
<pre class="code"><code>s = 0
for i in range(1, 101):
    s = s + i
print('1+2+3+…+100 = ', s)
print('1+2+3+…+100 = ', sum(range(1, 101)))

a_list = ['a', 'b', 'c', 'd', 'e']
for i, v in enumerate(a_list):
    print('列表的第', i+1, '个元素是：', v)</code></pre>
<h3>水仙花数</h3>
<p>3 位十进制数，各位数字的立方和等于该数本身（153 = 1³ + 5³ + 3³）。</p>
<pre class="code"><code>for i in range(100, 1000):
    bai, shi, ge = map(int, str(i))
    if ge**3 + shi**3 + bai**3 == i:
        print(i)

for num in range(100, 1000):
    r = map(lambda x: int(x)**3, str(num))
    if sum(r) == num:
        print(num)</code></pre>
<h3>平均分、素数、去重随机数</h3>
<pre class="code"><code>score = [70, 90, 78, 85, 97, 94, 65, 80]
print(sum(score) / len(score))

# 判断素数
import math
n = int(input('Input an integer:'))
m = math.ceil(math.sqrt(n) + 1)
for i in range(2, m):
    if n % i == 0 and i &lt; n:
        print('No')
        break
else:
    print('Yes')

# 20 个 1~100 之间互不相同的随机数（集合版）
from random import randint
x = set()
while len(x) &lt; 20:
    x.add(randint(1, 100))
print(x)
print(sorted(x))</code></pre>
<h3>组合数 C(n, i)</h3>
<pre class="code"><code>n, i = eval(input("n:")), eval(input("i:"))
if not (isinstance(n, int) and isinstance(i, int) and n &gt;= i):
    print('n and i must be integers and n &gt;= i.')
    return
result = 1
Min, Max = sorted((i, n - i))
for i in range(n, 0, -1):
    if i &gt; Max:
        result *= i
    elif i &lt;= Min:
        result //= i
print(result)

# 递推写法
n, i = eval(input("n:")), eval(input("i:"))
minNI = min(i, n - i)
result = 1
for j in range(0, minNI):
    result = result * (n - j) // (j + 1)
print(result)</code></pre>
<p>也可用 math.factorial 按定义实现：<code>int(math.factorial(n) / math.factorial(i) / math.factorial(n-i))</code>；或 itertools：<code>len(tuple(itertools.combinations(range(60), 2)))</code>。</p>
<h3>itertools 常用函数</h3>
<p>模块主要函数：accumulate、chain、combinations、combinations_with_replacement、compress、count、cycle、dropwhile、filterfalse、groupby、islice、permutations、product、repeat、starmap、takewhile、zip_longest。</p>
<pre class="code"><code>&gt;&gt;&gt; for item in itertools.permutations(range(1, 4), 2):
...     print(item)
(1, 2) (1, 3) (2, 1) (2, 3) (3, 1) (3, 2)

&gt;&gt;&gt; x = range(1, 20)
&gt;&gt;&gt; y = (1, 0) * 9 + (1,)
&gt;&gt;&gt; list(itertools.compress(x, y))
[1, 3, 5, 7, 9, 11, 13, 15, 17, 19]

&gt;&gt;&gt; y = itertools.cycle('Private Key')   # 循环遍历
&gt;&gt;&gt; for i in range(20):
...     print(next(y), end=',')
P,r,i,v,a,t,e, ,K,e,y,P,r,i,v,a,t,e, ,K,</code></pre>
<h3>百钱买百鸡</h3>
<p>公鸡 5 元、母鸡 3 元、小鸡 1 元 3 只，100 元买 100 只，求所有买法。</p>
<pre class="code"><code>for x in range(21):          # 公鸡
    for y in range(34):      # 母鸡
        z = 100 - x - y      # 小鸡
        if z % 3 == 0 and 5*x + 3*y + z//3 == 100:
            print(x, y, z)
# 0 25 75 / 4 18 78 / 8 11 81 / 12 4 84</code></pre>
<h3>十进制转任意进制</h3>
<p>编程要点：除基取余，逆序排列。以 668 转八进制为例：商依次 83、10、1、0，余数 4、3、2、1，逆序得 1234。</p>
<pre class="code"><code>n, base = eval(input("n:")), eval(input("base:"))
result = []
div = n
while div != 0:
    div, mod = divmod(div, base)
    result.append(mod)
result.reverse()
print(''.join(map(str, result)))</code></pre>
<h3>阶乘之和、丑数、严格升序</h3>
<pre class="code"><code># 1! + 2! + ... + n!
n = eval(input("n:"))
result, t = 1, 1
for i in range(2, n + 1):
    t *= i
    result += t

# 丑数：因数只含 2、3、5
n = eval(input("n:"))
for i in (2, 3, 5):
    while True:
        m, r = divmod(n, i)
        if r != 0:
            break
        n = m
print(n == 1)

# 检测序列是否严格升序
tests = ('abcdeff', [1, 2, 3, 5, 4], (3, 5, 7, 9))
for seq in tests:
    for index, value in enumerate(seq[:-1]):
        if value &gt;= seq[index + 1]:
            print("false")
    print("true")</code></pre>
<p>注意：上面的升序检测每次都会输出 true，应在发现逆序后 break 或使用标志变量。</p>
<h3>蒙特卡罗法求圆周率</h3>
<pre class="code"><code>from random import random
times = eval(input("times:"))
hits = 0
for i in range(times):
    x = random()
    y = random()
    if x*x + y*y &lt;= 1:
        hits += 1
print(4.0 * hits / times)
# times=10000 → 3.1396；1000000 → 3.1419；1e8 → 3.141688；1e9 → 3.141591436</code></pre>
<h3>6174 猜想（卡普耶卡）</h3>
<p>对任意各位数字不相同的 4 位数，用各位数字组成的最大数减最小数，对差重复操作，最终会得到 6174，且操作不超过 7 次。</p>
<pre class="code"><code>from string import digits
from itertools import combinations
for item in combinations(digits, 4):
    times = 0
    while True:
        big = int(''.join(sorted(item, reverse=True)))
        little = int(''.join(sorted(item)))
        difference = big - little
        times += 1
        if difference == 6174:
            if times &gt; 7:
                print(times)
            break
        else:
            item = str(difference)</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-3-5',
      heading: '3.5 异常处理与本章小结',
      blocks: [
        {
          type: 'html',
          html: `
<p>当用户输入的不是数字时，<code>num = eval(input("请输入一个整数: "))</code> 会抛出异常并退出程序。Python 异常信息中最重要的部分是<strong>异常类型</strong>，它表明发生异常的原因，也是程序处理异常的依据。</p>
<h3>try-except 基本语法</h3>
<pre class="code"><code>try:
    num = eval(input("请输入一个整数: "))
    print(num ** 2)
except NameError:
    print("输入错误，请输入一个整数!")</code></pre>
<pre class="code"><code>try:
    &lt;语句块1&gt;
except &lt;异常类型1&gt;:
    &lt;语句块2&gt;
...
except &lt;异常类型N&gt;:
    &lt;语句块N+1&gt;
except:
    &lt;语句块N+2&gt;</code></pre>
<p>最后一个不指定类型的 except 能处理其他所有异常，与 if-elif-else 类似，是分支结构的一种表达方式。</p>
<pre class="code"><code>try:
    alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    idx = eval(input("请输入一个整数: "))
    print(alp[idx])
except NameError:
    print("输入错误，请输入一个整数!")
except:
    print("其他错误")</code></pre>
<h3>else 与 finally</h3>
<pre class="code"><code>try:
    &lt;语句块1&gt;
except &lt;异常类型1&gt;:
    &lt;语句块2&gt;
else:
    &lt;语句块3&gt;
finally:
    &lt;语句块4&gt;</code></pre>
<pre class="code"><code>try:
    alp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    idx = eval(input("请输入一个整数: "))
    print(alp[idx])
except NameError:
    print("输入错误，请输入一个整数!")
else:
    print("没有发生异常")
finally:
    print("End of program")</code></pre>
<p>正常流程执行 try → else → finally；发生异常时执行 try 中出错处 → 对应 except → finally。</p>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：程序的基本结构（顺序、分支、循环）及其应用。思考：三种基本结构的区别；break 与 continue 的区别。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck3;

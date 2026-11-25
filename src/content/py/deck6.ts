import type { DeckData } from '../types';

/** 第6章 面向对象程序设计 —— 课件 PPT/第六章 面向对象程序设计2023（39 页） */
const deck6: DeckData = {
  id: 'deck6',
  no: '第6章',
  title: '面向对象程序设计',
  subtitle: '类与对象 · self · 类成员与实例成员 · 私有成员 · 方法与特殊方法 · property · 继承与 MRO · 多态',
  lede:
    '面向对象程序设计主要针对大型软件设计提出，使软件设计更灵活，能很好地支持代码复用与设计复用，代码也具有更好的可读性与可扩展性。其关键观念是把数据以及对数据的操作封装在一起，组成相互依存、不可分割的整体——对象；对相同类型的对象分类、抽象后得到类。Python 完全支持封装、继承、多态以及对基类方法的覆盖或重写。',
  toc: [
    { id: 'sec-6-1', text: '6.1 概述', level: 2 },
    { id: 'sec-6-2', text: '6.2.1 类的定义与使用', level: 2 },
    { id: 'sec-6-3', text: '6.2.2 私有成员与公有成员', level: 2 },
    { id: 'sec-6-4', text: '6.3 方法与常用特殊方法', level: 2 },
    { id: 'sec-6-5', text: '6.4 属性（property）', level: 2 },
    { id: 'sec-6-6', text: '6.5 继承机制与 MRO', level: 2 },
    { id: 'sec-6-7', text: '6.6 多态原理与实现', level: 2 },
  ],
  sections: [
    {
      id: 'sec-6-1',
      heading: '6.1 概述',
      blocks: [
        {
          type: 'html',
          html: `
<p>面向对象程序设计（Object Oriented Programming, OOP）主要针对大型软件设计而提出，使软件设计更加灵活，能很好地支持<strong>代码复用和设计复用</strong>，并让代码具有更好的可读性和可扩展性。</p>
<ul>
<li>一条基本原则：计算机程序由多个能够起到子程序作用的单元或对象组合而成，这大大降低了软件开发的难度。</li>
<li>一个关键性观念：将数据以及对数据的操作封装在一起，组成一个相互依存、不可分割的整体，即<strong>对象</strong>；对相同类型的对象进行分类、抽象后得出共同特征，形成<strong>类</strong>。OOP 的关键就是如何合理定义和组织这些类以及类之间的关系。</li>
</ul>
<p>Python 完全采用面向对象思想，是真正面向对象的高级动态编程语言，完全支持封装、继承、多态以及对基类方法的覆盖或重写。Python 中对象的概念很广泛：数字、字符串、列表、元组、字典、集合、range 对象、zip 对象等是对象，<strong>函数也是对象，类也是对象</strong>。</p>
<p>创建类时，用变量形式表示的对象属性称为<strong>数据成员</strong>，用函数形式表示的对象行为称为<strong>成员方法</strong>，成员属性和成员方法统称为类的成员。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-2',
      heading: '6.2.1 类的定义与使用',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>class Car:
    def infor(self):
        print(" This is a car ")</code></pre>
<p>Python 用 class 关键字定义类：class 后一个空格，接着类名，然后冒号，换行并定义类的内部实现。类名首字母一般大写，也可按自己的习惯命名，但推荐参考惯例并在整个系统的设计和实现中保持风格一致。</p>
<pre class="code"><code>&gt;&gt;&gt; car = Car()
&gt;&gt;&gt; car.infor()
 This is a car
&gt;&gt;&gt; isinstance(car, Car)
True
&gt;&gt;&gt; isinstance(car, str)
False</code></pre>
<p>类定义后可以实例化对象，通过「对象名.成员」访问数据成员或成员方法；<code>isinstance()</code> 测试对象是否为某个类的实例。</p>
<p>关键字 <code>pass</code> 表示空语句，可用在类、函数定义或选择结构中：暂时没确定如何实现功能，或为以后软件升级预留空间时用它占位。</p>
<pre class="code"><code>&gt;&gt;&gt; class A:
...     pass
&gt;&gt;&gt; def demo():
...     pass
&gt;&gt;&gt; if 5 &gt; 3:
...     pass</code></pre>
<h3>self 参数</h3>
<p>类的所有实例方法都必须至少有一个名为 self 的参数，且必须是第一个形参（若有多个形参），self 代表将来要创建的对象本身。在实例方法中访问实例属性时需以 self 为前缀。外部通过对象调用方法时不需要传递这个参数；若通过类调用对象方法，则需显式为 self 传值。</p>
<pre class="code"><code>&gt;&gt;&gt; class A:
...     def __init__(hahaha, v):   # hahaha 建议写成 self
...         hahaha.value = v
...     def show(hahaha):
...         print(hahaha.value)
&gt;&gt;&gt; a = A(3)
&gt;&gt;&gt; a.show()
3</code></pre>
<h3>类成员与实例成员</h3>
<ul>
<li>属于实例的数据成员一般在构造函数 <code>__init__()</code> 中定义，定义和使用时必须以 self 为前缀；</li>
<li>属于类的数据成员在类中所有方法之外定义；</li>
<li>类外部：实例属性属于实例（对象），只能通过对象名访问；类属性属于类，可通过类名或对象名访问；</li>
<li>实例方法中可以调用该实例的其他方法，也可访问类属性与实例属性。</li>
</ul>
<pre class="code"><code>class Car:
    price = 100000                 # 类属性
    def __init__(self, c):
        self.color = c             # 实例属性

car1 = Car("Red")
car2 = Car("Blue")
print(car1.color, Car.price)       # Red 100000
Car.price = 110000                 # 修改类属性
Car.name = 'QQ'                    # 动态增加类属性
car1.color = "Yellow"              # 修改实例属性
print(car2.color, Car.price, Car.name)

import types
def setSpeed(self, s):
    self.speed = s
car1.setSpeed = types.MethodType(setSpeed, car1)   # 动态增加成员方法
car1.setSpeed(50)
print(car1.speed)</code></pre>
<p>Python 可动态为自定义类和对象增加或删除成员，这是动态类型特点的重要体现，也是其他 OOP 语言所没有的。</p>
<h3>混入（mixin）机制</h3>
<p>类型的动态性使我们可以为自定义类及其对象动态增加新的属性和行为，俗称混入机制，在大型项目开发中非常方便实用。例如系统用户分类复杂、不同用户组具有不同行为和权限且经常改变，可独立定义行为，再按需为不同用户设置能力：</p>
<pre class="code"><code>&gt;&gt;&gt; import types
&gt;&gt;&gt; class Person(object):
...     def __init__(self, name):
...         assert isinstance(name, str), 'name must be string'
...         self.name = name
&gt;&gt;&gt; def sing(self):
...     print(self.name + ' can sing.')
&gt;&gt;&gt; zhang = Person('zhang')
&gt;&gt;&gt; zhang.sing()                                  # AttributeError
&gt;&gt;&gt; zhang.sing = types.MethodType(sing, zhang)    # 动态增加行为
&gt;&gt;&gt; zhang.sing()
zhang can sing.
&gt;&gt;&gt; del zhang.sing                                 # 删除行为</code></pre>
<h3>函数与方法的区别</h3>
<p>方法一般指与特定实例绑定的函数。通过对象调用方法时，对象本身会被作为第一个参数隐式传递；普通函数不具备这个特点。</p>
<pre class="code"><code>&gt;&gt;&gt; class Demo: pass
&gt;&gt;&gt; t = Demo()
&gt;&gt;&gt; def test(self, v):
...     self.value = v
&gt;&gt;&gt; t.test = test
&gt;&gt;&gt; t.test            # &lt;function test at ...&gt; 普通函数
&gt;&gt;&gt; t.test(t, 3)      # 必须为 self 传值
&gt;&gt;&gt; t.test = types.MethodType(test, t)
&gt;&gt;&gt; t.test            # &lt;bound method test of ...&gt; 绑定的方法
&gt;&gt;&gt; t.test(5)         # 不需要为 self 传值</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-6-3',
      heading: '6.2.2 私有成员与公有成员',
      blocks: [
        {
          type: 'html',
          html: `
<p>Python 并没有对私有成员提供严格的访问保护机制。定义类成员时，如果成员名以<strong>两个下划线 __ 或更多下划线开头、且不以两个或更多下划线结束</strong>，则表示私有成员。私有成员在类外部不能直接访问，需要通过调用对象的公开成员方法访问，也可通过 Python 支持的特殊方式访问。公开成员既可在类内部访问，也可在外部程序中使用。</p>
<pre class="code"><code>&gt;&gt;&gt; class A:
...     def __init__(self, value1=0, value2=0):
...         self._value1 = value1
...         self.__value2 = value2
...     def setValue(self, value1, value2):
...         self._value1 = value1
...         self.__value2 = value2
...     def show(self):
...         print(self._value1)
...         print(self.__value2)
&gt;&gt;&gt; a = A()
&gt;&gt;&gt; a._value1
0
&gt;&gt;&gt; a._A__value2        # 在外部访问对象的私有数据成员
0</code></pre>
<p>IDLE 中在对象或类名后加一个圆点并稍等片刻，会自动列出其所有公开成员；再加一个下划线则列出包括私有成员在内的所有成员。</p>
<table class="tbl">
<thead><tr><th>命名</th><th>含义</th></tr></thead>
<tbody>
<tr><td>_xxx</td><td>受保护成员，不能用 <code>from module import *</code> 导入</td></tr>
<tr><td>__xxx__</td><td>系统定义的特殊成员</td></tr>
<tr><td>__xxx</td><td>私有成员，只有类对象自己能访问，子类对象不能直接访问；外部可通过「对象名._类名__xxx」访问</td></tr>
</tbody>
</table>
<div class="callout warn">
<p class="callout-h">Python 中不存在严格意义上的私有成员</p>
<pre class="code"><code>&gt;&gt;&gt; class Fruit:
...     def __init__(self):
...         self.__color = 'Red'
...         self.price = 1
&gt;&gt;&gt; apple = Fruit()
&gt;&gt;&gt; apple.price                # 1
&gt;&gt;&gt; apple.price = 2
&gt;&gt;&gt; print(apple.price, apple._Fruit__color)   # 2 Red
&gt;&gt;&gt; apple._Fruit__color = "Blue"
&gt;&gt;&gt; print(apple.__color)       # AttributeError</code></pre>
</div>
<p>IDLE 交互模式下，单个下划线 <code>_</code> 表示解释器中最后一次显示的内容或最后一次语句正确执行的输出结果；程序中也可用下划线表示不关心的变量值，如 <code>a, _ = divmod(60, 18)</code>。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-4',
      heading: '6.3 方法与常用特殊方法',
      blocks: [
        {
          type: 'html',
          html: `
<p>类中定义的方法可粗略分为四类：<strong>公有方法、私有方法、静态方法和类方法</strong>。</p>
<ul>
<li>私有方法名以两个下划线 __ 开始；每个对象都有自己的公有方法和私有方法，这两类方法中可访问属于类和对象的成员；</li>
<li>公有方法通过对象名直接调用；私有方法不能通过对象名直接调用，只能在属于对象的方法中通过 self 调用，或在外部通过特殊方式调用；</li>
<li>通过类名调用属于对象的公有方法时，需要显式为 self 传递一个对象名，以明确访问哪个对象的数据成员；</li>
<li>静态方法和类方法都可通过类名和对象名调用，但不能直接访问属于对象的成员，只能访问属于类的成员；</li>
<li>静态方法可以没有参数；类方法一般以 cls 作为第一个参数名，调用时不需要为该参数传值。</li>
</ul>
<pre class="code"><code>class Root:
    __total = 0
    def __init__(self, v):        # 构造方法
        self.__value = v
        Root.__total += 1
    def show(self):               # 普通实例方法
        print('self.__value:', self.__value)
        print('Root.__total:', Root.__total)
    @classmethod                  # 声明类方法
    def classShowTotal(cls):
        print(cls.__total)
    @staticmethod                 # 声明静态方法
    def staticShowTotal():
        print(Root.__total)

&gt;&gt;&gt; r = Root(3)
&gt;&gt;&gt; r.classShowTotal()      # 1，对象调用类方法
&gt;&gt;&gt; r.staticShowTotal()     # 1，对象调用静态方法
&gt;&gt;&gt; r.show()                # self.__value: 3  Root.__total: 1
&gt;&gt;&gt; rr = Root(5)
&gt;&gt;&gt; Root.classShowTotal()    # 2，类名调用类方法
&gt;&gt;&gt; Root.staticShowTotal()   # 2
&gt;&gt;&gt; Root.show()              # TypeError
&gt;&gt;&gt; Root.show(r)             # 通过类名调用实例方法时显式传对象名</code></pre>
<h3>构造函数与析构函数</h3>
<p>构造函数 <code>__init__()</code> 一般用来为数据成员设置初值或进行其他必要的初始化，在创建对象时自动调用；若未定义，Python 提供默认构造函数。析构函数 <code>__del__()</code> 一般用来释放对象占用的资源，在删除对象和收回对象空间时自动调用；若未编写，Python 提供默认析构函数做必要清理。</p>
<h3>常用特殊方法（运算符重载）</h3>
<p>Python 类有大量特殊方法，运算符重载就是通过重写特殊方法实现的。</p>
<table class="tbl">
<thead><tr><th>方法</th><th>功能说明</th></tr></thead>
<tbody>
<tr><td>__new__()</td><td>类的静态方法，用于确定是否要创建对象</td></tr>
<tr><td>__init__() / __del__()</td><td>构造方法 / 析构方法</td></tr>
<tr><td>__add__ / __sub__ / __mul__</td><td>+ / - / *</td></tr>
<tr><td>__truediv__ / __floordiv__ / __mod__ / __pow__</td><td>/ / // / % / **</td></tr>
<tr><td>__eq__ / __ne__ / __lt__ / __le__ / __gt__ / __ge__</td><td>== / != / &lt; / &lt;= / &gt; / &gt;=</td></tr>
<tr><td>__lshift__ / __rshift__ / __and__ / __or__ / __invert__ / __xor__</td><td>&lt;&lt; / &gt;&gt; / &amp; / | / ~ / ^</td></tr>
<tr><td>__iadd__ / __isub__</td><td>+= / -=，许多运算符都有对应的复合赋值版本</td></tr>
<tr><td>__pos__ / __neg__</td><td>一元 +（正号）/ 一元 -（负号）</td></tr>
<tr><td>__contains__</td><td>与 in 成员测试对应</td></tr>
<tr><td>__radd__ / __rsub__ 等</td><td>反射加法 / 反射减法：功能同普通运算但操作数顺序相反</td></tr>
<tr><td>__abs__ / __bool__ / __bytes__ / __complex__ / __dir__ / __divmod__ / __float__ / __hash__ / __int__ / __len__ / __next__ / __reduce__ / __reversed__ / __round__ / __str__ / __repr__</td><td>与同名内置函数对应；__bool__ 必须返回 True/False，__complex__ 返回复数，__float__ 返回实数，__int__ 返回整数，__str__ / __repr__ 返回 str</td></tr>
<tr><td>__getitem__ / __setitem__ / __delattr__</td><td>按索引取值 / 按索引赋值 / 删除对象指定属性</td></tr>
<tr><td>__getattr__ / __getattribute__ / __setattr__</td><td>获取属性（对应 . 运算）/ 获取属性（若同时定义，__getattr__ 不会被调用，除非显式调用或抛 AttributeError）/ 设置属性</td></tr>
<tr><td>__base__ / __class__ / __dict__ / __subclasses__()</td><td>基类 / 所属类 / 对象属性字典 / 所有子类</td></tr>
<tr><td>__call__()</td><td>包含该方法的类的实例可以像函数一样调用</td></tr>
<tr><td>__get__ / __set__ / __delete__</td><td>描述符（descriptor）：定义三者之一的类，实例一般作为其他类的属性，分别在获取、修改、删除属性时调用</td></tr>
</tbody>
</table>
`,
        },
      ],
    },
    {
      id: 'sec-6-5',
      heading: '6.4 属性（property）',
      blocks: [
        {
          type: 'html',
          html: `
<p>Python 3.x 中属性得到较完整的实现，支持更全面的保护机制。</p>
<h3>只读属性</h3>
<pre class="code"><code>&gt;&gt;&gt; class Test:
...     def __init__(self, value):
...         self.__value = value
...     @property
...     def value(self):          # 只读：方法变属性，防止属性被修改
...         return self.__value
&gt;&gt;&gt; t = Test(3)
&gt;&gt;&gt; t.value       # 3
&gt;&gt;&gt; t.value = 5   # AttributeError: can't set attribute
&gt;&gt;&gt; t.v = 5       # 动态增加新成员可以
&gt;&gt;&gt; del t.value   # AttributeError: can't delete attribute</code></pre>
<h3>可读、可写属性</h3>
<pre class="code"><code>&gt;&gt;&gt; class Test:
...     def __init__(self, value):
...         self.__value = value
...     def __get(self):
...         return self.__value
...     def __set(self, v):
...         self.__value = v
...     value = property(__get, __set)    # 可读、可写
...     def show(self):
...         print(self.__value)
&gt;&gt;&gt; t = Test(3)
&gt;&gt;&gt; t.value       # 3，允许读取
&gt;&gt;&gt; t.value = 5   # 允许修改
&gt;&gt;&gt; t.show()      # 5，私有变量同步修改
&gt;&gt;&gt; del t.value   # AttributeError: can't delete attribute</code></pre>
<h3>可读、可修改、可删除属性</h3>
<pre class="code"><code>&gt;&gt;&gt; class Test:
...     def __init__(self, value):
...         self.__value = value
...     def __get(self):
...         return self.__value
...     def __set(self, v):
...         self.__value = v
...     def __del(self):
...         del self.__value
...     value = property(__get, __set, __del)
...     def show(self):
...         print(self.__value)
&gt;&gt;&gt; t = Test(3)
&gt;&gt;&gt; t.value = 5
&gt;&gt;&gt; del t.value   # 删除属性，对应私有数据成员被删除
&gt;&gt;&gt; t.value       # AttributeError: 'Test' object has no attribute '_Test__value'
&gt;&gt;&gt; t.value = 1   # 为对象动态增加属性和对应私有数据成员
&gt;&gt;&gt; t.show()      # 1</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-6-6',
      heading: '6.5 继承机制与 MRO',
      blocks: [
        {
          type: 'html',
          html: `
<p>继承是实现代码复用和设计复用的机制，是 OOP 的重要特性之一。设计新类时，如能继承一个设计良好的已有类再二次开发，会大幅减少工作量。已有类称为<strong>父类 / 基类</strong>，新类称为<strong>子类 / 派生类</strong>。派生类可继承父类的公有成员，但不能继承私有成员。若需在派生类中调用基类方法，可用 <code>super()</code> 或「基类名.方法名()」。</p>
<pre class="code"><code>&gt;&gt;&gt; class A(object):
...     def __init__(self):
...         self.__private()
...         self.public()
...     def __private(self):
...         print('__private() method in A')
...     def public(self):
...         print('public() method in A')

&gt;&gt;&gt; class B(A):              # 没有构造方法，继承基类构造方法
...     def __private(self):   # 不会覆盖基类私有方法
...         print('__private() method in B')
...     def public(self):      # 覆盖基类公开方法
...         print('public() method in B')
&gt;&gt;&gt; b = B()
__private() method in A
public() method in B
&gt;&gt;&gt; dir(b)
['_A__private', '_B__private', '__class__', ...]</code></pre>
<p>类 B 没有构造函数，自动调用基类 A 的 <code>__init__</code>：其中 <code>self.__private()</code> 在 A 的上下文中被解析为 <code>_A__private</code>，因此输出 A 的私有方法；<code>self.public()</code> 发生多态，调用 B 覆盖后的公开方法。基类与派生类的私有方法访问方式不同（名字被改写为 _类名__方法）。</p>
<pre class="code"><code>&gt;&gt;&gt; class C(A):
...     def __init__(self):     # 显式定义构造函数
...         self.__private()     # 调用的是 C 的私有方法
...         self.public()
...     def __private(self):
...         print('__private() method in C')
...     def public(self):
...         print('public() method in C')
&gt;&gt;&gt; c = C()
__private() method in C
public() method in C
&gt;&gt;&gt; dir(c)
['_A__private', '_C__private', '__class__', ...]</code></pre>
<h3>多继承与 MRO</h3>
<p>Python 支持多继承（Multiple Inheritance）。多继承下的方法解析顺序（Method Resolution Order, MRO）：如果父类中有相同方法名，而子类中使用时未指定父类名，解释器将从左向右按顺序搜索。</p>
<p>Python 3.x 多继承树中，如果中间层某类有向上一层解析的迹象，则先把本层右侧的其他类方法解析完，再从本层最后一个解析的类方法中直接进入上一层继续解析，即在从子类到超类的反向树中按<strong>广度优先</strong>解析；若解析过程中不再有向基类上一层解析的迹象，则同一层右侧其他类方法不再解析。可用 <code>类名.mro()</code> 查看实例方法解析顺序。</p>
`,
        },
      ],
    },
    {
      id: 'sec-6-7',
      heading: '6.6 多态原理与实现',
      blocks: [
        {
          type: 'html',
          html: `
<p><strong>多态</strong>指基类的同一个方法在不同派生类对象中具有不同的表现和行为。派生类继承基类行为和属性后，还会增加某些特定行为和属性，同时也可能改变继承来的某些行为，这些都是多态的表现形式。</p>
<p>Python 大多数运算符可作用于多种不同类型的操作数，且对不同类型的操作数往往有不同表现，这本身就是多态，通过特殊方法与运算符重载实现。</p>
<pre class="code"><code>&gt;&gt;&gt; class Animal(object):
...     def show(self):
...         print('I am an animal.')
&gt;&gt;&gt; class Cat(Animal):
...     def show(self):
...         print('I am a cat.')
&gt;&gt;&gt; class Dog(Animal):
...     def show(self):
...         print('I am a dog.')
&gt;&gt;&gt; class Tiger(Animal):
...     def show(self):
...         print('I am a tiger.')
&gt;&gt;&gt; class Test(Animal):       # 没有覆盖基类方法
...     pass

&gt;&gt;&gt; x = [item() for item in (Animal, Cat, Dog, Tiger, Test)]
&gt;&gt;&gt; for item in x:
...     item.show()
I am an animal.
I am a cat.
I am a dog.
I am a tiger.
I am an animal.</code></pre>
<div class="callout key">
<p class="callout-h">本章小结</p>
<p>内容回顾：类的定义与使用；方法、属性；继承与多态。思考：根据已学的几种数据结构编写 Python 类。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck6;

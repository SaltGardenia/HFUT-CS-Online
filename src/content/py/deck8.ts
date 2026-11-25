import type { DeckData } from '../types';

/** 第8章 数据分析、科学计算与可视化（选学）—— 课件 ppt-李老师/第八章（141 页） */
const deck8: DeckData = {
  id: 'deck8',
  no: '第8章',
  title: '数据分析、科学计算与可视化',
  subtitle: 'NumPy ndarray · 广播与矩阵 · SciPy · Matplotlib 绘图 · Pandas · statistics',
  lede:
    '本章为选学内容，围绕 Python 科学计算生态展开：NumPy 提供 ndarray 多维数组与矩阵化运算，SciPy 在其之上提供特殊函数、多项式与符号计算，Matplotlib 负责二维 / 极坐标 / 散点等绘图，Pandas 提供 Series / DataFrame 数据表与清洗、统计、读写能力，statistics 则给出常用统计量的标准实现。',
  toc: [
    { id: 'sec-8-1', text: '8.1 NumPy：ndarray 与数组运算', level: 2 },
    { id: 'sec-8-2', text: '8.1 NumPy：切片、变形、广播与矩阵', level: 2 },
    { id: 'sec-8-3', text: '8.2 SciPy：特殊函数、多项式与线性方程组', level: 2 },
    { id: 'sec-8-4', text: '8.3 Matplotlib 可视化', level: 2 },
    { id: 'sec-8-5', text: '8.4 Pandas：Series 与 DataFrame', level: 2 },
    { id: 'sec-8-6', text: '8.4 Pandas：清洗、统计与文件读写', level: 2 },
  ],
  sections: [
    {
      id: 'sec-8-1',
      heading: '8.1 NumPy：ndarray 与数组运算',
      blocks: [
        {
          type: 'html',
          html: `
<p>NumPy 是专门用于矩阵化运算、科学计算的开源 Python 扩展库，把 Python 变成一种免费的、更强大的 Matlab 系统，核心是强大的 <strong>ndarray</strong>（N-dimensional array）多维数组结构。</p>
<pre class="code"><code>&gt;&gt;&gt; import numpy as np
&gt;&gt;&gt; np.array([1, 2, 3])           # 由列表创建
array([1, 2, 3])
&gt;&gt;&gt; np.arange(0, 1, 0.1)          # 等差数组
&gt;&gt;&gt; np.linspace(0, 3.14, 10)      # 等分 10 个点（含端点）
&gt;&gt;&gt; np.zeros((2, 3))              # 全 0
&gt;&gt;&gt; np.ones((2, 3))               # 全 1
&gt;&gt;&gt; np.eye(3)                     # 单位矩阵
&gt;&gt;&gt; np.random.rand(3, 4)          # [0,1) 均匀分布
&gt;&gt;&gt; np.random.randn(3, 4)         # 标准正态分布
&gt;&gt;&gt; np.random.choice(range(100), 3)
&gt;&gt;&gt; np.random.choice((1, -1), (3, 5))   # 3 行 5 列，元素为 -1 或 1
&gt;&gt;&gt; np.blackman(10)               # Blackman 窗</code></pre>
<p>ndarray 中的数据有时并非所需类型，可用 <code>astype()</code> 转为指定类型。数组与标量运算按元素进行（向量化），无需循环：</p>
<pre class="code"><code>&gt;&gt;&gt; x = np.array((1, 2, 3, 4, 5))
&gt;&gt;&gt; x + 10
array([11, 12, 13, 14, 15])
&gt;&gt;&gt; x * 2
array([ 2,  4,  6,  8, 10])
&gt;&gt;&gt; np.log(x)          # 现成的自然对数函数
&gt;&gt;&gt; np.sin(x)
&gt;&gt;&gt; np.sqrt(x)</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-8-2',
      heading: '8.1 NumPy：切片、变形、广播与矩阵',
      blocks: [
        {
          type: 'html',
          html: `
<h3>切片与索引</h3>
<pre class="code"><code>&gt;&gt;&gt; a = np.arange(10)
&gt;&gt;&gt; a[2:7:2]
&gt;&gt;&gt; a[::-1]
&gt;&gt;&gt; m = np.arange(12).reshape(3, 4)
&gt;&gt;&gt; m[1, 2]          # 第 2 行第 3 列
&gt;&gt;&gt; m[:, 1]          # 第 2 列
&gt;&gt;&gt; m[1:, 2:]        # 子矩阵</code></pre>
<h3>变形、转置与翻转</h3>
<pre class="code"><code>&gt;&gt;&gt; c = np.arange(25)
&gt;&gt;&gt; c.shape = 5, 5
&gt;&gt;&gt; c.reshape(5, 5)
&gt;&gt;&gt; c.T                     # 转置
&gt;&gt;&gt; np.transpose(c)         # 转置（函数形式）
&gt;&gt;&gt; np.flipud(c)            # 上下翻转
&gt;&gt;&gt; np.fliplr(c)            # 左右翻转</code></pre>
<h3>广播（broadcasting）</h3>
<p>形状不同的数组参与运算时，NumPy 按广播规则自动扩展：</p>
<pre class="code"><code>&gt;&gt;&gt; a = np.arange(0, 60, 10).reshape(-1, 1)   # 列向量 (6,1)
&gt;&gt;&gt; b = np.arange(0, 6)                       # 行向量 (6,)
&gt;&gt;&gt; a + b                                     # 广播为 6×6</code></pre>
<h3>矩阵运算与统计</h3>
<pre class="code"><code>&gt;&gt;&gt; a_list = [3, 5, 7]
&gt;&gt;&gt; a_mat = np.matrix(a_list)
&gt;&gt;&gt; a_mat * a_mat.T          # 矩阵乘法
&gt;&gt;&gt; np.dot(A, B)             # 点积 / 矩阵乘
&gt;&gt;&gt; np.cov([1, 1, 1, 1, 1])  # 协方差 array(0.0)
&gt;&gt;&gt; x = [-2.1, -1, 4.3]
&gt;&gt;&gt; np.var(x), np.std(x), np.cov(x)
&gt;&gt;&gt; a = np.array([[3, 1], [1, 2]])
&gt;&gt;&gt; b = np.array([9, 8])
&gt;&gt;&gt; np.linalg.solve(a, b)    # 解线性方程组 ax = b</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-8-3',
      heading: '8.2 SciPy：特殊函数、多项式与线性方程组',
      blocks: [
        {
          type: 'html',
          html: `
<p>SciPy 建立在 NumPy 之上。special 模块包含大量函数库，包括基本数学函数、特殊函数以及 NumPy 中的所有函数：</p>
<pre class="code"><code>&gt;&gt;&gt; from scipy import special as S
&gt;&gt;&gt; S.cbrt(8)          # 立方根 2.0
&gt;&gt;&gt; S.exp10(3)         # 1000.0
&gt;&gt;&gt; S.sindg(30)        # 0.5（角度制正弦）</code></pre>
<h3>多项式计算</h3>
<pre class="code"><code>&gt;&gt;&gt; from scipy import poly1d
&gt;&gt;&gt; p1 = poly1d([1, 2, 3, 4])   # x³ + 2x² + 3x + 4
&gt;&gt;&gt; print(p1)
   3     2
1 x + 2 x + 3 x + 4
&gt;&gt;&gt; p1(2)                      # 求值
&gt;&gt;&gt; p1.deriv()                 # 求导
&gt;&gt;&gt; p1.integ()                 # 积分
&gt;&gt;&gt; p1 + p2 / p1 - 5           # 多项式加减乘除</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-8-4',
      heading: '8.3 Matplotlib 可视化',
      blocks: [
        {
          type: 'html',
          html: `
<pre class="code"><code>import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 500)
y = np.sin(x)
plt.plot(x, y)
plt.xlabel('x'); plt.ylabel('sin(x)'); plt.title('y = sin(x)')
plt.show()

a = np.arange(0, 2.0 * np.pi, 0.1)
b = np.cos(a)
plt.scatter(a, b)          # 散点图
plt.show()</code></pre>
<h3>极坐标雷达图</h3>
<pre class="code"><code>angles = np.linspace(0, 2 * np.pi, 6, endpoint=False)
scores = [4, 3, 5, 2, 4, 5]
plt.polar(angles,       # 角度
          scores,       # 各角度上的数据
          'rv--')       # 颜色、线型和端点符号
plt.show()</code></pre>
<p>常用图形：折线 <code>plot</code>、散点 <code>scatter</code>、柱状 <code>bar</code>、饼图 <code>pie</code>、极坐标 <code>polar</code>；可用 <code>xlabel / ylabel / title / legend / grid</code> 等完善图面。</p>
`,
        },
      ],
    },
    {
      id: 'sec-8-5',
      heading: '8.4 Pandas：Series 与 DataFrame',
      blocks: [
        {
          type: 'html',
          html: `
<p>Pandas 提供 Series（带索引的一维数组）与 DataFrame（带行 / 列索引的二维表）。</p>
<pre class="code"><code>&gt;&gt;&gt; import pandas as pd
&gt;&gt;&gt; s = pd.Series([1, 2, 3, 4], index=['a', 'b', 'c', 'd'])
&gt;&gt;&gt; df = pd.DataFrame({'A': np.random.randint(1, 100, 4),
...                    'B': pd.date_range(start='20220101', periods=4, freq='D'),
...                    'C': pd.Series([1, 2, 3, 4], index=['zha', 'li', 'wang', 'zhou'])})
&gt;&gt;&gt; pd.date_range(start='20220101', end='20221231', freq='H')   # 小时级索引</code></pre>
<h3>查看与索引</h3>
<pre class="code"><code>&gt;&gt;&gt; df.index, df.columns
&gt;&gt;&gt; df.values
&gt;&gt;&gt; df.head(3), df.tail(3)
&gt;&gt;&gt; df.sort_index(axis=0, ascending=False)   # 按轴排序
&gt;&gt;&gt; df.sort_values(by='A')
&gt;&gt;&gt; df.loc['li']            # 标签索引
&gt;&gt;&gt; df.iloc[0:3, 0:4]       # 位置索引：前 3 行、前 4 列</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-8-6',
      heading: '8.4 Pandas：清洗、统计与文件读写',
      blocks: [
        {
          type: 'html',
          html: `
<h3>缺失值、重复值与映射</h3>
<pre class="code"><code>&gt;&gt;&gt; df.isnull()               # 缺失值检测
&gt;&gt;&gt; df.dropna()              # 删除含缺失值的行
&gt;&gt;&gt; df.fillna(0)             # 填充缺失值

&gt;&gt;&gt; data = pd.DataFrame({'k1': ['one'] * 3 + ['two'] * 4,
...                      'k2': [1, 1, 2, 3, 3, 4, 4]})
&gt;&gt;&gt; data.duplicated()        # 重复行检测
&gt;&gt;&gt; data.drop_duplicates()

&gt;&gt;&gt; data['k1'] = data['k1'].map(str.upper)   # 使用函数映射
&gt;&gt;&gt; data.replace(1, 100)                     # 值替换</code></pre>
<h3>统计与频次</h3>
<pre class="code"><code>&gt;&gt;&gt; pd.value_counts([1, 1, 3, 3, 3, 3, 2, 1])
3    4
1    3
2    1
&gt;&gt;&gt; df.describe()
&gt;&gt;&gt; df.mean(), df.sum(), df.count()
&gt;&gt;&gt; df.shift(1)             # 移位
&gt;&gt;&gt; df.diff()</code></pre>
<h3>结合 Matplotlib 绘图与文件读写</h3>
<pre class="code"><code>&gt;&gt;&gt; df.plot()               # 直接由 DataFrame 绘图
&gt;&gt;&gt; df.to_excel('d:\\test.xlsx', sheet_name='dfg')
&gt;&gt;&gt; df = pd.read_excel('d:\\test.xlsx', 'dfg', index_col=None, na_values=['NA'])
&gt;&gt;&gt; df.to_csv('d:\\test.csv')
&gt;&gt;&gt; pd.read_csv('d:\\test.csv')</code></pre>
<h3>statistics 模块</h3>
<pre class="code"><code>&gt;&gt;&gt; import statistics
&gt;&gt;&gt; statistics.mode([1, 3, 5, 7])
statistics.StatisticsError: no unique mode; found ...
&gt;&gt;&gt; statistics.mean([1, 2, 3, 4])
&gt;&gt;&gt; statistics.median([1, 3, 5])
&gt;&gt;&gt; statistics.stdev([1, 2, 3, 4])</code></pre>
`,
        },
      ],
    },
  ],
};

export default deck8;

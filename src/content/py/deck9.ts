import type { DeckData } from '../types';

/** 第9章 图像库的使用（选学）—— 课件 ppt-李老师/第九章 图像库的使用（30 页） */
const deck9: DeckData = {
  id: 'deck9',
  no: '第9章',
  title: '图像库的使用',
  subtitle: 'Turtle 绘图 · PIL / Image 图像处理 · Tkinter 图形界面',
  lede:
    '本章为选学内容，介绍三类常用图形库：Turtle 以「海龟在坐标系中爬行」的方式绘图，适合入门与算法可视化；PIL（Pillow）支持图像打开、保存、缩放、旋转、通道分离与合成等处理；Tkinter 是标准库中的跨平台 GUI 工具包，通过 widget、layout、event 三要素搭建桌面应用。',
  toc: [
    { id: 'sec-9-1', text: '9.1 Turtle 绘图', level: 2 },
    { id: 'sec-9-2', text: '9.2 PIL / Image 图像处理', level: 2 },
    { id: 'sec-9-3', text: '9.3 Tkinter 图形界面', level: 2 },
  ],
  sections: [
    {
      id: 'sec-9-1',
      heading: '9.1 Turtle 绘图',
      blocks: [
        {
          type: 'html',
          html: `
<p><code>import turtle</code> 引入 Turtle 库（Python 流行的绘图函数库）。想象一只小乌龟从坐标系原点 (0,0) 出发，根据一组函数指令在平面内移动，在爬行路径上绘制图形。</p>
<p><code>turtle.setup(width, height, startx, starty)</code> 启动图形窗口，四个参数分别为宽、高、起点 x、起点 y。屏幕坐标系以左上角为原点，向右为 x、向下为 y。</p>
<h3>蟒蛇绘制程序</h3>
<pre class="code"><code>import turtle
import time

def drawSnake(rad, angle, len, neckrad):
    for i in range(len):
        turtle.circle(rad, angle)      # 画圆：rad 半径，angle 弧度
        turtle.circle(-rad, angle)     # 负半径：圆心在右侧
    turtle.circle(rad, angle / 2)
    turtle.forward(rad)                # 直线爬行
    time.sleep(2)
    turtle.circle(neckrad + 1, 180)
    time.sleep(1)
    turtle.fd(rad * 1 / 3)

def main():
    turtle.setup(1300, 800, 200, 200)
    pythonsize = 10
    turtle.pensize(pythonsize)         # 笔宽
    turtle.pencolor("blue")            # 笔色，支持 RGB / 十六进制
    turtle.seth(-40)                   # 起始方向
    drawSnake(40, 80, 5, pythonsize / 2)
    turtle.done()

main()</code></pre>
<ul>
<li><code>pensize()</code>：运动轨迹宽度；<code>pencolor()</code>：轨迹颜色，Turtle 采用 RGB 定义颜色；</li>
<li><code>seth(angle)</code>：启动方向，0 向东、90 向北、180 向西、270 向南，负值表示相反方向；</li>
<li><code>circle(rad, angle)</code>：沿圆形爬行，半径在该方向左侧 rad 处，rad 为负则在右侧，angle 为弧度值；</li>
<li><code>fd()</code> / <code>forward()</code>：向前直线爬行，参数为距离；</li>
<li><code>colormode(mode)</code>：切换颜色模式，默认 RGB 小数值 1.0，可切换为整数值 255。</li>
</ul>
<p>函数分为三类：方向控制函数、运动控制函数、画笔控制函数。海龟角度体系只分左转、右转两种情况。</p>
<h3>五角星与同心圆</h3>
<pre class="code"><code>import turtle, time
turtle.pensize(5)
turtle.pencolor("yellow")
turtle.fillcolor("red")
turtle.begin_fill()
for _ in range(5):
    turtle.forward(200)
    turtle.right(144)
turtle.end_fill()
turtle.penup()
time.sleep(2)
turtle.done()

import turtle, random
turtle.color("red")
turtle.begin_fill()
turtle.circle(50)
turtle.end_fill()
color = ['blue', 'yellow', 'pink', 'black']
for i in range(4):
    turtle.color(random.sample(color, 1))
    turtle.begin_fill()
    turtle.right(90)
    turtle.penup()
    turtle.fd(-10)
    turtle.seth(0)
    turtle.pendown()
    turtle.circle(40 - i * 10)
    turtle.end_fill()
turtle.hideturtle()
turtle.done()</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-9-2',
      heading: '9.2 PIL / Image 图像处理',
      blocks: [
        {
          type: 'html',
          html: `
<p>PIL（Python Image Library）是第三方图像库，需通过 pip 安装：<code>pip install pillow</code>。它支持图像存储、显示与处理，能处理几乎所有图片格式，可完成缩放、剪裁、叠加以及添加线条、图像和文字等操作。</p>
<ul>
<li>图像归档：批处理、生成预览、格式转换；</li>
<li>图像处理：基本处理、像素处理、颜色处理。</li>
</ul>
<table class="tbl">
<thead><tr><th>方法</th><th>描述</th></tr></thead>
<tbody>
<tr><td>Image.open(filename)</td><td>根据参数加载图像文件</td></tr>
<tr><td>Image.new(mode, size, color)</td><td>根据给定参数创建新图像</td></tr>
<tr><td>Image.open(StringIO.StringIO(buffer))</td><td>从字符串中获取图像</td></tr>
<tr><td>Image.frombytes(mode, size, data)</td><td>根据像素点 data 创建图像</td></tr>
<tr><td>Image.verify()</td><td>检查图像文件完整性，返回异常</td></tr>
</tbody>
</table>
<h3>Image 对象属性</h3>
<table class="tbl">
<thead><tr><th>属性</th><th>描述</th></tr></thead>
<tbody>
<tr><td>Image.format</td><td>图像格式或来源；不是从文件读取时为 None</td></tr>
<tr><td>Image.mode</td><td>色彩模式："L" 灰度、"RGB" 真彩色、"CMYK" 出版图像</td></tr>
<tr><td>Image.size</td><td>宽、高（像素），返回二元元组</td></tr>
<tr><td>Image.palette</td><td>调色板属性，返回 ImagePalette 类型</td></tr>
</tbody>
</table>
<pre class="code"><code>&gt;&gt;&gt; from PIL import Image
&gt;&gt;&gt; im = Image.open("D:\\\\hfut70.jpg")
&gt;&gt;&gt; im.format, im.mode, im.size
&gt;&gt;&gt; im.save('out.png', 'PNG')
&gt;&gt;&gt; im.convert('L')              # 转灰度
&gt;&gt;&gt; im.thumbnail((128, 128))     # 缩略图
&gt;&gt;&gt; im.resize((200, 100))        # 缩放，生成副本
&gt;&gt;&gt; im.rotate(45)                # 逆时针旋转 45°，生成副本</code></pre>
<h3>GIF 逐帧提取</h3>
<pre class="code"><code>from PIL import Image
im = Image.open('pybit.gif')
try:
    im.save('picframe{:02d}.png'.format(im.tell()))
    while True:
        im.seek(im.tell() + 1)
        im.save('picframe{:02d}.png'.format(im.tell()))
except:
    print("处理结束")</code></pre>
<h3>像素运算与通道</h3>
<table class="tbl">
<thead><tr><th>方法</th><th>描述</th></tr></thead>
<tbody>
<tr><td>Image.point(func)</td><td>对每个像素元素按 func 运算，返回图像副本</td></tr>
<tr><td>Image.split()</td><td>提取 RGB 图像的各颜色通道，返回图像副本</td></tr>
<tr><td>Image.merge(mode, bands)</td><td>按 mode 色彩合并通道，bands 是新色彩通道</td></tr>
<tr><td>Image.blend(im1, im2, alpha)</td><td>按 im1*(1.0-alpha) + im2*alpha 插值生成新图像</td></tr>
</tbody>
</table>
<pre class="code"><code># 颜色交换：BGR
from PIL import Image
im = Image.open('dream.jpg')
r, g, b = im.split()
om = Image.merge("RGB", (b, g, r))
om.save('dreamBGR.jpg')

# 按 alpha 混合两张图
from PIL import Image
im1 = Image.open('a.jpg')
im2 = Image.open('b.jpg')
Image.blend(im1, im2, 0.3).save('blend.jpg')</code></pre>
`,
        },
      ],
    },
    {
      id: 'sec-9-3',
      heading: '9.3 Tkinter 图形界面',
      blocks: [
        {
          type: 'html',
          html: `
<p>Tkinter 是 Python 标准库，对 Tcl/Tk 进一步封装，与 tkinter.ttk、tkinter.tix 共同提供跨平台 GUI 编程功能。tkinter.ttk 提供 Combobox、Progressbar、Treeview 等组件；tkinter.scrolledtext 提供带滚动条的文本框；messagebox、commondialog、dialog、colorchooser、simpledialog、filedialog 等模块提供各种对话框。</p>
<p>GUI 编程三要素：<strong>widget（部件）、layout（布局）、event（事件的响应）</strong>。</p>
<table class="tbl">
<thead><tr><th>组件</th><th>说明</th></tr></thead>
<tbody>
<tr><td>Button</td><td>按钮</td></tr>
<tr><td>Canvas</td><td>画布，绘制直线、椭圆、多边形等</td></tr>
<tr><td>Checkbutton</td><td>复选框形式的按钮</td></tr>
<tr><td>Entry</td><td>单行文本框</td></tr>
<tr><td>Frame</td><td>框架，作为其他组件的容器，常用于分组</td></tr>
<tr><td>Label</td><td>标签，显示单行文本</td></tr>
<tr><td>Listbox</td><td>列表框</td></tr>
<tr><td>Menu</td><td>菜单</td></tr>
<tr><td>Message</td><td>多行文本框</td></tr>
<tr><td>Radiobutton</td><td>单选钮，同组中任意时刻只能一个被选中</td></tr>
<tr><td>Scrollbar</td><td>滚动条</td></tr>
<tr><td>Toplevel</td><td>创建新窗口</td></tr>
</tbody>
</table>
<h3>开发基本步骤</h3>
<ol>
<li>编写通用代码，例如数据库操作；</li>
<li>搭建界面、放置组件、设置组件属性（可借助 PAGE）；</li>
<li>编写组件的事件处理代码；</li>
<li>启动应用程序，启动消息主循环。</li>
</ol>
<pre class="code"><code># 根据需要导入模块
import tkinter
import tkinter.ttk
import tkinter.messagebox
import tkinter.simpledialog

# 创建应用程序主窗口
root = tkinter.Tk()
# 设置窗口属性
root.title('示例')
root.geometry('400x300')
# 创建组件与事件代码
tkinter.Label(root, text='Hello Tkinter').pack()
tkinter.Button(root, text='确定', command=root.destroy).pack()
# 启动消息主循环
root.mainloop()</code></pre>
<p>课件示例：用 Tkinter 实现抽奖式提问程序与计算器程序——核心都是「组件布局 + 按钮 command 回调 + 主循环」。</p>
<div class="callout key">
<p class="callout-h">选学章节说明</p>
<p>本章课件为李老师 2022 版第 9 章，覆盖 Turtle、PIL、Tkinter 三个库；与第 8 章同属课程大纲中的选学内容，重在动手实践，考试不作重点要求。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck9;

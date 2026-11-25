/* Python 程序设计课程配置：数据注入共享 CourseShell，页面与版式由上游组件统一提供 */
import type { CourseConfig } from '../course-types';
import { pyDecks } from './index';

export const pyConfig: CourseConfig = {
  name: 'Python程序设计',
  base: '/py',
  deckKey: 'py',
  tip: 'Python 语言与系统设计 · 九章课件（含选学）+ 实验资料',
  source: '九章课件精讲（第 1～7 章主干 + 第 8～9 章选学）· 试题为上机练习代码，未设在线练习',
  chapters: pyDecks,
  papers: [],
  storeKey: 'py-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '简答题' },
  tagSections: {},
  lede:
    '合肥工业大学「Python 语言与系统设计」课程资料整理。教材：董付国《Python 程序设计》（第 2 / 3 版），清华大学出版社。' +
    '课件按章整理为 9 章：第 1～7 章为课程主干（基础、序列、控制结构、字符串与正则、函数、面向对象、文件操作），' +
    '第 8～9 章为选学拓展（数据分析与可视化、图像库与 GUI）。课程另有 3 次实验与综合设计实验。',
  introCards: [
    { title: '课程信息', body: '专业选修课 · 第三学期 · 24 理论 + 8 实践学时 / 2 学分 · 面向计算机科学与技术专业。' },
    { title: '教材与参考', body: '董付国《Python 程序设计》（第 2 / 3 版），清华大学出版社；官方文档 docs.python.org。' },
    {
      title: '教学内容',
      body: '第 1～7 章：概述、序列、控制结构、字符串与正则、函数、面向对象、文件操作；第 8～9 章选学：NumPy/SciPy/Matplotlib/Pandas、Turtle/PIL/Tkinter。',
    },
    { title: '实验与考核', body: '3 次实验（序列 / 控制结构与文件 / 综合设计）；课堂测试 20% + 期末 40% + 实验报告 20% + 设计报告 20%。' },
  ],
  chapterBlurbs: {
    deck1: '语言特点 · 安装启动 · 对象模型与变量 · 数字与字符串 · 运算符 · 内置函数 · 代码规范',
    deck2: '列表 / 元组 / 字典 / 集合 · 切片与推导式 · 堆 / 队列 / 栈 / 二叉树 / 图',
    deck3: '顺序 / 分支 / 循环 · 条件表达式 · 循环优化 · 经典案例 · try-except',
    deck4: '编码与驻留 · 三种格式化 · 常用字符串方法 · jieba 分词 · 正则语法与 re 模块',
    deck5: '定义与递归 · 形参实参 · 五类参数 · return 与 LEGB · lambda · map/filter/reduce',
    deck6: '类与对象 · self · 成员与私有成员 · 方法与特殊方法 · property · 继承 / MRO · 多态',
    deck7: '文本 / 二进制文件 · 文件指针 · CSV / JSON · pickle / struct / shelve · os / shutil',
    deck8: 'NumPy ndarray 与广播 · SciPy · Matplotlib · Pandas · statistics（选学）',
    deck9: 'Turtle 绘图 · PIL 图像处理 · Tkinter 图形界面（选学）',
  },
  suggestions: ['列表', '切片', '正则', '函数', '文件'],
};

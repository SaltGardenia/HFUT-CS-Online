import type { CourseConfig } from '../course-types';
import { asmDecks } from './index';
import paper from './paper-final';

export const asmConfig: CourseConfig = {
  name: '汇编语言程序设计',
  base: '/asm',
  deckKey: 'asm',
  tip: '汇编语言程序设计 · 8086 指令系统与程序设计',
  source: '六章课件精讲（80x86 基础 / 指令 / 程序格式 / 基本设计 / 子程序与宏 / 中断）· 1 份期末真题在线练习',
  chapters: asmDecks,
  papers: [paper],
  storeKey: 'asm-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '简答题' },
  tagSections: {
    1: { 'sec-1-1': '数制与补码', 'sec-1-2': '寄存器', 'sec-1-3': '存储器与物理地址', 'sec-1-4': '堆栈与标志' },
    2: { 'sec-2-1': '寻址方式', 'sec-2-2': '数据传送', 'sec-2-3': '算术运算', 'sec-2-4': '逻辑移位与串操作', 'sec-2-5': '控制转移' },
    3: { 'sec-3-1': '语句格式', 'sec-3-2': '段定义', 'sec-3-3': '数据定义', 'sec-3-4': '完整程序' },
    4: { 'sec-4-1': '顺序', 'sec-4-2': '分支', 'sec-4-3': '循环', 'sec-4-4': '数组与字符串' },
    5: { 'sec-5-1': '子程序', 'sec-5-2': '参数与现场', 'sec-5-3': '宏', 'sec-5-4': '重复与条件汇编' },
    6: { 'sec-6-1': '模块化', 'sec-6-2': '中断与 DOS 调用', 'sec-6-3': '32 位与混编', 'sec-6-4': 'DEBUG' },
  },
  lede:
    '汇编语言是面向 8086 处理器的低级语言，直接操作寄存器、存储器与标志位。课件为徐娟老师 6 章讲义：基础知识、8086 指令系统、汇编语言程序格式、基本程序设计、子程序与宏、高级汇编与模块化。期末真题含选择题、判断题与简答题。',
  introCards: [
    { title: '课程定位', body: '计算机系统能力的基础课：理解指令如何在硬件上执行，为组成原理、操作系统、编译原理打底。' },
    { title: '核心内容', body: '数制与补码、寄存器与存储器、七种寻址方式、六类指令、三种基本结构、子程序与宏、中断。' },
    { title: '上机环境', body: 'DOSBox + MASM / DEBUG；也可用 EMU8086 等模拟器。' },
    { title: '资料构成', body: '课件 22 份（新版 CHAP 1～5 PDF + 旧版 PPT 全套 + 期末复习 PPT）；试题 1 份（汇编真题）。' },
  ],
  chapterBlurbs: {
    deck1: '数制与编码 · 8086 结构 · 寄存器 · 物理地址 · 堆栈与标志',
    deck2: '七种寻址 · 传送 / 算术 / 逻辑 / 串 / 转移指令',
    deck3: '语句格式 · 段定义 · 数据定义伪指令 · 完整程序',
    deck4: '顺序 · 分支 · 循环 · 数组与字符串处理',
    deck5: '子程序 · 参数传递 · 现场保护 · 宏定义与展开',
    deck6: '模块化 · 中断与 DOS 调用 · 32 位指令 · DEBUG',
  },
  suggestions: ['寻址方式', '补码', '堆栈', '宏', '中断向量'],
};

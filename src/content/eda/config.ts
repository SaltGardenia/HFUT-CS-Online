import type { CourseConfig } from '../course-types';
import { edaDecks } from './index';
import paper from './paper-final';

export const edaConfig: CourseConfig = {
  name: 'EDA实训',
  base: '/eda',
  deckKey: 'eda',
  tip: 'EDA 实训 · Altium Designer 原理图与 PCB 设计',
  source: 'EDA 与 PCB 设计实训课件 · Verilog / FPGA 期末复习题在线练习',
  chapters: edaDecks,
  papers: [paper],
  storeKey: 'eda-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '简答题' },
  tagSections: {
    1: { 'sec-1-1': 'AD 与 PCB 基础', 'sec-1-2': '原理图设计', 'sec-1-3': 'PCB 设计流程', 'sec-1-4': '布局走线与封装', 'sec-1-5': '电路仿真' },
  },
  lede:
    'EDA 实训以 Altium Designer 为平台，完成电路原理图设计、网络表生成、PCB 板图设计、规则检查与制板的完整流程。课件为《EDA 实训学习参考资料 02——EDA 相关知识介绍》，共 79 页；试题目录为 Verilog / FPGA 期末复习题。',
  introCards: [
    { title: '实训目标', body: '掌握 AD 的原理图绘制、元件封装与 PCB 设计流程，能独立完成一块单面板 / 双面板的设计与检查。' },
    { title: '核心工具', body: 'Altium Designer（兼容 Protel 各版本）；辅助工具：Quartus（Verilog / FPGA 部分）。' },
    { title: '交付物', body: '原理图（.SchDoc）、网络表（.Net）、PCB 板图（.PcbDoc）、规则检查报告（.html）与实物板。' },
    { title: '资料构成', body: '课件 1 份（79 页）；试题 3 份（Verilog-HDL 复习题 PDF ×2、FPGA 复习题 DOCX）；附件含任务书、报告模板与元件库。' },
  ],
  chapterBlurbs: {
    deck1: 'AD 软件与 PCB 基础 · 原理图设计 · PCB 流程 · 布局走线与封装 · 电路仿真',
  },
  suggestions: ['封装', '网络表', 'Keep-Out', '飞线', '规则检查'],
};

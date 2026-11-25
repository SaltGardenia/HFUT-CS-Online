import type { CourseConfig } from '../course-types';
import { physlabDecks } from './index';

export const physlabConfig: CourseConfig = {
  name: '大学物理实验',
  base: '/physlab',
  deckKey: 'physlab',
  tip: '大学物理实验 · 声速测量与静电场测绘',
  source: '声速测量 / 静电场实验课件 · 期末试卷为扫描件，未设在线练习',
  chapters: physlabDecks,
  papers: [],
  storeKey: 'physlab-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '简答题' },
  tagSections: {
    1: { 'sec-1-1': '目的与原理', 'sec-1-2': '驻波法', 'sec-1-3': '相位比较法', 'sec-1-4': '实验内容与数据处理' },
    2: { 'sec-2-1': '目的与模拟法', 'sec-2-2': '静电场与电流场', 'sec-2-3': '实验内容', 'sec-2-4': '数据处理与注意事项' },
  },
  lede:
    '大学物理实验（下）资料整理。课件含两个实验：声速的测量（共振干涉法 / 相位比较法）与静电场的模拟测绘（稳恒电流场模拟同轴圆柱静电场）。期末试卷为扫描件，未做文字转录，因此本课程页不设在线练习。',
  introCards: [
    { title: '课程性质', body: '大学物理配套实验课，强调实验原理、仪器操作、数据记录与误差分析。' },
    { title: '本批实验', body: '声速的测量（压电换能器、驻波法、李萨如图）；静电场的模拟测绘（等位线、电力线、最小二乘）。' },
    { title: '实验报告', body: '含实验目的、原理、仪器、步骤、原始数据、数据处理（逐差法 / 最小二乘）、误差分析与结论。' },
    { title: '资料构成', body: '课件 2 份（声速 23 页、静电场 16 页）；试题 3 份（均为扫描 PDF，无文字层）；附件含实验指导与报告。' },
  ],
  chapterBlurbs: {
    deck1: '压电换能器 · 驻波法 · 相位比较法 · 逐差法处理数据',
    deck2: '模拟法 · 同轴圆柱电场 · 等位线与电力线 · 最小二乘法',
  },
  suggestions: ['驻波', '李萨如', '逐差法', '等位线', '最小二乘'],
};

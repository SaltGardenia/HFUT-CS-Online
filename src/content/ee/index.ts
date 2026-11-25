/** 电路与电子技术基础课程内容汇总：电路部分 6 章 + 模拟电子部分 9 章 + 1 份期末试卷 */
import type { CourseChapter, CourseQuizKind } from '../course-types';
import { c1, c2, c3, c4, c5, c6 } from './circuit';
import { c7, c8, c9, c10, c11 } from './analog1';
import { c12, c13, c14, c15 } from './analog2';
import paper from './papers';

export const eeChapters: CourseChapter[] = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15];

export const eePapers = [paper];

export const EE_KIND_LABEL: Record<CourseQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '计算',
};

/** 知识点标签目标：章序号 → { section id: 显示名 } */
export const EE_SECTIONS: Record<number, Record<string, string>> = {
  1: {
    'sec-ee1-model': '电路与电路模型',
    'sec-ee1-var': '电路的基本变量',
    'sec-ee1-kcl': '基尔霍夫定律',
  },
  2: {
    'sec-ee2-concept': '等效电路的概念',
    'sec-ee2-res': '电阻的等效变换',
    'sec-ee2-source': '电源的等效变换',
  },
  3: {
    'sec-ee3-graph': '电路的图与独立方程',
    'sec-ee3-branch': '支路电流法',
    'sec-ee3-node': '节点电压法',
    'sec-ee3-loop': '回路电流法',
  },
  4: {
    'sec-ee4-super': '叠加定理',
    'sec-ee4-sub': '替代定理',
    'sec-ee4-thevenin': '戴维南与诺顿定理',
    'sec-ee4-power': '最大功率传输定理',
  },
  5: {
    'sec-ee5-element': '动态元件',
    'sec-ee5-switch': '换路定律与初始值',
    'sec-ee5-first': '一阶电路的响应',
    'sec-ee5-second': '二阶电路简介',
  },
  6: {
    'sec-ee6-phasor': '正弦量与相量',
    'sec-ee6-impedance': '阻抗与导纳',
    'sec-ee6-power': '正弦稳态功率',
    'sec-ee6-resonance': '谐振与三相电路',
  },
  7: {
    'sec-ee7-signal': '信号与频谱',
    'sec-ee7-model': '放大电路模型',
    'sec-ee7-index': '放大电路的主要性能指标',
  },
  8: {
    'sec-ee8-ideal': '集成运放与理想运放',
    'sec-ee8-basic': '基本线性运放电路',
    'sec-ee8-app': '加减与积分微分电路',
  },
  9: {
    'sec-ee9-semi': '半导体与 PN 结',
    'sec-ee9-diode': '二极管及其模型',
    'sec-ee9-circuit': '二极管基本电路',
    'sec-ee9-special': '特殊二极管',
  },
  10: {
    'sec-ee10-mosfet': 'MOSFET 的结构与特性',
    'sec-ee10-cs': '共源极放大电路',
    'sec-ee10-analysis': '图解与小信号分析',
    'sec-ee10-other': '共漏与共栅电路',
  },
  11: {
    'sec-ee11-bjt': 'BJT 的结构与工作原理',
    'sec-ee11-ce': '共射极放大电路',
    'sec-ee11-cc': '共集与共基电路',
    'sec-ee11-compare': '三种组态比较与多级放大',
  },
  12: {
    'sec-ee12-current': '直流偏置与电流源',
    'sec-ee12-diff': '差分式放大电路',
    'sec-ee12-opamp': '集成运放电路与参数',
  },
  13: {
    'sec-ee13-concept': '反馈的基本概念与分类',
    'sec-ee13-gain': '负反馈增益的一般表达式',
    'sec-ee13-effect': '负反馈对性能的影响',
    'sec-ee13-stable': '深度负反馈与稳定性',
  },
  14: {
    'sec-ee14-basic': '功率放大电路的一般问题',
    'sec-ee14-class': '甲类、乙类与甲乙类',
    'sec-ee14-d': 'D 类功放与功率管',
  },
  15: {
    'sec-ee15-compose': '直流电源的组成',
    'sec-ee15-rect': '整流与滤波',
    'sec-ee15-reg': '稳压电路',
  },
};

export * from './types';

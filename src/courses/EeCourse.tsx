import CourseShell from '../components/course/CourseShell';
import type { CourseConfig } from '../content/course-types';
import { EE_BASE } from './registry';
import { eeChapters, eePapers, EE_KIND_LABEL, EE_SECTIONS } from '../content/ee';

/** 电路与电子技术基础课程配置：电路 6 章 + 模电 9 章，顶栏按「电路部分 / 模电部分」分组 */
const config: CourseConfig = {
  name: '电路与电子技术基础',
  base: EE_BASE,
  deckKey: 'ee',
  tip: '电路与电子技术基础 · 电路 6 章 + 模电 9 章',
  source: '十五章课件精讲（电路 6 章 + 模电 9 章）· 1 份期末试卷在线练习',
  chapters: eeChapters,
  papers: eePapers,
  storeKey: 'ee-practice-progress-v1',
  kindLabel: EE_KIND_LABEL,
  tagSections: EE_SECTIONS,
  units: [
    {
      label: '电路部分',
      tip: '电路分析：基本概念、等效变换、分析方法、基本定理、动态电路、正弦稳态',
      chapterIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
    },
    {
      label: '模电部分',
      tip: '模拟电子：绪论、运放、二极管、场效应管、BJT、模拟集成电路、反馈、功放、直流电源',
      chapterIds: ['c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15'],
    },
  ],
  singlePaperDirect: true,
  lede: `
    <p>依据课程课件整理：<strong>电路部分</strong>（第 1～6 章）讨论电路模型、等效变换、基本分析方法、基本定理、动态电路与正弦稳态；
    <strong>模拟电子部分</strong>（第 7～15 章）讨论信号与放大、运算放大器、二极管、场效应管、BJT、模拟集成电路、反馈、功率放大与直流电源。
    另收录 1 份期末试卷的在线练习。</p>
  `,
  introCards: [
    {
      title: '课件范围',
      body: '电路部分 6 章依据「电路部分/PPT-新」的 PDF/PPTX；模拟电子部分 9 章依据「模电部分/PPT-新」的 ch01～ch11。章节较多，顶栏按「电路部分 / 模电部分」两个单元分组，悬停展开具体章节。',
    },
    {
      title: '资料构成',
      body: '讲义内容来自课件文件夹的演示文稿，覆盖各章目录的主要知识点；练习来自试题文件夹的 2019-2020 学年期末试卷（A），客观题答案由本站整理，配图计算题标注为纸笔作答。',
    },
  ],
  chapterBlurbs: {
    c1: '电路模型、电流电压参考方向与功率、R/L/C 与独立源、KCL 与 KVL。',
    c2: '等效的概念；电阻串并联与 Y-Δ 变换；实际电源模型的等效互换；受控源。',
    c3: '电路的图与独立方程；支路电流法、节点电压法、回路（网孔）电流法。',
    c4: '叠加定理、替代定理、戴维南/诺顿定理、最大功率传输定理。',
    c5: '电容电感与换路定律；一阶电路零输入/零状态/全响应与三要素法；二阶电路三种阻尼。',
    c6: '正弦量与相量、阻抗导纳、有功/无功/视在功率、串联谐振、三相电路。',
    c7: '信号与频谱、模拟/数字信号、放大电路模型与增益/输入输出电阻/通频带等指标。',
    c8: '集成运放与理想运放（虚短、虚断）；反相/同相放大、加法、积分与微分电路。',
    c9: '半导体与 PN 结、二极管伏安特性与模型、整流/限幅电路、稳压管等特殊二极管。',
    c10: 'MOSFET 结构与特性、共源放大电路、图解与小信号分析、共漏/共栅电路。',
    c11: 'BJT 结构、工作原理、特性与参数；共射/共集/共基放大电路与三种组态比较。',
    c12: '电流源偏置、差分放大电路与共模抑制、集成运放内部结构与主要参数。',
    c13: '反馈的概念与四种组态、闭环增益公式、负反馈对性能的影响、深度负反馈与稳定性。',
    c14: '功放的一般问题与效率；甲类、乙类 OCL、甲乙类互补对称电路；D 类功放与功率管。',
    c15: '直流电源的组成；半波/桥式整流与电容滤波；稳压管、串联型与集成稳压电路。',
  },
  suggestions: ['基尔霍夫', '戴维南', '三要素', '相量', '虚短', '共射放大', '负反馈', '整流'],
};

export default function EeCourse() {
  return <CourseShell config={config} />;
}

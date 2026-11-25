/** 组合数学课程数据：四章十九节课件精讲（试题未收录，无在线练习） */
import type { GenPaper } from '../types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';

const combPapers: GenPaper[] = [];

export const combSpec = {
  key: 'comb',
  base: '/comb',
  name: '组合数学',
  tip: '组合数学 · 四章课件精讲',
  unit: '章' as const,
  chapters: [ch1, ch2, ch3, ch4],
  papers: combPapers,
  home: {
    lede: `<p>依据课程组课件（19 份分节 PPT）整理的课程精讲：第 1 章基本计数问题（加法/乘法原则、排列组合、重集、分配、生成算法、二项式系数），
    第 2 章生成函数，第 3 章递推关系（齐次/非齐次、Catalan 数、差分与 Stirling 数），第 4 章容斥原理。</p>`,
    cards: [
      {
        title: '课程信息',
        html: `<p>课件按 1.1～1.7、2.1～2.6、3.1～3.6、4.1～4.2 分节组织（3.4 与原 1.8 无独立课件）。
        站点按四章合并整理，每章保留各节的编号与核心定义、公式、例题。</p>`,
      },
      {
        title: '资料构成',
        html: `<p>站点整理自 <strong>19 份分节课件</strong>。课件中的公式以图版呈现，页面按文字说明与标准记号整理为可读的公式。
        本课程无期末试卷，故不设在线练习。</p>`,
      },
    ],
    blurbs: {
      deck1: '加法原则与乘法原则；集合的 r 排列与 r 组合、圆排列；重集的排列与组合（隔板法）；分配问题六种模型；字典序生成算法；二项式定理与组合恒等式。',
      deck2: '生成函数（母函数）的定义；线性运算与卷积；常用幂级数展开与部分分式；指数生成函数处理排列；应用补充；整数拆分的生成函数。',
      deck3: '递推关系的建立与初始条件；常系数线性齐次递推的特征方程与通解（含重根）；非齐次递推的特解设法；Catalan 数；差分表与两类 Stirling 数。',
      deck4: '集合运算与运算律；容斥原理的简单形式与一般形式；恰好 k 个性质的计数；错排与欧拉函数；Jordan 公式。',
    },
  },
};

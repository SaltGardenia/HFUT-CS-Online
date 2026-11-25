/** 线性代数课程内容汇总：6 章正文 + 4 份练习/试卷 */
import type { CourseChapter, CourseQuizKind } from '../course-types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import { laPapers } from './papers';

export const laChapters: CourseChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6];

export { laPapers };

export const LA_KIND_LABEL: Record<CourseQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

/** 知识点标签目标：章序号 → { section id: 显示名 } */
export const LA_SECTIONS: Record<number, Record<string, string>> = {
  1: {
    'sec-la1-concept': '行列式的概念',
    'sec-la1-prop': '行列式的性质',
    'sec-la1-cramer': '克拉默法则',
  },
  2: {
    'sec-la2-def': '矩阵的定义与运算',
    'sec-la2-inv': '逆矩阵',
    'sec-la2-block': '分块矩阵',
    'sec-la2-rank': '初等变换与矩阵的秩',
  },
  3: {
    'sec-la3-repr': '向量组的线性表示',
    'sec-la3-dep': '向量组的线性相关性',
    'sec-la3-rank': '向量组的秩与极大无关组',
    'sec-la3-space': '向量空间与标准正交向量组',
  },
  4: {
    'sec-la4-homo': '齐次线性方程组',
    'sec-la4-nonhomo': '非齐次线性方程组',
    'sec-la4-matrix': '简单矩阵方程',
  },
  5: {
    'sec-la5-eigen': '特征值与特征向量',
    'sec-la5-similar': '相似矩阵',
    'sec-la5-symmetric': '实对称矩阵的对角化',
  },
  6: {
    'sec-la6-form': '二次型及其矩阵表示',
    'sec-la6-standard': '化二次型为标准形',
    'sec-la6-positive': '正定二次型',
  },
};

export * from './types';

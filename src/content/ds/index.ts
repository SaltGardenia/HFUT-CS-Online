/** 数据结构课程内容汇总：8 章正文 + 5 份试卷 */
import type { CourseChapter, CoursePaper, CourseQuizKind } from '../course-types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';
import ch7 from './ch7';
import ch8 from './ch8';
import mock1 from './paper-mock1';
import mock2 from './paper-mock2';
import mock3 from './paper-mock3';
import mock4 from './paper-mock4';
import exam2019 from './paper-2019b';

export const dsChapters: CourseChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8];

export const dsPapers: CoursePaper[] = [mock1, mock2, mock3, mock4, exam2019];

export const DS_KIND_LABEL: Record<CourseQuizKind, string> = {
  single: '单选',
  multi: '多选',
  judge: '判断',
  fill: '填空',
  essay: '解答',
};

/** 知识点标签目标：章序号 → { section id: 显示名 } */
export const DS_SECTIONS: Record<number, Record<string, string>> = {
  1: {
    'sec-ds1-content': '数据结构的研究内容',
    'sec-ds1-terms': '基本术语',
    'sec-ds1-algo': '算法描述及分析',
  },
  2: {
    'sec-ds2-def': '线性表的定义和运算',
    'sec-ds2-seq': '顺序表',
    'sec-ds2-link': '链表',
    'sec-ds2-other': '其它结构形式的链表',
  },
  3: {
    'sec-ds3-stack': '栈',
    'sec-ds3-queue': '队列',
    'sec-ds3-rec': '栈与递归',
  },
  4: {
    'sec-ds4-string': '串',
    'sec-ds4-array': '数组',
    'sec-ds4-glist': '广义表',
  },
  5: {
    'sec-ds5-tree': '树的概念和基本运算',
    'sec-ds5-btree': '二叉树',
    'sec-ds5-trav': '二叉树的遍历',
    'sec-ds5-thread': '线索二叉树',
    'sec-ds5-forest': '树和森林',
    'sec-ds5-huffman': '哈夫曼树',
  },
  6: {
    'sec-ds6-def': '图的定义和基本概念',
    'sec-ds6-store': '图的存储结构',
    'sec-ds6-trav': '图的遍历算法及其应用',
    'sec-ds6-mst': '最小生成树',
    'sec-ds6-path': '最短路径',
    'sec-ds6-dag': '有向无环图',
  },
  7: {
    'sec-ds7-intro': '概述',
    'sec-ds7-seq': '顺序表的查找',
    'sec-ds7-tree': '树表的查找',
    'sec-ds7-hash': '散列表的查找',
  },
  8: {
    'sec-ds8-intro': '概述',
    'sec-ds8-insert': '插入排序',
    'sec-ds8-swap': '交换排序',
    'sec-ds8-select': '选择排序',
    'sec-ds8-merge': '归并排序',
    'sec-ds8-other': '其它排序方法',
  },
};

export * from './types';

import { Route, Routes } from 'react-router-dom';
import DataStructureSimulator from '../components/DataStructureSimulator';
import CourseShell, { type CourseExtraPage } from '../components/course/CourseShell';
import type { CourseConfig } from '../content/course-types';
import { DS_BASE } from './registry';
import { dsChapters, dsPapers, DS_KIND_LABEL, DS_SECTIONS } from '../content/ds';
import DsVisualPage, { DsVisualRail } from './DsVisualPage';

/** 数据结构课程配置：8 章课件精讲 + 5 份试卷在线练习 + 附件 */
const config: CourseConfig = {
  name: '数据结构',
  base: DS_BASE,
  deckKey: 'ds',
  tip: '数据结构 · 八章课件精讲与期末试卷',
  source: '八章课件精讲 · 5 份模拟/期末试卷在线练习',
  chapters: dsChapters,
  papers: dsPapers,
  storeKey: 'ds-practice-progress-v1',
  kindLabel: DS_KIND_LABEL,
  tagSections: DS_SECTIONS,
  lede: `
    <p>依据课程课件（第 1～8 章教材式讲义与 2021 版分章演示文稿）整理的课程讲义：
    从<strong>概论与算法分析</strong>出发，依次讨论<strong>线性表、栈与队列、串/数组/广义表、树、图</strong>，
    最后进入<strong>查找</strong>与<strong>排序</strong>；另收录 5 份模拟/期末试卷的在线练习。</p>
  `,
  introCards: [
    {
      title: '课件范围',
      body: '课件按章编号（第 1～8 章）：第 1 章建立术语与复杂度分析框架；第 2～4 章讨论线性结构及其推广；第 5、6 章讨论树与图两类非线性结构；第 7、8 章讨论查找与排序。每章均可从导航栏直接进入。',
    },
    {
      title: '资料构成',
      body: '讲义内容来自课件文件夹的教材式 PDF 与 2021 版演示文稿，覆盖各章目录的全部小节；试卷来自试题文件夹的 4 份模拟试卷与 2019-2020 学年 B 卷，客观题答案由本站整理，作图/设计题标注为纸笔作答。',
    },
  ],
  chapterBlurbs: {
    ch1: '数据结构的研究内容、基本术语（逻辑/存储结构），算法的五个特性与时间/空间复杂度分析。',
    ch2: '线性表的定义与运算；顺序表的随机存取与插入删除；单链表、循环链表与双向链表。',
    ch3: '栈与队列的操作受限特性、顺序/链式实现与典型应用；递归与递归工作栈。',
    ch4: '串的定义与模式匹配（BF/KMP）；数组的地址计算与特殊矩阵压缩；广义表的表头表尾与递归结构。',
    ch5: '树与二叉树的定义、性质与存储；三种遍历与序列还原；线索二叉树、树/森林转换、哈夫曼树与编码。',
    ch6: '图的定义与存储（邻接矩阵/邻接表）；DFS/BFS；Prim/Kruskal；Dijkstra/Floyd；拓扑排序与关键路径。',
    ch7: '顺序查找、二分查找、索引顺序查找；二叉排序树与平衡二叉树；散列函数、冲突处理与 ASL。',
    ch8: '插入、交换、选择、归并、基数等排序方法；时间/空间复杂度与稳定性对比及适用场合。',
  },
  suggestions: ['二叉树', '哈夫曼', '邻接表', 'Dijkstra', '快速排序', '平衡二叉树'],
};

const extras: CourseExtraPage[] = [
  {
    path: 'visual',
    routePath: 'visual/:algorithmId?',
    full: '可视化',
    short: '可视化',
    tip: '可视化 · 站内算法模拟器（69 个演示）',
    navNo: '视',
    navLabel: '可视化 · 算法模拟器',
    sidebar: <DsVisualRail />,
    element: <DsVisualPage />,
  },
];

export default function DsCourse() {
  return (
    <Routes>
      <Route path="simulator/:algorithmId?" element={<DataStructureSimulator />} />
      <Route path="*" element={<CourseShell config={config} extras={extras} />} />
    </Routes>
  );
}

import type { CourseConfig } from '../course-types';
import { cmDecks } from './index';

export const cmConfig: CourseConfig = {
  name: '计算方法',
  base: '/cm',
  deckKey: 'cm',
  tip: '计算方法 · 数值分析（插值 / 积分 / 微分方程 / 求根 / 线性方程组）',
  source: '六章课件精讲（插值 / 数值积分 / 常微分方程差分 / 方程求根 / 线性方程组）· 试题未收录',
  chapters: cmDecks,
  papers: [],
  storeKey: 'cm-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '计算题' },
  tagSections: {
    1: { 'sec-0-1': '误差来源', 'sec-0-2': '有效数字', 'sec-0-3': '稳定性与收敛阶' },
    2: { 'sec-1-1': '插值问题', 'sec-1-2': 'Lagrange', 'sec-1-3': 'Newton', 'sec-1-4': 'Hermite', 'sec-1-5': '样条', 'sec-1-6': '余项与 Runge' },
    3: { 'sec-2-1': 'Newton-Cotes', 'sec-2-2': '梯形与 Simpson', 'sec-2-3': '复化求积', 'sec-2-4': 'Romberg 与 Gauss' },
    4: { 'sec-3-1': 'Euler', 'sec-3-2': '改进 Euler', 'sec-3-3': 'Runge-Kutta', 'sec-3-4': '收敛与稳定' },
    5: { 'sec-4-1': '二分法', 'sec-4-2': '不动点迭代', 'sec-4-3': 'Newton 法', 'sec-4-4': '弦截法' },
    6: { 'sec-5-1': '迭代思想', 'sec-5-2': 'Jacobi / GS', 'sec-5-3': 'SOR', 'sec-5-4': '收敛性' },
    7: { 'sec-6-1': 'Gauss 消元', 'sec-6-2': 'LU 分解', 'sec-6-3': '平方根 / 追赶法', 'sec-6-4': '条件数' },
  },
  lede:
    '计算方法（数值分析）研究用计算机求解数学问题的近似方法，核心是算法设计、误差分析与收敛性。课件为 2024 版（胡敏），含第 0 章引论与第 1～6 章：插值方法、数值积分、常微分方程差分方法、方程求根迭代法、线性方程组迭代解法与直接解法。',
  introCards: [
    { title: '课程定位', body: '计算机与信息学院专业基础课；把数学问题转化为可计算的算法，并分析其误差与效率。' },
    { title: '内容主线', body: '误差 → 插值 → 数值积分 → 常微分方程数值解 → 方程求根 → 线性方程组（迭代 / 直接）。' },
    { title: '先修知识', body: '高等数学（微积分、级数）、线性代数（矩阵、特征值）、程序设计基础。' },
    { title: '资料构成', body: '课件 43 份（2024 版 PDF / PPT + 旧版与复习笔记，内容按章节取 2024 版）；试题未收录。' },
  ],
  chapterBlurbs: {
    deck0: '误差来源 · 绝对 / 相对误差 · 有效数字 · 稳定性与收敛阶',
    deck1: 'Lagrange · Newton 差商与差分 · Hermite · 分段与三次样条 · 余项',
    deck2: 'Newton-Cotes · 梯形 / Simpson · 复化求积 · Romberg · Gauss',
    deck3: 'Euler · 后退 Euler · 改进 Euler · RK4 · 收敛与稳定',
    deck4: '二分法 · 不动点迭代 · Newton 法 · 弦截法 · 加速',
    deck5: 'Jacobi · Gauss-Seidel · SOR · 谱半径收敛判定',
    deck6: 'Gauss 消元 · 列主元 · LU / Doolittle · 平方根 · 追赶法 · 条件数',
  },
  suggestions: ['误差', 'Lagrange', 'Simpson', 'Newton', '收敛阶'],
};

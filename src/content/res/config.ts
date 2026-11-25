import type { CourseConfig } from '../course-types';
import { resDecks } from './index';

export const resConfig: CourseConfig = {
  name: '科研训练',
  base: '/res',
  deckKey: 'res',
  tip: '科研训练 · 项目结题答辩（个性化推荐系统）',
  source: '科研训练答辩课件 · 试题未收录',
  chapters: resDecks,
  papers: [],
  storeKey: 'res-practice-progress-v1',
  kindLabel: { single: '单选题', multi: '多选题', judge: '判断题', fill: '填空题', essay: '简答题' },
  tagSections: { 1: { 'sec-1-1': '研究背景与创新点', 'sec-1-2': '协同过滤模型', 'sec-1-3': '数据处理与可视化', 'sec-1-4': '系统设计', 'sec-1-5': '交互、性能与评估' } },
  lede:
    '科研训练以课题实践与结题答辩为主要形式。本课程页整理结题答辩课件《基于机器学习的个性化推荐系统》，共 26 页，覆盖研究背景、模型方法、系统设计与效果展示四个部分，可作为科研训练报告与答辩的准备参考。',
  introCards: [
    { title: '训练形式', body: '在教师指导下完成一个小型科研课题：选题、调研、方法设计、实现、实验与结题答辩。' },
    { title: '本课题', body: '基于用户的协同过滤电影推荐系统：余弦相似度 + 加权评分预测 + 类型偏好与时间衰减。' },
    { title: '技术栈', body: 'Python、pandas、NumPy、scikit-learn（cosine_similarity）、matplotlib / seaborn。' },
    { title: '资料构成', body: '课件 1 份（26 页答辩 PPT）；试题未收录；附件含答辩材料与项目文件。' },
  ],
  chapterBlurbs: {
    deck1: '研究背景与创新点 · 协同过滤与余弦相似度 · 数据处理与可视化 · 系统设计 · 效果评估',
  },
  suggestions: ['协同过滤', '余弦相似度', '冷启动', '时间衰减', '可视化'],
};

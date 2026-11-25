/** 机器学习课程数据：五讲课件精讲（试题未收录，无在线练习） */
import type { GenPaper } from '../types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';

const mlPapers: GenPaper[] = [];

export const mlSpec = {
  key: 'ml',
  base: '/ml',
  name: '机器学习',
  tip: '机器学习 · 五讲课件精讲',
  unit: '讲' as const,
  chapters: [ch1, ch2, ch3, ch4, ch5],
  papers: mlPapers,
  home: {
    lede: `<p>依据课程组课件（刘建老师《机器学习》系列 PPT）整理的五讲精讲：机器学习绪论、决策树、集成学习、支持向量机，
    并以 OCR 实例串起一条完整的机器学习流水线。课件中的公式以图版呈现，页面按文字说明与标准定义整理。</p>`,
    cards: [
      {
        title: '课程信息',
        html: `<p>课件按专题组织，而非按教科书的章节顺序：绪论给出 T/E/P 定义与学习流程；决策树讲信息熵、信息增益、剪枝与
        ID3/C4.5/CART；集成学习讲 Bagging/随机森林与 Boosting/GBDT/XGBoost；支持向量机讲大间距、核函数与软间隔；OCR 实例讲流水线与滑动窗口。</p>`,
      },
      {
        title: '资料构成',
        html: `<p>站点整理自 <strong>5 份课件</strong>（绪论、决策树、集成学习、支持向量机、实例 OCR）与课程大作业汇报材料。
        本课程无期末试卷，故不设在线练习。</p>`,
      },
    ],
    blurbs: {
      deck1: '人工智能与机器学习的关系；图灵测试与里程碑；机器学习的笼统定义与 T/E/P 工程定义；训练流程；监督/无监督/强化学习范式与本课程地图。',
      deck2: '决策树的节点、边与特征空间划分；学习树形状/阈值/叶值；信息熵与信息增益；停止条件、过拟合与剪枝；ID3、C4.5、CART 的划分准则。',
      deck3: '集成模型的效果、稳定性与可解释性；Bagging 与随机森林（Bootstrap 采样、特征随机化、投票/平均）；Boosting 与残差训练、GBDT/XGBoost；Stacking 融合。',
      deck4: '从逻辑回归代价函数到 SVM；大间距分类器与支持向量；C 的作用；高斯核与相似性；软间隔与参数选择。',
      deck5: 'OCR 问题与三段流水线；滑动窗口与行人检测、IoU/NMS；文本检测、字符分割、字符分类的方法；上限分析。',
    },
  },
};

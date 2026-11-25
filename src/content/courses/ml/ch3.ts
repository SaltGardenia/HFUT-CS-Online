/* 第 3 讲 集成学习 —— 依据课件「集成学习」（27 页）整理 */
import type { GenChapter } from '../types';

const ch3: GenChapter = {
  id: 'deck3',
  no: '第3讲',
  title: '集成学习',
  subtitle: '集成模型与多样性 · Bagging 与随机森林 · Boosting 与 GBDT/XGBoost · Stacking',
  lede:
    '<p>对几乎所有分类问题（图像识别除外，深度学习是标配），集成模型都是首选：评分卡系统的业界标配是 GBDT 或 XGBoost，数据竞赛中集成模型也是通向冠军的捷径。原因有三——效果好、稳定、可解释性好（基于决策树，不像深度学习的黑盒子）。本章讲两类完全不同的构造方法：<strong>Bagging</strong>（随机森林）与 <strong>Boosting</strong>（GBDT、XGBoost），以及模型融合策略 <strong>Stacking</strong>。</p>',
  toc: [
    { id: 'sec-ml3-why', text: '3.1 集成模型与稳定性', level: 2 },
    { id: 'sec-ml3-rf', text: '3.2 Bagging 与随机森林', level: 2 },
    { id: 'sec-ml3-boost', text: '3.3 Boosting 与提升树', level: 2 },
    { id: 'sec-ml3-xgb', text: '3.4 XGBoost', level: 2 },
    { id: 'sec-ml3-stack', text: '3.5 Stacking', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ml3-why',
      heading: '3.1 集成模型与稳定性',
      blocks: [
        {
          type: 'html',
          html: `
            <p>集成模型可以简单理解成「决策树的集合」，而决策树本身可解释性好；模型出错时能定位原因，这对金融等直接与金钱挂钩的应用尤其重要。</p>
            <p>从统计角度用<strong>方差</strong>表示「稳定性」：一个模型若在训练数据上表现特别好、放到线上却不行，就是不稳定（方差大）。集成模型通过多个模型共同决策来<strong>减少方差</strong>，提高稳定性。课件用「7 位专家各自犯错的概率为 0.3，多数表决后共同犯错的概率」说明：共同决策会降低风险。多模型共同预测确实降低方差、提高稳定性，但准确率是否一定提升并不绝对——通常集成模型的准确率仍高于简单模型。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml3-rf',
      heading: '3.2 Bagging 与随机森林',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Bagging</strong> 的流程：对训练集做有放回抽样得到多个子集，在各子集上<strong>独立、并行</strong>地训练多个模型，再用投票（分类）或平均（回归）综合结果。若基模型是决策树，就得到<strong>随机森林</strong>。</p>
            <p>随机森林有两个关键词：「森林」是很多树的集合，「随机」是效果的关键。若多棵树之间<strong>相关性大</strong>，就起不到增加稳定性的作用——就像投资「不要把鸡蛋放在同一个篮子里」。<strong>多样性（Diversity）</strong>才能保证随机森林的效果，随机性体现在两处：</p>
            <ul>
              <li><strong>训练样本的随机化</strong>：Bootstrap 采样，可重复地抽取部分样本，得到多份不同的训练数据；</li>
              <li><strong>特征选择的随机化</strong>：每次分裂时先从全部特征中随机抽取一部分（如 100 个中取 10 个），再从这 10 个中选最好的特征作为当前节点。</li>
            </ul>
            <p>预测时分类问题投票、回归问题取平均。随机森林不易过拟合、对缺失值和异常值不敏感、能评估特征重要性，是最常用的基线模型之一。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml3-boost',
      heading: '3.3 Boosting 与提升树',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Bagging 与 Boosting 的区别</strong>：二者都把每个模型称作弱学习器（Weak Learner）。Bagging 针对的是「因<strong>过拟合</strong>而弱」的强学习器——像一群自认为很厉害的专家，合作时很强；Boosting 针对的是「因<strong>欠拟合</strong>而弱」的学习器——像一群学渣，单独都不行，但合作能带来惊人的结果。</p>
            <p>Boosting 的思想是<strong>串行</strong>训练：第一个模型效果不好，就保留它，把它解决不了的部分（<strong>残差</strong>）作为新标签训练第二个模型，如此一个接一个叠加；残差逐渐变小，训练到预设的模型个数（或误差阈值）为止。预测时与 Bagging 不同——因为每棵树依赖前面的残差，最终结果是各模型输出之<strong>和</strong>而非平均。</p>
            <p>最初的 Boosting 方法是 <strong>AdaBoost</strong>（目前用得不多），其思想被不断改进，衍生出 <strong>GBDT</strong>（梯度提升决策树）与 <strong>XGBoost</strong> 等流行模型。Boosting 在实际问题中往往比 Bagging 更强，在过拟合控制上也被证明更有效。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml3-xgb',
      heading: '3.4 XGBoost',
      blocks: [
        {
          type: 'html',
          html: `
            <p>XGBoost 流行的原因：① 实际效果好，在工业界应用、benchmark 与 Kaggle 比赛中表现突出；② 算法可以并行、训练效率高，能训练大量数据；③ 可控参数多，可以灵活调整；④ 实践简单——缺失值、正则化、剪枝等可以自动处理；⑤ 速度快——底层用 C 实现，可用 GPU，且用了二阶求导。</p>
            <p>理解 XGBoost 的路径是：<strong>如何构造目标函数</strong>（预测值之和与真实值的误差 + 控制树复杂度的正则项，如叶节点个数、树的深度、叶节点值的大小）→ <strong>目标函数如何近似</strong>（用泰勒展开近似到一阶、二阶）→ <strong>如何参数化一棵树</strong> → <strong>用贪心算法构建每一棵树</strong>。预测时，样本分别通过每一棵树，各模型输出之和即最终预测。</p>`,
        },
      ],
    },
    {
      id: 'sec-ml3-stack',
      heading: '3.5 Stacking',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>Stacking</strong>（堆叠法）严格来说不是一种算法，而是一种模型集成策略：用一些简单的函数聚合所有预测器的预测，或者「训练一个模型来执行这种聚合」。第一层由多个<strong>基学习器</strong>组成，输入为原始训练集；第二层的模型以第一层基学习器的<strong>输出作为特征</strong>加入训练集再训练，得到完整的 stacking 模型。</p>
            <p>流程（以 5 折交叉验证为例）：① 准备训练集与测试集；② 选定基模型（如 XGBoost、LightGBM、随机森林），每个基模型用 5 折交叉验证训练，得到训练集上的 5 份预测并纵向合并为 A_i，同时在测试集上得到 1 份预测 B_i；③ 把各基模型在训练集上的预测 A₁、A₂、A₃ 作为特征，用逻辑回归等二层模型训练；④ 用训练好的二层模型在 B₁、B₂、B₃ 上预测，得到最终类别或概率。Stacking 在数据竞赛中很流行，模型融合后通常能小幅提升准确率，代价是训练与推理成本高、工程复杂。</p>`,
        },
      ],
    },
  ],
};

export default ch3;

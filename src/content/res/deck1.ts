import type { DeckData } from '../types';

/** 科研训练 —— 课件：成品/答辩.ppt（26 页），个性化电影推荐系统结题答辩 */
const deck1: DeckData = {
  id: 'deck1',
  no: '专题',
  title: '科研训练答辩：基于机器学习的个性化推荐系统',
  subtitle: '协同过滤 · 余弦相似度 · 加权评分预测 · 数据预处理与可视化 · 模块化系统设计',
  lede:
    '本讲整理科研训练结题答辩课件：项目以 MovieLens 数据为基础，实现一个基于用户的协同过滤电影推荐系统。围绕研究背景、模型方法、系统设计、效果展示四个部分，说明相似用户偏好假设、余弦相似度、加权评分预测、类型偏好与时间衰减等优化策略，以及数据加载、预处理、模型训练、推荐生成、可视化五个模块的实现。',
  toc: [
    { id: 'sec-1-1', text: '一、研究背景与创新点', level: 2 },
    { id: 'sec-1-2', text: '二、模型方法：基于用户的协同过滤', level: 2 },
    { id: 'sec-1-3', text: '三、数据处理与可视化', level: 2 },
    { id: 'sec-1-4', text: '四、系统设计与实现', level: 2 },
    { id: 'sec-1-5', text: '五、交互、性能与效果评估', level: 2 },
  ],
  sections: [
    {
      id: 'sec-1-1',
      heading: '一、研究背景与创新点',
      blocks: [
        {
          type: 'html',
          html: `
<p>项目是一个<strong>基于协同过滤的电影推荐系统</strong>，涉及推荐系统、协同过滤、数据挖掘、机器学习与用户行为分析等领域。采用基于用户的协同过滤方法，通过余弦相似度计算用户间相似性，并结合数据可视化分析、用户偏好建模和时间序列分析。</p>
<p>推荐系统领域主要存在四类问题：<strong>冷启动、数据稀疏、可扩展性、推荐多样性</strong>。常见解决方案包括混合推荐、矩阵分解、深度学习模型与实时推荐系统等。</p>
<div class="callout key">
<p class="callout-h">项目创新点</p>
<ol>
<li><strong>多维度推荐策略</strong>：结合用户评分历史、电影类型偏好与时间因素；</li>
<li><strong>可视化分析</strong>：用户评分分布、电影类型分布、推荐结果直观展示、用户相似度热力图；</li>
<li><strong>个性化推荐</strong>：支持用户自定义偏好类型、时间范围筛选与动态调整推荐权重。</li>
</ol>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-1-2',
      heading: '二、模型方法：基于用户的协同过滤',
      blocks: [
        {
          type: 'html',
          html: `
<p>核心假设：<strong>相似用户对相似物品有相似的偏好</strong>。通过分析用户历史行为数据发现用户之间的相似性，从而为目标用户推荐其相似用户喜欢的物品。</p>
<h3>余弦相似度</h3>
<p>以两个用户评分向量的夹角余弦值衡量用户间相似程度。优点是能有效处理评分尺度不一致的问题，并且对稀疏数据具有较好的鲁棒性。</p>
<div class="formula"><p>sim(u, v) = (Σ<sub>i</sub> r<sub>ui</sub> · r<sub>vi</sub>) / (√Σ<sub>i</sub> r<sub>ui</sub>² · √Σ<sub>i</sub> r<sub>vi</sub>²)</p></div>
<h3>加权评分预测</h3>
<p>对目标用户未评分的电影，用其相似用户对该电影的评分加权平均来预测，权重由用户相似度决定——相似度越高的用户，其评分对预测结果影响越大。</p>
<div class="formula"><p>r̂<sub>u,i</sub> = Σ<sub>v∈N(u)</sub> sim(u, v) · r<sub>v,i</sub> / Σ<sub>v∈N(u)</sub> |sim(u, v)|</p></div>
<p>在此基础上引入<strong>电影类型偏好权重</strong>与<strong>时间衰减因子</strong>，提升推荐的个性化与时效性。</p>
`,
        },
      ],
    },
    {
      id: 'sec-1-3',
      heading: '三、数据处理与可视化',
      blocks: [
        {
          type: 'html',
          html: `
<p>数据处理质量直接影响最终结果：</p>
<ol>
<li>对原始评分数据<strong>标准化</strong>，消除评分尺度差异；</li>
<li>通过<strong>时间戳分析</strong>引入时间衰减因子，使近期评分具有更高权重；</li>
<li>对电影类型进行 <strong>one-hot 编码</strong>，便于后续特征提取与相似度计算。</li>
</ol>
<p>可视化使用 matplotlib 与 seaborn，按数据特点选择合适图形：</p>
<table class="tbl">
<thead><tr><th>图形</th><th>用途</th></tr></thead>
<tbody>
<tr><td>直方图</td><td>用户评分分布</td></tr>
<tr><td>条形图</td><td>电影类型分布</td></tr>
<tr><td>热力图</td><td>用户相似度矩阵</td></tr>
<tr><td>折线图</td><td>推荐结果的评分对比，评估推荐效果</td></tr>
</tbody>
</table>
<h3>模型优化</h3>
<ul>
<li>引入电影类型偏好权重，提高推荐结果多样性；</li>
<li>结合时间衰减因子，保证推荐时效性；</li>
<li>动态调整相似用户数量，在准确性与计算效率之间取得平衡。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-1-4',
      heading: '四、系统设计与实现',
      blocks: [
        {
          type: 'html',
          html: `
<p>采用模块化设计，整个系统分为<strong>数据加载、数据预处理、模型训练、推荐生成、可视化分析</strong>五个部分，以 <code>main.py</code> 作为程序入口，使推荐流程清晰有条理。</p>
<h3>数据加载：loadData()</h3>
<p>读取四个数据文件：<code>ratings.csv</code>（用户对电影的评分）、<code>movies.csv</code>（电影基本信息）、<code>tags.csv</code>（用户给电影打的标签）、<code>links.csv</code>（电影在其他网站的链接）。<code>printData()</code> 显示数据集基本情况（每个数据集记录数），便于调试。</p>
<h3>预处理：initData()</h3>
<ol>
<li>把电影类型从字符串变成列表，便于按类型筛选；</li>
<li>用 <code>pivot</code> 把用户评分数据整理成矩阵：行是用户、列是电影，未评分处填 0；</li>
<li>把时间戳转换成可读日期格式，便于时间分析。</li>
</ol>
<h3>模型训练：getUserRecommend()</h3>
<ol>
<li>用 <code>cosine_similarity</code> 计算用户之间相似度；</li>
<li>找出与目标用户最相似的 5 个用户；</li>
<li>找出这些用户看过、而目标用户没看过的电影；</li>
<li>根据用户选择的类型和时间范围筛选电影；</li>
<li>计算每部电影的预测评分（考虑用户相似度与类型匹配度），把评分最高的若干部作为推荐结果，存入 <code>recommendations</code> 列表。</li>
</ol>
<h3>可视化函数</h3>
<ul>
<li><code>visualize_rating_distribution()</code>：评分分布图；</li>
<li><code>visualize_genre_distribution()</code>：电影类型分布；</li>
<li><code>visualize_recommendations()</code>：推荐电影评分对比；</li>
<li><code>visualize_user_similarity()</code>：用户相似关系。</li>
</ul>
`,
        },
      ],
    },
    {
      id: 'sec-1-5',
      heading: '五、交互、性能与效果评估',
      blocks: [
        {
          type: 'html',
          html: `
<h3>用户交互：getUserInp()</h3>
<p>引导用户输入用户 ID、喜欢的电影类型和时间范围，并做输入检查：用户 ID 必须在 1–610 之间，时间范围必须在 1900–2024 年之间（范围由 data 文件夹中的数据推算）。程序不用 try-catch 处理下标溢出，而是只要输入不合法就反复提醒，直到数据正确。</p>
<h3>性能优化</h3>
<ul>
<li>用 pandas 的<strong>向量化操作</strong>代替循环；</li>
<li>用<strong>矩阵运算</strong>代替逐个计算（如 <code>cosine_similarity</code>）；</li>
<li>用 <strong>DataFrame</strong> 存储中间结果，避免重复计算；</li>
<li>筛选电影时使用布尔索引。</li>
</ul>
<h3>效果评估</h3>
<p>从三方面评估：推荐结果的分布情况、用户之间的相似关系、推荐结果的类型与时间分布。相关指标都在可视化函数中实现，例如在 <code>visualize_recommendations()</code> 中查看推荐电影的评分分布，在 <code>visualize_user_similarity()</code> 中查看用户间相似关系。</p>
<div class="callout tip">
<p class="callout-h">答辩结构</p>
<p>课件按「研究背景 → 模型方法 → 系统设计 → 效果展示」展开，最后以运行截图演示完整流程。科研训练报告的写法可参照此结构：问题与现状、方法与创新点、系统实现、结果与评估。</p>
</div>
`,
        },
      ],
    },
  ],
};

export default deck1;

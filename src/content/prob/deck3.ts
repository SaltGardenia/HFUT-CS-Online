import type { DeckData } from '../types';

/** 第3章 二维随机变量及其分布 —— 课件 第三章（1）～（5）、3-3、3-5、3-7、3-8 */
const deck3: DeckData = {
  id: 'deck3',
  no: '第3章',
  title: '二维随机变量及其分布',
  subtitle: '联合分布 · 边缘分布 · 条件分布 · 独立性 · 二维随机变量函数的分布 · n 维随机变量',
  lede:
    '许多随机现象需要同时用两个或多个随机变量描述。本章讨论二维随机变量 (X,Y) 的联合分布函数、联合分布律与联合密度，边缘分布与条件分布，随机变量的独立性，以及二维随机变量函数的分布（和的分布、卷积公式），最后推广到 n 维随机变量。',
  toc: [
    { id: 'sec-3-1', text: '3.1 联合分布函数与联合分布律', level: 2 },
    { id: 'sec-3-2', text: '3.2 边缘分布', level: 2 },
    { id: 'sec-3-3', text: '3.3 条件分布', level: 2 },
    { id: 'sec-3-4', text: '3.4 随机变量的独立性', level: 2 },
    { id: 'sec-3-5', text: '3.5 二维随机变量函数的分布', level: 2 },
    { id: 'sec-3-6', text: '3.6 n 维随机变量', level: 2 },
  ],
  sections: [
    {
      id: 'sec-3-1',
      heading: '3.1 联合分布函数与联合分布律',
      blocks: [
        {
          type: 'html',
          html: `
<p>二维随机变量 (X,Y) 的联合分布函数</p>
<div class="formula"><p>F(x,y) = P{X ≤ x, Y ≤ y}</p></div>
<p>性质：关于 x、y 单调不减；关于 x、y 右连续；F(−∞,y)=F(x,−∞)=0，F(+∞,+∞)=1；P{x<sub>1</sub>&lt;X≤x<sub>2</sub>, y<sub>1</sub>&lt;Y≤y<sub>2</sub>} = F(x<sub>2</sub>,y<sub>2</sub>)−F(x<sub>1</sub>,y<sub>2</sub>)−F(x<sub>2</sub>,y<sub>1</sub>)+F(x<sub>1</sub>,y<sub>1</sub>)。</p>
<p><strong>离散型</strong>：联合分布律 p<sub>ij</sub>=P{X=x<sub>i</sub>,Y=y<sub>j</sub>}，满足 p<sub>ij</sub>≥0、Σ<sub>i</sub>Σ<sub>j</sub>p<sub>ij</sub>=1。</p>
<p><strong>连续型</strong>：存在联合密度 f(x,y)≥0，使 F(x,y)=∫<sub>−∞</sub><sup>x</sup>∫<sub>−∞</sub><sup>y</sup>f(u,v)dvdu；∫∫f=1；P{(X,Y)∈D}=∬<sub>D</sub>f(x,y)dxdy。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-2',
      heading: '3.2 边缘分布',
      blocks: [
        {
          type: 'html',
          html: `
<p>由联合分布可求各分量的边缘分布：</p>
<ul>
<li>离散型：p<sub>X</sub>(x<sub>i</sub>) = Σ<sub>j</sub> p<sub>ij</sub>，p<sub>Y</sub>(y<sub>j</sub>) = Σ<sub>i</sub> p<sub>ij</sub>（行和 / 列和）；</li>
<li>连续型：f<sub>X</sub>(x) = ∫<sub>−∞</sub><sup>+∞</sup> f(x,y)dy，f<sub>Y</sub>(y) = ∫<sub>−∞</sub><sup>+∞</sup> f(x,y)dx；</li>
<li>分布函数：F<sub>X</sub>(x)=F(x,+∞)，F<sub>Y</sub>(y)=F(+∞,y)。</li>
</ul>
<p>边缘分布由联合分布唯一确定，但反之不成立：不同的联合分布可以有相同的边缘分布。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-3',
      heading: '3.3 条件分布',
      blocks: [
        {
          type: 'html',
          html: `
<p>在 Y=y<sub>j</sub> 条件下 X 的条件分布律（离散型）：</p>
<div class="formula"><p>P{X=x<sub>i</sub> | Y=y<sub>j</sub>} = p<sub>ij</sub> / p<sub>Y</sub>(y<sub>j</sub>)　（p<sub>Y</sub>(y<sub>j</sub>)&gt;0）</p></div>
<p>连续型的条件密度：</p>
<div class="formula"><p>f<sub>X|Y</sub>(x|y) = f(x,y) / f<sub>Y</sub>(y)　（f<sub>Y</sub>(y)&gt;0）</p></div>
<p>条件分布函数 F<sub>X|Y</sub>(x|y)=∫<sub>−∞</sub><sup>x</sup>f<sub>X|Y</sub>(u|y)du。条件分布满足分布的全部性质。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-4',
      heading: '3.4 随机变量的独立性',
      blocks: [
        {
          type: 'html',
          html: `
<p>若对任意 x,y 有</p>
<div class="formula"><p>P{X≤x, Y≤y} = P{X≤x}·P{Y≤y}</p></div>
<p>即 F(x,y)=F<sub>X</sub>(x)F<sub>Y</sub>(y)，则称 X 与 Y 相互独立。</p>
<ul>
<li>离散型：p<sub>ij</sub> = p<sub>X</sub>(x<sub>i</sub>)·p<sub>Y</sub>(y<sub>j</sub>) 对所有 i,j 成立；</li>
<li>连续型：f(x,y) = f<sub>X</sub>(x)·f<sub>Y</sub>(y) 几乎处处成立（且联合密度可分离为 x 的函数与 y 的函数之积）；</li>
<li>若联合密度在矩形区域上可分离变量且区域为矩形，则独立。</li>
</ul>
<p>独立性的意义：联合分布可由边缘分布相乘得到，二维问题化为一维问题。</p>
<div class="callout warn">
<p class="callout-h">常见错误</p>
<p>「不相关」不等于「独立」（不相关只说明协方差为 0）；对正态分布，不相关与独立等价。判断独立要看联合分布能否分解，而不是只看边缘分布。</p>
</div>
`,
        },
      ],
    },
    {
      id: 'sec-3-5',
      heading: '3.5 二维随机变量函数的分布',
      blocks: [
        {
          type: 'html',
          html: `
<h3>和的分布</h3>
<p>Z=X+Y 的密度：</p>
<div class="formula"><p>f<sub>Z</sub>(z) = ∫<sub>−∞</sub><sup>+∞</sup> f(x, z−x)dx = ∫<sub>−∞</sub><sup>+∞</sup> f(z−y, y)dy</p></div>
<p>若 X、Y 独立，则 f<sub>Z</sub>(z)=∫f<sub>X</sub>(x)f<sub>Y</sub>(z−x)dx，称为<strong>卷积公式</strong>。</p>
<h3>常见结论</h3>
<ul>
<li>若 X~N(μ<sub>1</sub>,σ<sub>1</sub>²)、Y~N(μ<sub>2</sub>,σ<sub>2</sub>²) 且独立，则 X+Y~N(μ<sub>1</sub>+μ<sub>2</sub>, σ<sub>1</sub>²+σ<sub>2</sub>²)；</li>
<li>若 X~P(λ<sub>1</sub>)、Y~P(λ<sub>2</sub>) 且独立，则 X+Y~P(λ<sub>1</sub>+λ<sub>2</sub>)；</li>
<li>若 X、Y 独立同分布，最大值 M=max(X,Y)、最小值 m=min(X,Y) 的分布可用 F<sub>M</sub>(z)=F<sub>X</sub>(z)F<sub>Y</sub>(z)、F<sub>m</sub>(z)=1−[1−F<sub>X</sub>(z)][1−F<sub>Y</sub>(z)] 求。</li>
</ul>
<h3>一般方法</h3>
<p>求 Z=g(X,Y) 的分布：先求 F<sub>Z</sub>(z)=P{g(X,Y)≤z}，在区域 {g≤z} 上对联合密度积分，再对 z 求导。</p>
`,
        },
      ],
    },
    {
      id: 'sec-3-6',
      heading: '3.6 n 维随机变量',
      blocks: [
        {
          type: 'html',
          html: `
<p>n 维随机变量 (X<sub>1</sub>,…,X<sub>n</sub>) 的联合分布函数 F(x<sub>1</sub>,…,x<sub>n</sub>)=P{X<sub>1</sub>≤x<sub>1</sub>,…,X<sub>n</sub>≤x<sub>n</sub>}；联合密度 f 满足 F=∫…∫f。</p>
<ul>
<li>边缘分布：对不需要的分量积分（或求和）；</li>
<li>独立性：F(x<sub>1</sub>,…,x<sub>n</sub>)=∏F<sub>X<sub>i</sub></sub>(x<sub>i</sub>)，或 f=∏f<sub>X<sub>i</sub></sub>；</li>
<li>n 个独立正态变量的线性组合仍服从正态分布；</li>
<li>n 维随机变量函数的分布可通过分布函数法或变量代换（Jacobian）求。</li>
</ul>
<p>本章是后续数理统计（样本、统计量、抽样分布）的基础：样本 X<sub>1</sub>,…,X<sub>n</sub> 通常假设独立同分布。</p>
`,
        },
      ],
    },
  ],
};

export default deck3;

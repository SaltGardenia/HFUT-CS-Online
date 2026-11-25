/* 数据结构 · 第6章 图 —— 依据课件《第6章图》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch6',
  no: '第6章',
  title: '图',
  subtitle: '第 6 章 · 图',
  lede: `
  图是一种<strong>多对多</strong>的网状结构，可描述交通网、通信网、工程流程等复杂关系。
  本章讨论图的定义与存储、两种遍历策略，以及建立在遍历之上的经典算法：<strong>最小生成树</strong>、<strong>最短路径</strong>、<strong>拓扑排序与关键路径</strong>。
`,
  toc: [
    { id: 'sec-ds6-def', text: '1. 图的定义和基本概念', level: 2 },
    { id: 'sec-ds6-store', text: '2. 图的存储结构', level: 2 },
    { id: 'sec-ds6-trav', text: '3. 图的遍历算法及其应用', level: 2 },
    { id: 'sec-ds6-mst', text: '4. 最小生成树', level: 2 },
    { id: 'sec-ds6-path', text: '5. 最短路径', level: 2 },
    { id: 'sec-ds6-dag', text: '6. 有向无环图', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds6-def',
      heading: '1. 图的定义和基本概念',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>图</strong> G 由顶点集合 V 和边集合 E 组成，记为 G = (V, E)。若边有方向，称<strong>有向图</strong>，边用有序对 ⟨v, w⟩ 表示，v 为弧尾、w 为弧头；若边无方向，称<strong>无向图</strong>，边用无序对 (v, w) 表示。</p>
          <ul>
            <li><strong>完全图</strong>：无向图中任意两个顶点间都有边，共 n(n−1)/2 条边；有向完全图共 n(n−1) 条弧；</li>
            <li><strong>度</strong>：无向图中与顶点相连的边数；有向图分<strong>入度</strong>与<strong>出度</strong>，度 = 入度 + 出度；</li>
            <li><strong>路径</strong>：顶点序列；<strong>回路</strong>：首尾相同的路径；<strong>简单路径</strong>：顶点不重复；</li>
            <li><strong>连通</strong>：无向图中两顶点间有路径；<strong>连通图</strong>：任意两顶点连通；<strong>连通分量</strong>：极大连通子图；</li>
            <li><strong>强连通图</strong>：有向图中任意两顶点互相可达；<strong>强连通分量</strong>：极大强连通子图；</li>
            <li><strong>生成树</strong>：连通图的极小连通子图，含全部 n 个顶点和 n−1 条边。</li>
          </ul>
          <p><strong>网</strong>：带权图。边的权可表示距离、费用、时间等，最短路径与最小生成树都定义在网中。</p>
          <div class="callout tip">
            <p class="callout-h">握手定理</p>
            <p>无向图中所有顶点的度之和等于边数的 2 倍；有向图中所有顶点的入度之和等于出度之和，且都等于弧数。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds6-store',
      heading: '2. 图的存储结构',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds6-store-h1">邻接矩阵</h3>
          <p>用 n × n 的二维数组 A 表示顶点间的邻接关系：A[i][j] = 1 表示存在边（或弧），否则为 0；网中 A[i][j] 存权值，不存在的边用 ∞ 表示，对角线为 0。</p>
          <p>无向图的邻接矩阵关于主对角线<strong>对称</strong>，可只存下三角；有向图一般不对称。邻接矩阵的存储空间为 O(n<sup>2</sup>)，判断两顶点是否相邻 O(1)，但遍历某顶点的所有邻接点需 O(n)。适合<strong>稠密图</strong>。</p>
          <pre class="code"><code>#define MAXV 100
typedef struct {
    ElemType vexs[MAXV];        // 顶点表
    int edges[MAXV][MAXV];      // 邻接矩阵
    int n, e;                   // 顶点数、边数
} MGraph;</code></pre>
          <h3 id="sec-ds6-store-h2">邻接表</h3>
          <p>为每个顶点建一个单链表，链表中存放该顶点的所有邻接点。顶点表用数组，每个数组元素含顶点信息与指向第一条边结点的指针；边结点含邻接点下标、权值（网）和指向下一条边的指针。</p>
          <p>邻接表的空间为 O(n + e)，适合<strong>稀疏图</strong>；找某顶点的全部邻接点很方便，但判断两顶点是否相邻需遍历链表。有向图的邻接表只记录出边；若需快速求入度，可另建<strong>逆邻接表</strong>。</p>
          <pre class="code"><code>typedef struct EdgeNode {
    int adjvex;                 // 邻接点下标
    int weight;                 // 权值（网）
    struct EdgeNode *next;      // 下一条边
} EdgeNode;

typedef struct {
    ElemType data;
    EdgeNode *first;            // 第一条边
} VexNode;

typedef struct {
    VexNode vexs[MAXV];
    int n, e;
} ALGraph;</code></pre>
          <div class="callout key">
            <p class="callout-h">选择</p>
            <p>稠密图或需频繁判断两点是否相邻 → 邻接矩阵；稀疏图或需频繁枚举邻接点 → 邻接表。两者的遍历时间分别为 O(n<sup>2</sup>) 与 O(n + e)。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds6-trav',
      heading: '3. 图的遍历算法及其应用',
      blocks: [
        {
          type: 'html',
          html: `
          <p>图的遍历从某顶点出发，沿边访问每个顶点恰好一次。为避免重复访问，需设<strong>访问标志数组</strong> visited[n]。</p>
          <h3 id="sec-ds6-trav-h1">深度优先搜索（DFS）</h3>
          <p>访问顶点 v，标记已访问；依次从 v 的每个未访问邻接点出发递归 DFS。DFS 类似树的先根遍历，借助系统栈实现。</p>
          <pre class="code"><code>void DFS(ALGraph *G, int v)
{
    EdgeNode *p;
    visited[v] = 1;
    visit(v);
    for (p = G-&gt;vexs[v].first; p; p = p-&gt;next)
        if (!visited[p-&gt;adjvex])
            DFS(G, p-&gt;adjvex);
}</code></pre>
          <p>邻接矩阵存储时 DFS 为 O(n<sup>2</sup>)；邻接表存储时为 O(n + e)。</p>
          <h3 id="sec-ds6-trav-h2">广度优先搜索（BFS）</h3>
          <p>访问起点 v 并标记；v 入队。队不空时出队顶点 u，依次访问 u 的所有未访问邻接点，标记后入队。BFS 类似树的层序遍历，借助队列实现，可求<strong>无权图的最短路径</strong>（边数最少）。</p>
          <p>非连通图需对所有未访问顶点依次调用 DFS/BFS，每次得到一个连通分量。遍历可用于判断连通性、求连通分量个数、检测回路等。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds6-mst',
      heading: '4. 最小生成树',
      blocks: [
        {
          type: 'html',
          html: `
          <p>连通网的<strong>生成树</strong>是含全部 n 个顶点、n−1 条边的极小连通子图。<strong>最小生成树</strong>是各边权值之和最小的生成树。MST 性质：设 U 是顶点集 V 的一个非空子集，若 (u, v) 是横跨 U 与 V−U 的权值最小的边，则必存在一棵包含 (u, v) 的最小生成树。</p>
          <h3 id="sec-ds6-mst-h1">Prim 算法</h3>
          <p>从任一顶点开始，每次选择连接「已选顶点集」与「未选顶点集」的<strong>权值最小边</strong>，把对应顶点加入集合，直到所有顶点都加入。适合<strong>稠密图</strong>，邻接矩阵实现时间 O(n<sup>2</sup>)。</p>
          <h3 id="sec-ds6-mst-h2">Kruskal 算法</h3>
          <p>把所有边按权值从小到大排序，依次考察：若边的两个端点不在同一连通分量中，则选入该边并合并分量；否则舍弃（会成环）。直到选够 n−1 条边。适合<strong>稀疏图</strong>，时间主要花在排序，为 O(e log e)。</p>
          <div class="callout tip">
            <p class="callout-h">共同点</p>
            <p>两种算法都基于贪心思想，且最小生成树的总权值唯一（当边权互不相同时树也唯一）。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds6-path',
      heading: '5. 最短路径',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds6-path-h1">Dijkstra 算法（单源最短路径）</h3>
          <p>求从源点 v<sub>0</sub> 到其余各顶点的最短路径，适用于<strong>权值非负</strong>的网。维护距离数组 dist[]，每轮从未确定顶点中选出 dist 最小者 u，将其确定为最短，然后用 u 松弛其邻接点：</p>
          <div class="formula">若 dist[u] + w(u, v) &lt; dist[v]，则 dist[v] = dist[u] + w(u, v)，并记 pred[v] = u</div>
          <p>邻接矩阵实现的时间复杂度为 O(n<sup>2</sup>)；用优先队列可优化到 O((n + e) log n)。</p>
          <h3 id="sec-ds6-path-h2">Floyd 算法（每对顶点间最短路径）</h3>
          <p>用二维数组 D 存各顶点间的最短距离，初始为邻接矩阵。依次以每个顶点 k 作为中间点，尝试改进所有顶点对：</p>
          <div class="formula">D[i][j] = min(D[i][j], D[i][k] + D[k][j])</div>
          <p>三重循环，时间复杂度 O(n<sup>3</sup>)，空间 O(n<sup>2</sup>)。Floyd 允许负权边（但不能有负权回路），代码简洁，适合求全源最短路径。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds6-dag',
      heading: '6. 有向无环图',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>有向无环图</strong>（DAG）是不含回路的有向图，常用于描述工程流程、表达式、依赖关系。</p>
          <h3 id="sec-ds6-dag-h1">拓扑排序</h3>
          <p><strong>AOV 网</strong>：顶点表示活动、弧表示活动间先后关系的有向图。拓扑序列是顶点的一个线性序列，使每条弧的起点都排在终点之前。</p>
          <p>拓扑排序步骤（Kahn 算法）：</p>
          <ol>
            <li>在有向图中选一个<strong>入度为 0</strong> 的顶点输出；</li>
            <li>删除该顶点及其所有出边（相应邻接点入度减 1）；</li>
            <li>重复上述两步，直到全部顶点输出，或图中仍有顶点但入度均不为 0。</li>
          </ol>
          <p>若输出的顶点数小于 n，说明图中存在<strong>回路</strong>，不存在拓扑序列。用栈或队列存放入度为 0 的顶点，时间复杂度 O(n + e)。拓扑序列可能不唯一。</p>
          <h3 id="sec-ds6-dag-h2">关键路径</h3>
          <p><strong>AOE 网</strong>：边表示活动、顶点表示事件的有向网，边权为活动持续时间。从源点到汇点的<strong>最长路径</strong>称为关键路径，其长度是整个工程的最短完成时间。</p>
          <ul>
            <li>事件 v<sub>j</sub> 的最早发生时间 ve(j)：从源点到 v<sub>j</sub> 的最长路径长度，按拓扑序递推；</li>
            <li>事件的最迟发生时间 vl(j)：在不推迟工期的前提下允许的最晚时间，按逆拓扑序递推；</li>
            <li>活动 a<sub>i</sub> = ⟨v<sub>j</sub>, v<sub>k</sub>⟩ 的最早开始时间 e(i) = ve(j)，最迟开始时间 l(i) = vl(k) − w；</li>
            <li><strong>时间余量</strong> l(i) − e(i) = 0 的活动为<strong>关键活动</strong>，关键活动组成关键路径。</li>
          </ul>
          <p>缩短关键活动的持续时间可能缩短工期，但缩短到一定程度后关键路径会改变，需重新计算。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

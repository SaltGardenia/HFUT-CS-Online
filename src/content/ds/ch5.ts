/* 数据结构 · 第5章 树 —— 依据课件《第5章树》与 2021 版《第八章树与二叉树》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch5',
  no: '第5章',
  title: '树',
  subtitle: '第 5 章 · 树',
  lede: `
  树是一种<strong>一对多</strong>的层次结构，用来描述具有分支关系的数据。本章从树的定义与术语出发，
  重点讨论<strong>二叉树</strong>的性质、存储与遍历，再扩展到线索二叉树、树与森林的转换，最后给出<strong>哈夫曼树</strong>及其编码应用。
`,
  toc: [
    { id: 'sec-ds5-tree', text: '1. 树的概念和基本运算', level: 2 },
    { id: 'sec-ds5-btree', text: '2. 二叉树', level: 2 },
    { id: 'sec-ds5-trav', text: '3. 二叉树的遍历', level: 2 },
    { id: 'sec-ds5-thread', text: '4. 线索二叉树', level: 2 },
    { id: 'sec-ds5-forest', text: '5. 树和森林', level: 2 },
    { id: 'sec-ds5-huffman', text: '6. 哈夫曼树', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds5-tree',
      heading: '1. 树的概念和基本运算',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>树</strong>是 n（n ≥ 0）个结点的有限集合 T。当 n = 0 时为空树；当 n &gt; 0 时，有且仅有一个特定的结点称为<strong>根</strong>，其余结点可分为 m（m ≥ 0）个互不相交的有限集合 T<sub>1</sub>, …, T<sub>m</sub>，每个集合又是一棵树，称为根的<strong>子树</strong>。</p>
          <p>树是递归定义的：一棵树的子树仍是树。基本术语：</p>
          <ul>
            <li><strong>结点的度</strong>：结点拥有的子树个数；<strong>树的度</strong>：树内各结点度的最大值；</li>
            <li><strong>叶子</strong>（终端结点）：度为 0 的结点；<strong>分支结点</strong>：度不为 0 的结点；</li>
            <li><strong>孩子</strong>、<strong>双亲</strong>、<strong>兄弟</strong>：结点之间上下层与同层关系；</li>
            <li><strong>层次</strong>：根为第 1 层，其孩子为第 2 层，依次类推；<strong>深度</strong>（高度）：树中结点的最大层次；</li>
            <li><strong>森林</strong>：m（m ≥ 0）棵互不相交的树的集合。</li>
          </ul>
          <p>树的基本运算：求根、求双亲、求孩子、求兄弟、建树、遍历等。树的遍历有先根遍历与后根遍历；森林有先序遍历与后序遍历，均可递归实现。</p>
          <div class="callout tip">
            <p class="callout-h">性质</p>
            <p>树中结点总数 = 所有结点的度之和 + 1；度为 m 的树中第 i 层至多有 m<sup>i−1</sup> 个结点。这两个结论在计算题中经常用到。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds5-btree',
      heading: '2. 二叉树',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>二叉树</strong>是 n（n ≥ 0）个结点的有限集合，它或为空树，或由一个根结点及两棵互不相交的、分别称为<strong>左子树</strong>和<strong>右子树</strong>的二叉树组成。二叉树的左右子树<strong>有序</strong>，不能随意交换，这是它与度为 2 的普通树的区别。</p>
          <p>几种特殊形态：<strong>满二叉树</strong>（每层结点数都达到最大）、<strong>完全二叉树</strong>（除最后一层外每层都满，最后一层的结点集中在左侧）、<strong>斜树</strong>（所有结点只有左孩子或只有右孩子）。</p>
          <h3 id="sec-ds5-btree-h1">二叉树的性质</h3>
          <div class="formula">① 第 i 层至多有 2<sup>i−1</sup> 个结点（i ≥ 1）</div>
          <div class="formula">② 深度为 k 的二叉树至多有 2<sup>k</sup> − 1 个结点</div>
          <div class="formula">③ 对任何二叉树，若叶子数为 n<sub>0</sub>、度为 2 的结点数为 n<sub>2</sub>，则 n<sub>0</sub> = n<sub>2</sub> + 1</div>
          <div class="formula">④ 具有 n 个结点的完全二叉树深度为 ⌊log<sub>2</sub>n⌋ + 1</div>
          <p>完全二叉树按层序从 1 开始编号，则结点 i 的双亲为 ⌊i/2⌋，左孩子为 2i，右孩子为 2i + 1（若存在）。这个编号规律使完全二叉树可以顺序存储而无需指针。</p>
          <h3 id="sec-ds5-btree-h2">存储结构</h3>
          <p><strong>顺序存储</strong>：按完全二叉树的编号把结点存入一维数组。对完全二叉树最省空间；对一般二叉树，为保持编号关系会浪费大量空单元，斜树时尤其严重。</p>
          <p><strong>链式存储</strong>：每个结点设数据域和左、右孩子指针，称<strong>二叉链表</strong>；若再增设双亲指针则为<strong>三叉链表</strong>。</p>
          <pre class="code"><code>typedef struct BiTNode {
    ElemType data;
    struct BiTNode *lchild, *rchild;   // 左右孩子指针
} BiTNode, *BiTree;</code></pre>
          <p>n 个结点的二叉链表共有 2n 个指针域，其中只有 n − 1 个用于指向孩子，其余 n + 1 个为空——这正是线索二叉树可以利用的空指针。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds5-trav',
      heading: '3. 二叉树的遍历',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>遍历</strong>：按某条搜索路径访问二叉树中的每个结点，且每个结点只访问一次。若限定「先左后右」，按访问根结点的时机分为三种：</p>
          <table class="tbl">
            <thead><tr><th>方式</th><th>访问次序</th><th>特点</th></tr></thead>
            <tbody>
              <tr><td>先序遍历</td><td>根 → 左子树 → 右子树</td><td>第一个结点是根</td></tr>
              <tr><td>中序遍历</td><td>左子树 → 根 → 右子树</td><td>二叉排序树的中序序列有序</td></tr>
              <tr><td>后序遍历</td><td>左子树 → 右子树 → 根</td><td>最后一个结点是根</td></tr>
            </tbody>
          </table>
          <pre class="code"><code>void InOrder(BiTree T)          // 中序遍历（递归）
{
    if (T) {
        InOrder(T-&gt;lchild);     // 遍历左子树
        visit(T);               // 访问根结点
        InOrder(T-&gt;rchild);     // 遍历右子树
    }
}</code></pre>
          <p>递归遍历的时间复杂度为 O(n)，辅助空间为递归栈深度，最坏 O(n)、平均 O(log n)。非递归遍历需显式使用栈：先序在入栈前访问，中序在出栈时访问，后序需记录上一个访问的结点以判断右子树是否已处理。</p>
          <p><strong>层序遍历</strong>借助队列：根入队；队不空时出队并访问，再把其左右孩子依次入队。层序遍历按层次自上而下、同层自左向右访问。</p>
          <h3 id="sec-ds5-trav-h1">由遍历序列确定二叉树</h3>
          <p>先序序列的第一个结点是根，在中序序列中找到该结点即可划分左右子树，再对子树递归。因此<strong>先序 + 中序</strong>或<strong>后序 + 中序</strong>可以唯一确定一棵二叉树；仅有先序 + 后序一般不能确定。</p>
          <p>遍历算法还可用于求结点数、叶子数、树的深度、复制二叉树、判断两树是否相同等。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds5-thread',
      heading: '4. 线索二叉树',
      blocks: [
        {
          type: 'html',
          html: `
          <p>二叉链表中有 n + 1 个空指针域。把这些空指针利用起来，指向结点在某种遍历次序下的<strong>前驱</strong>或<strong>后继</strong>，就得到<strong>线索二叉树</strong>。指向前驱/后继的指针称为线索。</p>
          <p>为区分指针指向孩子还是线索，结点增设两个标志位：</p>
          <ul>
            <li>ltag = 0：lchild 指向左孩子；ltag = 1：lchild 指向前驱线索；</li>
            <li>rtag = 0：rchild 指向右孩子；rtag = 1：rchild 指向后继线索。</li>
          </ul>
          <pre class="code"><code>typedef struct ThrNode {
    ElemType data;
    struct ThrNode *lchild, *rchild;
    int ltag, rtag;                 // 0 孩子，1 线索
} ThrNode, *ThrTree;</code></pre>
          <p>按遍历次序不同，分为先序线索树、中序线索树、后序线索树。以中序线索树为例，找结点 p 的后继：若 rtag = 1，rchild 即后继；若 rtag = 0，则后继为 p 的右子树中最左下的结点。找前驱对称处理。</p>
          <p>线索化的过程就是在遍历过程中把空指针改为线索，并用标志位标记。线索二叉树使遍历不再需要栈，空间复杂度降为 O(1)，适合需要频繁查找前驱/后继的场合。</p>
          <div class="callout tip">
            <p class="callout-h">注意</p>
            <p>线索化后，原来的空指针被占用，插入、删除结点时要维护线索，操作比普通二叉链表复杂。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds5-forest',
      heading: '5. 树和森林',
      blocks: [
        {
          type: 'html',
          html: `
          <p>树的常用存储结构：</p>
          <ul>
            <li><strong>双亲表示法</strong>：一组连续空间存结点，每个结点记录双亲下标。找双亲 O(1)，找孩子需遍历；</li>
            <li><strong>孩子表示法</strong>：每个结点后接孩子链表，找孩子方便；</li>
            <li><strong>孩子兄弟表示法</strong>（二叉链表表示法）：每个结点设<strong>第一个孩子</strong>指针与<strong>下一个兄弟</strong>指针，可把任意树表示为二叉树。</li>
          </ul>
          <p><strong>树转换为二叉树</strong>：加线（兄弟之间加一条连线）→ 抹线（每个结点只保留与第一个孩子的连线）→ 旋转（以根为轴顺时针旋转 45°）。转换后，二叉树的左孩子是原树的第一个孩子，右孩子是原结点的下一个兄弟。</p>
          <p><strong>森林转换为二叉树</strong>：先把每棵树转换为二叉树，再依次把后一棵树的根作为前一棵树根的右孩子连接起来。</p>
          <p><strong>遍历对应关系</strong>：树的先根遍历对应二叉树的先序遍历；树的后根遍历对应二叉树的中序遍历。森林的先序遍历、后序遍历也分别对应其二叉树的先序、中序遍历。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds5-huffman',
      heading: '6. 哈夫曼树',
      blocks: [
        {
          type: 'html',
          html: `
          <p>结点的<strong>路径长度</strong>是从根到该结点所经过的边数；树的<strong>带权路径长度</strong> WPL 为所有叶子结点的权值与其路径长度乘积之和：</p>
          <div class="formula">WPL = Σ w<sub>i</sub> × l<sub>i</sub>（i = 1, 2, …, n）</div>
          <p>在含有 n 个带权叶子的二叉树中，<strong>WPL 最小</strong>的二叉树称为<strong>哈夫曼树</strong>（最优二叉树）。</p>
          <h3 id="sec-ds5-huffman-h1">构造方法</h3>
          <ol>
            <li>把 n 个权值看作 n 棵只有根结点的二叉树，组成森林；</li>
            <li>从森林中选出两棵根权值最小的树，合并为一棵新树，新根权值为两子树权值之和；</li>
            <li>把新树放回森林，重复上一步，直到森林中只剩一棵树。</li>
          </ol>
          <p>哈夫曼树中不存在度为 1 的结点；n 个叶子的哈夫曼树共有 2n − 1 个结点。权值越大的叶子离根越近。</p>
          <h3 id="sec-ds5-huffman-h2">哈夫曼编码</h3>
          <p>以各字符的使用频率为权值构造哈夫曼树，左分支标 0、右分支标 1，从根到叶子的路径即为该字符的编码。这样得到的是<strong>前缀编码</strong>：任一编码都不是另一编码的前缀，解码无二义性，且平均码长（即 WPL）最短。</p>
          <div class="callout key">
            <p class="callout-h">例</p>
            <p>权值 {5, 2, 4, 6, 1}：先合并 1 + 2 = 3，再合并 3 + 4 = 7，然后 5 + 6 = 11，最后 7 + 11 = 18。WPL = 5×2 + 2×3 + 4×2 + 6×2 + 1×3 = 39（按具体合并次序可能不同，但最小 WPL 唯一）。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

/* 数据结构 · 第2章 线性表 —— 依据课件《第2章线性表》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch2',
  no: '第2章',
  title: '线性表',
  subtitle: '第 2 章 · 线性表',
  lede: `
  线性表是最简单、最常用的一种数据结构，也是后续栈、队列、串等结构的基础。
  本章先给出线性表的定义和基本运算，再分别讨论<strong>顺序存储</strong>与<strong>链式存储</strong>两种实现，
  比较它们在插入、删除、查找上的时间代价，最后介绍循环链表等变形。
`,
  toc: [
    { id: 'sec-ds2-def', text: '1. 线性表的定义和运算', level: 2 },
    { id: 'sec-ds2-seq', text: '2. 顺序表', level: 2 },
    { id: 'sec-ds2-link', text: '3. 链表', level: 2 },
    { id: 'sec-ds2-other', text: '4. 其它结构形式的链表', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds2-def',
      heading: '1. 线性表的定义和运算',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>线性表</strong>是由 n（n ≥ 0）个类型相同的数据元素组成的有限序列，记为 (a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>)。n 为表长，n = 0 时称为空表。</p>
          <p>除第一个元素外，每个元素有且仅有一个<strong>直接前驱</strong>；除最后一个元素外，每个元素有且仅有一个<strong>直接后继</strong>。元素之间的这种一对一关系就是线性结构。</p>
          <p>线性表的基本运算包括：</p>
          <ul>
            <li><strong>初始化</strong> InitList(L)：构造一个空表；</li>
            <li><strong>求长度</strong> ListLength(L)；<strong>取元素</strong> GetElem(L, i)；</li>
            <li><strong>定位</strong> LocateElem(L, e)：返回第一个值为 e 的元素位置；</li>
            <li><strong>插入</strong> ListInsert(L, i, e)：在第 i 个位置前插入 e；</li>
            <li><strong>删除</strong> ListDelete(L, i)：删除第 i 个元素；</li>
            <li><strong>判空</strong> ListEmpty(L)、<strong>遍历</strong> ListTraverse(L)。</li>
          </ul>
          <div class="callout tip">
            <p class="callout-h">提示</p>
            <p>运算的定义只依赖逻辑结构；同一种运算在不同存储结构上的实现不同，时间复杂度也不同。这正是本章比较顺序表与链表的原因。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds2-seq',
      heading: '2. 顺序表',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>顺序存储结构</strong>：用一组地址连续的存储单元依次存放线性表的元素，逻辑上相邻的元素物理位置也相邻。以元素在数组中的下标表示其逻辑位置，通常用一维数组和表长两个成员描述：</p>
          <pre class="code"><code>#define MAXSIZE 100          // 表的最大长度
typedef int ElemType;
typedef struct {
    ElemType data[MAXSIZE];  // 存放元素的数组
    int length;              // 当前表长
} SqList;</code></pre>
          <p>由于元素类型相同、地址连续，第 i 个元素的存储地址可直接计算：</p>
          <div class="formula">LOC(a<sub>i</sub>) = LOC(a<sub>1</sub>) + (i − 1) × sizeof(ElemType)</div>
          <p>因此<strong>按位置存取</strong>的时间为 O(1)，这是顺序表的随机存取特性。</p>
          <h3 id="sec-ds2-seq-h1">插入与删除</h3>
          <p>在第 i 个位置插入元素，需要把第 i 至第 n 个元素依次后移一位，再写入新元素，表长加 1；删除第 i 个元素，需要把第 i+1 至第 n 个元素依次前移一位，表长减 1。</p>
          <pre class="code"><code>int ListInsert(SqList *L, int i, ElemType e)
{
    int j;
    if (i &lt; 1 || i &gt; L-&gt;length + 1) return 0;   // 位置不合法
    if (L-&gt;length == MAXSIZE) return 0;        // 表满
    for (j = L-&gt;length - 1; j &gt;= i - 1; j--)   // 从表尾开始后移
        L-&gt;data[j + 1] = L-&gt;data[j];
    L-&gt;data[i - 1] = e;
    L-&gt;length++;
    return 1;
}</code></pre>
          <p>插入时平均移动元素次数为 n/2，删除时为 (n−1)/2，因此插入、删除的时间复杂度均为 <strong>O(n)</strong>。</p>
          <div class="table-wrap">
            <table class="tbl">
              <thead><tr><th>操作</th><th>顺序表</th><th>说明</th></tr></thead>
              <tbody>
                <tr><td>按位置取值</td><td>O(1)</td><td>随机存取，直接按下标访问</td></tr>
                <tr><td>查找值为 e 的元素</td><td>O(n)</td><td>需顺序比较</td></tr>
                <tr><td>插入 / 删除</td><td>O(n)</td><td>平均移动约一半元素</td></tr>
              </tbody>
            </table>
          </div>
          <p>顺序表的优点是存储密度高（只存元素，不存指针）、可随机存取；缺点是插入删除需大量移动元素、表容量固定、难以动态扩充。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds2-link',
      heading: '3. 链表',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>链式存储结构</strong>用一组任意的存储单元存放元素，每个结点除数据域外还设指针域，存放直接后继的地址。逻辑相邻的元素物理上不必相邻，元素间关系由指针体现。</p>
          <pre class="code"><code>typedef struct LNode {
    ElemType data;           // 数据域
    struct LNode *next;      // 指针域，指向直接后继
} LNode, *LinkList;</code></pre>
          <p>为方便插入、删除，通常在第一个结点之前附设一个<strong>头结点</strong>：头结点的数据域不存有效元素，指针指向首元结点。这样对第一个位置的操作与其它位置一致，空表与非空表的处理也统一。</p>
          <h3 id="sec-ds2-link-h1">基本运算</h3>
          <p><strong>按序号查找</strong>：从首元结点出发沿 next 走 i−1 步，时间 O(n)。<strong>按值查找</strong>：逐个比较，时间 O(n)。</p>
          <p><strong>插入</strong>：在第 i 个位置插入，先找到第 i−1 个结点 p，再修改指针：</p>
          <div class="formula">s-&gt;next = p-&gt;next;  p-&gt;next = s;</div>
          <p>两条语句顺序不能颠倒，否则会丢失 p 之后的链表。</p>
          <p><strong>删除</strong>：找到第 i−1 个结点 p，令 q = p-&gt;next，再执行 p-&gt;next = q-&gt;next，最后释放 q。若已知待删结点的前驱，插入与删除都只需 O(1)；但定位前驱本身需要 O(n)。</p>
          <pre class="code"><code>int ListDelete(LinkList L, int i, ElemType *e)
{
    LNode *p = L, *q;
    int j = 0;
    while (p &amp;&amp; j &lt; i - 1) { p = p-&gt;next; j++; }   // 找第 i-1 个结点
    if (!p || !p-&gt;next) return 0;                 // i 不合法
    q = p-&gt;next;
    *e = q-&gt;data;
    p-&gt;next = q-&gt;next;
    free(q);
    return 1;
}</code></pre>
          <p><strong>建立链表</strong>：头插法把新结点插在头结点之后，得到的次序与输入相反；尾插法设尾指针 r，每次接在表尾，保持输入次序。</p>
          <div class="callout key">
            <p class="callout-h">顺序表 vs 链表</p>
            <ul>
              <li>顺序表：随机存取 O(1)，插入删除 O(n)，存储密度高，容量固定；</li>
              <li>链表：按位置访问 O(n)，已知前驱时插入删除 O(1)，存储密度较低（额外指针域），容量可动态增长。</li>
            </ul>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds2-other',
      heading: '4. 其它结构形式的链表',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>单循环链表</strong>：将表中最后一个结点的 next 指向头结点（或首元结点），整个链表形成一个环。从任一结点出发都能遍历全表；判断遍历结束的条件由 p == NULL 改为 p == 头结点。</p>
          <p><strong>带尾指针的单循环链表</strong>：设尾指针 rear，则 rear-&gt;next 就是首元结点。在表头插入、在表尾插入都只需 O(1)，并且把两个循环链表连接起来也很方便：</p>
          <div class="formula">p = rearA-&gt;next;  rearA-&gt;next = rearB-&gt;next-&gt;next;  rearB-&gt;next = p;  free(rearB-&gt;next)</div>
          <p><strong>双向链表</strong>：每个结点增设前驱指针 prior，可双向遍历。插入时需同时修改四个指针，删除时需修改两个方向上的指针，指针修改的顺序要保证不断链。</p>
          <pre class="code"><code>typedef struct DuLNode {
    ElemType data;
    struct DuLNode *prior, *next;
} DuLNode, *DuLinkList;</code></pre>
          <p>双向循环链表中，若结点 p 非表尾，则 p-&gt;next-&gt;prior == p；删除 p 只需 p-&gt;prior-&gt;next = p-&gt;next; p-&gt;next-&gt;prior = p-&gt;prior。</p>
          `,
        },
      ],
    },
  ],
};

export default ch;

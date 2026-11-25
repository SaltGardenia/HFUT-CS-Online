/* 数据结构 · 第7章 查找 —— 依据课件《第7章查找》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch7',
  no: '第7章',
  title: '查找',
  subtitle: '第 7 章 · 查找',
  lede: `
  查找是在数据集合中找出满足给定条件的元素。本章按存储结构依次讨论<strong>顺序表的查找</strong>（顺序、二分、索引）、
  <strong>树表的查找</strong>（二叉排序树、平衡二叉树）与<strong>散列表的查找</strong>，并用平均查找长度 ASL 衡量效率。
`,
  toc: [
    { id: 'sec-ds7-intro', text: '1. 概述', level: 2 },
    { id: 'sec-ds7-seq', text: '2. 顺序表的查找', level: 2 },
    { id: 'sec-ds7-tree', text: '3. 树表的查找', level: 2 },
    { id: 'sec-ds7-hash', text: '4. 散列表的查找', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds7-intro',
      heading: '1. 概述',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>查找表</strong>是由同一类型数据元素构成的集合。查找即在表中找出关键字等于给定值的数据元素。查找的结果有两种：找到（可返回元素位置或信息）与未找到。</p>
          <p>查找表的操作分两类：<strong>静态查找表</strong>只做查找、不改变表；<strong>动态查找表</strong>在查找过程中可能插入或删除元素。</p>
          <p>衡量查找算法效率的主要指标是<strong>平均查找长度</strong>（ASL，Average Search Length）：</p>
          <div class="formula">ASL = Σ p<sub>i</sub> × c<sub>i</sub>（i = 1, 2, …, n）</div>
          <p>其中 p<sub>i</sub> 是查找第 i 个元素的概率，c<sub>i</sub> 是找到它所需的比较次数。等概率时 p<sub>i</sub> = 1/n。ASL 分查找成功与查找失败两种情况。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds7-seq',
      heading: '2. 顺序表的查找',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds7-seq-h1">简单顺序查找</h3>
          <p>从表的一端开始逐个比较关键字，找到则返回位置，否则查找失败。可设「哨兵」省去边界判断。查找成功时 ASL = (n + 1)/2，时间复杂度 O(n)。对表的有序性无要求，插入删除方便。</p>
          <h3 id="sec-ds7-seq-h2">有序表的二分查找</h3>
          <p>要求表<strong>按关键字有序</strong>且<strong>顺序存储</strong>。每次取中间元素 mid = ⌊(low + high)/2⌋ 与给定值比较：相等则找到；给定值较小则在高半区继续，较大则在低半区继续。查找区间每次减半。</p>
          <pre class="code"><code>int BinarySearch(int a[], int n, int key)
{
    int low = 0, high = n - 1, mid;
    while (low &lt;= high) {
        mid = (low + high) / 2;
        if (a[mid] == key) return mid;
        else if (a[mid] &gt; key) high = mid - 1;
        else low = mid + 1;
    }
    return -1;                       // 查找失败
}</code></pre>
          <p>二分查找的比较次数不超过 ⌊log<sub>2</sub>n⌋ + 1，时间复杂度 O(log n)。其判定树是一棵平衡的二叉排序树，ASL 约为 log<sub>2</sub>(n + 1) − 1。二分查找只适合静态表；频繁插入删除会破坏有序性。</p>
          <h3 id="sec-ds7-seq-h3">索引顺序表的查找</h3>
          <p>把表分成若干<strong>块</strong>，块内元素无序、块间有序（前一块的最大关键字小于后一块的最小关键字），另建<strong>索引表</strong>记录每块的最大关键字与起始位置。查找时先在索引表中确定块（可顺序或二分），再在块内顺序查找。平均性能介于顺序查找与二分查找之间，适合分块动态变化的表。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds7-tree',
      heading: '3. 树表的查找',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds7-tree-h1">二叉排序树</h3>
          <p><strong>二叉排序树</strong>（BST）或为空树，或满足：左子树上所有结点的关键字小于根，右子树上所有结点的关键字大于根，左右子树本身也是二叉排序树。</p>
          <p>查找：从根开始，给定值小于当前结点则进左子树，大于则进右子树，相等则找到。插入：按查找路径走到空位置挂上新结点。删除分三种情况：叶子直接删；只有一个孩子用孩子替代；有两个孩子用<strong>中序前驱</strong>（左子树最大）或<strong>中序后继</strong>（右子树最小）替代，再删除替代结点。</p>
          <p>BST 的<strong>中序遍历</strong>得到递增有序序列。查找、插入、删除的时间复杂度均为 O(h)，h 为树高。最好情况（平衡）O(log n)，最坏（退化为单支树）O(n)。</p>
          <h3 id="sec-ds7-tree-h2">平衡二叉树</h3>
          <p><strong>平衡二叉树</strong>（AVL 树）是任一结点的左右子树高度之差的绝对值不超过 1 的二叉排序树。结点的<strong>平衡因子</strong> BF = 左子树高度 − 右子树高度，取值只能是 −1、0、1。</p>
          <p>插入结点可能破坏平衡，需找到<strong>最小不平衡子树</strong>并旋转调整，分四种情形：</p>
          <table class="tbl">
            <thead><tr><th>类型</th><th>插入位置</th><th>调整</th></tr></thead>
            <tbody>
              <tr><td>LL</td><td>左孩子的左子树</td><td>右旋（一次）</td></tr>
              <tr><td>RR</td><td>右孩子的右子树</td><td>左旋（一次）</td></tr>
              <tr><td>LR</td><td>左孩子的右子树</td><td>先左旋后右旋</td></tr>
              <tr><td>RL</td><td>右孩子的左子树</td><td>先右旋后左旋</td></tr>
            </tbody>
          </table>
          <p>AVL 树的高度为 O(log n)，因此查找、插入、删除均为 O(log n)。插入最多只需一次旋转（LL/RR 一次，LR/RL 两次）即可恢复平衡；删除可能需要沿路径多次调整。</p>
          <div class="callout tip">
            <p class="callout-h">判断类型</p>
            <p>看最小不平衡子树的根到新插入结点的路径：向左两次为 LL，向右两次为 RR，先左后右为 LR，先右后左为 RL。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds7-hash',
      heading: '4. 散列表的查找',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>散列表</strong>（哈希表）通过<strong>散列函数</strong> H(key) 把关键字直接映射到存储位置，理想情况下一次存取即可找到，平均查找时间 O(1)。</p>
          <p>不同关键字可能映射到同一地址，称<strong>冲突</strong>（碰撞）；发生冲突的两个关键字互称<strong>同义词</strong>。冲突不可避免，只能尽量减少并妥善处理。</p>
          <h3 id="sec-ds7-hash-h1">散列函数的构造</h3>
          <ul>
            <li><strong>直接定址法</strong>：H(key) = a × key + b，无冲突，适合关键字连续；</li>
            <li><strong>除留余数法</strong>：H(key) = key mod p，p 取不大于表长的最大素数，最常用；</li>
            <li><strong>数字分析法</strong>：选取关键字中分布均匀的若干位；</li>
            <li><strong>平方取中法</strong>：取关键字平方后的中间几位；</li>
            <li><strong>折叠法</strong>：把关键字分段相加。</li>
          </ul>
          <h3 id="sec-ds7-hash-h2">处理冲突的方法</h3>
          <p><strong>开放定址法</strong>：H<sub>i</sub> = (H(key) + d<sub>i</sub>) mod m。线性探测 d<sub>i</sub> = 1, 2, 3, … 会产生<strong>堆积</strong>（聚集）；二次探测 d<sub>i</sub> = 1<sup>2</sup>, −1<sup>2</sup>, 2<sup>2</sup>, −2<sup>2</sup>, … 可减轻堆积；伪随机探测取伪随机序列。</p>
          <p><strong>链地址法</strong>：同一散列地址的关键字组成单链表，散列表存各链表头指针。无堆积、删除方便，适合冲突较多的场合。</p>
          <p>散列表的<strong>装填因子</strong> α = 表中记录数 / 散列表长度。α 越大冲突越多，查找效率越低；开放定址法要求 α &lt; 1。ASL 主要取决于 α，而与表长无直接关系。</p>
          <div class="callout key">
            <p class="callout-h">查找过程</p>
            <p>按散列函数算出地址，比较该位置关键字；若不符，按冲突处理方法继续探测，直到找到或遇到空单元（开放定址）／链表结束（链地址）。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

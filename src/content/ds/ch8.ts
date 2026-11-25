/* 数据结构 · 第8章 排序 —— 依据课件《第8章排序》与 2021 版《第十一章 排序》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch8',
  no: '第8章',
  title: '排序',
  subtitle: '第 8 章 · 排序',
  lede: `
  排序把数据表按关键字调整为有序序列，是查找、统计与很多算法的基础。
  本章按方法分类讨论<strong>插入排序</strong>、<strong>交换排序</strong>、<strong>选择排序</strong>、<strong>归并排序</strong>和<strong>基数排序</strong>，
  并从时间、空间、稳定性三方面比较它们的适用场合。
`,
  toc: [
    { id: 'sec-ds8-intro', text: '1. 概述', level: 2 },
    { id: 'sec-ds8-insert', text: '2. 插入排序', level: 2 },
    { id: 'sec-ds8-swap', text: '3. 交换排序', level: 2 },
    { id: 'sec-ds8-select', text: '4. 选择排序', level: 2 },
    { id: 'sec-ds8-merge', text: '5. 归并排序', level: 2 },
    { id: 'sec-ds8-other', text: '6. 其它排序方法', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds8-intro',
      heading: '1. 概述',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>排序</strong>：将数据表调整为按关键字从小到大（升序）或从大到小（降序）排列的过程。若关键字互不相同，排序结果唯一；若存在相同关键字，则需考虑<strong>稳定性</strong>。</p>
          <p><strong>稳定性</strong>：若排序前后两个相等元素的相对次序保持不变，称该排序方法是稳定的；否则不稳定。</p>
          <p>按存储位置分：<strong>内部排序</strong>（数据全部在内存中）与<strong>外部排序</strong>（数据量大，需借助外存）。本章讨论内部排序。按工作量分：简单排序 O(n<sup>2</sup>) 与先进排序 O(n log n)。</p>
          <p>评价排序算法的指标：时间复杂度（比较次数与移动次数）、空间复杂度（辅助空间）、稳定性，以及算法实现的复杂性。</p>
          <div class="callout tip">
            <p class="callout-h">总体对比</p>
            <p>直接插入、冒泡、归并、基数排序稳定；希尔、快速、直接选择、堆排序不稳定。快速、堆、归并可达 O(n log n)。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds8-insert',
      heading: '2. 插入排序',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds8-insert-h1">直接插入排序</h3>
          <p>把数据表分为「已排序区」与「未排序区」。初始时已排序区只含第一个元素；每趟取未排序区的第一个元素，在已排序区中从后向前比较，找到合适位置插入，已排序区扩大一个元素。</p>
          <pre class="code"><code>void InsertSort(int a[], int n)
{
    int i, j, t;
    for (i = 1; i &lt; n; i++) {
        t = a[i];                       // 待插入元素
        for (j = i - 1; j &gt;= 0 &amp;&amp; a[j] &gt; t; j--)
            a[j + 1] = a[j];            // 后移
        a[j + 1] = t;
    }
}</code></pre>
          <p>最好情况（原表有序）比较 n−1 次、移动 0 次，O(n)；最坏与平均 O(n<sup>2</sup>)。空间 O(1)。直接插入排序<strong>稳定</strong>，适合 n 较小或基本有序的表。</p>
          <h3 id="sec-ds8-insert-h2">希尔排序</h3>
          <p>希尔排序（缩小增量排序）是对直接插入排序的改进：取一个增量 d，把相隔 d 的元素分为一组，组内直接插入排序；然后减小 d 重复，直到 d = 1。</p>
          <p>由于前期增量大，元素可以大步移动，快速接近最终位置；最后一趟 d = 1 时表已基本有序，插入排序效率很高。增量序列的取法影响性能，常用 d = n/2, n/4, …, 1。</p>
          <p>希尔排序的时间复杂度与增量序列有关，约为 O(n<sup>1.3</sup>)～O(n<sup>2</sup>)，空间 O(1)。它是<strong>不稳定</strong>排序，因为相同元素可能被分到不同组而改变相对次序。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds8-swap',
      heading: '3. 交换排序',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds8-swap-h1">冒泡排序</h3>
          <p>从表头开始，依次比较相邻两个元素，若逆序则交换；一趟结束后，最大元素「冒」到表尾。对剩余部分重复，n−1 趟后有序。若某趟没有发生交换，说明表已有序，可提前结束。</p>
          <p>最好情况（有序）比较 n−1 次、不交换，O(n)；最坏与平均 O(n<sup>2</sup>)，移动次数最多 O(n<sup>2</sup>)。空间 O(1)。冒泡排序<strong>稳定</strong>。</p>
          <h3 id="sec-ds8-swap-h2">快速排序</h3>
          <p>任取一个元素作为<strong>基准</strong>（pivot），通过一趟划分把表分成两部分：左边元素都不大于基准，右边元素都不小于基准，基准落在最终位置；再对左右子表递归快排。</p>
          <pre class="code"><code>void QuickSort(int a[], int s, int t)
{
    int i = s, j = t, p = a[s];         // 以首元素为基准
    if (s &gt;= t) return;
    while (i &lt; j) {
        while (i &lt; j &amp;&amp; a[j] &gt;= p) j--;
        a[i] = a[j];
        while (i &lt; j &amp;&amp; a[i] &lt;= p) i++;
        a[j] = a[i];
    }
    a[i] = p;                            // 基准归位
    QuickSort(a, s, i - 1);
    QuickSort(a, i + 1, t);
}</code></pre>
          <p>平均时间 O(n log n)，平均空间 O(log n)（递归栈）；最坏情况（每次划分极不平衡，如表已有序且取首元素为基准）时间 O(n<sup>2</sup>)、空间 O(n)。快速排序是<strong>不稳定</strong>排序，但平均性能最好，是内部排序的常用选择。</p>
          <div class="callout tip">
            <p class="callout-h">避免最坏</p>
            <p>可采用「三者取中」选基准或随机选基准，降低划分极不平衡的概率。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds8-select',
      heading: '4. 选择排序',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds8-select-h1">直接选择排序</h3>
          <p>每趟从无序区中选出最小元素，与无序区第一个元素交换，使有序区扩大一个元素。无论初始状态如何，比较次数都是 n(n−1)/2，时间复杂度 O(n<sup>2</sup>)；移动次数较少，最多 n−1 次。空间 O(1)。直接选择排序<strong>不稳定</strong>（交换可能把相等元素的前后次序打乱）。</p>
          <h3 id="sec-ds8-select-h2">堆排序</h3>
          <p><strong>堆</strong>是满足下列性质的完全二叉树：每个结点的关键字都不大于（<strong>小根堆</strong>）或不小于（<strong>大根堆</strong>）其左右孩子的关键字。用数组顺序存储，下标 i 的左右孩子为 2i 与 2i+1。</p>
          <p>堆排序步骤：</p>
          <ol>
            <li>把无序序列<strong>建堆</strong>：从最后一个非叶结点 ⌊n/2⌋ 开始向前，对每个结点执行「向下调整」（筛选）；</li>
            <li>取堆顶（最大值）与末尾元素交换，堆的规模减 1；</li>
            <li>对新堆顶向下调整，重复直到堆中只剩一个元素。</li>
          </ol>
          <p>建堆时间 O(n)，每次调整 O(log n)，共 n−1 次，总时间 O(n log n)（最好、最坏、平均相同）。空间 O(1)。堆排序<strong>不稳定</strong>，适合 n 较大且不要求稳定的场合。</p>
          <div class="formula">大根堆：a[i] ≥ a[2i] 且 a[i] ≥ a[2i+1]；排序结果为升序</div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds8-merge',
      heading: '5. 归并排序',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>归并</strong>：把两个或多个有序表合并成一个有序表。两个有序表归并时，设两个指针分别指向两表首元素，每次取较小者放入结果表，指针后移，直到一个表取完，再把另一表剩余元素依次复制。</p>
          <p><strong>二路归并排序</strong>：把长度为 n 的表看成 n 个长度为 1 的有序子表，两两归并得到 ⌈n/2⌉ 个长度为 2 的有序子表；再两两归并，重复直到只剩一个有序表。</p>
          <pre class="code"><code>void Merge(int a[], int t[], int l, int m, int r)
{
    int i = l, j = m + 1, k = l;
    while (i &lt;= m &amp;&amp; j &lt;= r)                 // 合并两个有序段
        t[k++] = (a[i] &lt;= a[j]) ? a[i++] : a[j++];
    while (i &lt;= m) t[k++] = a[i++];          // 复制剩余部分
    while (j &lt;= r) t[k++] = a[j++];
    for (k = l; k &lt;= r; k++) a[k] = t[k];    // 写回
}</code></pre>
          <p>归并排序的时间复杂度为 O(n log n)（共 ⌈log<sub>2</sub>n⌉ 趟，每趟 O(n)），需要 O(n) 的辅助数组，空间复杂度 O(n)。归并排序是<strong>稳定</strong>排序，适合外部排序与链表排序。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds8-other',
      heading: '6. 其它排序方法',
      blocks: [
        {
          type: 'html',
          html: `
          <h3 id="sec-ds8-other-h1">锦标赛排序</h3>
          <p>锦标赛排序（树形选择排序）用一棵完全二叉树模拟比赛：n 个元素作为叶子，两两比较，胜者（较小者）进入父结点，逐层向上直到根，根即最小元素。输出最小值后，把它所在的叶子改为 ∞，只需沿该叶到根的路径重新比较，即可得到次小值。</p>
          <p>总比较次数约为 n + ⌈log<sub>2</sub>n⌉×(n−1)，时间 O(n log n)，但需要约 2n 个结点的辅助空间，空间开销较大。它是直接选择排序的改进，<strong>稳定</strong>性取决于实现。</p>
          <h3 id="sec-ds8-other-h2">基数排序</h3>
          <p>基数排序不比较关键字大小，而是按关键字的各位数字分配与收集。以十进制整数为例，<strong>最低位优先</strong>（LSD）：先按个位把元素分配到 0～9 号队列，再依次收集；然后按十位、百位重复，直到最高位。经过 d 趟（d 为最大位数）后表即有序。</p>
          <p>设关键字基数为 r、位数为 d、元素个数为 n，则时间 O(d(n + r))，需要 r 个队列的辅助空间。基数排序是<strong>稳定</strong>排序，适合关键字位数少、元素多的场合。</p>
          <div class="callout key">
            <p class="callout-h">方法选择</p>
            <p>n 小或基本有序 → 直接插入；n 大且要求稳定 → 归并；n 大、不要求稳定、平均最快 → 快速排序；空间紧张 → 堆排序；关键字为整数且位数少 → 基数排序。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

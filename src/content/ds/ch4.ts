/* 数据结构 · 第4章 串、数组和广义表 —— 依据课件《第4章串数组和广义表》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch4',
  no: '第4章',
  title: '串、数组和广义表',
  subtitle: '第 4 章 · 串、数组和广义表',
  lede: `
  串是元素为字符的线性表，数组是线性表的推广，广义表是更一般的有层次结构。
  本章依次讨论三者的定义、存储与基本运算，重点掌握<strong>串的模式匹配</strong>、<strong>数组的地址计算</strong>与<strong>特殊矩阵的压缩存储</strong>。
`,
  toc: [
    { id: 'sec-ds4-string', text: '1. 串', level: 2 },
    { id: 'sec-ds4-array', text: '2. 数组', level: 2 },
    { id: 'sec-ds4-glist', text: '3. 广义表', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds4-string',
      heading: '1. 串',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>串</strong>（字符串）是由零个或多个字符组成的有限序列，记为 S = "c<sub>1</sub>c<sub>2</sub>…c<sub>n</sub>"。n 为串长，n = 0 时为空串（""）。注意空串与空格串不同：空串不含任何字符，空格串由一个或多个空格组成。</p>
          <p>串的基本运算：求串长、串连接、求子串、串比较、<strong>模式匹配</strong>（在主串中查找子串首次出现的位置）等。</p>
          <p>串的存储：<strong>顺序存储</strong>用字符数组，可用 '\0' 结尾或另设长度字段；<strong>链式存储</strong>每个结点存放一个或多个字符，存储密度低，实际较少使用。</p>
          <h3 id="sec-ds4-string-h1">模式匹配</h3>
          <p>朴素算法（BF 算法）：从主串第 1 个字符起与模式串逐字比较，失配时主串指针回退到本趟起点的下一个字符，模式串指针回到开头。</p>
          <div class="formula">最坏时间复杂度 O(n × m)，n 为主串长度，m 为模式串长度</div>
          <p>KMP 算法利用模式串自身的部分匹配信息（next 数组），失配时主串指针<strong>不回退</strong>，只把模式串右移，时间复杂度降为 O(n + m)。next[j] 表示模式串前 j 个字符组成的子串中，最长相等前后缀的长度。</p>
          <div class="callout tip">
            <p class="callout-h">理解 next</p>
            <p>next 只与模式串有关，与主串无关。求 next 的过程本身也是对模式串的「自匹配」，可在线性时间内完成。</p>
          </div>
          `,
        },
      ],
    },
    {
      id: 'sec-ds4-array',
      heading: '2. 数组',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>数组</strong>是 n 个相同类型数据元素的有序集合，每个元素受 n 个线性关系的约束。一维数组是线性表；二维数组可看成元素为一维数组的线性表。数组一旦定义，其维数与各维长度通常不再改变，因此一般只讨论取值与赋值，不讨论插入删除。</p>
          <p><strong>数组的顺序存储</strong>：由于各维长度固定，可用一段连续空间存放，按<strong>行优先</strong>或<strong>列优先</strong>次序排列。以行优先为例，二维数组 A[m][n] 中元素 A[i][j]（下标从 0 开始）的地址为：</p>
          <div class="formula">LOC(i, j) = LOC(0, 0) + (i × n + j) × L，L 为每个元素所占字节数</div>
          <p>下标从 1 开始时，公式相应改为 ((i − 1) × n + (j − 1)) × L。三维数组可类似地逐维展开。</p>
          <h3 id="sec-ds4-array-h1">矩阵的压缩存储</h3>
          <p>当矩阵中有大量相同元素或零元素时，可只存储有效数据，称<strong>压缩存储</strong>。常见情形：</p>
          <ul>
            <li><strong>对称矩阵</strong>：只存下三角（含对角线）共 n(n+1)/2 个元素；</li>
            <li><strong>三角矩阵</strong>：只存上三角或下三角，另加一个常数；</li>
            <li><strong>对角矩阵（带状矩阵）</strong>：只存主对角线及其两侧若干条对角线；</li>
            <li><strong>稀疏矩阵</strong>：非零元极少，用三元组 (行, 列, 值) 或十字链表存储。</li>
          </ul>
          <p>以对称矩阵按行优先存下三角为例，元素 a<sub>ij</sub>（i ≥ j，下标从 1 开始）在一维数组 B 中的下标为：</p>
          <div class="formula">k = i(i − 1)/2 + j − 1</div>
          <p>若 i &lt; j，则利用对称性取 a<sub>ji</sub>，代入同一公式。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds4-glist',
      heading: '3. 广义表',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>广义表</strong>是 n 个元素 a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub> 的有限序列，记为 LS = (a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>)。其中每个元素既可以是<strong>原子</strong>（不可再分的单元素），也可以是<strong>子表</strong>（广义表）。</p>
          <ul>
            <li><strong>表头</strong> head：第一个元素；<strong>表尾</strong> tail：除表头外其余元素组成的表（一定是广义表）；</li>
            <li><strong>长度</strong>：最外层元素的个数；<strong>深度</strong>：括号嵌套的最大层数（原子深度为 0）；</li>
            <li>空表 () 长度为 0；表尾一定是表，表头可以是原子也可以是表。</li>
          </ul>
          <p>例：A = (a, (b, c))，长度为 2，深度为 2；head(A) = a，tail(A) = ((b, c))。</p>
          <p><strong>存储结构</strong>：由于元素有原子与子表两种，通常用<strong>头尾链表</strong>或<strong>扩展线性链表</strong>表示，结点设标志域区分原子/表，并设数据域或子表指针、后继指针。</p>
          <div class="callout key">
            <p class="callout-h">递归结构</p>
            <p>广义表是递归定义的结构：表的元素又可以是表。因此求长度、深度、复制等运算都适合写成递归算法。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

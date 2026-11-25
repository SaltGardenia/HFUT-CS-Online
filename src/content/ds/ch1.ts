/* 数据结构 · 第1章 概论 —— 依据课件《第1章概论》整理 */
import type { DsChapter } from './types';

const ch: DsChapter = {
  id: 'ch1',
  no: '第1章',
  title: '概论',
  subtitle: '第 1 章 · 概论',
  lede: `
  本章说明《数据结构》研究什么、为什么学，以及贯穿全课程的基本术语；最后给出算法的描述方法与
  <strong>时间/空间复杂度</strong>的分析方法——后续各章讨论每一种结构时，都按「逻辑结构 → 存储结构 → 运算实现 → 算法效率」这条线索展开。
`,
  toc: [
    { id: 'sec-ds1-content', text: '1. 数据结构的研究内容', level: 2 },
    { id: 'sec-ds1-terms', text: '2. 基本术语', level: 2 },
    { id: 'sec-ds1-algo', text: '3. 算法描述及分析', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ds1-content',
      heading: '1. 数据结构的研究内容',
      blocks: [
        {
          type: 'html',
          html: `
          <p>用计算机解决实际问题一般经过三步：<strong>抽象数学模型 → 设计求解算法 → 编程调试</strong>。数值计算问题的模型可用方程或公式描述；而图书检索、档案管理、博弈等<strong>非数值计算问题</strong>，处理对象是字符、字符串及编码信息，无法直接用数学方程描述。</p>
          <p>这类问题的首要工作，是把处理对象中的信息按<strong>逻辑特性</strong>组织起来并存到计算机中，再设计算法、编写程序。许多不同应用问题之间存在共性：把具体问题转换为熟悉的模型，再借助该模型实现。数据结构课程正是介绍这些基本模型（线性表、树、图等）及其运算。</p>
          <div class="callout key">
            <p class="callout-h">课程主线</p>
            <p>数据结构 = <strong>逻辑结构</strong> + <strong>存储结构</strong> + <strong>运算</strong>。学习每一种结构，都要回答：数据元素之间是什么关系？在内存中如何表示？基本运算如何实现、代价多大？</p>
          </div>
          <p>课程的地位：上承程序设计基础，下接操作系统、编译原理、数据库、算法设计等专业课；程序 = 数据结构 + 算法，结构选择直接决定程序的效率与可维护性。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds1-terms',
      heading: '2. 基本术语',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>数据</strong>：所有能输入到计算机中并被计算机程序处理的符号的总称。<strong>数据元素</strong>：数据的基本单位，在程序中作为一个整体处理；一个数据元素可由若干<strong>数据项</strong>组成，数据项是数据不可分割的最小单位。</p>
          <p><strong>数据结构</strong>：相互之间存在一种或多种特定关系的数据元素的集合。它包括三方面：</p>
          <ul>
            <li><strong>逻辑结构</strong>：数据元素之间的逻辑关系，与存储无关。分为集合、线性结构、树形结构、图形结构四类；</li>
            <li><strong>存储结构</strong>（物理结构）：逻辑结构在计算机中的表示，主要有顺序存储与链式存储；</li>
            <li><strong>数据的运算</strong>：在逻辑结构上定义的操作，如插入、删除、查找、遍历。</li>
          </ul>
          <div class="callout tip">
            <p class="callout-h">四种基本逻辑结构</p>
            <ul>
              <li><strong>集合</strong>：元素之间除「同属一个集合」外无其他关系；</li>
              <li><strong>线性结构</strong>：元素之间是一对一的关系（线性表、栈、队列、串）；</li>
              <li><strong>树形结构</strong>：一对多的层次关系（树、二叉树）；</li>
              <li><strong>图形结构</strong>：多对多的网状关系（图）。</li>
            </ul>
          </div>
          <p>顺序存储把逻辑上相邻的元素存放在物理位置相邻的存储单元中，借助数组下标体现关系；链式存储不要求物理相邻，用指针表示元素间的逻辑关系。同一逻辑结构可以采用不同的存储结构，运算实现与效率也随之不同。</p>
          `,
        },
      ],
    },
    {
      id: 'sec-ds1-algo',
      heading: '3. 算法描述及分析',
      blocks: [
        {
          type: 'html',
          html: `
          <p><strong>算法</strong>：对特定问题求解步骤的描述，是指令的有限序列。一个算法应具备五个特性：</p>
          <table class="tbl">
            <thead><tr><th>特性</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td>有穷性</td><td>算法必须在执行有穷步之后结束，且每一步都在有穷时间内完成</td></tr>
              <tr><td>确定性</td><td>每条指令的含义明确、无二义性；相同输入只能得到相同输出</td></tr>
              <tr><td>可行性</td><td>算法中的操作都可以通过已实现的基本运算执行有限次完成</td></tr>
              <tr><td>输入</td><td>有零个或多个输入</td></tr>
              <tr><td>输出</td><td>有一个或多个输出，没有输出的算法没有意义</td></tr>
            </tbody>
          </table>
          <p>算法可用自然语言、流程图、类 C 语言等描述。本课程采用类 C 语言描述算法，既接近自然语言、便于阅读，又能直接转写为程序。</p>
          <h3 id="sec-ds1-algo-h1">时间复杂度</h3>
          <p>算法执行时间大致等于基本语句执行次数（<strong>语句频度</strong>）与每条语句执行时间的乘积。为摆脱机器与语言差异，采用<strong>大 O 记号</strong>只保留随问题规模 n 增长最快的项：</p>
          <div class="formula">T(n) = O(f(n)) ⇔ 存在正常数 C 和 n<sub>0</sub>，当 n ≥ n<sub>0</sub> 时，T(n) ≤ C·f(n)</div>
          <p>常见量级由小到大：O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n<sup>2</sup>) &lt; O(n<sup>3</sup>) &lt; O(2<sup>n</sup>)。分析时关注<strong>最坏情况</strong>与<strong>平均情况</strong>，并忽略常数因子与低阶项。</p>
          <div class="formula">例：两重循环 for(i=1;i&lt;=n;i++) for(j=1;j&lt;=n;j++) x++; 语句频度 n<sup>2</sup>，T(n) = O(n<sup>2</sup>)</div>
          <h3 id="sec-ds1-algo-h2">空间复杂度</h3>
          <p>空间复杂度 S(n) 度量算法在运行过程中<strong>辅助存储空间</strong>的大小。若所需辅助空间与问题规模无关，则 S(n) = O(1)；递归算法的空间开销主要是递归工作栈的深度。</p>
          <div class="callout tip">
            <p class="callout-h">评价算法</p>
            <p>正确性、可读性、健壮性（对非法输入的处理）与高效率（时间、空间）是评价算法的主要指标，其中正确性是前提。</p>
          </div>
          `,
        },
      ],
    },
  ],
};

export default ch;

/* 第9章 关系查询处理与查询优化 —— 逐节转录自 课件/PPT-2022/第9章 查询处理与优化.pdf（6 页，沈明玉）；
   等价变换规则中的公式按课件原式转录（复杂公式图在提取时丢失符号，已按原式恢复）。 */
import type { DbChapter } from './types';

const ch9: DbChapter = {
  id: 'ch9',
  no: '第9章',
  title: '关系查询处理与查询优化',
  subtitle: '查询处理步骤 · 查询操作算法示例 · 代数优化 · 物理优化',
  lede:
    '<p>本章内容：9.1 关系数据库系统的查询处理、9.2 关系数据库系统的查询优化（沈明玉）。<strong>查询处理</strong>：DBMS 执行用户查询请求的过程；<strong>查询优化</strong>：DBMS 提高查询执行效率的手段。用户通过客户端数据接口，借助网络平台向数据库服务器发送查询请求（SQL 语句），数据库服务器会产生相应的服务进程来处理用户的查询请求。在查询处理和查询优化的过程中涉及到一些技术实现，如数据库的安全性控制、完整性控制等，甚至还与数据库物理设计的内容有关。</p>',
  toc: [
    { id: 'sec-db9-process', text: '9.1 关系数据库系统的查询处理', level: 2 },
    { id: 'sec-db9-optimize', text: '9.2 关系数据库系统的查询优化', level: 2 },
  ],
  sections: [
    {
      id: 'sec-db9-process',
      heading: '9.1 关系数据库系统的查询处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>9.1.1 查询处理步骤</strong>——查询处理的四个阶段：<strong>查询分析、查询检查、查询优化、查询执行</strong>（<em>课件图示：查询处理步骤图</em>）。</p>
            <ul>
              <li><strong>查询分析</strong>：借助数据字典分析语句是否可以被执行——对查询语句进行扫描、词法分析和语法分析；从查询语句中识别出语言符号，如语言符号、属性名、关系名等，进行语法检查和语法分析，即判断查询语句是否符合 SQL 语法规则，若正确，则进行下一步的查询检查，否则终止处理并返回错误代码。</li>
              <li><strong>查询检查</strong>：从安全性、完整性角度检查是否允许用户的查询请求——根据数据字典对合法的查询语句进行语义检查；检查用户存取权限、完整性约束等，若用户权限不足或违反完整性约束规则，则终止处理并返回错误代码，否则继续后续处理；将 SQL 语句转换成等价的关系代数表达式（语法分析树）；把数据库对象的外部名称转换为内部表示。</li>
              <li><strong>查询优化</strong>：如何更有效地执行用户的语句——选择一个高效的查询处理策略。查询优化分类：<strong>代数优化</strong>（指关系代数表达式的优化）、<strong>物理优化</strong>（指存取路径和底层操作算法的选择）。查询优化方法选择的依据：基于规则（rule based）、基于代价（cost based）、基于语义（semantic based）。</li>
              <li><strong>查询执行</strong>：最优策略的执行——依据优化器得到的执行策略生成查询计划；代码生成器（code generator）生成执行查询计划的代码；执行代码，返回查询结果及状态。</li>
            </ul>
            <p><strong>9.1.2 实现查询操作的算法示例</strong></p>
            <p><strong>1. 选择操作的实现</strong>——［例1］<code>Select * from student where &lt;条件表达式&gt;</code>，考虑条件表达式的几种情况：C1：无条件；C2：Sno＝'20160001'；C3：Sage&gt;20；C4：Sdept＝'CS' AND Sage&gt;20。</p>
            <p><strong>（1）简单的全表扫描方法</strong>：① 按照物理次序读 Student 的 M 块（假定可用的内存为 M 块）到内存；② 检查内存中的每个元组 t，如果 t 满足选择条件，则输出 t；③ 如果 Student 还有其他块未被处理，重复①和②。适合小表，一般不适合大表；内存要求小（最小 1 块）。</p>
            <p><strong>（2）索引扫描法</strong>：适合选择条件中的属性上有索引（例如 B+ 树索引或 Hash 索引）；通过索引先找到满足条件的元组主码或元组指针，再通过元组指针直接在查询的基本表中找到元组。</p>
            <ul>
              <li>以 C2 为例，Sno＝'20160001'，并且 Sno 上有索引：使用索引得到 Sno 为 '20160001' 元组的指针，通过元组指针在 student 表中检索到该学生。</li>
              <li>以 C3 为例，Sage&gt;20，并且 Sage 上有 B+ 树索引：使用 B+ 树索引找到 Sage＝20 的索引项，以此为入口点在 B+ 树的顺序集上得到 Sage&gt;20 的所有元组指针，通过这些元组指针到 student 表中检索到所有年龄大于 20 的学生。</li>
              <li>以 C4 为例，Sdept＝'CS' AND Sage&gt;20，如果 Sdept 和 Sage 上都有索引——<strong>算法一</strong>：分别用上面两种方法找到 Sdept＝'CS' 的一组元组指针和 Sage&gt;20 的另一组元组指针，求这两组指针的交集，到 student 表中检索，得到计算机系年龄大于 20 的学生；<strong>算法二</strong>：找到 Sdept＝'CS' 的一组元组指针，通过这些元组指针到 student 表中检索，对得到的元组检查另一些选择条件（如 Sage&gt;20）是否满足，把满足条件的元组作为结果输出。</li>
            </ul>
            <div class="callout key"><p class="callout-h">结论</p><p>考虑到索引操作的开销，只有当大表且选择率较低，适合用索引扫描法，否则适合用全表扫描。</p></div>
            <p><strong>2. 连接操作的实现</strong>——连接操作是查询处理中最耗时的操作之一，通过简单示例了解等值连接（或自然连接）最常用的几种实现算法：<code>SELECT * FROM Student, SC WHERE Student.Sno=SC.Sno;</code></p>
            <p><strong>（1）嵌套循环方法</strong>：对外层循环（Student）的每一个元组，检索内层循环（SC）中的每一个元组，若这两个元组在连接属性（sno）上相等，则串接后作为结果输出，直到外层循环表中的元组处理完为止。外层表 Student 扫描一次，内层表 SC 的扫描次数取决于 Student 的元组数。</p>
            <p><strong>（2）排序-合并方法</strong>：适合连接的诸表已经排好序的情况。步骤：如果连接的表没有排好序，先对 Student 表和 SC 表按连接属性 Sno 排序；取 Student 表中第一个 Sno，依次扫描 SC 表中具有相同 Sno 的元组；当扫描到 Sno 不相同的第一个 SC 元组时，返回 Student 表扫描它的下一个元组，再扫描 SC 表中具有相同 Sno 的元组，把它们连接起来；重复上述步骤直到 Student 表扫描完。要考虑表的排序开销，当两个大表连接时，该方法是有效的。</p>
            <p><strong>（3）索引连接方法</strong>：① 在 SC 表上建立属性 Sno 的索引；② 对 Student 中每一个元组，由 Sno 值通过 SC 的索引查找相应的 SC 元组；③ 把这些 SC 元组和 Student 元组连接起来。循环执行②③，直到 Student 表中的元组处理完为止。</p>
            <p><strong>（4）Hash Join 方法</strong>：把连接属性作为 hash 码，用同一个 hash 函数把 R 和 S 中的元组散列到同一个 hash 文件中。步骤：<strong>划分阶段</strong>——对包含较少元组的表（比如 R）进行一遍处理，把它的元组按 hash 函数分散到 hash 表的桶中；<strong>试探阶段</strong>（也称为连接阶段）——对另一个表（S）进行一遍处理，把 S 的元组散列到适当的 hash 桶中，把元组与桶中所有来自 R 并与之相匹配的元组连接起来。算法前提：假设两个表中较小的表在第一阶段后可以完全放入内存的 hash 桶中。以上的算法思想可以推广到更加一般的多个表的连接算法上。</p>`,
        },
      ],
    },
    {
      id: 'sec-db9-optimize',
      heading: '9.2 关系数据库系统的查询优化',
      blocks: [
        {
          type: 'html',
          html: `
            <p>查询优化在关系数据库系统中有着非常重要的地位；查询优化是影响 RDBMS 性能的关键因素；由于关系表达式的语义级别很高，使关系系统可以从关系表达式中分析查询语义，提供了执行查询优化的可能性。</p>
            <p><strong>9.2.1 查询优化的必要性</strong>——［例］求选修了 2 号课程的学生姓名。用 SQL 表达：</p>
            <pre class="code"><code>SELECT Student.Sname FROM Student, SC
WHERE Student.Sno=SC.Sno AND C.Cno='2';</code></pre>
            <p>假定学生-课程数据库中有 1000 个学生记录，10000 个选课记录，其中选修 2 号课程的选课记录为 50 个。有多种等价的关系代数表达式来完成这一查询：</p>
            <pre class="code"><code>Q1 = π_Sname( σ_(Student.Sno=SC.Sno ∧ SC.Cno='2') ( Student × SC ) )
Q2 = π_Sname( σ_(SC.Cno='2') ( Student ⋈ SC ) )
Q3 = π_Sname( Student ⋈ σ_(SC.Cno='2') ( SC ) )</code></pre>
            <p>设一个块能装 10 个 Student 元组或 100 个 SC 元组，在内存中存放 5 块 Student 元组和 1 块 SC 元组，每秒读写 20 块，内存处理时间忽略。</p>
            <p><strong>第一种情况</strong>——Q1＝π<sub>Sname</sub>(σ<sub>Student.Sno=SC.Sno∧SC.Cno='2'</sub>(Student×SC))：</p>
            <ol>
              <li><strong>计算广义笛卡尔积</strong>：读取总块数为 2100 块，花费 105 s；连接后的元组数为 10³×10⁴＝10⁷，设每块能装 10 个元组，则写出这些块要用 10⁶/20＝5×10⁴ s。</li>
              <li><strong>选择操作</strong>：读取中间文件花费的时间（同写中间文件一样）需 5×10⁴ s；满足条件的元组假设仅 50 个，均可放在内存。</li>
            </ol>
            <p>本策略总耗时（投影处理时间忽略）：105＋2×5×10⁴ ≈ 10⁵ s（27.8 小时）。</p>
            <p><strong>第二种情况</strong>：</p>
            <ol>
              <li><strong>计算自然连接</strong>：执行自然连接，读取 Student 和 SC 表的策略不变，总的读取块数仍为 2100 块，花费 105 s；自然连接的结果比第一种情况大大减少，为 10⁴ 个；写出这些元组时间为 10⁴/10/20＝50 s，为第一种情况的千分之一。</li>
              <li>读取中间文件块，执行选择运算，花费时间也为 50 s。</li>
              <li>把第 2 步结果投影输出。</li>
            </ol>
            <p>本策略总的执行时间 ≈ 105＋50＋50 ≈ 205 s。</p>
            <p><strong>第三种情况</strong>：</p>
            <ol>
              <li>先对 SC 表作选择运算，只需读一遍 SC 表，存取 100 块花费时间为 5 s，因为满足条件的元组仅 50 个，不必使用中间文件。</li>
              <li>读取 Student 表，把读入的 Student 元组和内存中的 SC 元组作连接，也只需读一遍 Student 表共 100 块，花费时间为 5 s。</li>
              <li>把连接结果投影输出。</li>
            </ol>
            <p>本策略总的执行时间 ≈ 5＋5 ≈ 10 s。</p>
            <p><strong>9.2.2 代数优化</strong>——代数优化策略：通过关系代数表达式的<strong>等价变换</strong>来提高查询效率。关系代数表达式的等价：指用相同的关系代替两个表达式中相应的关系所得到的结果是相同的。两个关系表达式 E1 和 E2 是等价的，可记为 E1≡E2。</p>
            <p><strong>关系代数表达式的等价变换规则</strong>：</p>
            <ol>
              <li><strong>连接、笛卡尔积交换律</strong>：设 E1 和 E2 是关系代数表达式，F 是连接运算的条件，则有 E1×E2 ≡ E2×E1，E1⋈<sub>F</sub>E2 ≡ E2⋈<sub>F</sub>E1。</li>
              <li><strong>连接、笛卡尔积的结合律</strong>：设 E1、E2、E3 是关系代数表达式，F1 和 F2 是连接运算的条件，则有 (E1×E2)×E3 ≡ E1×(E2×E3)，(E1⋈<sub>F1</sub>E2)⋈<sub>F2</sub>E3 ≡ E1⋈<sub>F1</sub>(E2⋈<sub>F2</sub>E3)。</li>
              <li><strong>投影的串接定律</strong>：这里 E 是关系代数表达式，A<sub>i</sub>(i=1,2,…,n)，B<sub>j</sub>(j=1,2,…,m) 是属性名，且 {A1,A2,…,An} 构成 {B1,B2,…,Bm} 的子集：π<sub>A1,…,An</sub>(π<sub>B1,…,Bm</sub>(E)) ≡ π<sub>A1,…,An</sub>(E)。</li>
              <li><strong>选择的串接定律</strong>：这里 E 是关系代数表达式，F1、F2 是选择条件：σ<sub>F1</sub>(σ<sub>F2</sub>(E)) ≡ σ<sub>F1∧F2</sub>(E)。选择的串接律说明选择条件可以合并，这样一次就可检查全部条件。</li>
              <li><strong>选择与投影操作的交换律</strong>：σ<sub>F</sub>(π<sub>A</sub>(E)) ≡ π<sub>A</sub>(σ<sub>F</sub>(E))（F 只涉及 A 中的属性）。</li>
              <li><strong>选择与笛卡尔积的交换律</strong>：若 F=F1∧F2，F1 只涉及 E1 的属性、F2 只涉及 E2 的属性，则 σ<sub>F</sub>(E1×E2) ≡ σ<sub>F1</sub>(E1)×σ<sub>F2</sub>(E2)；也可写作 σ<sub>F</sub>(E1×E2) ≡ σ<sub>F2</sub>(σ<sub>F1</sub>(E1)×E2)。</li>
              <li><strong>选择与并的分配律</strong>：设 E=E1∪E2，E1、E2 有相同的属性名，则 σ<sub>F</sub>(E1∪E2) ≡ σ<sub>F</sub>(E1)∪σ<sub>F</sub>(E2)。</li>
              <li><strong>选择与差运算的分配律</strong>：若 E1 与 E2 有相同的属性名，则 σ<sub>F</sub>(E1−E2) ≡ σ<sub>F</sub>(E1)−σ<sub>F</sub>(E2)。</li>
              <li><strong>选择对自然连接的分配律</strong>：σ<sub>F</sub>(E1⋈E2) ≡ σ<sub>F</sub>(E1)⋈σ<sub>F</sub>(E2)（F 只涉及 E1 与 E2 的公共属性）。</li>
              <li><strong>投影与笛卡尔积的分配律</strong>：设 E1 和 E2 是两个关系表达式，A1,…,An 是 E1 的属性，B1,…,Bm 是 E2 的属性，则 π<sub>A1,…,An,B1,…,Bm</sub>(E1×E2) ≡ π<sub>A1,…,An</sub>(E1)×π<sub>B1,…,Bm</sub>(E2)。</li>
              <li><strong>投影与并的分配律</strong>：设 E1 和 E2 有相同的属性名，则 π<sub>A1,…,An</sub>(E1∪E2) ≡ π<sub>A1,…,An</sub>(E1)∪π<sub>A1,…,An</sub>(E2)。</li>
            </ol>
            <p><strong>查询树的启发式优化</strong>——典型的启发式规则：</p>
            <ol>
              <li><strong>选择运算应尽可能先做</strong>。在优化策略中这是最重要、最基本的一条；</li>
              <li><strong>把投影运算和选择运算同时进行</strong>——如有若干投影和选择运算，并且它们都对同一个关系操作，则可以在扫描此关系的同时完成所有的这些运算以避免重复扫描关系；</li>
              <li><strong>把投影同其前或其后的双目运算结合起来</strong>；</li>
              <li><strong>把某些选择同在它前面要执行的笛卡尔积结合起来成为一个连接运算</strong>；</li>
              <li><strong>找出公共子表达式</strong>——如果这种重复出现的子表达式的结果不是很大的关系，并且从外存中读入这个关系比计算该子表达式的时间少得多，则可以先计算一次公共子表达式并把结果写入中间文件。当查询的是视图时，定义视图的表达式就是公共子表达式的情况。</li>
            </ol>
            <p><strong>9.2.3 物理优化</strong>：代数优化改变查询语句中操作的次序和组合，不涉及底层的存取路径；对于一个查询语句有许多存取方案，它们的执行效率不同，仅仅进行代数优化是不够的；物理优化就是要选择高效合理的操作算法或存取路径，求得优化的查询计划。优化方法：<strong>基于规则的启发式优化、基于代价估算的优化、两者结合的优化方法</strong>。</p>
            <p><strong>基于启发式规则的存取路径选择优化</strong>——选择操作的启发式规则：</p>
            <ol>
              <li>小关系：使用全表顺序扫描，即使选择列上有索引。</li>
              <li>大关系，启发式规则有：
                <ol>
                  <li>选择条件是<strong>主码＝值</strong>的查询，可以选择主码索引；</li>
                  <li>选择条件是<strong>非主属性＝值</strong>的查询，且选择列上有索引：估算查询结果的元组数目，若比例较小（&lt;10%）可以使用索引，否则全表扫描；</li>
                  <li>选择条件是<strong>非等值查询或者范围查询</strong>，且选择列上有索引：方法同上！</li>
                  <li>对于使用 <strong>AND</strong> 的组合条件：如果有涉及这些属性的组合索引，优先采用组合索引扫描方法；如果某些属性上有一般的索引，则可以采用索引扫描方法，否则使用全表顺序扫描；</li>
                  <li>对于使用 <strong>OR</strong> 的组合条件，一般使用全表顺序扫描。</li>
                </ol>
              </li>
            </ol>
            <p><strong>连接操作的启发式规则</strong>：</p>
            <ol>
              <li>如果 2 个表都已经按照连接属性排序：选用排序-合并方法；</li>
              <li>如果一个表在连接属性上有索引：选用索引连接方法；</li>
              <li>如果上面 2 个规则都不适用，其中一个表较小：选用 Hash join 方法；</li>
              <li>选用嵌套循环方法，并选择其中较小的表，确切地讲是占用的块数（b）较少的表，作为外表（外循环的表）。</li>
            </ol>
            <div class="callout key">
              <p class="callout-h">本章作业</p>
              <p>习题第 3 题；阐述 DBMS 查询处理的步骤及内容。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch9;

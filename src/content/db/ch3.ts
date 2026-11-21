/* 第3章 SQL语言 —— 逐节转录自 课件/PPT-2022/第3章 SQL语言.pdf（14 页，沈明玉）；
   课件中的 SQL 示例运行截图以「课件图示」注明。 */
import type { DbChapter } from './types';

const ch3: DbChapter = {
  id: 'ch3',
  no: '第3章',
  title: 'SQL 语言',
  subtitle: 'SQL 概述 · 数据定义 · 数据查询 · 数据更新 · 视图',
  lede:
    '<p>本章内容：3.1 SQL 概述、3.2 数据定义、3.3 数据查询、3.4 数据更新、3.5 视图（沈明玉）。</p>',
  toc: [
    { id: 'sec-db3-overview', text: '3.1 SQL 概述', level: 2 },
    { id: 'sec-db3-ddl', text: '3.2 数据定义', level: 2 },
    { id: 'sec-db3-query', text: '3.3 数据查询', level: 2 },
    { id: 'sec-db3-update', text: '3.4 数据更新', level: 2 },
    { id: 'sec-db3-view', text: '3.5 视图', level: 2 },
  ],
  sections: [
    {
      id: 'sec-db3-overview',
      heading: '3.1 SQL 概述',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>3.1.1 SQL 的产生与发展</strong>：IBM 的 Sequel 语言，70 年代，System R 的一部分，后改名为 SQL。ANSI 和 ISO 发布的 SQL 标准：SQL-86、SQL-89、SQL-92、SQL:1999、SQL:2003、SQL:2008、SQL:2011。SQL 是关系数据库的标准语言，是一个通用的、功能极强的关系数据库语言。</p>
            <p><strong>3.1.2 SQL 语言的特点</strong>：</p>
            <ul>
              <li><strong>综合统一</strong>：SQL 集数据定义语言（DDL）、数据操纵语言（DML）、数据控制语言（DCL）功能于一体。</li>
              <li>可以独立完成数据库生命周期中的全部活动：定义关系模式，插入数据，建立数据库；对数据库中的数据进行查询和更新；数据库重构和维护；数据库安全性、完整性控制等。</li>
              <li>非过程化语言、面向集合的操作方式。</li>
              <li>提供交互式和嵌入式两种使用方法。</li>
              <li>语言简洁、易学易用。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-db3-ddl',
      heading: '3.2 数据定义',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>3.2.1 SQL 可定义的数据对象</strong>：模式（架构）的定义、基本表的定义、索引的定义、视图的定义、其它（用户、触发器、过程与函数等）。</p>
            <p><strong>3.2.2 架构（Schema）的定义与删除</strong>：数据库架构是一个独立于数据库用户的非重复命名空间，可将架构视为对象的容器——在这个空间中包含数据库的各种对象，例如基本表、视图、索引等。</p>
            <pre class="code"><code>删除架构：DROP SCHEMA &lt;架构名&gt; &lt;CASCADE|RESTRICT&gt;
CASCADE（级联）：删除架构的同时把该架构中所有的数据库对象全部删除
RESTRICT（限制）：如果该架构中包含数据库对象（如表、视图等），则拒绝该删除语句的执行</code></pre>
            <p>例：DROP SCHEMA ZHANG CASCADE；</p>
            <p><strong>3.2.3 基本表的创建、删除与修改</strong>——创建基本表：</p>
            <pre class="code"><code>CREATE TABLE &lt;表名&gt;（&lt;列名&gt; &lt;数据类型&gt;[ &lt;列级完整性约束条件&gt; ]
      [，&lt;列名&gt; &lt;数据类型&gt;[ &lt;列级完整性约束条件&gt;] ] …
      [，&lt;表级完整性约束条件&gt; ] ）；</code></pre>
            <p>如果完整性约束条件涉及到该表的多个属性列，则必须定义在表级上，否则既可以定义在列级也可以定义在表级。<em>课件图示：简单的教学管理实体联系图。</em></p>
            <pre class="code"><code>修改基本表：
ALTER TABLE &lt;表名&gt;
  [ ADD [column] &lt;新列名&gt; &lt;数据类型&gt; [ 完整性约束] ]
  [ ADD &lt;表级完整性约束&gt; ]
  [ DROP [column] &lt;列名&gt; [ CASCADE | RESTRICT ] ]
  [ DROP CONSTRAINT &lt;完整性约束名&gt; [ CASCADE | RESTRICT ] ]
  [ ALTER COLUMN &lt;列名&gt; &lt;数据类型&gt; ]；</code></pre>
            <pre class="code"><code>删除基本表：DROP TABLE &lt;表名&gt;［RESTRICT| CASCADE］；
RESTRICT：删除表是有限制的——欲删除的基本表不能被其他表的约束所引用；
          如果存在依赖该表的对象，则此表不能被删除
CASCADE：删除该表没有限制——在删除基本表的同时，相关的依赖对象一起删除
DROP TABLE Student CASCADE;
DROP TABLE Student RESTRICT;   // 需参照规定！</code></pre>
            <p><strong>3.2.4 索引的建立与删除</strong>——建立索引的目的：加快查询速度。索引的种类：顺序索引、B+ 树索引、哈希索引、位图索引等。谁可以建立索引：DBA 或表的属主（即建立表的人）；DBMS 一般会自动建立 PRIMARY KEY、UNIQUE 列上的索引。谁维护索引？DBMS 自动完成。使用索引：DBMS 自动选择是否使用索引以及使用哪些索引。</p>
            <pre class="code"><code>建立索引：
CREATE [UNIQUE] [CLUSTER] INDEX &lt;索引名&gt;
  ON &lt;表名&gt;(&lt;列名&gt;[&lt;次序&gt;][,&lt;列名&gt;[&lt;次序&gt;] ]…)；
注意：一个基本表上最多只能建立一个聚集索引。
删除索引：
DROP INDEX &lt;索引名&gt; ON &lt;表名&gt;；
删除索引时，系统会从数据字典中删去有关该索引的描述。</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db3-query',
      heading: '3.3 数据查询',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>语句格式</strong>：</p>
            <pre class="code"><code>SELECT [ALL|DISTINCT] &lt;目标列表达式&gt; [，&lt;目标列表达式&gt;] …
  FROM &lt;表名或视图名&gt;[，&lt;表名或视图名&gt; ] …
  [ WHERE &lt;条件表达式&gt; ]
  [ GROUP BY &lt;列名1&gt; [ HAVING &lt;条件表达式&gt; ] ]
  [ ORDER BY &lt;列名2&gt; [ ASC|DESC ] ]；</code></pre>
            <p>&lt;目标列表达式&gt; 可以为：算术表达式、字符串常量、函数、列别名。基本查询结构对应关系：<em>课件图示——FROM 笛卡尔积(×) → WHERE 选择(σ) → SELECT 投影（πA1,…An）</em>。</p>
            <p><strong>查询条件</strong>（谓词）：</p>
            <table class="tbl">
              <thead><tr><th>查询条件</th><th>谓 词</th></tr></thead>
              <tbody>
                <tr><td>比 较</td><td>=，&gt;，&lt;，&gt;=，&lt;=，!=，&lt;&gt;，!&gt;，!&lt;；NOT + 上述比较运算符</td></tr>
                <tr><td>确定范围</td><td>BETWEEN AND，NOT BETWEEN AND</td></tr>
                <tr><td>确定集合</td><td>IN，NOT IN</td></tr>
                <tr><td>字符匹配</td><td>LIKE，NOT LIKE</td></tr>
                <tr><td>空 值</td><td>IS NULL，IS NOT NULL</td></tr>
                <tr><td>多重条件（逻辑运算）</td><td>AND，OR，NOT</td></tr>
              </tbody>
            </table>
            <p><strong>3.3.1 单表查询</strong>——Select 子句的变化、Where 子句的使用与变化（课件配有多张 SQL 运行截图）：</p>
            <ul>
              <li>条件中使用谓词 (not) between…and；条件中使用谓词 in（not in）。</li>
              <li><strong>字符串匹配</strong>：[NOT] LIKE '&lt;匹配串&gt;' [ESCAPE '&lt;换码字符&gt;']——通配符 <code>_</code> 的使用、通配符 <code>%</code> 的使用。</li>
              <li><strong>涉及空值的查询</strong>：IS NULL 或 IS NOT NULL。注：「IS」不能用「=」代替。</li>
              <li><strong>对结果进行排序的查询</strong>（ORDER BY 属性名 desc[,…]）：可以按一个或多个属性列排序；升序（缺省）：ASC；降序：DESC。当排序列含空值时——ASC：排序列为空值的元组最后显示；DESC：排序列为空值的元组最先显示。</li>
              <li><strong>基于统计的查询（聚集函数）</strong>：计数 COUNT（[DISTINCT|ALL] *）、COUNT（[DISTINCT|ALL] &lt;列名&gt;）——Count 计算元组的个数，注意参数的使用！计算总和 SUM（[DISTINCT|ALL] &lt;列名&gt;）——Sum 属性值求和，忽略空值；计算平均值 AVG——忽略空值；最大最小值 MAX/MIN——忽略空值。</li>
              <li><strong>基于分组的统计查询（GROUP BY 子句）</strong>：细化聚集函数的作用对象；作用对象是查询的中间结果表；按指定的一列或多列值分组，值相等的为一组。<em>课件图示：Sname 未出现在 Group 子句中，错误！——Select 子句的正确使用方法。</em></li>
            </ul>
            <p><strong>3.3.2 多表连接查询</strong>——连接操作的几种执行方式：嵌套循环法（最耗时，无需条件）、排序合并法（最快，条件苛刻，理想化）、索引连接（最常用，效率优于嵌套循环，需条件）。</p>
            <ul>
              <li>笛卡尔积（无连接条件，R1 cross join R2）；等值连接；自然连接——<strong>SQL Server 不支持 natural join！</strong>自身连接。</li>
              <li><strong>外连接（Outer join）</strong>：左外连接 left outer join、右外连接 right outer join、全外连接 full outer join；多表连接（Outer join）。</li>
            </ul>
            <p><strong>3.3.3 嵌套查询</strong>：</p>
            <ul>
              <li>一个 SELECT-FROM-WHERE 语句称为一个查询块；将一个查询块嵌套在另一个查询块的 WHERE 子句或 HAVING 短语的条件中。</li>
              <li>子查询中不能使用 ORDER BY 子句。</li>
              <li>相关子查询与不相关子查询的区别与处理。</li>
              <li>带有 IN 谓词的子查询；带有比较运算符的子查询——当能确切知道内层查询返回单值时，可用比较运算符（&gt;，&lt;，=，&gt;=，&lt;=，!= 或 &lt;&gt;），与 ANY 或 ALL 谓词配合使用（参见教材 P107）。</li>
            </ul>
            <p>例：查询其他专业中比软件工程专业任意一个（其中某一个）学生年龄小的学生。</p>
            <p>用集函数实现子查询通常比直接用 ANY 或 ALL 查询效率要高，因为前者通常能够减少比较次数。ANY 和 ALL 谓词有时可以用聚集函数实现：</p>
            <table class="tbl">
              <thead><tr><th></th><th>=</th><th>&lt;&gt; 或 !=</th><th>&lt;</th><th>&lt;=</th><th>&gt;</th><th>&gt;=</th></tr></thead>
              <tbody>
                <tr><td>ANY</td><td>IN</td><td>--</td><td>&lt;MAX</td><td>&lt;=MAX</td><td>&gt;MIN</td><td>&gt;= MIN</td></tr>
                <tr><td>ALL</td><td>--</td><td>NOT IN</td><td>&lt;MIN</td><td>&lt;= MIN</td><td>&gt;MAX</td><td>&gt;= MAX</td></tr>
              </tbody>
            </table>
            <p><strong>带有 EXISTS 谓词的子查询</strong>：</p>
            <pre class="code"><code>格式：Select sno, sname From student Where Exists ( Select * from sc
        Where sc.sno = student.sno And cno = 'c104' );</code></pre>
            <ul>
              <li>带有 EXISTS 谓词的子查询不返回任何数据——若内层查询结果非空，则为真；若内层查询结果为空，则为假。</li>
              <li>由 EXISTS 引出的子查询，其目标列表达式用 *，给出列名无实际意义。</li>
              <li>NOT EXISTS 谓词。</li>
              <li>查询选修了全部课程的学生姓名——查找这样的学生：对于课程表中的每一门课程，该生都选了（即：均可在 SC 表中找到该学生选修这门课的元组），也可表示成：不存在这样的课程，在选课表 SC 中不存在该学生对该课程的选课元组。</li>
              <li>查询至少选修了学生 20160002 所选修全部课程的学生姓名——查找这样的学生：对于课程表中的每一门课程，如果该课程被 20160002 学生选修了（SC 中存在），一定可以在 SC 中找到该生这门课的选课元组。</li>
            </ul>
            <p><strong>3.3.4 集合查询</strong>：并操作 UNION、交操作 INTERSECT、差操作 EXCEPT。注：参加集合操作的各查询结果的列数必须相同；对应项的数据类型也必须相同。</p>
            <p><strong>3.3.5 基于派生表的查询</strong>：查询子句出现在 from 子句中，查询结果作为操作对象。</p>`,
        },
      ],
    },
    {
      id: 'sec-db3-update',
      heading: '3.4 数据更新',
      blocks: [
        {
          type: 'html',
          html: `
            <p>1、插入数据（INSERT 语句）；2、修改数据（UPDATE 语句）；3、删除数据（DELETE 语句）。<strong>注意：数据更新操作中的完整性控制！</strong></p>
            <pre class="code"><code>（1）插入元组：
INSERT INTO &lt;表名&gt; [(&lt;属性列1&gt;[，&lt;属性列2&gt;…)] VALUES (&lt;常量1&gt; [，&lt;常量2&gt;] …)；
（2）插入子查询结果：
INSERT INTO &lt;表名&gt; [(&lt;属性列1&gt; [，&lt;属性列2&gt;…)] 子查询；</code></pre>
            <pre class="code"><code>修改数据：
UPDATE &lt;表名&gt; SET &lt;列名&gt;=&lt;表达式&gt;[，&lt;列名&gt;=&lt;表达式&gt;]… [WHERE &lt;条件&gt;]；
功能：修改指定表中满足 WHERE 子句条件的元组。
方式：（1）修改某一个元组的值；（2）修改多个元组的值；（3）带子查询的修改。</code></pre>
            <pre class="code"><code>删除数据：
DELETE FROM &lt;表名&gt; [WHERE &lt;条件&gt;]；
功能：删除指定表中满足 WHERE 子句条件的元组。
WHERE 子句：指定要删除的元组；
缺省表示要删除表中的全部元组，表的定义仍在字典中。</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db3-view',
      heading: '3.5 视图',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>理解视图</strong>：虚表，是从一个或几个基本表（或视图）导出的表；只存放视图的定义，不存放视图对应的数据；基表中的数据发生变化，从视图中查询出的数据也随之改变。基于视图的操作：查询、删除、受限更新、定义基于该视图的新视图。</p>
            <p><strong>3.5.1 定义视图</strong>——创建视图：</p>
            <pre class="code"><code>CREATE VIEW &lt;视图名&gt; [(&lt;列名&gt; [，&lt;列名&gt;]…)]
AS &lt;子查询&gt; [WITH CHECK OPTION]；</code></pre>
            <p>要点：视图定义中的属性列表；视图定义中子查询的 ORDER BY 和 DISTINCT；视图定义后存入数据字典，并不执行其中的 SELECT 语句；WITH CHECK OPTION 选项。</p>
            <p>删除视图：</p>
            <pre class="code"><code>DROP VIEW &lt;视图名&gt; [CASCADE]；</code></pre>
            <ul>
              <li>该语句从数据字典中删除指定的视图定义。</li>
              <li>如果该视图上还导出了其他视图，使用 CASCADE 级联删除语句，把该视图和由它导出的所有视图一起删除。</li>
              <li>删除基表时，由该基表导出的所有视图定义都必须显式地使用 DROP VIEW 语句删除。</li>
            </ul>
            <p><strong>3.5.2 查询视图</strong>：用户角度——查询视图与查询基本表相同。RDBMS 实现视图查询的方法：<strong>视图消解法</strong>——进行有效性检查；转换成等价的对基本表的查询；执行修正后的查询。<strong>实体化视图</strong>——有效性检查；执行视图定义，生成临时表；查询视图转化为查询临时表；查询完毕后删除实体化得视图。</p>
            <p><strong>视图消解法的局限</strong>：有些情况下，视图消解法不能生成正确查询。</p>
            <pre class="code"><code>Create View v_avg as select sno, avg(grade) cavg from sc group by sno;
使用：SELECT * FROM v_avg WHERE cavg&gt;=90;
×：SELECT Sno，AVG(Grade) FROM SC WHERE AVG(Grade)&gt;=90 GROUP BY Sno；
✓：SELECT Sno, AVG(Grade) FROM SC GROUP BY Sno HAVING AVG(Grade)&gt;=90;</code></pre>
            <p><strong>3.5.3 更新视图</strong>——更新视图的限制：一些视图是不可更新的，这些视图的更新无法转换成对相应基本表的更新；允许对行列子集视图进行更新；对其他类型视图的更新不同系统有不同限制。</p>
            <p><strong>3.5.4 视图的作用</strong>：1. 视图能够简化用户的操作；2. 视图使用户能以多种角度看待同一数据；3. 视图对重构数据库提供了一定程度的逻辑独立性；4. 视图能够对机密数据提供安全保护；5. 适当的利用视图可以更清晰的表达查询。</p>
            <div class="callout key">
              <p class="callout-h">本章思考题与作业</p>
              <p>思考题：如何理解数据库中的架构（Schema）？作业：P130 习题 3、习题 5。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch3;

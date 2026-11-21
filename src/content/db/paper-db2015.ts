/* 试卷 1 · 2015-2016 学年第一学期数据库系统试卷（宣城校区）——转录自 data/大三下/数据库系统/试题/期末 原卷（扫描件）。
   原卷带学生手写作答，参考答案由本站按课件内容整理。 */
import type { DbPaper } from './types';

const paper: DbPaper = {
  id: 'db-2015',
  title: '2015-2016 学年第一学期 · 数据库系统试卷（宣城校区）',
  source: '合肥工业大学2015-2016学年第一学期数据库系统试卷(宣城校区).pdf',
  answerSource: '本站整理',
  sections: [
    { title: '一、选择题', questionIds: ['p1-s1', 'p1-s2', 'p1-s3', 'p1-s4', 'p1-s5', 'p1-s6', 'p1-s7', 'p1-s8', 'p1-s9', 'p1-s10'] },
    { title: '二、判断题', questionIds: ['p1-j1', 'p1-j2', 'p1-j3', 'p1-j4', 'p1-j5'] },
    { title: '三、简答题', questionIds: ['p1-e1', 'p1-e2', 'p1-e3', 'p1-e4'] },
    { title: '四、操作题（关系代数）', questionIds: ['p1-e5'] },
    { title: '五、阐述题', questionIds: ['p1-e6'] },
    { title: '六、设计题', questionIds: ['p1-e7'] },
  ],
  questions: [
    {
      id: 'p1-s1',
      kind: 'single',
      question: '<p>1. 数据管理技术经历的四个发展阶段是：</p>',
      options: [
        'A. 人工管理、文件系统、数据库系统',
        'B. 程序语言、BASIC、C',
        'C. 数据采集、数据处理、数据输出',
        'D. 层次模型、网状模型、关系模型',
      ],
      answer: 'A',
      explanation:
        '<p>数据管理技术经历了人工管理阶段、文件系统阶段、数据库系统阶段的发展（选项 A 按原卷表述为四个发展阶段的罗列）。层次/网状/关系是数据模型的分类（D），程序语言（B）与数据处理环节（C）都不是数据管理技术的阶段划分。</p>',
      tags: [
        { deck: 1, sec: 'sec-db1-overview', text: '数据管理技术的发展' },
      ],
    },
    {
      id: 'p1-s2',
      kind: 'single',
      question: '<p>2. 在数据库技术中，E-R 模型是一种：</p>',
      options: ['A. 概念数据模型', 'B. 结构数据模型', 'C. 物理数据模型', 'D. 逻辑数据模型'],
      answer: 'A',
      explanation: '<p>E-R 模型按用户的观点对数据和信息建模，属于概念模型（信息世界的建模），再由概念模型转换为某 DBMS 支持的逻辑（结构）数据模型。</p>',
      tags: [
        { deck: 1, sec: 'sec-db1-model', text: '两类数据模型与概念模型' },
        { deck: 7, sec: 'sec-db7-concept', text: '概念结构设计' },
      ],
    },
    {
      id: 'p1-s3',
      kind: 'single',
      question: '<p>3. 关系相当于二维表，表中的每行叫做一个：</p>',
      options: ['A. 属性', 'B. 域（字段）', 'C. 元组', 'D. 主码'],
      answer: 'C',
      explanation: '<p>二维表的每行对应一个元组（Tuple），每列对应一个属性；域是属性的取值范围。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '关系的数据结构' }],
    },
    {
      id: 'p1-s4',
      kind: 'single',
      question: '<p>4. DBMS 的含义是：</p>',
      options: ['A. 系统缓冲区', 'B. 数据库管理系统', 'C. 数据描述语言', 'D. 数据库应用程序'],
      answer: 'B',
      explanation: '<p>DBMS（Database Management System）即数据库管理系统，是位于用户与操作系统之间的数据管理软件。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '四个基本概念' }],
    },
    {
      id: 'p1-s5',
      kind: 'single',
      question: '<p>5. 下列哪一项描述<strong>不属于</strong>基本关系的性质？</p>',
      options: [
        'A. 列是同质的',
        'B. 每个分量都必须是不可分的数据项',
        'C. 行的次序不可任意交换',
        'D. 列的顺序可以任意交换',
      ],
      answer: 'C',
      explanation:
        '<p>基本关系的性质包括：列同质、分量取原子值、行列的次序均可以任意交换等。故「行的次序不可任意交换」（C）不是基本关系的性质。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '基本关系的性质' }],
    },
    {
      id: 'p1-s6',
      kind: 'single',
      question: '<p>6. 外模式描述的是：</p>',
      options: [
        'A. 数据库全局逻辑结构',
        'B. 数据库局部逻辑结构',
        'C. 数据库物理存储结构',
        'D. 数据库完整性',
      ],
      answer: 'B',
      explanation:
        '<p>外模式（用户模式/子模式）是数据库用户能够看见和使用的局部数据的逻辑结构和特征的描述；全局逻辑结构是模式，物理存储结构是内模式。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '三级模式结构' }],
    },
    {
      id: 'p1-s7',
      kind: 'single',
      question: '<p>7. 数据库系统的数据独立性是指：</p>',
      options: [
        'A. 不会因为数据的变化而影响应用程序',
        'B. 不会因为程序存储结构的变化而影响其他的存储结构变化',
        'C. 不会因为数据存储策略的变化而影响数据存储结构的变化',
        'D. 不会因为数据存储结构与数据逻辑结构的变化而影响应用程序',
      ],
      answer: 'D',
      explanation:
        '<p>数据独立性指应用程序不依赖数据库的物理存储结构与逻辑结构：由模式/内模式映像保证物理独立性，外模式/模式映像保证逻辑独立性——存储结构或逻辑结构变化时应用程序不必修改（D 最完整）。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像与数据独立性' }],
    },
    {
      id: 'p1-s8',
      kind: 'single',
      question: '<p>8. 局部 E-R 图合并成全局 E-R 图时可能出现冲突，下列<strong>不属于</strong>合并冲突的是：</p>',
      options: ['A. 属性冲突', 'B. 结构冲突', 'C. 语法冲突', 'D. 命名冲突'],
      answer: 'C',
      explanation: '<p>视图集成常见的冲突有：命名冲突、概念（结构）冲突、域（属性）冲突、约束冲突——不存在「语法冲突」。</p>',
      tags: [{ deck: 7, sec: 'sec-db7-concept', text: '视图的集成与冲突' }],
    },
    {
      id: 'p1-s9',
      kind: 'single',
      question: '<p>9. 下列对关系规范化设计的描述中，<strong>正确</strong>的是：</p>',
      options: [
        'A. 规范化等级越高，则访问数据库的效率就会越高',
        'B. 关系模式的优化应综合考虑规范化和应用的性能需求',
        'C. 规范化要求只针对某些特定的应用',
        'D. 只要进行关系模式的分解，所得到的关系模式一定会「更好」',
      ],
      answer: 'B',
      explanation:
        '<p>并不是规范化程度越高的关系就越优：查询经常涉及多个关系时连接代价很高，2NF 甚至 1NF 也许是最好的。模式优化应结合需求分析中的性能需求（反规范化设计），综合考虑规范化和应用的性能需求。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-logic', text: '逻辑结构的优化（反规范化）' },
        { deck: 6, sec: 'sec-db6-normal', text: '规范化' },
      ],
    },
    {
      id: 'p1-s10',
      kind: 'single',
      question: '<p>10. 下列关于「存储过程」的叙述中，<strong>正确</strong>的是：</p>',
      options: [
        'A. 存储过程属于高级语言程序中专门用来进行数据存储的过程',
        'B. 存储过程不需要进行编译',
        'C. 存储过程由特定的数据库访问操作激活自动执行',
        'D. 存储过程的使用可以有效降低网络的通信量',
      ],
      answer: 'D',
      explanation:
        '<p>存储过程是过程化 SQL 书写、经编译和优化后存储在数据库服务器中的过程，使用时调用即可（B 错）；「由事件驱动自动执行」是触发器的特征（C 错）；存储过程的优点之一正是降低了客户机和服务器之间的通信量（D 对）。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-proc', text: '存储过程的定义与优点' }],
    },
    {
      id: 'p1-j1',
      kind: 'judge',
      question: '<p>1. 数据的访问必须通过数据库管理系统才能完成。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation: '<p>数据库中的数据由 DBMS 统一管理和控制，应用程序对数据的访问（存取）都要通过 DBMS 完成。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: 'DBMS 的职责' }],
    },
    {
      id: 'p1-j2',
      kind: 'judge',
      question: '<p>2. 符合应用语义的数据取值可以通过用户定义的完整性约束进行限制。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>用户定义的完整性针对某一具体应用所涉及的数据必须满足的语义要求（如 CHECK 约束限定取值范围），因此符合应用语义的数据取值可以用它来限制。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-user', text: '用户定义的完整性' }],
    },
    {
      id: 'p1-j3',
      kind: 'judge',
      question: '<p>3. 触发器属于一种数据库编程技术，与数据的完整性无关。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>触发器确实是数据库编程的重要手段，但它的典型用途之一正是实施复杂的完整性规则（如「讲师工资不得低于 3000 元自动改 3000」），与数据完整性密切相关。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-trigger', text: '触发器与完整性规则' }],
    },
    {
      id: 'p1-j4',
      kind: 'judge',
      question: '<p>4. 索引是数据库逻辑结构设计及提高查询效率的重要手段。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>建立索引属于数据库<strong>物理结构设计</strong>（选择存取方法）的内容，不是逻辑结构设计的内容；索引确实能加快查询，但题干把它的设计阶段说错了。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-physical', text: '关系模式存取方法选择（B+ 树索引）' },
        { deck: 3, sec: 'sec-db3-ddl', text: '索引的建立与删除' },
      ],
    },
    {
      id: 'p1-j5',
      kind: 'judge',
      question: '<p>5. 主变量是嵌入式 SQL 中与主语言通信的重要手段之一。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>嵌入式 SQL 与主语言通信的三种手段是：SQL 通信区（SQLCA）、主变量（共享变量）和游标；主变量向 SQL 语句提供参数并接受查询结果。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-esql', text: '嵌入式 SQL 与主语言的通信' }],
    },
    {
      id: 'p1-e1',
      kind: 'essay',
      question: '<p>1. 什么是数据库？（5 分）</p>',
      answer:
        '<p>数据库（DB）是<strong>长期存储在计算机内、有组织的、可共享的大量数据的集合</strong>。数据库中的数据按一定的数据模型组织、描述和存储，具有较小的冗余度、较高的数据独立性和易扩展性，并可被各类用户共享。</p>',
      explanation: '<p>按课件定义作答即可，抓住三个要点：长期存储（永久存储）、有组织（按数据模型组织）、可共享。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库的定义' }],
    },
    {
      id: 'p1-e2',
      kind: 'essay',
      question: '<p>2. 数据库系统与文件系统最主要的区别是什么？（5 分）</p>',
      answer:
        '<p>最主要的区别是<strong>数据的结构化</strong>：数据库系统实现数据的<strong>整体结构化</strong>——数据及其全局联系按统一的数据模型描述，数据面向整个系统（全体应用）；而文件系统只能实现记录内部的<strong>局部结构化</strong>，文件之间彼此独立、面向单个应用。由此带来数据库系统数据共享性高、冗余度低、数据独立性高，并由 DBMS 统一管理和控制（安全性、完整性、并发控制、故障恢复）。</p>',
      explanation: '<p>要点：整体结构化 vs 局部结构化，再从共享、冗余、独立性、统一管理等方面展开。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库系统的特点' }],
    },
    {
      id: 'p1-e3',
      kind: 'essay',
      question: '<p>3. 简述数据库系统中的架构（Schema）。（5 分）</p>',
      answer:
        '<p>架构（模式）是对数据库的描述，是数据的<strong>型</strong>（框架），而不是具体的值。从数据库管理系统角度看，数据库系统通常采用<strong>三级模式结构</strong>：</p><ul><li><strong>模式</strong>（概念模式）：数据库中全体数据的逻辑结构和特征的描述，所有用户的公共数据视图；</li><li><strong>外模式</strong>：各个用户看得见的局部数据逻辑结构（子模式）；</li><li><strong>内模式</strong>：数据物理结构和存储方式的描述。</li></ul><p>三级模式之间通过<strong>外模式/模式映像</strong>和<strong>模式/内模式映像</strong>两级映像联系起来，从而保证了数据的逻辑独立性与物理独立性。在 SQL 中，架构还是一个独立于数据库用户的非重复命名空间，是基本表、视图、索引等对象的容器（CREATE SCHEMA / DROP SCHEMA）。</p>',
      explanation: '<p>既要点出三级模式与二级映像，也可补充 SQL 层面「架构=对象容器」的语义。</p>',
      tags: [
        { deck: 1, sec: 'sec-db1-structure', text: '三级模式与二级映像' },
        { deck: 3, sec: 'sec-db3-ddl', text: '架构（Schema）的定义与删除' },
      ],
    },
    {
      id: 'p1-e4',
      kind: 'essay',
      question: '<p>4. 系统故障恢复技术保证了事务的哪些特性？（5 分）</p>',
      answer:
        '<p>保证了事务的<strong>原子性</strong>和<strong>持久性</strong>：</p><ul><li><strong>原子性</strong>：事务的所有操作在数据库中要么全部正确执行（提交），要么全部不执行（回滚）——故障发生时对未完成事务利用日志进行撤销（UNDO）；</li><li><strong>持久性</strong>：事务一旦提交，其对数据库的改变就是永久性的，接下来的故障不应有任何影响——对已提交事务利用日志进行重做（REDO）。</li></ul>',
      explanation: '<p>恢复子系统通过日志文件（与数据备份）的 UNDO/REDO 保证 A 与 D；一致性与隔离性分别由完整性约束/并发控制机制保证。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: '事务的 ACID 特性' }],
    },
    {
      id: 'p1-e5',
      kind: 'essay',
      question:
        '<p>设学生成绩数据库由四个基本关系组成：Student(Sno, Sname, Sex, Sage, Mno)（学生基本信息表）、Course(Cno, Cname)（课程信息表）、SC(Sno, Cno, Grade)（学生选课表）、Majors(Mno, Mname, Dno)（专业表）。其中 Sage 为年龄、Mno 为专业号、Grade 为课程成绩、Mname 为专业名称、Dno 为系编号。用关系代数完成以下查询：</p><p>（1）查询「计算机」专业全体女同学的信息；（2）查询未选修「Java 语言」课程的学生学号与姓名。</p>',
      answer:
        `<pre class="code"><code>（1）π_(Sno,Sname,Sex,Sage,Mno)( σ_(Mname='计算机' ∧ Sex='女') ( Student ⋈ Majors ) )
（2）π_(Sno,Sname)(Student) － π_(Sno,Sname)( σ_(Cname='Java语言') ( Student ⋈ SC ⋈ Course ) )</code></pre>`,
      explanation:
        '<p>（1）「计算机」专业是专业名称 Mname 的取值，需先连接 Majors 取得专业名称再选择；（2）「未选修」用差运算：全体学生减去选修了 Java 语言课程的学生集合（连接后按 Sno,Sname 投影去重）。</p>',
      tags: [
        { deck: 2, sec: 'sec-db2-algebra', text: '选择与投影运算' },
        { deck: 2, sec: 'sec-db2-algebra', text: '差运算与连接' },
      ],
    },
    {
      id: 'p1-e6',
      kind: 'essay',
      question: '<p>阐述数据库系统的三级模式结构，并分析数据库设计与三级模式结构的关系。（10 分）</p>',
      answer:
        '<p><strong>三级模式结构</strong>：① 模式（概念模式）——数据库全体数据的全局逻辑结构和特征的描述；② 外模式——各用户的局部数据逻辑结构；③ 内模式——数据物理结构和存储方式的描述。三级模式之间通过外模式/模式映像和模式/内模式映像两级映像联系和转换，保证了数据的逻辑独立性和物理独立性。</p><p><strong>与数据库设计的关系</strong>（设计各阶段的产物对应三级模式）：</p><ul><li>需求分析阶段综合用户的应用需求；</li><li>概念设计阶段形成独立于 DBMS 的概念模式（E-R 图），经逻辑设计转换为关系模型，形成数据库的<strong>模式（逻辑模式）</strong>；</li><li>根据用户的处理要求和安全性的考虑，在基本表的基础上建立必要的视图，形成数据库的<strong>外模式</strong>；</li><li>物理设计阶段根据 DBMS 的特点和处理需要选择存储结构、建立索引，形成数据库的<strong>内模式</strong>。</li></ul>',
      explanation: '<p>此题即课件 1.3 与 7.1.3 的结合：先画三级模式+二级映像，再按设计六阶段说明每一阶段的产物落在哪一级模式上。</p>',
      tags: [
        { deck: 1, sec: 'sec-db1-structure', text: '三级模式结构' },
        { deck: 7, sec: 'sec-db7-overview', text: '数据库设计与三级模式' },
      ],
    },
    {
      id: 'p1-e7',
      kind: 'essay',
      question:
        '<p>某出版社数据库的设计需求如下——实体：<strong>图书</strong>（书名、类型、出版日期、页数）；<strong>作者</strong>（有唯一的作者标识符和作者姓名）；<strong>代理商</strong>（有唯一的代理商标识符及名称）；<strong>编辑者</strong>（有唯一的编辑标识符及其姓名）。应用语义：每本书由一位作者撰写，一位作者可以撰写多本书（书名不同），不同的作者可以撰写名称相同的两本不同的书；每一位作者由一家代理商代理，每家代理商代理不少于一位作者；一本书有一位编辑，每位编辑负责编辑的书不少于一本。要求：1. 完成概念设计，画出 E-R 图；2. 进行逻辑设计，范式式要求 BCNF，指出关系模式的主码与外码等。（20 分）</p>',
      answer:
        `<p><strong>1. E-R 图</strong>（4 个实体、3 个联系）：</p><pre class="code"><code>作者 ——(撰写 1:n)—— 图书 ——(编辑 1:n)—— 编辑者
作者 ——(代理 n:1)—— 代理商
（图书增加「图书号」作为唯一标识：不同作者可写同名书）</code></pre><p><strong>2. 逻辑设计（转换规则：1:n 联系并入 n 端）</strong>：</p><pre class="code"><code>代理商（代理商ID，名称）                主码：代理商ID
作者（作者ID，姓名，代理商ID）          主码：作者ID；外码：代理商ID
编辑者（编辑ID，姓名）                  主码：编辑ID
图书（图书号，书名，类型，出版日期，页数，作者ID，编辑ID）
                                        主码：图书号；外码：作者ID、编辑ID</code></pre><p><strong>BCNF 分析</strong>：以上各模式的候选码均为单属性码（图书号、作者ID、代理商ID、编辑ID），每个决定因子都包含码（函数依赖均为 码→其余属性），不存在对码的部分依赖与传递依赖，故各关系模式都属于 BCNF。</p>`,
      explanation:
        '<p>注意「不同作者可以撰写名称相同的两本不同的书」意味着书名不能作码，需引入图书号；「每位作者由一家代理商代理、一家代理多位作者」是 1:n 联系，按转换规则外码放在作者端。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-concept', text: '设计局部 E-R 图' },
        { deck: 7, sec: 'sec-db7-logic', text: 'E-R 模型向关系模型转换' },
        { deck: 6, sec: 'sec-db6-normal', text: 'BCNF' },
      ],
    },
  ],
};

export default paper;

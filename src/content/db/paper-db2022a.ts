/* 试卷 4 · 2022-2023 学年第二学期数据库系统期末试卷 A 卷——转录自原卷扫描页（课程代码 0529882B，2023.05.23，闭卷）。
   原卷带学生手写作答，参考答案由本站按课件内容整理。 */
import type { DbPaper } from './types';

const paper: DbPaper = {
  id: 'db-2022a',
  title: '2022-2023 学年第二学期 · 数据库系统期末试卷 A 卷',
  source: '合肥工业大学2022-2023学年第二学期数据库系统期末试卷A卷.pdf',
  answerSource: '本站整理',
  sections: [
    { title: '一、选择题', questionIds: ['p4-s1', 'p4-s2', 'p4-s3', 'p4-s4', 'p4-s5', 'p4-s6', 'p4-s7', 'p4-s8', 'p4-s9', 'p4-s10'] },
    { title: '二、填空题', questionIds: ['p4-f1-1', 'p4-f1-2', 'p4-f2-1', 'p4-f3-1', 'p4-f3-2', 'p4-f4-1', 'p4-f4-2', 'p4-f5-1', 'p4-f6-1'] },
    { title: '三、简答题', questionIds: ['p4-e1', 'p4-e2', 'p4-e3', 'p4-e4'] },
    { title: '四、操作题（关系代数）', questionIds: ['p4-e5', 'p4-e6'] },
    { title: '四、操作题（SQL）', questionIds: ['p4-e7', 'p4-e8'] },
    { title: '五、设计题', questionIds: ['p4-e9'] },
  ],
  questions: [
    {
      id: 'p4-s1',
      kind: 'single',
      question: '<p>1. 数据库系统的<strong>逻辑独立性</strong>是指：</p>',
      options: [
        'A. 数据库系统的物理存储结构改变，应用程序可以不改变',
        'B. 数据库系统的模式改变，应用程序可以不改变',
        'C. 数据库系统的外模式改变，应用程序可以不改变',
        'D. 数据库系统的内模式改变，应用程序可以不改变',
      ],
      answer: 'B',
      explanation:
        '<p>逻辑独立性：模式（全局逻辑结构）改变时，由外模式/模式映像调整，外模式与应用程序不必改变。物理存储结构/内模式改变而应用程序不变是<strong>物理独立性</strong>。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '逻辑独立性与物理独立性' }],
    },
    {
      id: 'p4-s2',
      kind: 'single',
      question: '<p>2. 对于关系模型，下列描述<strong>不正确</strong>的是：</p>',
      options: [
        'A. 关系模型一种逻辑模型',
        'B. 关系模型的数据结构是关系（二维表）',
        'C. 关系模型的数据操作是记录操作',
        'D. 关系模型的存取路径对用户隐蔽',
      ],
      answer: 'C',
      explanation:
        '<p>关系操作的特点是<strong>集合操作方式</strong>——操作的对象和结果都是集合（一次一集合），不是记录（一次一记录）操作；A、B、D 均为关系模型的正确描述（存取路径对用户隐蔽，用户只要指出「做什么」）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-op', text: '关系操作的特点' }],
    },
    {
      id: 'p4-s3',
      kind: 'single',
      question: '<p>3. 下列关于视图的描述，<strong>正确</strong>的是：</p>',
      options: [
        'A. 数据库中存放视图的定义和数据',
        'B. 视图都是可更新的',
        'C. 视图可以提高数据的物理独立性',
        'D. 视图对数据库数据能提供一定程度的安全保护',
      ],
      answer: 'D',
      explanation:
        '<p>视图是虚表，只存放定义不存放数据（A 错）；只有行列子集视图可更新，含聚集函数/GROUP BY 的视图不可更新（B 错）；视图提供的是<strong>逻辑独立性</strong>（C 错）；视图把要保密的数据对无权用户隐藏起来，提供安全保护（D 对）。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-view', text: '视图的定义与作用' },
        { deck: 4, sec: 'sec-db4-view', text: '视图机制' },
      ],
    },
    {
      id: 'p4-s4',
      kind: 'single',
      question: '<p>4. 下列关于索引的描述，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 一个表上至多只能建一个聚集索引',
        'B. 索引属于内模式范畴',
        'C. 属性值分布严重不均匀的属性，适宜建索引',
        'D. 经常查询的属性，适宜建索引',
      ],
      answer: 'C',
      explanation:
        '<p>一个基本表上最多只能建立一个聚集索引（A 对）；索引描述存取方法，属于内模式（B 对）；经常作为查询条件、聚集函数参数、连接条件的属性适宜建索引（D 对）。属性值分布严重不均匀的属性上，索引的选择性难以保证、维护代价高，并不适宜建索引（C 错）。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-physical', text: 'B+ 树索引存取方法的选择' },
        { deck: 3, sec: 'sec-db3-ddl', text: '索引的建立与删除' },
      ],
    },
    {
      id: 'p4-s5',
      kind: 'single',
      question: '<p>5. 系统故障时，需要用到（&nbsp;&nbsp;）进行事务恢复：</p>',
      options: ['A. 数据备份', 'B. 日志文件', 'C. 数据备份和日志文件', 'D. 数据字典'],
      answer: 'C',
      explanation:
        '<p>故障恢复同时依靠<strong>数据备份</strong>（转储的副本，用于介质故障恢复）和<strong>日志文件</strong>（记录事务操作，用于 UNDO/REDO 恢复）；数据字典不用于事务恢复。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: '事务的恢复' }],
    },
    {
      id: 'p4-s6',
      kind: 'single',
      question: '<p>6. 关系数据库的二级封锁协议，能够解决下列哪些数据不一致：</p>',
      options: [
        'A. 丢失修改和不可重复读',
        'B. 不可重复读和读脏数据',
        'C. 丢失修改和读脏数据',
        'D. 丢失修改、不可重复读和读脏数据',
      ],
      answer: 'C',
      explanation:
        '<p>一级封锁协议（事务修改前加 X 锁、直到事务结束才释放）解决<strong>丢失修改</strong>；二级封锁协议在一级基础上增加事务读数据前先加 S 锁、读完后即可释放，可进一步解决<strong>读脏数据</strong>；不可重复读需要三级封锁协议（S 锁保持到事务结束）。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: '封锁协议' }],
    },
    {
      id: 'p4-s7',
      kind: 'single',
      question: '<p>7. DBMS 查询处理中的<strong>代数优化</strong>指的是：</p>',
      options: [
        'A. 查询语句进行语义检查，生成查询树',
        'B. 执行查询计划，返回查询结果',
        'C. 对关系代数表达式进行等价变换',
        'D. 选择高效的操作算法和存取路径',
      ],
      answer: 'C',
      explanation:
        '<p>代数优化：通过关系代数表达式的<strong>等价变换</strong>来提高查询效率（改变操作的次序和组合）；选择高效的操作算法和存取路径是<strong>物理优化</strong>。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-optimize', text: '代数优化与物理优化' }],
    },
    {
      id: 'p4-s8',
      kind: 'single',
      question:
        '<p>8. 对于一个关系模式的具体关系 R，满足关系的 6 个性质，若每个决定因子必包含码，则该关系模式属于：</p>',
      options: ['A. 1NF', 'B. 2NF', 'C. 3NF', 'D. BCNF'],
      answer: 'D',
      explanation:
        '<p>BCNF 的定义：每个函数依赖 X→Y 的决定因素（左部）都包含 R 的候选码。「每个决定因子必包含码」正是 BCNF。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: 'BCNF 的定义' }],
    },
    {
      id: 'p4-s9',
      kind: 'single',
      question: '<p>9. 关于存储过程，下列说法<strong>不正确</strong>的是：</p>',
      options: [
        'A. 定义在关系表上，由事件驱动执行',
        'B. 编译后存储在数据库中，可以反复调用',
        'C. 降低了客户端和服务器之间的通信量',
        'D. 运行效率高',
      ],
      answer: 'A',
      explanation:
        '<p>「定义在关系表上、由事件（增删改）驱动自动执行」是<strong>触发器</strong>的特征；存储过程经编译和优化后存储在数据库服务器中、调用即用（B、C、D 都是存储过程的正确特征）。</p>',
      tags: [
        { deck: 8, sec: 'sec-db8-proc', text: '存储过程' },
        { deck: 5, sec: 'sec-db5-trigger', text: '触发器' },
      ],
    },
    {
      id: 'p4-s10',
      kind: 'single',
      question: '<p>10. 关系数据库<strong>规范化理论</strong>是为了解决关系数据库中____的问题：</p>',
      options: [
        'A. 提高查询速度',
        'B. 插入、删除异常和数据冗余',
        'C. 保证数据的安全性',
        'D. 保证数据的完整性',
      ],
      answer: 'B',
      explanation:
        '<p>规范化理论研究关系模式中函数依赖带来的问题：不合适的模式会产生<strong>插入异常、删除异常、数据冗余、更新异常</strong>（如课件 6.1 的 SDC 例子），规范化正是为了解决这些问题。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-why', text: '规范化要解决的问题（数据冗余与操作异常）' }],
    },
    {
      id: 'p4-f1-1',
      kind: 'fill',
      question:
        '<p>1. 传统的集合「并、交、差」运算施加于两个关系时，这两个关系的__________必须相等，且相应的__________必须取自同一个域。（第 1 空）</p>',
      answer: '目（度，属性个数）',
      explanation:
        '<p>第 1 空：并、交、差要求两关系为<strong>同一目关系</strong>（目即属性的个数/度）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '传统集合运算的前提' }],
    },
    {
      id: 'p4-f1-2',
      kind: 'fill',
      question:
        '<p>1. 传统的集合「并、交、差」运算施加于两个关系时，这两个关系的__________必须相等，且相应的__________必须取自同一个域。（第 2 空）</p>',
      answer: '属性值（属性）',
      explanation: '<p>第 2 空：相应的<strong>属性值</strong>（属性）必须取自同一个域。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '传统集合运算的前提' }],
    },
    {
      id: 'p4-f2-1',
      kind: 'fill',
      question:
        '<p>2. 关系模型的参照完整性的基本关系 R 的外码，或者为空值，或者为____________________。</p>',
      answer: '被参照（基本）关系 S 中某个元组的主码值',
      explanation:
        '<p>参照完整性规则：外码 F 的值或者取空值（F 的每个属性值均为空值），或者等于 S 中某个元组的主码值。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-integrity', text: '参照完整性规则' }],
    },
    {
      id: 'p4-f3-1',
      kind: 'fill',
      question:
        '<p>3. 设 K 为 R(U,F) 中的属性或属性组，若 U__________K，则 K 为 R 的候选码；若 U__________K（存在部分依赖），则 K 为 R 的超码。（第 1 空）</p>',
      answer: '完全函数依赖于（K → U）',
      explanation:
        '<p>第 1 空：K→U 且不存在 K 的真子集 K&#39; 使 K&#39;→U（即 U <strong>完全函数依赖</strong>于 K）时，K 是候选码。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-armstrong', text: '候选码的求解' }],
    },
    {
      id: 'p4-f3-2',
      kind: 'fill',
      question:
        '<p>3. 设 K 为 R(U,F) 中的属性或属性组，若 U__________K，则 K 为 R 的候选码；若 U__________K（存在部分依赖），则 K 为 R 的超码。（第 2 空）</p>',
      answer: '部分函数依赖于',
      explanation: '<p>第 2 空：U <strong>部分函数依赖</strong>于 K（K 的真子集也能决定 U）时，K 只是超码，不是候选码。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: '完全依赖与部分依赖' }],
    },
    {
      id: 'p4-f4-1',
      kind: 'fill',
      question:
        '<p>4. 并发控制保证了事务的__________和一致性，故障恢复保证了事务的__________和持久性。（第 1 空）</p>',
      answer: '隔离性',
      explanation:
        '<p>第 1 空：并发控制（封锁等）保证事务的<strong>隔离性</strong>——多个并发事务互不干扰。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: 'ACID 与并发控制' }],
    },
    {
      id: 'p4-f4-2',
      kind: 'fill',
      question:
        '<p>4. 并发控制保证了事务的__________和一致性，故障恢复保证了事务的__________和持久性。（第 2 空）</p>',
      answer: '原子性',
      explanation:
        '<p>第 2 空：故障恢复（日志 UNDO/REDO）保证事务的<strong>原子性</strong>（全做或全不做）和持久性。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: 'ACID 与故障恢复' }],
    },
    {
      id: 'p4-f5-1',
      kind: 'fill',
      question:
        '<p>5. 多个事务的并发执行是正确的，当且仅当其结果与某一串行执行的结果相同，并称这种调度策略为____________________。</p>',
      answer: '可串行化调度',
      explanation:
        '<p>多个事务的并发执行正确 ⇔ 调度与某一串行执行结果等价——这种调度称为<strong>可串行化调度</strong>（两段锁协议是可串行化的充分条件）。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: '可串行化调度' }],
    },
    {
      id: 'p4-f6-1',
      kind: 'fill',
      question: '<p>6. 触发器的触发事件是指：______________________________。</p>',
      answer: 'INSERT、DELETE、UPDATE（对表的插入、删除、更新操作）',
      explanation:
        '<p>触发事件是激活触发器的 DML 操作——INSERT、DELETE、UPDATE；触发器由这些事件激活并由数据库服务器自动执行。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-trigger', text: '触发事件' }],
    },
    {
      id: 'p4-e1',
      kind: 'essay',
      question: '<p>1. 什么是角色？举例说明数据库角色的作用。（5 分）</p>',
      answer:
        `<p><strong>数据库角色</strong>是被命名的一组与数据库操作相关的权限，即<strong>权限的集合</strong>。可以为一组具有相同权限的用户创建一个角色，把权限授予角色、再把角色授予用户，从而<strong>简化授权过程</strong>。</p><p>例：</p><pre class="code"><code>CREATE ROLE R1;
GRANT SELECT, UPDATE ON Student TO R1;      -- 给角色授权
GRANT R1 TO 张三, 李四 WITH ADMIN OPTION;   -- 把角色授予一组用户
REVOKE SELECT ON Student FROM R1;           -- 角色权限收回，影响该角色下全部用户</code></pre>`,
      explanation: '<p>定义（命名的权限集合）+ 作用（简化同组用户的授权）+ CREATE ROLE/GRANT 例子。</p>',
      tags: [{ deck: 4, sec: 'sec-db4-control', text: '数据库角色' }],
    },
    {
      id: 'p4-e2',
      kind: 'essay',
      question: '<p>2. 简述两段锁协议及其作用。（5 分）</p>',
      answer:
        '<p><strong>两段锁协议（2PL）</strong>：所有事务必须分两个阶段对数据项加锁和解锁。</p><ul><li><strong>扩展阶段</strong>（加锁阶段）：事务可以加锁（S 锁、X 锁），但不能释放任何锁；</li><li><strong>收缩阶段</strong>（解锁阶段）：事务只能释放锁，不能再加任何锁。</li></ul><p><strong>作用</strong>：若并发执行的 所有事务都遵守两段锁协议，则对这些事务的任何并发调度策略都是<strong>可串行化</strong>的——两段锁协议是可串行化调度的<strong>充分条件</strong>。需要注意：遵守两段锁协议的事务可能发生<strong>死锁</strong>（可串行化并不能避免死锁）；两段锁协议也不要求事务一次将所有要用的数据加锁（那是一次封锁法）。</p>',
      explanation: '<p>两阶段划分 + 可串行化充分条件 + 可能死锁的说明。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-tx', text: '两段锁协议' }],
    },
    {
      id: 'p4-e3',
      kind: 'essay',
      question: '<p>3. 模式分解等价的三种定义分别是什么？（5 分）</p>',
      answer:
        '<p>把一个关系模式分解为若干关系模式后，与原模式等价的三种定义：</p><ol><li>分解具有<strong>无损连接性</strong>——分解后的关系通过自然连接能恢复原关系而不产生多余的元组（信息不失真）；</li><li>分解<strong>保持函数依赖</strong>——原模式的函数依赖集被分解后各模式函数依赖集的并集逻辑蕴含（不丢失依赖）；</li><li>分解<strong>既具有无损连接性又保持函数依赖</strong>——两者兼得。</li></ol><p>注：无损连接性与保持函数依赖是两个相互独立的标准；一个模式分解可以做到无损连接但不保持函数依赖，反之亦然。</p>',
      explanation: '<p>三条标准逐条作答，并说明它们相互独立。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-decompose', text: '模式分解的等价标准' }],
    },
    {
      id: 'p4-e4',
      kind: 'essay',
      question: '<p>4. 简述 RDBMS 查询处理的一般步骤。（5 分）</p>',
      answer:
        '<p>查询处理分四个阶段：</p><ol><li><strong>查询分析</strong>：对查询语句进行扫描、词法分析和语法分析，判断是否符合 SQL 语法规则，不正确则报错终止；</li><li><strong>查询检查</strong>：根据数据字典对合法的查询语句进行语义检查，检查用户存取权限、完整性约束等；将 SQL 语句转换成等价的关系代数表达式（语法分析树），把数据库对象的外部名称转换为内部表示；</li><li><strong>查询优化</strong>：选择一个高效的查询处理策略——代数优化（关系代数表达式等价变换）与物理优化（存取路径和底层操作算法的选择），依据基于规则/基于代价/基于语义的方法；</li><li><strong>查询执行</strong>：依据优化器得到的执行策略生成查询计划，代码生成器生成执行查询计划的代码，执行代码返回查询结果及状态。</li></ol>',
      explanation: '<p>即课件 9.1.1 的四个阶段，逐阶段说明其内容。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-process', text: '查询处理步骤' }],
    },
    {
      id: 'p4-e5',
      kind: 'essay',
      question:
        '<p>设项目管理数据库包括供应商 S(SNO, SNAME, STATUS, CITY)（供应商编号、名称、状态、所在城市）、零件 P(PNO, PNAME, COLOR, WEIGHT)（零件编号、名称、颜色、重量）、工程项目 J(JNO, JNAME, CITY)（工程项目编号、名称、所在城市）和供应情况 SPJ(SNO, PNO, JNO, QTY)（QTY 为某供应商为某个工程项目供应零件的数量）四个关系模式。用关系代数完成以下查询：</p><p>1）查询供应工程项目（编号「J1」）零件为红色的供应商编号和名称。</p>',
      answer:
        '<pre class="code"><code>π_(SNO,SNAME)( σ_(JNO=\'J1\' ∧ COLOR=\'红\') ( S ⋈ SPJ ⋈ P ) )</code></pre>',
      explanation:
        '<p>供应商、供应情况、零件三表自然连接后，按工程编号与零件颜色选择，再投影供应商编号与名称。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '连接与选择投影的综合' }],
    },
    {
      id: 'p4-e6',
      kind: 'essay',
      question:
        '<p>（接上题）用关系代数完成以下查询：</p><p>2）查询至少用了供应商（编号「S1」）所供应的全部零件的工程项目编号。</p>',
      answer:
        '<pre class="code"><code>π_(JNO,PNO)(SPJ) ÷ π_(PNO)( σ_(SNO=\'S1\') (SPJ) )</code></pre>',
      explanation:
        '<p>「至少用了…全部零件」用<strong>除运算</strong>：除数取供应商 S1 所供应的全部零件号（被除数含 JNO、PNO 两列），商即为满足条件的工程项目编号。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '除运算 ÷' }],
    },
    {
      id: 'p4-e7',
      kind: 'essay',
      question:
        '<p>（接上题的 SPJ 数据库）用 SQL 语言完成以下查询：</p><p>1）查询「上海」的供应商所供应的所有零件的总重量和总数量，并按总重量降序排序。（原卷照片字迹较浅，本小题个别文字按可辨认内容转录）</p>',
      answer:
        `<pre class="code"><code>SELECT S.SNO, SUM(P.WEIGHT) AS 总重量, SUM(SPJ.QTY) AS 总数量
FROM S, P, SPJ
WHERE S.SNO = SPJ.SNO AND P.PNO = SPJ.PNO
  AND S.CITY = '上海'
GROUP BY S.SNO
ORDER BY 总重量 DESC;</code></pre>`,
      explanation:
        '<p>供应商三表连接后按城市选择，对每个上海供应商用聚集函数 SUM 统计零件重量与供应数量并降序输出；若「总重量」按实际供货量计，可用 SUM(P.WEIGHT * SPJ.QTY)。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-query', text: '聚集函数与分组统计' },
        { deck: 3, sec: 'sec-db3-query', text: '多表连接查询' },
      ],
    },
    {
      id: 'p4-e8',
      kind: 'essay',
      question:
        '<p>（接上题）用 SQL 语言完成以下操作：</p><p>2）把供应商（编号为「S7」）供应给工程项目（编号为「J1」）的零件（编号为「P6」）改为供应商（编号为「S1」）供应。</p>',
      answer:
        `<pre class="code"><code>UPDATE SPJ SET SNO = 'S1'
WHERE SNO = 'S7' AND JNO = 'J1' AND PNO = 'P6';</code></pre>`,
      explanation:
        '<p>修改供应情况表中该条供应记录的供应商编号（UPDATE…SET…WHERE）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-update', text: '数据修改（UPDATE）' }],
    },
    {
      id: 'p4-e9',
      kind: 'essay',
      question:
        '<p>某图书出版社的图书销售系统中，有以下实体：<strong>图书</strong>（图书 ID、名称、种类、内容简介、价格等），<strong>顾客</strong>（顾客 ID、姓名、电话、地址等），<strong>员工</strong>（员工 ID、姓名、身份证号、住址、电话等）。顾客以订单形式购买图书：一个顾客可以有一个或多个订单，每个订单可以包含一种或多种图书；每个订单需单独开具一张发票，可以采用多种支付方式（如支票、信用卡或现金等）；员工负责处理客户的订单，包括将订单图书打包、选用一种方式（如直接交付、快递送货、安排车辆送货等）发送给客户。设计要求：</p><p>（1）根据应用语义正确设计该系统数据库的 E-R 图（7 分）；（2）将 E-R 模型转换成关系模型（5 分）；（3）指出每个关系模式的主码与外码（若存在）（3 分）；（4）分析每个关系模式所属范式，若已达到 3NF，则需说明理由；若未达到 3NF，则需进行分解使其达到 3NF（5 分）。</p>',
      answer:
        `<p><strong>（1）E-R 图</strong>：</p><pre class="code"><code>顾客 ——(拥有 1:n)—— 订单 ——(包含 m:n，属性：数量)—— 图书
订单 ——(开具 1:1)—— 发票（支付方式、发货方式作为发票/订单的属性）
员工 ——(处理 1:n)—— 订单</code></pre><p><strong>（2）转换成关系模型</strong>：</p><pre class="code"><code>顾客（顾客ID，姓名，电话，地址）
图书（图书ID，名称，种类，内容简介，价格）
订单（订单ID，顾客ID，员工ID，支付方式，发货方式）
订单明细（订单ID，图书ID，数量）
发票（发票ID，订单ID）</code></pre><p><strong>（3）主码与外码</strong>：</p><ul><li>顾客：主码 顾客ID，无外码；</li><li>图书：主码 图书ID，无外码；</li><li>订单：主码 订单ID，外码 顾客ID、员工ID；</li><li>订单明细：主码 (订单ID, 图书ID)，外码 订单ID、图书ID；</li><li>发票：主码 发票ID，外码 订单ID（订单与发票 1:1，订单ID 亦可作发票的候选码）。</li></ul><p><strong>（4）范式分析</strong>：各模式均达到 3NF——顾客、图书、发票的非主属性完全函数依赖于码且不存在传递依赖；订单明细为全码（含数量的 m:n 联系关系），必属 BCNF；订单模式中非主属性都直接依赖订单ID，无部分依赖与传递依赖（支付方式、发货方式是订单自身的属性），故属于 3NF（每个决定因子为订单ID，亦属 BCNF）。</p>`,
      explanation:
        '<p>设计要点：m:n 联系「包含」单独成订单明细；1:1 联系「开具」可并入任一端；员工-订单 1:n 外码放订单端。范式分析逐模式说明「无部分依赖、无传递依赖」。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-concept', text: '全局 E-R 图设计' },
        { deck: 7, sec: 'sec-db7-logic', text: 'E-R 模型向关系模型转换' },
        { deck: 6, sec: 'sec-db6-normal', text: '范式判定' },
      ],
    },
  ],
};

export default paper;

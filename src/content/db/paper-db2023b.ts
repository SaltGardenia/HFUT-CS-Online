/* 试卷 5 · 2023-2024 学年第二学期数据库系统期末试卷 B 卷（宣城校区）——转录自原卷 .doc（Word 转文本）。
   原卷不含答案，参考答案由本站按课件内容整理。 */
import type { DbPaper } from './types';

const paper: DbPaper = {
  id: 'db-2023b',
  title: '2023-2024 学年第二学期 · 数据库系统期末试卷 B 卷（宣城校区）',
  source: '合肥工业大学2023-2024学年第二学期数据库系统期末试卷B卷(宣城校区).doc',
  answerSource: '本站整理',
  sections: [
    { title: '一、选择题', questionIds: ['p5-s1', 'p5-s2', 'p5-s3', 'p5-s4', 'p5-s5', 'p5-s6', 'p5-s7', 'p5-s8', 'p5-s9', 'p5-s10'] },
    { title: '二、填空题', questionIds: ['p5-f1-1', 'p5-f1-2', 'p5-f1-3', 'p5-f2-1', 'p5-f2-2', 'p5-f3-1', 'p5-f4-1', 'p5-f4-2', 'p5-f5-1', 'p5-f5-2'] },
    { title: '三、判断题', questionIds: ['p5-j1', 'p5-j2', 'p5-j3', 'p5-j4', 'p5-j5', 'p5-j6', 'p5-j7', 'p5-j8', 'p5-j9', 'p5-j10'] },
    { title: '四、简答题', questionIds: ['p5-e1', 'p5-e2'] },
    { title: '五、操作题（关系代数）', questionIds: ['p5-e3', 'p5-e4', 'p5-e5'] },
    { title: '五、操作题（SQL）', questionIds: ['p5-e6', 'p5-e7', 'p5-e8'] },
    { title: '六、设计题', questionIds: ['p5-e9'] },
  ],
  questions: [
    {
      id: 'p5-s1',
      kind: 'single',
      question: '<p>1. 数据库系统是采用了数据库技术的计算机系统，数据库系统构成包括数据库、数据库管理系统、应用系统和：</p>',
      options: ['A. 数据库系统分析员', 'B. 程序员', 'C. 数据库管理员', 'D. 操作员'],
      answer: 'C',
      explanation:
        '<p>数据库系统由数据库、数据库管理系统（及其应用开发工具）、应用程序和<strong>数据库管理员</strong>（DBA）组成。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库系统的组成' }],
    },
    {
      id: 'p5-s2',
      kind: 'single',
      question: '<p>2. 用二维表结构表示实体以及实体间联系的数据模型称为：</p>',
      options: ['A. 网状模型', 'B. 层次模型', 'C. 关系模型', 'D. 面向对象模型'],
      answer: 'C',
      explanation:
        '<p>关系模型用单一的<strong>二维表</strong>结构表示实体及实体间的联系；层次模型是树，网状模型是图。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '常用的数据模型' }],
    },
    {
      id: 'p5-s3',
      kind: 'single',
      question: '<p>3. 能够保证数据库系统中的数据具有较高逻辑独立性的是：</p>',
      options: ['A. 外模式/模式映像', 'B. 模式', 'C. 模式/内模式映像', 'D. 外模式'],
      answer: 'A',
      explanation:
        '<p><strong>外模式/模式映像</strong>保证逻辑独立性：模式改变时改写该映像，外模式不变，应用程序不必修改；模式/内模式映像保证的是物理独立性。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像与数据独立性' }],
    },
    {
      id: 'p5-s4',
      kind: 'single',
      question: '<p>4. 下面关于关系性质的说法，<strong>错误</strong>的是：</p>',
      options: [
        'A. 表中的一行称为一个元组',
        'B. 行与列交叉点不允许有多个值',
        'C. 表中的一列称为一个属性',
        'D. 表中任意两行可以相同',
      ],
      answer: 'D',
      explanation:
        '<p>基本关系的性质：任意两个元组的候选码不能取相同的值——元组不能完全相同（D 错误）。行列交叉点即分量必须取原子值（B 对）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '基本关系的性质' }],
    },
    {
      id: 'p5-s5',
      kind: 'single',
      question: '<p>5. 关系代数运算的本质是：</p>',
      options: ['A. 关系运算', 'B. 谓词运算', 'C. 集合运算', 'D. 代数运算'],
      answer: 'C',
      explanation:
        '<p>关系代数以关系为运算对象，传统的集合运算（并、交、差、笛卡尔积）与专门的关系运算都是<strong>集合运算</strong>——操作的对象和结果都是集合。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '关系代数运算的本质' }],
    },
    {
      id: 'p5-s6',
      kind: 'single',
      question: '<p>6. 当对关系 R 和 S 使用自然连接时，要求 R 和 S 含有一个或多个共有的：</p>',
      options: ['A. 元组', 'B. 行', 'C. 记录', 'D. 属性'],
      answer: 'D',
      explanation:
        '<p>自然连接是一种特殊的等值连接：要求 R 和 S 具有公共的<strong>属性</strong>（属性名相同、取自相同的域），并在结果中去掉重复列。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '自然连接' }],
    },
    {
      id: 'p5-s7',
      kind: 'single',
      question: '<p>7. 实体完整性是指关系中：</p>',
      options: [
        'A. 不允许有空行',
        'B. 主码不允许取空值',
        'C. 主属性值外的分量取空值',
        'D. 允许外码对应的属性取空值',
      ],
      answer: 'B',
      explanation:
        '<p>实体完整性：若属性 A 是基本关系 R 的主属性，则 A 取值必须唯一且<strong>不能取空值</strong>——即主码各属性均不能为空（空值无法唯一标识元组）。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-entity', text: '实体完整性规则' }],
    },
    {
      id: 'p5-s8',
      kind: 'single',
      question: '<p>8. SQL 中的 GRANT 和 REVOKE 语句可以用来实现：</p>',
      options: ['A. 自主存取控制', 'B. 强制存取控制', 'C. 数据库角色创建', 'D. 数据库审计'],
      answer: 'A',
      explanation:
        '<p>GRANT（授权）与 REVOKE（收回）实现用户权限的授予与收回，是<strong>自主存取控制（DAC）</strong>的实现方法；MAC 由敏感度标记（密级/许可证级别）实现；角色创建用 CREATE ROLE，审计用 AUDIT/NOAUDIT。</p>',
      tags: [{ deck: 4, sec: 'sec-db4-control', text: '授权：授予与收回' }],
    },
    {
      id: 'p5-s9',
      kind: 'single',
      question: '<p>9. 关系代数中的连接操作是由哪些操作组合而成：</p>',
      options: [
        'A. 选择和投影',
        'B. 选择和笛卡尔积',
        'C. 投影、选择和笛卡尔积',
        'D. 投影和笛卡尔积',
      ],
      answer: 'B',
      explanation:
        '<p>θ 连接从两个关系的笛卡尔积中选取属性间满足一定条件的元组——即<strong>笛卡尔积 + 选择</strong>（R⋈<sub>AθB</sub>S ≡ σ<sub>AθB</sub>(R×S)）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '连接运算' }],
    },
    {
      id: 'p5-s10',
      kind: 'single',
      question:
        '<p>10. 设关系模式 R(A, B, C)，其函数依赖 F={A→B, B→C}，则 R 的规范化程度最高达到：</p>',
      options: ['A. 1NF', 'B. 2NF', 'C. 3NF', 'D. BCNF'],
      answer: 'B',
      explanation:
        '<p>候选码为 A（A→B→C，A⁺ 即为全体属性）。非主属性为 B、C。码 A 是单属性，不存在非主属性对码的部分函数依赖 → 2NF；但存在传递函数依赖 A→B→C（B 不是候选码，即 B→C 的左部不含码、C 又是非主属性，违反 3NF 定义）→ 不属于 3NF。故 R 最高属于 <strong>2NF</strong>。</p>',
      tags: [
        { deck: 6, sec: 'sec-db6-normal', text: '2NF 与 3NF 的判定' },
        { deck: 6, sec: 'sec-db6-normal', text: '传递函数依赖' },
      ],
    },
    {
      id: 'p5-f1-1',
      kind: 'fill',
      question: '<p>1. 实体之间的联系可抽象为三类：____________、___________和___________。（第 1 空）</p>',
      answer: '一对一（1:1）',
      explanation:
        '<p>实体之间的联系抽象为三类：<strong>一对一（1:1）、一对多（1:n）、多对多（m:n）</strong>。第 1 空填「一对一」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '实体间的联系' }],
    },
    {
      id: 'p5-f1-2',
      kind: 'fill',
      question: '<p>1. 实体之间的联系可抽象为三类：____________、___________和___________。（第 2 空）</p>',
      answer: '一对多（1:n）',
      explanation: '<p>第 2 空填「一对多（1:n）」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '实体间的联系' }],
    },
    {
      id: 'p5-f1-3',
      kind: 'fill',
      question: '<p>1. 实体之间的联系可抽象为三类：____________、___________和___________。（第 3 空）</p>',
      answer: '多对多（m:n）',
      explanation: '<p>第 3 空填「多对多（m:n）」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '实体间的联系' }],
    },
    {
      id: 'p5-f2-1',
      kind: 'fill',
      question: '<p>2. 关系数据模型的完整性包括：实体完整性、___________和 ___________。（第 1 空）</p>',
      answer: '参照完整性',
      explanation:
        '<p>第 1 空填「参照完整性」（外码或为空值，或等于被参照关系某元组的主码值）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-integrity', text: '三类完整性' }],
    },
    {
      id: 'p5-f2-2',
      kind: 'fill',
      question: '<p>2. 关系数据模型的完整性包括：实体完整性、___________和 ___________。（第 2 空）</p>',
      answer: '用户定义的完整性',
      explanation: '<p>第 2 空填「用户定义的完整性」（针对具体应用的语义约束）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-integrity', text: '三类完整性' }],
    },
    {
      id: 'p5-f3-1',
      kind: 'fill',
      question: '<p>3. 视图是数据库三级模式中的___________。</p>',
      answer: '外模式',
      explanation:
        '<p>视图（虚表）是用户的局部数据视图，属于三级模式中的<strong>外模式</strong>；在基本表基础上建立视图即设计外模式。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-view', text: '理解视图' },
        { deck: 7, sec: 'sec-db7-logic', text: '用户视图设计' },
      ],
    },
    {
      id: 'p5-f4-1',
      kind: 'fill',
      question: '<p>4. 在 1NF 的基础上，消除了___________和 ___________后的关系模式，属于 3NF。（第 1 空）</p>',
      answer: '非主属性对码的部分函数依赖',
      explanation:
        '<p>3NF：在 1NF 基础上消除<strong>非主属性对码的部分函数依赖</strong>（达 2NF）和<strong>非主属性对码的传递函数依赖</strong>（达 3NF）。第 1 空填部分函数依赖。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: '2NF 与 3NF' }],
    },
    {
      id: 'p5-f4-2',
      kind: 'fill',
      question: '<p>4. 在 1NF 的基础上，消除了___________和 ___________后的关系模式，属于 3NF。（第 2 空）</p>',
      answer: '非主属性对码的传递函数依赖',
      explanation: '<p>第 2 空填传递函数依赖。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: '2NF 与 3NF' }],
    },
    {
      id: 'p5-f5-1',
      kind: 'fill',
      question: '<p>5. 查询优化包括：___________和___________两种优化方法。（第 1 空）</p>',
      answer: '代数优化（关系代数表达式的等价变换）',
      explanation: '<p>第 1 空填「代数优化」。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-optimize', text: '代数优化与物理优化' }],
    },
    {
      id: 'p5-f5-2',
      kind: 'fill',
      question: '<p>5. 查询优化包括：___________和___________两种优化方法。（第 2 空）</p>',
      answer: '物理优化（存取路径和底层操作算法的选择）',
      explanation: '<p>第 2 空填「物理优化」。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-optimize', text: '代数优化与物理优化' }],
    },
    {
      id: 'p5-j1',
      kind: 'judge',
      question: '<p>1. 网状数据库中每个结点有且只有一个双亲。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>「有且仅有一个双亲」是<strong>层次模型</strong>的特征；网状模型中允许结点有多个双亲（允许多对多联系）。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '层次模型与网状模型' }],
    },
    {
      id: 'p5-j2',
      kind: 'judge',
      question: '<p>2. 将关系 R(A,B,C) 和 S(B,C,D) 进行自然连接，得到的结果包含 6 个列。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>自然连接在公共属性 B、C 上等值连接并<strong>去掉重复列</strong>，结果列为 A、B、C、D 共 4 列（若不做去重的等值连接才是 6 列）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '自然连接' }],
    },
    {
      id: 'p5-j3',
      kind: 'judge',
      question: '<p>3. 在 SQL 语句中能通过 WHERE 子句实现投影操作。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>WHERE 子句实现的是<strong>选择（σ）</strong>操作；投影（π）由 SELECT 子句的目标列表达式实现。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-query', text: '语句格式与关系运算的对应' }],
    },
    {
      id: 'p5-j4',
      kind: 'judge',
      question: '<p>4. 五种基本关系代数运算是交、并、选择、投影和笛卡尔积。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>五种基本运算是<strong>并、差、笛卡尔积、选择、投影</strong>——交（∩）可以由差（R−(R−S)）导出，不是基本运算。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '5 种基本操作' }],
    },
    {
      id: 'p5-j5',
      kind: 'judge',
      question: '<p>5. 一个关系只能有一个聚簇索引。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>一个关系只能加入一个聚簇——聚簇码唯一确定元组的物理存放顺序，因此一个基本表上最多只能建立一个聚集（聚簇）索引。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-physical', text: '聚簇存取方法的选择' },
        { deck: 3, sec: 'sec-db3-ddl', text: '一个基本表上最多只能建立一个聚集索引' },
      ],
    },
    {
      id: 'p5-j6',
      kind: 'judge',
      question: '<p>6. 已知关系 R 和 S，R∩S 等价于 S−(R−S)。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>S−(R−S) = S∩(R∩S̄)∪… 计算得 S−(R−S) = S（S 去掉「只在 R 中不在 S 中」的元组，结果仍是 S）。正确的恒等式是 <strong>R∩S ≡ S−(S−R)</strong>（也 ≡ R−(R−S)）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '并交差的集合恒等式' }],
    },
    {
      id: 'p5-j7',
      kind: 'judge',
      question: '<p>7. 全码的关系模式一定属于 BCNF。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>若存在非平凡函数依赖 X→Y（Y⊄X），则 U−Y 是一个超码（(U−Y)+ ⊇ U），其内部必含更小的候选码——与「全码」（唯一候选码是全体属性）矛盾。故全码关系不含非平凡函数依赖，BCNF 的条件（每个决定因子包含码）自然满足。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: '全码与 BCNF' }],
    },
    {
      id: 'p5-j8',
      kind: 'judge',
      question: '<p>8. 更高的范式通常会减少数据冗余，但可能会增加查询复杂度。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>规范化程度越高冗余越少，但查询涉及多个关系时必须频繁连接运算——连接代价相当高，可能增加查询复杂度；有时 2NF 甚至 1NF（反规范化）性能更好。</p>',
      tags: [{ deck: 7, sec: 'sec-db7-logic', text: '规范化的利弊（反规范化）' }],
    },
    {
      id: 'p5-j9',
      kind: 'judge',
      question: '<p>9. 采用规范化方法设计的数据库一定比未规范化具有更好的查询性能。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>并不是规范化程度越高的关系就越优：查询经常涉及多个关系模式时需要经常连接运算，代价很高，此时较低范式（甚至 1NF）或反规范化设计反而性能更好。</p>',
      tags: [{ deck: 7, sec: 'sec-db7-logic', text: '反规范化设计' }],
    },
    {
      id: 'p5-j10',
      kind: 'judge',
      question: '<p>10. SQL 语言有嵌入式和交互式两种使用方法。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>SQL 提供交互式（独立使用）和嵌入式（嵌入宿主语言）两种使用方法；此外还有过程化扩充与接口编程（ODBC/JDBC 等）。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-overview', text: '两种使用方法' },
        { deck: 8, sec: 'sec-db8-esql', text: '嵌入式 SQL' },
      ],
    },
    {
      id: 'p5-e1',
      kind: 'essay',
      question: '<p>简述 1NF、2NF、3NF、BCNF 的定义及其要求。（7 分）</p>',
      answer:
        '<ul><li><strong>1NF（第一范式）</strong>：所有关系模式的最低要求——每个分量必须是不可分的数据项（不允许表中还有表）；</li><li><strong>2NF（第二范式）</strong>：在 1NF 基础上，每个非主属性<strong>完全函数依赖</strong>于候选码（消除非主属性对码的部分函数依赖）；</li><li><strong>3NF（第三范式）</strong>：在 2NF 基础上，每个非主属性都<strong>不传递函数依赖</strong>于候选码（对任何非平凡函数依赖 X→A，要么 X 含有码，要么 A 是主属性）；</li><li><strong>BCNF（BC 范式）</strong>：在 3NF 基础上，每个非平凡函数依赖 X→Y 的决定因素 X 都<strong>包含候选码</strong>（每个决定因子都是超码）；BCNF 消除了主属性对码的部分依赖与传递依赖。</li></ul><p>包含关系：1NF ⊃ 2NF ⊃ 3NF ⊃ BCNF。</p>',
      explanation: '<p>逐级定义 + 每级「消除了什么」+ 范式包含链。</p>',
      tags: [{ deck: 6, sec: 'sec-db6-normal', text: '范式定义（1NF/2NF/3NF/BCNF）' }],
    },
    {
      id: 'p5-e2',
      kind: 'essay',
      question: '<p>简述数据库设计的六个阶段及其主要任务。（8 分）</p>',
      answer:
        '<ol><li><strong>需求分析</strong>：获取用户需求，了解应用环境与功能要求、业务处理方式；成果是数据流图（DFD）和数据字典（DD）；</li><li><strong>概念结构设计</strong>：归纳抽象需求分析的结果，形成独立于具体 DBMS 的概念结构（E-R 图）；</li><li><strong>逻辑结构设计</strong>：将概念结构转换为某具体 DBMS 支持的数据模型（关系模型）并进行优化（规范化、模式评价与修正）；</li><li><strong>物理结构设计</strong>：为逻辑模型选取合适的物理结构（存取方法、存储结构），并评价时间与空间效率；</li><li><strong>数据库实施</strong>：建立实际数据库结构、装入数据、编写调试应用程序、试运行；</li><li><strong>数据库运行和维护</strong>：维护安全性与完整性、监测并改善性能、重新组织和构造数据库。</li></ol>',
      explanation: '<p>六个阶段 + 每阶段任务/成果，按课件 7.1.2 作答。</p>',
      tags: [{ deck: 7, sec: 'sec-db7-overview', text: '数据库设计的基本步骤' }],
    },
    {
      id: 'p5-e3',
      kind: 'essay',
      question:
        '<p>在图书馆借阅信息数据库中，有读者信息表 Reader、图书信息表 Book 和借阅信息表 Borrowing：Reader(读者编号 Rno【主码】，读者姓名 Rname，读者性别 Rsex，读者年龄 Rage)；Book(图书编号 Bno【主码】，图书名称 Bname，作者 Bwriter，出版社 Bpublisher，图书价格 Bprice)；Borrowing(读者编号 Rno，图书编号 Bno，借阅日期 BorrowingDate【Date 型】，归还日期 ReturnDate【Date 型】)。用关系代数完成下列操作：</p><p>（1）查询出版社为「Machine Press」的图书名和图书编号。</p>',
      answer:
        '<pre class="code"><code>π_(Bname,Bno)( σ_(Bpublisher=\'Machine Press\') ( Book ) )</code></pre>',
      explanation: '<p>单表选择 + 投影。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '选择 σ 与投影 π' }],
    },
    {
      id: 'p5-e4',
      kind: 'essay',
      question:
        '<p>（接上题）用关系代数完成下列操作：</p><p>（2）查询借阅了「Database System」的读者的编号和姓名。</p>',
      answer:
        '<pre class="code"><code>π_(Rno,Rname)( σ_(Bname=\'Database System\') ( Reader ⋈ Borrowing ⋈ Book ) )</code></pre>',
      explanation:
        '<p>三表自然连接后按书名选择，投影读者编号与姓名。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '连接运算' }],
    },
    {
      id: 'p5-e5',
      kind: 'essay',
      question:
        '<p>（接上题）用关系代数完成下列操作：</p><p>（3）查询没有借阅过图书的读者的信息。</p>',
      answer:
        '<pre class="code"><code>π_(Rno,Rname,Rsex,Rage)(Reader) － π_(Rno,Rname,Rsex,Rage)( Reader ⋈ Borrowing )</code></pre>',
      explanation:
        '<p>「没有借阅过」用差运算：全体读者减去借阅表中出现过的读者（两侧投影列一致，保证可差）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '差运算' }],
    },
    {
      id: 'p5-e6',
      kind: 'essay',
      question:
        '<p>（接上题的 Reader/Book/Borrowing 数据库）用 SQL 语言完成下列操作：</p><p>（1）查询借阅了编号为「5260」的图书的读者姓名。</p>',
      answer:
        `<pre class="code"><code>SELECT Rname FROM Reader, Borrowing
WHERE Reader.Rno = Borrowing.Rno AND Borrowing.Bno = '5260';

-- 或用嵌套查询：
SELECT Rname FROM Reader
WHERE Rno IN (SELECT Rno FROM Borrowing WHERE Bno = '5260');</code></pre>`,
      explanation: '<p>等值连接或 IN 子查询均可。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-query', text: '等值连接查询' },
        { deck: 3, sec: 'sec-db3-query', text: '带有 IN 谓词的子查询' },
      ],
    },
    {
      id: 'p5-e7',
      kind: 'essay',
      question:
        '<p>（接上题）用 SQL 语言完成下列操作：</p><p>（2）为图书信息表插入新的图书信息，其图书编号为「5198」，图书名称为「Computer Network」，作者为「WeiYan」，出版社为「Tsinghua University Press」，图书价格待定。</p>',
      answer:
        `<pre class="code"><code>INSERT INTO Book (Bno, Bname, Bwriter, Bpublisher)
VALUES ('5198', 'Computer Network', 'WeiYan', 'Tsinghua University Press');</code></pre>`,
      explanation:
        '<p>价格待定即 Bprice 不出现在列名表中，取空值 NULL。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-update', text: '插入元组（INSERT）' }],
    },
    {
      id: 'p5-e8',
      kind: 'essay',
      question:
        '<p>（接上题）用 SQL 语言完成下列操作：</p><p>（3）编号为「00145」的读者将编号为「5261」的图书于 2024 年 6 月 1 日归还，请更新相关关系表。</p>',
      answer:
        `<pre class="code"><code>UPDATE Borrowing
SET ReturnDate = DATE '2024-06-01'
WHERE Rno = '00145' AND Bno = '5261';</code></pre>`,
      explanation:
        '<p>归还即在借阅记录上更新 ReturnDate 字段（Date 型），按读者编号与图书编号定位该条借阅记录。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-update', text: '数据修改（UPDATE）' }],
    },
    {
      id: 'p5-e9',
      kind: 'essay',
      question:
        '<p>建立一个关于<strong>系、学生、班级、学会</strong>等信息的关系数据库，其中：每个系有系名、系号、系办公室地点、人数；每个学生有学号、姓名、出生年月、系名、班号、宿舍区；每个班级有班号、专业名、系名、人数、入校年份；每个学会有学会名、成立年份、地点、人数。相关语义：一个系有若干个班，每个班有若干学生，一个系的学生住在同一个宿舍区；每个学生可参加若干学会，每个学会有若干学生，学生参加某学会有一个入会年份。设计要求：</p><p>1. 画出该数据库的 E-R 图（6 分）；2. 将 E-R 图转换成关系模型（6 分）；3. 写出各关系模式的主码及外码（如果存在）（4 分）；4. 写出每个关系模式的极小函数依赖集，指出是否存在部分函数依赖和传递函数依赖（4 分）。</p>',
      answer:
        `<p><strong>1. E-R 图</strong>：实体 系（系号、系名、系办公室地点、人数）、班级（班号、专业名、人数、入校年份）、学生（学号、姓名、出生年月、系名、班号、宿舍区）、学会（学会名、成立年份、地点、人数）；联系：系—班级 1:n（属于），班级—学生 1:n（组成），学生—学会 m:n（参加，属性：入会年份）。</p><p><strong>2. 转换成关系模型</strong>：</p><pre class="code"><code>系（系号，系名，系办公室地点，人数）
班级（班号，专业名，人数，入校年份，系号）
学生（学号，姓名，出生年月，系名，班号，宿舍区）
学会（学会名，成立年份，地点，人数）
参加（学号，学会名，入会年份）</code></pre><p><strong>3. 主码与外码</strong>：系—主码 系号；班级—主码 班号，外码 系号；学生—主码 学号，外码 系名、班号；学会—主码 学会名；参加—主码 (学号, 学会名)，外码 学号、学会名。</p><p><strong>4. 极小函数依赖集</strong>：</p><pre class="code"><code>系：系号 → 系名，系办公室地点，人数
班级：班号 → 专业名，人数，入校年份，系号
学生：学号 → 姓名，出生年月，系名，班号，宿舍区
      系名 → 宿舍区          （语义：一个系的学生住在同一个宿舍区）
学会：学会名 → 成立年份，地点，人数
参加：(学号，学会名) → 入会年份</code></pre><p>各模式的非主属性都完全函数依赖于码，<strong>不存在部分函数依赖</strong>；<strong>存在传递函数依赖</strong>——学生表中 学号→系名→宿舍区（班级表中 班号→系号→系办公室地点、人数），故学生、班级模式未达 3NF，可分解使其达到 3NF（如把宿舍区并入系表：系(系号，系名，系办公室地点，人数，宿舍区)，学生表中去掉宿舍区）。参加与学会模式无传递依赖。</p>`,
      explanation:
        '<p>即教材第 6 章经典习题（系/学生/班级/学会）：m:n 联系「参加」单独成关系；语义「一个系的学生住在同一个宿舍区」使宿舍区经由系传递。考试按 E-R 图、转换、码、FD 四步给分。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-concept', text: 'E-R 图设计' },
        { deck: 7, sec: 'sec-db7-logic', text: 'E-R 模型向关系模型转换' },
        { deck: 6, sec: 'sec-db6-normal', text: '函数依赖与范式分析' },
      ],
    },
  ],
};

export default paper;

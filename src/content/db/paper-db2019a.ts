/* 试卷 3 · 2019-2020 学年第二学期数据库技术期末试卷 A 卷——转录自原卷 PDF（课程代码 0542170X，2018 级电信科，开卷）。
   原卷带学生手写作答，参考答案由本站按课件内容整理。 */
import type { DbPaper } from './types';

const paper: DbPaper = {
  id: 'db-2019a',
  title: '2019-2020 学年第二学期 · 数据库技术期末试卷 A 卷',
  source: '合肥工业大学2019-2020学年第二学期数据库技术期末试卷A卷.pdf',
  answerSource: '本站整理',
  sections: [
    {
      title: '一、选择题',
      questionIds: [
        'p3-s1', 'p3-s2', 'p3-s3', 'p3-s4', 'p3-s5', 'p3-s6', 'p3-s7', 'p3-s8', 'p3-s9', 'p3-s10',
        'p3-s11', 'p3-s12', 'p3-s13', 'p3-s14', 'p3-s15',
      ],
    },
    {
      title: '二、填空题',
      questionIds: [
        'p3-f1-1', 'p3-f1-2', 'p3-f2-1', 'p3-f2-2', 'p3-f3-1', 'p3-f3-2', 'p3-f4-1', 'p3-f4-2',
        'p3-f5-1', 'p3-f5-2', 'p3-f6-1', 'p3-f6-2', 'p3-f7-1', 'p3-f7-2', 'p3-f8-1', 'p3-f8-2',
        'p3-f9-1', 'p3-f9-2', 'p3-f10-1', 'p3-f10-2',
      ],
    },
    { title: '三、判断题', questionIds: ['p3-j1', 'p3-j2', 'p3-j3', 'p3-j4', 'p3-j5'] },
    { title: '四、阐述题', questionIds: ['p3-e1', 'p3-e2'] },
    { title: '五、操作题（关系代数）', questionIds: ['p3-e3', 'p3-e4'] },
    { title: '五、操作题（SQL）', questionIds: ['p3-e5', 'p3-e6', 'p3-e7'] },
  ],
  questions: [
    {
      id: 'p3-s1',
      kind: 'single',
      question: '<p>1. 下列对数据的叙述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 数据是数据库存储的最小单位',
        'B. 数据与语义密不可分',
        'C. 数据来自数据库设计',
        'D. 数据存放在基本表中',
      ],
      answer: 'C',
      explanation:
        '<p>数据是对现实世界事物的描述，来源于客观世界；「数据来自数据库设计」说法颠倒——数据库设计是对数据的组织方式的设计。数据与其语义不可分（B 对），数据存放在基本表中（D 对）。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据的定义' }],
    },
    {
      id: 'p3-s2',
      kind: 'single',
      question: '<p>2. 下列对数据库的描述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 采用特定的数据模型组织数据',
        'B. 数据库可包含多种数据对象',
        'C. 可实现数据的整体结构化',
        'D. 用户可以直接访问数据库',
      ],
      answer: 'D',
      explanation:
        '<p>数据库中的数据由 DBMS 统一管理和控制，用户（应用程序）必须通过 DBMS 访问数据库，不能直接访问。A、B、C 都是数据库的正确描述。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库与 DBMS' }],
    },
    {
      id: 'p3-s3',
      kind: 'single',
      question: '<p>3. 数据库技术属于下列哪种技术：</p>',
      options: ['A. 数据管理技术', 'B. 数据传输技术', 'C. 数据加工技术', 'D. 数据保密技术'],
      answer: 'A',
      explanation:
        '<p>数据库技术是应<strong>数据管理</strong>任务的需要而产生的——数据管理是数据处理的中心问题，数据库技术是数据库管理的有效技术。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库技术的产生' }],
    },
    {
      id: 'p3-s4',
      kind: 'single',
      question: '<p>4. 数据库系统与文件系统的主要区别在于：</p>',
      options: [
        'A. 数据库系统可实现数据共享，文件系统不可以',
        'B. 数据库系统可实现数据的整体结构化，文件系统只能实现局部结构化',
        'C. 数据库系统可对数据进行管理和控制，文件系统不可以',
        'D. 文件系统的数据以文件形式存放在磁盘上，而数据库则不是',
      ],
      answer: 'B',
      explanation:
        '<p>文件系统阶段文件之间相互独立，只能实现记录内部的局部结构化；数据库系统按数据模型实现数据的<strong>整体结构化</strong>——这是最主要的区别。共享（A）和统一管理（C）文件系统也可有限实现；数据库的数据最终也是以文件形式存储的（D 错）。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库系统的特点' }],
    },
    {
      id: 'p3-s5',
      kind: 'single',
      question: '<p>5. 下列对数据模型的描述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 数据模型是数据库数据建模的工具',
        'B. 关系模型是常用的数据模型',
        'C. 概念模型也属于一种数据模型',
        'D. 数据的完整性约束与数据模型无关',
      ],
      answer: 'D',
      explanation:
        '<p>数据模型的三要素是数据结构、数据操作和<strong>数据的完整性约束</strong>——完整性约束是数据模型的组成部分，与它密切相关。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '数据模型的组成要素' }],
    },
    {
      id: 'p3-s6',
      kind: 'single',
      question: '<p>6. 概念模型是下列哪个世界的建模工具：</p>',
      options: ['A. 现实世界', 'B. 信息世界', 'C. 概念世界', 'D. 机器世界'],
      answer: 'B',
      explanation:
        '<p>概念模型是对信息世界的抽象表示，是现实世界到机器世界的中间层次（现实世界 → 信息世界：概念模型/E-R 图 → 机器世界：逻辑/物理模型）。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '两类数据模型与概念模型' }],
    },
    {
      id: 'p3-s7',
      kind: 'single',
      question: '<p>7. 在数据库系统的模式结构中，模式与外模式的关系是____，而模式与内模式的关系是____。</p>',
      options: [
        'A. 一对一，一对多',
        'B. 一对多，一对一',
        'C. 一对一，一对一',
        'D. 一对多，一对多',
      ],
      answer: 'B',
      explanation:
        '<p>外模式可以有多个而模式只有一个 → 一对多；内模式与模式都只有一个 → 一对一。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '三级模式结构' }],
    },
    {
      id: 'p3-s8',
      kind: 'single',
      question: '<p>8. 数据库系统的数据独立性是指：</p>',
      options: [
        'A. 应用程序不会因数据的变化而受到影响',
        'B. 应用程序不会因数据结构的变化而受到影响',
        'C. 数据存储结构不会因存储策略的变化而影响',
        'D. 不会因某些存储结构的变化而影响其他的存储结构',
      ],
      answer: 'B',
      explanation:
        '<p>数据独立性指<strong>应用程序</strong>不依赖数据结构（逻辑结构与物理存储结构）：逻辑结构变化由外模式/模式映像屏蔽，存储结构变化由模式/内模式映像屏蔽，应用程序均不必修改。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '数据独立性' }],
    },
    {
      id: 'p3-s9',
      kind: 'single',
      question: '<p>9. 同一个关系中的任意两个元组的值：</p>',
      options: [
        'A. 允许完全相同',
        'B. 不能完全相同',
        'C. 可以都为空值',
        'D. 以上都不是',
      ],
      answer: 'B',
      explanation:
        '<p>基本关系的性质：任意两个元组的候选码（不能取相同的值）——元组不能完全相同，否则无法区分。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '基本关系的性质' }],
    },
    {
      id: 'p3-s10',
      kind: 'single',
      question: '<p>10. 关系模式 R(U, D, Dom, F) 中的 F 指的是：</p>',
      options: [
        'A. 全体属性的集合',
        'B. 相关域的集合',
        'C. 数据依赖的集合',
        'D. 映射关系的集合',
      ],
      answer: 'C',
      explanation:
        '<p>R(U, D, DOM, F)：U——属性名集合；D——属性所来自的域；DOM——属性向域的映象集合；<strong>F——属性间的数据依赖关系集合</strong>。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '关系模式的形式化定义' }],
    },
    {
      id: 'p3-s11',
      kind: 'single',
      question: '<p>11. 设关系 R(A, B, C) 和 S(B, C, D)，下列各关系代数表达式<strong>不成立</strong>的是：</p>',
      options: ['A. π_A(R) ⋈ π_D(S)', 'B. R ∪ S', 'C. π_B(R) ∩ π_B(S)', 'D. R ⋈ S'],
      answer: 'B',
      explanation:
        '<p>并、交、差等传统集合运算要求两关系为同一目关系（属性个数相同且取自同一个域）。R 是 3 目、S 是 4 目，R∪S 不成立。π_A(R)⋈π_D(S) 是两个一元关系（先投影）的连接，成立；π_B(R)∩π_B(S) 同为一元关系可行；R⋈S 自然连接公共属性 B、C，成立。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '传统的集合运算（要求同目关系）' }],
    },
    {
      id: 'p3-s12',
      kind: 'single',
      question: '<p>12. 下列聚集函数在进行统计时<strong>不忽略空值</strong>的是：</p>',
      options: ['A. SUM(列名)', 'B. MAX(列名)', 'C. COUNT(*)', 'D. AVG(列名)'],
      answer: 'C',
      explanation:
        '<p>SUM/MAX/MIN/AVG 与 COUNT(列名) 都忽略空值；只有 <strong>COUNT(*)</strong> 按行计数，空值行也被统计（注意参数的使用！）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-query', text: '聚集函数与空值' }],
    },
    {
      id: 'p3-s13',
      kind: 'single',
      question: '<p>13. 下列对数据库安全性的描述中，<strong>正确</strong>的是：</p>',
      options: [
        'A. 自主的存取控制安全性更高',
        'B. 强制的存取控制更加灵活',
        'C. 视图也属于一种安全技术',
        'D. DBMS 中的审计功能不是必需的',
      ],
      answer: 'C',
      explanation:
        '<p>自主存取控制（DAC）灵活（C2 级），强制存取控制（MAC）严格、安全性更高（B1 级）——A、B 恰好说反；审计是 C2 以上安全级别的 DBMS 必须具有的（D 错）；数据库安全性控制的常用方法就包括视图机制（C 对）。</p>',
      tags: [
        { deck: 4, sec: 'sec-db4-control', text: 'DAC 与 MAC' },
        { deck: 4, sec: 'sec-db4-view', text: '视图机制' },
      ],
    },
    {
      id: 'p3-s14',
      kind: 'single',
      question: '<p>14. 关系模型的完整性约束包括：实体完整性、参照完整性和__________。</p>',
      options: ['A. 数据完整性', 'B. 用户定义的完整性', 'C. 数据库的完整性', 'D. 数据独立性'],
      answer: 'B',
      explanation:
        '<p>关系的三类完整性：实体完整性、参照完整性、<strong>用户定义的完整性</strong>。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-integrity', text: '关系的三类完整性' }],
    },
    {
      id: 'p3-s15',
      kind: 'single',
      question: '<p>15. DBMS 针对用户违反完整性约束规则操作的常用处理方式是：</p>',
      options: [
        'A. 拒绝用户的操作',
        'B. 采用级联处理策略',
        'C. 修改用户数据使其满足约束规则',
        'D. 提示并询问用户的正确数据',
      ],
      answer: 'A',
      explanation:
        '<p>违反用户定义的完整性规则时一律<strong>拒绝</strong>（NO ACTION）；级联（CASCADE）/置空（SET NULL）只是参照完整性中删除、修改主码值时的可选处理方式。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-ref', text: '违约处理' }],
    },
    {
      id: 'p3-f1-1',
      kind: 'fill',
      question: '<p>1. 数据库中的数据具有永久存储、_________ 和 _________ 三个基本特点。（第 1 空）</p>',
      answer: '有组织',
      explanation: '<p>数据库中数据的特点：<strong>永久存储、有组织、可共享</strong>。第 1 空填「有组织」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库的定义' }],
    },
    {
      id: 'p3-f1-2',
      kind: 'fill',
      question: '<p>1. 数据库中的数据具有永久存储、_________ 和 _________ 三个基本特点。（第 2 空）</p>',
      answer: '可共享',
      explanation: '<p>第 2 空填「可共享」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据库的定义' }],
    },
    {
      id: 'p3-f2-1',
      kind: 'fill',
      question:
        '<p>2. DML 是数据库管理系统的___________语言，可以对数据库进行查询、______、删除和修改等基本操作。（第 1 空）</p>',
      answer: '数据操纵（DML，数据操纵语言）',
      explanation:
        '<p>第 1 空：DML（Data Manipulation Language）即<strong>数据操纵语言</strong>，实现对基本表和视图等数据对象的操作。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-op', text: '常用的关系操作' }],
    },
    {
      id: 'p3-f2-2',
      kind: 'fill',
      question:
        '<p>2. DML 是数据库管理系统的___________语言，可以对数据库进行查询、______、删除和修改等基本操作。（第 2 空）</p>',
      answer: '插入',
      explanation: '<p>第 2 空：数据更新的四种基本操作——<strong>插入、删除、修改</strong>（加查询）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-update', text: '数据更新' }],
    },
    {
      id: 'p3-f3-1',
      kind: 'fill',
      question: '<p>3. 数据管理技术经历了人工管理、__________和__________三个发展阶段。（第 1 空）</p>',
      answer: '文件系统',
      explanation: '<p>三个阶段：<strong>人工管理阶段 → 文件系统阶段 → 数据库系统阶段</strong>。第 1 空填「文件系统」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据管理技术发展的三个阶段' }],
    },
    {
      id: 'p3-f3-2',
      kind: 'fill',
      question: '<p>3. 数据管理技术经历了人工管理、__________和__________三个发展阶段。（第 2 空）</p>',
      answer: '数据库系统',
      explanation: '<p>第 2 空填「数据库系统」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据管理技术发展的三个阶段' }],
    },
    {
      id: 'p3-f4-1',
      kind: 'fill',
      question: '<p>4. 数据库系统的数据独立性包括：____________和____________。（第 1 空）</p>',
      answer: '逻辑独立性（外模式/模式映像保证）',
      explanation:
        '<p>数据独立性分两层：<strong>逻辑独立性</strong>——外模式/模式映像；<strong>物理独立性</strong>——模式/内模式映像。第 1 空填「逻辑独立性」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像与数据独立性' }],
    },
    {
      id: 'p3-f4-2',
      kind: 'fill',
      question: '<p>4. 数据库系统的数据独立性包括：____________和____________。（第 2 空）</p>',
      answer: '物理独立性（模式/内模式映像保证）',
      explanation: '<p>第 2 空填「物理独立性」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像与数据独立性' }],
    },
    {
      id: 'p3-f5-1',
      kind: 'fill',
      question:
        '<p>5. 数据模型是对现实世界___________的抽象，用于描述数据、__________和对数据进行操作的。（第 1 空）</p>',
      answer: '数据特征（数据及其联系）',
      explanation:
        '<p>第 1 空：数据模型是对现实世界<strong>数据特征</strong>的抽象——描述数据的结构和性质、数据之间的联系以及施加在数据或数据联系上的一些限制。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '数据模型概述' }],
    },
    {
      id: 'p3-f5-2',
      kind: 'fill',
      question:
        '<p>5. 数据模型是对现实世界___________的抽象，用于描述数据、__________和对数据进行操作的。（第 2 空）</p>',
      answer: '组织数据',
      explanation: '<p>第 2 空填「组织数据」——数据模型用于描述数据、组织数据和对数据进行操作。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '数据模型概述' }],
    },
    {
      id: 'p3-f6-1',
      kind: 'fill',
      question:
        '<p>6. 在信息世界中，客观存在且可以相互区分的事物称为_________，被抽象到关系模型中则为一个_________。（第 1 空）</p>',
      answer: '实体',
      explanation:
        '<p>第 1 空：客观存在并可相互区别的事物称为<strong>实体</strong>（Entity），可以是具体的人、事、物或抽象的概念。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '实体' }],
    },
    {
      id: 'p3-f6-2',
      kind: 'fill',
      question:
        '<p>6. 在信息世界中，客观存在且可以相互区分的事物称为_________，被抽象到关系模型中则为一个_________。（第 2 空）</p>',
      answer: '元组（关系中的一行）',
      explanation: '<p>第 2 空：实体被抽象为关系模型中的<strong>元组</strong>（二维表中的一行）；实体的属性对应关系的属性。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '关系模型的数据结构' }],
    },
    {
      id: 'p3-f7-1',
      kind: 'fill',
      question: '<p>7. 视图是一个________，其数据是来自相关的__________。（第 1 空）</p>',
      answer: '虚表',
      explanation:
        '<p>第 1 空：视图是<strong>虚表</strong>——从一个或几个基本表（或视图）导出的表，只存放视图的定义，不存放视图对应的数据。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-view', text: '视图的定义' }],
    },
    {
      id: 'p3-f7-2',
      kind: 'fill',
      question: '<p>7. 视图是一个________，其数据是来自相关的__________。（第 2 空）</p>',
      answer: '基本表（或视图）',
      explanation: '<p>第 2 空：视图的数据来自相关的<strong>基本表</strong>（或视图）；基表数据变化，视图查询结果随之改变。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-view', text: '理解视图' }],
    },
    {
      id: 'p3-f8-1',
      kind: 'fill',
      question: '<p>8. 视图中的数据多数情况下是不可________的，而_________视图则不受限制。（第 1 空）</p>',
      answer: '更新',
      explanation:
        '<p>第 1 空：更新视图有限制——一些视图是不可更新的，其更新无法转换成对相应基本表的更新（如含 GROUP BY、聚集函数的视图）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-view', text: '更新视图' }],
    },
    {
      id: 'p3-f8-2',
      kind: 'fill',
      question: '<p>8. 视图中的数据多数情况下是不可________的，而_________视图则不受限制。（第 2 空）</p>',
      answer: '行列子集',
      explanation:
        '<p>第 2 空：允许对<strong>行列子集视图</strong>进行更新（从单个基本表导出、保留了主码、未含聚集函数等）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-view', text: '更新视图的限制' }],
    },
    {
      id: 'p3-f9-1',
      kind: 'fill',
      question:
        '<p>9. 在数据库系统中，权限是用户对某一___________能够进行的操作，除了对象权限，还有一类权限称为___________。（第 1 空）</p>',
      answer: '数据对象',
      explanation:
        '<p>第 1 空：用户权限由<strong>数据对象</strong>和操作类型组成——定义用户可以在哪些数据库对象上进行哪些类型的操作。</p>',
      tags: [{ deck: 4, sec: 'sec-db4-control', text: '存取权限的组成' }],
    },
    {
      id: 'p3-f9-2',
      kind: 'fill',
      question:
        '<p>9. 在数据库系统中，权限是用户对某一___________能够进行的操作，除了对象权限，还有一类权限称为___________。（第 2 空）</p>',
      answer: '系统权限',
      explanation:
        '<p>第 2 空：权限分<strong>对象权限</strong>（对表、视图等对象的操作权限）与<strong>系统权限</strong>（对数据库结构、模式等对象的操作权限，如 CREATE SCHEMA/CREATE TABLE）。</p>',
      tags: [
        { deck: 4, sec: 'sec-db4-control', text: '对象权限与系统权限' },
        { deck: 4, sec: 'sec-db4-audit', text: '系统级审计' },
      ],
    },
    {
      id: 'p3-f10-1',
      kind: 'fill',
      question:
        '<p>10. 在数据完整性控制方面，DBMS 除了允许用户定义完整性约束规则外，当用户进行__________操作时进行完整性检查，一旦发现用户违反约束规定的操作时进行_______处理。（第 1 空）</p>',
      answer: '更新（INSERT、DELETE、UPDATE）',
      explanation:
        '<p>第 1 空：DBMS 在用户发出<strong>更新（增、删、改）</strong>操作时进行完整性检查。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-entity', text: '完整性检查的时机' }],
    },
    {
      id: 'p3-f10-2',
      kind: 'fill',
      question:
        '<p>10. 在数据完整性控制方面，DBMS 除了允许用户定义完整性约束规则外，当用户进行__________操作时进行完整性检查，一旦发现用户违反约束规定的操作时进行_______处理。（第 2 空）</p>',
      answer: '拒绝（违约）',
      explanation: '<p>第 2 空：一旦违反约束即<strong>拒绝</strong>该操作（违约处理）。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-ref', text: '违约处理' }],
    },
    {
      id: 'p3-j1',
      kind: 'judge',
      question: '<p>（1）E-R 模型属于机器世界的建模工具。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>E-R 模型是<strong>信息世界</strong>（概念模型）的建模工具；机器世界使用 DBMS 支持的逻辑模型与物理模型。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '两级抽象与概念模型' }],
    },
    {
      id: 'p3-j2',
      kind: 'judge',
      question: '<p>（2）查询表也是一个二维表，它存放数据库的架构中。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>查询表是查询结果对应的表，是临时产生的动态数据集合，<strong>不存放</strong>在数据库架构中；存放在数据库中的是基本关系（基本表）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '三类关系（基本关系/查询表/视图表）' }],
    },
    {
      id: 'p3-j3',
      kind: 'judge',
      question: '<p>（3）数据库系统的三级模式结构可以有效保证数据独立性。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>三级模式之间由外模式/模式映像、模式/内模式映像两级映像联系，分别保证逻辑独立性和物理独立性。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像与数据独立性' }],
    },
    {
      id: 'p3-j4',
      kind: 'judge',
      question: '<p>（4）实体完整性是为了抽象现实世界中事物的可区分性。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>实体完整性要求主属性值唯一且非空——码唯一标识元组，对应现实世界中实体的可区分性（每个实体都可相互区别）。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-entity', text: '实体完整性的语义' }],
    },
    {
      id: 'p3-j5',
      kind: 'judge',
      question: '<p>（5）完整性约束命名子句是为了更方便地进行完整性约束规则的维护。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>CONSTRAINT 命名字句给约束命名后，可以按名字方便地删除（DROP CONSTRAINT）和新增（ADD CONSTRAINT）约束，从而更方便地维护完整性约束规则。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-constraint', text: '完整性约束命名字句' }],
    },
    {
      id: 'p3-e1',
      kind: 'essay',
      question: '<p>1. 简述数据库系统的模式结构。（5 分）</p>',
      answer:
        '<p>数据库系统采用<strong>三级模式结构</strong>（内部结构）：<strong>模式</strong>——数据库全体数据的全局逻辑结构和特征描述，一个数据库只有一个；<strong>外模式</strong>——各用户的局部数据逻辑结构（子模式），可以有多个；<strong>内模式</strong>——数据物理结构和存储方式的描述，只有一个。三级模式间通过<strong>外模式/模式映像</strong>和<strong>模式/内模式映像</strong>两级映像联系和转换：外模式/模式映像保证数据的逻辑独立性（模式改变时外模式与应用不变），模式/内模式映像保证数据的物理独立性（存储结构改变时模式不变）。</p>',
      explanation: '<p>三级模式 + 二级映像 + 两个独立性，对照结构图作答。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '三级模式结构与二级映像' }],
    },
    {
      id: 'p3-e2',
      kind: 'essay',
      question: '<p>2. 什么是视图？为什么说视图能够对数据有保护作用？如何实现？（10 分）</p>',
      answer:
        `<p><strong>什么是视图</strong>：视图是从一个或几个基本表（或视图）导出的表，是一个虚表——只存放视图的定义（存入数据字典），不存放视图对应的数据；基表中的数据发生变化，从视图中查询出的数据也随之改变。</p><p><strong>为什么有保护作用</strong>：视图机制把要保密的数据对无权存取这些数据的用户<strong>隐藏起来</strong>——用户只能看到视图所定义的那部分数据，其余基本表的数据对他不可见，从而对数据提供一定程度的安全保护。</p><p><strong>如何实现</strong>：先用 CREATE VIEW 定义视图（可带 WITH CHECK OPTION），再用 GRANT 语句把视图上的相应权限授予用户：</p><pre class="code"><code>CREATE VIEW CS_Student AS
  SELECT * FROM Student WHERE Sdept='CS';
GRANT SELECT ON CS_Student TO 王平;</code></pre><p>这样王平只能查询 CS 系的学生数据，Student 表中其他系的数据对他不可见。此外，针对不同级别的用户定义不同的视图可以同时满足系统安全性要求。</p>`,
      explanation: '<p>按「定义 → 保护原理（隐藏保密数据）→ 实现方式（CREATE VIEW + GRANT）」三段作答。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-view', text: '定义视图' },
        { deck: 4, sec: 'sec-db4-view', text: '视图机制' },
      ],
    },
    {
      id: 'p3-e3',
      kind: 'essay',
      question:
        '<p>在学生—课程数据库中，有 Student、Course 和 SC 三个关系：Student(Sno, Sname, Ssex, Ddept)、Course(Cno, Cname, PCno)、SC(Sno, Cno, Grade)。PCno 为课程的先修课，Ddept 为学生所在系，Cname 为课程名，Grade 为成绩。用关系代数完成下列操作：</p><p>（1）查询「信息工程系」全体男生的学号和姓名。</p>',
      answer:
        '<pre class="code"><code>π_(Sno,Sname)( σ_(Ddept=\'信息工程系\' ∧ Ssex=\'男\') ( Student ) )</code></pre>',
      explanation: '<p>两个条件均在 Student 表上，先选择后投影学号与姓名。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '选择 σ 与投影 π' }],
    },
    {
      id: 'p3-e4',
      kind: 'essay',
      question:
        '<p>（接上题）用关系代数完成下列操作：</p><p>（2）查询选修了「c001」号课程，且成绩在 50～59 之间的学生学号。</p>',
      answer:
        '<pre class="code"><code>π_(Sno)( σ_(Cno=\'c001\' ∧ Grade≥50 ∧ Grade≤59) ( SC ) )</code></pre>',
      explanation: '<p>条件都在 SC 表上：Cno=\'c001\' 且成绩介于 50～59，投影 Sno（投影自动取消重复行）。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '选择与投影' }],
    },
    {
      id: 'p3-e5',
      kind: 'essay',
      question:
        '<p>（接上题的学生—课程数据库）用 SQL 语言完成下列操作：</p><p>（1）查询同时选修了「c005」和「c208」课程的学生学号和姓名。</p>',
      answer:
        `<pre class="code"><code>SELECT Sno, Sname FROM Student
WHERE Sno IN (SELECT Sno FROM SC WHERE Cno='c005')
  AND Sno IN (SELECT Sno FROM SC WHERE Cno='c208');

-- 或用自连接：
SELECT DISTINCT S1.Sno, Sname
FROM Student S1, SC X, SC Y
WHERE S1.Sno = X.Sno AND X.Sno = Y.Sno
  AND X.Cno = 'c005' AND Y.Cno = 'c208';</code></pre>`,
      explanation:
        '<p>「同时选修两门课」不能写成 Cno IN (\'c005\',\'c208\')（那是选修其一），要用两个 IN 子查询（或自连接取交集）。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-query', text: '带有 IN 谓词的嵌套查询' },
        { deck: 3, sec: 'sec-db3-query', text: '自身连接' },
      ],
    },
    {
      id: 'p3-e6',
      kind: 'essay',
      question:
        '<p>（接上题）用 SQL 语言完成下列操作：</p><p>（2）查询平均成绩达到 85 分的学生学号、姓名和平均成绩。</p>',
      answer:
        `<pre class="code"><code>SELECT Student.Sno, Sname, AVG(Grade) AS 平均成绩
FROM Student, SC
WHERE Student.Sno = SC.Sno
GROUP BY Student.Sno, Sname
HAVING AVG(Grade) &gt;= 85;</code></pre>`,
      explanation:
        '<p>对聚集函数的结果限条件必须用 <strong>HAVING</strong>（不能写在 WHERE 里）；分组列应与 SELECT 中的非聚集列一致（Sno、Sname）。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-query', text: 'GROUP BY 与 HAVING 子句' }],
    },
    {
      id: 'p3-e7',
      kind: 'essay',
      question:
        '<p>（接上题）用 SQL 语言完成下列操作：</p><p>（3）查询选修了「数字逻辑」课程，且成绩超过该课程平均成绩的学生学号、姓名。</p>',
      answer:
        `<pre class="code"><code>SELECT Student.Sno, Sname
FROM Student, SC, Course
WHERE Student.Sno = SC.Sno AND SC.Cno = Course.Cno
  AND Cname = '数字逻辑'
  AND Grade &gt; (SELECT AVG(Grade)
               FROM SC, Course
               WHERE SC.Cno = Course.Cno AND Cname = '数字逻辑');</code></pre>`,
      explanation:
        '<p>子查询先求出「数字逻辑」课程的平均成绩（单值），主查询再选该课程成绩超过它的学生——相关比较用带比较运算符的子查询实现。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-query', text: '带有比较运算符的子查询' },
        { deck: 3, sec: 'sec-db3-query', text: '多表连接查询' },
      ],
    },
  ],
};

export default paper;

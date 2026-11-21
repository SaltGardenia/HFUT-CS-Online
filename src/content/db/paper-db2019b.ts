/* 试卷 2 · 2019-2020 学年第一学期数据库系统期末试卷 B 卷（宣城校区）——转录自原卷 PDF（课程代码 0521082B，命题教师沈明玉）。
   原卷带学生手写作答，参考答案由本站按课件内容整理。 */
import type { DbPaper } from './types';

const paper: DbPaper = {
  id: 'db-2019b',
  title: '2019-2020 学年第一学期 · 数据库系统期末试卷 B 卷（宣城校区）',
  source: '合肥工业大学2019-2020学年第一学期数据库系统期末试卷B卷(宣城校区).pdf',
  answerSource: '本站整理',
  sections: [
    { title: '一、选择题', questionIds: ['p2-s1', 'p2-s2', 'p2-s3', 'p2-s4', 'p2-s5', 'p2-s6', 'p2-s7', 'p2-s8', 'p2-s9', 'p2-s10'] },
    { title: '二、填空题', questionIds: ['p2-f1-1', 'p2-f1-2', 'p2-f2-1', 'p2-f3-1', 'p2-f3-2', 'p2-f4-1', 'p2-f4-2', 'p2-f5-1', 'p2-f5-2', 'p2-f5-3'] },
    { title: '三、判断题', questionIds: ['p2-j1', 'p2-j2', 'p2-j3', 'p2-j4', 'p2-j5'] },
    { title: '四、阐述题', questionIds: ['p2-e1', 'p2-e2', 'p2-e3'] },
    { title: '五、操作题（关系代数）', questionIds: ['p2-e4'] },
    { title: '五、操作题（SQL）', questionIds: ['p2-e5'] },
    { title: '六、设计题', questionIds: ['p2-e6'] },
  ],
  questions: [
    {
      id: 'p2-s1',
      kind: 'single',
      question: '<p>1. 与文件系统相比，数据库系统：</p>',
      options: [
        'A. 数据可长期保存',
        'B. 采用一定的数据模型组织数据',
        'C. 数据可共享',
        'D. 有专门的软件对数据进行管理',
      ],
      answer: 'B',
      explanation:
        '<p>长期保存（A）和一定程度的共享（C）在文件系统阶段已经实现；文件系统本身也是专门管理数据的软件（D 不构成本质区别）。数据库系统的本质特征是<strong>采用数据模型组织数据</strong>——数据的整体结构化、面向全系统，这是文件系统所不具备的。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据管理技术发展阶段' }],
    },
    {
      id: 'p2-s2',
      kind: 'single',
      question: '<p>2. 下述关于数据库中数据的描述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 数据是数据库中存储的基本对象',
        'B. 数据是描述事物的符号记录',
        'C. 数据是由数据处理产生的',
        'D. 数据与其语义是不可分的',
      ],
      answer: 'C',
      explanation:
        '<p>数据是描述事物的符号记录，是数据库中存储的基本对象，数据与其语义不可分。「数据由数据处理产生」表述颠倒——数据先于处理而存在，数据处理是对数据进行加工，不是数据的来源。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据的定义' }],
    },
    {
      id: 'p2-s3',
      kind: 'single',
      question: '<p>3. 下列对关系的规范性限制<strong>不正确</strong>的是：</p>',
      options: [
        'A. 元组中的属性在理论上是有序的，但使用时通常不考虑列的顺序',
        'B. 关系中的每一个属性值都是不可分解的',
        'C. 关系中不允许出现相同的元组',
        'D. 由于关系是一个集合，因此不考虑元组间的顺序，即没有行序',
      ],
      answer: 'A',
      explanation:
        '<p>基本关系的性质明确「列的顺序无所谓，即列的次序可以任意交换」——A 说「理论上是有序的」与课件性质相悖；B（分量取原子值）、C（候选码唯一标识元组，不允许重复元组）、D（无行序）均正确。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '基本关系的性质' }],
    },
    {
      id: 'p2-s4',
      kind: 'single',
      question: '<p>4. 下列关于数据库三级模式结构的叙述中，<strong>正确</strong>的是：</p>',
      options: [
        'A. 内模式可以有多个，外模式和模式只有一个',
        'B. 内模式只有一个，外模式和模式可以有多个',
        'C. 外模式可以有多个，内模式和模式只有一个',
        'D. 模式只有一个，外模式和内模式可以有多个',
      ],
      answer: 'C',
      explanation: '<p>三级模式中模式（全局逻辑）与内模式（物理存储）各只有一个，外模式（用户视图）可以有多个。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '三级模式结构' }],
    },
    {
      id: 'p2-s5',
      kind: 'single',
      question: '<p>5. 数据库的概念模型独立于：</p>',
      options: ['A. 信息世界', 'B. 具体的机器和 DBMS', 'C. 现实世界', 'D. E-R 图'],
      answer: 'B',
      explanation:
        '<p>概念模型是对信息世界的抽象表示（E-R 模型是其最常用表示），独立于具体的机器和 DBMS——这正是逻辑设计阶段才把它转换为某 DBMS 支持的数据模型的原因。</p>',
      tags: [
        { deck: 1, sec: 'sec-db1-model', text: '概念模型' },
        { deck: 7, sec: 'sec-db7-concept', text: '概念结构设计' },
      ],
    },
    {
      id: 'p2-s6',
      kind: 'single',
      question: '<p>6. 设有关系 R 和 S，与关系代数表达式 R−(R−S) 等价的是：</p>',
      options: ['A. R∩S', 'B. R−S', 'C. R∪S', 'D. R÷S'],
      answer: 'A',
      explanation:
        '<p>差运算的集合恒等式：R−(R−S) = R∩S——R 中去掉「只在 R 中不在 S 中」的部分，剩下的正是同时在 R 和 S 中的元组。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-algebra', text: '传统的集合运算（并交差）' }],
    },
    {
      id: 'p2-s7',
      kind: 'single',
      question: '<p>7. 下列关于 SQL 语言「索引」的叙述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 一个基本表上可以创建多个索引',
        'B. 索引属于外模式',
        'C. 系统存取数据时会自动选择合适的索引作为存取路径',
        'D. 使用索引可以加快查询语句的执行速度',
      ],
      answer: 'B',
      explanation:
        '<p>索引描述数据的存取方法（存储结构、存取路径），属于<strong>内模式</strong>范畴而非外模式；A、C、D 均为课件对索引的正确叙述。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-ddl', text: '索引的建立与删除' },
        { deck: 7, sec: 'sec-db7-physical', text: 'B+ 树索引存取方法的选择' },
      ],
    },
    {
      id: 'p2-s8',
      kind: 'single',
      question: '<p>8. 下列对视图作用的描述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 视图能够使用户不必关心实际的数据来自哪些基本表',
        'B. 视图属于内模式的范畴',
        'C. 视图能够实现一定程度的逻辑独立性',
        'D. 视图能够有效保护数据库中某些机密数据',
      ],
      answer: 'B',
      explanation:
        '<p>视图是虚表，属于<strong>外模式</strong>范畴；它简化用户操作、提供逻辑独立性、对机密数据提供安全保护——B 的说法错误。</p>',
      tags: [{ deck: 3, sec: 'sec-db3-view', text: '视图的定义与作用' }],
    },
    {
      id: 'p2-s9',
      kind: 'single',
      question: '<p>9. 下列关于数据模型的描述中，<strong>不正确</strong>的是：</p>',
      options: [
        'A. 数据模型表示的是数据库的框架',
        'B. 数据模型是客观事物及其联系的描述',
        'C. 数据模型表示的是数据库本身',
        'D. 数据模型能够以一定的结构形式表示出各种不同数据之间的联系',
      ],
      answer: 'C',
      explanation:
        '<p>数据模型是型的描述（框架、对客观事物及其联系的抽象），不是数据库本身——数据库中存储的具体数据是值。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '数据模型概述' }],
    },
    {
      id: 'p2-s10',
      kind: 'single',
      question:
        '<p>10. 设有关系模式 R(A, B, C, D, E, F)，函数依赖集为 {E→D，C→B，CE→F，B→A}，则 R 最高属于：</p>',
      options: ['A. 1NF', 'B. 2NF', 'C. 3NF', 'D. BCNF'],
      answer: 'A',
      explanation:
        '<p>候选码为 CE（CE→F，E→D，C→B→A，CE 可决定全部属性，且缺一不可）。主属性只有 C、E。非主属性 A、B 直接依赖 C（C→B、B→A），D 依赖 E——都<strong>部分函数依赖</strong>于候选码 CE 的真子集，故 R 不属于 2NF，最高只属于 1NF。</p>',
      tags: [
        { deck: 6, sec: 'sec-db6-normal', text: '候选码与范式判定（2NF）' },
        { deck: 6, sec: 'sec-db6-armstrong', text: '函数依赖的闭包' },
      ],
    },
    {
      id: 'p2-f1-1',
      kind: 'fill',
      question: '<p>1. 数据库系统模式结构中的两级映像是指：____________ 和 ___________。（第 1 空）</p>',
      answer: '外模式/模式映像',
      explanation:
        '<p>两级映像：<strong>外模式/模式映像</strong>（保证逻辑独立性）与<strong>模式/内模式映像</strong>（保证物理独立性）。本空填「外模式/模式映像」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像' }],
    },
    {
      id: 'p2-f1-2',
      kind: 'fill',
      question: '<p>1. 数据库系统模式结构中的两级映像是指：____________ 和 ___________。（第 2 空）</p>',
      answer: '模式/内模式映像',
      explanation: '<p>第 2 空填「模式/内模式映像」。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '二级映像' }],
    },
    {
      id: 'p2-f2-1',
      kind: 'fill',
      question: '<p>2. 常用的概念模型是：___________。</p>',
      answer: 'E-R 模型（实体—联系模型）',
      explanation: '<p>最常用的概念模型是 E-R 模型，用矩形/椭圆/菱形分别表示实体、属性和联系。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-model', text: '实体—联系方法（E-R 方法）' }],
    },
    {
      id: 'p2-f3-1',
      kind: 'fill',
      question: '<p>3. 关系数据库的操作语言有：__________、关系演算语言和 ___________。（第 1 空）</p>',
      answer: '关系代数语言',
      explanation:
        '<p>关系操作语言分三类：关系代数语言（如 ISBL）、关系演算语言（元组演算 ALPHA/QUEL、域演算 QBE）、具有二者双重特点的语言——SQL。第 1 空填「关系代数语言」。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-op', text: '关系操作语言的分类' }],
    },
    {
      id: 'p2-f3-2',
      kind: 'fill',
      question: '<p>3. 关系数据库的操作语言有：__________、关系演算语言和 ___________。（第 2 空）</p>',
      answer: '结构化查询语言（SQL，具有关系代数和关系演算双重特点）',
      explanation: '<p>第 2 空填「结构化查询语言（SQL）」——介于关系代数与关系演算之间的双重特点语言。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-op', text: '关系操作语言的分类' }],
    },
    {
      id: 'p2-f4-1',
      kind: 'fill',
      question:
        '<p>4. 当用户请求的_________语句违反数据的完整性约束规则时，DBMS 通常会_______用户的数据操作。（第 1 空）</p>',
      answer: '数据操纵（DML，增删改）',
      explanation:
        '<p>第 1 空：完整性检查发生在用户发出<strong>数据操纵（DML：INSERT/DELETE/UPDATE）</strong>语句之后。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-entity', text: '完整性检查与违约处理' }],
    },
    {
      id: 'p2-f4-2',
      kind: 'fill',
      question:
        '<p>4. 当用户请求的_________语句违反数据的完整性约束规则时，DBMS 通常会_______用户的数据操作。（第 2 空）</p>',
      answer: '拒绝（终止）',
      explanation: '<p>第 2 空：违反完整性约束的常用处理方式是<strong>拒绝</strong>（拒绝执行该操作）；级联/置空仅用于参照完整性删除等场景。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-ref', text: '违约处理' }],
    },
    {
      id: 'p2-f5-1',
      kind: 'fill',
      question:
        '<p>5. DBMS 的查询处理包括：_________、__________、_________和查询执行等。（第 1 空）</p>',
      answer: '查询分析',
      explanation: '<p>查询处理四个阶段：查询分析 → 查询检查 → 查询优化 → 查询执行。第 1 空填「查询分析」（扫描、词法与语法分析）。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-process', text: '查询处理步骤' }],
    },
    {
      id: 'p2-f5-2',
      kind: 'fill',
      question:
        '<p>5. DBMS 的查询处理包括：_________、__________、_________和查询执行等。（第 2 空）</p>',
      answer: '查询检查',
      explanation:
        '<p>第 2 空填「查询检查」：根据数据字典进行语义检查，核查存取权限与完整性约束，并把 SQL 语句转换为等价的关系代数表达式（语法分析树）。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-process', text: '查询检查' }],
    },
    {
      id: 'p2-f5-3',
      kind: 'fill',
      question:
        '<p>5. DBMS 的查询处理包括：_________、__________、_________和查询执行等。（第 3 空）</p>',
      answer: '查询优化',
      explanation:
        '<p>第 3 空填「查询优化」：分为代数优化（关系代数表达式等价变换）与物理优化（存取路径和底层操作算法的选择）。</p>',
      tags: [{ deck: 9, sec: 'sec-db9-optimize', text: '查询优化' }],
    },
    {
      id: 'p2-j1',
      kind: 'judge',
      question: '<p>（1）数据库系统是为了更有效地进行数据管理。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>数据库技术是应数据管理任务的需要而产生的——数据管理是数据处理的中心问题，数据库系统正是为了更有效地进行数据管理。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-overview', text: '数据管理与数据库技术' }],
    },
    {
      id: 'p2-j2',
      kind: 'judge',
      question: '<p>（2）数据库系统的三级模式结构有利于数据独立性的实现。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>三级模式将数据的三个抽象级别分开，配合二级映像，使模式变化尽量不影响上层——正是数据独立性（逻辑/物理）得以实现的结构保证。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-structure', text: '三级模式与数据独立性' }],
    },
    {
      id: 'p2-j3',
      kind: 'judge',
      question: '<p>（3）数据库的安全性是为了解决数据传递过程中的安全问题。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>数据库安全性是保护数据库以防止<strong>非法用户的越权使用、窃取、更改或破坏数据</strong>，解决的是数据库本身的存取安全问题，不是数据传递过程中的安全（那是网络传输安全的问题）。</p>',
      tags: [{ deck: 4, sec: 'sec-db4-overview', text: '数据库安全性的定义' }],
    },
    {
      id: 'p2-j4',
      kind: 'judge',
      question: '<p>（4）过程化 SQL 语言是为了独立开发数据库应用系统。</p>',
      options: ['对', '错'],
      answer: '错',
      explanation:
        '<p>过程化 SQL（PL/SQL、T-SQL 等）是对标准 SQL 的过程化扩充，目的是使 SQL <strong>同时兼顾数据操作和数据处理的能力</strong>，它运行在 DBMS 内部（存储过程、触发器），并非为了独立开发应用系统。</p>',
      tags: [{ deck: 8, sec: 'sec-db8-plsql', text: '过程化 SQL 的目的' }],
    },
    {
      id: 'p2-j5',
      kind: 'judge',
      question: '<p>（5）数据库的完整性控制是保证数据符合应用语义的手段。</p>',
      options: ['对', '错'],
      answer: '对',
      explanation:
        '<p>完整性约束（尤其用户定义的完整性）反映具体应用所涉及的数据必须满足的语义要求，完整性控制正是保证数据正确、有效、相容（符合应用语义）的手段。</p>',
      tags: [{ deck: 5, sec: 'sec-db5-user', text: '用户定义的完整性与应用语义' }],
    },
    {
      id: 'p2-e1',
      kind: 'essay',
      question: '<p>1. 简述数据库系统的组成。（5 分）</p>',
      answer:
        '<p>数据库系统（DBS）是引入数据库技术后的整个计算机系统，由以下部分组成：</p><ul><li><strong>硬件平台及数据库</strong>：计算机硬件设备与存储在其中的数据库；</li><li><strong>软件</strong>：数据库管理系统（DBMS，核心）、支持 DBMS 运行的操作系统、开发工具与应用程序等；</li><li><strong>人员</strong>：数据库管理员（DBA）、系统分析员和数据库设计人员、应用程序员和最终用户。</li></ul>',
      explanation: '<p>按课件 1.4（硬件平台及数据库 / 软件 / 人员）作答，各举代表性内容。</p>',
      tags: [{ deck: 1, sec: 'sec-db1-compose', text: '数据库系统的组成' }],
    },
    {
      id: 'p2-e2',
      kind: 'essay',
      question: '<p>2. 简述关系数据库中的关系模式。（5 分）</p>',
      answer:
        '<p>关系模式是对<strong>关系</strong>的描述（关系模式是型，关系是值），可以形式化地表示为 <strong>R(U, D, DOM, F)</strong>：R 为关系名；U 为组成该关系的属性名集合；D 为属性所来自的域；DOM 为属性向域的映象集合；F 为属性间的数据依赖关系集合。简化形式为 R(U) 或 R(A1, A2, …, An)。关系模式是静态的、稳定的；关系（某一时刻的值）是动态的、随时间不断变化的——二者统称为关系，通过上下文加以区别。关系数据库的型即关系模式，值即关系。</p>',
      explanation: '<p>要点：型的含义、五元组形式化定义、模式与关系的区别联系。</p>',
      tags: [{ deck: 2, sec: 'sec-db2-def', text: '关系模式' }],
    },
    {
      id: 'p2-e3',
      kind: 'essay',
      question: '<p>3. 阐述数据库的逻辑设计及其优化方法。（10 分）</p>',
      answer:
        '<p><strong>逻辑设计的任务</strong>：将概念设计阶段产生的概念模式（E-R 图）变换为数据库的逻辑模式（某 DBMS 支持的数据模型），并进行优化。</p><p><strong>E-R 模型向关系模型的转换规则</strong>：</p><ul><li>一个实体映射一个关系（模式），实体的常规属性成为关系的属性，单值的唯一属性即为关系的主码；</li><li>1:M 联系：在 M 端关系中加入 1 端关系的主码作为外码；</li><li>M:N 联系：联系两端的主码属性与联系自身的属性构成一个新关系，两个外码构成其复合主码；</li><li>1:1 联系：方法与 1:M 类似，外码放在任一端均可，一般选择<strong>强制端</strong>效果更好。</li></ul><p><strong>优化方法</strong>：</p><ul><li><strong>关系模式的规范化</strong>：① 确定数据依赖；② 对数据依赖进行极小化处理，消除冗余联系；③ 按数据依赖理论逐一分析是否存在部分函数依赖、传递函数依赖、多值依赖等，确定各模式的范式级别；④ 按需求分析确定是否对某些模式合并或分解；</li><li><strong>性能优化（反规范化设计）</strong>：并不是规范化程度越高就越优——查询经常涉及多个关系时连接代价高，此时 2NF 甚至 1NF 也许是最好的；可采用关系模式的水平分解、垂直分解与合并等；</li><li><strong>用户视图（外模式）设计</strong>：使用更符合用户习惯的别名、针对不同级别的用户定义不同的视图、简化用户对系统的使用、提高数据的逻辑独立性。</li></ul>',
      explanation: '<p>转换规则（实体/1:1/1:n/m:n）+ 规范化四步 + 性能优化 + 用户视图设计，即课件 7.4 的完整脉络。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-logic', text: 'E-R 模型向关系模型转换' },
        { deck: 7, sec: 'sec-db7-logic', text: '关系模式的规范化与性能优化' },
      ],
    },
    {
      id: 'p2-e4',
      kind: 'essay',
      question:
        '<p>在学生—课程数据库中，有 Student、Course 和 SC 三个关系：Student(Sno, Sname, Ssex, Ddept)、Course(Cno, Cname, PCno)、SC(Sno, Cno, Grade)。PCno 为课程的先修课，Ddept 为学生所在系，Cname 为课程名，Grade 为成绩。用关系代数完成下列操作：</p><p>（1）查询「通信系」全体「女」同学的学号和姓名；（2）查询选修了「软件工程」课程，且成绩及格（≥60）的学生学号。</p>',
      answer:
        `<pre class="code"><code>（1）π_(Sno,Sname)( σ_(Ddept='通信系' ∧ Ssex='女') ( Student ) )
（2）π_(Sno)( σ_(Cname='软件工程' ∧ Grade≥60) ( Student ⋈ SC ⋈ Course ) )</code></pre>`,
      explanation:
        '<p>（1）条件都在 Student 表上，选择后投影学号与姓名；（2）「软件工程」是课程名（Course），成绩在 SC 上，需自然连接三表后按条件选择，再投影学号（连接会产生重复列，投影前需去重）。</p>',
      tags: [
        { deck: 2, sec: 'sec-db2-algebra', text: '选择 σ 与投影 π' },
        { deck: 2, sec: 'sec-db2-algebra', text: '连接运算' },
      ],
    },
    {
      id: 'p2-e5',
      kind: 'essay',
      question:
        '<p>（接上题的学生—课程数据库）用 SQL 语言完成下列操作：</p><p>（1）将学生学号为「20172010」、课程号为「2008」的成绩改为 72 分；（2）查询学生学号为「20172010」所选修的全部课程（课程号）与成绩。</p>',
      answer:
        `<pre class="code"><code>（1）UPDATE SC SET Grade = 72
     WHERE Sno = '20172010' AND Cno = '2008';
（2）SELECT Cno, Grade FROM SC WHERE Sno = '20172010';</code></pre>`,
      explanation: '<p>（1）带条件的数据修改（UPDATE…SET…WHERE）；（2）单表选择查询。</p>',
      tags: [
        { deck: 3, sec: 'sec-db3-update', text: '数据修改（UPDATE）' },
        { deck: 3, sec: 'sec-db3-query', text: '单表查询' },
      ],
    },
    {
      id: 'p2-e6',
      kind: 'essay',
      question:
        '<p>设计一个图书借阅管理系统数据库，已知的实体有：<strong>借阅者</strong>（姓名、单位、地址、性别、年龄）；<strong>图书</strong>（书号、书名、作者、作者单位、价格、出版社、出版社联系人）；<strong>管理员</strong>（姓名、电话、性别）。设计要求：</p><p>(1) 正确画出该系统的 E-R 图（6 分）；(2) 将 E-R 图转换成关系模型（6 分）；(3) 根据应用语义分析各关系模式非平凡的函数依赖集（3 分）；(4) 分析各关系模式的候选码，确定主码与外码（3 分）；(5) 分析各关系模式的规范化级别，若有未达到 3NF 的关系模式，将其分解以达 3NF（2 分）。</p>',
      answer:
        `<p><strong>(1) E-R 图</strong>（借阅者需补充「借阅者编号/读者号」，管理员补充「管理员号」作为标识）：</p><pre class="code"><code>借阅者 ——(借阅 m:n，属性：借阅时间)—— 图书 ——(管理 n:1)—— 管理员</code></pre><p><strong>(2) 转换成关系模型</strong>（m:n 联系单独成关系；1:n 联系并入 n 端）：</p><pre class="code"><code>借阅者（读者号，姓名，单位，地址，性别，年龄）
图书（书号，书名，作者，作者单位，价格，出版社，出版社联系人，管理员号）
借阅（读者号，书号，借阅时间）
管理员（管理员号，姓名，电话，性别）</code></pre><p><strong>(3) 非平凡函数依赖集</strong>：</p><pre class="code"><code>借阅者：读者号 → 姓名，单位，地址，性别，年龄
图书：  书号 → 书名，作者，作者单位，价格，出版社，出版社联系人，管理员号
        出版社 → 出版社联系人
借阅：  (读者号，书号) → 借阅时间
管理员：管理员号 → 姓名，电话，性别</code></pre><p><strong>(4) 候选码、主码与外码</strong>：借阅者/图书/管理员均以单属性为候选码兼主码（读者号、书号、管理员号），无外码；借阅的候选码为 (读者号，书号) 复合主码，读者号、书号均为外码；图书的管理员号为外码。</p><p><strong>(5) 规范化级别与分解</strong>：借阅者、管理员、借阅均达到 BCNF；<strong>图书</strong>存在传递函数依赖 书号→出版社→出版社联系人，只达到 2NF，分解为：</p><pre class="code"><code>图书（书号，书名，作者，作者单位，价格，出版社，管理员号）  主码：书号；外码：出版社、管理员号
出版社（出版社，出版社联系人）                              主码：出版社</code></pre><p>分解后各模式均达到 3NF（并进一步达到 BCNF）。</p>`,
      explanation:
        '<p>评分点：E-R 图实体联系与属性、转换规则应用、FD 列写、码的分析、传递依赖 图书→出版社→联系人 的识别与分解。借阅(读者号,书号,借阅时间) 为全码关系，必属 BCNF。</p>',
      tags: [
        { deck: 7, sec: 'sec-db7-concept', text: 'E-R 图设计' },
        { deck: 7, sec: 'sec-db7-logic', text: 'E-R 模型向关系模型转换' },
        { deck: 6, sec: 'sec-db6-normal', text: '传递函数依赖与 3NF 分解' },
      ],
    },
  ],
};

export default paper;

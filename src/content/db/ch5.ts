/* 第5章 数据库完整性 —— 逐节转录自 课件/PPT-2022/第5章 数据库完整性.pdf（4 页，沈明玉） */
import type { DbChapter } from './types';

const ch5: DbChapter = {
  id: 'ch5',
  no: '第5章',
  title: '数据库完整性',
  subtitle: '实体完整性 · 参照完整性 · 用户定义的完整性 · 约束命名 · 断言 · 触发器',
  lede:
    '<p>本章内容：5.1 实体完整性、5.2 参照完整性、5.3 用户定义的完整性、5.4 完整性约束命名字句、5.5 断言、5.6 触发器（沈明玉）。</p>',
  toc: [
    { id: 'sec-db5-entity', text: '5.1 实体完整性', level: 2 },
    { id: 'sec-db5-ref', text: '5.2 参照完整性', level: 2 },
    { id: 'sec-db5-user', text: '5.3 用户定义的完整性', level: 2 },
    { id: 'sec-db5-constraint', text: '5.4 完整性约束命名字句', level: 2 },
    { id: 'sec-db5-assert', text: '5.5 断言（Assertion）', level: 2 },
    { id: 'sec-db5-trigger', text: '5.6 触发器（Trigger）', level: 2 },
  ],
  sections: [
    {
      id: 'sec-db5-entity',
      heading: '5.1 实体完整性',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>数据库中数据的完整性</strong>：数据的正确、有效、相容。<strong>数据库的完整性控制</strong>：采取有效方法保证数据库中数据的完整性。<strong>DBMS 采用的方法</strong>：1. 提供定义完整性约束条件的机制；2. 提供完整性检查的方法；3. 违约处理。</p>
            <p><strong>5.1.1 实体完整性定义</strong>——CREATE TABLE 中用 PRIMARY KEY 定义：</p>
            <pre class="code"><code>CREATE TABLE Student
  ( Sno CHAR(9) PRIMARY KEY,        /* 列级定义 */
    Sname CHAR(20) NOT NULL, ……);
CREATE TABLE Student
  ( Sno CHAR(9),
    Sname CHAR(20) NOT NULL,
    ……
    PRIMARY KEY (Sno) );            /* 表级定义 */</code></pre>
            <p><strong>5.1.2 实体完整性检查和违约处理</strong>——插入或对主码列进行更新操作时，RDBMS 按照实体完整性规则自动进行检查。包括：1. 检查主码值是否唯一，如果不唯一则拒绝插入或修改；2. 检查主码的各个属性是否为空，只要有一个为空就拒绝插入或修改。检查方法：全表扫描（<em>课件图示</em>）、索引方法（<em>课件图示</em>）。</p>`,
        },
      ],
    },
    {
      id: 'sec-db5-ref',
      heading: '5.2 参照完整性',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>5.2.1 参照完整性定义</strong>——在 CREATE TABLE 中用 FOREIGN KEY 短语定义外码，用 REFERENCES 短语指明外码所参照基本表的主码：</p>
            <pre class="code"><code>CREATE TABLE SC
  ( Sno   CHAR(9) NOT NULL,
    Cno   CHAR(4) NOT NULL,
    Grade SMALLINT,
    PRIMARY KEY (Sno, Cno),                       /* 在表级定义实体完整性 */
    FOREIGN KEY (Sno) REFERENCES Student(Sno),    /* 在表级定义参照完整性 */
    FOREIGN KEY (Cno) REFERENCES Course(Cno)      /* 在表级定义参照完整性 */
  );</code></pre>
            <p><strong>5.2.2 参照完整性检查和违约处理</strong>——可能破坏参照完整性的情况及违约处理：</p>
            <table class="tbl">
              <thead><tr><th>被参照表（例如 Student）</th><th>参照表（例如 SC）</th><th>违约处理</th></tr></thead>
              <tbody>
                <tr><td>插入元组</td><td>可能破坏参照完整性</td><td>拒绝</td></tr>
                <tr><td>修改外码值</td><td>可能破坏参照完整性</td><td>拒绝</td></tr>
                <tr><td>删除元组</td><td>可能破坏参照完整性</td><td>拒绝 / 级连删除 / 设置为空值</td></tr>
                <tr><td>修改主码值</td><td>可能破坏参照完整性</td><td>拒绝 / 级连修改 / 设置为空值</td></tr>
              </tbody>
            </table>
            <pre class="code"><code>CREATE TABLE SC
  ( Sno   CHAR(9) NOT NULL,
    Cno   CHAR(4) NOT NULL,
    Grade SMALLINT,
    PRIMARY KEY（Sno，Cno）,
    FOREIGN KEY (Sno) REFERENCES Student(Sno)
      ON DELETE CASCADE    /* 级联删除 SC 表中相应的元组 */
      ON UPDATE CASCADE,   /* 级联更新 SC 表中相应的元组 */
    FOREIGN KEY (Cno) REFERENCES Course(Cno)
      ON DELETE NO ACTION  /* 当删除 course 表中的元组造成了与 SC 表不一致时拒绝删除 */
      ON UPDATE CASCADE    /* 当更新 course 表中的 cno 时，级联更新 SC 表中相应的元组 */
  );
/*  置空值：SET NULL  */</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db5-user',
      heading: '5.3 用户定义的完整性',
      blocks: [
        {
          type: 'html',
          html: `
            <p>CREATE TABLE 时定义（<strong>列级、元组级（表级）两种定义方法！</strong>）：</p>
            <ul>
              <li>属性值非空（NOT NULL）：通常采用列级定义；</li>
              <li>属性值唯一（UNIQUE）：列级、表级（UNIQUE（属性名））均可；</li>
              <li>检查属性值是否满足一个布尔表达式（CHECK）：两者均可。</li>
              <li>违约处理：违反任一条用户定义的规则，均拒绝！</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-db5-constraint',
      heading: '5.4 完整性约束命名字句',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>CONSTRAINT &lt;完整性约束条件名&gt;
［PRIMARY KEY短语| FOREIGN KEY短语| CHECK短语］；</code></pre>
            <p>例：</p>
            <pre class="code"><code>CREATE TABLE Student
  ( Sno  NUMERIC(6) CONSTRAINT C1 CHECK (Sno BETWEEN 90000 AND 99999),
    Sname CHAR(20)  CONSTRAINT C2 NOT NULL,
    Sage  NUMBER(3) CONSTRAINT C3 CHECK (Sage &lt; 30),
    Ssex  CHAR(2)   CONSTRAINT C4 CHECK (Ssex IN ('男','女')),
    CONSTRAINT StudentKey PRIMARY KEY(Sno) );</code></pre>
            <p>通过命名子句修改完整性定义——修改表 Student 中的约束条件：</p>
            <pre class="code"><code>ALTER TABLE Student DROP CONSTRAINT C1;
ALTER TABLE Student ADD CONSTRAINT C1 CHECK (Sno BETWEEN 900000 AND 999999);
ALTER TABLE Student DROP CONSTRAINT C3;
ALTER TABLE Student ADD CONSTRAINT C3 CHECK (Sage &lt; 40)；</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db5-assert',
      heading: '5.5 断言（Assertion）',
      blocks: [
        {
          type: 'html',
          html: `
            <pre class="code"><code>定义断言：CREATE ASSERTION &lt;断言名&gt; CHECK &lt;约束规则&gt;</code></pre>
            <ul>
              <li>断言定义了数据库必须满足的约束；</li>
              <li>断言可以定义涉及多表或聚集操作的更为复杂的完整性约束；</li>
              <li>复杂的断言会造出很大的处理开销。</li>
            </ul>
            <pre class="code"><code>Create Assertion chk_SC_Num
Check ( 60 &gt;= ( Select count (*) from SC, Course
                Where SC.Cno = Course.Cno and Cname = '数据库' ) );
删除断言：DROP ASSERTION &lt;断言名&gt;;</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db5-trigger',
      heading: '5.6 触发器（Trigger）',
      blocks: [
        {
          type: 'html',
          html: `
            <p>触发器是由一系列 SQL 语句组成的动作体，当对数据库做修改（包括插入、删除和更新）时，它自动被系统执行。设置触发器机制必须满足的两个条件：① 指明什么条件下触发器被执行，即触发条件；② 指明触发器执行的动作是什么，即触发什么。</p>
            <div class="callout key">
              <p class="callout-h">触发器的利弊</p>
              <p>可以进行更为复杂的检查和操作，具有更精细和更强大的数据控制能力，能够保证数据库的一致性；检测和维护触发器需要很大的开销，降低了数据库增、删、改的效率！</p>
            </div>
            <pre class="code"><code>定义触发器：
CREATE TRIGGER &lt;触发器名&gt;
{ BEFORE | AFTER } &lt;触发事件&gt; ON &lt;表名&gt;
FOR EACH { ROW | STATEMENT }
［WHEN &lt;触发条件&gt;］
&lt;触发动作体&gt;；
了解：T-SQL 与 PL/SQL 的差异！</code></pre>
            <p>说明：1）创建者——表的拥有者；2）触发器名；3）表名——触发器的目标表；4）触发事件——INSERT、DELETE、UPDATE；5）触发器类型——行级触发器（FOR EACH ROW）、语句级触发器（FOR EACH STATEMENT）。</p>
            <p>例：定义一个 BEFORE 行级触发器，为教师表 Teachers 定义完整性规则「讲师的工资不得低于 3000 元，如果低于 3000 元，自动改为 3000 元」：</p>
            <pre class="code"><code>CREATE TRIGGER Insert_Or_Update_Sal
BEFORE INSERT OR UPDATE ON Teachers  -- 触发事件是插入或更新操作
FOR EACH ROW                         -- 行级触发器
BEGIN                                -- 定义触发动作体，是 PL/SQL 过程块
  IF (:new.Job='讲师') AND (:new.Sal &lt; 3000) THEN
    :new.Sal := 3000;                -- :old
  END IF;
END;</code></pre>
            <p><strong>激活触发器</strong>：触发器的执行是由触发事件激活的，并由数据库服务器自动执行；一个数据表上可能定义了多个触发器。同一个表上的多个触发器激活时遵循如下的执行顺序：(1) 执行该表上的 BEFORE 触发器；(2) 激活触发器的 SQL 语句；(3) 执行该表上的 AFTER 触发器。</p>
            <p><strong>删除触发器</strong>：</p>
            <pre class="code"><code>DROP TRIGGER &lt;触发器名&gt; ON &lt;表名&gt;;
触发器必须是一个已经创建的触发器，并且只能由具有相应权限的用户删除。
例：删除教师表 Teacher 上的触发器 Insert_Sal——
DROP TRIGGER Insert_Sal ON Teacher;</code></pre>
            <div class="callout key">
              <p class="callout-h">本章思考题与作业</p>
              <p>思考题：结合实际系统（如仓库管理系统）理解数据库完整性控制的必要性。作业：P173 习题 2、习题 4、习题 7。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch5;

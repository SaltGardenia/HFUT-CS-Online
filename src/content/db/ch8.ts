/* 第8章 数据库编程 —— 逐节转录自 课件/PPT-2022/第8章 数据库编程.pdf（9 页，沈明玉） */
import type { DbChapter } from './types';

const ch8: DbChapter = {
  id: 'ch8',
  no: '第8章',
  title: '数据库编程',
  subtitle: '嵌入式 SQL · 过程化 SQL · 存储过程与函数 · SQL 中的事务处理',
  lede:
    '<p>本章内容：8.1 嵌入式 SQL、8.2 过程化 SQL、8.3 存储过程与函数、8.4 SQL 中的事务处理（沈明玉）。</p>',
  toc: [
    { id: 'sec-db8-esql', text: '8.1 嵌入式 SQL', level: 2 },
    { id: 'sec-db8-plsql', text: '8.2 过程化 SQL', level: 2 },
    { id: 'sec-db8-proc', text: '8.3 存储过程和函数', level: 2 },
    { id: 'sec-db8-tx', text: '8.4 SQL 中的事务处理', level: 2 },
  ],
  sections: [
    {
      id: 'sec-db8-esql',
      heading: '8.1 嵌入式 SQL',
      blocks: [
        {
          type: 'html',
          html: `
            <p>SQL 语言提供了交互式 SQL 和嵌入式 SQL 两种使用方法。当一个程序既要访问数据库，又要处理数据时，将 SQL 语言嵌入到程序设计语言（<strong>宿主语言</strong>）中，将 SQL 语言访问数据库的功能和宿主语言的数据处理功能相结合，这种使用 SQL 的方法称为嵌入式 SQL。</p>
            <p>嵌入式 SQL 的使用需要解决的问题：</p>
            <ol>
              <li>宿主语言的编译器不能识别 SQL，如何将嵌有 SQL 语句的宿主语言编译成可执行代码？</li>
              <li>宿主语言与 DBMS 之间如何传递数据和信息？</li>
              <li>如何解决元组集合数据对宿主语言变量的赋值？</li>
            </ol>
            <p><strong>8.1.1 嵌入式 SQL 的处理过程</strong>——第①个问题的解决方法是<strong>预编译</strong>（<em>课件图示</em>）。在宿主语言中标注 SQL 语句的方法：C 语言程序用 <code>EXEC SQL &lt;SQL语句&gt;;</code>，Java 语言程序用 <code># SQL {&lt;SQL语句&gt;};</code>。</p>
            <p><strong>8.1.2 嵌入式 SQL 语句与主语言之间的通信</strong>——解决第②③两个问题，有三种手段：</p>
            <ul>
              <li><strong>SQL 通信区（SQLCA）</strong>：向主语言传递 SQL 语句的执行状态；</li>
              <li><strong>主变量（共享变量）</strong>：向 SQL 语句提供参数，接受 SQL 语句的查询结果；</li>
              <li><strong>游标</strong>：解决 SQL 查询结果的多对一赋值（向主变量）问题。</li>
            </ul>
            <p><strong>1. SQL 通信区</strong>：SQLCA 是一个具有特定数据结构的缓冲区，描述系统当前的工作状态和运行环境。使用方法：定义 SQLCA 用 <code>Exec SQL Include SQLCA</code>；使用 SQLCA 的变量 <code>SQLCODE</code>——为 0 执行成功，否则表示出错。SQLCA 属于 SQL 的内容，主语言可以访问。</p>
            <p><strong>2. 主变量（共享变量）</strong>：主变量是主语言的变量，SQL 与主语言均可对其进行赋值（共享）；宿主语言与 SQL 语言之间通过共享变量进行数据传送（双向）；每个主变量均可附带一个<strong>指示变量</strong>，用来说明主变量的值是否为空或是否被截断等；共享变量和指示变量在 SQL 语句的说明部分（Declare Section）进行说明，说明后在 SQL 语句中可引用（引用时需加 <code>:</code> 号，以区分数据库自身的变量，如属性）。</p>
            <p><strong>3. 游标（cursor）</strong>：游标是为了解决元组集合对主变量的赋值问题（多对一）；游标是为用户开设的一个数据缓冲区；采用类似指针的技术定位某一个元组。游标的使用方法：</p>
            <pre class="code"><code>定义游标：Exec SQL declare &lt;游标名&gt; cursor for &lt;查询子句&gt;；
打开游标：Exec SQL open &lt;游标名&gt;;
推进游标：Exec SQL fetch &lt;游标名&gt; into &lt;主变量表&gt;；
关闭游标：Exec SQL close &lt;游标名&gt;;</code></pre>
            <p><strong>4. 建立和关闭数据库连接</strong>：</p>
            <pre class="code"><code>建立数据库连接：
Exec SQL Connect TO target [AS connection-name] [User user-name];
  -- target 是要连接的数据库服务器：常见的服务器标识串如 &lt;dbname&gt;@&lt;hostname&gt;:&lt;port&gt;
  -- connect-name 是可选的连接名，也可使用 DEFAULT
关闭数据库连接：
Exec SQL DISConnect [ connection | CURRENT ];
  -- Connection 是已建的链接</code></pre>
            <p><strong>5. 程序实例</strong>——[例] 依次检查某个系的学生记录，交互式更新某些学生年龄：</p>
            <pre class="code"><code>EXEC SQL BEGIN DECLARE SECTION;   /*主变量说明开始*/
char deptname[20];
char HSno[20];
char HSname[20];
char HSsex[2];
int HSage;
int NEWAGE;
EXEC SQL END DECLARE SECTION;     /*主变量说明结束*/
EXEC SQL INCLUDE sqlca;           /*定义SQL通信区*/

int main(void)
{
  int count = 0;
  char yn;
  printf("Please choose the department name(CS/MA/IS): ");
  scanf("%s", deptname);          /*为主变量deptname赋值*/
  EXEC SQL CONNECT TO TEST@localhost:54321 USER "SYSTEM"/"MANAGER";
                                  /*连接数据库TEST*/
  EXEC SQL DECLARE SX CURSOR FOR  /*定义游标*/
    SELECT Sno, Sname, Ssex, Sage
    FROM Student
    WHERE SDept = :deptname;
  EXEC SQL OPEN SX;
  for ( ; ; )
  {
    EXEC SQL FETCH SX INTO :HSno, :HSname, :HSsex, :HSage;
                                    /*推进游标，将当前数据放入主变量*/
    if (sqlca.sqlcode != 0) break;
    if(count++ == 0)
      printf("\n%-10s %-20s %-10s %-10s\n", "Sno", "Sname", "Ssex", "Sage");
    printf("%-10s %-20s %-10s %-10d\n", HSno, HSname, HSsex, HSage);
    printf("UPDATE AGE(y/n)?");     /*询问用户是否要更新该学生的年龄*/
    do {
      scanf("%c",&yn);
    } while(yn != 'N' && yn != 'n' && yn != 'Y' && yn != 'y');
    if (yn == 'y' || yn == 'Y')
    {
      printf("INPUT NEW AGE:");
      scanf("%d",&NEWAGE);
      EXEC SQL UPDATE Student       /*执行SQL语言的修改语句*/
        SET Sage = :NEWAGE WHERE CURRENT OF SX ;
    }                               /*对当前游标指向的学生年龄进行修改*/
  }
  EXEC SQL CLOSE SX;                /*关闭游标SX*/
  EXEC SQL COMMIT WORK;             /*事务提交*/
  EXEC SQL DISCONNECT TEST;         /*断开数据库连接*/
}</code></pre>
            <p><strong>8.1.3 不用游标的 SQL 语句</strong>——这类 SQL 语句包括：说明性语句、数据定义语句、数据控制语句、查询结果为单行的 SELECT 语句、非 CURRENT 形式的增删改语句。</p>
            <pre class="code"><code>Exec SQL Begin Declare Section；
char sno[10], sname[20];
int sage;
Exec SQL End Declare Section；

1. 查询结果为单行的SELECT语句
Exec SQL Select sname, sage into :sname, :sage from Student
  Where sno=:sno;

2. 非CURRENT形式的增删改语句
Exec SQL Insert into Students (sno, sname, sage)
  values (:sno, :sname, :sage);
Exec SQL Update Students SET sname=:sname, sage=:sage Where sno=:sno;
Exec SQL Delete from SC Where sno = :sno;</code></pre>
            <p><strong>8.1.4 使用游标的 SQL 语句</strong>——必须使用游标的 SQL 语句有：查询结果为多行的 SELECT 语句、CURRENT 形式的 UPDATE 和 DELETE 语句。</p>
            <pre class="code"><code>1. 查询结果为多行的SELECT语句
EXEC SQL DECLARE SX CURSOR FOR  /*定义游标*/
  SELECT Sno, Sname, Ssex, Sage FROM Student WHERE SDept = :deptname;
EXEC SQL OPEN SX;               /*打开游标*/
EXEC SQL FETCH SX INTO :HSno, :HSname, :HSsex, :HSage;
                                /*推进游标并对主变量赋值*/
EXEC SQL CLOSE SX;              /*关闭游标SX*/

2. CURRENT形式的UPDATE和DELETE语句
WHERE CURRENT of &lt;游标名&gt;：当前游标指针所指向的元组。
EXEC SQL UPDATE Student SET Sage = :NEWAGE WHERE CURRENT OF SX ;
EXEC SQL DELETE FROM Student WHERE CURRENT OF SX ;</code></pre>
            <div class="callout tip"><p class="callout-h">注意</p><p>游标中的 SELECT 语句带有 UNION、ORDER 或该 SELECT 语句相当于定义了一个不可更新的视图时，不能使用 CURRENT 形式的 UPDATE 和 DELETE 语句！即：要保证游标中的元组与基本表中元组的对应关系不变！</p></div>
            <p><strong>8.1.5 动态 SQL</strong>：动态 SQL 指 SQL 语言可以在程序中动态构造，形成一个字符串，然后再交给 DBMS 执行，交给 DBMS 执行时仍然可以传递变量。动态 SQL 支持动态组装 SQL 语句和动态参数。</p>
            <p><strong>1. 使用 SQL 语句主变量</strong>：</p>
            <pre class="code"><code>exec sql include sqlca;
exec sql begin declare section;
char sqltext[]="delete from SC where Cno='c210'";
exec sql end declare section;
……
exec sql execute immediate :sqltext;</code></pre>
            <p><strong>2. 动态参数</strong>：动态参数是 SQL 语句中的可变元素，使用参数符号（?）表示该位置的数据在运行时设定。使用动态参数的步骤如下：</p>
            <ol>
              <li>声明 SQL 语句主变量——SQL 语句主变量的值包含动态参数（?）；</li>
              <li>准备 SQL 语句（PREPARE）——PREPARE 将分析含主变量的 SQL 语句内容，建立语句中包含的动态参数的内部描述符，并用 &lt;语句名&gt; 标识它们的整体：<code>EXEC SQL PREPARE &lt;语句名&gt; FROM &lt;SQL 语句主变量&gt;</code>；</li>
              <li>执行准备好的语句（EXECUTE）——EXECUTE 将 SQL 语句中分析出的动态参数和主变量或数据常量绑定，作为语句的输入或输出变量：<code>EXEC SQL EXECUTE &lt;语句名&gt; [INTO &lt;主变量表&gt;] [USING &lt;主变量或常量&gt;]</code>。</li>
            </ol>
            <pre class="code"><code>[例]
EXEC SQL begin declare section;
char sqltext[]="insert into TEST values(?);";
EXEC SQL end declare section;
……
EXEC SQL PREPARE mystmt FROM :sqltext;   /*准备语句*/
……
EXEC SQL EXECUTE mystmt USING 100;       /*执行语句*/
EXEC SQL EXECUTE mystmt USING 200;</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db8-plsql',
      heading: '8.2 过程化 SQL',
      blocks: [
        {
          type: 'html',
          html: `
            <p>传统的 SQL 语言是非过程化语言，只能进行数据操作，不能进行数据处理。为了使 SQL 同时兼顾数据操作和数据处理的能力，DBMS 厂商在标准 SQL 的基础上进行了过程化语言的扩充，如：Oracle 的 PL/SQL、SQL Server 的 Transact-SQL、IBM DB2 的 SQL PL 等。</p>
            <p><strong>8.2.1 Transact-SQL</strong>——SQL Server 用于操作数据库的编程语言为 Transaction-SQL，简称 T-SQL。T-SQL 包括以下 4 个部分：</p>
            <ul>
              <li><strong>DDL</strong>：定义和管理数据库及其对象，例如 create、alter 和 drop 等；</li>
              <li><strong>DML</strong>：实现对数据库表各对象的操作，例如 insert、update 等；</li>
              <li><strong>DCL</strong>：数据控制语言，实现对数据库进行安全管理和权限管理等控制，例如 grant、revoke 等；</li>
              <li><strong>附加的语言元素</strong>：包括变量、运算符、函数、注释和流程控制语句等。</li>
            </ul>
            <p><strong>T-SQL 的变量</strong>：</p>
            <ul>
              <li><strong>局部变量</strong>：由用户定义，名称必须以 @ 开始，使用 declare 变量声明语句定义：<code>declare @变量1 [as] datatype, @变量2 [as] datatype …</code></li>
              <li><strong>全局变量</strong>：由 SQL Server 系统定义，通常用来跟踪服务器范围和特定会话期间的信息，不能被用户显式地定义和赋值；全局变量名以 @@ 开头，如 @@error、@@servername、@@rowcount 等。</li>
            </ul>
            <p><strong>T-SQL 的赋值语句</strong>——局部变量的赋值有三种方式：</p>
            <pre class="code"><code>①在变量定义的时候对其赋值：
declare @变量1 [as] datatype = value, @变量2 [as] datatype = value...
②select赋值语句：
select @变量1 = 表达式1, @变量2 = 表达式2...
③set赋值语句：
set @变量 = 表达式</code></pre>
            <p>set 赋值语句基本用法和 select 一样，区别在于一条 set 赋值语句只能给一个变量赋值，而一条 select 语句可以给多个变量赋值。</p>
            <p><strong>T-SQL 的 WHILE 循环、FOR 循环、IF 语句、游标</strong>：</p>
            <pre class="code"><code>DECLARE @sno char(10), @cno char(6), @grade numeric(3,1)
DECLARE My_Cursor CURSOR FOR
  ( SELECT * FROM SC Where Cno='c209' and Grade&lt;60 )
OPEN My_Cursor;
FETCH NEXT FROM My_Cursor INTO @sno, @cno, @grade;
WHILE @@FETCH_STATUS = 0
BEGIN
  IF @grade&gt;=50
    UPDATE SC SET Grade=60 WHERE CURRENT OF My_Cursor;
  FETCH NEXT FROM My_Cursor INTO @sno, @cno, @grade;
END
CLOSE My_Cursor;         --关闭游标
DEALLOCATE My_Cursor;    --释放游标</code></pre>
            <p><strong>异常处理</strong>：T-SQL 代码中的错误可使用 TRY…CATCH 构造处理。TRY…CATCH 构造包括两部分：一个 TRY 块和一个 CATCH 块。</p>
            <pre class="code"><code>BEGIN TRY
  SELECT 1/0;
END TRY
BEGIN CATCH
  SELECT ERROR_NUMBER() AS ErrorNumber,
         ERROR_PROCEDURE() AS ErrorProcedure,
         ERROR_MESSAGE() AS ErrorMessage;
END CATCH;</code></pre>
            <p><strong>8.2.2 PL/SQL</strong>——PL/SQL 是 Oracle 对标准 SQL 的过程化扩充，它将数据库技术和过程化程序设计语言联系起来，可使用循环、分支和嵌套，将 SQL 的数据操纵功能与过程化语言数据处理功能相结合。</p>
            <p><strong>PL/SQL 程序的基本结构</strong>：</p>
            <pre class="code"><code>DECLARE——可选部分：变量、常量、游标、用户定义异常的声明
BEGIN——必要部分：SQL语句和PL/SQL语句构成的执行程序
EXCEPTION——可选部分：程序出现异常时，捕捉异常并处理异常
END；——必须部分</code></pre>
            <p><strong>PL/SQL 的变量</strong>：</p>
            <pre class="code"><code>简单变量：变量名 [constant] 变量类型 [not null] [default 值| :=值]
  v_name varchar2(10);
  v_age constant number := 20;
  v_sex char(2) default '男';
复合变量：
  布尔类型：v_tf boolean;
  type类型：v_sno student.sno%type;
  rowtype类型：v_sc sc%rowtype;   (使用：v_sc.sno)</code></pre>
            <p><strong>PL/SQL 的语句</strong>：</p>
            <pre class="code"><code>赋值语句：变量名称 := 表达式      v_sno := '20180080';
条件语句：IF-THEN、IF-THEN-ELSE和嵌套的IF语句
  IF (new.Job = '讲师') AND (new.Sal &lt; 3000) THEN
    new.Sal := 3000;
  END IF;
循环语句：
  基本loop循环：Loop 语句1；…… exit [when 条件]; End loop;
  While loop循环：While 条件 loop 语句1；…… 语句n; End loop;
  For loop循环：For 控制变量 in [reverse] 下限..上限 loop 语句1；…… 语句n; End loop;</code></pre>
            <p><strong>PL/SQL 的异常处理</strong>：</p>
            <pre class="code"><code>EXCEPTION
WHEN exception_name THEN
  Code for handing exception_name;
[WHEN another_exception THEN
  Code for handing another_exception];
[WHEN others THEN
  code for handing any other exception.]

Oracle预定义异常：no_data_found, too_many_rows, storage_error, zero_divide 等。</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db8-proc',
      heading: '8.3 存储过程和函数',
      blocks: [
        {
          type: 'html',
          html: `
            <p>过程化 SQL 编写的程序块分为<strong>命名块</strong>和<strong>匿名块</strong>：匿名块不保存，每次运行都要进行编译，其他程序不能调用；命名块编译后以数据库对象的形式保存在数据库服务器上，可被其他程序调用。<strong>存储过程与函数均属于命名块</strong>。</p>
            <p><strong>8.3.1 存储过程</strong>：由过程化 SQL 语句书写的过程，经编译和优化后存储在数据库服务器中，使用时只要调用即可。存储过程的优点：</p>
            <ul>
              <li>运行效率高；</li>
              <li>降低了客户机和服务器之间的通信量；</li>
              <li>方便实施企业规则。</li>
            </ul>
            <p><strong>1. 创建 PL/SQL 存储过程</strong>：</p>
            <pre class="code"><code>Create [or replace] procedure 过程名
  [(argument1 [in|out|in out] type1, argument2 [in|out|in out] type2, ……)]
{IS | AS}
  &lt;类型、变量的说明&gt;
Begin
  &lt;执行部分&gt;
Exception
  &lt;可选的异常处理部分&gt;
end;
注：PL/SQL创建存储过程的例子参见教材存储过程部分！</code></pre>
            <p><strong>2. 创建 T-SQL 存储过程</strong>：</p>
            <pre class="code"><code>CREATE PROC[EDURE] 存储过程名
  @参数1 数据类型[=默认值] [INPUT | OUTPUT], ……,
  @参数n 数据类型[=默认值] [INPUT | OUTPUT]
AS
T-SQL程序块
GO

Create procedure setGrade
  @sno char(10), @cno char(4), @grade numeric(4,1),
  @st varchar(50) output
AS
begin transaction
Declare @cnt int
select @cnt=0, @st='数据修改'
Select @cnt=count(*) from SC Where Sno=@sno and Cno=@cno
if @cnt&gt;0
  update sc set Grade=@grade Where Sno=@sno and Cno=@cno
else
begin
  Insert into sc values(@sno,@cno,@grade)
  set @st='数据插入'
end
commit transaction

过程调用：
Declare @ret_st varchar(50)
EXEC setGrade '20160001', 'c209', 90, @ret_st output
Print @ret_st</code></pre>
            <p><strong>8.3.2 函数</strong>——PL/SQL 创建函数：</p>
            <pre class="code"><code>Create or replace function 函数名 [(argment [{in|out|in out}] type,…)]
Return return_type
{IS | AS}
  &lt;类型、变量说明&gt;
Begin
  &lt;函数体，执行部分&gt;
Exception
  &lt;可选的异常处理部分&gt;
End;</code></pre>
            <p>T-SQL 创建函数：</p>
            <pre class="code"><code>create function function_name
  ([{@parameter_name [as] date_type [=default]}[,…n]])
returns return_data_type
[as]
begin
  function_body
  return scalar_expression
end

T-SQL函数简单示例：
create function getGrade(@sno char(10), @cno char(6))
returns numeric(4,1)
As
begin
  declare @grade numeric(4,1)
  set @grade = -1;
  selecet @grade = grade from sc where Sno = @sno and Cno=@cno
  return @grade
End
-------------------
Declare @s1 char(10)='20160001', @c1 char(6)='c209', @g1 numeric(4,1)
Select @g1 = getGrade(@s1,@c1);
If @g1&lt;&gt;-1
  print '成绩为：'+ convert(char(5), @g1)
Else
  print '为找到课程成绩！'</code></pre>
            <p><strong>定义触发器</strong>（两种过程化 SQL 的对比）：</p>
            <pre class="code"><code>PL/SQL:
CREATE TRIGGER &lt;触发器名&gt;
{ BEFORE | AFTER } &lt;触发事件&gt; ON &lt;表名&gt;
FOR EACH { ROW | STATEMENT }
&lt;触发动作体&gt;；
特殊对象：New, Old

T-SQL:
CREATE TRIGGER &lt;触发器名&gt; ON &lt;表名&gt;
{ FOR | AFTER | INSTEAD OF } &lt;触发事件&gt;
AS
&lt;触发动作体&gt;；
特殊关系：Inserted, Deleted</code></pre>
            <p>［例］定义一个 BEFORE 行级触发器，为教师表 Teacher 定义完整性规则「讲师的工资不得低于 3000 元，如果低于 3000 元，自动改为 3000 元」：</p>
            <pre class="code"><code>CREATE TRIGGER Insert_Or_Update_Sal
BEFORE INSERT OR UPDATE ON Teacher  /*触发事件是插入或更新操作*/
FOR EACH ROW                        /*行级触发器*/
AS BEGIN                            /*定义触发动作体，是PL/SQL过程块*/
  IF (new.Job='讲师') AND (new.Sal &lt; 3000) THEN
    new.Sal := 3000;
  END IF;
END;
（T-SQL示例）</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db8-tx',
      heading: '8.4 SQL 中的事务处理',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>事务（Transaction）的定义</strong>：构成单一逻辑工作单元的数据库操作序列；一个不可分割的工作单位；恢复和并发控制的基本单位。一个事务就是将一系列的数据操纵 SQL 语句作为一个逻辑单元，逻辑单元里面的单个操作要么全做，要么全部不做，以保证数据的完整性。</p>
            <p><strong>事务的 ACID 特性</strong>：<strong>原子性</strong>（Atomicity）、<strong>一致性</strong>（Consistency）、<strong>隔离性</strong>（Isolation）、<strong>持续性</strong>（Durability）。</p>
            <p><strong>PL/SQL 事务支持的相关语句</strong>：Commit、rollback、savepoint、rollback to savepoint。</p>
            <ul>
              <li>PL/SQL 未提供事务开始的显式定义语句；</li>
              <li>事务的提交与回滚：Commit、rollback；</li>
              <li>基于保存点的事务回滚：</li>
            </ul>
            <pre class="code"><code>savepoint sp1;
&lt;SQL的数据更新语句&gt;;
rollback to sp1;</code></pre>
            <p><strong>T-SQL 的事务</strong>：<code>begin transaction [trans_name]</code>、<code>commit transaction [trans_name]</code>、<code>rollback transaction [trans_name] [st_name]</code>、<code>save transaction &lt;st_name&gt;</code>；相关全局变量：@@ERROR、@@TRANSCOUNT。</p>
            <p><strong>T-SQL 事务的分类</strong>：</p>
            <ul>
              <li><strong>显式事务</strong>：用 begin transaction 定义；</li>
              <li><strong>隐式事务</strong>：通过 set implicit_transaction on 打开隐式事务模式，下一个语句自动开启一个新事务，事务结束后的下一个语句又将开启一个新事务；</li>
              <li><strong>自动提交事务（默认模式）</strong>：将每条 SQL 语句视为一个事务，执行成功则自动提交，失败则自动回滚。</li>
            </ul>
            <div class="callout key">
              <p class="callout-h">本章思考题与作业</p>
              <p>思考题：嵌入式 SQL 是数据库应用系统开发的主要手段，主语言的数据处理能力非常强大，为何还需要使用过程化 SQL？作业：教材习题 2（要求用 T-SQL 完成！）；</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch8;

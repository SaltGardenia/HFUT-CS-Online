/* 第4章 数据库安全性 —— 逐节转录自 课件/PPT-2022/第4章 数据库安全性.pdf（6 页，沈明玉） */
import type { DbChapter } from './types';

const ch4: DbChapter = {
  id: 'ch4',
  no: '第4章',
  title: '数据库安全性',
  subtitle: '安全性概述 · 安全性控制 · 视图机制 · 安全审计 · 数据加密',
  lede:
    '<p>本章内容：4.1 数据库安全性概述、4.2 数据库安全性控制、4.3 视图机制、4.4 安全审计、4.5 数据加密（沈明玉）。</p>',
  toc: [
    { id: 'sec-db4-overview', text: '4.1 数据库安全性概述', level: 2 },
    { id: 'sec-db4-control', text: '4.2 数据库安全性控制', level: 2 },
    { id: 'sec-db4-view', text: '4.3 视图机制', level: 2 },
    { id: 'sec-db4-audit', text: '4.4 审计', level: 2 },
    { id: 'sec-db4-encrypt', text: '4.5 数据加密', level: 2 },
  ],
  sections: [
    {
      id: 'sec-db4-overview',
      heading: '4.1 数据库安全性概述',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>数据库安全性</strong>：是指保护数据库以防止非法用户的越权使用、窃取、更改或破坏数据。数据库的安全性可以划分为三个层次：网络系统的安全、操作系统的安全、数据库管理系统的安全。</p>
            <ul>
              <li><strong>网络系统的安全</strong>：这是数据库的第一个安全屏障。目前网络系统面临的主要威胁有木马程序、网络欺骗、入侵和病毒等。</li>
              <li><strong>操作系统安全</strong>：主要来自网络内所使用操作系统的安全，包括操作系统本身的缺陷、对操作系统的安全配置、病毒的威胁三个方面。</li>
              <li><strong>数据库系统面临的主要风险</strong>：操作系统的风险——数据库系统的安全性最终要靠操作系统和硬件设备所提供的环境，如果操作系统允许用户直接存取数据库文件，即使数据库系统中采取了最可靠的安全措施也没有用；管理的风险——主要指用户的安全意识，对信息网络安全的重视程度及相关的安全管理措施；用户的风险——主要表现在用户账号和对特定数据库对象的操作权限；数据库管理系统内部的风险——DBMS 厂商对源码的控制、后门、安全机制等。</li>
              <li><strong>安全标准</strong>：TCSEC——可信计算机系统评估准则（美国国防部）；ITSEC——信息技术安全评估准则（欧洲）；CTCPEC——加拿大可信计算机产品评估准则（加拿大）；CC——通用准则（ISO，我国采用）。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-db4-control',
      heading: '4.2 数据库安全性控制',
      blocks: [
        {
          type: 'html',
          html: `
            <p><em>课件图示：数据库系统安全模型与数据库管理系统的安全模型。</em>数据库安全性控制的常用方法：<strong>用户标识和鉴定、访问控制、视图、审计、数据加密</strong>。</p>
            <p><strong>4.2.1 用户标识与鉴别</strong>——用户标识：每个合法用户均被赋予一个身份标识；身份鉴别：鉴别用户的合法身份。身份鉴别方法：静态口令鉴别、动态口令鉴别、生物特征鉴别、智能卡鉴别。</p>
            <p><strong>4.2.2 存取控制</strong>——访问控制机制的组成：定义用户权限、合法权限检查。常用访问控制方法：自主访问控制 DAC（C2 级、灵活）、强制访问控制 MAC（B1 级、严格）。</p>
            <p><strong>4.2.3 自主访问控制方法 DAC</strong>：主体与客体直接关联；主体的权限需要授权；具有授权资格的用户均可实现授权。</p>
            <p><strong>关系数据库系统中的存取权限</strong>：</p>
            <table class="tbl">
              <thead><tr><th>对象类型</th><th>对象</th><th>操作类型</th></tr></thead>
              <tbody>
                <tr><td rowspan="4">模式</td><td>数据库</td><td>CREATE SCHEMA</td></tr>
                <tr><td>基本表</td><td>CREATE TABLE，ALTER TABLE</td></tr>
                <tr><td>视图</td><td>CREATE VIEW</td></tr>
                <tr><td>索引</td><td>CREATE INDEX</td></tr>
                <tr><td rowspan="2">数据</td><td>基本表和视图</td><td>SELECT，INSERT，UPDATE，DELETE，REFERENCES，ALL PRIVILEGES</td></tr>
                <tr><td>属性列</td><td>SELECT，INSERT，UPDATE，REFERENCES，ALL PRIVILEGES</td></tr>
              </tbody>
            </table>
            <p><strong>4.2.4 授权：授予与收回</strong>——通过 SQL 的 GRANT 语句和 REVOKE 语句实现；用户权限组成：数据对象、操作类型；定义用户访问权限：定义用户可以在哪些数据库对象上进行哪些类型的操作。</p>
            <pre class="code"><code>授权 GRANT 语句：
GRANT &lt;权限&gt; [, &lt;权限&gt;] ...
  [ON &lt;对象类型&gt; &lt;对象名&gt;]
  TO &lt;用户&gt; [, &lt;用户&gt;] ...
  [WITH GRANT OPTION];</code></pre>
            <ul>
              <li>谁可以发出 GRANT：DBA、对象创建者（Owner）、拥有该权限的用户。</li>
              <li>可接受权限的用户：一个或多个具体用户、PUBLIC（全体用户）。</li>
              <li>WITH GRANT OPTION 子句；<em>课件图示：不允许循环授权。</em></li>
            </ul>
            <pre class="code"><code>撤销（收回）权限 REVOKE：
REVOKE &lt;权限&gt; [, &lt;权限&gt;] ... [ON &lt;对象类型&gt; &lt;对象名&gt;] FROM &lt;用户&gt; [, &lt;用户&gt;] ...;</code></pre>
            <p><strong>创建用户时初始角色授权</strong>：CREATE USER &lt;username&gt; ［WITH］［DBA | RESOURCE | CONNECT］</p>
            <table class="tbl">
              <thead><tr><th>拥有的权限</th><th>CREATE USER</th><th>CREATE SCHEMA</th><th>CREATE TABLE</th><th>登录数据库执行数据查询和操纵</th></tr></thead>
              <tbody>
                <tr><td>DBA</td><td>可以</td><td>可以</td><td>可以</td><td>可以</td></tr>
                <tr><td>RESOURCE</td><td>不可以</td><td>不可以</td><td>可以</td><td>可以</td></tr>
                <tr><td>CONNECT</td><td>不可以</td><td>不可以</td><td>不可以</td><td>可以，但必须拥有相应权限</td></tr>
              </tbody>
            </table>
            <p><strong>4.2.5 数据库角色</strong>——数据库角色：被命名的一组与数据库操作相关的权限；角色是权限的集合；可以为一组具有相同权限的用户创建一个角色，简化授权的过程。角色的创建：CREATE ROLE &lt;角色名&gt;；给角色授权：</p>
            <pre class="code"><code>GRANT &lt;权限&gt;［，&lt;权限&gt;］… ON &lt;对象类型&gt; 对象名 TO &lt;角色&gt;［，&lt;角色&gt;］…；
将一个角色授予其他的角色或用户：
GRANT &lt;角色1&gt;［，&lt;角色2&gt;］… TO &lt;角色3&gt;［，&lt;用户1&gt;］… [WITH ADMIN OPTION]；
角色权限的收回：
REVOKE &lt;权限&gt;［，&lt;权限&gt;］… ON &lt;对象类型&gt; &lt;对象名&gt; FROM &lt;角色&gt;［，&lt;角色&gt;］…；</code></pre>
            <p><strong>4.2.6 强制存取控制 MAC</strong>：保证更高程度的安全性；用户不能直接感知或进行控制；适用于对数据有严格而固定密级分类的部门。主体是系统中的活动实体——DBMS 所管理的实际用户、代表用户的各个进程；客体是系统中的被动实体，是受主体操纵的——文件、基本表、索引、视图。</p>
            <p><strong>敏感度标记（Label）</strong>：主体的敏感度标记称为许可证级别；客体的敏感度标记称为密级。<strong>强制存取控制规则</strong>：(1) 仅当主体的许可证级别大于或等于客体的密级时，该主体才能读取相应的客体；(2) 仅当主体的许可证级别等于客体的密级时，该主体才能写相应的客体。<strong>修正规则</strong>：当主体的许可证级别 &lt;= 客体的密级时，主体能写客体。</p>`,
        },
      ],
    },
    {
      id: 'sec-db4-view',
      heading: '4.3 视图机制',
      blocks: [
        {
          type: 'html',
          html: `
            <ul>
              <li>作用：把要保密的数据对无权存取这些数据的用户隐藏起来，对数据提供一定程度的安全保护。</li>
              <li>视图的主要功能是提供数据独立性，无法完全满足要求；视图间接实现了支持存取谓词的用户权限定义。</li>
            </ul>
            <p>视图示例：</p>
            <pre class="code"><code>CREATE VIEW CS_Student AS
  SELECT * FROM Student WHERE Sdept='CS';
GRANT SELECT ON CS_Student TO 王平;
GRANT ALL PRIVILIGES ON CS_Student TO 张明;</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db4-audit',
      heading: '4.4 审计',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>什么是审计？</strong>审计日志（Audit Log）：将用户对数据库的所有操作记录在上面；DBA 利用审计日志：找出非法存取数据的人、时间和内容；<strong>C2 以上安全级别的 DBMS 必须具有</strong>。</p>
            <p><strong>审计事件</strong>：服务器事件——如启动、停止、配置文件的重新加载等；系统权限——审计对结构、模式等对象的操作权限是否是通过系统权限获得的；语句事件——对各种 SQL 语句的审计；模式对象事件——对特定模式对象（表、视图、过程、函数等）进行查询或更新操作的审计。</p>
            <p><strong>审计功能</strong>：基本功能——能提供多种审计查阅方式；提供多套审计规则——在数据库初始化时设定，方便审计员管理；提供审计分析和报表功能；审计日志管理功能；提供查询审计设置及审计记录信息的专门视图。</p>
            <p><strong>AUDIT 和 NOAUDIT 语句</strong>：AUDIT 语句——设置审计功能；NOAUDIT 语句——取消审计功能。用户级审计——一般用户使用，对自己的数据对象进行审计；系统级审计——DBA 设置，监测成功或失败的登录、授权或收回操作，以及其他系统级权限的操作。审计设置示例：</p>
            <pre class="code"><code>AUDIT   ALTER，UPDATE  ON  SC;
NOAUDIT ALTER，UPDATE  ON  SC;</code></pre>`,
        },
      ],
    },
    {
      id: 'sec-db4-encrypt',
      heading: '4.5 数据加密',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>数据库中数据加密的特殊性</strong>：</p>
            <ul>
              <li>OS 层加密：在 OS 层无法辨认数据库中的数据关系，从而无法产生合理的密钥，对密钥的管理和使用也很难。</li>
              <li>DBMS 内核层加密：优点是加密功能强，可以实现加密功能与数据库管理系统之间的无缝耦合；缺点是加密运算在服务器端进行，加重了服务器的负载。</li>
              <li>DBMS 外层加密：将数据库加密系统做成 DBMS 的一个外层工具。</li>
            </ul>
            <div class="callout key">
              <p class="callout-h">本章思考题与作业</p>
              <p>思考题：影响数据库系统安全性的因素有哪些？作业：P155 习题 5、习题 6。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default ch4;

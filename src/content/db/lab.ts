/* 实验环境搭建 —— 逐页转录自 课件/实验-学习通/资料/MySQL实验环境的搭建.pptx（18 页）
   与 课件/实验-学习通/资料/opengauss3.1.1实验部署.pptx（8 页）；操作步骤截图以「课件图示」注明。 */
import type { DbChapter } from './types';

const lab: DbChapter = {
  id: 'lab',
  no: '实验',
  title: '实验环境搭建',
  subtitle: 'MySQL 下载部署与 Navicat 连接 · openGauss 3.1.1 部署与客户端工具',
  lede:
    '<p>实验环境资料两份：<strong>MySQL 实验环境的搭建</strong>（MySQL 下载部署 → Navicat 下载安装 → Navicat 与 MySQL 连接）与 <strong>openGauss 3.1.1 实验部署</strong>（服务器/虚拟机两条路径、gsql 与 Data Studio 客户端）。操作截图以「课件图示」注明。</p>',
  toc: [
    { id: 'sec-dblab-mysql', text: 'MySQL 实验环境的搭建', level: 2 },
    { id: 'sec-dblab-og', text: 'openGauss 3.1.1 实验部署', level: 2 },
  ],
  sections: [
    {
      id: 'sec-dblab-mysql',
      heading: 'MySQL 实验环境的搭建',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>1.1 MySQL 下载和部署</strong>——（1）下载 MySQL，下载地址 <code>https://dev.mysql.com/downloads/installer/</code>（<em>课件图示</em>）；（2）双击安装软件开始安装：点击 Next，显示安装目录，可以自定义，然后点击 Next（<em>课件图示</em>）；（3）依次 Next、Execute（<em>课件图示</em>）；（4）一直 Next，直到 Accounts and Roles 界面，设置 root 密码，建议 123456（<em>课件图示</em>）；（5）依次 Next、Execute（<em>课件图示</em>）；（6）一直 Next，到验证密码界面，接着 Execute、finish 结束（<em>课件图示</em>）；（7）在开始菜单中有 MySQL 8.0 Command Line Client，进入，输入设置的 root 密码，显示欢迎信息即代表安装成功（<em>课件图示</em>）。</p>
            <p><strong>1.2 Navicat 下载和安装</strong>——两种方式安装 Navicat：第一种官网地址下载安装 <code>https://www.navicat.com.cn/products</code>（点击免费试用，直接下载 64 bit，接着安装即可）；第二种需要自己破解激活，方法课件中给出博客链接（本站未收录该链接，使用第二种的话防火墙可以先关闭）（<em>课件图示</em>）。</p>
            <p><strong>1.3 Navicat 和 MySQL 连接</strong>：</p>
            <ul>
              <li><strong>连接</strong>：打开 Navicat，点击连接菜单，选择 MySQL；在新建连接界面自定义连接名，输入 root 密码，点击测试连接，显示连接成功即连接成功，然后点击确定（<em>课件图示</em>）。</li>
              <li><strong>创建数据库</strong>：右键创建数据库，命名数据库，选择字符集（<em>课件图示</em>）。</li>
              <li><strong>新建表</strong>：在「表」上右键，选择新建表，输入表的信息；输完数据后 Ctrl+S 保存，输入数据表名。课件以考试数据库为例建立六张表：</li>
            </ul>
            <pre class="code"><code>考生表：examinee(eeid, eename, eesex, eeage, eedepa)
考官表：examiner(erid, ername, ersex, erage, ersalary, erdepa)
试卷表：exampaper(eid, ename, etype, eduration)
考生答卷表：eeexam(eeid, eid, achieve)
考官制卷表：erexam(erid, eid)
院系表：department(dname, dloca, dtele)</code></pre>
            <ul>
              <li><strong>查询</strong>：对表 examiner 进行查询——查询工资大于等于 8000 的考官；在「新建查询」输入 SQL 语句后点击运行，下边列出符合查询条件的结果（<em>课件图示</em>）。</li>
              <li><strong>外键</strong>：erexam 与 exampaper 两张表建立联系——在 erexam 表上右键设计表，点击外键（<em>课件图示</em>）。</li>
              <li><strong>删除表</strong>：右键表，点击删除（<em>课件图示</em>）。</li>
            </ul>`,
        },
      ],
    },
    {
      id: 'sec-dblab-og',
      heading: 'openGauss 3.1.1 实验部署',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>openGauss 安装部署</strong>两条路径：1）在华为 Taishan 服务器上安装 openGauss（操作系统：openEuler）；2）在 Windows 平台上安装：VMware 虚拟机 + openGauss 1.1.0 镜像（操作系统：CentOS Linux 7）。</p>
            <p>D501 实验室有两台 Taishan 服务器——华为出品的数据中心服务器，基于华为鲲鹏 ARM64 处理器，为大数据、分布式存储、数据库、HPC（High Performance Computing）等应用提供高效能算力（<em>课件图示</em>）。</p>
            <p>在 Taishan 服务器路径下：安装 openEuler——华为服务器操作系统 EulerOS，开源后命名为 openEuler；再安装 openGauss（<em>课件图示</em>）。</p>
            <p><strong>客户端</strong>——DBMS 部署成功后，需要通过一些工具来便捷地连接数据库，对数据库进行操作和调试：</p>
            <ul>
              <li><strong>gsql</strong>：openGauss 提供的在命令行下运行的数据库连接工具，在 openEuler/CentOS 操作系统上进行连接、调试数据库，需要掌握 Linux 系统的基本操作和系统命令。</li>
              <li><strong>Data Studio</strong>：openGauss 1.0.1 版本推出的、Windows 下访问 openGauss 的客户端工具，类似 Navicat。需要 JDK 环境（JDK 1.8 及以上）。</li>
            </ul>
            <p><em>课件图示：Data Studio 连接数据库。</em></p>
            <div class="callout tip">
              <p class="callout-h">附</p>
              <p>也可以在自己的电脑上安装 openGauss，需要 Linux 环境，熟悉 Linux 相关指令。附：采用 VMware 虚拟机 + CentOS + Xshell + openGauss 3.1.0。参见帮助文档：《openGauss 环境安装.doc》。</p>
            </div>`,
        },
      ],
    },
  ],
};

export default lab;

/* 第 1 章 绪论 —— 依据课件「第一章+绪论」（35 页）整理 */
import type { GenChapter } from '../types';

const ch1: GenChapter = {
  id: 'deck1',
  no: '第1章',
  title: '绪论',
  subtitle: '课程定位 · 软件工具与环境 · 一个网站的开发流程 · 课程项目',
  lede:
    '<p>本课程回答一个很实际的问题：<strong>如何做一个系统</strong>。课件开篇列举了软件工程、面向对象、软件测试、需求分析、UML 等方向，但强调「无论什么理论或者工具，都是拿来用的」——课程以一条完整的网站开发链路为主线，把工具与环境放在真实的项目里讲。</p>',
  toc: [
    { id: 'sec-ste1-what', text: '1.1 课程定位：从理论到可用系统', level: 2 },
    { id: 'sec-ste1-tools', text: '1.2 软件工具与环境', level: 2 },
    { id: 'sec-ste1-flow', text: '1.3 网站开发的一般流程', level: 2 },
    { id: 'sec-ste1-project', text: '1.4 课程项目与学习方式', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ste1-what',
      heading: '1.1 课程定位：从理论到可用系统',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课件用教师自己的项目经历说明课程的取向：2001 年的第一个项目「石油专用管二维漏磁探伤检测系统」，开发工具为 VC6.0，特点是在专用硬件接口卡上实现访问和编程。项目做出来靠的不只是语言语法，而是<strong>工具链、平台接口与工程流程</strong>的组合。</p>
            <p>因此本课程不孤立地讲「软件工程理论」，而是围绕一个可运行的网站系统，把需求、设计、编码、数据库、部署、测试串起来：理论为实践服务，工具为问题服务。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste1-tools',
      heading: '1.2 软件工具与环境',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>软件工具</strong>是辅助软件开发、维护、管理的程序，如编辑器、编译器、调试器、版本控制、建模工具、测试工具；<strong>软件环境</strong>是这些工具与运行支撑（操作系统、Web 服务器、数据库、运行时框架）构成的整体。工具与环境的选择直接影响开发效率与系统质量。</p>
            <p>课程涉及的典型环境是 <strong>Windows + IIS + SQL Server + .NET（ASP.NET）</strong>：用 Visual Studio 作为集成开发环境，用 ASP.NET 写页面与后台逻辑，用 SQL Server 存数据，用 IIS 发布站点。掌握这套环境，就具备了开发一个中小型动态网站的基本能力。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste1-flow',
      heading: '1.3 网站开发的一般流程',
      blocks: [
        {
          type: 'html',
          html: `
            <p>一个网站从立项到上线通常经历：<strong>网站立项</strong>（明确目标与可行性）→ <strong>需求调研</strong>（用户需求、市场需求）→ <strong>需求分析</strong>（形成网站需求描述）→ <strong>技术分析</strong>（服务器配置、编程语言、技术方案）→ <strong>网站页面设计</strong>（页面方案）→ <strong>网站制作实现</strong>→ <strong>网站测试</strong> → <strong>站点发布</strong> → <strong>持续评价改进</strong>（页面设计更新、实现方式更新、网站需求更新、技术方案更新）。</p>
            <p>这个流程不是一次性的直线，上线后的评价会反馈到需求、设计、技术与实现，形成迭代。课程后续章节正是按这个流程展开：需求分析与模块设计、开始实战、简单 CMS、积木式前台页面。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste1-project',
      heading: '1.4 课程项目与学习方式',
      blocks: [
        {
          type: 'html',
          html: `
            <p>课程以一个<strong>内容管理系统（CMS）</strong>为主线项目：后台能管理栏目与内容，前台能按栏目展示文章列表与详情。学习方式是「边学边做」——每讲一个工具或技术点，就落到项目的某个模块上，最后形成可运行的完整站点。</p>
            <p>课件强调动手：看代码、抄代码、改代码、调试、部署。软件工具与环境的熟练度只能在真实操作中获得。</p>`,
        },
      ],
    },
  ],
};

export default ch1;

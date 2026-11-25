/** 软件工具与环境课程数据：六章课件精讲（试题未收录，无在线练习） */
import type { GenPaper } from '../types';
import ch1 from './ch1';
import ch2 from './ch2';
import ch3 from './ch3';
import ch4 from './ch4';
import ch5 from './ch5';
import ch6 from './ch6';

const stePapers: GenPaper[] = [];

export const steSpec = {
  key: 'ste',
  base: '/ste',
  name: '软件工具与环境',
  tip: '软件工具与环境 · 六章课件精讲',
  unit: '章' as const,
  chapters: [ch1, ch2, ch3, ch4, ch5, ch6],
  papers: stePapers,
  home: {
    lede: `<p>依据课程组课件（石雷老师《软件工具与环境》六章 PDF）整理的课程精讲：从 HTML、CSS、JavaScript 的前端基础，
    到需求分析与模块设计、三层架构实战、简单 CMS 与积木式前台页面——一条完整的网站开发链路。</p>`,
    cards: [
      {
        title: '课程信息',
        html: `<p>课程以「如何做一个系统」为主线，技术栈为 <code>Windows + IIS + SQL Server + ASP.NET</code>，
        开发工具为 Visual Studio。课件按六章组织：绪论、从 HTML 说起、需求分析和模块设计、开始实战、我的简单 CMS、积木式的前台页面。</p>`,
      },
      {
        title: '资料构成',
        html: `<p>站点整理自 <strong>6 章课件</strong>与课程大作业材料。课件中大量代码与界面以截图呈现，页面按课件文字与结构整理，
        代码要点以文字说明保留。本课程无期末试卷，故不设在线练习。</p>`,
      },
    ],
    blurbs: {
      deck1: '课程定位：从理论到可用系统；软件工具与环境的概念；网站开发的一般流程（立项→需求→技术→设计→实现→测试→发布→改进）；课程项目。',
      deck2: 'HTML 基础与高级应用（表格、表单、HTML5 语义标签）；CSS 选择器、盒模型、层叠优先级与布局；JavaScript 与服务器端语言的分工。',
      deck3: '需求调研与需求描述；总体设计（技术方案、模块划分、页面方案）；数据库设计（实体、关系、一对多/多对多、CMS 表结构）。',
      deck4: '三层架构（表示层/业务逻辑层/数据访问层）与高内聚低耦合；母版页与内容页；用户控件；页面到数据库的调用链与参数化查询。',
      deck5: '后台整体框架（登录、母版页、权限）；可任意扩充的栏目类别（ParentID 树）；可任意扩充的栏目内容与字段扩展。',
      deck6: '前台整体结构（首页/列表页/内容页/辅助页面）；母版页 + 内容页 + 区块控件的详细结构；导航菜单、文章列表、分页等用户控件。',
    },
  },
};

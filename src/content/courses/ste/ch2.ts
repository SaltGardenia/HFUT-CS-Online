/* 第 2 章 从 HTML 说起 —— 依据课件「第二章+从HTML说起」（30 页）整理 */
import type { GenChapter } from '../types';

const ch2: GenChapter = {
  id: 'deck2',
  no: '第2章',
  title: '从 HTML 说起',
  subtitle: 'HTML 基础与高级应用 · 层叠样式表 CSS · JavaScript 与服务器端语言',
  lede:
    '<p>Web 前端的三块基石是结构、表现与行为：<strong>HTML</strong> 描述内容结构，<strong>CSS</strong> 控制外观，<strong>JavaScript</strong> 负责交互；再加上服务器端语言，才构成一个完整的动态网站。本章从 HTML 的基本概念讲起，依次介绍 HTML 标记、CSS 选择器与盒模型、JavaScript 与服务器端脚本的分工。</p>',
  toc: [
    { id: 'sec-ste2-html', text: '2.1 HTML 基础', level: 2 },
    { id: 'sec-ste2-adv', text: '2.2 HTML 高级应用', level: 2 },
    { id: 'sec-ste2-css', text: '2.3 层叠样式表 CSS', level: 2 },
    { id: 'sec-ste2-js', text: '2.4 JavaScript 与服务器端语言', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ste2-html',
      heading: '2.1 HTML 基础',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>超文本</strong>是一种信息管理方式，本质上是一种非线性的文档组织形式，即通过超链接把不同空间的文字信息组织在一起的网状文本；<strong>超媒体</strong>是超文本 + 多媒体。<strong>HTML</strong>（Hyper Text Markup Language）是一种国际化标准语言，用于在 Web 上发布超文本信息，是基于 <strong>SGML</strong>（Standard Generalized Markup Language）的公开资源描述格式。</p>
            <p>HTML 文档由标记（标签）构成，基本结构为 <code>&lt;html&gt;</code> 根元素、<code>&lt;head&gt;</code> 头部（标题、字符集、样式与脚本引用）与 <code>&lt;body&gt;</code> 主体（可见内容）。常用标记包括标题 <code>h1～h6</code>、段落 <code>p</code>、列表 <code>ul/ol/li</code>、表格 <code>table/tr/td</code>、链接 <code>a</code>、图像 <code>img</code>、表单 <code>form/input/select/textarea</code> 以及布局用的 <code>div/span</code>。</p>
            <p>编写 HTML 的要点：标签成对闭合、属性值加引号、语义化使用标签、结构与样式分离。浏览器对错误的 HTML 有容错，但规范的文档更易维护、更利于 SEO 与无障碍访问。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste2-adv',
      heading: '2.2 HTML 高级应用',
      blocks: [
        {
          type: 'html',
          html: `
            <p>高级应用主要包括：<strong>表格布局与数据表</strong>（<code>thead/tbody</code>、<code>colspan/rowspan</code> 合并单元格）；<strong>表单与输入控件</strong>（文本框、密码框、单选/复选、下拉框、文件上传、隐藏域，以及 <code>GET/POST</code> 提交方式）；<strong>框架与内嵌页面</strong>（<code>iframe</code>）；<strong>多媒体</strong>（<code>audio</code>、<code>video</code>）；<strong>HTML5 语义标签</strong>（<code>header</code>、<code>nav</code>、<code>article</code>、<code>section</code>、<code>footer</code>）。</p>
            <p>表单是动态网站的关键：用户在浏览器填写的数据通过表单提交到服务器，服务器端程序读取后处理（查询数据库、写入记录），再把结果页面返回浏览器。理解表单字段的 <code>name</code> 与服务器端取值的对应关系，是从静态页面走向动态网站的第一步。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste2-css',
      heading: '2.3 层叠样式表 CSS',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>CSS</strong>（Cascading Style Sheets）把页面的表现从结构中分离出来。引入方式有三种：行内样式（<code>style</code> 属性）、内部样式表（<code>&lt;style&gt;</code>）、外部样式表（<code>&lt;link&gt;</code> 引用 <code>.css</code> 文件），工程上推荐外部样式表以便复用与缓存。</p>
            <p>核心概念：<strong>选择器</strong>（标签、类、ID、后代、群组、伪类）、<strong>盒模型</strong>（内容、内边距 padding、边框 border、外边距 margin）、<strong>层叠与优先级</strong>（行内 &gt; ID &gt; 类 &gt; 标签，同优先级后定义覆盖先定义，<code>!important</code> 最高）、<strong>定位与浮动</strong>（static/relative/absolute/fixed，float 与清除浮动）、<strong>响应式布局</strong>（媒体查询、弹性布局 flex、网格 grid）。</p>
            <p>课件以实际页面为例演示如何用 CSS 控制字体、颜色、间距、边框、背景与布局，把「能看」的 HTML 变成「好看」的页面。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste2-js',
      heading: '2.4 JavaScript 与服务器端语言',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>JavaScript</strong> 运行在浏览器端，负责行为与交互：DOM 操作（查找、修改元素）、事件处理（点击、输入、提交）、表单校验、异步请求（AJAX）。它让页面不必整页刷新就能与服务器交换数据，是现代 Web 应用的基础。</p>
            <p><strong>服务器端语言</strong>运行在 Web 服务器上，负责业务逻辑与数据访问。本课程以 ASP.NET（C#）为例：页面（.aspx）由服务器解析执行，生成 HTML 返回浏览器；服务器端可以读取表单、访问数据库、维护会话（Session）、读写 Cookie。浏览器端与服务器端的分工是：前者负责展示与交互，后者负责数据与规则，二者通过 HTTP 请求/响应与 AJAX 通信。</p>
            <p>三者的关系可以概括为：HTML 是骨架，CSS 是皮肤，JavaScript 是肌肉，服务器端语言是大脑与记忆。</p>`,
        },
      ],
    },
  ],
};

export default ch2;

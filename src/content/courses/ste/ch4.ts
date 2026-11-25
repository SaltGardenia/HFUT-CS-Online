/* 第 4 章 开始实战 —— 依据课件「第四章开始实战」（21 页）整理 */
import type { GenChapter } from '../types';

const ch4: GenChapter = {
  id: 'deck4',
  no: '第4章',
  title: '开始实战',
  subtitle: '三层架构 · 母版页和内容页 · 用户控件 · 从页面到数据库',
  lede:
    '<p>从这一章开始真正写代码。课件用「三层架构」组织项目：表示层负责界面、业务逻辑层负责规则、数据访问层负责数据库操作；再用<strong>母版页</strong>统一站点外观、用<strong>用户控件</strong>复用页面片段，最后打通「页面 → 业务 → 数据」的调用链。</p>',
  toc: [
    { id: 'sec-ste4-layer', text: '4.1 三层架构', level: 2 },
    { id: 'sec-ste4-master', text: '4.2 母版页和内容页', level: 2 },
    { id: 'sec-ste4-control', text: '4.3 用户控件', level: 2 },
    { id: 'sec-ste4-db', text: '4.4 从页面到数据库', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ste4-layer',
      heading: '4.1 三层架构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>三层架构的目的是实现<strong>高内聚、低耦合</strong>：</p>
            <ul>
              <li><strong>表示层</strong>：展现给用户的界面，即使用系统时的所见所得；</li>
              <li><strong>业务逻辑层</strong>：针对具体问题的逻辑判断、处理、执行等操作；</li>
              <li><strong>数据访问层</strong>：直接操作数据库，针对数据的增删改查等。</li>
            </ul>
            <p><strong>内聚</strong>是模块内部各成分之间聚集、关联的程度，越高越好；<strong>耦合</strong>是模块之间的联系，越低越好。分层的好处是：界面变化不影响业务与数据，数据库更换只改数据访问层，业务规则集中在一处便于维护与测试。代价是代码量增加、调用链变长，对小项目可能显得繁琐。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste4-master',
      heading: '4.2 母版页和内容页',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>母版页</strong>（Master Page）定义站点的公共外观：页头、导航、页脚、侧栏，用 <code>ContentPlaceHolder</code> 留出内容占位。<strong>内容页</strong>（Content Page）只填占位区域的内容，运行时与母版页合并输出。</p>
            <p>好处是：站点风格统一、公共部分只维护一份、新增页面只需写差异内容。母版页可以嵌套（母版页套母版页），适合「后台一套外观、前台一套外观」的结构。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste4-control',
      heading: '4.3 用户控件',
      blocks: [
        {
          type: 'html',
          html: `
            <p><strong>用户控件</strong>（User Control，<code>.ascx</code>）是可复用的页面片段，有自己的界面与代码，可以像控件一样拖到页面或母版页中使用。适合封装导航条、登录框、文章列表、分页条、友情链接等重复出现的区块。</p>
            <p>母版页与用户控件的区别：母版页解决「整站外观统一」，用户控件解决「局部片段复用」；两者可以组合使用，例如母版页的侧栏里放一个「最新文章」用户控件。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste4-db',
      heading: '4.4 从页面到数据库',
      blocks: [
        {
          type: 'html',
          html: `
            <p>打通「页面 → 数据库」的典型链路是：页面控件收集输入 → 表示层调用业务逻辑层 → 业务逻辑层校验与处理 → 数据访问层执行 SQL（<code>SELECT/INSERT/UPDATE/DELETE</code>）→ 结果逐层返回并绑定到页面控件显示。</p>
            <p>实现要点：用<strong>连接字符串</strong>连接数据库；用 <code>SqlConnection</code>、<code>SqlCommand</code>、<code>SqlDataReader</code> 或 <code>DataSet/DataTable</code> 访问数据；<strong>参数化查询</strong>防 SQL 注入；用 <code>try/catch</code> 处理异常；连接与读取器用 <code>using</code> 及时释放。数据访问层把这些细节封装成方法（如 <code>GetArticlesByCategory(id)</code>），上层只关心「取到什么」，不关心「怎么取」。</p>`,
        },
      ],
    },
  ],
};

export default ch4;

/* 第 6 章 积木式的前台页面 —— 依据课件「第六章积木式的前台页面」（9 页）整理 */
import type { GenChapter } from '../types';

const ch6: GenChapter = {
  id: 'deck6',
  no: '第6章',
  title: '积木式的前台页面',
  subtitle: '整体结构 · 详细结构 · 几个重要用户控件',
  lede:
    '<p>前台页面像搭积木：把页面拆成若干可复用的区块（用户控件），按模板拼装。本章先给出前台的<strong>整体结构</strong>（首页、列表页、内容页与辅助页面），再讲<strong>详细结构</strong>（母版页 + 内容区 + 区块控件），最后介绍几个重要用户控件的实现思路。</p>',
  toc: [
    { id: 'sec-ste6-whole', text: '6.1 整体结构', level: 2 },
    { id: 'sec-ste6-detail', text: '6.2 详细结构', level: 2 },
    { id: 'sec-ste6-controls', text: '6.3 几个重要用户控件', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ste6-whole',
      heading: '6.1 整体结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>前台由<strong>三个主要页面</strong>构成：</p>
            <ul>
              <li><code>Index.aspx</code>：首页，展示推荐内容、各栏目最新文章；</li>
              <li><code>list1.aspx / list2.aspx / …</code>：列表页，按栏目分页展示文章摘要；</li>
              <li><code>content1.aspx / content2.aspx / …</code>：内容页，展示单篇文章全文。</li>
            </ul>
            <p>此外还有<strong>辅助页面</strong>，如 <code>guestbook.aspx</code>（留言板）等。页面命名按栏目区分，便于通过 URL 直观看出所处栏目；也可以用一个列表页/内容页配合查询参数（<code>list.aspx?cid=3</code>）减少文件数量，两种方式各有取舍。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste6-detail',
      heading: '6.2 详细结构',
      blocks: [
        {
          type: 'html',
          html: `
            <p>每个前台页面的详细结构是「<strong>母版页 + 内容页 + 区块控件</strong>」：母版页负责页头、导航、页脚与整体布局；内容页只写本页特有的内容；公共区块（导航菜单、最新文章、热门文章、友情链接、分页）做成用户控件插在母版页或内容页里。</p>
            <p>这样改一次导航，全站生效；改一个区块，所有引用它的页面同步更新。积木式的核心是<strong>边界清晰</strong>：每个控件只负责自己的数据与展示，页面负责组合，数据访问由三层架构统一提供。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste6-controls',
      heading: '6.3 几个重要用户控件',
      blocks: [
        {
          type: 'html',
          html: `
            <p>常见的重要用户控件：</p>
            <ul>
              <li><strong>导航菜单控件</strong>：读取栏目树，递归生成多级菜单，高亮当前栏目；</li>
              <li><strong>文章列表控件</strong>：按栏目、条数、排序方式取文章，输出标题、日期、摘要，支持「最新/热门/推荐」多种参数；</li>
              <li><strong>分页控件</strong>：根据总记录数与每页条数生成页码链接，处理首页、末页、跳转；</li>
              <li><strong>友情链接 / 底部信息控件</strong>：静态内容或简单数据绑定。</li>
            </ul>
            <p>控件的设计要点是<strong>参数化</strong>：同一个「文章列表控件」通过属性（栏目 ID、显示条数、是否显示摘要）适配不同位置，而不是为每个位置复制一份。这正是「积木」可以反复拼装的原因。</p>`,
        },
      ],
    },
  ],
};

export default ch6;

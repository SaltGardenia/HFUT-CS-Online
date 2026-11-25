/* 第 5 章 我的简单 CMS —— 依据课件「第五章我的简单CMS」（29 页）整理 */
import type { GenChapter } from '../types';

const ch5: GenChapter = {
  id: 'deck5',
  no: '第5章',
  title: '我的简单 CMS',
  subtitle: '后台整体框架 · 可任意扩充的栏目类别 · 可任意扩充的栏目内容',
  lede:
    '<p>本章把前面学的工具与架构拼成一个能用的<strong>内容管理系统</strong>（CMS）：先搭后台整体框架（登录、导航、母版页），再设计「可任意扩充」的栏目类别与栏目内容。所谓「可扩充」，是指栏目层级与内容字段都不写死在代码里，而是由数据库配置驱动。</p>',
  toc: [
    { id: 'sec-ste5-frame', text: '5.1 从后台的整体框架开始', level: 2 },
    { id: 'sec-ste5-category', text: '5.2 可任意扩充的栏目类别', level: 2 },
    { id: 'sec-ste5-content', text: '5.3 可任意扩充的栏目内容', level: 2 },
  ],
  sections: [
    {
      id: 'sec-ste5-frame',
      heading: '5.1 从后台的整体框架开始',
      blocks: [
        {
          type: 'html',
          html: `
            <p>后台框架包括：管理员登录与身份验证（Session 保存登录状态、未登录跳转登录页）、统一的后台母版页（顶部信息、左侧菜单、主内容区）、权限控制（不同角色可见不同菜单）、公共的用户控件（菜单、面包屑、分页）。</p>
            <p>先把框架搭好，后续每个功能模块只需在框架内新增页面与菜单项，避免每页重复写导航与校验。框架设计的关键是<strong>约定</strong>：目录约定、命名约定、权限约定——约定清晰，多人协作才不会乱。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste5-category',
      heading: '5.2 可任意扩充的栏目类别',
      blocks: [
        {
          type: 'html',
          html: `
            <p>栏目类别要支持无限层级：栏目表中设 <code>CategoryID</code>、<code>CategoryName</code>、<code>ParentID</code>、<code>OrderNo</code> 等字段，用 <code>ParentID</code> 指向父栏目形成树。读取时递归或一次性取出全部栏目在内存中组装成树，前台的导航与后台的栏目管理共用这棵树。</p>
            <p>这样新增栏目只需在后台录入，不必改代码、不必改数据库结构——这就是「可任意扩充」。删除栏目时要处理其子栏目与所属文章（级联删除或禁止删除），避免产生孤儿数据。</p>`,
        },
      ],
    },
    {
      id: 'sec-ste5-content',
      heading: '5.3 可任意扩充的栏目内容',
      blocks: [
        {
          type: 'html',
          html: `
            <p>栏目内容（文章）表包含 <code>ArticleID</code>、<code>Title</code>、<code>Content</code>、<code>CategoryID</code>、<code>Author</code>、<code>CreateTime</code>、<code>Status</code>（草稿/发布）、<code>Hits</code> 等字段。后台提供文章的增删改查、富文本编辑、图片上传、发布与下架；前台按栏目与状态筛选、分页展示。</p>
            <p>「可任意扩充」还可以体现在字段上：若不同栏目需要不同的内容字段（如新闻要来源、产品要价格），可用「扩展字段表」把字段名与值按行存储，或者为不同内容类型建不同的表。前者灵活但查询复杂，后者清晰但扩展需改表——工程上按变化频率选择。</p>`,
        },
      ],
    },
  ],
};

export default ch5;

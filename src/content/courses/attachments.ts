/** 大二下 6 门纯附件课程（课件 / 试题均未收录）：共用同一个工厂，只提供课程说明与附件概况 */
import type { CourseSpec } from './types';

interface AttachmentCourseInput {
  key: string;
  base: string;
  name: string;
  tip: string;
  lede: string;
  /** 概况卡片 */
  cards: { title: string; html: string }[];
}

function attachmentCourse(input: AttachmentCourseInput): CourseSpec {
  return {
    key: input.key,
    base: input.base,
    name: input.name,
    tip: input.tip,
    unit: '章',
    chapters: [],
    papers: [],
    home: {
      lede: input.lede,
      cards: input.cards,
      blurbs: {},
    },
  };
}

export const cgSpec = attachmentCourse({
  key: 'cg',
  base: '/cg',
  name: '计算机图形学',
  tip: '计算机图形学 · 课件与实验资料',
  lede: `<p>本课程的课件与实验材料整编在附件目录中：八讲课件 PDF（图形学的过去现在与未来、图形的表示与数据结构、基本图形生成算法、真实感图形绘制、消隐、二维变换、
  三维变换及三维观察、自由曲线和曲面），以及实验指导书、实验报告与实验三的示例源码。</p>`,
  cards: [
    {
      title: '资料位置',
      html: `<p>课件未放在「课件」类别，而是收在 <code>附件/PPT/</code> 下，共 <strong>8 讲</strong>；实验材料在 <code>附件/图形学实验/</code> 与
      <code>附件/实验/</code>，含实验指导书、实验报告与 VS2019 运行问题的解决方案。</p>`,
    },
    {
      title: '使用建议',
      html: `<p>按「附件」页的目录树展开 <code>PPT</code> 与「图形学实验」，可直接下载原 PDF 与文档；
      实验三的示例工程在 <code>试题/实验/</code> 下，含 OpenGL/GLUT 的课程示例源码。</p>`,
    },
  ],
});

export const smaSpec = attachmentCourse({
  key: 'sma',
  base: '/sma',
  name: '软件建模与分析',
  tip: '软件建模与分析 · 讲义资料',
  lede: `<p>本课程目前只收录一份讲义资料《软件建模 1.4》，课件与试题均未收录。</p>`,
  cards: [
    {
      title: '资料构成',
      html: `<p>附件目录下仅有 <strong>1 份文档</strong>（<code>软件建模1.4 (1).docx</code>）。
      课件与试题未收录，因此本站不设课程内容页与在线练习。</p>`,
    },
  ],
});

export const dmtSpec = attachmentCourse({
  key: 'dmt',
  base: '/dmt',
  name: '数字媒体技术',
  tip: '数字媒体技术 · 实验与大作业资料',
  lede: `<p>本课程收录实验手册、实验报告模板、调研报告模板与大作业素材，课件与试题均未收录。</p>`,
  cards: [
    {
      title: '资料构成',
      html: `<p>附件目录含：<strong>实验手册（2022 版）</strong>与实验报告模板、<strong>个人实验报告</strong>、
      <strong>调研报告</strong>（模板与个人报告）、<strong>大作业</strong>（作业说明与演示视频 <code>.mp4</code>）。</p>`,
    },
    {
      title: '使用建议',
      html: `<p>大作业的视频文件较大（<code>0001-0250.mp4</code>），可在附件页直接下载；
      实验与调研报告的模板可用于课程作业的格式参考。</p>`,
    },
  ],
});

export const npSpec = attachmentCourse({
  key: 'np',
  base: '/np',
  name: '网络程序设计',
  tip: '网络程序设计 · 实验与课程设计源码',
  lede: `<p>本课程收录网络程序设计的实验指导、实验报告与课程设计源码，课件与试题均未收录。</p>`,
  cards: [
    {
      title: '资料构成',
      html: `<p>附件目录为 <code>网络程序设计实验/</code>：<code>code/</code> 下是 <strong>WebApplication2</strong>、
      <strong>WebApplication3</strong> 两个工程源码，另有实验一、实验三的文档与实验报告图片。</p>`,
    },
    {
      title: '使用建议',
      html: `<p>源码工程可在附件页逐目录展开后下载；实验报告图片可作为报告排版的参考。</p>`,
    },
  ],
});

export const microSpec = attachmentCourse({
  key: 'micro',
  base: '/micro',
  name: '微机原理与接口技术',
  tip: '微机原理与接口技术 · 实验资料',
  lede: `<p>本课程收录四个实验的程序与实验报告，以及 Emu8086 仿真软件的说明，课件与试题均未收录。</p>`,
  cards: [
    {
      title: '资料构成',
      html: `<p>附件目录含：<strong>实验一 响铃程序</strong>、<strong>实验四 流水灯控制程序</strong> 等实验文档，
      <strong>Emu8086 仿真软件</strong>的使用说明，以及完整的微机原理实验报告。</p>`,
    },
  ],
});

export const hetSpec = attachmentCourse({
  key: 'het',
  base: '/het',
  name: '硬件工程师综合训练',
  tip: '硬件工程师综合训练 · 课程设计资料',
  lede: `<p>本课程收录硬件工程师综合训练的课程设计题目、注意事项与设计报告，课件与试题均未收录。</p>`,
  cards: [
    {
      title: '资料构成',
      html: `<p>附件目录含：<strong>2020 微机原理课程设计题目（合肥校区 2018 级）</strong>、<strong>课程设计注意事项</strong>，
      以及一份完整的<strong>硬件工程师综合训练设计报告</strong>。</p>`,
    },
  ],
});

/* 课程作业 —— 逐题转录自 课件/作业.pptx（1 页，7 道思考题） */
import type { BdDeck } from './types';

const deck1: BdDeck = {
  id: 'bd1',
  no: '第1讲',
  title: '课程作业：HDFS 与 MapReduce 思考题',
  subtitle: '课件《作业》共 1 页 · 7 道题（Hadoop 安全模式 / HDFS 设计局限 / 分区）',
  lede:
    '<p>课件《作业.pptx》仅 1 页，给出 7 道围绕 <strong>Hadoop / HDFS / MapReduce</strong> 的思考题，逐题转录如下。</p>',
  toc: [{ id: 'sec-bd1-questions', text: '作业题目（7 题）', level: 2 }],
  sections: [
    {
      id: 'sec-bd1-questions',
      heading: '作业题目（7 题）',
      blocks: [
        {
          type: 'html',
          html: `
            <ol>
              <li>如何解除 Hadoop 系统的安全模式？</li>
              <li>为什么 HDFS 不适合低延迟数据访问？</li>
              <li>为什么 HDFS 无法高效存储大量小文件？</li>
              <li>为什么 HDFS 不支持多用户写入及任意修改文件？</li>
              <li>HDFS 如何解决名称节点运行期间 EditLog 不断变大的问题？</li>
              <li>Map 任务为什么要进行分区操作，如何分区？</li>
              <li>MapReduce 中多个 Reduce 任务的结果会做进一步的处理么？为什么？</li>
            </ol>`,
        },
      ],
    },
  ],
};

export default deck1;

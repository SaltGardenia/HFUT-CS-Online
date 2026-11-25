import CourseShell from '../components/course/CourseShell';
import type { CourseConfig } from '../content/course-types';
import { LA_BASE } from './registry';
import { laChapters, laPapers, LA_KIND_LABEL, LA_SECTIONS } from '../content/la';

/** 线性代数课程配置：6 章课件精讲 + 4 份习题/期中试卷 + 附件 */
const config: CourseConfig = {
  name: '线性代数',
  base: LA_BASE,
  deckKey: 'la',
  tip: '线性代数 · 六章课件精讲与习题/试卷',
  source: '六章课件精讲 · 4 份习题/期中试卷在线练习',
  chapters: laChapters,
  papers: laPapers,
  storeKey: 'la-practice-progress-v1',
  kindLabel: LA_KIND_LABEL,
  tagSections: LA_SECTIONS,
  lede: `
    <p>依据课程课件（ch1～ch6 分章演示文稿与教材第一～五章）整理的课程讲义：
    从<strong>行列式</strong>与<strong>矩阵</strong>两种工具出发，依次讨论<strong>向量组、线性方程组、特征值与相似矩阵</strong>，
    最后进入<strong>二次型</strong>；另收录课外练习题与期中试卷的在线练习。</p>
  `,
  introCards: [
    {
      title: '课件范围',
      body: '课件按章编号：第 1 章行列式、第 2 章矩阵、第 3 章向量组、第 4 章线性方程组、第 5 章特征值与特征向量、第 6 章二次型。每章均可从导航栏直接进入，左侧目录可跳转到任意小节。',
    },
    {
      title: '资料构成',
      body: '讲义内容来自课件文件夹的旧版 PPT、附件中的新版 PDF 与教材章节 PDF，口径以课件与教材为准；练习来自试题文件夹的课外练习题与期中试卷，习题答案参照附件参考答案整理。',
    },
  ],
  chapterBlurbs: {
    ch1: '二阶/三阶行列式、排列与逆序数、n 阶行列式定义；行列式的性质与按行展开；克拉默法则。',
    ch2: '矩阵的定义、加法/数乘/乘法/转置；逆矩阵与伴随矩阵；分块矩阵；初等变换与矩阵的秩。',
    ch3: '向量的线性表示、线性相关与线性无关；秩与极大无关组；向量空间、内积与 Schmidt 正交化。',
    ch4: '齐次方程组的基础解系与通解；非齐次方程组的判定定理与解结构；矩阵方程 AX = B。',
    ch5: '特征值与特征向量的求法；相似矩阵与对角化条件；实对称矩阵的正交对角化。',
    ch6: '二次型的矩阵表示与合同；正交变换/配方法化标准形；正定性的判定与顺序主子式。',
  },
  suggestions: ['行列式', '逆矩阵', '极大无关组', '基础解系', '特征值', '正定'],
};

export default function LaCourse() {
  return <CourseShell config={config} />;
}

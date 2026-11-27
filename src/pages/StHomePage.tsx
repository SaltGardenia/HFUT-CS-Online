import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ST_BASE } from '../courses/registry';
import { stChapters, stPapers } from '../content/st';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../components/icons';
import { BookCards } from '../components/practice/books';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-st-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-st-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-st-practice', text: '3. 在线练习 · 试卷', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  deck1: '课程导学、软件危机与软件生期、软件测试的意义、什么是软件测试、应该怎样认识软件测试、软件测试发展的历史回顾。',
  deck2: '测试的生命周期、测试步骤（单元 → 集成 → 确认 → 系统测试）、静态与动态方法、黑盒与白盒测试、回归测试方法、人工测试与自动测试。',
  deck3: '等价类划分、因果图、正交实验设计法、边值分析、判定表驱动测试、功能测试——黑盒测试的六种设计方法。',
  deck4: '程序结构分析（控制流图/数据流分析/信息流分析）、逻辑覆盖与最少测试用例数计算、域测试、符号测试、路径分析、程序插装、程序变异（强/弱变异）。',
  deck5: '集成的必要性与四种组装问题、驱动模块与桩模块、一次性/自顶向下/自底向上/混合/主干/层次/客户-服务器/分布式/高频集成、基于调用图的集成。',
  deck6: '安装、兼容性、安全性、恢复、性能、负载/压力/容量测试与检查表（表 6.1～6.5）、α/β 测试、文档测试、界面测试（表 6.6、6.7）。',
  deck7: '测试需求分析和计划、测试环境配置、测试用例设计与编写、测试实施与执行、测试总结与用例库维护、缺陷管理（描述/生命周期/统计分析）、CMM/CMMI、测试成熟度、测试度量。',
  deck9: '软件评审方法（概述、项目评审应用举例、定义、国际标准与 CMMI 要求）、软件评审的作用、评审的实施（正式评审/需求/设计/代码评审）、如何做好软件评审。',
  deck10: '软件质量问题的挑战、软件错误类型分析（表 10.1 统计）、撒播模型与回归模型、软件质量特性（三种质量、6 特性 30 子特性）、质量管理六大过程、质量因素和质量特性（表 10.2/10.3）、质量保证的任务、程序排错。',
};

export default function StHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${ST_BASE}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(HOME_TOC, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollSpy(pageRef, []);

  // 首次挂载处理 ?s= 深链定位
  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('s');
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page" ref={pageRef}>
      <h1>软件测试</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（9 章测试课程 PPT）整理的课程精讲：
        九章内容紧扣课件逐节展开，另有 <strong>1 份试卷的在线练习</strong>（原卷附答案）。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-st-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              课程代码 0529700X，2 学分必修。课件按章展开：绪论、软件测试策略、黑盒测试、白盒测试、集成测试、
              系统测试、测试组织和管理、软件评审、软件质量与软件质量管理（原课程无第 8 章文件）。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>9 份课件</strong>（第 1～7、9、10 章按章 PPT）与 <strong>1 份试卷</strong>
              （2019～2020 学年第二学期合肥校区 A 卷，原卷附答案）；另附作业讲解、实验报告等附件资料。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-st-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {stChapters.map((c) => (
            <Link key={c.id} className="card" to={`${ST_BASE}/deck/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-st-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 试卷</span>
        </h2>
        <BookCards base={ST_BASE} course="st" />
        <nav className="ext-cards" aria-label="试卷列表">
          {stPapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${ST_BASE}/practice/${p.id}`}>
              <span className="ext-card-icon">
                <IconFileText size={18} />
              </span>
              <span className="ext-card-body">
                <span className="ext-card-title">{p.title}</span>
                <span className="ext-card-desc">
                  {p.questions.length} 题（填空 {p.questions.filter((q) => q.kind === 'fill').length} · 解答 {p.questions.filter((q) => q.kind === 'essay').length}） · 参考答案：{p.answerSource}
                </span>
              </span>
              <IconArrowRight size={15} className="ext-card-arrow" />
            </Link>
          ))}
        </nav>
        <div className="card-grid deck-map">
          <Link className="card" to={`${ST_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

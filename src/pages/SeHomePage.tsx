import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SE_BASE } from '../courses/registry';
import { seChapters, sePapers } from '../content/se';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-se-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-se-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-se-practice', text: '3. 在线练习 · 试卷', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  deck1: '软件危机与软件工程定义、软件生命周期三时期八阶段、九种软件过程模型（瀑布/原型/增量/螺旋/喷泉/RUP/CBSE/敏捷/微软过程）。',
  deck2: '可行性研究的任务与 8 步过程、系统流程图、数据流图、数据字典 4 类词条、成本/效益分析与投资回收期。',
  deck3: '需求分析的任务与 8 项需求、结构化分析方法、E-R 图与数据规范化、状态转换图、层次方框图/Warnier/IPO、需求验证。',
  deck4: '形式化说明技术：有限状态机（保险箱与电梯的状态表）、Petri 网、Z 语言的基本记法。',
  deck5: '总体设计的过程与九原则、模块化与耦合/内聚、7 条启发规则、层次图与 HIPO/结构图、变换分析与事务分析。',
  deck6: '结构程序设计、人机界面设计、文件与数据库映射、流程图/N-S 图/PAD 图、判定表与判定树、PDL、Jackson 设计方法、McCabe 复杂度。',
  deck7: '编码风格、测试基础与准则、单元/集成/确认测试、白盒（逻辑覆盖、基本路径、条件测试、循环测试）、黑盒（等价划分、边界值）、调试与可靠性。',
  deck8: '四类维护、结构化与非结构化维护、维护过程与记录、可维护性五因素、预防性维护与软件再工程。',
  deck9: '面向对象基本概念（对象/类/继承/消息）、UML 的 5 类事物与 14 种图、对象模型类图、动态模型与功能模型（用例图）。',
  deck10: '面向对象分析过程、ATM 系统需求陈述、确定类与关联、划分主题、确定属性与服务、建立动态模型与功能模型。',
  deck11: '面向对象设计准则与启发规则、软件重用三层次、系统分解、问题域/人机交互/任务管理/数据管理四子系统、设计关联与优化。',
  deck12: '面向对象语言的选择与技术特点、提高可重用性/可扩充性/健壮性的程序设计风格、面向对象测试策略与测试用例设计（随机/划分/基于故障）。',
  deck13: '估算软件规模（LOC/功能点）、工作量估算（静态单变量/动态多变量/COCOMO2）、Gantt 图与工程网络、关键路径与机动时间、人员组织三种方式、质量保证与配置管理、CMM 五级。',
  cd: '课程设计示范报告「网上购物系统」：问题定义、可行性研究、需求分析（用例/ER 图）、总体设计、详细设计（用例规约/类图/时序图/界面）、测试计划与总结。',
};

export default function SeHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${SE_BASE}/?s=${id}`, { replace: true });
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
      <h1>软件工程</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（张海藩《软件工程导论（第 6 版）》13 章 PPT + 课程设计示范）整理的课程精讲：
        十三章内容紧扣课件逐节展开，另附课程设计示范报告（网上购物系统），以及 <strong>2 份试卷的在线练习</strong>。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-se-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              课件为张海藩、牟永敏《软件工程导论（第 6 版）》（清华大学出版社）配套讲义，第 1～13 章按章展开；
              课程设计示范报告为「软件工程——网上购物系统」（计算机科学与技术 18-2 班，2021-04-26）。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>14 份课件</strong>（第 1～13 章按章 PPT + 课程设计示范报告）与 <strong>2 份试卷</strong>
              （2019～2020 学年第二学期期末 A 卷附客观题标准答案；2026 年随堂测试原卷未附答案，答案均由本站整理核对）。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-se-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {seChapters.map((c) => (
            <Link key={c.id} className="card" to={`${SE_BASE}/deck/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-se-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 试卷</span>
        </h2>
        <nav className="ext-cards" aria-label="试卷列表">
          {sePapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${SE_BASE}/practice/${p.id}`}>
              <span className="ext-card-icon">
                <IconFileText size={18} />
              </span>
              <span className="ext-card-body">
                <span className="ext-card-title">{p.title}</span>
                <span className="ext-card-desc">
                  {p.questions.length} 题（选择 {p.questions.filter((q) => q.kind === 'single' || q.kind === 'multi').length} · 判断 {p.questions.filter((q) => q.kind === 'judge').length} · 填空 {p.questions.filter((q) => q.kind === 'fill').length} · 解答 {p.questions.filter((q) => q.kind === 'essay').length}） · 参考答案：{p.answerSource}
                </span>
              </span>
              <IconArrowRight size={15} className="ext-card-arrow" />
            </Link>
          ))}
        </nav>
        <div className="card-grid deck-map">
          <Link className="card" to={`${SE_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

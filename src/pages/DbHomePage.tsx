import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DB_BASE } from '../courses/registry';
import { dbChapters, dbPapers } from '../content/db';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-db-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-db-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-db-practice', text: '3. 在线练习 · 历年试卷', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  ch1: '四个基本概念、数据管理技术三阶段、两类数据模型与 E-R 图、三级模式结构与二级映像。',
  ch2: '关系的形式化定义 R(U,D,DOM,F)、候选码与三类关系、三类完整性约束、关系代数（并交差、选择投影连接除）。',
  ch3: 'SQL 概述、数据定义（架构/基本表/索引）、数据查询（连接/嵌套/集合/派生表）、数据更新与视图。',
  ch4: '安全性概述与四标准、用户标识与存取控制（DAC/MAC）、GRANT/REVOKE、角色、视图机制、审计与加密。',
  ch5: '实体/参照/用户定义的完整性、CONSTRAINT 命名字句、断言与触发器。',
  ch6: '规范化要解决的问题、函数依赖与 1NF～BCNF/4NF、Armstrong 公理与闭包、模式分解的等价标准。',
  ch7: '数据库设计六阶段、需求分析与数据字典、概念设计（E-R 图与视图集成）、逻辑/物理设计、实施与维护。',
  ch8: '嵌入式 SQL（通信区/主变量/游标/动态 SQL）、过程化 SQL（T-SQL 与 PL/SQL）、存储过程与函数、事务处理。',
  ch9: '查询处理四阶段、选择与连接操作的算法示例、查询优化的必要性（三策略对比）、代数优化变换规则与物理优化。',
  lab: '实验环境搭建：MySQL 下载部署与 Navicat 连接、openGauss 3.1.1 部署（Taishan/openEuler）与 gsql、Data Studio 客户端。',
};

export default function DbHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${DB_BASE}/?s=${id}`, { replace: true });
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
      <h1>数据库系统</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（沈明玉老师，PPT-2022 九章 + 实验环境资料）整理的课程精讲：
        九章内容紧扣课件逐节展开，另附实验环境搭建（MySQL / openGauss），以及 <strong>5 份历年试卷的在线练习</strong>。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-db-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              命题教师沈明玉、教研室主任欧阳一鸣。课件为 PPT-2022 版九章讲义；实验环境两套——MySQL（Navicat 客户端）与
              openGauss 3.1.1（Taishan 服务器 + openEuler，gsql / Data Studio 客户端）；考试为闭卷。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>10 份课件</strong>（第 1～9 章按章 PPT + 学生版 1.1 概述并入第 1 章 +
              实验环境搭建两份 PPT）与 <strong>5 份试卷</strong>（2015-2016 与 2022-2023 A 卷为扫描件，
              2019-2020 两卷为 PDF，2023-2024 B 卷为 Word）。原卷带手写作答，参考答案均由本站整理。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-db-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {dbChapters.map((c) => (
            <Link key={c.id} className="card" to={`${DB_BASE}/chapter/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-db-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 历年试卷</span>
        </h2>
        <nav className="ext-cards" aria-label="试卷列表">
          {dbPapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${DB_BASE}/practice/${p.id}`}>
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
          <Link className="card" to={`${DB_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

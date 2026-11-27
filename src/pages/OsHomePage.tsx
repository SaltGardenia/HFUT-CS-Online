import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OS_BASE } from '../courses/registry';
import { osChapters, osPapers } from '../content/os';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-os-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-os-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-os-practice', text: '3. 在线练习 · 历年试卷', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  ch1: '什么是操作系统：目标与作用、发展历程（批处理/分时/实时）、四大基本特征、五大功能与四种结构。',
  ch2: '全课核心章：进程概念与状态转换、进程控制、信号量与 PV 原语、经典同步问题、进程通信与线程。',
  ch3: '进程调度专题（三级调度、FCFS/SJF/FPF/高响应比/RR/多级反馈队列、实时调度）与死锁专题（四个必要条件、预防/避免/检测解除）。',
  ch4: '装入链接、连续/分页/分段/段页式分配、虚拟存储器与请求分页，页面置换算法与快表、两级页表。',
  ch5: 'I/O 系统结构与控制方式、缓冲管理、设备分配（设备独立性、SPOOLing）、磁盘访问时间与调度算法。',
  ch6: '文件逻辑/物理结构、外存分配（FAT、UNIX 混合索引）、目录管理与索引结点、存储空间管理与文件共享。',
  ch7: '命令接口、Shell 与程序接口（系统调用）：系统调用与函数调用的区别、陷入机构处理过程。',
  ch8: '复习课件《操作系统原理大题讲解》七类大题逐题演算：地址变换、可变分区、页面置换、磁盘调度、处理机调度、银行家算法、同步互斥。',
};

export default function OsHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${OS_BASE}/?s=${id}`, { replace: true });
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
      <h1>操作系统</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（田卫东老师等，合肥工业大学操作系统课程组）整理的课程精讲：
        七章内容紧扣课件逐节展开，另附复习课件《操作系统原理大题讲解》的七类大题演算，以及 <strong>4 份历年试卷的在线练习</strong>。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-os-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              任课教师田卫东、罗月童。有签到与课堂测试；实验只能在机房完成（每人一个 git 账号，按指导书完成）；
              课设为抢题制；考试为纸质闭卷——往年真题参考价值高，建议复习。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>8 份课件</strong>（第 1～7 章按章 PPT + 大题讲解复习课件）与 <strong>5 份试卷</strong>
              （2 份扫描件 + 2 份带答案 Word 卷 + 1 份 2014 年手写批注卷）。2014 年原卷含水印与学生手写批注，未数字化。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-os-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {osChapters.map((c) => (
            <Link key={c.id} className="card" to={`${OS_BASE}/chapter/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-os-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 历年试卷</span>
        </h2>
        <nav className="ext-cards" aria-label="试卷列表">
          {osPapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${OS_BASE}/practice/${p.id}`}>
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
          <Link className="card" to={`${OS_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

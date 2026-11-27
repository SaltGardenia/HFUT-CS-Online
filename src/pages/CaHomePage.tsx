import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CA_BASE } from '../courses/registry';
import { caChapters, caPapers } from '../content/ca';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';
import { IconArrowRight, IconFileText } from '../components/icons';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-ca-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-ca-chapters', text: '2. 讲次目录', level: 2 as const },
  { id: 'sec-ca-practice', text: '3. 在线练习 · 试题', level: 2 as const },
];

/** 各讲一句话简介（来自各讲 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  ch1: '层次结构与系统结构定义（软硬件界面 = 指令集）、冯氏/Flynn 分类、Amdahl 与 CPU 性能公式、局部性原理、并行性三途径。',
  ch2: '性能指什么（响应时间/吞吐率）、CPU Time 铁律（IC × CPI × 时钟周期）、MIPS、基准测试与均值、Amdahl 定律。',
  ch3: '冯·诺依曼模型与 ISA 五个方面：R/I/J 指令格式、四种操作数模型、MIPS 寄存器与寻址模式、数据类型、流程控制。',
  ch4: '指令五步处理与单周期数据通路：R/I 型 ALU、LW/SW、J/BEQ 的通路差异，控制信号表，时延分析（LW 600 ps 最长）。',
  ch5: '洗衣店类比三结论、吞吐率与锁存器开销公式、MIPS 五级流水划分、流水线控制，停顿的四种原因与相关分类。',
  ch6: '真相关冒险条件（距离 ≤ 3）、暂停检测逻辑、数据前推与优先级、LW→use 仍差一拍，控制相关与分支处理三路线。',
  ch7: 'ILP 与 CPI 分解、程序顺序/数据流/异常行为，循环展开与指令调度：每元素 10→6 拍，展开 4 次到 3.5 拍。',
  ch8: '动态调度与乱序执行、精确异常、Tomasulo（保留站/CDB/三阶段）、分支预测（BHT 1 位/2 位、BTB）、前瞻执行与 ROB。',
  ch9: '理想存储器与现实冲突、SRAM/DRAM 对比、局部性原理、存储层次金字塔、访存延迟递推 T=t+m·T。',
  ch10: 'cache 五问：地址三段划分与三种映射、相联度权衡、替换（LRU/OPT/set thrashing）、写回/写直达与写分配、多级缓存、3C 缺失。',
  ch11: '减少冲突缺失四法（victim/hash/伪相联/skewed）、软件优化（loop interchange/blocking/结构拆分）、MLP 感知替换、MSHR、共享缓存 QoS。',
  ch12: 'DRAM 组织（Row Buffer、Channel/DIMM/Rank/Chip/Bank）、VM 的好处与四个核心问题、页错误与地址转换、TLB、同名异物/异名同物。',
  ch13: '功耗墙与多核必然、SMT 与超线程公式、并行程序与 Amdahl、强/弱可扩展性，x=x+1 引出缓存一致性。',
  ch14: '总线侦听协议（写无效 vs 写更新）、MESI 四状态与全部转换规则、目录协议（presence bits）及其扩展性问题。',
};

export default function CaHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${CA_BASE}/?s=${id}`, { replace: true });
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
      <h1>计算机体系结构</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据李建华老师课程组课件（slides adapted from CA course of wisc / princeton / mit / berkeley 等）整理的课程精讲：
        收录<strong>第 1～14 讲</strong>全部课件内容（第 1 讲据教材第一章讲义 PDF 整理），以及
        <strong>3 份试题</strong>的在线练习——课堂测试、2019 级期末回忆版与期末大题重点预测。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-ca-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              课程组课件按讲编号（02～14），第 1 讲取教材《计算机系统结构》第一章讲义 PDF（课件/PPT 内）；
              配套教材为《计算机系统结构》（课件/PPT 中的第一～八章）。
              期末题型（据复习资料与回忆）：选择 5 题 10 分、填空 10 分、简答 5 题 30 分、综合 6 题 50 分；
              流水线、相关处理、ILP、存储层次、缓存与虚存为重点章节。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>14 份讲座课件</strong>（第 1 讲为教材第一章讲义 PDF，02～14 为课程组 pptx）与 <strong>3 份试题</strong>
              （第二次课堂测试含解析、2019 级期末回忆版、期末大题重点预测）。
              附件另含教材章节 PPT 与一版教材的期末 A 卷——术语体系与现行讲座课件不同，未收入在线练习。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-ca-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">讲次目录</span>
        </h2>
        <div className="card-grid deck-map">
          {caChapters.map((c) => (
            <Link key={c.id} className="card" to={`${CA_BASE}/chapter/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-ca-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 试题</span>
        </h2>
        <nav className="ext-cards" aria-label="试卷列表">
          {caPapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${CA_BASE}/practice/${p.id}`}>
              <span className="ext-card-icon">
                <IconFileText size={18} />
              </span>
              <span className="ext-card-body">
                <span className="ext-card-title">{p.title}</span>
                <span className="ext-card-desc">
                  {p.questions.length} 题 · 参考答案：{p.answerSource}
                </span>
              </span>
              <IconArrowRight size={15} className="ext-card-arrow" />
            </Link>
          ))}
        </nav>
        <div className="card-grid deck-map">
          <Link className="card" to={`${CA_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，逐卷作答：左侧题型热力图，右侧答题区，每题附知识点标签并可直接跳转课件对应位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

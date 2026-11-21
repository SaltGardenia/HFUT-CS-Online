import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AIE_BASE } from '../courses/registry';
import { aieChapters } from '../content/aie';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-aie-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-aie-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-aie-att', text: '3. 附件资料', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  deck1: '导论：AI 发展历程与定义、AI 经济与 AI 经济学、研究内容与系统分类、研究方法、课程体系与考核。',
  deck2: '人工智能技术：数据、算力（FLOPS 体系）、算法（机器/深度/强化学习）、专家系统、机器人技术与工业机器人市场、"技术—经济"新范式。',
  deck3: '人工智能与消费者行为：场景革命、AI 对消费者行为的影响（AI 直播助手实验）、消费者行为特征与智能体、消费者福利与权益。',
  deck4: '人工智能与企业行为、组织变革：智能体案例、组织结构变革、AI 与企业韧性（ISR 2025 论文）、科斯奇点、人力资源管理、挑战与对策。',
  deck5: '人工智能与市场结构的演变：数据/算法/算力竞争、平台经济与生态、新垄断要素与形式、市场竞争特征与典型事实（算法共谋、自我优待、大数据杀熟）。',
  deck6: '人工智能与就业、收入分配：技术性失业、三效应框架、技能/任务偏向性、行业异质性、劳动收入份额、就业政策与社保挑战、生成式 AI 暴露度、工业机器人。',
  deck7: '人工智能与经济增长：生产率悖论、智能自动化与三重跃升机制、人机竞争任务模型（Acemoglu–Restrepo）、元任务模型、产业化路径、AIGC→AGI 与鲍莫尔成本病。',
  deck8: '国际经济关系中的人工智能因素：货物/服务/数字贸易与贸易壁垒、国际直接与间接投资、跨国公司资本运营、全球性挑战与治理合作。',
};

export default function AieHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${AIE_BASE}/?s=${id}`, { replace: true });
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
      <h1>人工智能经济学</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（8 章 PPT）整理的课程精讲：八章内容紧扣课件逐节展开，
        课件内嵌的课堂单选/判断题已转为随堂练习。试题未收录，不设在线练习。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-aie-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              以经济学视角审视人工智能：从技术要素到消费者/企业/市场/就业，再到经济增长与国际经济关系。
              课件按章展开：导论、人工智能技术、消费者行为、企业行为与组织变革、市场结构、就业与收入分配、经济增长、国际贸易投资与合作。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>8 份课件</strong>（第 1～8 章按章 PPT）；课件内嵌单选/判断题共 45 道
              以随堂练习形式嵌入各章页面。另附作业等附件资料；试题未收录，无在线练习。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-aie-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {aieChapters.map((c) => (
            <Link key={c.id} className="card" to={`${AIE_BASE}/deck/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-aie-att">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">附件资料</span>
        </h2>
        <div className="card-grid deck-map">
          <Link className="card" to={`${AIE_BASE}/attachments`}>
            <h3>附件页</h3>
            <p>课件原文件、作业等资料的目录与下载。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

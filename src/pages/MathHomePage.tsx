import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MATH_BASE } from '../courses/registry';
import { mathChapters, mathPapers } from '../content/math';
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
  { id: 'sec-math-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-math-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-math-practice', text: '3. 在线练习 · 试卷', level: 2 as const },
];

/** 各章一句话简介（据课件目录概括） */
const CH_BLURB: Record<string, string> = {
  ch8: '向量及其线性运算、向量的乘积、空间曲面与曲线、空间平面、空间直线，并附习题课。',
  ch9: '多元函数的基本概念、极限与连续、偏导数、全微分、复合函数求导、隐函数微分、方向与梯度、几何应用与极值，并附习题课。',
  ch10: '二重积分的概念与性质、二重积分的计算、三重积分的计算。',
  ch11: '对弧长的曲线积分、对坐标的曲线积分。',
  ch12: '对坐标的曲面积分、高斯公式与斯托克斯公式。',
  ch13: '常数项级数的概念与性质、正项级数审敛、绝对收敛与条件收敛、幂级数、函数展开与傅里叶级数。',
};

export default function MathHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${MATH_BASE}/?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(HOME_TOC, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollSpy(pageRef, []);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get('s');
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section), 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page" ref={pageRef}>
      <h1>高等数学</h1>
      <div className="lede">
        <HtmlContent
          html={`
          <p>依据课程课件（课件 PPT-1 / PPT-2 及其 PDF 版）整理的课程讲义：覆盖<strong>第 8～13 章</strong>——空间解析几何与向量代数、多元函数微分学、重积分、曲线积分、曲面积分与无穷级数；
          另收录 <strong>${mathPapers.length} 份期中 / 期末试卷</strong>的在线练习。</p>
        `}
        />
      </div>

      <section>
        <h2 id="sec-math-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课件范围</h3>
            <p>
              课件按章编号（第 8～13 章）：先建立空间解析几何的语言，再进入多元函数微分学、重积分与曲线曲面积分，最后讨论无穷级数。
              各章均可从导航栏直接进入，章节页左侧目录可跳转到任意小节。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              讲义内容来自课件文件夹的演示文稿，部分章节以课件对应的 PDF 版补齐；试卷来自试题文件夹的期中、期末试卷，
              有答案文档的按原答案整理，其余在答题页标注答案来源。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-math-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {mathChapters.map((c) => (
            <Link key={c.id} className="card" to={`${MATH_BASE}/chapter/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-math-practice">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">在线练习 · 试卷</span>
        </h2>
        <BookCards base={MATH_BASE} course="math" />
        <nav className="ext-cards" aria-label="试卷列表">
          {mathPapers.map((p) => (
            <Link key={p.id} className="ext-card" to={`${MATH_BASE}/practice/${p.id}`}>
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
          <Link className="card" to={`${MATH_BASE}/practice`}>
            <h3>在线练习总览</h3>
            <p>进入试卷列表页，按试卷作答：左侧题型热力图，右侧答题区；每题附知识点标签，可跳转到课件对应章节位置。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

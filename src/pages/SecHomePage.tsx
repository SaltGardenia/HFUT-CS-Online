import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEC_BASE } from '../courses/registry';
import { secChapters } from '../content/sec';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';

/** 总目录页的目录（自绘区块，非 Sections 数据驱动） */
const HOME_TOC = [
  { id: 'sec-info-intro', text: '1. 课程与资料概况', level: 2 as const },
  { id: 'sec-info-chapters', text: '2. 章节目录', level: 2 as const },
  { id: 'sec-info-att', text: '3. 附件资料', level: 2 as const },
];

/** 章节一句话简介（来自各章 lede 的事实性概括，供卡片扫读） */
const CH_BLURB: Record<string, string> = {
  deck1: '课程导学、信息安全定义与安全隐患、安全威胁分类、安全目标与防护策略、信息安全知识体系、安全评估标准（TCSEC→CC），以及零知识证明与姚式百万富翁问题引入。',
  deck2: '对称密码基本概念、历史上的密码（凯撒/简单替换）、一次性密码本与 Enigma、DES/3DES、AES（Rijndael）、分组密码模式（ECB/CBC/CFB）、Diffie-Hellman、基于口令的密码、流密码（RC4/ZUC）。',
  deck3: '密钥配送问题四种方案、公钥密码与 RSA（密钥对生成/加密解密举例/中间人攻击）、混合密码系统、随机数与伪随机数生成器（线性同余法/单向散列函数法/密码法/ANSI X9.17）。',
  deck4: '单向散列函数（SHA-1、变色龙哈希、局部敏感哈希）、消息认证码（HMAC/重放攻击）、数字签名（方法/Q&A/密码技术对比）、证书与 PKI、PGP 与信任网。',
  deck6: 'Web 安全简史与安全评估（STRIDE/DREAD）、跨站脚本攻击 XSS 及其防御、点击劫持、恶意软件（病毒/蠕虫/木马）、防火墙（包过滤/状态检测）、隐蔽通道、入侵检测与蜜罐。',
  deck7: '区块链与比特币（默克尔哈希/PoW/PoS/DPoS/VDF）、可编程支付与智能合约、差分隐私（Laplace 机制）、零知识证明（色盲游戏/数独/Schnorr）、不经意传输、同态加密。',
};

export default function SecHomePage() {
  const navigate = useNavigate();
  const toc = useToc();
  const pageRef = useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${SEC_BASE}/?s=${id}`, { replace: true });
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
      <h1>信息安全技术</h1>
      <div className="lede">
        <HtmlContent
          html={`
        <p>依据课程组课件（6 份 PDF：第 1～4、6、7 章）整理的课程精讲：
        从密码学（对称/公钥/消息认证）到 Web 安全、防火墙与入侵检测，再到区块链、差分隐私、零知识证明与同态加密等前沿技术。
        试题未收录，不设在线练习。</p>
      `}
        />
      </div>

      <section>
        <h2 id="sec-info-intro">
          <span className="h2-no" aria-hidden="true">1</span>
          <span className="h2-title">课程与资料概况</span>
        </h2>
        <div className="card-grid deck-map">
          <div className="card">
            <h3>课程信息</h3>
            <p>
              能够学到密码学术语、密码学主流算法、身份认证与现实中涉及安全的应用；不涉及密码学数学基础（群论等）。
              课件按章展开：信息安全概述、对称密码学、公钥密码学、消息认证、Web 安全、区块链与其他技术（课件无第 5 章 PDF）。
            </p>
          </div>
          <div className="card">
            <h3>资料构成</h3>
            <p>
              站点整理自 <strong>6 份课件</strong>（第 1～4、6、7 章 PDF）与配套附件资料；试题未收录，无在线练习。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="sec-info-chapters">
          <span className="h2-no" aria-hidden="true">2</span>
          <span className="h2-title">章节目录</span>
        </h2>
        <div className="card-grid deck-map">
          {secChapters.map((c) => (
            <Link key={c.id} className="card" to={`${SEC_BASE}/deck/${c.id}`}>
              <h3>
                {c.no} · {decodeEntities(c.title)}
              </h3>
              <p>{CH_BLURB[c.id]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 id="sec-info-att">
          <span className="h2-no" aria-hidden="true">3</span>
          <span className="h2-title">附件资料</span>
        </h2>
        <div className="card-grid deck-map">
          <Link className="card" to={`${SEC_BASE}/attachments`}>
            <h3>附件页</h3>
            <p>课件原文件、试卷等资料的目录与下载。</p>
          </Link>
        </div>
      </section>

      <SectionCapsule />
    </div>
  );
}

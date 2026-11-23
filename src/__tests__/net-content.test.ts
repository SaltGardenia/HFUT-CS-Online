/**
 * 计算机网络课程内容完整性测试：
 * 章节结构 / 目录与 section 对齐 / 试卷题库字段与答案格式 / 标签指向真实存在的章内位置 / id 唯一 / 纯文本字段无实体
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Sections from '../components/Sections';
import { netChapters, netPapers, netAllQuestions } from '../content/net';
import { netHomework } from '../content/net/homework';
import { netHighlights } from '../content/net/highlights';
import { readProgress } from '../lib/sync/local';
import { NET_PRACTICE_STORE_KEY } from '../pages/net/NetPracticeListPage';
import type { PracticeKind } from '../content/practice/types';

const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

/** 章节结构契约：8 个章，各章 section 数 */
const EXPECT_SECTIONS: Record<string, number> = {
  ch1: 9,
  ch2: 5,
  ch3: 10,
  ch4: 5,
  ch5: 8,
  ch6: 7,
  ch7: 9,
  ch8: 5,
};

/** 试卷题量契约（与原始卷对齐） */
const EXPECT_PAPER_COUNT: Record<string, number> = {
  'paper-2021': 27,
  'paper-2022': 45,
  'paper-2024': 29,
};

/** 对照第1章形成与发展部分，防止“仅列阶段名称”导致要点缺漏。 */
describe('第1章：计算机网络发展的四个阶段', () => {
  const chapter = netChapters[0];
  const html = chapter.sections.find((section) => section.id === 'sec-ch1-history')?.blocks
    .filter((block) => block.type === 'html').map((block) => block.html).join('') ?? '';

  it('四阶段独立成节，顺序与目录锚点一致', () => {
    const stages = [
      ['sec-ch1-history-remote', '第一阶段：远程联机系统'],
      ['sec-ch1-history-multi', '第二阶段：多机互联网络'],
      ['sec-ch1-history-standard', '第三阶段：标准化网络'],
      ['sec-ch1-history-fast', '第四阶段：互联与高速网络'],
    ] as const;
    expect(chapter.lede).toContain('远程联机、多机互联、标准化网络、互联与高速网络');
    expect(html).toContain('<h3 id="sec-ch1-history-phases">计算机网络发展的四个阶段</h3>');
    let previous = -1;
    for (const [id, heading] of stages) {
      const pos = html.indexOf(`<h3 id="${id}">${heading}</h3>`);
      expect(pos, heading).toBeGreaterThan(previous);
      expect(chapter.toc.some((item) => item.id === id && item.level === 3), heading).toBe(true);
      previous = pos;
    }
  });

  it('远程联机包括连接方式、FEP/Modem/集中器、系统实例及主要问题', () => {
    for (const term of [
      '点到点专线方式', '多点或分支连接方式',
      '前端处理机（FEP', '调制解调器（Modem', '集中器（Concentrator',
      'SABRE 飞机订票系统', '23 个地点的 75 个远程集中器',
      '主计算机负荷重，响应时间可能过长',
      '单机系统的可靠性较低，主机故障可能导致整个系统瘫痪',
      '线路利用率低、费用较高',
    ]) expect(html).toContain(term);
  });

  it('多机互联包括 ARPANET 五项特点、四方面贡献与第一阶段区别', () => {
    for (const term of [
      'ARPANET（阿帕网）', '资源共享', '分散控制', '分组交换',
      '采用专门的通信控制处理机', '采用分层网络协议',
      '网络定义与分类', '资源子网', '通信子网',
      '分组交换方法', '分层网络体系结构与协议体系',
      '通信双方的能力不同', '网络功能的侧重点不同',
    ]) expect(html).toContain(term);
  });

  it('标准化包括厂商不兼容问题、SNA/DNA/DCA、OSI/TCP-IP 两条发展脉络', () => {
    for (const term of [
      '缺乏兼容性', '系统网络体系结构 SNA', '数字网络体系结构 DNA',
      '分布式通信体系结构 DCA', '1977 年', '1984 年',
      '开放系统互连参考模型（OSI/RM）', '1983 年', 'TCP/IP',
    ]) expect(html).toContain(term);
  });

  it('互联与高速网络包括 Internet、高速化双特征、综合业务与 ISDN', () => {
    for (const term of [
      'Internet', '宽频带', '低时延', '光纤',
      '网络业务综合化', '语音、数据、图像、视频',
      '综合业务数字网（ISDN）', '智能化网络',
    ]) expect(html).toContain(term);
  });

  it('SABRAI 勘误保留，但正文无课件版本和页码编辑说明', () => {
    expect(html).toContain('名称勘误｜SABRE 订票系统');
    expect(html).toContain('SABRAI');
    expect(html).toContain('正确英文名称是 <strong>SABRE</strong>');
    expect(html).toContain('Semi-Automated Business Research Environment');
    const visible = [chapter.lede, ...chapter.toc.map((item) => item.text),
      ...chapter.sections.flatMap((section) => section.blocks)
        .filter((block) => block.type === 'html').map((block) => block.html)].join('\n');
    expect(visible).not.toMatch(/2025\s*版?课件|课件第\s*\d+|PPT\s*第\s*\d+|旧版网站|不是课件原题/);
  });
});


/**
 * 各章课件中的明确枚举、优缺点和步骤不得被概括性文字代替。
 * 这里检查学习内容覆盖，不要求前台出现编辑用的课件版本或页码。
 */
describe('计算机网络各章课件条目完整性', () => {
  const chapterHtml = (chapterNo: number) => netChapters[chapterNo - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html')
    .map((block) => block.html).join('');

  const containsAll = (chapterNo: number, terms: string[]) => {
    const html = chapterHtml(chapterNo);
    for (const term of terms) expect(html, `第${chapterNo}章遗漏：${term}`).toContain(term);
  };

  it('第1章：主要功能五项，拓扑形式五类及其利弊', () => {
    containsAll(1, ['网络通信', '资源共享', '分布式处理', '集中管理', '均衡负荷',
      '总线型', '星型', '树型', '环型', '网状型', '主干线故障']);
    containsAll(1, ['分布在不同地点，并具有独立功能', '通信设备和线路',
      '网络软件和协议', '独立计算机互联', '存在通信通道', '遵循通信规则']);
    containsAll(1, ['定义要点：', '网络协议是关键技术，数据交换是基本功能，资源共享是最终目的。']);
    expect(netChapters[0].toc.some((entry) => entry.id === 'sec-ch1-definition-functions')).toBe(true);
  });

  it('第2章：分层五个优点、重复开销与五种典型层间功能', () => {
    containsAll(2, ['各层相对独立', '灵活性好', '结构上可分割',
      '易于实现和维护', '促进标准化', '分层的缺点',
      '差错控制', '流量控制', '分段和重装', '复用和分用', '连接建立和释放']);
  });

  it('第3章：T1/E1 的时隙数、帧周期，PDH 与 SONET/SDH', () => {
    containsAll(3, ['193 bit/帧', '256 bit/帧', '125 μs',
      '准同步（PDH）', 'SONET', 'STS-1 / OC-1', '51.84 Mbit/s',
      'SDH', 'STM-1', '155.52 Mbit/s']);
  });

  it('第4章：连续 ARQ 退回重传和效率权衡、PPP 十项需求与五类不必提供的能力', () => {
    containsAll(4, ['连续 ARQ（Go-Back-N）', 'DATA2', '重复确认',
      '连续 ARQ 不一定在所有信道条件下都优于停止等待协议',
      'PPP 应满足的十项需求', 'PPP 不要求提供的功能',
      '网络层地址协商', '数据压缩协商', '多点线路支持']);
  });

  it('第5章：局域网特点与优点、静态和动态接入、VLAN 优点与成员划分方式', () => {
    containsAll(5, ['局域网的特点与主要优点', '广播功能', '扩展和演变方便',
      '可靠性、可用性和生存性', '静态划分信道', '受控接入',
      'VLAN 的主要优点与划分方式', '改善性能', '简化管理',
      '降低成本', '改善安全性', '按交换机端口划分', '按 MAC 地址划分']);
  });

  it('第6章：RIP 三特点和优缺点、OSPF 三特点和区域划分', () => {
    containsAll(6, ['仅与相邻路由器交换路由信息', '当前路由表中的全部路由信息',
      '30 秒', '16 表示不可达', '坏消息传播得慢',
      'OSPF 链路状态协议的三个主要特点', '洪泛（flooding）更新',
      '链路变化时触发更新', '主干区域 Area 0',
      '减少区域内路由更新通信量', '路由管理复杂度']);
  });

  it('第7章：端到端通信、TCP/UDP 与传输层可靠性边界', () => {
    containsAll(7, ['端到端', '复用', '分用', 'TCP', 'UDP',
      '可靠、有序交付是特定运输层协议', '端口号']);
  });

  it('第8章：FTP 主进程四步骤与控制/数据连接、HTTP、CGI、搜索', () => {
    containsAll(8, ['FTP 服务器主进程的工作步骤', '打开熟知端口 21',
      '等待连接请求', '启动从属进程', '继续接受新请求',
      '控制连接', '数据连接', '被动（PASV）模式',
      '动态文档、CGI 与活动文档', 'PageRank']);
  });
});

describe('计算机网络课件内容', () => {
  it('共 8 个章，id/no 符合约定', () => {
    expect(netChapters.length).toBe(8);
    netChapters.forEach((c, i) => {
      expect(c.id).toBe(`ch${i + 1}`);
    });
    expect(netChapters[0].no).toBe('第1章');
    expect(netChapters[7].no).toBe('第8章');
  });

  it('各章 section 数与契约一致，目录项与 section id 对齐', () => {
    for (const c of netChapters) {
      expect(c.sections.length, c.id).toBe(EXPECT_SECTIONS[c.id]);
      expect(c.toc.length, `${c.id} toc`).toBeGreaterThan(0);
      for (const s of c.sections) {
        expect(s.blocks.length, `${c.id}/${s.id}`).toBeGreaterThan(0);
        // 每个 level 2 目录项都要有对应 section（level 3 目录项对应 html 内 h3）
        const l2 = c.toc.filter((t) => t.level === 2 && t.text === s.heading);
        if (s.heading && c.toc.some((t) => t.text === s.heading)) {
          expect(l2.length, `${c.id}/${s.id} 目录对齐`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    const plain: string[] = [];
    for (const c of netChapters) {
      plain.push(c.title, c.subtitle);
      for (const t of c.toc) plain.push(t.text);
      for (const s of c.sections) plain.push(s.heading);
    }
    expect(plain.filter((v) => ENTITY_RE.test(v))).toEqual([]);
  });

  it('章节页渲染后的可见文本不出现字面实体（端到端）', () => {
    for (const c of netChapters) {
      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(Sections, { sections: c.sections })),
      );
      // 用 DOM 解码后再查：html 块里的合法实体（如 &lt;）渲染为可见字符，不算残留；只有双重转义才会露出
      const div = document.createElement('div');
      div.innerHTML = html;
      expect(ENTITY_RE.test(div.textContent ?? ''), `${c.id} 渲染文本残留实体`).toBe(false);
    }
  });

  it('总目录页可渲染（sections 非空）', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(Sections, { sections: netPapers.length ? netChapters[0].sections : [] })),
    );
    expect(html.length).toBeGreaterThan(0);
  });
});

describe('计算机网络试卷题库', () => {
  it('共 3 份试卷，各卷题量与原始卷对齐', () => {
    expect(netPapers.length).toBe(3);
    for (const p of netPapers) {
      expect(p.questions.length, p.id).toBe(EXPECT_PAPER_COUNT[p.id]);
      // 分组引用的题号必须都存在且恰好覆盖全卷
      const grouped = p.sections.flatMap((s) => s.questionIds);
      expect(new Set(grouped).size, `${p.id} 分组去重`).toBe(grouped.length);
      expect([...grouped].sort(), `${p.id} 分组覆盖`).toEqual([...p.questions.map((q) => q.id)].sort());
    }
  });

  it('题目 id 全库唯一且形如 p{卷}-{题型}{序号}', () => {
    const ids = netAllQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of netAllQuestions) {
      const kind: Record<PracticeKind, string> = { single: 's', multi: 'm', judge: 'j', fill: 'f', essay: 'e' };
      expect(q.id, q.id).toMatch(new RegExp(`^p\\d-${kind[q.kind]}\\d+$`));
    }
  });

  it('字段完整：题干/答案/解析非空，标签 ≥1，选项数合理', () => {
    for (const q of netAllQuestions) {
      expect(q.question.length, q.id).toBeGreaterThan(5);
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(5);
      expect(q.tags.length, `${q.id} 标签`).toBeGreaterThan(0);
      if (q.kind === 'fill' || q.kind === 'essay') {
        expect(q.options, `${q.id} 不应有选项`).toBeUndefined();
      } else {
        expect((q.options ?? []).length, `${q.id} 选项数`).toBeGreaterThanOrEqual(2);
        expect(q.answer, q.id).not.toMatch(/&/); // 答案按纯文本渲染
      }
    }
  });

  it('答案格式符合题型约定', () => {
    for (const q of netAllQuestions) {
      if (q.kind === 'single') {
        expect(q.answer, q.id).toMatch(/^[A-F]$/);
        const idx = 'ABCDEF'.indexOf(q.answer);
        expect((q.options ?? []).length, q.id).toBeGreaterThan(idx);
      }
      if (q.kind === 'fill') {
        // 填空答案用「｜」分隔可接受写法，判分按归一化比对
        expect(q.answer.length, q.id).toBeGreaterThan(0);
      }
    }
  });

  it('知识点标签指向真实存在的章与 section（点击可跳转）', () => {
    for (const q of netAllQuestions) {
      for (const t of q.tags) {
        expect(t.deck, q.id).toBeGreaterThanOrEqual(1);
        expect(t.deck, q.id).toBeLessThanOrEqual(8);
        const chapter = netChapters[t.deck - 1];
        const hit = chapter.toc.find((e) => e.id === t.sec) ?? chapter.sections.some((s) => s.id === t.sec);
        expect(hit, `${q.id} → ch${t.deck}/${t.sec} 不存在`).toBeTruthy();
        expect(t.text.length, q.id).toBeGreaterThan(0);
        expect(ENTITY_RE.test(t.text), `${q.id} 标签文本残留实体`).toBe(false);
      }
    }
  });

  it('知识点覆盖 8 个章（没有落单的章）', () => {
    const covered = new Set(netAllQuestions.flatMap((q) => q.tags.map((t) => t.deck)));
    for (let c = 1; c <= 8; c++) {
      expect(covered.has(c), `ch${c} 无题目覆盖`).toBe(true);
    }
  });

  it('每题解析都给出实质理由（长度与题干脱钩的最小要求）', () => {
    for (const q of netAllQuestions) {
      expect(q.explanation.length, `${q.id} 解析过短`).toBeGreaterThan(20);
    }
  });
});

describe('2025版计网作业与知识点跳转', () => {
  it('八章共54道来源作业，未虚构第八章作业', () => {
    const counts = [6, 3, 2, 7, 11, 16, 9, 0];
    counts.forEach((count, i) => expect(netHomework[i + 1].length).toBe(count));
    expect(counts.reduce((sum, n) => sum + n, 0)).toBe(54);
  });
  it('每题均有同章知识点锚点和独立题号锚点', () => {
    netChapters.forEach((chapter, i) => {
      const n = i + 1;
      const anchors = new Set(chapter.toc.map((entry) => entry.id));
      expect(anchors.has(`sec-ch${n}-homework`)).toBe(true);
      for (const q of netHomework[n]) {
        expect(anchors.has(q.related), q.title).toBe(true);
        expect(anchors.has(`sec-ch${n}-hw-${q.no}`), q.title).toBe(true);
        expect(q.reference.length, q.title).toBeGreaterThan(70);
      }
    });
  });
  it('第五章承接旧版中的局域网节，第4章不重复', () => {
    expect(netChapters[3].sections.every((section) => !/broadcast|evolve/.test(section.id))).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-broadcast')).toBe(true);
    expect(netChapters[4].sections.some((section) => section.id === 'sec-ch5-evolve')).toBe(true);
  });
});

describe('2025 课件原始 PDF 荧光笔索引', () => {
  it('所有标出的知识点均对应可跳转的章节目录项', () => {
    for (let i = 1; i <= 8; i++) {
      const marked = netHighlights[i];
      expect(marked).toBeDefined();
      const destinations = new Set(netChapters[i - 1].toc.map((entry) => entry.id));
      for (const focus of marked.groups) {
        expect(destinations.has(focus.sec), `第${i}章：${focus.topic} 缺少对应锚点`).toBe(true);
        expect(focus.pages).toContain('页');
      }
    }
  });
  it('第八章无黄色笔迹不代表没有考试范围', () => {
    expect(netHighlights[8].markedPages).toBe(0);
    expect(netHighlights[8].groups).toHaveLength(0);
  });
});

describe('PDF 文字转录字符完整性', () => {
  it('计网作业不得含 PDF 符号字体私用区字符或异常替换字形', () => {
    // U+F06D/U+F0B9 曾分别使 μs、≠ 显示为乱码；避免后续导入重复发生。
    const invalid = /[\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}\uFFFD\u0080-\u009F\u00AD\u200B]/u;
    for (const [chapter, questions] of Object.entries(netHomework)) {
      for (const question of questions) {
        for (const [field, value] of Object.entries(question)) {
          if (typeof value !== 'string') continue;
          expect(invalid.test(value), `第${chapter}章第${question.no}题的${field}字段含乱码字形`).toBe(false);
        }
      }
    }
  });
});

describe('PPP 配图完整性', () => {
  it('第 4 章 PPP 在原文不变的基础上插入六幅 SVG 图版', () => {
    const ppp = netChapters.find((chapter) => chapter.id === 'ch4');
    expect(ppp).toBeDefined();
    const section = ppp!.sections.find((item) => item.id === 'sec-ch4-p2p');
    const html = section?.blocks.filter((block) => block.type === 'html').map((block) => block.html).join('') ?? '';
    const figures = html.match(/<svg class="fig ppp-figure"/g) ?? [];
    // 同一节还包含额外的「HDLC 与 PPP 对比」通用插图，不应被计入六幅 PPP 专项图。
    const captions = html.match(/<p class="fig-cap">图 4-PPP-\d+/g) ?? [];
    expect(figures).toHaveLength(6);
    expect(captions).toHaveLength(6);
    for (const word of ['透明传输', 'PPP 会话生命周期', 'Code', 'Configure-Ack', 'PAP', 'CHAP', 'IPCP']) {
      expect(html).toContain(word);
    }
    for (const name of ['ppp-stuffing', 'ppp-phases', 'ppp-lcp', 'ppp-config', 'ppp-auth', 'ppp-ncp']) {
      expect(html).toContain(`id="${name}-title"`);
    }
  });
});

describe('2025 课件数值笔误与标准对照', () => {
  it('T1 193bit × 8000帧/s、E1 256bit × 8000帧/s；帧长都是125微秒', () => {
    expect(193 * 8000).toBe(1_544_000);
    expect(256 * 8000).toBe(2_048_000);
    expect(1 / 8000).toBe(0.000125);
    const physical = netChapters[2].sections.flatMap((section) => section.blocks)
      .filter((block) => block.type === 'html').map((block) => block.html).join('');
    expect(physical).toContain('193 × 8000 = 1.544 Mbit/s');
    expect(physical).toContain('256 × 8000 = 2.048 Mbit/s');
    expect(physical).toContain('125 μs');
    expect(physical).toContain('微秒（μs）');
  });
  it('PPP 明确更正课件中将 1500B 误解为固定帧长的说法，并说明 Padding 可选', () => {
    const link = netChapters[3].sections.flatMap((section) => section.blocks)
      .filter((block) => block.type === 'html').map((block) => block.html).join('');
    expect(link).not.toContain('不足 1500 字节时填充');
    expect(link).toContain('短帧不需要自动填充至 1500 字节');
    expect(link).toContain('1500 字节是默认 MRU');
    expect(link).toContain('Padding 是可选的');
    expect(link).toContain('Terminate-Ack');
  });
});
describe('计网内容二次勘误回归', () => {
  const chapterHtml = (n: number) => netChapters[n - 1].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('采样定理保留带限与抗混叠前提', () => {
    expect(chapterHtml(3)).toContain('带限信号');
    expect(chapterHtml(3)).toContain('抗混叠滤波');
  });
  it('PPP 区分 IPCP、同步异步填充以及16/32位FCS', () => {
    const html = chapterHtml(4);
    expect(html).toContain('0x8021 是 IPCP');
    expect(html).toContain('32 位 FCS');
    expect(html).toContain('同步链路上的比特填充');
  });
  it('IPv4配套协议、回环与未指定地址、OSPF收敛环路', () => {
    const html = chapterHtml(6);
    expect(html).toContain('这些都不是路由选择协议');
    expect(html).toContain('127.0.0.0/8');
    expect(html).toContain('程序绑定监听地址 0.0.0.0');
    expect(html).toContain('短暂出现转发环路');
  });
  it('UDP、RPC、SACK、ssthresh 的语义不误导', () => {
    const html = chapterHtml(7);
    expect(html).toContain('TCP/IP 协议族的运输层');
    expect(html).toContain('RPC 并非必然采用无连接对话');
    expect(html).toContain('不是每一个 TCP 报文段都带 SACK');
    expect(html).toContain('没有统一固定为 65535');
  });
  it('HTTP 分清无状态和连接复用；历年题同步更正回环范围', () => {
    expect(chapterHtml(8)).toContain('HTTP/1.1 默认采用持续连接');
    expect(chapterHtml(8)).toContain('2×RTT + 文档传输时间');
    const q = netPapers.find((paper) => paper.id === 'paper-2021')?.questions.find((q) => q.id === 'p1-s4');
    expect(q?.explanation).toContain('127.0.0.0/8');
  });
});

describe('计网第三轮审查：计算条件与考试解释', () => {
  const h3 = netChapters[2].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');
  const p2024 = netPapers.find((p) => p.id === 'paper-2024')!;

  it('波特用 Bd，频分复用不是无时延，并行倍速须声明单线路条件', () => {
    expect(h3).toContain('符号 <strong>Bd</strong>');
    expect(h3).toContain('频分复用不等于没有传输时延');
    expect(h3).toContain('每条信道的码元速率都与串行方案的单条信道相同');
  });

  it('2024试卷保留原答案，同时区别通信端点与进程', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-s12');
    expect(q?.answer).toBe('D');
    expect(q?.explanation).toContain('不能一般性地唯一标识某个操作系统进程');
  });

  it('2024试卷CSMA/CD 理论最短发送长度不冒充真实以太网最小帧长', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-e8');
    expect(q?.answer).toContain('10000 bit');
    expect(q?.answer).toContain('64 字节');
    expect(q?.answer).toContain('载波延伸');
  });

  it('2024路由器题区分数据转发和差错报告', () => {
    const q = p2024.questions.find((x) => x.id === 'p3-e4');
    expect(q?.answer).toContain('ICMP 不是通常用来建立路由表的数据平面转发协议');
  });

  it('2022试卷ARP与MAC 历史表述有标准适用条件', () => {
    const p2022 = netPapers.find((p) => p.id === 'paper-2022')!;
    expect(p2022.questions.find((q) => q.id === 'p2-f4')?.explanation).toContain('直接封装在链路层帧');
    expect(p2022.questions.find((q) => q.id === 'p2-e5')?.answer).toContain('本地管理或随机化 MAC 地址');
  });
});

describe('第四轮勘误：码距、地址块与微波频段', () => {
  const chapterHtml = (n: number) => netChapters[n - 1].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('普通海明码码距3不能同时保证纠1检2，扩展海明码码距4才支持SECDED', () => {
    const html = chapterHtml(4);
    expect(html).toContain('Hamming(7,4)');
    expect(html).toContain('Hamming(8,4)');
    expect(html).toContain('SECDED');
    expect(html).toContain('不能同时保证');
  });

  it('A/D/E类分类范围完整且E类标志前四位1111', () => {
    const html = chapterHtml(6);
    for (const s of ['224.0.0.0/4','239.255.255.255','240.0.0.0/4','255.255.255.255','前四位固定为 1111','1～126']) {
      expect(html).toContain(s);
    }
  });

  it('微波频段中厘米波仅为一部分', () => {
    const html = chapterHtml(3);
    expect(html).toContain('不能将整个微波频段都称为厘米波');
    expect(html).toContain('3～30 GHz');
  });
});

describe('第五轮计网核验：ADSL DMT、运输层与网页访问', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html').map((block) => block.html).join('');

  it('DMT 子载波间距为 4.3125 kHz，上行频谱不被误写为 40 kHz 以下', () => {
    const html = chapterHtml(3);
    expect(html).toContain('中心频率间隔为 4.3125 kHz');
    expect(html).toContain('0.3125 kHz 不是 DMT 子载波的独立保护频带');
    expect(html).toContain('25～138 kHz');
    expect(html).toContain('138～1104 kHz');
    expect(html).not.toContain('约 40kHz 以下为上行信道');
  });

  it('信道容量是理论上限，不保证实际传输速率可以达到', () => {
    const html = chapterHtml(3);
    expect(html).toContain('理论速率上限');
    expect(html).not.toContain('最大信息传输速率等于信道容量');
  });

  it('OSI 运输层不能把 TCP 的可靠性误当作 UDP 也具备', () => {
    const html = chapterHtml(2);
    expect(html).toContain('不能把可靠性视为所有运输层协议的共同保证');
    expect(html).toContain('UDP 提供无连接');
  });

  it('2021 试卷浏览网页题保留经典流程并说明 HTTPS 与 QUIC', () => {
    const q = netPapers.find((paper) => paper.id === 'paper-2021')
      ?.questions.find((question) => question.id === 'p1-e10');
    expect(q?.answer).toContain('QUIC/UDP');
    expect(q?.answer).toContain('TLS');
    expect(q?.answer).toContain('DNS 结果与 ARP 邻居表可能命中缓存');
  });
});

describe('第六轮计网核验：BGP 与 IDRP 路由机制', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((s) => s.blocks).filter((b) => b.type === 'html').map((b) => b.html).join('');
  it('IDRP 与 BGP 都是路径矢量而不是链路状态', () => {
    const html = chapterHtml(6);
    expect(html).toContain('路径矢量（Path Vector）域间路由协议');
    expect(html).toContain('AS_PATH 主要表示路由通告经过的自治系统序列');
    expect(html).toContain('收到的 AS_PATH 包含<strong>自身 AS 号</strong>');
  });
  it('2024试卷BGP解释与正文一致', () => {
    const paper = netPapers.find((p) => p.id === 'paper-2024')!;
    expect(paper.questions.find((q) => q.id === 'p3-s19')?.explanation).toContain('路径矢量（Path Vector）协议');
    expect(paper.questions.find((q) => q.id === 'p3-e4')?.answer).toContain('利用 AS_PATH 等属性');
  });
});

describe('第七轮计网核验：HTTP/2、QUIC 的标准限定', () => {
  const html = netChapters[7].sections.flatMap((s) => s.blocks)
    .filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('不能断言 TCP/TLS 普遍需要4-5 RTT；QUIC是名称不是缩写', () => {
    expect(html).toContain('课件“建连需 4～5 RTT”不适用于所有基于 TCP 的应用');
    expect(html).toContain('RFC 9000 明确指出 QUIC 是名称而非首字母缩写');
  });

  it('QUIC 跨流队头阻塞与连接迁移都需限定适用条件', () => {
    expect(html).toContain('单个 QUIC 流内仍然有可靠、有序交付');
    expect(html).toContain('不能保证网络切换后绝对不断线');
    expect(html).toContain('Connection ID');
  });
});

describe('第八轮协议准确性与波形可核验性', () => {
  const chapterHtml = (n: number) => netChapters[n - 1].sections
    .flatMap((s) => s.blocks).filter((b) => b.type === 'html').map((b) => b.html).join('');
  const getAnswer = (id: string) =>
    netPapers.flatMap((paper) => paper.questions).find((q) => q.id === id)?.answer ?? '';

  it('Ethernet CRC-32 生成多项式必须包含 x7 且对应 0x04C11DB7（运行时第5章）', () => {
    const html = chapterHtml(5);
    expect(html).toContain('x<sup>8</sup> + <strong>x<sup>7</sup></strong> + x<sup>5</sup>');
    expect(html).toContain('0x04C11DB7');
  });
  it('IPv4 最大总长度 65535，Identification 并非全局唯一', () => {
    const html = chapterHtml(6);
    expect(html).toContain('总长度最大为 65535 字节');
    expect(html).toContain('不是全网唯一的数据报计数器');
    expect(html).toContain('RFC 6864');
  });
  it('DNS 支持多资源记录，QNAME 反向解析需要 PTR 域名格式', () => {
    const html = chapterHtml(8);
    expect(html).toContain('域名与 IP 地址并不是严格的一对一关系');
    expect(html).toContain('最多占 <strong>255 个八位组</strong>');
    expect(html).toContain('1.2.0.192.in-addr.arpa');
    expect(html).toContain('不存在所有区域统一固定为 3 小时');
  });
  it('IMAP 第四连接状态为 Logout，SMTP 信封与邮件头分开且认证不能明文发送', () => {
    const html = chapterHtml(8);
    expect(html).toContain('注销（Logout）状态');
    expect(html).toContain('“离线阅读”不是协议连接状态');
    expect(html).toContain('SMTP 的<strong>信封 MAIL FROM/RCPT TO');
    expect(html).toContain('Base64 仅是编码，不是加密');
  });

  // 各段 SVG 路径均由 M/H/V 命令构成：在每位前后半部的水平线采样。
  function levels(path: string) {
    const tokens = path.match(/[MHV]|-?[0-9]+/g) ?? [];
    const segments: { left: number; right: number; y: number }[] = [];
    let x = 0, y = 0, initial = 0;
    for (let i = 0; i < tokens.length;) {
      const cmd = tokens[i++];
      if (cmd === 'M') { x = Number(tokens[i++]); y = Number(tokens[i++]); initial = y; }
      else if (cmd === 'H') {
        const end = Number(tokens[i++]);
        segments.push({ left: x, right: end, y });
        x = end;
      } else if (cmd === 'V') { y = Number(tokens[i++]); }
      else throw new Error('无法解析 SVG 路径命令：' + cmd);
    }
    return {
      initial,
      at(pos: number) {
        const hit = segments.find((seg) => seg.left <= pos && pos < seg.right);
        if (!hit) throw new Error('SVG 波形缺少位置 ' + pos);
        return hit.y;
      },
    };
  }
  const svgPaths = (answer: string) =>
    [...answer.matchAll(/<path[^>]*d="([^"]+)"/g)].map((m) => m[1]);
  const manchester = (path: string, start: number, n: number) => {
    const s = levels(path);
    return Array.from({ length: n }, (_, i) =>
      s.at(start + 40 * i + 10) > s.at(start + 40 * i + 30) ? '1' : '0').join('');
  };
  it('2021 NRZ/曼彻斯特/差分曼彻斯特波形逐位解码与题目一致', () => {
    const [nrz, man, diff] = svgPaths(getAnswer('p1-e11'));
    expect(nrz && man && diff).toBeTruthy();
    const s = levels(nrz);
    expect(Array.from({ length: 8 }, (_, i) => s.at(74 + 40 * i + 10) < 43 ? '1' : '0').join(''))
      .toBe('01001101');
    expect(manchester(man, 74, 8)).toBe('01001101');
    const d = levels(diff);
    let previous = d.initial;
    let decoded = '';
    for (let i = 0; i < 8; i++) {
      const first = d.at(74 + 40 * i + 10);
      const second = d.at(74 + 40 * i + 30);
      decoded += first === previous ? '1' : '0';
      previous = second;
    }
    expect(decoded).toBe('01001101');
  });
  it('2024 曼彻斯特波形逐位解码为 100101101', () => {
    const path = svgPaths(getAnswer('p3-e2'))[0];
    expect(path).toBeTruthy();
    expect(manchester(path, 30, 9)).toBe('100101101');
  });
});

describe('第九轮：协议注册语义与试卷历史考法区别', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((s) => s.blocks).filter((b) => b.type === 'html').map((b) => b.html).join('');

  it('IEEE 802.2 SNAP 的 OUI 与 PID 共占 5 字节，MAC 多播接收取决于过滤配置（运行时第5章）', () => {
    const html = chapterHtml(5);
    expect(html).toContain('5 字节 SNAP 协议标识：3 字节 OUI + 2 字节 PID');
    expect(html).toContain('按已配置的多播组/过滤策略接收');
    expect(html).not.toContain('新增一个 2 字节的协议类型域');
  });

  it('注册端口不等于使用前必须登记，IANA 职能由 PTI 执行', () => {
    const html = chapterHtml(7);
    expect(html).toContain('关联机构 PTI');
    expect(html).toContain('不是必须先向 IANA 注册');
    expect(html).toContain('32768～60999');
    expect(html).toContain('端口号<strong>不与进程一一对应</strong>');
  });

  it('IPv4 地址定义不包含意外重复文本', () => {
    const html = chapterHtml(6);
    expect(html).toContain('IPv4 地址是分配给网络接口的 <strong>32 位逻辑地址</strong>');
    expect(html).not.toContain('分配的\n            分配给');
  });

  it('2021 双绞线原答案 A 不变，但同时标出 D 选项限制过严', () => {
    const q = netPapers.find((p) => p.id === 'paper-2021')!
      .questions.find((x) => x.id === 'p1-s2')!;
    expect(q.answer).toBe('A');
    expect(q.explanation).toContain('D“通常只用作局域网通信介质”也不严谨');
  });

  it('2022 原答案不变，ARP 静态项、VLAN 与定向广播例外有说明', () => {
    const paper = netPapers.find((p) => p.id === 'paper-2022')!;
    expect(paper.questions.find((x) => x.id === 'p2-s20')?.answer).toBe('A');
    expect(paper.questions.find((x) => x.id === 'p2-s20')?.explanation).toContain('静态 ARP 项可以由管理员人工配置');
    expect(paper.questions.find((x) => x.id === 'p2-s16')?.explanation).toContain('逻辑划分的机制');
    expect(paper.questions.find((x) => x.id === 'p2-f16')?.explanation).toContain('RFC 2644');
  });

  it('2024 BGP 单选保留 C，但解释 iBGP 也能运行于 AS 内部', () => {
    const q = netPapers.find((p) => p.id === 'paper-2024')!
      .questions.find((x) => x.id === 'p3-s19')!;
    expect(q.answer).toBe('C');
    expect(q.explanation).toContain('非边界设备上建立 iBGP 会话');
  });
});

describe('末轮交叉核验：迁移前源码与迁移后网站的章节对应', () => {
  const html = (n: number) => netChapters[n - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html').map((block) => block.html).join('');
  it('旧 ch4 广播/以太网在运行时属于第5章，而 PPP 留在第4章', () => {
    expect(html(4)).not.toContain('0x04C11DB7');
    expect(html(5)).toContain('0x04C11DB7');
    expect(html(5)).toContain('5 字节 SNAP 协议标识：3 字节 OUI + 2 字节 PID');
    expect(netChapters[4].toc.some((entry) => entry.id === 'sec-ch5-broadcast-h4')).toBe(true);
    expect(html(4)).toContain('并非所有数据链路层协议都提供无差错、可靠交付保证');
    expect(html(4)).toContain('归入<strong>第5章局域网</strong>');
    expect(html(5)).toContain('本地管理、随机化 MAC 地址');
  });
});

describe('全量专项复核：协议定义、分层模型与窗口边界', () => {
  const chapterHtml = (n:number) => netChapters[n-1].sections.flatMap(s=>s.blocks)
    .filter(b=>b.type==='html').map(b=>b.html).join('');
  it('第1章：报文交换不默认通知发送端错误，IP 尽力交付不等于可靠送达',()=>{
    expect(chapterHtml(1)).toContain('是否逐跳检错、出现错误后通知发送方');
    expect(chapterHtml(1)).toContain('普通 IP 数据报本身不保证可靠送达');
  });
  it('第2章：OSI 网络层不被等同于 ARP 的 MAC 地址解析',()=>{
    expect(chapterHtml(2)).toContain('不能概括为 OSI 网络层必须自行把网络地址直接翻译为物理地址');
  });
  it('第4章：PPP 基础帧为变长字段，按具体物理链路确定填充方式',()=>{
    const html=chapterHtml(4);
    expect(html).toContain('短帧不需要自动填充至 1500 字节');
    expect(html).toContain('默认最大接收单元 MRU 为 1500 字节');
    expect(html).toContain('通过 LCP 地址/控制域压缩（ACFC）');
    expect(html).toContain('协议字段压缩（PFC）');
    expect(html).toContain('SONET/SDH');
    expect(html).toContain('RFC 2615');
    expect(html).toContain('Configure-Reject 仅拒绝无法协商的选项');
    expect(html).toContain('并不提供基于帧确认与重传的可靠交付保证');
  });
  it('第6章：CIDR 仍可划分子网，不把所有 MAC 都解释为固定 OUI 厂商地址',()=>{
    const html=chapterHtml(6);
    expect(html).toContain('无分类编址并不等于不能再划分子网');
    expect(html).toContain('本地管理、随机化的 MAC 地址');
    expect(html).toContain('低层绝不可能读取更高层字段');
  });
  it('第7章：GBN 与 SR 循环序号规则、理想利用率不能超过100%',()=>{
    const html=chapterHtml(7);
    expect(html).toContain('U = min{1, n·T<sub>D</sub>');
    expect(html).toContain('W<sub>T</sub> ≤ 2<sup>m</sup>−1');
    expect(html).toContain('W<sub>T</sub>+W<sub>R</sub> ≤ 2<sup>m</sup>');
    expect(html).toContain('这不是所有现代 TCP 实现都采用的初始 cwnd');
    expect(html).toContain('保活（keepalive）是可选机制');
    expect(html).toContain('UDP 不提供这种可靠交付');
  });
  it('第8章：DNS 缓存可跳过根查询，TLS 不属于 TCP 内建机制',()=>{
    const html=chapterHtml(8);
    expect(html).toContain('TLS 不是 TCP 自身提供的安全服务');
    expect(html).toContain('解析器不必每次都从根开始');
    expect(html).toContain('不必持有该顶级域名下所有主机的 IP 地址');
    expect(html).toContain('客户端离线期间不会天然获得实时一致性保证');
  });
});

describe('计网试卷离线进度数据健壮性', () => {
  it('localStorage 保存无效 JSON/null/数组/标量时按空进度处理', () => {
    const original = localStorage.getItem(NET_PRACTICE_STORE_KEY);
    try {
      for (const bad of ['{bad json', 'null', '[]', '42', '"oops"']) {
        localStorage.setItem(NET_PRACTICE_STORE_KEY, bad);
        expect(readProgress(NET_PRACTICE_STORE_KEY), bad).toEqual({});
      }
      localStorage.setItem(
        NET_PRACTICE_STORE_KEY,
        JSON.stringify({ 'paper-2021:p1-s1': 'right', 'paper-2021:p1-s2': 'revealed' }),
      );
      expect(readProgress(NET_PRACTICE_STORE_KEY)).toEqual({
        'paper-2021:p1-s1': 'right',
        'paper-2021:p1-s2': 'revealed',
      });
    } finally {
      if (original === null) localStorage.removeItem(NET_PRACTICE_STORE_KEY);
      else localStorage.setItem(NET_PRACTICE_STORE_KEY, original);
    }
  });
});

describe('2025 原课件逐项对照：跨章节补遗与勘误', () => {
  const chapterHtml = (number: number) => netChapters[number - 1].sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'html')
    .map((block) => block.html).join('');

  it('第1章：丢包率、时延带宽积、RTT 对照原 PPT 第86—91页，计算单位正确', () => {
    const html = chapterHtml(1);
    expect(html).toContain('sec-ch1-performance-loss');
    expect(html).toContain('分组丢失率 = 丢失的分组数');
    expect(html).toContain('带宽（bit/s）× 单程传播时延（s）');
    expect(100_000_000 * 0.020).toBe(2_000_000);
    expect(netChapters[0].toc.some((entry) => entry.id === 'sec-ch1-performance-loss')).toBe(true);
  });

  it('第5章：经典千兆半双工 carrier extension 与 MAC 64字节最短帧不混淆', () => {
    const html = chapterHtml(5);
    expect(html).toContain('sec-ch5-lan-current-h1');
    expect(html).toContain('4096 bit times，即 512 字节时间');
    expect(html).toContain('最短合法长度仍是 64 字节');
    expect(html).toContain('S<sub>max</sub>');
    expect(netChapters[4].toc.some((entry) => entry.id === 'sec-ch5-lan-current-h1')).toBe(true);
  });

  it('第6章：RIP 与 ICMP 时间戳原课件错误已明确区分标准算法与字段定义', () => {
    const html = chapterHtml(6);
    expect(html).toContain('Bellman–Ford');
    expect(html).toContain('Ford–Fulkerson');
    expect(html).toContain('不是 RIP 的最短路径更新算法');
    expect(html).toContain('从 UTC 当日午夜起经过的毫秒数');
    expect(html).toContain('RFC 792');
  });

  it('第7章：IGMP 不是 UDP 应用层协议；IP Protocol 2 与 UDP 17 分清', () => {
    const html = chapterHtml(7);
    expect(html).toContain('IGMP 并不封装在 UDP 中');
    expect(html).toContain('Protocol = 2');
    expect(html).toContain('协议号是 <strong>17</strong>');
  });

  it('第8章：补齐 FTP、动态文档与搜索引擎，全部可通过目录锚点定位', () => {
    const chapter = netChapters[7],html = chapterHtml(8);
    const ids = ['sec-ch8-ftp','sec-ch8-ftp-h1','sec-ch8-ftp-h2','sec-ch8-ftp-h3',
      'sec-ch8-http-h6','sec-ch8-http-h7'];
    for (const id of ids) {
      expect(chapter.toc.some((entry) => entry.id === id), id + ' 目录不存在').toBe(true);
      if (id !== 'sec-ch8-ftp') expect(html).toContain('id="' + id + '"');
      else expect(chapter.sections.some((section) => section.id === id)).toBe(true);
    }
    expect(html).toContain('TCP 21');
    expect(html).toContain('主动（PORT）模式');
    expect(html).toContain('被动（PASV）模式');
    expect(html).toContain('CGI（Common Gateway Interface');
    expect(html).toContain('PageRank');
    expect(html).toContain('XHTML 将逐渐取代 HTML');
    expect(chapter.sections.length).toBe(5);
    // 2024 旧稿的邮件协议保留，而非误称来自 2025 第8章课件
    expect(chapter.sections.some((section) => section.id === 'sec-ch8-email')).toBe(true);
  });
});

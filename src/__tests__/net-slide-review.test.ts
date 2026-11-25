import { describe, expect, it } from 'vitest';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import { buildSlideReview, sourceExtraNotes } from '../content/net/slide-review';

describe('2025 计网课件主线', () => {
  it('八章知识单元顺序独立于旧讲义', () => {
    const orders = [["history","definition","function","structure","topology","classify-intro","switch","classify","performance"],["formation","protocol","layer","services","osi","pdu","five","tcpip"],["system","encoding","modulation","pcm","capacity","media","direction","serial","sync","mux","t1e1","stDM","sonet","switch","vc","physical"],["basic","frame","crc","reliable","sw","arq","window","srp","ppp","ppp-frame","ppp-transparent","ppp-state","crc-practice"],["lan","csma","traditional","util","mac","extend","vlan","fast"],["services","ip","address","mac","arp","header","forward","subnet","cidr","icmp","routing","rip","ospf"],["overview","udp","tcp","reliable","header","window","flow","rtt","connect","congestion"],["overview","dns","ftp","www","http","proxy","message","cookie","documents","dynamic-docs","search"]];
    expect(netChapters).toHaveLength(8);
    for (const [i, original] of netChapters.entries()) {
      const no = i + 1;
      const { chapter } = buildSlideReview(original);
      expect(chapter.sections.map(s => s.id)).toEqual(orders[i].map(k => `sec-ch${no}-src-${k}`));
      expect(chapter.sections.map(s => s.heading.match(/^\d+\.(?!\d)/)?.[0])).toEqual(orders[i].map((_, j) => `${j+1}.`));
      expect(chapter.sections.some(s => /^\d+\.\d+/.test(s.heading))).toBe(false);
      expect(sourceExtraNotes[no]).toBeTruthy();
      expect(chapter.toc.filter(e => e.id.includes('-src-')).map(e => e.id)).toEqual(chapter.sections.map(s => s.id));
    }
  });
  it('第4章后半部分按课件分别展示可靠传输、SWP、GBN、滑动窗口、SRP和PPP', () => {
    const { chapter, resolve } = buildSlideReview(netChapters[3]);
    const byKey = (key: string) => chapter.sections.find(s => s.id === 'sec-ch4-src-' + key)!;
    const html = (key: string) => byKey(key).blocks.filter(b => b.type === 'html').map(b => b.html).join('');
    expect(html('sw')).toContain('完全理想化的数据传输');
    expect(html('sw')).toContain('四种典型情形');
    expect(html('arq')).toContain('DATA0～DATA5');
    expect(html('window')).toContain('接收窗口三阶段');
    expect(html('srp')).toContain('选择重传窗口的限制');
    expect(html('crc-practice')).toContain('本章最后一页的 CRC 练习');
    expect(html('ppp-transparent')).toContain('第67—68页原例');
    expect(byKey('arq').blocks.some(b=>b.type==='demo' && b.name==='net-gbn')).toBe(true);
    expect(byKey('srp').blocks.some(b=>b.type==='demo' && b.name==='net-sr')).toBe(true);
    expect(resolve('sec-ch4-flow-h2')).toBeDefined();
    expect(html('sw')).not.toContain('本节属于拓展自学内容');
  });
  it('新正文三级标题均有目录锚点且无重复ID', () => {
    for (const original of netChapters) {
      const {chapter,resolve}=buildSlideReview(original);
      const ids=chapter.toc.map(e=>e.id);
      expect(new Set(ids).size).toBe(ids.length);
      for(const section of chapter.sections) {
        const first=section.blocks[0];
        if(first.type!=='html') throw new Error('缺少主线正文');
        expect(first.html).not.toMatch(/<h3>/);
        for(const m of first.html.matchAll(/<h3 id="([^"]+)">/g)) {
          expect(ids).toContain(m[1]);
          expect(resolve(m[1])).toBe(m[1]);
        }
      }
    }
  });
  it('全部课程作业仍可在主线定位且题目锚点不变', () => {
    for (const [i, original] of netChapters.entries()) {
      const no = i + 1;
      const review = buildSlideReview(original);
      for (const q of netHomework[no] ?? []) {
        expect(review.resolve(q.related), `第${no}章第${q.no}题：${q.related}`).toBeDefined();
        expect(review.resolve(`sec-ch${no}-hw-${q.no}`)).toBe(`sec-ch${no}-hw-${q.no}`);
      }
    }
  });
  it('独立的额外讲义锚点不冒充课件正文', () => {
    expect(buildSlideReview(netChapters[3]).resolve('sec-ch4-p2p-h1')).toBeUndefined();
    expect(buildSlideReview(netChapters[7]).resolve('sec-ch8-http-h5')).toBeUndefined();
  });
  it('详细主线不能退化成知识点摘要，且保留课内互动演示', () => {
    for (const original of netChapters) {
      const { chapter } = buildSlideReview(original);
      const html = (c: typeof original) => c.sections.flatMap(s=>s.blocks).filter(b=>b.type==='html').map(b=>b.html).join('');
      // Only visible text counts: SVG markup cannot artificially inflate coverage.
      const size = (c: typeof original) => html(c).replace(/<svg\b[\s\S]*?<\/svg>/gi,'').replace(/<[^>]*>/g,'').replace(/\s/g,'').length;
      expect(size(chapter), original.title).toBeGreaterThan(4000);
      expect(size(chapter), original.title).toBeGreaterThanOrEqual(size(original)*0.60);
      const demos=chapter.sections.flatMap(s=>s.blocks).filter(b=>b.type==='demo');
      expect(demos.length,original.title).toBeGreaterThan(0);
    }
  });
});

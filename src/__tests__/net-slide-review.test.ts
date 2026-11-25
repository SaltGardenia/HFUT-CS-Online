import { describe, expect, it } from 'vitest';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import { buildSlideReview, sourceExtraNotes } from '../content/net/slide-review';

describe('2025 计网课件主线', () => {
  it('八章知识单元顺序独立于旧讲义', () => {
    const orders = [["history","definition","function","structure","topology","classify-intro","switch","classify","performance"],["formation","protocol","layer","services","osi","pdu","five","tcpip"],["system","encoding","modulation","pcm","capacity","media","direction","serial","sync","mux","t1e1","stDM","sonet","switch","vc","physical"],["basic","frame","crc","sw","arq","ppp"],["lan","csma","traditional","util","mac","extend","vlan","fast"],["services","ip","address","mac","arp","header","forward","subnet","cidr","icmp","routing","rip","ospf"],["overview","udp","tcp","reliable","header","window","rtt","connect","congestion"],["overview","dns","ftp","www","http","proxy","message","documents","search"]];
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

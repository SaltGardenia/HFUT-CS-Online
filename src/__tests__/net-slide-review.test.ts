import { describe, expect, it } from 'vitest';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import { buildSlideReview, sourceExtraNotes, originalHighlightTargets } from '../content/net/slide-review';

describe('2025 计网课件主线', () => {
  it('八章知识单元顺序独立于旧讲义', () => {
    const orders = [["history","definition","function","structure","topology","classify-intro","switch","classify","performance"],["building","formation","protocol","layer","services","osi","pdu","five","tcpip"],["system","encoding","modulation","pcm","capacity","media","direction","serial","sync","mux","t1e1","stDM","sonet","switch","vc","physical"],["basic","frame","crc","reliable","sw","arq","window","srp","ppp","ppp-frame","ppp-transparent","ppp-state","crc-practice"],["lan","csma","traditional","util","mac","extend","vlan","fast"],["services","ip","address","mac","arp","header","forward","subnet","cidr","icmp","routing","rip","ospf"],["overview","udp","tcp","reliable","header","window","flow","rtt","connect","congestion"],["overview","dns","ftp","www","http","proxy","message","cookie","documents","dynamic-docs","search"]];
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
        const html=section.blocks.filter(b=>b.type==='html').map(b=>b.html).join('');
        expect(html).not.toMatch(/<h3>/);
        for(const m of html.matchAll(/<h3 id="([^"]+)">/g)) {
          expect(ids).toContain(m[1]);
          expect(resolve(m[1])).toBe(m[1]);
        }
      }
    }
  });
  it('图像型课件中易漏的重点保留在主线且归属正确', () => {
    const html=(n:number,k:string)=>buildSlideReview(netChapters[n-1]).chapter.sections.find(s=>s.id==='sec-ch'+n+'-src-'+k)!.blocks.filter(b=>b.type==='html').map(b=>b.html).join('');
    for(const [n,k,word] of [[1,'classify','第一个路由器'],[1,'performance','838.8608'],[2,'building','多播／组播地址'],[3,'encoding','01001100011'],[3,'pcm','011 100 011 011 001 100'],[3,'pcm','差分脉码调制'],[3,'capacity','码间串扰'],[3,'t1e1','274.176'],[4,'frame','Start Of Header'],[5,'vlan','广播风暴'],[6,'address','221.45.71.255'],[6,'routing','内部网关协议'],[6,'ospf','600年'],[7,'flow','900字节滑动窗口'],[7,'congestion','闭环控制的三项措施'],[7,'congestion','第134页 TCP 拥塞控制流程图'],[8,'search','分类检索的界面示例']] as const){
      expect(html(n,k), '第'+n+'章 '+k).toContain(word);
    }
    const {chapter}=buildSlideReview(netChapters[2]);
    expect(chapter.sections.find(s=>s.id==='sec-ch3-src-capacity')!.blocks.some(b=>b.type==='demo' && b.name==='net-nyquist')).toBe(true);
  });
  it('八章旧标题仅映射至现有知识点，重点不重复创建目录', () => {
    for (const original of netChapters) {
      const {chapter,resolve}=buildSlideReview(original);
      const legacy=new Set(original.toc.filter(e=>e.level===3&&!e.id.includes('-hw-')).map(e=>e.id));
      for(const entry of chapter.toc)expect(legacy.has(entry.id)).toBe(false);
      const text=chapter.sections.flatMap(s=>s.blocks).filter(b=>b.type==='html').map(b=>b.html).join('');
      expect(text).not.toContain('原有讲义中的详细图解与补充说明');
      for(const m of text.matchAll(/<h3 id="([^"]+)">/g))expect(legacy.has(m[1])).toBe(false);
      for(const old of legacy) {
        const mapped=resolve(old);
        if(mapped)expect(chapter.toc.some(e=>e.id===mapped)).toBe(true);
      }
    }
    const {chapter,resolve}=buildSlideReview(netChapters[3]);
    const id=resolve('sec-ch4-flow-h1')!;
    expect(chapter.toc.find(e=>e.id===id)?.text).toContain('四种典型情形');
    expect(chapter.toc.some(e=>e.text.includes('停—等协议'))).toBe(false);
    expect(chapter.toc.some(e=>e.text.includes('四种情况分别画时间线'))).toBe(false);
    const sw=chapter.sections.find(s=>s.id==='sec-ch4-src-sw')!;
    expect(sw.heading).not.toContain('★');
    expect(chapter.toc.find(e=>e.id===id)?.text).toContain('★');
    expect(sw.blocks.some(b=>b.type==='demo'&&b.name==='net-stop-wait')).toBe(true);
  });
  it('荧光笔严格来自原PDF，旧版星号与作业优先级不再传播', () => {
    const lookup=(n:number)=>buildSlideReview(netChapters[n-1]).chapter;
    const stars=(n:number)=>lookup(n).toc.filter(e=>e.text.includes('★'));
    expect(stars(8)).toHaveLength(0);
    expect(stars(3).some(e=>e.id==='sec-ch3-src-capacity')).toBe(false);
    expect(stars(4).some(e=>/src-ppp-(frame|transparent|state)$/.test(e.id))).toBe(false);
    expect(stars(7).some(e=>/src-(udp|tcp|connect)$/.test(e.id))).toBe(false);
    expect(stars(1).some(e=>e.text.includes('五种拓扑'))).toBe(true);
    expect(stars(3).some(e=>e.text.includes('字符同步'))).toBe(true);
    expect(stars(5).some(e=>e.text.includes('双绞线星形'))).toBe(true);
    for(let n=1;n<=8;n++){
      const html=lookup(n).sections.flatMap(s=>s.blocks).filter(b=>b.type==='html').map(b=>b.html).join('');
      expect((html.match(/data-source-highlight="true"/g)??[]).length).toBe(originalHighlightTargets[n].length);
    }
  });
  it('八章文字结构图均转为具备可访问说明的SVG，保留原始计算和报文代码', () => {
    let count=0;
    for(const original of netChapters){
      const {chapter}=buildSlideReview(original);
      const html=chapter.sections.flatMap(s=>s.blocks).filter(b=>b.type==='html').map(b=>b.html).join('');
      const figures=[...html.matchAll(/<figure class="fig net-review-diagram" data-review-diagram="([^"]+)"[\s\S]*?<\/figure>/g)];
      expect(figures.length,original.title).toBeGreaterThan(0);
      for(const fig of figures){
        expect(fig[0]).toContain('<svg');
        expect(fig[0]).toContain('role="img"');
        expect(fig[0]).toContain('<desc>');
        expect(fig[0]).toContain('<figcaption>');
      }
      count+=figures.length;
      expect(new Set(figures.map(f=>f[1])).size).toBe(figures.length);
    }
    expect(count).toBe(55);
    const ch4=buildSlideReview(netChapters[3]).chapter.sections.find(s=>s.id==='sec-ch4-src-crc')!;
    expect(ch4.blocks.filter(b=>b.type==='html').map(b=>b.html).join('')).toContain('<pre>1100110000');
    const ch8=buildSlideReview(netChapters[7]).chapter.sections.find(s=>s.id==='sec-ch8-src-message')!;
    expect(ch8.blocks.filter(b=>b.type==='html').map(b=>b.html).join('')).toContain('<pre>GET /index.html HTTP/1.1');
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

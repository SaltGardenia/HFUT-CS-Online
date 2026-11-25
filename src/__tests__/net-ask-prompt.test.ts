import {describe, it, expect} from 'vitest';
import {buildNetAskPrompt, netAskReference} from '../lib/netAskPrompt';

describe('计网问问 AI 链接', () => {
  it('定位点击的知识点而非原来滚动到的知识点，且不携带无关参数', () => {
    const ref = netAskReference('https://example.com/HFUT-CS-Online/?token=private#/net/deck/ch4?s=old&other=private','ch4','sec-ch4-src-crc','main');
    expect(ref).toEqual({url:'https://example.com/HFUT-CS-Online/#/net/deck/ch4?s=sec-ch4-src-crc',source:false});
    const prompt = buildNetAskPrompt('第4章 数据链路层','CRC',ref);
    expect(prompt).toContain('CRC');
    expect(prompt).toContain(ref.url);
    expect(prompt).toContain('如果无法访问或提取正文');
    expect(prompt).not.toContain('private');
  });
  it('保留补充和历史原讲义的复习模式', () => {
    const url = 'https://example.com/HFUT-CS-Online/#/net/deck/ch6';
    expect(netAskReference(url,'ch6','sec-ch6-supp-bgp','supplement').url).toContain('?view=supplement&s=sec-ch6-supp-bgp');
    expect(netAskReference(url,'ch6','sec-ch6-protocol-h2','extra').url).toContain('?view=extra&s=sec-ch6-protocol-h2');
  });
  it('本地、私有地址和文件页面使用公开讲义源码，不泄露内部地址', () => {
    for (const href of ['http://localhost:5173/HFUT-CS-Online/','http://127.0.0.1:5173/','http://192.168.1.2/','http://172.20.1.2/','http://[::1]/','file:///tmp/index.html']) {
      const ref=netAskReference(href,'ch4','sec-ch4-src-crc','main');
      expect(ref.source).toBe(true);
      expect(ref.url).toBe('https://github.com/Junpgle/HFUT-CS-Online/blob/main/src/content/net/slide-review.ts');
    }
  });
});

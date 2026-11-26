import { describe, expect, it } from 'vitest';
import { askAiReference, buildAskPrompt } from '../lib/askAiPrompt';

const REPO = 'https://github.com/Junpgle/HFUT-CS-Online';

describe('问问 AI 的链接与提示词', () => {
  it('定位当前知识点，清掉查询串和无关参数', () => {
    const ref = askAiReference(
      'https://example.com/HFUT-CS-Online/?token=private#/net/deck/ch4?s=old&other=private',
      'sec-ch4-src-crc',
    );
    expect(ref).toEqual({ url: 'https://example.com/HFUT-CS-Online/#/net/deck/ch4?s=sec-ch4-src-crc', source: false });

    const prompt = buildAskPrompt('计算机网络', '第4章 数据链路层', 'CRC', ref);
    expect(prompt).toContain('计算机网络');
    expect(prompt).toContain('CRC');
    expect(prompt).toContain(ref.url);
    expect(prompt).toContain('如果无法访问或提取正文');
    expect(prompt).not.toContain('private');
  });

  it('保留计网复习模式 view，其它课程的普通路由同样可用', () => {
    const netUrl = 'https://example.com/HFUT-CS-Online/#/net/deck/ch6?view=supplement&s=old';
    expect(askAiReference(netUrl, 'sec-ch6-supp-bgp').url).toContain('?view=supplement&s=sec-ch6-supp-bgp');
    expect(askAiReference(netUrl, 'sec-ch6-protocol-h2').url).toContain('?view=supplement&s=sec-ch6-protocol-h2');

    const os = askAiReference('https://example.com/HFUT-CS-Online/#/os/chapter/ch3?s=old', 'sec-os-ch3-1');
    expect(os).toEqual({ url: 'https://example.com/HFUT-CS-Online/#/os/chapter/ch3?s=sec-os-ch3-1', source: false });
  });

  it('本地、私有地址和文件页面回退到公开仓库，不泄露内部地址', () => {
    for (const href of [
      'http://localhost:5173/HFUT-CS-Online/',
      'http://127.0.0.1:5173/',
      'http://192.168.1.2/',
      'http://172.20.1.2/',
      'http://[::1]/',
      'file:///tmp/index.html',
    ]) {
      const ref = askAiReference(href, 'sec-x');
      expect(ref).toEqual({ url: REPO, source: true });
      expect(buildAskPrompt('操作系统', '第3章', '进程', ref)).toContain(REPO);
    }
  });
});

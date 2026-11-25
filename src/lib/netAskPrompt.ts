/** Build a shareable, knowledge-point-specific prompt without copying page text or sensitive URL parameters. */
export type NetAskMode = 'main' | 'supplement' | 'extra';

const repository = 'https://github.com/Junpgle/HFUT-CS-Online/blob/main/src/content/net/';

function isLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') ||
      host === 'localhost' || host === '::1' || host.includes(':')) return true;
  return /^(127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|0\.)/.test(host);
}

export function netAskReference(href: string, deck: string, anchor: string, mode: NetAskMode): { url: string; source: boolean } {
  try {
    const url = new URL(href);
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !isLocalHost(url.hostname)) {
      url.username = '';
      url.password = '';
      url.search = '';
      const query = new URLSearchParams();
      if (mode !== 'main') query.set('view', mode);
      query.set('s', anchor);
      url.hash = '/net/deck/' + encodeURIComponent(deck) + '?' + query.toString();
      return {url: url.href, source: false};
    }
  } catch {
    // Local files and development pages cannot be fetched by remote AI.
  }
  const file = mode === 'supplement' ? 'supplement.ts' : mode === 'extra' ? 'index.ts' : 'slide-review.ts';
  return {url: repository + file, source: true};
}

export function buildNetAskPrompt(scope: string, title: string, reference: {url:string;source:boolean}): string {
  return '请通俗地讲解计算机网络（' + scope + '）中的「' + title + '」，并举一个具体例子。\n\n' +
    (reference.source ? '当前为本地页面，公开讲义源码参考：' : '当前知识点链接：') + reference.url +
    '\n请尽量联网阅读链接中的相应内容，结合该讲义解释；如果无法访问或提取正文，请明确说明，并根据知识点标题讲解，不要假称已阅读。';
}

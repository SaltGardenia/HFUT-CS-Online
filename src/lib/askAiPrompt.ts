/** 生成「问问 AI」的提示词与定位链接：只带课程/知识点标题与锚点，不复制正文或私有参数。 */

export interface AskReference {
  url: string;
  source: boolean;
}

const SOURCE_REPO = 'https://github.com/Junpgle/HFUT-CS-Online';

function isLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') ||
      host === 'localhost' || host === '::1' || host.includes(':')) return true;
  return /^(127\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|0\.)/.test(host);
}

/**
 * 知识点定位链接：保留当前 hash 路由与复习模式（view），只把 s 换成目标锚点。
 * 本地、私网与 file:// 页面无法被远端 AI 读取，回退到公开仓库。
 */
export function askAiReference(href: string, anchor: string): AskReference {
  try {
    const url = new URL(href);
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !isLocalHost(url.hostname)) {
      url.username = '';
      url.password = '';
      url.search = '';
      const hash = url.hash.replace(/^#/, '');
      const queryAt = hash.indexOf('?');
      const path = queryAt < 0 ? hash : hash.slice(0, queryAt);
      const current = new URLSearchParams(queryAt < 0 ? '' : hash.slice(queryAt + 1));
      const next = new URLSearchParams();
      const view = current.get('view');
      if (view) next.set('view', view);
      next.set('s', anchor);
      url.hash = path + '?' + next.toString();
      return { url: url.href, source: false };
    }
  } catch {
    // 本地文件或开发页面无法被远端 AI 抓取。
  }
  return { url: SOURCE_REPO, source: true };
}

export function buildAskPrompt(course: string, scope: string, title: string, reference: AskReference): string {
  const courseLabel = course.trim() || '本课程';
  return '请通俗地讲解' + courseLabel + '（' + scope + '）中的「' + title + '」，并举一个具体例子。\n\n' +
    (reference.source ? '当前为本地页面，公开讲义源码参考：' : '当前知识点链接：') + reference.url +
    '\n请尽量联网阅读链接中的相应内容，结合该讲义解释；如果无法访问或提取正文，请明确说明，并根据知识点标题讲解，不要假称已阅读。';
}

import { askAiReference, buildAskPrompt } from './askAiPrompt';

type AskProvider = { id: string; name: string; home: string; param?: string };

const askProviders: AskProvider[] = [
  { id: 'chatgpt', name: 'ChatGPT', home: 'https://chatgpt.com/', param: 'q' },
  { id: 'kimi', name: 'Kimi', home: 'https://www.kimi.com/', param: 'prefill_prompt' },
  { id: 'deepseek', name: 'DeepSeek', home: 'https://chat.deepseek.com/' },
  { id: 'qwen', name: '通义千问', home: 'https://www.qianwen.com/' },
  { id: 'doubao', name: '豆包', home: 'https://www.doubao.com/chat/' },
  { id: 'yuanbao', name: '腾讯元宝', home: 'https://yuanbao.tencent.com/' },
  { id: 'claude', name: 'Claude', home: 'https://claude.ai/new', param: 'q' },
  { id: 'gemini', name: 'Gemini', home: 'https://gemini.google.com/app' },
  { id: 'grok', name: 'Grok', home: 'https://grok.com/', param: 'q' },
  { id: 'perplexity', name: 'Perplexity', home: 'https://www.perplexity.ai/search', param: 'q' },
];

const PROVIDER_KEY = 'hfut-ask-ai-provider';
/** 计网旧版单独使用过的键，保留用户选择。 */
const LEGACY_PROVIDER_KEY = 'hfut-net-ask-ai-provider';

const providerColors: Record<string, string> = {
  chatgpt: '#168575', kimi: '#5359df', deepseek: '#4d6bfe', qwen: '#7654ed',
  doubao: '#3378f5', yuanbao: '#158c79', claude: '#c56e4c', gemini: '#4977e9',
  grok: '#6b7280', perplexity: '#20808d',
};

/** 章节页根节点：课程首页、练习页、附件页不带这两个属性，不添加提问按钮。 */
const PAGE_SELECTOR = '.page[data-deck], .page[data-chapter]';

function providerIcon(provider: AskProvider) {
  const icon = document.createElement('span');
  icon.className = 'ask-ai-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.style.setProperty('--provider-color', providerColors[provider.id] ?? '#64748b');
  icon.textContent = provider.name.slice(0, 1);
  const img = document.createElement('img');
  img.alt = '';
  img.width = 18;
  img.height = 18;
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.style.opacity = '0';
  img.addEventListener('load', () => { img.style.opacity = '1'; });
  img.addEventListener('error', () => { img.remove(); });
  img.src = new URL('/favicon.ico', provider.home).href;
  icon.appendChild(img);
  return icon;
}

function askAiGlyph(path: string, className = '') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'ask-ai-glyph ' + className);
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', path);
  svg.appendChild(p);
  return svg;
}

function providerUrl(provider: AskProvider, prompt: string) {
  const url = new URL(provider.home);
  if (provider.param) url.searchParams.set(provider.param, prompt);
  return url.toString();
}

interface HeadingEntry {
  heading: HTMLElement;
  anchor: string;
  level: number;
  title: string;
  sectionTitle: string;
  parentTitle: string;
}

interface Control {
  heading: HTMLElement;
  wrap: HTMLElement;
  refresh: () => void;
  close: () => void;
}

export interface AskAiController {
  scan: () => void;
  destroy: () => void;
}

/** 标题文本：h2 的编号与标题是分开的 span，需要补回空格；已插入的按钮不参与文本。 */
function headingText(heading: HTMLElement): string {
  const no = heading.querySelector(':scope > .h2-no')?.textContent?.trim() ?? '';
  const titleEl = heading.querySelector(':scope > .h2-title');
  if (titleEl) return `${no ? no + ' ' : ''}${(titleEl.textContent ?? '').trim()}`.trim();
  const clone = heading.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.ask-ai').forEach((el) => el.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function collectEntries(page: HTMLElement): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  for (const section of Array.from(page.querySelectorAll('section'))) {
    const firstH2 = section.querySelector<HTMLElement>('h2[id]');
    let anchor = firstH2?.id ?? '';
    let sectionTitle = firstH2 ? headingText(firstH2) : '';
    let parentTitle = '';
    for (const heading of Array.from(section.querySelectorAll<HTMLElement>('h2, h3, h4'))) {
      const level = Number(heading.tagName.slice(1));
      const title = headingText(heading);
      if (!title) continue;
      if (level === 2) sectionTitle = title;
      if (level === 3) parentTitle = title;
      if (heading.id) anchor = heading.id;
      if (!anchor) continue;
      entries.push({
        heading,
        anchor,
        level,
        title,
        sectionTitle,
        parentTitle: level === 4 ? parentTitle : '',
      });
    }
  }
  return entries;
}

/**
 * 在章节页的每个 h2/h3/h4 右侧挂「问问 AI」。
 * 不绑定具体课程：标题、章节和链接都从当前 DOM / URL 读取，所有课程共用。
 */
export function createAskAiController(course: string): AskAiController {
  let preferred = askProviders[0];
  try {
    const saved = localStorage.getItem(PROVIDER_KEY) ?? localStorage.getItem(LEGACY_PROVIDER_KEY);
    preferred = askProviders.find((provider) => provider.id === saved) ?? preferred;
  } catch {
    // 禁用本地存储时仍可正常提问。
  }

  let page: HTMLElement | null = null;
  let controls: Control[] = [];
  let listeners = false;

  const remember = (provider: AskProvider) => {
    preferred = provider;
    try {
      localStorage.setItem(PROVIDER_KEY, provider.id);
    } catch {
      // 不阻断提问。
    }
    controls.forEach((item) => item.refresh());
  };

  const closeAll = () => controls.forEach((item) => item.close());

  const mount = (entry: HeadingEntry, pageTitle: string): Control => {
    const { heading, anchor, level, title, sectionTitle, parentTitle } = entry;
    const clean = (value: string) => value.replace(/\s*★\s*$/, '').trim();
    const reference = askAiReference(window.location.href, anchor);
    const scope = [pageTitle, level > 2 ? sectionTitle : '', parentTitle]
      .filter(Boolean)
      .map((part) => clean(part))
      .join(' / ');
    const prompt = buildAskPrompt(course, scope, clean(title), reference);

    const wrap = document.createElement('span');
    wrap.className = 'ask-ai';
    const primary = document.createElement('a');
    primary.className = 'ask-ai-primary';
    primary.target = '_blank';
    primary.rel = 'noopener noreferrer';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'ask-ai-toggle';
    toggle.appendChild(askAiGlyph('m6 9 6 6 6-6'));
    toggle.setAttribute('aria-label', '选择 AI 平台');
    toggle.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('span');
    menu.className = 'ask-ai-menu';
    menu.hidden = true;
    const menuHeader = document.createElement('span');
    menuHeader.className = 'ask-ai-menu-header';
    menuHeader.textContent = '选择 AI 助手';
    const grid = document.createElement('span');
    grid.className = 'ask-ai-grid';
    menu.append(menuHeader, grid);

    const status = document.createElement('span');
    status.className = 'ask-ai-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    const close = () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    function copyQuestion() {
      status.hidden = false;
      status.textContent = '正在复制问题…';
      if (!navigator.clipboard?.writeText) {
        status.textContent = '请手动复制：' + prompt;
        return;
      }
      void navigator.clipboard.writeText(prompt).then(() => {
        status.textContent = '已复制问题和参考链接，可在 AI 中粘贴。';
      }).catch(() => {
        status.textContent = '请手动复制：' + prompt;
      });
    }

    const refresh = () => {
      primary.href = providerUrl(preferred, prompt);
      const label = document.createElement('span');
      label.textContent = '问问 AI';
      const model = document.createElement('span');
      model.className = 'ask-ai-current';
      model.textContent = preferred.name;
      primary.replaceChildren(askAiGlyph('M12 3 13.9 8.1 19 10 13.9 11.9 12 17 10.1 11.9 5 10 10.1 8.1 12 3 M19 13v6 M16 16h6 M5 3v4 M3 5h4'), label, model);
      primary.title = preferred.param ? '将知识点标题和链接传入 ' + preferred.name : '复制问题和链接并打开 ' + preferred.name;
      primary.setAttribute('aria-label', '向 ' + preferred.name + ' 提问：' + title);
      for (const link of Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[data-provider]'))) {
        const active = link.dataset.provider === preferred.id;
        link.classList.toggle('is-selected', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    };

    primary.addEventListener('click', () => {
      if (!preferred.param) copyQuestion();
    });

    toggle.addEventListener('click', () => {
      const willOpen = menu.hidden;
      closeAll();
      menu.hidden = !willOpen;
      status.hidden = true;
      toggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        menu.classList.remove('opens-up');
        const rect = wrap.getBoundingClientRect();
        const below = window.innerHeight - rect.bottom - 12;
        const above = rect.top - 12;
        if (below < menu.offsetHeight && above > below) menu.classList.add('opens-up');
      }
    });

    for (const provider of askProviders) {
      const link = document.createElement('a');
      link.dataset.provider = provider.id;
      link.href = providerUrl(provider, prompt);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'ask-ai-option';
      const labels = document.createElement('span');
      labels.className = 'ask-ai-labels';
      const name = document.createElement('span');
      name.className = 'ask-ai-name';
      name.textContent = provider.name;
      const mode = document.createElement('small');
      mode.textContent = provider.param ? '直接提问' : '复制并打开';
      labels.append(name, mode);
      link.append(providerIcon(provider), labels, askAiGlyph('m5 12 4 4L19 6', 'ask-ai-check'));
      link.addEventListener('click', () => {
        remember(provider);
        if (!provider.param) copyQuestion();
        close();
      });
      grid.appendChild(link);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'ask-ai-copy';
    copy.append(askAiGlyph('M8 8h12v12H8z M16 8V4H4v12h4'), document.createTextNode('仅复制问题'));
    copy.addEventListener('click', () => {
      copyQuestion();
      close();
    });
    menu.appendChild(copy);
    wrap.append(primary, toggle, menu, status);
    heading.classList.add('ask-ai-heading');
    heading.appendChild(wrap);
    refresh();
    return { heading, wrap, refresh, close };
  };

  const onOutside = (event: PointerEvent) => {
    if (event.target instanceof Element && !event.target.closest('.ask-ai')) closeAll();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeAll();
  };

  const bindListeners = () => {
    if (listeners) return;
    listeners = true;
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('keydown', onKey);
  };

  const clear = () => {
    for (const { heading, wrap } of controls) {
      wrap.remove();
      heading.classList.remove('ask-ai-heading');
      delete heading.dataset.askAi;
    }
    controls = [];
  };

  const scan = () => {
    // 转场时旧页面可能短暂留在 DOM，取最后一个（最新挂载的）章节页。
    const pages = document.querySelectorAll<HTMLElement>(PAGE_SELECTOR);
    const next = pages.length ? pages[pages.length - 1] : null;
    if (next !== page) {
      clear();
      page = next;
    }
    if (!page) return;

    // 复习模式切换会替换 section 节点：清掉已脱离文档的旧控件
    controls = controls.filter(({ heading, wrap }) => {
      if (heading.isConnected) return true;
      wrap.remove();
      delete heading.dataset.askAi;
      return false;
    });

    const pageTitle = headingText(page.querySelector<HTMLElement>('h1') ?? page);
    for (const entry of collectEntries(page)) {
      if (entry.heading.dataset.askAi === '1') continue;
      entry.heading.dataset.askAi = '1';
      controls.push(mount(entry, pageTitle));
    }
    if (controls.length) bindListeners();
  };

  const destroy = () => {
    clear();
    page = null;
    if (listeners) {
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('keydown', onKey);
      listeners = false;
    }
  };

  return { scan, destroy };
}

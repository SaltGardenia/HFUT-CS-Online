import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NET_BASE } from '../courses/registry';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import { buildSlideReview, sourceExtraNotes } from '../content/net/slide-review';
import NetHomework from './net/NetHomework';
import { useToc } from '../lib/toc';
import { decodeEntities } from '../lib/text';
import HtmlContent from '../components/HtmlContent';
import Sections from '../components/Sections';
import SectionCapsule from '../components/SectionCapsule';
import { scrollToId } from '../lib/scroll';
import { useScrollSpy } from '../lib/scrollspy';


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
const ASK_PROVIDER_KEY = 'hfut-net-ask-ai-provider';

const providerColors: Record<string, string> = {
  chatgpt: '#168575', kimi: '#5359df', deepseek: '#4d6bfe', qwen: '#7654ed',
  doubao: '#3378f5', yuanbao: '#158c79', claude: '#c56e4c', gemini: '#4977e9',
  grok: '#6b7280', perplexity: '#20808d',
};

function providerIcon(provider: AskProvider) {
  const icon = document.createElement('span');
  icon.className = 'net-ask-ai-icon';
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
  svg.setAttribute('class', 'net-ask-ai-glyph ' + className);
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

/** 只传课程、章节和知识点名称，不抓取正文，不限制原文长度。 */
function installNetAskAI(root: HTMLDivElement, chapter: (typeof netChapters)[number]) {
  let preferred = askProviders[0];
  try {
    preferred = askProviders.find((provider) => provider.id === localStorage.getItem(ASK_PROVIDER_KEY)) ?? preferred;
  } catch {
    // 禁用本地存储时仍可正常提问。
  }

  const entries = chapter.sections.flatMap((section) => {
    const container = document.getElementById(section.id)?.parentElement;
    if (!container || !root.contains(container)) return [];
    let parentTitle = '';
    return Array.from(container.querySelectorAll<HTMLElement>('h2, h3, h4')).map((heading) => {
      const level = Number(heading.tagName.slice(1));
      const title = (heading.textContent ?? '').trim();
      if (level === 3) parentTitle = title;
      return {
        heading,
        level,
        title,
        sectionTitle: decodeEntities(section.heading),
        parentTitle: level === 4 ? parentTitle : '',
      };
    });
  });

  const controls: { heading: HTMLElement; wrap: HTMLElement; refresh: () => void; close: () => void }[] = [];

  function remember(provider: AskProvider) {
    preferred = provider;
    try {
      localStorage.setItem(ASK_PROVIDER_KEY, provider.id);
    } catch {
      // 不阻断提问。
    }
    controls.forEach((item) => item.refresh());
  }

  for (const { heading, level, title, sectionTitle, parentTitle } of entries) {
    if (!title) continue;
    const scope = [
      chapter.no + ' ' + decodeEntities(chapter.title),
      ...(level > 2 ? [sectionTitle] : []),
      ...(parentTitle ? [parentTitle] : []),
    ].join(' / ');
    const prompt = '请通俗地讲解计算机网络（' + scope + '）中的「' + title + '」，并举一个具体例子。';

    const wrap = document.createElement('span');
    wrap.className = 'net-ask-ai';
    const primary = document.createElement('a');
    primary.className = 'net-ask-ai-primary';
    primary.target = '_blank';
    primary.rel = 'noopener noreferrer';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'net-ask-ai-toggle';
    toggle.appendChild(askAiGlyph('m6 9 6 6 6-6'));
    toggle.setAttribute('aria-label', '选择 AI 平台');
    toggle.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('span');
    menu.className = 'net-ask-ai-menu';
    menu.hidden = true;
    const menuHeader = document.createElement('span');
    menuHeader.className = 'net-ask-ai-menu-header';
    menuHeader.textContent = '选择 AI 助手';
    const grid = document.createElement('span');
    grid.className = 'net-ask-ai-grid';
    menu.append(menuHeader, grid);

    const status = document.createElement('span');
    status.className = 'net-ask-ai-status';
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
        status.textContent = '已复制简短问题，可在 AI 中粘贴。';
      }).catch(() => {
        status.textContent = '请手动复制：' + prompt;
      });
    }

    const refresh = () => {
      primary.href = providerUrl(preferred, prompt);
      const label = document.createElement('span');
      label.textContent = '问问 AI';
      const model = document.createElement('span');
      model.className = 'net-ask-ai-current';
      model.textContent = preferred.name;
      primary.replaceChildren(askAiGlyph('M12 3 13.9 8.1 19 10 13.9 11.9 12 17 10.1 11.9 5 10 10.1 8.1 12 3 M19 13v6 M16 16h6 M5 3v4 M3 5h4'), label, model);
      primary.title = preferred.param ? '将知识点标题传入 ' + preferred.name : '复制简短问题并打开 ' + preferred.name;
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
      controls.forEach((item) => item.close());
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
      link.className = 'net-ask-ai-option';
      const labels = document.createElement('span');
      labels.className = 'net-ask-ai-labels';
      const name = document.createElement('span');
      name.className = 'net-ask-ai-name';
      name.textContent = provider.name;
      const mode = document.createElement('small');
      mode.textContent = provider.param ? '直接提问' : '复制并打开';
      labels.append(name, mode);
      link.append(providerIcon(provider), labels, askAiGlyph('m5 12 4 4L19 6', 'net-ask-ai-check'));
      link.addEventListener('click', () => {
        remember(provider);
        if (!provider.param) copyQuestion();
        close();
      });
      grid.appendChild(link);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'net-ask-ai-copy';
    copy.append(askAiGlyph('M8 8h12v12H8z M16 8V4H4v12h4'), document.createTextNode('仅复制问题'));
    copy.addEventListener('click', () => {
      copyQuestion();
      close();
    });
    menu.appendChild(copy);
    wrap.append(primary, toggle, menu, status);
    heading.classList.add('net-ask-ai-heading');
    heading.appendChild(wrap);
    controls.push({ heading, wrap, refresh, close });
    refresh();
  }

  const onOutside = (event: PointerEvent) => {
    if (event.target instanceof Element && !event.target.closest('.net-ask-ai')) {
      controls.forEach((item) => item.close());
    }
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') controls.forEach((item) => item.close());
  };
  document.addEventListener('pointerdown', onOutside);
  document.addEventListener('keydown', onKey);
  return () => {
    document.removeEventListener('pointerdown', onOutside);
    document.removeEventListener('keydown', onKey);
    for (const { heading, wrap } of controls) {
      wrap.remove();
      heading.classList.remove('net-ask-ai-heading');
    }
  };
}

const askAiStyles = `

.page h2.net-ask-ai-heading, .page h3.net-ask-ai-heading, .page h4.net-ask-ai-heading { display:flex; align-items:center; flex-wrap:wrap; gap:.45rem; }
.page h3.net-ask-ai-heading::before { flex:none; margin-right:.15rem; }
.page .net-ask-ai { --ask-accent:var(--deck-accent); margin-inline-start:auto; position:relative; display:inline-flex; align-items:center; flex:none; font-family:inherit; font-size:12px; font-weight:500; line-height:1.4; letter-spacing:0; color:var(--ink-2); white-space:nowrap; border:1px solid var(--hairline); border-radius:9px; background:var(--panel-solid); }
.page .net-ask-ai .net-ask-ai-glyph { display:block; width:15px; height:15px; flex:none; }
.page a.net-ask-ai-primary:not(.ext-card):not(.card):not(.btn):not(.net-paper-card), .page .net-ask-ai .net-ask-ai-toggle { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:30px; margin:0; padding:0 9px; border:0; background:transparent; color:var(--ink-2); font:inherit; text-decoration:none; cursor:pointer; box-sizing:border-box; }
.page a.net-ask-ai-primary:not(.ext-card):not(.card):not(.btn):not(.net-paper-card) { border-radius:8px 0 0 8px; }
.page .net-ask-ai .net-ask-ai-primary > .net-ask-ai-glyph { color:var(--ask-accent); }
.page .net-ask-ai .net-ask-ai-current { color:var(--ink-3); font-size:11px; }
.page .net-ask-ai .net-ask-ai-toggle { border-inline-start:1px solid var(--hairline-soft); border-radius:0 8px 8px 0; padding:0 7px; }
.page .net-ask-ai .net-ask-ai-toggle[aria-expanded="true"] .net-ask-ai-glyph { transform:rotate(180deg); }
.page a.net-ask-ai-primary:not(.ext-card):not(.card):not(.btn):not(.net-paper-card):hover, .page .net-ask-ai .net-ask-ai-toggle:hover { background:var(--panel-2); color:var(--ink); text-decoration:none; }
.page .net-ask-ai-menu { position:absolute; inset-inline-end:0; top:calc(100% + 8px); z-index:80; display:block; width:340px; max-width:calc(100vw - 28px); max-height:min(65vh,420px); overflow:auto; box-sizing:border-box; padding:10px; border:1px solid var(--hairline); border-radius:14px; background:var(--panel-solid); color:var(--ink); box-shadow:var(--shadow-2); white-space:normal; text-align:start; }
.page .net-ask-ai-menu.opens-up { top:auto; bottom:calc(100% + 8px); }
.page .net-ask-ai-menu[hidden], .page .net-ask-ai-status[hidden], .page .net-ask-ai-icon img[hidden] { display:none !important; }
.page .net-ask-ai-menu-header { display:block; padding:3px 5px 9px; color:var(--ink-3); font-size:11px; font-weight:600; }
.page .net-ask-ai-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:3px; }
.page a.net-ask-ai-option:not(.ext-card):not(.card):not(.btn):not(.net-paper-card) { display:flex; align-items:center; justify-content:flex-start; gap:8px; min-width:0; min-height:48px; box-sizing:border-box; margin:0; padding:7px 8px; border:1px solid transparent; border-radius:9px; color:var(--ink); background:transparent; font:inherit; text-decoration:none; }
.page .net-ask-ai-icon { display:grid; place-items:center; position:relative; width:25px; height:25px; flex:none; border-radius:7px; background:color-mix(in srgb,var(--provider-color) 12%,var(--panel-solid)); color:var(--provider-color); font-size:13px; font-weight:700; overflow:hidden; }
.page .net-ask-ai-icon img { position:absolute; inset:0; margin:auto; display:block; width:18px; height:18px; object-fit:contain; background:var(--panel-solid); border-radius:3px; }
.page .net-ask-ai-labels { display:flex; flex:1; min-width:0; flex-direction:column; gap:2px; }
.page .net-ask-ai-name { color:var(--ink); font-size:12px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.page .net-ask-ai-labels small { color:var(--ink-3); font-size:10px; font-weight:400; white-space:nowrap; }
.page .net-ask-ai .net-ask-ai-check { width:12px; height:12px; color:var(--ask-accent); visibility:hidden; }
.page a.net-ask-ai-option:not(.ext-card):not(.card):not(.btn):not(.net-paper-card):hover { background:var(--panel-2); color:var(--ink); text-decoration:none; }
.page a.net-ask-ai-option.is-selected:not(.ext-card):not(.card):not(.btn):not(.net-paper-card) { background:color-mix(in srgb,var(--ask-accent) 8%,var(--panel-solid)); border-color:color-mix(in srgb,var(--ask-accent) 22%,transparent); }
.page .net-ask-ai-option.is-selected .net-ask-ai-check { visibility:visible; }
.page .net-ask-ai-copy { display:flex; align-items:center; gap:8px; width:100%; margin-top:8px; padding:10px 8px 4px; border-top:1px solid var(--hairline-soft); color:var(--ink-2); font:inherit; text-align:start; }
.page .net-ask-ai-copy:hover { color:var(--ask-accent); }
.page .net-ask-ai-status { position:absolute; inset-inline-end:0; top:calc(100% + 8px); z-index:79; width:max-content; max-width:min(250px,calc(100vw - 28px)); padding:8px 10px; border-radius:9px; background:var(--panel-solid); color:var(--ink); border:1px solid var(--hairline); box-shadow:var(--shadow-1); white-space:normal; user-select:text; }
@media (max-width:380px) { .page .net-ask-ai-grid { grid-template-columns:1fr; } .page .net-ask-ai-menu { width:220px; } }
@media print { .page .net-ask-ai { display:none !important; } }
`;

/** 「计算机网络」章节页：/net/deck/chN */
export default function NetUnitPage() {
  const { deckId } = useParams();
  const chapter = netChapters.find((d) => d.id === deckId);
  if (!chapter) return <Navigate to={NET_BASE} replace />;
  return <NetUnitInner key={chapter.id} chapter={chapter} />;
}

function NetUnitInner({ chapter: original }: { chapter: (typeof netChapters)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const requested = params.get('s');
  const review = useMemo(() => buildSlideReview(original), [original]);
  const legacyAnchor = !!requested && !review.resolve(requested) && original.toc.some((e) => e.id === requested);
  const extra = params.get('view') === 'extra' || legacyAnchor;
  const chapter = extra ? original : review.chapter;
  const section = requested ? (extra ? requested : review.resolve(requested)) : undefined;
  useEffect(() => {
    if (legacyAnchor && params.get('view') !== 'extra') {
      navigate(`${NET_BASE}/deck/${original.id}?view=extra&s=${encodeURIComponent(requested!)}`, { replace: true });
    }
  }, [legacyAnchor, params, navigate, original.id, requested]);
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${NET_BASE}/deck/${chapter.id}?${extra ? 'view=extra&' : ''}s=${encodeURIComponent(id)}`, { replace: true });
  };

  useEffect(() => {
    toc.report(chapter.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id, extra]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section, extra]);

  useScrollSpy(pageRef, [chapter.id, extra]);

  useEffect(() => {
    if (!pageRef.current) return;
    return installNetAskAI(pageRef.current, chapter);
  }, [chapter]);

  const level2 = chapter.toc.filter((e) => e.level === 2);
  const chapterNo = Number(chapter.id.slice(2));
  const questions = netHomework[chapterNo] ?? [];
  // 与侧栏目录使用相同的 section id；把 h3 知识点归入所在 h2。
  const questionsForSection = new Map<string, typeof questions>();
  let parent = '';
  for (const entry of chapter.toc) {
    if (entry.level === 2) parent = entry.id;
    for (const q of questions) {
      if ((extra ? q.related : review.resolve(q.related)) !== entry.id) continue;
      const existing = questionsForSection.get(parent) ?? [];
      if (!existing.some((item) => item.no === q.no)) {
        questionsForSection.set(parent, [...existing, q]);
      }
    }
  }

  return (
    <div className="page" ref={pageRef} data-deck={chapter.id}>
      <style>{askAiStyles}</style>
      <h1>{decodeEntities(chapter.title)}</h1>
      <div className="lede">
        <HtmlContent html={chapter.lede} />
      </div>
      <nav className="topic-map" aria-label="复习模式">
        <span className="topic-map-label">复习模式</span>
        <button className="topic-chip" type="button" aria-pressed={!extra} style={{ fontWeight: !extra ? 700 : 400 }} onClick={() => { if (extra) { navigate(`${NET_BASE}/deck/${chapter.id}`, { replace: true }); window.scrollTo({ top: 0, behavior: 'auto' }); } }}>课件主线（详细讲义）</button>
        <button className="topic-chip" type="button" aria-pressed={extra} style={{ fontWeight: extra ? 700 : 400 }} onClick={() => { if (!extra) { navigate(`${NET_BASE}/deck/${chapter.id}?view=extra`, { replace: true }); window.scrollTo({ top: 0, behavior: 'auto' }); } }}>完整原讲义与拓展</button>
      </nav>
      <div className="callout tip">
        <p className="callout-h">{extra ? '原有讲义与拓展（非课件主线）' : '拓展与待核内容说明'}</p>
        <p>{sourceExtraNotes[chapterNo]} {extra ? '以下为原有讲义，含与主线重复的解释、拓展及尚未逐段核实的内容，不代表全部属于课件。' : '详细正文保留相关原有图解、例题和交互演示。「理解辅助」用于解释课内概念；「拓展」及「待核」不当作课件原有知识点。'}</p>
      </div>
      {level2.length > 1 && (
        <nav className="topic-map" aria-label="本章知识点导航">
          <span className="topic-map-label">本章脉络</span>
          {level2.map((e) => (
            <button key={e.id} type="button" className="topic-chip" onClick={() => jump(e.id)}>
              {decodeEntities(e.text)}
            </button>
          ))}
        </nav>
      )}
      {chapter.sections.map((section) => (
        <Fragment key={section.id}>
          <Sections sections={[section]} keepNumberDot />
          {(questionsForSection.get(section.id) ?? []).length > 0 && (
            <nav className="net-hw-context" aria-label="本节相关课程作业">
              <span>对应课程作业</span>
              {(questionsForSection.get(section.id) ?? []).map((question) => (
                <Link key={question.no} to={`${NET_BASE}/deck/${chapter.id}?s=sec-ch${chapterNo}-hw-${question.no}`}>
                  题 {question.no}
                </Link>
              ))}
            </nav>
          )}
        </Fragment>
      ))}
      <NetHomework chapterNo={chapterNo} questions={questions} />
      <SectionCapsule />
    </div>
  );
}

import { Fragment, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NET_BASE } from '../courses/registry';
import { netChapters } from '../content/net';
import { netHomework } from '../content/net/homework';
import NetHomework from './net/NetHomework';
import NetHighlights from './net/NetHighlights';
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
    toggle.textContent = '▾';
    toggle.setAttribute('aria-label', '选择 AI 平台');
    toggle.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('span');
    menu.className = 'net-ask-ai-menu';
    menu.hidden = true;

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
      primary.textContent = '问问 AI · ' + preferred.name + ' ↗';
      primary.title = preferred.param ? '将知识点标题传入 ' + preferred.name : '复制简短问题并打开 ' + preferred.name;
      primary.setAttribute('aria-label', '向 ' + preferred.name + ' 提问：' + title);
      for (const link of Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[data-provider]'))) {
        const active = link.dataset.provider === preferred.id;
        link.classList.toggle('is-selected', active);
      }
    };

    primary.addEventListener('click', () => {
      if (!preferred.param) copyQuestion();
    });

    toggle.addEventListener('click', () => {
      const willOpen = menu.hidden;
      controls.forEach((item) => item.close());
      menu.hidden = !willOpen;
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    for (const provider of askProviders) {
      const link = document.createElement('a');
      link.dataset.provider = provider.id;
      link.href = providerUrl(provider, prompt);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const name = document.createElement('span');
      name.textContent = provider.name;
      const mode = document.createElement('small');
      mode.textContent = provider.param ? '传入问题' : '复制并打开';
      link.append(name, mode);
      link.addEventListener('click', () => {
        remember(provider);
        if (!provider.param) copyQuestion();
        close();
      });
      menu.appendChild(link);
    }
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = '仅复制问题';
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
.net-ask-ai-heading { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
.net-ask-ai { margin-inline-start: auto; position: relative; display: inline-flex; align-items: center; flex-shrink: 0; font-family: inherit; font-size: .75rem; font-weight: 500; line-height: 1.5; color: var(--deck-accent, currentColor); white-space: nowrap; }
.net-ask-ai-primary, .net-ask-ai-toggle { font: inherit; color: inherit; background: transparent; border: 1px solid currentColor; padding: .2rem .6rem; cursor: pointer; text-decoration: none; }
.net-ask-ai-primary { border-radius: 999px 0 0 999px; }
.net-ask-ai-toggle { border-inline-start: 0; border-radius: 0 999px 999px 0; padding-inline: .45rem; }
.net-ask-ai-primary:hover, .net-ask-ai-primary:focus-visible, .net-ask-ai-toggle:hover { text-decoration: underline; }
.net-ask-ai-menu { position: absolute; inset-inline-end: 0; top: calc(100% + .35rem); z-index: 30; width: 15rem; max-width: calc(100vw - 2rem); max-height: min(60vh, 25rem); overflow: auto; padding: .35rem; border: 1px solid currentColor; border-radius: 10px; background: Canvas; color: CanvasText; box-shadow: 0 6px 24px #0002; }
.net-ask-ai-menu[hidden], .net-ask-ai-status[hidden] { display: none !important; }
.net-ask-ai-menu a, .net-ask-ai-menu button { display: flex; align-items: center; justify-content: space-between; gap: .5rem; width: 100%; box-sizing: border-box; padding: .45rem .6rem; border: 0; border-radius: 5px; font: inherit; color: inherit; background: transparent; cursor: pointer; text-decoration: none; text-align: start; }
.net-ask-ai-menu a:hover, .net-ask-ai-menu a:focus-visible, .net-ask-ai-menu button:hover, .net-ask-ai-menu a.is-selected { background: color-mix(in srgb, currentColor 10%, transparent); }
.net-ask-ai-menu small { opacity: .7; font-size: .68rem; }
.net-ask-ai-status { position: absolute; inset-inline-end: 0; top: calc(100% + .35rem); z-index: 29; width: max-content; max-width: min(20rem, calc(100vw - 2rem)); padding: .4rem .6rem; border-radius: 6px; background: Canvas; color: CanvasText; border: 1px solid currentColor; white-space: normal; user-select: text; }
@media print { .net-ask-ai { display: none !important; } }
`;

/** 「计算机网络」章节页：/net/deck/chN */
export default function NetUnitPage() {
  const { deckId } = useParams();
  const chapter = netChapters.find((d) => d.id === deckId);
  if (!chapter) return <Navigate to={NET_BASE} replace />;
  return <NetUnitInner key={chapter.id} chapter={chapter} />;
}

function NetUnitInner({ chapter }: { chapter: (typeof netChapters)[number] }) {
  const navigate = useNavigate();
  const toc = useToc();
  const [params] = useSearchParams();
  const section = params.get('s');
  const pageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const jump = (id: string) => {
    scrollToId(id);
    toc.setActive(id);
    navigate(`${NET_BASE}/deck/${chapter.id}?s=${id}`, { replace: true });
  };

  useEffect(() => {
    toc.report(chapter.toc, jump);
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.id]);

  useEffect(() => {
    if (!section) return;
    const t = window.setTimeout(() => scrollToId(section, firstRender.current), 80);
    firstRender.current = false;
    return () => window.clearTimeout(t);
  }, [section]);

  useScrollSpy(pageRef, [chapter.id]);

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
      if (q.related !== entry.id) continue;
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
      <NetHighlights chapterNo={chapterNo} />
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

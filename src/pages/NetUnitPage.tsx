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


const GPT_HOME = 'https://chatgpt.com/';
const GPT_URL_LIMIT = 7500;

/** 保留段落、列表、表格和公式的可读文本；不把交互控件或 HTML 标签传给 GPT。 */
function contextText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node instanceof Element) {
    const tag = node.tagName.toLowerCase();
    if (node.matches('button, script, style, textarea, input, .code-expand, .copy-btn, .net-ask-gpt')) return '';
    if (tag === 'img') return node.getAttribute('alt') ? ' [图：' + node.getAttribute('alt') + '] ' : '';
    if (tag === 'br') return '\n';
    const content = Array.from(node.childNodes).map(contextText).join('');
    if (tag === 'sup') return '^(' + content + ')';
    if (tag === 'sub') return '_(' + content + ')';
    if (tag === 'td' || tag === 'th') return content + ' | ';
    if (tag === 'li') return '\n- ' + content;
    if (/^(p|div|section|h[1-6]|ul|ol|tr|table|pre|figure|figcaption|text)$/.test(tag)) return '\n' + content + '\n';
    return content;
  }
  return Array.from(node.childNodes).map(contextText).join('');
}

function cleanContext(text: string): string {
  return text.replace(/[^\S\n]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** HTML 正文中的 h3/h4 与 React 渲染的 h2 共用同一套入口。 */
function installNetAskGPT(root: HTMLDivElement, chapter: (typeof netChapters)[number]) {
  const entries = chapter.sections.flatMap((section) => {
    const container = document.getElementById(section.id)?.parentElement;
    if (!container || !root.contains(container)) return [];
    return Array.from(container.querySelectorAll<HTMLElement>('h2, h3, h4')).map((heading) => ({
      heading,
      container,
      level: Number(heading.tagName.slice(1)),
      title: (heading.textContent ?? '').trim(),
      sectionTitle: decodeEntities(section.heading),
    }));
  });
  let dialog: HTMLDialogElement | undefined;

  function showCopyDialog(prompt: string) {
    dialog?.remove();
    const panel = document.createElement('dialog');
    dialog = panel;
    panel.className = 'net-ask-gpt-dialog';
    panel.setAttribute('aria-label', '完整知识点上下文');
    const title = document.createElement('h3');
    title.textContent = '复制完整上下文';
    const hint = document.createElement('p');
    hint.textContent = '这段知识点较长，为避免链接截断，请复制完整内容后打开 ChatGPT 并粘贴。';
    const field = document.createElement('textarea');
    field.value = prompt;
    field.readOnly = true;
    field.setAttribute('aria-label', '待复制的完整上下文');
    const actions = document.createElement('div');
    actions.className = 'net-ask-gpt-actions';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = '复制完整内容';
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(prompt);
        copy.textContent = '已复制';
      } catch {
        field.focus();
        field.select();
        copy.textContent = '请按 Ctrl/Cmd+C 复制';
      }
    });
    const open = document.createElement('a');
    open.href = GPT_HOME;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = '打开 ChatGPT ↗';
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '关闭';
    close.addEventListener('click', () => panel.close());
    panel.addEventListener('close', () => panel.remove(), { once: true });
    actions.append(copy, open, close);
    panel.append(title, hint, field, actions);
    document.body.appendChild(panel);
    panel.showModal();
  }

  const buttons = entries.map((entry, index) => {
    const { heading, container, level, title, sectionTitle } = entry;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'net-ask-gpt';
    btn.textContent = '问问 GPT ↗';
    btn.title = '将当前知识点及上下文带入新的 ChatGPT 对话';
    btn.setAttribute('aria-label', '问问 GPT：' + title);
    btn.addEventListener('click', () => {
      const range = document.createRange();
      range.setStartAfter(heading);
      const next = entries.slice(index + 1).find((item) => item.container === container && item.level <= level);
      if (next) range.setEndBefore(next.heading);
      else range.setEnd(container, container.childNodes.length);
      const body = cleanContext(contextText(range.cloneContents()));
      const prompt = [
        '我正在复习合肥工业大学《计算机网络》课程，请结合以下网站讲义上下文，帮助我理解当前知识点。',
        '章节：' + chapter.no + ' ' + decodeEntities(chapter.title),
        ...(level > 2 ? ['所属小节：' + sectionTitle] : []),
        '当前知识点：' + title,
        ...(entries[index - 1] ? ['前一知识点：' + entries[index - 1].title] : []),
        ...(entries[index + 1] ? ['后一知识点：' + entries[index + 1].title] : []),
        '【知识点原文】\n' + body,
        '【我的问题】\n请用通俗但严谨的语言解释该知识点，结合具体例子说明原理、易混概念和考试重点。如讲义与通行标准存在出入，请明确区分。不要把讲义中未出现的内容当成原文。',
      ].join('\n\n');
      const url = GPT_HOME + '?q=' + encodeURIComponent(prompt);
      if (url.length <= GPT_URL_LIMIT) window.open(url, '_blank', 'noopener,noreferrer');
      else showCopyDialog(prompt);
    });
    heading.classList.add('net-ask-gpt-heading');
    heading.appendChild(btn);
    return { heading, btn };
  });

  return () => {
    for (const { heading, btn } of buttons) {
      btn.remove();
      heading.classList.remove('net-ask-gpt-heading');
    }
    dialog?.remove();
  };
}

const askGptStyles = `
.net-ask-gpt-heading { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
.net-ask-gpt { margin-inline-start: auto; flex-shrink: 0; font-family: inherit; font-size: .75rem; font-weight: 500; line-height: 1.5; color: var(--deck-accent, currentColor); background: transparent; border: 1px solid currentColor; border-radius: 999px; padding: .2rem .65rem; cursor: pointer; white-space: nowrap; }
.net-ask-gpt:hover, .net-ask-gpt:focus-visible { text-decoration: underline; }
.net-ask-gpt-dialog { width: min(40rem, calc(100% - 2rem)); max-height: 85vh; box-sizing: border-box; padding: 1.25rem; border: 1px solid currentColor; border-radius: 12px; color: inherit; background: Canvas; }
.net-ask-gpt-dialog::backdrop { background: rgba(0,0,0,.48); }
.net-ask-gpt-dialog textarea { width: 100%; min-height: 12rem; max-height: 45vh; box-sizing: border-box; resize: vertical; font: inherit; color: CanvasText; background: Canvas; }
.net-ask-gpt-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-top: .75rem; }
.net-ask-gpt-actions button, .net-ask-gpt-actions a { font: inherit; color: inherit; padding: .35rem .7rem; border: 1px solid currentColor; border-radius: 6px; background: transparent; cursor: pointer; }
@media print { .net-ask-gpt, .net-ask-gpt-dialog { display: none !important; } }
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
    return installNetAskGPT(pageRef.current, chapter);
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
      <style>{askGptStyles}</style>
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

import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGO_BASE, NET_BASE } from '../courses/registry';
import { decks } from '../content';
import { parseLegacyHref, scrollToId } from '../lib/scroll';

/* ------------------------------------------------------- 轻量语法着色 */
const TOKEN_RE =
  /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b(?:for|while|if|else|return|do|then|to|downto|and|or|not|swap|int|void|char|bool|float|double|const|auto|include|iostream|algorithm|std|struct|new|delete|true|false|using|namespace|main|cout|cin|endl)\b)/g;

type Tok = { text: string; com: boolean };

/** 把整段代码切成 token 流（沿用原正则），供按行重排 */
function tokenize(text: string): Tok[] {
  const toks: Tok[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text))) {
    if (m.index > last) toks.push({ text: text.slice(last, m.index), com: false });
    toks.push({ text: m[0], com: !!(m[1] || m[2]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) toks.push({ text: text.slice(last), com: false });
  return toks;
}

function makeTokSpan(t: Tok, extra?: string) {
  const s = document.createElement('span');
  s.textContent = t.text;
  s.className = extra ? `tok-${t.com ? 'com' : extra}` : t.com ? 'tok-com' : '';
  return s;
}

/**
 * 语法着色 + 两段式行布局：每行拆成「语句 + 右对齐注释」两列（.cl），
 * 长行溢出时滚动的是注释而不是把注释拦腰截断在语句后面。
 */
function highlightCode(code: HTMLElement) {
  const toks = tokenize(code.textContent ?? '');
  const frag = document.createDocumentFragment();
  // 遇到注释 token 后，本行剩余内容都归入注释列（注释只会出现在行尾）
  const lines: { code: Tok[]; com: Tok[] }[] = [{ code: [], com: [] }];
  let inCom = false;
  for (const t of toks) {
    const parts = t.text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) {
        lines.push({ code: [], com: [] });
        inCom = false;
      }
      if (!p) return;
      const cur = lines[lines.length - 1];
      if (t.com || inCom) {
        inCom = true;
        cur.com.push({ text: p, com: true });
      } else {
        // 跨行 token 必须按行拆分后再放入对应行，否则整段文本会在每一行重复
        cur.code.push({ text: p, com: false });
      }
    });
  }
  const KW_RE =
    /^(for|while|if|else|return|do|then|to|downto|and|or|not|swap|int|void|char|bool|float|double|const|auto|include|iostream|algorithm|std|struct|new|delete|true|false|using|namespace|main|cout|cin|endl)$/;
  for (const line of lines) {
    // 语句尾部的对齐空格交给注释列的 16px 间距，不再占宽
    while (line.code.length && /^\s+$/.test(line.code[line.code.length - 1].text)) line.code.pop();
    const row = document.createElement('span');
    row.className = 'cl';
    const codeEl = document.createElement('span');
    codeEl.className = 'cl-code';
    for (const t of line.code) {
      const kind = /^["']/.test(t.text) ? 'str' : /^\d/.test(t.text) ? 'num' : KW_RE.test(t.text) ? 'kw' : '';
      codeEl.appendChild(makeTokSpan(t, kind || undefined));
    }
    row.appendChild(codeEl);
    if (line.com.length) {
      const comEl = document.createElement('span');
      comEl.className = 'cl-com';
      for (const t of line.com) comEl.appendChild(makeTokSpan(t));
      row.appendChild(comEl);
    }
    frag.appendChild(row);
  }
  code.replaceChildren(frag);
}

/** 代码复制文本：两段式行布局（.cl 块级行）按行重组换行 */
function codePlainText(code: HTMLElement): string {
  const rows = code.querySelectorAll('.cl');
  if (rows.length === 0) return code.textContent ?? '';
  return Array.from(rows)
    .map((r) => (r.textContent ?? '').replace(/\u00a0/g, ''))
    .join('\n');
}

function enhance(root: HTMLElement) {
  // 代码块：语法着色 + 复制按钮
  for (const pre of Array.from(root.querySelectorAll<HTMLPreElement>('pre.code'))) {
    if (pre.dataset.enhanced) continue;
    pre.dataset.enhanced = '1';
    const code = pre.querySelector('code');
    if (code) highlightCode(code);

    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.replaceWith(wrap);
    wrap.appendChild(pre);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    btn.addEventListener('click', () => {
      navigator.clipboard
        ?.writeText(code ? codePlainText(code) : '')
        .then(() => {
          btn.textContent = '已复制';
          window.setTimeout(() => (btn.textContent = '复制'), 1400);
        })
        .catch(() => (btn.textContent = '复制失败'));
    });
    wrap.appendChild(btn);

    // 长代码默认折叠（页面不再被拉得极长），点击在覆盖层里看完整代码
    if (code) {
      const rows = code.querySelectorAll('.cl').length || (code.textContent ?? '').split('\n').length;
      if (rows > CODE_COLLAPSE_LINES) {
        wrap.classList.add('clamped');
        // 折叠高度取整行：max-height 对齐行边界，避免把一行拦腰截断
        const cs = getComputedStyle(pre);
        const lh = parseFloat(cs.lineHeight) || 20;
        const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
        pre.style.maxHeight = `${Math.max(4, Math.floor(172 / lh)) * lh + pad}px`;
        const expand = document.createElement('button');
        expand.type = 'button';
        expand.className = 'code-expand';
        expand.textContent = `查看完整代码（共 ${rows} 行）`;
        expand.addEventListener('click', () => {
          const pair = wrap.closest('.code-pair');
          openCodeLightbox((pair ?? wrap) as HTMLElement);
        });
        wrap.appendChild(expand);
      }
    }
  }

  // 宽表格：包一层横向滚动容器 + 按列内容自适应对齐
  for (const tbl of Array.from(root.querySelectorAll<HTMLTableElement>('table.tbl'))) {
    if (tbl.dataset.enhanced) continue;
    tbl.dataset.enhanced = '1';
    const scroll = document.createElement('div');
    scroll.className = 'tbl-scroll';
    tbl.replaceWith(scroll);
    scroll.appendChild(tbl);
    fitTableAlignment(tbl);
  }

  // 首页讲次卡片：补充「N 个动画 · M 道自测」元信息，便于扫读比较
  for (const a of Array.from(root.querySelectorAll<HTMLAnchorElement>('.deck-map a.card'))) {
    if (a.dataset.enhanced) continue;
    a.dataset.enhanced = '1';
    const href = a.getAttribute('href') ?? '';
    const m = href.match(/deck(\d)\.html/) ?? href.match(/deck\/deck(\d)/);
    if (!m) continue;
    const deck = decks.find((d) => d.id === `deck${m[1]}`);
    if (!deck) continue;
    const demos = deck.sections.reduce((n, s) => n + s.blocks.filter((b) => b.type === 'demo').length, 0);
    const quiz = deck.sections.reduce((n, s) => n + s.blocks.filter((b) => b.type === 'quiz').length, 0);
    const meta = document.createElement('p');
    meta.className = 'card-meta';
    meta.textContent = `${demos} 个动画 · ${quiz} 道自测`;
    a.appendChild(meta);
  }

  // 已有 figure 包装的计网图：与其他课程一致，点击图本身直接放大。
  for (const plate of Array.from(root.querySelectorAll<HTMLElement>('figure.net-review-diagram'))) {
    if (plate.dataset.figEnhanced) continue;
    const svg = plate.querySelector<SVGElement>('svg');
    if (!svg) continue;
    plate.dataset.figEnhanced = '1';
    // 复用其他插图图版的手型光标、悬浮反馈与「点击放大」角标
    plate.classList.add('has-lightbox');
    const scroller = plate.querySelector<HTMLElement>('.net-diagram-scroll');
    let downX = 0;
    let downY = 0;
    plate.addEventListener('pointerdown', (e) => {
      downX = e.clientX;
      downY = e.clientY;
    });
    plate.addEventListener('click', (e) => {
      // 拖动横向滚动条（或被挤压的滚动区空白）不算点图
      if (scroller && e.target === scroller) return;
      if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return;
      openLightbox(plate, svg);
    });
  }

  // 插图图版：内容里的 <svg class="fig"> 包一层 <figure>，挂上点击放大（lightbox）
  for (const svg of Array.from(root.querySelectorAll<SVGElement>('svg.fig'))) {
    if (svg.dataset.figEnhanced) continue;
    svg.dataset.figEnhanced = '1';
    const plate = document.createElement('figure');
    plate.className = 'fig has-lightbox';
    svg.classList.remove('fig');
    svg.replaceWith(plate);
    plate.appendChild(svg);
    // 相邻的题注收进图版，缩放时一起看
    const cap = plate.nextElementSibling;
    if (cap && cap.classList.contains('fig-cap')) plate.appendChild(cap);
    plate.addEventListener('click', () => openLightbox(plate, svg));
  }
}

/**
 * 横向溢出渐隐：公式卡 / 表格滚动容器实际溢出（可滑）时挂 .edge-fade，
 * 提示「右边还有」；内容放得下则不挂，避免渐隐裁到正文。
 */
function fitOverflowFade(root: HTMLElement) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.formula, .tbl-scroll'));
  const update = () => {
    for (const el of els) {
      el.classList.toggle('edge-fade', el.scrollWidth > el.clientWidth + 1);
    }
  };
  update();
  return update;
}

/**
 * 表格自适应对齐：逐列检查 tbody 单元格，若整列都是短内容（无长句、无块级元素），
 * 则该列（含表头）居中；长文本列保持左对齐。每张表各自得到合适的显示方式。
 */
function fitTableAlignment(tbl: HTMLTableElement) {
  const bodyRows = Array.from(tbl.querySelectorAll('tbody tr'));
  if (bodyRows.length === 0) return;
  const colCount = bodyRows[0].children.length;
  for (let c = 0; c < colCount; c++) {
    let compact = true;
    for (const tr of bodyRows) {
      const cell = tr.children[c] as HTMLElement | undefined;
      if (!cell) {
        compact = false;
        break;
      }
      const text = (cell.textContent ?? '').trim();
      // 长句、句读、内嵌块级元素 → 判定为长文本列
      if (text.length > 12 || /[。；！？]/.test(text) || cell.querySelector('p, ul, ol, pre, blockquote, br')) {
        compact = false;
        break;
      }
    }
    if (!compact) continue;
    for (const el of tbl.querySelectorAll(
      `tbody tr > :nth-child(${c + 1}), thead tr > :nth-child(${c + 1})`,
    )) {
      el.classList.add('center');
    }
  }
}

/** 代码行数超过该值的块折叠，展开走全屏覆盖层 */
const CODE_COLLAPSE_LINES = 8;

/** 代码覆盖层：像看照片一样，在页面上方铺一层展示完整代码（保留语法高亮） */
function openCodeLightbox(scope: HTMLElement) {
  if (document.querySelector('.code-lightbox')) return;
  const overlay = document.createElement('div');
  overlay.className = 'code-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', '完整代码查看');

  const panel = document.createElement('div');
  panel.className = 'code-lightbox-panel';

  // 克隆目标区域的代码块（伪代码 + C++ 纵向排列），去掉折叠态与页内按钮
  const source = scope.cloneNode(true) as HTMLElement;
  source.querySelectorAll('.copy-btn, .code-expand, .code-tabs').forEach((el) => el.remove());
  // 没有 .code-pair 包裹时 scope 就是折叠的 .code-wrap 本身，而 querySelectorAll 不含自身 ——
  // 漏掉这一步，克隆体仍带 .clamped，覆盖层里的代码依旧被截成 200px。
  source.classList.remove('clamped');
  source.querySelectorAll('.clamped').forEach((el) => el.classList.remove('clamped'));
  source.querySelectorAll('pre.code').forEach((el) => {
    (el as HTMLElement).style.maxHeight = '';
  });
  panel.appendChild(source);

  // 克隆体里的复制按钮不能用了，给每个块重挂一个（复制源文本）
  const pres = Array.from(scope.querySelectorAll<HTMLPreElement>('pre.code'));
  const clonePres = Array.from(panel.querySelectorAll<HTMLPreElement>('pre.code'));
  clonePres.forEach((pre, i) => {
    const orig = pres[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.style.opacity = '1';
    btn.textContent = '复制';
    btn.addEventListener('click', () => {
      navigator.clipboard
        ?.writeText(orig ? codePlainText(orig) : '')
        .then(() => {
          btn.textContent = '已复制';
          window.setTimeout(() => (btn.textContent = '复制'), 1400);
        })
        .catch(() => (btn.textContent = '复制失败'));
    });
    pre.appendChild(btn);
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'fig-lightbox-close';
  closeBtn.setAttribute('aria-label', '关闭代码查看');
  closeBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  };
  const onKey = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  overlay.appendChild(panel);
  overlay.appendChild(closeBtn);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
}

/** 插图 lightbox：克隆 SVG 到全屏浮层，点击遮罩 / Esc / 关闭按钮退出 */
function openLightbox(fig: HTMLElement, svg: SVGElement) {
  if (document.querySelector('.fig-lightbox')) return;
  const overlay = document.createElement('div');
  overlay.className = 'fig-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', '插图放大视图');
  const panel = document.createElement('div');
  panel.className = 'fig-lightbox-panel';
  const clone = svg.cloneNode(true) as SVGElement;
  clone.removeAttribute('style');
  if (fig.classList.contains('net-review-diagram')) {
    const width = Number(svg.getAttribute('viewBox')?.split(/\s+/)[2]);
    if (Number.isFinite(width) && width > 0) clone.style.minWidth = width + 'px';
  }
  clone.setAttribute('width', '100%');
  clone.setAttribute('height', 'auto');
  panel.appendChild(clone);
  const cap = fig.querySelector('.fig-cap, figcaption');
  if (cap) {
    const capEl = document.createElement('p');
    capEl.className = 'fig-lightbox-cap';
    capEl.textContent = cap.textContent ?? '';
    panel.appendChild(capEl);
  }
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'fig-lightbox-close';
  closeBtn.setAttribute('aria-label', '关闭放大视图');
  closeBtn.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  };
  const onKey = (e: globalThis.KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  overlay.appendChild(panel);
  overlay.appendChild(closeBtn);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
}

/* ------------------------------------------------------- 组件 */
interface Props {
  html: string;
}

export default function HtmlContent({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current) return;
    enhance(ref.current);
    // 溢出状态随窗口宽度变化重估（增强只跑一次，类名 toggle 可重复执行）
    const updateFade = fitOverflowFade(ref.current);
    window.addEventListener('resize', updateFade);
    return () => window.removeEventListener('resize', updateFade);
  }, [html]);

  // 全局委托：页内锚点平滑滚动；旧静态页链接转为路由跳转
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';

    // HashRouter 路由链接（#/ds/simulator）交给路由；当成页内锚点会滚到一个不存在的元素，
    // 表现就是「点了没反应」。
    if (href.startsWith('#/')) {
      e.preventDefault();
      navigate(href.slice(1));
      return;
    }
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToId(href.slice(1));
      return;
    }
    // 2025版计网总目录的章链接走客户端路由，避免站点子路径直刷导致 404。
    if (href.startsWith(`${NET_BASE}/deck/`)) {
      e.preventDefault();
      navigate(href);
      return;
    }
    const legacy = parseLegacyHref(href);
    if (legacy) {
      e.preventDefault();
      if (legacy.deck) {
        navigate(legacy.section ? `${ALGO_BASE}/deck/${legacy.deck}?s=${legacy.section}` : `${ALGO_BASE}/deck/${legacy.deck}`);
      } else if (legacy.section) {
        navigate(`${ALGO_BASE}/?s=${legacy.section}`);
      } else {
        navigate(ALGO_BASE);
      }
    }
  };

  return <div ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

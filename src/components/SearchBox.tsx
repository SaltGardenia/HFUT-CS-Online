import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decks, homeData } from '../content';
import { practiceQuestions } from '../content/practice';
import { decodeEntities } from '../lib/text';
import { appendOutlineIndex, appendPaperIndex, findSearchResults, searchSnippet, outlineResultPath, currentSearchUnit, chapterReadingStatus } from '../lib/outlineSearch';
import { IconSearch, IconX } from './icons';
import { READING_KEY } from '../lib/sync/keys';
import { readReading, subscribeStore } from '../lib/sync/local';

export interface SearchIndexItem {
  kind: '章节' | '动画' | '题目' | '试卷' | '方向' | '正文' | '附件';
  /** 所属讲次/章节 id；null = 课程首页 */
  unit: string | null;
  unitTitle: string;
  sectionId: string;
  /** 正文命中的知识点标题，与实际跳转锚点对应；试题命中是「第 N 题 · 题型」标签 */
  sectionTitle?: string;
  /** 正文所在的二级标题（H2），即使实际命中在 H3 下也保留。 */
  parentSectionTitle?: string;
  /** 试题命中的题目 id：练习页 ?s= 深链，本条按长文本渲染（试卷名 + 题号 + 摘要） */
  questionId?: string;
  text: string;
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** 结果文本里的命中片段：主题色加重标出（不铺底色），扫读时直接定位 */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().replace(/\s+/g, ' ').toLowerCase();
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="pi-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** 算法课的搜索索引：各讲目录 / 动画 / 自测题 / 在线练习题库 + 总目录 */
export function buildAlgoIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const deck of decks) {
    appendOutlineIndex(items, deck);
    const demoSection = new Map<string, string>();
    const quizSectionIds = new Set<string>();
    for (const sec of deck.sections) {
      for (const b of sec.blocks) {
        if (b.type === 'demo' && !demoSection.has(b.name)) demoSection.set(b.name, sec.id);
        if (b.type === 'quiz') quizSectionIds.add(sec.id);
      }
    }
    for (const t of deck.toc) {
      items.push({ kind: '章节', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: t.id, text: decodeEntities(t.text) });
    }
    for (const [name, secId] of demoSection) {
      const block = deck.sections.flatMap((s) => s.blocks).find((b) => b.type === 'demo' && b.name === name);
      const title = block && block.type === 'demo' ? decodeEntities(block.title) : name;
      items.push({ kind: '动画', unit: deck.id, unitTitle: decodeEntities(deck.title), sectionId: secId, text: title });
    }
    for (const sec of deck.sections) {
      if (!quizSectionIds.has(sec.id)) continue;
      for (const b of sec.blocks) {
        if (b.type !== 'quiz') continue;
        items.push({
          kind: '题目',
          unit: deck.id,
          unitTitle: decodeEntities(deck.title),
          sectionId: sec.id,
          text: decodeEntities(stripTags(b.quiz.question)).slice(0, 64),
        });
      }
    }
  }
  appendOutlineIndex(items, homeData, '总目录', null);
  for (const t of homeData.toc) {
    items.push({ kind: '章节', unit: null, unitTitle: '总目录', sectionId: t.id, text: decodeEntities(t.text) });
  }
  // 在线练习题库（420 题）：题干/选项/解析整段可检索，命中后深链到具体题
  appendPaperIndex(items, [{ id: 'bank', title: '在线练习 · 题库', questions: practiceQuestions }]);
  return items;
}

interface Props {
  /** 搜索索引（由各课程自行构建） */
  index: SearchIndexItem[];
  /** 条目 → 跳转路由 */
  linkTo: (item: SearchIndexItem) => string;
}

/**
 * 顶栏内联搜索框：点击在原位展开输入框，有搜索词时下拉展示匹配结果。
 * 索引与跳转由课程注入，本组件只管交互与样式。
 */
export default function SearchBox({ index, linkTo }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [reading, setReading] = useState(readReading);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUnit = currentSearchUnit(pathname);
  const results = useMemo(() => findSearchResults(index, query, 12, currentUnit), [query, index, currentUnit]);

  // 仅复用既有章级阅读进度；本机、跨标签页及云端更新同步刷新。
  useEffect(() => {
    if (!open) return;
    const refresh = () => setReading(readReading());
    const unsubscribe = subscribeStore(READING_KEY, refresh);
    refresh();
    return unsubscribe;
  }, [open]);

  // 点击容器外部收起：输入框回到圆形图标胶囊
  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setExpanded(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => setActive(0), [query, currentUnit]);

  const select = (item: SearchIndexItem) => {
    setOpen(false);
    setExpanded(false);
    inputRef.current?.blur();
    navigate(linkTo(item));
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.max(0, Math.min(a + 1, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[active]) select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setExpanded(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`search-box${expanded ? ' expanded' : ''}`} ref={boxRef}>
      <input
        ref={inputRef}
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => {
          setExpanded(true);
          setOpen(true);
        }}
        onClick={() => {
          setExpanded(true);
          setOpen(true);
        }}
        placeholder="搜索"
        aria-label="搜索关键词"
        aria-haspopup="listbox"
        aria-expanded={open}
      />
      <span className="search-icon" aria-hidden="true">
        <IconSearch size={15} />
      </span>
      {query && (
        <button
          type="button"
          className="search-clear"
          aria-label="清空搜索词"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <IconX size={13} />
        </button>
      )}
      <AnimatePresence>
        {open && query.trim() !== '' && (
          <motion.div
            className="search-drop"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transformOrigin: 'top right' }}
            role="listbox"
            aria-label="搜索结果"
          >
            <ul className="search-list">
              {results.length === 0 && query.trim() && <li className="palette-empty">没有匹配的内容</li>}
              {results.map((item, i) => {
                // 正文与试题按「标题 + 摘要」两行渲染；试题的第二行右侧是试卷名
                const path = item.kind === '正文' || item.questionId ? outlineResultPath(item) : null;
                const status = chapterReadingStatus(item, linkTo(item), reading);
                const chapterLabel = (
                  <span className="pi-path pi-reading-path">
                    <span>{path?.chapter ?? (item.unit || item.questionId || item.kind === '附件' ? item.unitTitle : '首页')}</span>
                    {status && (
                      <span className={`pi-read-state${status.read ? ' is-read' : ''}`} title={status.read ? '本章有阅读记录；百分比为上次阅读位置' : '本章暂无阅读记录'}>
                        {status.read ? `已读 · ${status.percent}%` : '未读'}
                      </span>
                    )}
                  </span>
                );
                return (
                <li
                  key={`${item.unit}-${item.sectionId}-${i}`}
                  className={`palette-item${path ? ' palette-body' : ''}${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(item)}
                >
                  <span className="pi-kind">{item.kind}</span>
                  {path ? (
                    <span className="pi-body">
                      <span className="pi-body-head">
                        <span className="pi-section">{path.heading}</span>
                        {chapterLabel}
                      </span>
                      {path.subheading && <span className="pi-subsection">{path.subheading}</span>}
                      <span className="pi-snippet">
                        <Highlight text={searchSnippet(item.text, query)} query={query} />
                      </span>
                    </span>
                  ) : (
                    <>
                      <span className="pi-text"><Highlight text={item.text} query={query} /></span>
                      {chapterLabel}
                    </>
                  )}
                </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

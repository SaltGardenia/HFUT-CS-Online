import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { PracticeQuestion, PracticeTag } from '../../content/practice';
import { useProgressStore } from '../../lib/sync';
import { useQuestionBooks } from '../../lib/questionBooks';
import { IconArrowRight, IconStar, IconX } from '../icons';
import PracticeCard from './PracticeCard';

/**
 * 错题本 / 收藏本：一门课一份账，覆盖本课全部在线练习题集。
 * 数据边界由课程 slug 决定（lib/questionBooks），qid 与该课作答进度同一套 id。
 */

export type BookResult = 'right' | 'wrong' | 'revealed';

/** 书页里的一道题：qid 为账内 id（net/phys 是 `${paperId}:${qid}`），label 为题卡序号 */
export interface BookEntry {
  qid: string;
  quiz: PracticeQuestion;
  label: string;
  paper: string;
}

export interface BookPaperInput {
  id: string;
  title: string;
  /** 题目可自带题卡序号（GenQuestion.label）与扩展字段；quiz 侧只消费 PracticeQuestion 形状 */
  questions: readonly (PracticeQuestion & { no?: number | string; label?: string })[];
}

/** 把一门课的题集拼成书页条目：qid 与该课进度键一致，序号默认按卷内题型顺序编号 */
export function buildBookEntries(
  papers: readonly BookPaperInput[],
  kindLabel: Record<string, string>,
  opts?: {
    /** qid = `${paper.id}:${q.id}`（net/phys 的进度键约定） */
    compositeId?: boolean;
    /** 自定义题卡序号（缺省 `${题型短标} ${卷内序号}`） */
    labelOf?: (q: PracticeQuestion & { no?: number | string }, no: number) => string;
  },
): BookEntry[] {
  const entries: BookEntry[] = [];
  for (const paper of papers) {
    const counters = new Map<string, number>();
    for (const q of paper.questions) {
      const no = (counters.get(q.kind) ?? 0) + 1;
      counters.set(q.kind, no);
      entries.push({
        qid: opts?.compositeId ? `${paper.id}:${q.id}` : q.id,
        quiz: q,
        label: opts?.labelOf ? opts.labelOf(q, no) : (q.label ?? `${kindLabel[q.kind] ?? q.kind} ${no}`),
        paper: paper.title,
      });
    }
  }
  return entries;
}

/** 课程总目录「在线练习」区前的两张入口卡：错题本 / 收藏本（并排，试题卡片之前） */
export function BookCards({ base, course }: { base: string; course: string }) {
  const books = useQuestionBooks(course);
  const wrongCount = books.wrongIds.length;
  const favCount = books.favoriteIds.length;
  return (
    <nav className="ext-cards book-cards" aria-label="错题本与收藏本">
      <Link className="ext-card" to={`${base}/practice/wrongbook`}>
        <span className="ext-card-icon" data-tone="wrong">
          <IconX size={18} />
        </span>
        <span className="ext-card-body">
          <span className="ext-card-title">错题本</span>
          <span className="ext-card-desc">{wrongCount > 0 ? `${wrongCount} 题待复习` : '暂无错题'}</span>
        </span>
        <IconArrowRight size={15} className="ext-card-arrow" />
      </Link>
      <Link className="ext-card" to={`${base}/practice/favorites`}>
        <span className="ext-card-icon" data-tone="fav">
          <IconStar size={18} />
        </span>
        <span className="ext-card-body">
          <span className="ext-card-title">收藏本</span>
          <span className="ext-card-desc">{favCount > 0 ? `${favCount} 题` : '暂无收藏'}</span>
        </span>
        <IconArrowRight size={15} className="ext-card-arrow" />
      </Link>
    </nav>
  );
}

interface BookPageProps {
  /** 'wrong' 错题本 / 'fav' 收藏本 */
  kind: 'wrong' | 'fav';
  /** 课程 slug（数据边界） */
  course: string;
  /** 本课作答进度键：书页里可以重做，结果照常入进度 */
  storeKey: string;
  /** 本课全部题目（按题集顺序） */
  entries: BookEntry[];
  /** 知识点标签跳转（与各课答题页一致）；缺省为算法课 */
  tagNav?: (t: PracticeTag) => { href: string; tip: string };
  tagDeckKey?: (deck: number) => string;
}

/** 错题本 / 收藏本页：按题集分组列出在册题目，可移出 / 取消收藏，也可就地重做 */
export default function QuestionBookPage({
  kind,
  course,
  storeKey,
  entries,
  tagNav,
  tagDeckKey,
}: BookPageProps) {
  const books = useQuestionBooks(course);
  const [results, setResults] = useProgressStore<BookResult>(storeKey);
  const isWrong = kind === 'wrong';
  const title = isWrong ? '错题本' : '收藏本';

  const byQuizId = useMemo(() => new Map(entries.map((e) => [e.qid, e])), [entries]);
  const onSet = isWrong ? books.wrong : books.favorited;
  // 在册题目按题集顺序呈现，不打乱原卷序
  const list = useMemo(() => entries.filter((e) => onSet(e.qid)), [entries, onSet]);

  // 多份试卷才按卷分组；单题集（算法课 / 单卷课程）直接平铺
  const paperCount = useMemo(() => new Set(list.map((e) => e.paper)).size, [list]);
  const grouped = paperCount > 1;

  const onResult = (quizId: string, r: BookResult) => {
    const e = byQuizId.get(quizId);
    if (!e) return;
    setResults((s) => ({ ...s, [e.qid]: r }));
    books.trackResult(e.qid, r);
  };

  let lastPaper = '';

  return (
    <div className="page practice-page qbook-page">
      <h1>{title}</h1>

      <div className="pq-progress material">
        <div className="pq-progress-text">
          <span>
            共 <b>{list.length}</b> 题{grouped ? ` · ${paperCount} 份试卷` : ''}
          </span>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="qbook-empty material">
          {isWrong ? <IconX size={20} /> : <IconStar size={20} />}
          <p>{isWrong ? '暂无错题' : '暂无收藏'}</p>
          <p className="qbook-empty-sub">
            {isWrong ? '在答题页答错的题会出现在这里' : '题卡右上角的星标会把题收进来'}
          </p>
        </div>
      ) : (
        <div className="qbook-list">
          {list.map((e) => {
            const showHead = grouped && e.paper !== lastPaper;
            lastPaper = e.paper;
            return (
              <Fragment key={e.qid}>
                {showHead && (
                  <p className="qbook-group-h">
                    {e.paper} · {list.filter((x) => x.paper === e.paper).length} 题
                  </p>
                )}
                <PracticeCard
                  quiz={e.quiz}
                  label={e.label}
                  result={results[e.qid]}
                  onResult={onResult}
                  tagNav={tagNav}
                  tagDeckKey={tagDeckKey}
                  favorite={{ on: books.favorited(e.qid), onToggle: () => books.toggleFavorite(e.qid) }}
                  cornerAction={
                    isWrong ? { label: '移出', onClick: () => books.removeFromWrong(e.qid) } : undefined
                  }
                />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 历年试题考点分析（纯数据聚合，无 UI）：输入试卷数组，产出章级分布、考点榜、
 * 卷×章矩阵与个人易错考点。各课程试卷题的数据形状一致：{ id, kind, tags: [{deck, sec, text}] }。
 * 计数口径：章级按「题」计（一道题挂同章多个标签只计一次），考点级按「标签」计；
 * 一道题挂多章时各章都计，所以章级之和可以大于总题数。 */

export interface InsightTag {
  deck: number;
  sec: string;
  text: string;
}

export interface InsightQuestion {
  id: string;
  kind: string;
  tags: readonly InsightTag[];
}

export interface InsightPaper {
  id: string;
  title: string;
  questions: readonly InsightQuestion[];
}

/** 章级分布 */
export interface ChapterStat {
  deck: number;
  /** 引用该章的题数 */
  count: number;
  /** 覆盖卷数 */
  papers: number;
  byKind: Record<string, number>;
  /** 各卷题数（组件 tooltip 用） */
  byPaper: { paperId: string; count: number }[];
}

/** 考点级统计（按标签文本聚合，跨卷同名合并） */
export interface TagStat {
  text: string;
  /** 代表位置：该文本出现最多的 (deck, sec) 组合 */
  deck: number;
  sec: string;
  count: number;
  papers: number;
  byKind: Record<string, number>;
  /** 各卷题数（组件 tooltip 用） */
  byPaper: { paperId: string; count: number }[];
}

/** 卷×章矩阵的一行（一份试卷） */
export interface MatrixRow {
  paperId: string;
  title: string;
  /** 与 ExamInsights.decks 对位的题数 */
  cells: number[];
  total: number;
}

export interface ExamInsights {
  totalPapers: number;
  totalQuestions: number;
  /** 矩阵列的章序（升序） */
  decks: number[];
  /** 按题数降序（同数按章号升序） */
  chapters: ChapterStat[];
  /** 按覆盖卷数、题数降序（同数按文本序） */
  tags: TagStat[];
  matrix: MatrixRow[];
  maxCell: number;
}

/** 个人易错考点（由作答进度算出） */
export interface WeakTag {
  text: string;
  deck: number;
  sec: string;
  /** 答错题数 */
  wrong: number;
  /** 已作答题数（right/wrong/revealed 任意结果） */
  answered: number;
}

function bump(map: Record<string, number>, key: string, n = 1) {
  map[key] = (map[key] ?? 0) + n;
}

/** 从章节列表（no 如「第1章」）取章号 → 章名映射；无法解析章号的章节忽略 */
export function chapterNamesFrom(chapters: ReadonlyArray<{ no: string; title: string }>): Record<number, string> {
  const names: Record<number, string> = {};
  for (const c of chapters) {
    const m = /\d+/.exec(c.no);
    if (m) names[Number(m[0])] = c.title;
  }
  return names;
}

export function buildExamInsights(papers: readonly InsightPaper[]): ExamInsights {
  const deckQuestions = new Map<number, number>();
  const deckPapers = new Map<number, Set<string>>();
  const deckKinds = new Map<number, Record<string, number>>();
  const deckByPaper = new Map<number, Map<string, number>>();

  const tagCount = new Map<string, number>();
  const tagPapers = new Map<string, Set<string>>();
  const tagKinds = new Map<string, Record<string, number>>();
  const tagByPaper = new Map<string, Map<string, number>>();
  const tagLoc = new Map<string, Map<string, { deck: number; sec: string; n: number }>>();

  const rows: { paper: InsightPaper; perDeck: Map<number, number> }[] = [];
  let totalQuestions = 0;

  for (const paper of papers) {
    totalQuestions += paper.questions.length;
    const perDeck = new Map<number, number>();

    for (const q of paper.questions) {
      // 章级：按题去重（同题挂同章多个标签只计一次）
      const decksOfQuestion = new Set(q.tags.map((t) => t.deck));
      for (const d of decksOfQuestion) {
        deckQuestions.set(d, (deckQuestions.get(d) ?? 0) + 1);
        if (!deckPapers.has(d)) deckPapers.set(d, new Set());
        deckPapers.get(d)!.add(paper.id);
        if (!deckKinds.has(d)) deckKinds.set(d, {});
        bump(deckKinds.get(d)!, q.kind);
        if (!deckByPaper.has(d)) deckByPaper.set(d, new Map());
        const bpm = deckByPaper.get(d)!;
        bpm.set(paper.id, (bpm.get(paper.id) ?? 0) + 1);
        perDeck.set(d, (perDeck.get(d) ?? 0) + 1);
      }

      // 考点级：按标签计
      for (const t of q.tags) {
        tagCount.set(t.text, (tagCount.get(t.text) ?? 0) + 1);
        if (!tagPapers.has(t.text)) tagPapers.set(t.text, new Set());
        tagPapers.get(t.text)!.add(paper.id);
        if (!tagKinds.has(t.text)) tagKinds.set(t.text, {});
        bump(tagKinds.get(t.text)!, q.kind);
        if (!tagByPaper.has(t.text)) tagByPaper.set(t.text, new Map());
        const tpm = tagByPaper.get(t.text)!;
        tpm.set(paper.id, (tpm.get(paper.id) ?? 0) + 1);
        if (!tagLoc.has(t.text)) tagLoc.set(t.text, new Map());
        const lm = tagLoc.get(t.text)!;
        const key = `${t.deck}:${t.sec}`;
        const cur = lm.get(key);
        lm.set(key, { deck: t.deck, sec: t.sec, n: (cur?.n ?? 0) + 1 });
      }
    }

    rows.push({ paper, perDeck });
  }

  const decks = [...deckQuestions.keys()].sort((a, b) => a - b);

  const chapters: ChapterStat[] = [...deckQuestions.entries()]
    .map(([deck, count]) => ({
      deck,
      count,
      papers: deckPapers.get(deck)?.size ?? 0,
      byKind: deckKinds.get(deck) ?? {},
      byPaper: [...(deckByPaper.get(deck)?.entries() ?? [])].map(([paperId, c]) => ({ paperId, count: c })),
    }))
    .sort((a, b) => b.count - a.count || a.deck - b.deck);

  const tags: TagStat[] = [...tagCount.entries()]
    .map(([text, count]) => {
      const locs = [...(tagLoc.get(text)?.values() ?? [])].sort((a, b) => b.n - a.n);
      return {
        text,
        deck: locs[0]?.deck ?? 0,
        sec: locs[0]?.sec ?? '',
        count,
        papers: tagPapers.get(text)?.size ?? 0,
        byKind: tagKinds.get(text) ?? {},
        byPaper: [...(tagByPaper.get(text)?.entries() ?? [])].map(([paperId, c]) => ({ paperId, count: c })),
      };
    })
    .sort((a, b) => b.papers - a.papers || b.count - a.count || a.text.localeCompare(b.text, 'zh'));

  const matrix: MatrixRow[] = rows.map(({ paper, perDeck }) => ({
    paperId: paper.id,
    title: paper.title,
    cells: decks.map((d) => perDeck.get(d) ?? 0),
    total: paper.questions.length,
  }));
  const maxCell = Math.max(1, ...matrix.flatMap((r) => r.cells));

  return { totalPapers: papers.length, totalQuestions, decks, chapters, tags, matrix, maxCell };
}

/** 个人易错考点：按作答进度统计每个考点的错题数。只返回有 ≥1 道错题的考点，
 * 排序：错题数降序 → 错误率降序 → 文本序；最多 limit 条（默认 6）。 */
export function buildWeakPoints(
  papers: readonly InsightPaper[],
  progress: Record<string, string>,
  keyOf: (paperId: string, qid: string) => string = (_paperId, qid) => qid,
  limit = 6,
): WeakTag[] {
  const stat = new Map<
    string,
    {
      text: string;
      deck: number;
      sec: string;
      wrong: number;
      answered: number;
      loc: Map<string, { deck: number; sec: string; n: number }>;
    }
  >();

  for (const paper of papers) {
    for (const q of paper.questions) {
      const r = progress[keyOf(paper.id, q.id)];
      if (!r) continue;
      for (const t of q.tags) {
        const s = stat.get(t.text) ?? {
          text: t.text,
          deck: t.deck,
          sec: t.sec,
          wrong: 0,
          answered: 0,
          loc: new Map<string, { deck: number; sec: string; n: number }>(),
        };
        s.answered += 1;
        if (r === 'wrong') s.wrong += 1;
        const key = `${t.deck}:${t.sec}`;
        const cur = s.loc.get(key);
        s.loc.set(key, { deck: t.deck, sec: t.sec, n: (cur?.n ?? 0) + 1 });
        stat.set(t.text, s);
      }
    }
  }

  return [...stat.values()]
    .filter((s) => s.wrong > 0)
    .sort(
      (a, b) =>
        b.wrong - a.wrong ||
        b.wrong / b.answered - a.wrong / a.answered ||
        a.text.localeCompare(b.text, 'zh'),
    )
    .slice(0, limit)
    .map((s) => {
      const locs = [...s.loc.values()].sort((a, b) => b.n - a.n);
      return {
        text: s.text,
        deck: locs[0]?.deck ?? s.deck,
        sec: locs[0]?.sec ?? s.sec,
        wrong: s.wrong,
        answered: s.answered,
      };
    });
}

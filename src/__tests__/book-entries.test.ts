/**
 * 错题本/收藏本的数据边界：一门课一份账，账内题目 id 必须唯一。
 * 逐课校验「书页 qid 与该课作答进度同一套 id」的约定：
 * - 多数课程题目 id 天然带试卷前缀（os 的 p1-f1、math 的 qfinal2324-1-1 …）；
 * - net / phys 的卷内题目 id 会撞，按进度键约定拼成 `${paperId}:${qid}`。
 * 这里同时校验 buildBookEntries 的产物：无重复、序号齐全。
 */
import { describe, expect, it } from 'vitest';
import { buildBookEntries } from '../components/practice/books';
import { practiceQuestions } from '../content/practice';
import { osPapers } from '../content/os';
import { netPapers } from '../content/net';
import { caPapers, CA_KIND_LABEL } from '../content/ca';
import { mathPapers, MATH_KIND_LABEL } from '../content/math';
import { dbPapers } from '../content/db';
import { sePapers, SE_KIND_LABEL } from '../content/se';
import { stPapers, ST_KIND_LABEL } from '../content/st';
import { physPapers } from '../content/phys';
import { papers as patPapers } from '../content/pat';
import { aiPaper } from '../content/ai';
import { dsPapers } from '../content/ds';
import { laPapers } from '../content/la';
import { eePapers } from '../content/ee';
import { asmConfig } from '../content/asm/config';
import { dmConfig } from '../content/dm/config';
import { edaConfig } from '../content/eda/config';
import { coPapers } from '../content/courses/co';

/** 断言一份题集里 id 互不重复（重复即跨卷串账） */
function expectUnique(course: string, ids: string[]) {
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  expect([course, ...dup]).toEqual([course]);
  expect(ids.length).toBeGreaterThan(0);
}

describe('每门课的账内题目 id 唯一（数据边界）', () => {
  it('算法课题库（单题集）', () => {
    expectUnique('algo', practiceQuestions.map((q) => q.id));
  });

  it('os / ca / math / db / se / st：题目 id 自带试卷前缀', () => {
    expectUnique('os', osPapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('ca', caPapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('math', mathPapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('db', dbPapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('se', sePapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('st', stPapers.flatMap((p) => p.questions.map((q) => q.id)));
  });

  it('net / phys：卷内 id 会撞，按进度键拼 `${paperId}:${qid}`', () => {
    expectUnique('net', netPapers.flatMap((p) => p.questions.map((q) => `${p.id}:${q.id}`)));
    expectUnique('phys', physPapers.flatMap((p) => p.questions.map((q) => `${p.id}:${q.id}`)));
  });

  it('pat / ai / shell 课程（ds la ee asm dm eda co）', () => {
    expectUnique('pat', patPapers.flatMap((p) => p.questions.map((q) => q.id)));
    expectUnique('ai', aiPaper.questions.map((q) => q.id));
    for (const [course, papers] of [
      ['ds', dsPapers],
      ['la', laPapers],
      ['ee', eePapers],
      ['asm', asmConfig.papers],
      ['dm', dmConfig.papers],
      ['eda', edaConfig.papers],
      ['co', coPapers],
    ] as const) {
      expectUnique(course, papers.flatMap((p) => p.questions.map((q) => q.id)));
    }
  });
});

describe('buildBookEntries：序号与分组一致', () => {
  it('序号按卷内题型顺序编号，卷名随条目', () => {
    const entries = buildBookEntries(
      [
        { id: 'p1', title: '卷一', questions: [{ ...caPapers[0].questions[0], label: undefined }] },
        { id: 'p2', title: '卷二', questions: [caPapers[1].questions[0]] },
      ],
      CA_KIND_LABEL,
    );
    expect(entries.map((e) => e.paper)).toEqual(['卷一', '卷二']);
    // 序号 = 该题型在卷内的序号（首题必为 1），题型短标与答题页一致
    expect(entries[0].label).toBe(`${CA_KIND_LABEL[caPapers[0].questions[0].kind]} 1`);
    expect(entries[1].label).toBe(`${CA_KIND_LABEL[caPapers[1].questions[0].kind]} 1`);
  });

  it('math 的默认编号与答题页 labelOf 一致（卷内题型计数）', () => {
    const entries = buildBookEntries(mathPapers, MATH_KIND_LABEL);
    // 抽查一份卷：同题型的第 n 题序号 = n
    for (const paper of mathPapers.slice(0, 3)) {
      const counters = new Map<string, number>();
      for (const q of paper.questions) {
        const n = (counters.get(q.kind) ?? 0) + 1;
        counters.set(q.kind, n);
        const entry = entries.find((e) => e.quiz === q);
        expect(entry?.label).toBe(`${MATH_KIND_LABEL[q.kind]} ${n}`);
      }
    }
  });

  it('db / se / st 的序号沿用答题页的原卷编号（从题目 id 解出）', () => {
    const stEntries = buildBookEntries(stPapers, ST_KIND_LABEL, {
      labelOf: (q) => {
        const m = q.id.match(/^[a-z]\d+-[a-z](\d+)(?:-(\d+))?$/);
        const no = m ? m[1] : '';
        const sub = m && m[2] ? `-${m[2]}` : '';
        return `${ST_KIND_LABEL[q.kind as keyof typeof ST_KIND_LABEL]} ${no}${sub}`;
      },
    });
    const sample = stEntries.find((e) => /-\d/.test(e.label));
    // 填空多空的题（如 填空 3-2）编号里保留子号
    expect(sample).toBeTruthy();
    expect(SE_KIND_LABEL.single).toBe('单选');
  });
});

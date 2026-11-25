/** 大二下 12 门课的内容契约：章节结构完整、纯文本字段无实体、练习标签可解析到章内 section */
import { describe, expect, it } from 'vitest';
import { compSpec } from '../content/courses/comp';
import { coSpec } from '../content/courses/co';
import { embSpec } from '../content/courses/emb';
import { mlSpec } from '../content/courses/ml';
import { steSpec } from '../content/courses/ste';
import { combSpec } from '../content/courses/comb';
import { cgSpec, smaSpec, dmtSpec, npSpec, microSpec, hetSpec } from '../content/courses/attachments';
import type { CourseSpec } from '../content/courses/types';
import { courses } from '../courses/registry';
import { decodeEntities } from '../lib/text';

const SPECS: CourseSpec[] = [compSpec, coSpec, embSpec, mlSpec, steSpec, combSpec, cgSpec, smaSpec, dmtSpec, npSpec, microSpec, hetSpec];

/** 纯文本渲染字段里不允许出现的 HTML 实体（出现即会原样显示成乱码） */
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

describe('大二下 12 门课', () => {
  it('注册表与课程数据一一对应（名称 / base / 学期）', () => {
    expect(SPECS.length).toBe(12);
    for (const spec of SPECS) {
      const entry = courses.find((c) => c.base === spec.base);
      expect(entry, spec.key).toBeDefined();
      expect(entry!.name).toBe(spec.name);
      expect(entry!.semester).toBe('大二下');
      expect(entry!.ready).toBe(true);
    }
  });

  it('每章有 lede / 目录 / 正文，目录 id 与 section id 对应', () => {
    for (const spec of SPECS) {
      for (const ch of spec.chapters) {
        expect(ch.lede.length, `${spec.key}/${ch.id}`).toBeGreaterThan(20);
        expect(ch.toc.length, `${spec.key}/${ch.id} toc`).toBeGreaterThan(0);
        expect(ch.sections.length, `${spec.key}/${ch.id} sections`).toBeGreaterThan(0);
        const secIds = new Set(ch.sections.map((s) => s.id));
        for (const t of ch.toc) expect(secIds.has(t.id), `${spec.key}/${ch.id} toc ${t.id}`).toBe(true);
        for (const s of ch.sections) {
          expect(s.blocks.length, `${spec.key}/${ch.id}/${s.id}`).toBeGreaterThan(0);
          for (const b of s.blocks) {
            if (b.type === 'html') expect(b.html.trim().length, `${spec.key}/${ch.id}/${s.id}`).toBeGreaterThan(10);
          }
        }
      }
    }
  });

  it('纯文本字段（课程名 / 标题 / 目录 / heading / 标签 / 答案）不残留 HTML 实体', () => {
    const plain: { where: string; value: string }[] = [];
    for (const spec of SPECS) {
      plain.push({ where: `${spec.key}.name`, value: spec.name });
      for (const ch of spec.chapters) {
        plain.push({ where: `${spec.key}/${ch.id}.title`, value: ch.title });
        plain.push({ where: `${spec.key}/${ch.id}.subtitle`, value: ch.subtitle });
        for (const t of ch.toc) plain.push({ where: `${spec.key}/${ch.id}.toc:${t.id}`, value: t.text });
        for (const s of ch.sections) plain.push({ where: `${spec.key}/${ch.id}.${s.id}`, value: s.heading });
      }
      for (const p of spec.papers) {
        for (const q of p.questions) {
          for (const t of q.tags) plain.push({ where: `${p.id}.${q.id}.tag`, value: t.text });
          if (q.kind === 'fill') plain.push({ where: `${p.id}.${q.id}.answer`, value: q.answer });
        }
      }
    }
    expect(plain.filter((p) => ENTITY_RE.test(p.value)).map((p) => `${p.where} → ${p.value}`)).toEqual([]);
  });

  it('试卷：大题与小题目录一致，标签能解析到章内 section', () => {
    for (const spec of SPECS) {
      const chapterById = new Map(spec.chapters.map((c) => [c.id, c]));
      for (const p of spec.papers) {
        const ids = new Set(p.questions.map((q) => q.id));
        expect(ids.size, `${p.id} 题目 id 唯一`).toBe(p.questions.length);
        const listed = p.sections.flatMap((s) => s.questionIds);
        expect(listed.length, `${p.id} 大题覆盖全部题目`).toBe(p.questions.length);
        for (const id of listed) expect(ids.has(id), `${p.id} 缺少题目 ${id}`).toBe(true);
        for (const q of p.questions) {
          expect(q.tags.length, `${q.id} 至少一个标签`).toBeGreaterThan(0);
          for (const t of q.tags) {
            const ch = chapterById.get(`deck${t.deck}`);
            expect(ch, `${q.id} 标签章 deck${t.deck}`).toBeDefined();
            expect(ch!.toc.some((x) => x.id === t.sec), `${q.id} 标签 section ${t.sec}`).toBe(true);
            expect(decodeEntities(t.text).length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('有练习的课程试卷数 ≥1，无练习的课程试卷数为 0', () => {
    expect(coSpec.papers.length).toBeGreaterThanOrEqual(1);
    for (const spec of SPECS) {
      if (spec === coSpec) continue;
      expect(spec.papers.length, `${spec.key}`).toBe(0);
    }
  });
});

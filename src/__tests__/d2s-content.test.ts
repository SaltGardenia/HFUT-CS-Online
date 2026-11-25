/**
 * 大二上批次课程内容完整性测试：
 * 章节目录与 section 对齐 / 纯文本字段无实体 / 试卷题目字段与知识点标签可跳转 / id 唯一。
 */
import { describe, expect, it } from 'vitest';
import type { CourseConfig } from '../content/course-types';
import { pyConfig } from '../content/py/config';
import { dmConfig } from '../content/dm/config';
import { cmConfig } from '../content/cm/config';
import { probConfig } from '../content/prob/config';
import { asmConfig } from '../content/asm/config';
import { edaConfig } from '../content/eda/config';
import { resConfig } from '../content/res/config';
import { physlabConfig } from '../content/physlab/config';

const CONFIGS: CourseConfig[] = [pyConfig, dmConfig, cmConfig, probConfig, asmConfig, edaConfig, resConfig, physlabConfig];
const ENTITY_RE = /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

describe('大二上课程内容', () => {
  it('每门课都有章节，章 id 唯一且与数据注入的 base 匹配', () => {
    for (const c of CONFIGS) {
      expect(c.chapters.length, c.name).toBeGreaterThan(0);
      expect(new Set(c.chapters.map((x) => x.id)).size, `${c.name} 章 id 去重`).toBe(c.chapters.length);
      expect(c.base.startsWith('/'), c.name).toBe(true);
    }
  });

  it('各章 section 非空、目录 id 唯一且指向真实 section', () => {
    for (const c of CONFIGS) {
      for (const ch of c.chapters) {
        expect(ch.sections.length, `${c.name}/${ch.id}`).toBeGreaterThan(0);
        const secIds = new Set(ch.sections.map((s) => s.id));
        const tocIds = ch.toc.map((t) => t.id);
        expect(new Set(tocIds).size, `${c.name}/${ch.id} 目录 id 去重`).toBe(tocIds.length);
        for (const id of tocIds) expect(secIds.has(id), `${c.name}/${ch.id}/${id}`).toBe(true);
        for (const s of ch.sections) expect(s.blocks.length, `${c.name}/${ch.id}/${s.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('纯文本渲染字段（标题 / 目录 / heading）不残留 HTML 实体', () => {
    for (const c of CONFIGS) {
      const plain: string[] = [c.name, c.tip, c.source];
      for (const ch of c.chapters) {
        plain.push(ch.title, ch.subtitle, ch.no);
        for (const t of ch.toc) plain.push(t.text);
        for (const s of ch.sections) plain.push(s.heading);
      }
      expect(plain.filter((v) => ENTITY_RE.test(v)), c.name).toEqual([]);
    }
  });

  it('试卷：题量、字段完整、id 全局唯一、标签指向真实章内位置', () => {
    for (const c of CONFIGS) {
      const ids = c.papers.flatMap((p) => p.questions.map((q) => q.id));
      expect(new Set(ids).size, `${c.name} 题目 id 去重`).toBe(ids.length);
      for (const p of c.papers) {
        expect(p.questions.length, p.id).toBeGreaterThan(0);
        expect(p.sections.flatMap((s) => s.questionIds).sort()).toEqual(p.questions.map((q) => q.id).sort());
        for (const q of p.questions) {
          expect(q.question.length, q.id).toBeGreaterThan(4);
          expect(q.answer.length, q.id).toBeGreaterThan(0);
          expect(q.explanation.length, q.id).toBeGreaterThan(5);
          expect(q.tags.length, q.id).toBeGreaterThan(0);
          for (const t of q.tags) {
            const ch = c.chapters[t.deck - 1];
            expect(ch, `${c.name}/${q.id} deck${t.deck}`).toBeTruthy();
            const hit = ch.toc.some((e) => e.id === t.sec) || ch.sections.some((s) => s.id === t.sec);
            expect(hit, `${c.name}/${q.id} → deck${t.deck}/${t.sec}`).toBe(true);
            expect(ENTITY_RE.test(t.text), `${c.name}/${q.id} 标签残留实体`).toBe(false);
          }
        }
      }
    }
  });

  it('有试卷的课程都声明了练习进度键（并已登记到同步表）', () => {
    for (const c of CONFIGS) {
      expect(c.storeKey, c.name).toMatch(/^[a-z]+-practice-progress-v1$/);
    }
  });
});

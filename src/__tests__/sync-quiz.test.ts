/**
 * 学习通题库同步（2026-11 审计补齐）：
 * 1) mergeQuizCards：一卡一条按时间戳取新，本地较新的回传；
 * 2) 本地账：readQuizCards / applyQuizCards 结构兼容 hb-maquiz，缺时间戳的补「现在」；
 * 3) 脏标记：emitQuizDirty 能通知同步层；
 * 4) slug 映射：题库课程用 quiz/<slug> 往返一致，未上线占位课程用中文名往返。
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyQuizCards,
  ensureQuizStamps,
  emitQuizDirty,
  quizCardCourses,
  readQuizCards,
  setDirtyListener,
} from '../lib/sync/local';
import { courseNameBySlug, courseSlugByName, quizCardsKey } from '../lib/sync/keys';
import { mergeQuizCards } from '../lib/sync/merge';
import type { QuizCardState, RemoteQuizRow } from '../lib/sync/types';

const iso = (ms: number) => new Date(ms).toISOString();
const card = (over: Partial<QuizCardState> = {}): QuizCardState => ({
  st: 1,
  streak: 3,
  fails: 0,
  ivl: 4,
  due: 1000,
  rv: 3,
  t: 2000,
  ...over,
});
const row = (qid: string, at: number, over: Partial<RemoteQuizRow> = {}): RemoteQuizRow => ({
  course: 'quiz/maogai',
  question_id: qid,
  st: 1,
  streak: 3,
  fails: 0,
  ivl: 4,
  due: 1000,
  rv: 3,
  updated_at: iso(at),
  ...over,
});

describe('mergeQuizCards：一卡一条取新', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('云端较新覆盖本机；本地较新（或云端没有）回传上传', () => {
    const merged = mergeQuizCards({ Q1: card({ t: 1000 }), Q2: card({ t: 5000 }) }, [
      row('Q1', 3000, { ivl: 8, streak: 4 }),
      row('Q3', 1000),
    ]);
    // Q1：云端新 → 用云端
    expect(merged.map.Q1).toMatchObject({ ivl: 8, streak: 4, t: 3000 });
    expect(merged.push.map((p) => p.question_id)).not.toContain('Q1');
    // Q2：本地新且云端没有 → 上传
    expect(merged.map.Q2).toMatchObject({ t: 5000 });
    expect(merged.push.map((p) => p.question_id)).toContain('Q2');
    // Q3：仅云端 → 落到本机，不上传
    expect(merged.map.Q3).toMatchObject({ t: 1000 });
    expect(merged.push.map((p) => p.question_id)).not.toContain('Q3');
  });

  it('同时间戳时本地优先（>=）且不重复上传', () => {
    const merged = mergeQuizCards({ Q1: card({ t: 3000 }) }, [row('Q1', 3000)]);
    expect(merged.map.Q1.t).toBe(3000);
    expect(merged.push).toHaveLength(0);
  });
});

describe('本地背题账读写', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('写入后可按 hb-maquiz 结构读回，课程列表能扫描到', () => {
    applyQuizCards('maogai', { Q1: card({ t: 123 }) });
    expect(readQuizCards('maogai').Q1).toMatchObject({ t: 123, st: 1 });
    expect(quizCardCourses()).toContain('maogai');
  });

  it('旧账缺时间戳时补「现在」（参与首次登录上传）', () => {
    localStorage.setItem(
      quizCardsKey('maogai'),
      JSON.stringify({ v: 1, cards: { Q1: { st: 0, streak: 1, fails: 0, ivl: 0, due: 0, rv: 1 } } }),
    );
    const before = readQuizCards('maogai').Q1.t;
    expect(before).toBe(0);
    const fixed = ensureQuizStamps('maogai');
    expect(fixed).toBe(1);
    expect(readQuizCards('maogai').Q1.t).toBeGreaterThan(0);
  });

  it('页面写入时上报 quiz 脏事件', () => {
    const events: string[] = [];
    setDirtyListener((e) => events.push(`${e.kind}:${e.course ?? ''}`));
    emitQuizDirty('sizheng');
    setDirtyListener(null);
    expect(events).toEqual(['quiz:sizheng']);
  });
});

describe('课程 slug 映射（收藏/最近查看同步用）', () => {
  it('学期课程 → 路由首段；学习通题库课程 → quiz/<slug>', () => {
    expect(courseSlugByName('计算机网络')).toBe('net');
    expect(courseSlugByName('毛概')).toBe('quiz/maogai');
    expect(courseNameBySlug('quiz/maogai')).toBe('毛概');
  });

  it('题库课程旧全名归一：slug 解析与云端旧名称 slug 都映射到现短名', () => {
    expect(courseSlugByName('毛泽东思想和中国特色社会主义理论体系概论')).toBe('quiz/maogai');
    expect(courseNameBySlug('毛泽东思想和中国特色社会主义理论体系概论')).toBe('毛概');
    expect(courseNameBySlug('形势与政策（2026秋）')).toBe('形势与政策');
    expect(courseNameBySlug('习近平新时代中国特色社会主义思想概论')).toBe('习概');
  });

  it('历史中文名 slug 往返稳定（防止旧收藏被云端回灌时丢失）；未知 ASCII slug 不还原', () => {
    // 当前目录课程都已上线；这里模拟历史上以中文名上传的旧收藏
    expect(courseSlugByName('某未上线课程')).toBe('某未上线课程');
    expect(courseNameBySlug('某未上线课程')).toBe('某未上线课程');
    expect(courseNameBySlug('legacy-unknown')).toBeUndefined();
  });
});

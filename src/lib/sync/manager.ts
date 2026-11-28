/**
 * SyncManager：本地优先、云端增量同步。
 *
 * - 页面写入先落 localStorage（离线可用），本管理器防抖上传变更；
 * - 登录后先「补时间戳 → 拉取云端 → 逐条合并 → 回写本机 → 上传本地更新」；
 * - 断网时保留脏数据，联网 / 回到前台 / 手动同步时重试；
 * - 未配置 Supabase 时整体停用，站点保持纯游客模式。
 */
import { createSupabaseBackend, type SyncBackend } from './backend';
import { syncEnabled } from './config';
import {
  PROGRESS_STORES,
  courseNameBySlug,
  courseSlugByName,
  progressStoreOf,
  quizCloudCourse,
  quizSlugOfCloudCourse,
} from './keys';
import * as local from './local';
import {
  mergeFavorites,
  mergeProgress,
  mergeQMarks,
  mergeQuizCards,
  mergeReading,
  mergeRecent,
  type FavoritePushDraft,
  type ProgressPushDraft,
} from './merge';
import type {
  FavoriteMeta,
  ProgressMeta,
  PushPayload,
  RecentMeta,
  SyncState,
  SyncUser,
} from './types';

const PUSH_DEBOUNCE_MS = 900;
const RETRY_MS = [4000, 12000, 30000];
const FOCUS_PULL_MS = 60_000;
const RECENT_MAX = 8;

interface SentProgress {
  key: string;
  qid: string;
  t: number;
}

interface PreparedPush {
  payload: PushPayload;
  sentProgress: SentProgress[];
  sentReading: { page: string; t: number }[];
  favoritesSeq: number;
  recentSeq: number;
  /** 发送时各课程的 qmarks 序号快照（发送期间又写入的课程保留脏标记） */
  qmarksSeq: Map<string, number>;
  /** 同上：学习通题库背题账 */
  quizSeq: Map<string, number>;
}

const initialState = (): SyncState => ({
  enabled: syncEnabled,
  ready: !syncEnabled,
  status: syncEnabled ? 'guest' : 'disabled',
  user: null,
  lastSyncedAt: null,
  error: null,
});

class SyncManager {
  private state: SyncState = initialState();
  private listeners = new Set<() => void>();
  private backend: SyncBackend | null = null;
  private initialized = false;

  private attachUserId: string | null = null;
  private sessionGen = 0;
  private pushing = false;
  private pushAgain = false;
  private pushTimer: number | null = null;
  private retryIndex = 0;
  private favoritesSeq = 0;
  private recentSeq = 0;

  private dirtyProgress = new Map<string, Set<string>>();
  private dirtyReading = new Set<string>();
  private favoritesDirty = false;
  private recentDirty = false;
  /** 题目两本账：发生过写入的课程 → 写入序号（清脏时按快照比对） */
  private dirtyQMarks = new Set<string>();
  private qmarksSeq = new Map<string, number>();
  /** 学习通题库背题账：发生写入的课程 slug → 写入序号 */
  private dirtyQuiz = new Set<string>();
  private quizSeq = new Map<string, number>();

  /* -------------------------------------------------------------- 对外 */

  readonly subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  readonly getState = (): SyncState => this.state;

  async init(): Promise<void> {
    if (this.initialized || !syncEnabled || typeof window === 'undefined') return;
    this.initialized = true;
    this.backend = createSupabaseBackend();

    local.setDirtyListener((e) => {
      if (!this.state.user) return;
      if (e.kind === 'progress' && e.key && e.qids?.length) {
        for (const qid of e.qids) this.markProgress(e.key, qid);
      } else if (e.kind === 'reading' && e.page) {
        this.dirtyReading.add(e.page);
      } else if (e.kind === 'favorite') {
        this.favoritesDirty = true;
        this.favoritesSeq += 1;
      } else if (e.kind === 'recent') {
        this.recentDirty = true;
        this.recentSeq += 1;
      } else if (e.kind === 'qmarks' && e.course) {
        this.markQMarks(e.course);
      } else if (e.kind === 'quiz' && e.course) {
        this.markQuiz(e.course);
      }
      this.schedulePush();
    });

    try {
      const user = await this.backend.getSession();
      if (user) await this.attach(user);
      else this.setState({ ready: true, status: 'guest' });
    } catch (e) {
      this.fail(e);
    }

    this.backend.onAuthChange((event, user) => {
      if (event === 'SIGNED_OUT' || !user) {
        this.detach();
        return;
      }
      if (user.id === this.state.user?.id) return;
      // Supabase 不建议在回调里直接 await 其它 SDK 调用，放到下一个事件循环
      window.setTimeout(() => void this.attach(user), 0);
    });

    window.addEventListener('online', () => {
      this.retryIndex = 0;
      if (this.state.user) void this.syncNow();
    });
    window.addEventListener('offline', () => {
      if (this.state.user) this.setState({ status: 'offline' });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden || !this.state.user) return;
      const last = this.state.lastSyncedAt ?? 0;
      if (Date.now() - last > FOCUS_PULL_MS) void this.refresh();
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.requireBackend().signIn(email.trim(), password);
    const user = await this.requireBackend().getSession();
    if (user) await this.attach(user);
  }

  async signUp(email: string, password: string): Promise<{ needsConfirm: boolean }> {
    const result = await this.requireBackend().signUp(email.trim(), password);
    if (!result.needsConfirm) {
      const user = await this.requireBackend().getSession();
      if (user) await this.attach(user);
    }
    return result;
  }

  async signOut(): Promise<void> {
    try {
      await this.backend?.signOut();
    } finally {
      this.detach();
    }
  }

  /** 手动「立即同步」：拉取 + 合并 + 上传 */
  async syncNow(): Promise<void> {
    if (!this.backend || !this.state.user) return;
    this.setState({ status: 'syncing', error: null });
    try {
      await this.pullAndMerge();
      await this.push();
    } catch (e) {
      this.fail(e);
    }
  }

  /** 回到前台 / 联网后的静默同步（不强制改状态，除非出错） */
  async refresh(): Promise<void> {
    if (!this.backend || !this.state.user) return;
    try {
      await this.pullAndMerge();
      await this.push();
      this.setState({ status: 'synced', lastSyncedAt: Date.now() });
    } catch (e) {
      this.fail(e);
    }
  }

  /* -------------------------------------------------------------- 内部 */

  private requireBackend(): SyncBackend {
    if (!this.backend) throw new Error('同步尚未初始化');
    return this.backend;
  }

  private setState(patch: Partial<SyncState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((fn) => fn());
  }

  private fail(err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    this.setState({ status: offline ? 'offline' : 'error', error: message });
    this.schedulePush(RETRY_MS[Math.min(this.retryIndex, RETRY_MS.length - 1)]);
    this.retryIndex += 1;
  }

  private markProgress(key: string, qid: string) {
    let set = this.dirtyProgress.get(key);
    if (!set) {
      set = new Set();
      this.dirtyProgress.set(key, set);
    }
    set.add(qid);
  }

  private markQMarks(course: string) {
    this.dirtyQMarks.add(course);
    this.qmarksSeq.set(course, (this.qmarksSeq.get(course) ?? 0) + 1);
  }

  private markQuiz(course: string) {
    this.dirtyQuiz.add(course);
    this.quizSeq.set(course, (this.quizSeq.get(course) ?? 0) + 1);
  }

  private async attach(user: SyncUser): Promise<void> {
    if (!this.backend) return;
    if (this.attachUserId === user.id && this.state.ready) return;

    this.attachUserId = user.id;
    const gen = ++this.sessionGen;
    this.setState({ ready: true, user, status: 'syncing', error: null });

    // 换账号登录：先清掉上一位用户留在本机的缓存（云端仍保留其数据）
    const owner = local.readOwner();
    if (owner && owner !== user.id) {
      local.clearUserData();
      this.dirtyProgress.clear();
      this.dirtyReading.clear();
      this.favoritesDirty = false;
      this.recentDirty = false;
      this.dirtyQMarks.clear();
      this.qmarksSeq.clear();
      this.dirtyQuiz.clear();
      this.quizSeq.clear();
    }
    local.writeOwner(user.id);

    try {
      // 首次登录前就存在的本机数据：补「现在」作为时间戳，参与上传
      for (const store of PROGRESS_STORES) {
        local.ensureProgressStamps(store.key);
        for (const qid of Object.keys(local.readProgressMeta(store.key))) {
          this.markProgress(store.key, qid);
        }
      }
      if (local.ensureFavoriteStamps().length > 0) {
        this.favoritesDirty = true;
        this.favoritesSeq += 1;
      }
      if (local.ensureRecentStamps().length > 0) {
        this.recentDirty = true;
        this.recentSeq += 1;
      }
      // 题目两本账：写入时自带时间戳，登录时把已有账目的课程全部标脏上传
      for (const course of local.qmarkCourses()) {
        if (local.hasAnyQMark(course)) this.markQMarks(course);
      }
      // 学习通题库背题账：旧记录缺时间戳的补「现在」，再整课标脏
      for (const course of local.quizCardCourses()) {
        local.ensureQuizStamps(course);
        this.markQuiz(course);
      }

      await this.pullAndMerge(gen);
      if (gen !== this.sessionGen) return;
      await this.push();
    } catch (e) {
      if (gen === this.sessionGen) this.fail(e);
    }
  }

  private detach() {
    this.sessionGen += 1;
    this.attachUserId = null;
    this.dirtyProgress.clear();
    this.dirtyReading.clear();
    this.favoritesDirty = false;
    this.recentDirty = false;
    this.dirtyQMarks.clear();
    this.qmarksSeq.clear();
    this.dirtyQuiz.clear();
    this.quizSeq.clear();
    this.retryIndex = 0;
    if (this.pushTimer !== null) {
      window.clearTimeout(this.pushTimer);
      this.pushTimer = null;
    }
    this.setState({ ready: true, status: 'guest', user: null, error: null, lastSyncedAt: null });
  }

  private async pullAndMerge(gen = this.sessionGen): Promise<void> {
    const backend = this.backend;
    if (!backend) return;
    const remote = await backend.pull();
    if (gen !== this.sessionGen) return;

    const now = Date.now();

    for (const store of PROGRESS_STORES) {
      const rows = remote.progress.filter((r) => r.course === store.course);
      const localMap = local.readProgress(store.key);
      const meta = local.readProgressMeta(store.key);
      if (rows.length === 0 && Object.keys(localMap).length === 0 && Object.keys(meta).length === 0) {
        continue;
      }
      const merged = mergeProgress(localMap, meta, rows);
      local.applyProgress(store.key, merged.map, merged.meta);
      for (const p of merged.push) this.markProgress(store.key, p.question_id);
    }

    // 收藏：课程名 ↔ slug 换算后按时间戳合并
    {
      const names = local.readFavorites();
      const metaNames = local.readFavoriteMeta();
      const localOn = new Set(names.map(courseSlugByName));
      const metaSlugs: FavoriteMeta = {};
      for (const [name, stamp] of Object.entries(metaNames)) {
        metaSlugs[courseSlugByName(name)] = stamp;
      }
      const merged = mergeFavorites(localOn, metaSlugs, remote.favorites, now);
      const nextNames: string[] = [];
      const nextMeta: FavoriteMeta = {};
      for (const slug of merged.on) {
        const name = courseNameBySlug(slug);
        if (name) nextNames.push(name);
      }
      for (const [slug, stamp] of Object.entries(merged.meta)) {
        const name = courseNameBySlug(slug);
        if (name) nextMeta[name] = stamp;
      }
      local.writeFavorites(nextNames, nextMeta);
      if (merged.push.length > 0) {
        this.favoritesDirty = true;
        this.favoritesSeq += 1;
      }
    }

    // 最近查看
    {
      const names = local.readRecent();
      const metaNames = local.readRecentMeta();
      const localSlugs = names.map(courseSlugByName);
      const metaSlugs: RecentMeta = {};
      for (const [name, t] of Object.entries(metaNames)) metaSlugs[courseSlugByName(name)] = t;
      const merged = mergeRecent(localSlugs, metaSlugs, remote.recent, now, RECENT_MAX);
      const nextNames: string[] = [];
      const nextMeta: RecentMeta = {};
      for (const slug of merged.list) {
        const name = courseNameBySlug(slug);
        if (name) nextNames.push(name);
      }
      for (const [slug, t] of Object.entries(merged.meta)) {
        const name = courseNameBySlug(slug);
        if (name) nextMeta[name] = t;
      }
      local.writeRecent(nextNames, nextMeta);
      if (merged.push.length > 0) {
        this.recentDirty = true;
        this.recentSeq += 1;
      }
    }

    // 阅读进度：按页面逐条取新，本地较新的回传
    {
      const localReading = local.readReading();
      const remoteReading = remote.reading ?? [];
      if (Object.keys(localReading).length > 0 || remoteReading.length > 0) {
        const merged = mergeReading(localReading, remoteReading);
        local.applyReading(merged.map);
        for (const draft of merged.push) this.dirtyReading.add(draft.page);
      }
    }

    // 题目两本账（收藏本/错题本）：一门课一本，逐条取新，本地较新的回传
    {
      const remoteQMarks = remote.qmarks ?? [];
      const byCourse = new Map<string, typeof remoteQMarks>();
      for (const row of remoteQMarks) {
        let rows = byCourse.get(row.course);
        if (!rows) {
          rows = [];
          byCourse.set(row.course, rows);
        }
        rows.push(row);
      }
      const courses = new Set([...byCourse.keys(), ...local.qmarkCourses()]);
      for (const course of courses) {
        const localMarks = local.readQMarks(course);
        const rows = byCourse.get(course) ?? [];
        if (rows.length === 0 && !local.hasAnyQMark(course)) continue;
        const merged = mergeQMarks(course, localMarks, rows);
        local.applyQMarks(course, merged.marks);
        if (merged.push.length > 0) this.markQMarks(course);
      }
    }

    // 学习通题库背题账：一卡一条，取新合并，本地较新的回传
    {
      const remoteQuiz = remote.quiz ?? [];
      const byCourse = new Map<string, typeof remoteQuiz>();
      for (const row of remoteQuiz) {
        const slug = quizSlugOfCloudCourse(row.course);
        if (!slug) continue;
        let rows = byCourse.get(slug);
        if (!rows) {
          rows = [];
          byCourse.set(slug, rows);
        }
        rows.push(row);
      }
      const courses = new Set([...byCourse.keys(), ...local.quizCardCourses()]);
      for (const course of courses) {
        const localCards = local.readQuizCards(course);
        const rows = byCourse.get(course) ?? [];
        if (rows.length === 0 && Object.keys(localCards).length === 0) continue;
        const merged = mergeQuizCards(localCards, rows);
        local.applyQuizCards(course, merged.map);
        if (merged.push.length > 0) this.markQuiz(course);
      }
    }
  }

  private schedulePush(delay = PUSH_DEBOUNCE_MS) {
    if (!this.state.user || !this.backend) return;
    if (this.pushTimer !== null) window.clearTimeout(this.pushTimer);
    this.pushTimer = window.setTimeout(() => {
      this.pushTimer = null;
      void this.push();
    }, delay);
  }

  private preparePush(): PreparedPush | null {
    const payload: PushPayload = { progress: [], favorites: [], recent: [], reading: [], qmarks: [], quiz: [] };
    const sentProgress: SentProgress[] = [];
    const sentReading: { page: string; t: number }[] = [];
    const deviceId = local.getDeviceId();
    const progressMetaCache = new Map<string, ProgressMeta>();
    const qmarksSeqSnapshot = new Map(this.qmarksSeq);
    const quizSeqSnapshot = new Map(this.quizSeq);

    for (const [key, qids] of this.dirtyProgress) {
      const store = progressStoreOf(key);
      if (!store) continue;
      let meta = progressMetaCache.get(key);
      if (!meta) {
        meta = local.readProgressMeta(key);
        progressMetaCache.set(key, meta);
      }
      for (const qid of qids) {
        const stamp = meta[qid];
        if (!stamp || !Number.isFinite(stamp.t)) continue;
        payload.progress.push({
          course: store.course,
          question_id: qid,
          result: stamp.r,
          updated_at: new Date(stamp.t).toISOString(),
          device_id: deviceId,
        });
        sentProgress.push({ key, qid, t: stamp.t });
      }
    }

    if (this.favoritesDirty) {
      const meta = local.readFavoriteMeta();
      for (const [name, stamp] of Object.entries(meta)) {
        payload.favorites.push({
          course: courseSlugByName(name),
          favorited: stamp.on,
          updated_at: new Date(stamp.t).toISOString(),
        });
      }
    }

    if (this.recentDirty) {
      const meta = local.readRecentMeta();
      for (const [name, t] of Object.entries(meta)) {
        payload.recent.push({
          course: courseSlugByName(name),
          viewed_at: new Date(t).toISOString(),
        });
      }
    }

    if (this.dirtyReading.size > 0) {
      const reading = local.readReading();
      for (const page of this.dirtyReading) {
        const entry = reading[page];
        if (!entry || !Number.isFinite(entry.t)) {
          // 已被裁剪 / 清除，或数据损坏：没有可上传的内容
          this.dirtyReading.delete(page);
          continue;
        }
        payload.reading.push({
          course: entry.c || page.split('/')[1] || 'hub',
          page,
          scroll_y: Number.isFinite(entry.y) ? Math.max(0, Math.round(entry.y)) : 0,
          percent: Number.isFinite(entry.p) ? Math.min(1, Math.max(0, entry.p)) : 0,
          section: entry.s ?? null,
          updated_at: new Date(entry.t).toISOString(),
          device_id: deviceId,
        });
        sentReading.push({ page, t: entry.t });
      }
    }

    if (this.dirtyQMarks.size > 0) {
      for (const course of this.dirtyQMarks) {
        const marks = local.readQMarks(course);
        for (const kind of ['fav', 'wrong'] as const) {
          for (const [qid, stamp] of Object.entries(marks[kind])) {
            if (!stamp || !Number.isFinite(stamp.t)) continue;
            payload.qmarks.push({
              course,
              question_id: qid,
              kind,
              marked: stamp.on,
              updated_at: new Date(stamp.t).toISOString(),
              device_id: deviceId,
            });
          }
        }
      }
    }

    if (this.dirtyQuiz.size > 0) {
      for (const course of this.dirtyQuiz) {
        const cards = local.readQuizCards(course);
        for (const [qid, card] of Object.entries(cards)) {
          if (!card || !Number.isFinite(card.t) || card.t <= 0) continue;
          payload.quiz.push({
            course: quizCloudCourse(course),
            question_id: qid,
            st: card.st,
            streak: card.streak,
            fails: card.fails,
            ivl: card.ivl,
            due: card.due,
            rv: card.rv,
            updated_at: new Date(card.t).toISOString(),
            device_id: deviceId,
          });
        }
      }
    }

    if (
      payload.progress.length === 0 &&
      payload.favorites.length === 0 &&
      payload.recent.length === 0 &&
      payload.reading.length === 0 &&
      payload.qmarks.length === 0 &&
      payload.quiz.length === 0
    ) {
      return null;
    }
    return {
      payload,
      sentProgress,
      sentReading,
      favoritesSeq: this.favoritesSeq,
      recentSeq: this.recentSeq,
      qmarksSeq: qmarksSeqSnapshot,
      quizSeq: quizSeqSnapshot,
    };
  }

  private async push(): Promise<void> {
    if (!this.backend || !this.state.user) return;
    if (this.pushing) {
      this.pushAgain = true;
      return;
    }

    const prepared = this.preparePush();
    if (!prepared) {
      if (this.state.status === 'syncing') this.setState({ status: 'synced' });
      return;
    }

    this.pushing = true;
    const gen = this.sessionGen;
    this.setState({ status: 'syncing', error: null });

    try {
      await this.backend.push(prepared.payload);
      if (gen !== this.sessionGen) return;
      this.clearSent(prepared);
      this.retryIndex = 0;
      this.setState({ status: 'synced', lastSyncedAt: Date.now() });
    } catch (e) {
      if (gen === this.sessionGen) this.fail(e);
    } finally {
      this.pushing = false;
      if (this.pushAgain) {
        this.pushAgain = false;
        this.schedulePush(0);
      }
    }
  }

  /** 上传成功：只清掉「发送时那一版」的脏标记，发送期间的新写入保留 */
  private clearSent(prepared: PreparedPush) {
    for (const sent of prepared.sentProgress) {
      const meta = local.readProgressMeta(sent.key);
      const current = meta[sent.qid];
      if (!current || current.t === sent.t) {
        const set = this.dirtyProgress.get(sent.key);
        set?.delete(sent.qid);
        if (set && set.size === 0) this.dirtyProgress.delete(sent.key);
      }
    }
    if (prepared.favoritesSeq === this.favoritesSeq) this.favoritesDirty = false;
    if (prepared.recentSeq === this.recentSeq) this.recentDirty = false;

    // 发送期间又写入的课程（序号变了）保留脏标记等下一轮
    for (const [course, seq] of prepared.qmarksSeq) {
      if (this.qmarksSeq.get(course) === seq) this.dirtyQMarks.delete(course);
    }
    for (const [course, seq] of prepared.quizSeq) {
      if (this.quizSeq.get(course) === seq) this.dirtyQuiz.delete(course);
    }

    if (prepared.sentReading.length > 0) {
      const reading = local.readReading();
      for (const sent of prepared.sentReading) {
        const current = reading[sent.page];
        // 发送期间又有新位置：保留脏标记等下一轮
        if (!current || current.t === sent.t) this.dirtyReading.delete(sent.page);
      }
    }
  }
}

/** 全站单例 */
export const syncManager = new SyncManager();

export type { FavoritePushDraft, ProgressPushDraft };

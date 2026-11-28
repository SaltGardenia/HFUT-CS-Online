/** 云端读写适配层：SyncManager 只依赖这个接口，测试可换成内存实现。 */
import type {
  PushPayload,
  RemoteFavoriteRow,
  RemoteProgressRow,
  RemoteQMarkRow,
  RemoteQuizRow,
  RemoteReadingRow,
  RemoteRecentRow,
  SyncUser,
} from './types';
import { getSupabase } from './client';

export interface PullResult {
  progress: RemoteProgressRow[];
  favorites: RemoteFavoriteRow[];
  recent: RemoteRecentRow[];
  reading: RemoteReadingRow[];
  qmarks: RemoteQMarkRow[];
  quiz: RemoteQuizRow[];
}

export interface SyncBackend {
  getSession(): Promise<SyncUser | null>;
  onAuthChange(cb: (event: string, user: SyncUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirm: boolean }>;
  signOut(): Promise<void>;
  pull(): Promise<PullResult>;
  push(payload: PushPayload): Promise<void>;
}

function toUser(u: { id: string; email?: string | null } | null | undefined): SyncUser | null {
  return u ? { id: u.id, email: u.email ?? null } : null;
}

function ensure(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

/** 云端还没执行新版 schema（缺 user_reading / user_qmarks / user_quiz_cards 表或对应函数） */
function isMissingOptionalTable(err: { code?: string }): boolean {
  return (
    err.code === 'PGRST202' ||
    err.code === 'PGRST205' ||
    err.code === '42883' ||
    err.code === '42P01'
  );
}

export function createSupabaseBackend(): SyncBackend {
  /** 探测结果：新表/新函数是否可用。不可用时阅读进度与题目两本账只留本机，其余同步照常 */
  let readingAvailable: boolean | null = null;
  let qmarksAvailable: boolean | null = null;
  let quizAvailable: boolean | null = null;

  return {
    async getSession() {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getSession();
      ensure(error);
      return toUser(data.session?.user);
    },

    onAuthChange(cb) {
      let unsub: (() => void) | null = null;
      void getSupabase().then((supabase) => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          cb(event, toUser(session?.user));
        });
        unsub = () => data.subscription.unsubscribe();
      });
      return () => unsub?.();
    },

    async signIn(email, password) {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      ensure(error);
    },

    async signUp(email, password) {
      const supabase = await getSupabase();
      const base = import.meta.env.BASE_URL || '/';
      const redirectTo = new URL(base, window.location.origin).toString();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      ensure(error);
      // 开启「确认邮箱」时不会直接返回会话
      return { needsConfirm: !data.session };
    },

    async signOut() {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();
      ensure(error);
    },

    async pull() {
      const supabase = await getSupabase();
      const [progress, favorites, recent, reading, qmarks, quiz] = await Promise.all([
        supabase.from('user_progress').select('course,question_id,result,updated_at'),
        supabase.from('user_favorites').select('course,favorited,updated_at'),
        supabase.from('user_recent').select('course,viewed_at'),
        readingAvailable === false
          ? null
          : supabase
              .from('user_reading')
              .select('course,page,scroll_y,percent,section,updated_at'),
        qmarksAvailable === false
          ? null
          : supabase.from('user_qmarks').select('course,question_id,kind,marked,updated_at'),
        quizAvailable === false
          ? null
          : supabase
              .from('user_quiz_cards')
              .select('course,question_id,st,streak,fails,ivl,due,rv,updated_at'),
      ]);
      ensure(progress.error);
      ensure(favorites.error);
      ensure(recent.error);
      if (reading) readingAvailable = !reading.error;
      if (qmarks) qmarksAvailable = !qmarks.error;
      if (quiz) quizAvailable = !quiz.error;
      return {
        progress: (progress.data ?? []) as RemoteProgressRow[],
        favorites: (favorites.data ?? []) as RemoteFavoriteRow[],
        recent: (recent.data ?? []) as RemoteRecentRow[],
        reading: (reading?.data ?? []) as RemoteReadingRow[],
        qmarks: (qmarks?.data ?? []) as RemoteQMarkRow[],
        quiz: (quiz?.data ?? []) as RemoteQuizRow[],
      };
    },

    async push(payload) {
      const supabase = await getSupabase();
      const { error } = await supabase.rpc('sync_push', {
        p_progress: payload.progress,
        p_favorites: payload.favorites,
        p_recent: payload.recent,
      });
      ensure(error);

      // 阅读进度单独走一个 RPC：老库没有这个函数时静默跳过，不拖垮其它数据
      if (payload.reading.length > 0 && readingAvailable !== false) {
        const { error: readingError } = await supabase.rpc('sync_push_reading', {
          p_reading: payload.reading,
        });
        if (!readingError) readingAvailable = true;
        else if (isMissingOptionalTable(readingError)) readingAvailable = false;
        else ensure(readingError);
      }

      // 题目两本账（收藏本/错题本）同阅读进度的降级策略
      if (payload.qmarks.length > 0 && qmarksAvailable !== false) {
        const { error: qmarksError } = await supabase.rpc('sync_push_qmarks', {
          p_qmarks: payload.qmarks,
        });
        if (!qmarksError) qmarksAvailable = true;
        else if (isMissingOptionalTable(qmarksError)) qmarksAvailable = false;
        else ensure(qmarksError);
      }

      // 学习通题库背题账：同款降级（老库没跑新 SQL 时仅本机保留）
      if (payload.quiz.length > 0 && quizAvailable !== false) {
        const { error: quizError } = await supabase.rpc('sync_push_quiz', {
          p_quiz: payload.quiz,
        });
        if (!quizError) quizAvailable = true;
        else if (isMissingOptionalTable(quizError)) quizAvailable = false;
        else ensure(quizError);
      }
    },
  };
}

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { syncManager, useSync } from '../lib/sync';
import type { SyncStatus } from '../lib/sync';
import { IconUser, IconX } from './icons';

type AuthMode = 'signin' | 'signup';

const STATUS_TEXT: Record<SyncStatus, string> = {
  disabled: '',
  guest: '',
  syncing: '同步中…',
  synced: '已同步',
  offline: '离线，联网后自动同步',
  error: '同步失败，可稍后重试',
};

/** Supabase 的英文错误 → 简短中文提示 */
function authErrorText(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/invalid login credentials/i.test(msg)) return '邮箱或密码不正确';
  if (/email not confirmed/i.test(msg)) return '邮箱尚未验证，请先查收验证邮件';
  if (/user already registered/i.test(msg)) return '该邮箱已注册，请直接登录';
  if (/password should be at least|password.*6 characters/i.test(msg)) return '密码至少 6 位';
  if (/rate limit|too many|for security purposes/i.test(msg)) return '操作过于频繁，请稍后再试';
  if (/failed to fetch|network/i.test(msg)) return '网络不可用，请检查连接';
  return '操作失败，请稍后重试';
}

/** 顶栏账号入口：未配置 Supabase 时整体不渲染；游客点击直接进登录框 */
export default function AccountButton() {
  const sync = useSync();
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 菜单：点击外部 / Esc 收起
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // 登录框：Esc 关闭
  useEffect(() => {
    if (!mode) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setMode(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode]);

  if (!sync.enabled) return null;

  const user = sync.user;

  const openAuth = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !mode) return;
    if (!email.trim()) {
      setError('请输入邮箱');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === 'signin') {
        await syncManager.signIn(email, password);
        setMode(null);
        setPassword('');
      } else {
        const result = await syncManager.signUp(email, password);
        if (result.needsConfirm) {
          setNotice('验证邮件已发送，点击邮件里的链接后再回来登录。');
        } else {
          setMode(null);
          setPassword('');
        }
      }
    } catch (err) {
      setError(authErrorText(err));
    } finally {
      setBusy(false);
    }
  };

  const syncStatusText = user ? STATUS_TEXT[sync.status] : '';

  return (
    <>
      <div className="topbar-ctl nav-pill account-wrap" ref={wrapRef}>
        <button
          type="button"
          className="account-btn"
          aria-haspopup={user ? 'menu' : 'dialog'}
          aria-expanded={user ? menuOpen : undefined}
          aria-label={user ? `${user.email ?? '账号'}，${syncStatusText || '已登录'}` : '登录账号'}
          title={user?.email ?? '登录账号'}
          onClick={() => (user ? setMenuOpen((v) => !v) : openAuth('signin'))}
        >
          <IconUser size={17} />
          {!user && <span className="account-label">登录</span>}
          {user && <span className={`account-dot ${sync.status}`} aria-hidden="true" />}
        </button>

        <AnimatePresence>
          {menuOpen && user && (
            <motion.div
              className="account-menu"
              role="menu"
              aria-label="账号"
              initial={reduced ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16 }}
            >
              <div className="account-menu-mail" title={user.email ?? ''}>
                {user.email}
              </div>
              {syncStatusText && <div className="account-menu-status">{syncStatusText}</div>}
              <button
                type="button"
                className="account-menu-item"
                role="menuitem"
                disabled={sync.status === 'syncing'}
                onClick={() => {
                  setMenuOpen(false);
                  void syncManager.syncNow();
                }}
              >
                立即同步
              </button>
              <button
                type="button"
                className="account-menu-item danger"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  void syncManager.signOut();
                }}
              >
                退出登录
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 登录 / 注册弹窗：portal 到 body。顶栏右组在窄屏带 backdrop-filter，
          会成为 fixed 后代的包含块，弹窗会被压进顶栏里 */}
      {createPortal(
        <AnimatePresence>
          {mode && (
            <motion.div
              className="hub-modal-scrim"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => setMode(null)}
            >
              <motion.div
                className="hub-modal material"
                role="dialog"
                aria-modal="true"
                aria-label={mode === 'signin' ? '登录' : '注册'}
                initial={reduced ? undefined : { opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 6 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="hub-modal-head">
                  <h2>{mode === 'signin' ? '登录' : '注册'}</h2>
                  <button className="icon-btn" onClick={() => setMode(null)} aria-label="关闭">
                    <IconX size={16} />
                  </button>
                </div>

                <form className="auth-form" onSubmit={submit}>
                  <label className="auth-field">
                    <span>邮箱</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </label>
                  <label className="auth-field">
                    <span>密码</span>
                    <input
                      type="password"
                      name="password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </label>

                  {error && <p className="auth-error">{error}</p>}
                  {notice && <p className="auth-notice">{notice}</p>}

                  <div className="hub-modal-actions">
                    <button
                      type="button"
                      className="auth-switch"
                      onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setError(null);
                        setNotice(null);
                      }}
                    >
                      {mode === 'signin' ? '没有账号？注册' : '已有账号？登录'}
                    </button>
                    <button type="submit" className="btn" disabled={busy}>
                      {busy ? '请稍候…' : mode === 'signin' ? '登录' : '创建账号'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

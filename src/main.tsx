import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { TocProvider } from './lib/toc';
import { syncManager } from './lib/sync';
import App from './App';
import ReadingMark from './components/ReadingMark';
import AskAiLayer from './components/AskAiLayer';
import './styles/tokens.css';
import './styles/base.css';
import './styles/hub.css';
import './styles/errata.css';

// 滚动恢复交给各页面自己处理（首页有"离开时记住位置"、课程页有 scroll-spy 记忆），
// 关掉浏览器原生恢复，避免它在我们恢复之后又按自己的记录改写滚动位置（同 hash 内导航会竞态）。
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// 账号同步：未配置 Supabase 环境变量时自动停用，站点保持纯本地游客模式
void syncManager.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TocProvider>
        <HashRouter>
          <App />
          {/* 章节页标题右侧的「问问 AI」：按路由在所有课程页统一挂载 */}
          <AskAiLayer />
          <ReadingMark />
        </HashRouter>
      </TocProvider>
    </ThemeProvider>
  </StrictMode>,
);

// 离线缓存：生产环境注册 Service Worker（站点为纯静态产物，可完整离线）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 本页加载时已由旧 SW 接管的情况下，新 SW 一接管就刷新一次：否则这次打开仍是旧构建。
    // 同一标签页只自动刷新一次，避免万一接管反复时刷成死循环。
    const reloadKey = 'hb-sw-reloaded';
    const hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      try {
        if (sessionStorage.getItem(reloadKey)) return;
        sessionStorage.setItem(reloadKey, '1');
      } catch {
        return; // 隐私模式：不自动刷新，交给用户
      }
      window.location.reload();
    });
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js?b=${__BUILD_ID__}`, { updateViaCache: 'none' })
      .then((reg) => reg.update().catch(() => {}))
      .catch(() => {});
  });
}

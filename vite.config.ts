/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** 部署在 GitHub Pages 项目站点（https://saltgardenia.github.io/HFUT-CS-Online/）。 */
const SITE_BASE = '/HFUT-CS-Online/';

/**
 * 本次构建号：随构建时间变化，注册 Service Worker 时拼进脚本地址（sw.js?b=<构建号>）。
 * 每次部署地址都不同 → 浏览器必然装上新 SW → 缓存名换代、旧缓存回收；
 * 否则 sw.js 内容与缓存名常年不变，部署后仍一直供旧 HTML（新功能只能靠强制刷新出现）。
 */
const BUILD_ID = Date.now().toString(36);

export default defineConfig({
  base: SITE_BASE,
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

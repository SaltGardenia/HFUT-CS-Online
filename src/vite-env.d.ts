/// <reference types="vite/client" />

/** 构建号，由 vite.config.ts 的 define 注入（用于 Service Worker 缓存换代） */
declare const __BUILD_ID__: string;

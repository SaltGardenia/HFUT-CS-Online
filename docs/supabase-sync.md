# 账号与云端同步实施方案

> 目标：保留现有纯静态站点，把「收藏 / 最近查看 / 答题进度」升级为账号级数据。
> 游客无需注册即可继续答题；登录后自动绑定并上传本机已有进度；换设备登录后自动恢复。

## 1. 总体架构

```
浏览器（React SPA，GitHub Pages 静态托管）
├── 页面组件 ── useProgressStore / useFavoriteCourses / useRecentCourses
│                │
│                ├─ localStorage（立即写，离线可用）
│                └─ SyncManager（防抖 0.9s、离线重试、跨标签页广播）
│                        │  @supabase/supabase-js（按需加载）
│                        ▼
└── Supabase（PostgreSQL + Auth + PostgREST）
        user_progress / user_favorites / user_recent   ← RLS 仅本人可见
        sync_push() 批量条件 upsert（updated_at 新者胜）
```

- **没有新增后端服务**：Supabase 负责数据库、认证和 API。
- **localStorage 仍是第一落点**：断网、刷新、未登录都能正常答题。
- **SDK 懒加载**：未登录访客不会下载 Supabase SDK；未配置环境变量时账号入口整体隐藏，站点行为与现在完全一致。

## 2. 数据模型

| 表 | 主键 | 字段 | 说明 |
| --- | --- | --- | --- |
| `profiles` | `id` | `display_name`, `created_at`, `updated_at` | 注册时由触发器自动创建，昵称默认邮箱前缀 |
| `user_progress` | `(user_id, course, question_id)` | `result`, `updated_at`, `device_id` | 每题一行；`result = null` 是「清空」墓碑 |
| `user_favorites` | `(user_id, course)` | `favorited`, `updated_at` | 收藏/取消收藏都保留一行，按时间比较 |
| `user_recent` | `(user_id, course)` | `viewed_at` | 每课一行，取最大时间 |

`course` 使用课程路由 slug（`algo` / `os` / `net` / `ca` / …），与 `src/lib/sync/keys.ts` 的登记表一致。

答题进度沿用现有 localStorage 数据格式（题号 → `right | wrong | revealed`），云端只是镜像，前端无需迁移旧数据。时间戳另存于 `hb-progress-meta:<storeKey>`，不改动页面读写的数据形状。

## 3. 冲突与合并策略

| 场景 | 规则 |
| --- | --- |
| 不同题目 | 直接并集 |
| 同一题目 | 比较 `updated_at`，新者胜；同毫秒保留云端 |
| 清空进度 | 写 `result = null` 墓碑参与比较，旧云端作答不会把已清空的题复活 |
| 收藏 / 最近查看 | 逐课程按 `updated_at` / `viewed_at` 合并，取集合而不是整表覆盖 |
| 首次登录前的本机数据 | 没有时间戳，登录时补成「现在」，视为本机最新并上传 |
| 换账号登录 | 检测到本机缓存属于上一账号时先清空本机缓存（云端仍保留），防止把 A 的进度上传进 B 的账号 |
| 断网 / 请求失败 | 脏标记保留，4s → 12s → 30s 重试；`online`、回到前台、手动「立即同步」都会触发 |

服务端 `sync_push()` 使用 `on conflict ... do update ... where excluded.updated_at > 表.updated_at`，即使请求乱序到达，旧数据也不会覆盖新数据。

## 4. 游客 → 登录 → 多设备

1. 游客答题：只写 localStorage，同时在 `hb-progress-meta:*` 记录每题时间；
2. 点击「登录」注册/登录：Supabase Auth 返回会话；
3. 本机历史数据补时间戳 → 拉取云端 → 逐条合并 → 回写本机 → 上传本机较新的记录；
4. 其他设备登录：同一套合并流程，云端进度自动恢复到本机；
5. 之后每次作答：本地立即生效，0.9 秒防抖后增量上传；
6. 回到前台且距上次同步超过 60 秒：自动拉取一次，吸收其他设备的修改。

## 5. 代码地图

| 文件 | 作用 |
| --- | --- |
| `src/lib/sync/config.ts` | 读取 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`，未配置则停用 |
| `src/lib/sync/client.ts` | Supabase 客户端单例（PKCE + 会话持久化 + 懒加载） |
| `src/lib/sync/backend.ts` | 认证与 `sync_push` / 三表读取的适配层 |
| `src/lib/sync/manager.ts` | SyncManager：登录、拉取合并、防抖上传、重试、跨标签页 |
| `src/lib/sync/local.ts` | localStorage 读写、每题时间戳、墓碑、订阅广播 |
| `src/lib/sync/merge.ts` | 纯合并函数（有单测） |
| `src/lib/sync/react.ts` | `useSync` / `useProgressStore` / `useStoredRecord` 等 Hook |
| `src/components/AccountButton.tsx` | 顶栏账号入口、登录/注册弹窗、手动同步/退出 |
| `supabase/schema.sql` | 建表、RLS、触发器、`sync_push()`、授权 |
| `src/__tests__/sync.test.ts` | 合并规则、时间戳、墓碑、键登记完整性 |

## 6. 需要你操作的步骤清单

### A. 创建 Supabase 项目

1. 打开 <https://supabase.com/dashboard>，用 GitHub 登录；
2. **New project**：名称随意（如 `hfut-cs-online`），区域选 `Northeast Asia (Tokyo)` 或 `Southeast Asia (Singapore)`；
3. 设置数据库密码并妥善保存（本方案前端不需要它）；
4. 等待项目初始化完成（约 1–2 分钟）。

### B. 建表与权限

1. 左侧 **SQL Editor → New query**；
2. 把仓库里的 `supabase/schema.sql` 整份粘贴进去，点击 **Run**；
3. 确认没有报错；左侧 **Table Editor** 应出现 `profiles`、`user_progress`、`user_favorites`、`user_recent`；
4. 每张表的 **RLS** 标记应为已启用（表名旁有盾牌/`RLS enabled`）。

> 脚本可重复执行；重复运行只会重建策略/函数，不会清空数据。

### C. 认证设置

1. **Authentication → Providers → Email**：保持启用；
2. **Authentication → Sign In / Up**：
   - 若希望注册后立刻登录：关闭 **Confirm email**；
   - 若保留邮箱验证：保持开启，验证链接会回到站点首页（PKCE 已适配 HashRouter）；
3. **Authentication → URL Configuration**：
   - **Site URL**：`https://saltgardenia.github.io/HFUT-CS-Online/`
   - **Redirect URLs** 追加：
     - `https://saltgardenia.github.io/HFUT-CS-Online/`
     - `http://localhost:5173/HFUT-CS-Online/`
     - 若使用分支预览，再追加 `https://saltgardenia.github.io/HFUT-CS-Online/preview/*`
4. 建议保持邮箱密码登录的最小配置；第三方登录（Google/GitHub）可后续再加。

### D. 取连接信息

1. **Project Settings → API**；
2. 复制 **Project URL**（形如 `https://xxxx.supabase.co`）；
3. 复制 **Publishable key**（`sb_publishable_...`；旧项目里的 `anon public` 等价）；
4. 不要复制 `service_role` / Secret key，任何前端变量都不要用它。

### E. 本地联调

1. 在仓库根目录新建 `.env.local`（已被 `.gitignore` 的 `*.local` 忽略）：

   ```bash
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_...
   ```

2. `npm run dev`，首页与课程页顶栏出现「登录」；
3. 注册一个测试账号，答几道题，退出后重新登录，确认进度仍在；
4. 换一个浏览器/无痕窗口登录同一账号，确认进度恢复。

### F. 线上部署

1. GitHub 仓库 → **Settings → Secrets and variables → Actions → Variables**；
2. 新建两个 **Repository variable**（不是 Secret，Publishable Key 可公开）：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. 下一次发布（合并发布 PR 触发 `deploy-release.yml`）或手动跑 `Deploy previews (push)` 时会把它们注入构建；
4. 部署完成后打开线上站点，顶栏出现「登录」即接入成功；
5. 未配置变量时构建不会失败，账号入口自动隐藏。

### G. 验收清单

- [ ] 游客答题、刷新、关浏览器再打开，进度不丢
- [ ] 注册后本机已有进度出现在新账号里
- [ ] 退出登录后本机进度仍可继续使用（游客态）
- [ ] 另一台设备登录同账号，答题进度 / 收藏 / 最近查看全部恢复
- [ ] 清空某份试卷后换设备登录，不会被云端旧进度复活
- [ ] 断网答题，恢复网络后自动补传（账号菜单显示「已同步」）
- [ ] 用浏览器控制台确认无法读取其他用户的行（RLS）

## 7. 安全与运维

- **RLS**：四张表全部启用，策略只允许 `auth.uid() = user_id`；`sync_push()` 是 `security invoker`，同样受 RLS 约束。
- **密钥**：前端只出现 Publishable Key；Service Role Key 一旦泄露可绕过 RLS，绝不入库、不进构建变量。
- **账号删除**：当前客户端不提供自助注销（需要 service_role 或 Edge Function）。可在 Supabase Dashboard 删除用户，`on delete cascade` 会一并清理其数据。若需要产品化注销，第二阶段加一个 Edge Function。
- **备份**：Supabase 免费档有每日备份；数据量很小（单用户几百行）。
- **配额**：免费档 500MB 数据库、50k 月活，足够本站在校使用。
- **清理**：`user_progress` 的墓碑会长期保留（用于冲突判断），可按 `updated_at` 定期清理一年前的 `result is null` 行。

## 8. 分期计划

**第一阶段（本次已实现）**
- 邮箱密码注册/登录/退出
- 游客优先 + 登录合并上传
- 进度、收藏、最近查看云端同步
- 防抖上传、离线重试、回到前台拉取、手动同步
- RLS + 批量条件 upsert

**第二阶段（按需）**
- 邮箱验证码 / Magic Link 登录
- Google / GitHub OAuth
- 实时订阅（`postgres_changes`）实现两台设备秒级同步
- 错题本独立表、学习统计、排行榜
- 自助注销（Edge Function）
- 账号资料页（修改昵称/密码/绑定邮箱）

## 9. 回滚

- 前端：删除两个仓库变量并重新部署即可回到纯本地模式；本机 localStorage 数据不受影响。
- 数据库：`drop schema` 不需要；保留表不影响未登录用户。若要彻底停用，撤销 `authenticated` 表权限即可。

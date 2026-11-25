> [!IMPORTANT]
> 分支请从 `main` 切出，PR 也对 `main`。本仓库没有 `dev` 分支。

# 🎉 欢迎参与 HFUT-CS-Online

HFUT-CS-Online 是面向合工大计算机同学的课程资料站：把 4 个开源资料仓库的课件、试卷与附件整理成统一目录，再把其中适合复习的部分做成在线页面。站点是纯静态的 React 应用，内容以 TypeScript 数据的形式随仓库分发。

不论你写不写代码，都能帮上忙：补一份课件、校对一道题、指出版式问题，或者直接改一行样式。这份指南说明本地怎么跑、内容有哪些契约、PR 怎么提。

## 🌟 快速链接

- [在线站点](https://saltgardenia.github.io/HFUT-CS-Online/)
- [站点架构](docs/ARCHITECTURE.md)
- [读者勘误格式](src/content/errata/README.md)
- [补充资料投稿规则](补充资料/README.md)
- [Issue Tracker](https://github.com/SaltGardenia/HFUT-CS-Online/issues)

## 1. 🚀 你可以怎么贡献

- 📚 **补充资料**：课件、试卷、实验指导、代码与报告，放进 `补充资料/`
- ✍️ **提交勘误**：站内顶栏原地改正文，一键开 PR，不需要本地环境
- 🐛 **报错 / 提建议**：开 issue，附上页面链接与截图
- 🛠️ **改代码**：课程页、交互动画、在线练习、同步与 UI
- 🧪 **补测试**：内容契约、题库规则、组件渲染
- 🌐 **校对内容**：对照课件逐节检查某门课的讲义，改错字、补遗漏、修公式

内容类贡献（资料、勘误、校对）不需要你会写代码。放好文件、跑一次 `npm run catalog:supplement`，就能提 PR。

## 2. 🛠️ 开发环境

### 需要什么

- **Node.js ≥ 22**（CI 与 GitHub Pages 部署均使用 22）
- **git**

### Fork 与克隆

1. Fork [SaltGardenia/HFUT-CS-Online](https://github.com/SaltGardenia/HFUT-CS-Online)
2. 克隆你的 fork：

```bash
git clone https://github.com/<your-github-username>/HFUT-CS-Online.git
cd HFUT-CS-Online
npm ci
```

仓库里没有子模块，克隆与构建都不需要额外下载资料。4 个上游资料仓库（合计约 7.3GB）只用于整理 `data/`，**跑站点、`npm run build`、`npm test` 都用不到**；确实要重新整理资料时，按 `data/整理说明.md` 里的地址自行 `git clone --depth 1` 到仓库根的同名目录（已被 `.gitignore` 忽略）。

### 切分支

```bash
git checkout -b fix/practice-heatmap
```

## 3. 🎯 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（`predev` 会先重建目录数据） |
| `npm run build` | 类型检查 + 产线构建（输出 `dist/`） |
| `npm test` / `npm run test:watch` | 运行全部 Vitest 测试（当前 20 个测试文件、307 项） |
| `npm run typecheck` | 仅类型检查（`tsc -b`） |
| `npm run catalog` | 全量重建 `src/content/catalog.ts` 与附件清单（需要本地 `data/`，仅维护者用） |
| `npm run catalog:supplement` | 只合并 `补充资料/` 的增量重建（不需要 `data/`，贡献者与 CI 用这个） |
| `npm run catalog:check` | 校验生成物是否最新，不同步时列出要改的文件（CI 会跑） |
| `npm run migrate` | 重新从源数据生成算法课讲义模块（一般无需手动跑） |

提交 PR 前，请确保 `npm run typecheck`、`npm test` 与 `npm run catalog:check` 全部通过。CI（`.github/workflows/ci.yml`）会在 push 到 `main` 和所有 PR 上跑类型检查、单元测试、资料目录生成物校验与构建，任何一步失败都会挡住合并。

## 4. 📁 项目结构

```
src/
├── content/                 # 全部课程内容（数据即内容）
│   ├── deck1.ts…deck8.ts    # 算法课八讲：sections → blocks（html / demo / quiz）
│   ├── home.ts              # 算法课首页（含八讲内容地图）
│   ├── types.ts             # 算法课内容契约（DeckData / Section / QuizData …）
│   ├── practice/            # 算法课在线练习题库
│   ├── <course>/            # 其余课程的章节、题库、试卷（net/、os/、db/ …）
│   ├── errata/              # 读者勘误 JSON，合并后由 errata.ts 叠加
│   └── catalog.ts           # 【生成】课程目录统计，随提交入库
├── courses/                 # 课程注册表 + 31 个课程根组件
├── components/              # UI 组件；demos/ 下是各算法与协议动画
├── pages/                   # 首页、课程页、练习页、附件页
├── lib/                     # 勘误、主题、同步、收藏、最近查看
├── styles/                  # tokens.css 设计令牌 + base.css + 各课程私有样式
└── __tests__/               # 内容 / 动画 / 题库 / 同步 / 勘误契约测试
data/                        # 课程资料库（4 个上游仓库的整理产物，仅本地、不入库）
补充资料/                    # 本站自有补充资料（入库，随本仓库分发）
scripts/                     # 目录构建、内容迁移脚本
```

### 多课程架构

- `src/courses/registry.ts` 是课程注册的**唯一事实源**：`{ id, name, semester, base, ready, source }` 决定课程挂在哪个路由、属于哪个学期、是否上线。
- 每门课自带导航与页面布局，互不继承；统一性来自 `src/styles/tokens.css` 与 `base.css` 的通用基类。课程私有样式放独立文件，不塞进全局表。
- `src/content/catalog.ts` 由 `scripts/build-catalog.mjs` 扫描 `data/` 与 `补充资料/` 生成，**生成物随提交入库**，运行时零 IO；只改 `补充资料/` 时跑 `npm run catalog:supplement`（不需要 `data/`），维护者整理完 `data/` 才需要全量 `npm run catalog`。
- 新增一门已上线课程：在 `src/courses/` 新建课程根组件 → 在 `registry.ts` 加一条记录 → 在 `src/App.tsx` 加一条懒加载 Route（目前是显式列举，尚未按 registry 自动映射）→ 跑 `npm run catalog`。步骤细节见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 5. ✍️ 内容贡献

### 修改 / 新增讲义内容

讲义在 `src/content/deckN.ts`，遵循 `src/content/types.ts` 的契约（Section → Block）。注意：

- **纯文本字段不要写 HTML 实体**：`toc`、`heading`、`title`、动画标题、知识点标签、判分答案会按原文渲染，直接写 `Θ`、`Ω`、`⟨⟩` 等字符即可；`&Theta;` 这类实体会原样显示，测试会拦截。
- **题干 / 选项 / 解析按 HTML 渲染**：可以用 `<sup>`、`<strong>` 等标签；`^n`、`_n` 这类记法在展示层会自动转为上下标。
- **讲次编号是联动字段**：`deck1…deck8` 对应「第 1 讲…第 8 讲」，`no` 字段、路由、导航等多处共用，改编号时请整体一致。
- 其余课程的章节数据在 `src/content/<course>/`，每门课有自己的 `types.ts`；改结构前先看该课程有没有对应的 `*-content.test.ts`，有就以测试里的契约为准。

### 在线练习题库

算法课题库在 `src/content/practice/`，契约由 `src/__tests__/practice.test.ts` 锁定：

- **题量锁定**：单选 / 多选 / 判断 / 填空各 100 题、简答题 20 题；调整题量需同步修改测试。
- **答案格式**：单选 `/^[A-F]$/`，多选 `A、B、C`（顿号分隔），判断 `对/错`，填空多个可接受写法用全角 `｜` 分隔。
- **知识点标签必须真实存在**：每题的 `tags: {deck, sec, text}` 中 `sec` 必须出现在对应 `deckN` 的 toc 里，否则测试失败。
- **选题域仅限 8 讲课件内容**：回溯、分支限界、TSP、Floyd、多段图、N 皇后等课外算法不要加入。
- 简答题（essay）不判分：`answer` 为参考答案 HTML，`explanation` 为评分要点。
- 其余课程的题库 / 试卷数据在 `src/content/<course>/`。已有测试的课程由对应的 `*-content.test.ts` 或题库测试锁定量与格式；新增课程请顺手补一份契约测试。

### 自测题与动画

各讲自测题遵循 `QuizData` 契约。交互动画（demo block）按 `name` 注册到对应组件，新增动画需同时补 `demos.test.tsx` 可渲染的用例。计网等课程的协议动画集中在 `src/components/demos/net-*`，按 `network-registry.ts` 注册。

### 读者勘误

站点顶栏的铅笔入口可进入原地编辑模式：读者直接改正文 → 底部胶囊「提交勘误」→ 生成 `src/content/errata/<id>.json` 并开 PR。默认走 GitHub「新建文件」预填页（无需任何配置，GitHub 会自动 fork）；在提交弹窗里填入个人令牌则直接调用 API 建分支 / 开 PR。

- 每个 PR 只新增一个 JSON，格式见 [src/content/errata/README.md](src/content/errata/README.md)。
- 合并后由 `src/content/errata.ts` 在渲染时套用（按 `page` + `anchor` + 原文定位，匹配不到就静默跳过），不修改 `deckN.ts` 原文。
- 若希望落回内容源：按 JSON 手工改对应段落，再删掉该文件；两者同时存在不会重复生效。
- 改 schema 时同步更新 `src/__tests__/errata.test.ts` 的契约校验。

### 课程资料（PDF / 试卷等）

| | `data/` | `补充资料/` |
| --- | --- | --- |
| 来源 | 4 个上游资料仓库的整理产物 | 本站自收 / 同学投稿 |
| 是否入库 | 不入库（仅本地，`.gitignore` 已忽略） | **入库**，随仓库分发 |
| 附件页下载 | 跳转上游仓库 raw 直链 | 本仓库 raw 直链 |

- 上游已有的资料放 `data/<学期>/<课程>/{课件,试题,附件}/`（契约见 `data/整理说明.md`）。
- 上游没有的新资料放 `补充资料/` 的同一套目录结构（规则见 [补充资料/README.md](补充资料/README.md)）。课程名须与 `data/` 中同名课程完全一致，否则会被当成另一门课。
- 文件名保持原样，不要为了排序加序号；与 `data/` 同名同路径冲突时，补充资料的一份加 `（本站补充）` 后缀。
- 放好后跑 `npm run catalog:supplement`，并把重新生成的 `src/content/catalog.ts` 与 `public/attachments/*.json` 一并提交。不需要 `data/`——这个模式以已入库的生成物为底，只合并 `补充资料/` 的变化；CI 会用 `npm run catalog:check` 校验生成物是否最新。

## 6. 🎨 样式与交互约定

- 设计变量集中在 `src/styles/tokens.css`（颜色、圆角、阴影、各讲主题色），不要在组件里写死颜色值。
- 暗色模式由根元素 `[data-theme='dark']` 切换，新样式请两个主题都过一遍。
- **悬浮反馈不使用颜色填充**：hover 用边框加深、阴影、位移、下划线等表达；选中 / 激活等静态状态不受此限。
- UI 文案克制：不写解释机制、复述操作的说明文字；统计数字除外。
- 每讲 / 每章的主题色从共享色板分配，新增课程或章节时选与现有色相拉得开的颜色，别和相邻课程撞色。
- 顶栏与路由使用 HashRouter，`vite.config.ts` 的 `base` 为 `/HFUT-CS-Online/`——**仓库若改名需同步修改 base 与 deploy workflow 的 `SITE_BASE`**。
- 新增静态资源引用时不要写死绝对路径：分支预览会把整站搬进 `/preview/<slug>/`，路径要跟随 `BASE_URL`。

## 7. 📤 提交 PR

### 提交信息

使用 Conventional Commits，scope 用模块名，描述用中文。PR 标题也用同一格式，它本身就是合并后的变更说明：

| 类型 | 例子 |
| --- | --- |
| `feat` | `feat(practice): 热力图分块标题支持切换题型` |
| `fix` | `fix(nav): 紧凑档顶栏溢出` |
| `docs` | `docs: 补充贡献指南` |
| `style` | `style(net): 去掉课件页码引用` |
| `test` | `test(practice): 锁定标签指向真实章节` |
| `refactor` | `refactor(sync): 合并逐题时间戳` |
| `chore` | `chore(attachments): 同步实验文件大小` |
| `ci` | `ci(deploy): 去掉 PR 触发` |

### PR 要求

- 一个 PR 聚焦一件事；内容类 PR（改题库 / 讲义 / 资料）请在描述里注明改动题量、涉及课程与跑过的测试。
- 提交前本地跑过 `npm run typecheck` 与 `npm test`；CI 也会跑同样的检查。
- 改动 UI 时附一张改动前后的截图，方便审阅。
- 发现内容有误但不想改代码？直接开 issue 或在站点里提交勘误，都算贡献。

## 8. 🚀 部署

站点按「预览先行、发版上线」运行：

- **分支 push → 只刷新预览。** `deploy-preview.yml` 会重建主站（取最近一次 Release 的 tag）与所有符合条件的分支预览，产物在 `/HFUT-CS-Online/preview/<slug>/`，索引页为 `/HFUT-CS-Online/preview/`。
- **发布 Release → 更新主站。** `deploy-release.yml` 构建该 tag 并发布到 `/HFUT-CS-Online/`。版本由 Conventional Commits 驱动（release-please）：合并 `chore(main): release x.y.z` PR 才会打 tag 并发 Release。
- **手动重发 / 回滚**：Actions → `Deploy main site (release)` → Run workflow，填 tag 部署旧版本，填 `main` 部署 main 最新代码。
- **打开 / 更新 PR → 自动构建该 PR 的预览。** `preview-pr-build.yml` 以只读权限构建，`preview-pr-publish.yml` 在默认分支上下文发布，并把链接回贴到 PR 评论（`/preview/pr-<编号>/`，同一条评论随提交原地更新）。
- 如果部署后页面空白，优先检查 `vite.config.ts` 的 `base` 是否与仓库名一致；部署工作流最后有冒烟检查（主站与预览索引必须 200），空白会直接红灯。

预览收录规则：同仓库开着 PR 的 head 分支、外部 fork PR（取 `refs/pull/<n>/head`），以及 14 天内推送过且领先 main 的分支，最多 8 个（`PREVIEW_MAX` / `PREVIEW_TTL_DAYS` 在 workflow 的 `env` 里调）。

- `slug`：有 PR 的分支（含外部 fork）统一用 `pr-<编号>`，评论里的链接长期稳定；其余分支由分支名生成（`/` 换成 `--`，非 ASCII 字符丢弃后补 6 位哈希）。
- 预览构建失败只跳过该预览，主站照常发布；PR 关闭或分支超过 14 天没推送，下一次运行自动下线。
- 预览随 `main` push、PR 打开/更新、手动 dispatch 重建；PR 关闭后不再重建，它的预览会在下一次任意构建时从索引下线（分支若仍领先 main，还会以分支名出现，删掉分支即可）。
- 实现方式：预览构建用 `vite build --base=/HFUT-CS-Online/preview/<slug>/` 把整站搬进子目录（CLI 覆盖，分支不必先合入本功能），站内资源与附件清单都走 `BASE_URL` 随之迁移。

账号同步是可选能力：在仓库 Variables 配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY` 即启用；不配置时站点自动退回纯本地游客模式。本地联调时复制 [.env.example](.env.example) 为 `.env.local`，填入 Project URL 与 Publishable Key 即可。

## 📜 License

代码（`src/`、`scripts/`、`.github/` 等）以 [Apache License 2.0](LICENSE) 发布；站点内容与资料（讲义、题库、`补充资料/` 中的整理文本等）以 [CC BY-NC-SA 4.0](LICENSE-CONTENT) 发布：署名（BY）— 非商业性使用（NC）— 相同方式共享（SA）。`补充资料/` 中第三方课件与试卷的版权归原作者。

提交即表示同意你的代码以 Apache-2.0、内容以 CC BY-NC-SA 4.0 分发。

感谢你让这个资料库对后来的人更有用 🌟

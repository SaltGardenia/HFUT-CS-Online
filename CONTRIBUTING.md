# 贡献指南（CONTRIBUTING）

感谢关注本项目！这是一个面向 HFUT 同学的《算法设计与分析》在线复习手册（React 19 + Vite + TypeScript），内含 8 讲课件内容、24 个交互式算法动画、36 道自测题与 420 题在线练习。欢迎以 Issue / PR 的形式贡献内容与代码。

## 环境准备

```bash
git clone <仓库地址>
cd HFUT-algorithm-design
npm ci          # 或 npm install
npm run dev     # 开发服务器（含热更新），自动执行目录构建
```

要求 Node.js ≥ 22（CI 与部署环境均为 22）。

仓库里没有子模块，克隆与构建都不需要额外下载资料。4 个上游资料仓库（合计约 7.3GB）只用于整理 `data/`，**跑站点、`npm run build`、`npm test` 都用不到**；确实要重新整理资料时，按 `data/整理说明.md` 里的地址自行 `git clone --depth 1` 到仓库根的同名目录（已被 `.gitignore` 忽略）。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（predev 会先重建目录数据） |
| `npm run build` | 类型检查 + 产线构建（输出 `dist/`） |
| `npm test` / `npm run test:watch` | 运行全部 Vitest 测试（65 个） |
| `npm run typecheck` | 仅类型检查（`tsc -b`） |
| `npm run catalog` | 重新生成 `src/content/catalog.ts` |
| `npm run migrate` | 重新从源数据生成讲义模块（一般无需手动跑） |

提交 PR 前，请确保 `npm run typecheck` 与 `npm test` 全部通过——CI（`.github/workflows/ci.yml`）会在 push 到 `main` 和所有 PR 上跑同样的三步：`tsc -b` → `vitest run` → `build`，任何一步失败都会挡住合并。

## 项目结构

```
src/
├── content/            # 全部课程内容（数据即内容）
│   ├── deck1.ts…deck8.ts   # 8 讲讲义：sections → blocks（html / demo / quiz）
│   ├── home.ts         # 课程首页（含八讲内容地图）
│   ├── types.ts        # 内容数据结构契约（DeckData / Section / QuizData …）
│   ├── practice/       # 在线练习题库：单选/多选/判断/填空/简答各若干文件
│   └── catalog.ts      # 由 scripts/build-catalog.mjs 生成，随提交入库
├── components/         # UI 组件（含 practice/ 与各算法动画）
├── pages/              # 页面（HomePage / PracticePage / CourseHubPage …）
├── styles/base.css     # 全站样式（含设计变量，见 tokens.css）
└── __tests__/          # 测试：content / demos / practice 契约
data/                   # 课程资料库（课件/试题/附件），目录契约见 data/整理说明.md
scripts/                # 目录构建、内容迁移脚本
```

### 多课程架构

- `src/courses/registry.ts` 是课程注册的**唯一事实源**：新增课程在这里注册，路由（`/`、`/algo/*`、`/course/:name`）自动生效。
- `src/content/catalog.ts` 由 `scripts/build-catalog.mjs` 扫描 `data/` 生成，**生成物随提交入库**，运行时零 IO；添加/删除 `data/` 下的资料后记得跑 `npm run catalog`。

## 内容贡献

### 修改 / 新增讲义内容

讲义在 `src/content/deckN.ts`，遵循 `src/content/types.ts` 的契约（Section → Block）。注意：

- **纯文本字段不要写 HTML 实体**：`toc`、`heading`、`title` 以及自测题 `question` 等纯文本字段会按原文渲染，直接写 `Θ`、`Ω`、`⟨⟩` 等字符即可，`&Theta;` 这类实体会原样显示，测试会拦截。
- **题干 / 选项 / 解析是可信 HTML 片段**：可以用 `<sup>`、`<strong>` 等标签；`^n`、`_n` 这类记法在展示层会自动转为上下标。
- 讲次编号是联动字段：`deck1…deck8` 对应「第 1 讲…第 8 讲」，`no` 字段、路由、导航等多处共用，改编号时请整体一致。

### 在线练习题库

题库在 `src/content/practice/`，契约由 `src/__tests__/practice.test.ts` 锁定：

- 题量锁定：单选 / 多选 / 判断 / 填空各 100 题、简答题 20 题；调整题量需同步修改测试。
- 答案格式：单选 `/^[A-F]$/`，多选 `A、B、C`（顿号分隔），判断 `对/错`，填空多个可接受写法用全角 `｜` 分隔。
- **知识点标签必须真实存在**：每题的 `tags: {deck, sec, text}` 中 `sec` 必须出现在对应 `deckN` 的 toc 里，否则测试失败。
- **选题域仅限 8 讲课件内容**：回溯、分支限界、TSP、Floyd、多段图、N 皇后等课外算法不要加入。
- 简答题（essay）不判分：`answer` 为参考答案 HTML，`explanation` 为评分要点。

### 自测题与动画

各讲自测题遵循 `QuizData` 契约；交互动画（demo block）按 `name` 注册到对应组件，新增动画需同时补 `demos.test.tsx` 可渲染的用例。

### 课程资料（PDF / 试卷等）

直接放入 `data/` 对应的 `<学期>/<课程>/{课件,试题,附件}/` 目录（契约见 `data/整理说明.md`），然后跑 `npm run catalog` 并一并提交生成的 `catalog.ts`。

## 样式与交互约定

- 设计变量集中在 `src/styles/tokens.css`（颜色、圆角、阴影、各讲主题色），不要在组件里写死颜色值。
- 暗色模式由根元素 `[data-theme='dark']` 切换，新样式请两个主题都过一遍。
- **悬浮反馈不使用颜色填充**：hover 用边框加深、阴影、位移、下划线等表达；选中 / 激活等静态状态不受此限。
- UI 文案克制：不写解释机制、复述操作的说明文字；统计数字除外。
- 顶栏与路由使用 HashRouter，`vite.config` 的 `base` 为 `/HFUT-CS-Online/`——**仓库若改名需同步修改 base**。

## 提交规范

- 使用 Conventional Commits，scope 用模块名，描述用中文，例如：
  - `feat(practice): 热力图分块标题支持切换题型`
  - `fix(nav): 紧凑档顶栏溢出`
  - `docs: 补充贡献指南`
- 一个 PR 聚焦一件事；内容类 PR（改题库 / 讲义）请在描述里注明改动题量与涉及的测试。

## 部署

`main` 分支的每次 push 会自动部署到 GitHub Pages（`.github/workflows/deploy.yml`），无需手动操作。如果部署后页面空白，优先检查 `vite.config` 的 `base` 是否与仓库名一致。

同一次部署还会带上分支预览：根目录永远是 `origin/main`，预览挂在 `/HFUT-CS-Online/preview/<slug>/`，索引页为 `/HFUT-CS-Online/preview/`。

- 收录同仓库里开着 PR 的 head 分支，以及 14 天内推送过、且领先 main 的分支，最多 8 个（`PREVIEW_MAX` / `PREVIEW_TTL_DAYS` 在 workflow 的 `env` 里调）。
- `slug` 由分支名生成：`/` 换成 `--`，非 ASCII 字符丢弃后补一段哈希，中文分支名请以索引页上的链接为准。
- 预览构建失败只跳过该预览，主站照常发布；PR 关闭或分支超过 14 天没推送，下一次运行自动下线。
- 实现方式：预览构建用 `vite build --base=/HFUT-CS-Online/preview/<slug>/` 把整站搬进子目录（CLI 覆盖，分支不必先合入本功能），站内资源与附件清单都走 `BASE_URL` 随之迁移——**新增静态资源引用时别写死绝对路径**。

## License

本项目以 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 发布：署名（BY）— 非商业性使用（NC）— 相同方式共享（SA）。提交即表示同意你的代码与内容以相同协议分发。

<div align="center">

# 📚 HFUT-CS-Online

**合工大计算机课程资料库 —— 把散落在四个仓库里的课件、试卷与附件，整理成能直接复习的在线站点。**

[在线访问](https://saltgardenia.github.io/HFUT-CS-Online/) ·
[课程目录](#课程目录) ·
[架构文档](docs/ARCHITECTURE.md) ·
[贡献指南](CONTRIBUTING.md) ·
[问题反馈](https://github.com/SaltGardenia/HFUT-CS-Online/issues)

[![CI](https://github.com/SaltGardenia/HFUT-CS-Online/actions/workflows/ci.yml/badge.svg)](https://github.com/SaltGardenia/HFUT-CS-Online/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/code-Apache%202.0-blue)](LICENSE)
[![Content: CC BY-NC-SA 4.0](https://img.shields.io/badge/content-CC%20BY--NC--SA%204.0-lightgrey)](LICENSE-CONTENT)
[![在线访问](https://img.shields.io/badge/🌐_在线访问-saltgardenia.github.io-0969da)](https://saltgardenia.github.io/HFUT-CS-Online/)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-a259ff?logo=vite&logoColor=white)
[![GitHub stars](https://img.shields.io/github/stars/SaltGardenia/HFUT-CS-Online?style=social)](https://github.com/SaltGardenia/HFUT-CS-Online/stargazers)

<p>站点索引 8 个学期、57 门课程、7901 份文件，并为 58 门课程提供独立页面：有讲义的按章精讲，只有资料的就整理成可检索、可下载的附件页。</p>

<p><strong>纯静态站点，打开即用，不需要注册。</strong><br />
游客模式下收藏、最近查看与答题进度保存在浏览器本地；需要跨设备同步时再登录。</p>

</div>

## 这个站点解决什么问题

- **期末周，按课程复习。** 不必在网盘和聊天记录里翻课件。有讲义的课程都带章节导航；算法课是内容最全的样板——八讲讲义、24 个可交互算法动画、36 道自测题与 420 题在线练习。
- **只要原始资料。** 课件、试卷、实验材料按「学期 → 课程 → 课件 / 试题 / 附件」归档，附件页保留目录层级，每一行都能一键跳到 GitHub raw 下载，文件的上传者也会标出来。
- **顺手把错误改掉。** 读到错字、过时的协议描述或算错的复杂度，可以在正文上原地修改，一键生成勘误 PR；合并后自动叠加到页面，不用等下一次内容改版。

## 从哪里开始

| 我想… | 从这里开始 |
| --- | --- |
| 先看看长什么样 | [在线站点](https://saltgardenia.github.io/HFUT-CS-Online/) |
| 本地跑起来改点东西 | [本地运行](#本地运行) |
| 找某门课的讲义 / 试卷 | [课程目录](#课程目录) |
| 直接下载课件、实验材料 | 进入课程页 →「附件」 |
| 纠正一处内容错误 | [读者勘误](CONTRIBUTING.md#读者勘误) |
| 投稿资料 / 新增一门课 | [贡献指南](CONTRIBUTING.md) |
| 理解路由与数据流 | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| 接入账号同步 | [docs/supabase-sync.md](docs/supabase-sync.md) |

## 本地运行

需要 **Node.js ≥ 22**（CI 与部署环境均为 22）。

**1. 克隆并安装依赖**

```bash
git clone https://github.com/SaltGardenia/HFUT-CS-Online.git
cd HFUT-CS-Online
npm ci
```

**2. 启动开发服务器**

```bash
npm run dev
```

`dev` 之前会自动重建一次课程目录（`predev`）。仓库里只有站点内容与 `补充资料/`；4 个上游资料仓库合计约 7.3GB，**跑站点、构建、测试都不需要它们**。确实要重新整理资料时，按 `data/整理说明.md` 里的地址自行 `git clone --depth 1` 到仓库根的同名目录（已被 `.gitignore` 忽略）。

**3. 提交前跑一遍检查**

```bash
npm run typecheck
npm test
```

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（含热更新，`predev` 会先重建目录数据） |
| `npm run build` | 类型检查 + 产线构建（输出 `dist/`） |
| `npm test` / `npm run test:watch` | 运行全部 Vitest 测试（当前 20 个测试文件、307 项） |
| `npm run typecheck` | 仅类型检查（`tsc -b`） |
| `npm run catalog` | 全量重建 `src/content/catalog.ts` 与附件清单（需要本地 `data/`） |
| `npm run catalog:supplement` | 只合并 `补充资料/` 的增量重建（不需要 `data/`，投稿用这个） |
| `npm run catalog:check` | 校验生成物是否最新（CI 会跑） |
| `npm run migrate` | 重新从源数据生成算法课讲义模块（一般无需手动跑） |

## 课程目录

站点使用 HashRouter，课程地址形如 `https://saltgardenia.github.io/HFUT-CS-Online/#/algo`。58 门已上线课程按学期排列：

| 学期 | 已上线课程 |
| --- | --- |
| 大一上 | [高等数学](https://saltgardenia.github.io/HFUT-CS-Online/#/math) · [程序设计基础](https://saltgardenia.github.io/HFUT-CS-Online/#/pd) · [线性代数](https://saltgardenia.github.io/HFUT-CS-Online/#/la) |
| 大一下 | [数据结构](https://saltgardenia.github.io/HFUT-CS-Online/#/ds) · [数据结构课程设计](https://saltgardenia.github.io/HFUT-CS-Online/#/dscd) · [电路与电子技术基础](https://saltgardenia.github.io/HFUT-CS-Online/#/ee) |
| 大二上 | [程序设计艺术与方法](https://saltgardenia.github.io/HFUT-CS-Online/#/pat) · [大学物理](https://saltgardenia.github.io/HFUT-CS-Online/#/phys) · [Python程序设计](https://saltgardenia.github.io/HFUT-CS-Online/#/py) · [离散数学](https://saltgardenia.github.io/HFUT-CS-Online/#/dm) · [计算方法](https://saltgardenia.github.io/HFUT-CS-Online/#/cm) · [概率论与数理统计](https://saltgardenia.github.io/HFUT-CS-Online/#/prob) · [汇编语言程序设计](https://saltgardenia.github.io/HFUT-CS-Online/#/asm) · [EDA实训](https://saltgardenia.github.io/HFUT-CS-Online/#/eda) · [科研训练](https://saltgardenia.github.io/HFUT-CS-Online/#/res) · [大学物理实验](https://saltgardenia.github.io/HFUT-CS-Online/#/physlab) · [Java技术](https://saltgardenia.github.io/HFUT-CS-Online/#/java) · [数字逻辑](https://saltgardenia.github.io/HFUT-CS-Online/#/dl) · [机器人技术](https://saltgardenia.github.io/HFUT-CS-Online/#/robot) |
| 大二下 | [编译原理](https://saltgardenia.github.io/HFUT-CS-Online/#/comp) · [计算机组成原理](https://saltgardenia.github.io/HFUT-CS-Online/#/co) · [嵌入式系统原理](https://saltgardenia.github.io/HFUT-CS-Online/#/emb) · [机器学习](https://saltgardenia.github.io/HFUT-CS-Online/#/ml) · [软件工具与环境](https://saltgardenia.github.io/HFUT-CS-Online/#/ste) · [组合数学](https://saltgardenia.github.io/HFUT-CS-Online/#/comb) · [计算机图形学](https://saltgardenia.github.io/HFUT-CS-Online/#/cg) · [软件建模与分析](https://saltgardenia.github.io/HFUT-CS-Online/#/sma) · [数字媒体技术](https://saltgardenia.github.io/HFUT-CS-Online/#/dmt) · [网络程序设计](https://saltgardenia.github.io/HFUT-CS-Online/#/np) · [微机原理与接口技术](https://saltgardenia.github.io/HFUT-CS-Online/#/micro) · [硬件工程师综合训练](https://saltgardenia.github.io/HFUT-CS-Online/#/het) |
| 大三上 | [算法设计与分析](https://saltgardenia.github.io/HFUT-CS-Online/#/algo) · [操作系统](https://saltgardenia.github.io/HFUT-CS-Online/#/os) · [计算机网络](https://saltgardenia.github.io/HFUT-CS-Online/#/net) · [人工智能原理](https://saltgardenia.github.io/HFUT-CS-Online/#/ai) · [软件体系结构](https://saltgardenia.github.io/HFUT-CS-Online/#/sa) · [计算机体系结构](https://saltgardenia.github.io/HFUT-CS-Online/#/ca) · [计算机网络课程设计](https://saltgardenia.github.io/HFUT-CS-Online/#/ncd) · [网络攻防实践](https://saltgardenia.github.io/HFUT-CS-Online/#/nap) · [系统硬件综合设计](https://saltgardenia.github.io/HFUT-CS-Online/#/hd) · [移动计算与应用开发](https://saltgardenia.github.io/HFUT-CS-Online/#/mc) · [自然语言理解](https://saltgardenia.github.io/HFUT-CS-Online/#/nlu) · [操作系统课程设计](https://saltgardenia.github.io/HFUT-CS-Online/#/oscd) · [计算机视觉与深度学习](https://saltgardenia.github.io/HFUT-CS-Online/#/cv) |
| 大三下 | [编译原理课程设计](https://saltgardenia.github.io/HFUT-CS-Online/#/cpd) · [网络工程师综合实训](https://saltgardenia.github.io/HFUT-CS-Online/#/ntr) · [软件项目管理](https://saltgardenia.github.io/HFUT-CS-Online/#/spm) · [大数据处理技术](https://saltgardenia.github.io/HFUT-CS-Online/#/bd) · [计算机应用项目实训](https://saltgardenia.github.io/HFUT-CS-Online/#/cap) · [人工智能经济学](https://saltgardenia.github.io/HFUT-CS-Online/#/aie) · [信息安全技术](https://saltgardenia.github.io/HFUT-CS-Online/#/sec) · [数据库系统](https://saltgardenia.github.io/HFUT-CS-Online/#/db) · [软件工程](https://saltgardenia.github.io/HFUT-CS-Online/#/se) · [软件测试](https://saltgardenia.github.io/HFUT-CS-Online/#/st) |
| 大四上 | [分布式程序设计](https://saltgardenia.github.io/HFUT-CS-Online/#/dp) · [软件工程师综合训练](https://saltgardenia.github.io/HFUT-CS-Online/#/swt) · [领域方向综合设计](https://saltgardenia.github.io/HFUT-CS-Online/#/dsd) |
| 大四下 | [创新实践](https://saltgardenia.github.io/HFUT-CS-Online/#/ip) |

> 58 门课程都有独立页面；`src/content/catalog.ts` 里的 57 门是资料目录的统计（算法课为本站自写内容，不占资料目录）。

## 站点如何工作

一句话：**内容即数据，页面只负责渲染。**

```
src/
├── courses/registry.ts      # 课程注册表：路由、学期、是否上线（唯一事实源）
├── courses/*Course.tsx      # 每门课自包含的导航 + 内部路由，React.lazy 按需加载
├── content/
│   ├── deck1..8.ts          # 算法课八讲讲义（Section → Block）
│   ├── <course>/            # 其余课程的章节、题库、试卷数据
│   └── catalog.ts           # 【生成】57 门课程的文件统计，随提交入库
├── pages/                   # 首页、课程页、练习页、附件页
├── lib/                     # 勘误、主题、同步、收藏、最近查看
└── styles/                  # tokens.css 设计令牌 + 各课程私有样式
scripts/build-catalog.mjs    # 扫描 data/ 与 补充资料/ → catalog.ts + 附件清单
```

| 层 | 负责什么 | 入口 |
| --- | --- | --- |
| 站点层 | 首页课程目录：8 个学期分组、收藏、最近查看 | `src/pages/CourseHubPage.tsx` |
| 课程层 | 每门课自带导航与页面布局（含顶栏搜索），互不继承，按需加载 | `src/courses/registry.ts` |
| 内容层 | 讲义 / 题库 / 试卷就是 TypeScript 数据，契约由测试锁定 | `src/content/` |
| 资料层 | 扫描两个资料根，生成课程统计与附件清单 | `scripts/build-catalog.mjs` |
| 叠加层 | 勘误、亮暗主题、账号同步、进度合并 | `src/lib/` |

`npm run catalog` 会生成 `src/content/catalog.ts` 与 `public/attachments/*.json`，生成物随提交入库，**运行时零文件系统 IO**；往 `补充资料/` 增删文件后跑 `npm run catalog:supplement` 即可（不需要本地 `data/`），CI 会校验生成物是否最新。

## 功能一览

- **八讲算法手册。** 绪论与算法设计思维、算法基础、算法分析、线性时间排序、线性时间选择、动态规划、贪心、回溯与分支限界。关键步骤配 24 个可交互动画（快速排序划分、Huffman 编码、LCS 填表、矩阵链乘法、快速选择…），每讲末尾有自测题。
- **在线练习。** 11 门课程支持在线练习（算法、操作系统、计算机网络、程序设计艺术与方法、大学物理、计算机体系结构、高等数学、人工智能原理、数据库系统、软件工程、软件测试）。题型覆盖单选、多选、判断、填空与简答；客观题即时判分，填空支持多种写法，简答给参考答案与评分要点。
- **附件页。** 按原目录层级展示课件、试卷、实验、代码与报告；目录可折叠，子项标明来源仓库，下载直接走 raw 直链。
- **读者勘误。** 顶栏铅笔进入原地编辑，审阅后一键开 PR；合并后的勘误在渲染时叠加，保留行内结构，不污染原文。
- **账号同步（可选）。** 游客优先，登录后收藏、最近查看与逐题进度按时间戳合并；未配置 Supabase 时账号入口自动隐藏。
- **阅读体验。** 亮 / 暗双主题、移动端抽屉导航、每讲 / 每章主题色、顶栏搜索、收藏与最近查看。

## 内容从哪里来

4 个上游仓库，合计 8210 份源文件：

- [sunmiao0301/HFUT-CS](https://github.com/sunmiao0301/HFUT-CS)（867）
- [mox-hub/hfut-cs](https://github.com/mox-hub/hfut-cs)（1403）
- [styitches/HFUT-CS](https://github.com/styitches/HFUT-CS)（2144）
- [Tuning-Luna/HFUT_XC_Study_Things](https://github.com/Tuning-Luna/HFUT_XC_Study_Things)（3796）

整理并移除公共课与杂项后，站点索引为 **8 个学期、57 门课程、7901 份文件**（统计以 `src/content/catalog.ts` 为准）。

- `data/`：整理产物，**仅本地、不入库**；`data/整理说明.md`、`data/文件清单.csv` 与 `data/分类统计.txt` 随仓库保留，用于溯源。
- `补充资料/`：本站自有资料（上游没有的新课课件、近年试卷等），**随仓库入库**，附件页可直接下载。目录契约与 `data/` 相同，投稿规则见 [补充资料/README.md](补充资料/README.md)。
- 4 个上游仓库不再作为子模块挂载：本仓库可以直接 `git clone`，**约 50MB**，克隆、构建与部署都不需要它们。

资料版权归原作者，站点只做整理、索引与呈现；贡献者名单见站点首页。

## 部署

- **CI**（`.github/workflows/ci.yml`）：push 到 `main` 与所有 PR 跑类型检查、单元测试、资料目录生成物校验与 `vite build`。规则集里 CI 是必需检查，红了合不进去（管理员可旁路）。
- **主站**（`.github/workflows/deploy-release.yml`）：只在发布 GitHub Release 时更新——构建该 tag 并部署。手动运行 `Deploy main site (release)` 可以指定 tag 回滚，或填 `main` 重新部署最新代码。
- **预览**（`.github/workflows/deploy-preview.yml`）：任意分支 push 只刷新 `/HFUT-CS-Online/preview/<slug>/`，主站停在最近一次 Release。最多 8 个、保留 14 天，外部 fork 的 PR 也会出现在索引页（取 `refs/pull/<n>/head`）。
- **版本**：Conventional Commits 驱动 [release-please](https://github.com/googleapis/release-please)，合并 `chore(main): release x.y.z` PR 才打 tag、发 Release 并触发主站部署。
- **账号同步**：在仓库 Variables 配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY` 即启用；不配就是纯游客模式。数据库脚本见 [supabase/schema.sql](supabase/schema.sql)，细节见 [docs/supabase-sync.md](docs/supabase-sync.md)。
- **改仓库名**：同步修改 `vite.config.ts` 的 `base` 与 deploy workflow 的 `SITE_BASE`，否则 Pages 会白屏。

## 最近更新

- **2026-11 · 读者勘误**：顶栏原地编辑 → 一键开 PR；合并后由 `src/content/errata.ts` 在渲染时套用，不改原文。
- **2026-11 · 账号同步**：Supabase 可选接入，游客优先；收藏、最近查看与逐题进度按本地时间戳与云端墓碑合并。
- **2026-11 · 58 门课程上线**：首页按 8 个学期索引全部 57 门课程资料，58 门有独立页面。
- **2026-11 · 计网按 2025 版课件校准**：十份课件逐章复核，补回缺失的协议语义与课后习题。

## 参与贡献

不需要会写代码也能贡献：

- **报错 / 提建议**：开 [issue](https://github.com/SaltGardenia/HFUT-CS-Online/issues)，附页面链接与截图。
- **投稿资料**：把课件、试卷、实验材料放进 `补充资料/` 对应目录，跑 `npm run catalog:supplement` 后提 PR（CI 会校验生成物是否最新）。
- **提交勘误**：站内顶栏直接改，或按 [勘误格式](src/content/errata/README.md) 提 JSON。
- **改代码**：环境、内容契约、题库规则、样式约定与提交规范都在 [CONTRIBUTING.md](CONTRIBUTING.md)。

一个 PR 聚焦一件事；内容类 PR 请在描述里注明改动题量与涉及的测试。

## License

代码（`src/`、`scripts/`、`.github/` 等）以 [Apache License 2.0](LICENSE) 发布；站点内容与资料（讲义、题库、`补充资料/` 中的整理文本等）以 [CC BY-NC-SA 4.0](LICENSE-CONTENT) 发布：署名（BY）— 非商业性使用（NC）— 相同方式共享（SA）。

- 复用代码：保留版权与许可声明即可，允许商业使用。
- 复用内容：注明来源、禁止商用、衍生作品沿用同一协议。
- `补充资料/` 里的课件与试卷版权归原作者，本站仅做整理、索引与呈现；上传者需确认有权公开分享（见 [补充资料/README.md](补充资料/README.md)）。

提交即表示同意你的代码以 Apache-2.0、内容以 CC BY-NC-SA 4.0 分发。

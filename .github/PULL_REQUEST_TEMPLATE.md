## 这个 PR 做了什么

<!-- 一句话说明；内容类改动请注明课程 / 讲次 / 题量 -->

## 类型

- [ ] 内容（讲义、题库、勘误）
- [ ] 资料（课件、试卷、附件）
- [ ] 代码 / 样式 / 交互
- [ ] 工程与 CI

## 提交前检查

- [ ] `npm run typecheck` 通过
- [ ] `npm test` 通过
- [ ] 增删了 `补充资料/` 里的文件时，跑过 `npm run catalog:supplement` 并把 `src/content/catalog.ts`、`public/attachments/*.json` 一并提交
- [ ] 改了 UI 时附了改动前后截图
- [ ] 提交信息与 PR 标题使用 Conventional Commits（`feat(scope): …`），它会生成发布说明

## 预览

合并前可以在分支预览里看渲染效果：`https://saltgardenia.github.io/HFUT-CS-Online/preview/`。
外部 fork 的 PR 需要维护者跑一次预览部署（或等下一次 `main` 推送）后才会出现在索引页。

## 关联 issue

Closes #

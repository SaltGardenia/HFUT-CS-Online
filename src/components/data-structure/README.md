# 数据结构模拟器来源

作者：Cynthia Wang。来源：https://github.com/softer-16/data-structure-simulator 。导入版本：c27381eae22d806e4e17a16b32311e9ad4cc369e。

69 个演示保留参数输入、步骤轨迹、变量状态和知识讲解。脚本、样式随本站构建，ShadowRoot 隔离样式；卸载时清理事件和计时器。

主入口为课程导航里的 `/ds/visual`：页面走站点常规的两栏布局，左侧栏按分组列出 69 个演示（带搜索过滤，点选切换 `/ds/visual/<algorithmId>`），右侧只保留模拟器工作区；模拟器自带的侧栏在课程页里隐藏，窄屏（≤1020px）改用页头的下拉选择。外部网页与 PDF 指南作为页面按钮。`/ds/simulator` 保留为独立整页入口，`/ds/simulator/<algorithmId>` 可直接进入主题。原 /ds 讲义首页、章节、试卷和附件路由保持不变。演示目录从 `runtime.js` 源码抽取（`catalog.ts`，`?raw` + 正则），升级 runtime 后条目数由测试兜底。

仅采用同名代码；其余主题展示实际 JavaScript 步骤生成代码并标明。代码遵循 Apache-2.0，讲解和图示内容遵循 CC BY-NC-SA 4.0。

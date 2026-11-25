/* 演示目录：从 vendored 的 runtime.js 源码里抽取元数据，避免在页面层再维护一份 69 条的清单，
 * 也避免为了导出它去改 runtime 的函数作用域。runtime.js 升级后条目数变化由测试兜底。 */
import source from './runtime.js?raw';

export interface SimulatorCatalogEntry {
  id: string;
  /** 课件页码 / 总目录编号，侧栏行首徽章 */
  page: string;
  group: string;
  title: string;
  subtitle: string;
  complexity: string;
}

const ENTRY =
  /\{ id: "([^"]+)", page: (?:"([^"]+)"|(\d+)), group: "([^"]+)", title: "([^"]+)", subtitle: "([^"]+)", complexity: "([^"]+)"/g;

export const SIMULATOR_CATALOG: SimulatorCatalogEntry[] = [...source.matchAll(ENTRY)].map((m) => ({
  id: m[1],
  page: m[2] ?? m[3],
  group: m[4],
  title: m[5],
  subtitle: m[6],
  complexity: m[7],
}));

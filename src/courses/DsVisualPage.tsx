import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SimulatorCanvas } from '../components/DataStructureSimulator';
import { SIMULATOR_CATALOG, type SimulatorCatalogEntry } from '../components/data-structure/catalog';
import { useToc } from '../lib/toc';

const GUIDE = `${import.meta.env.BASE_URL}guides/data-structure/数据结构可视化模拟器使用指南.pdf`;
const SOURCE = 'https://softer-16.github.io/data-structure-simulator/';
/** URL 不带算法时与页面一致：默认选中目录第一条 */
const DEFAULT_ID = SIMULATOR_CATALOG[0]?.id ?? 'buildTree';

interface CatalogGroup {
  name: string;
  items: SimulatorCatalogEntry[];
}

function groupCatalog(catalog: SimulatorCatalogEntry[], query: string): CatalogGroup[] {
  const q = query.trim().toLowerCase();
  const groups: CatalogGroup[] = [];
  for (const a of catalog) {
    if (q && !`${a.title} ${a.subtitle} ${a.group} ${a.id} ${a.page}`.toLowerCase().includes(q)) continue;
    const last = groups[groups.length - 1];
    if (last?.name === a.group) last.items.push(a);
    else groups.push({ name: a.group, items: [a] });
  }
  return groups;
}

/** 外部资源按钮：桌面在左栏顶部，窄屏在选择器上方 */
function VisualActions({ className = '' }: { className?: string }) {
  return (
    <div className={`visual-actions${className ? ' ' + className : ''}`}>
      <a className="btn" href={SOURCE} target="_blank" rel="noreferrer">
        原始网页
      </a>
      <a className="btn primary" href={GUIDE} target="_blank" rel="noreferrer">
        使用指南（PDF）
      </a>
    </div>
  );
}

/** 桌面端左侧栏：顶部是外部资源按钮，下面按分组列出 69 个演示 */
export function DsVisualRail() {
  // 侧栏渲染在路由出口之外，拿不到 useParams；从路径里取当前演示
  const { pathname } = useLocation();
  const activeId = pathname.match(/\/visual\/([^/?#]+)/)?.[1] ?? DEFAULT_ID;
  const [query, setQuery] = useState('');
  const groups = useMemo(() => groupCatalog(SIMULATOR_CATALOG, query), [query]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <nav className="sidebar material visual-rail" aria-label="算法演示目录">
      <VisualActions className="rail-actions" />
      <p className="sidebar-h">算法演示</p>
      <input
        className="rail-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索算法，例如 DFS / 快排"
        aria-label="搜索算法演示"
      />
      {total === 0 && <p className="rail-empty">没有匹配的演示</p>}
      {groups.map((g) => (
        <section className="rail-group" key={g.name}>
          <p className="rail-group-h">{g.name}</p>
          <ul className="rail-list">
            {g.items.map((a) => (
              <li key={a.id}>
                <Link
                  to={`/ds/visual/${a.id}`}
                  className={a.id === activeId ? 'active' : undefined}
                  title={`${a.title} · ${a.subtitle}`}
                  aria-current={a.id === activeId ? 'page' : undefined}
                >
                  <span className="rail-page">{a.page}</span>
                  <span className="rail-label">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

/** 数据结构 · 可视化：右栏整块交给模拟器工作区，不再套卡片/舞台容器 */
export default function DsVisualPage() {
  const { algorithmId } = useParams();
  const navigate = useNavigate();
  const active = SIMULATOR_CATALOG.find((a) => a.id === algorithmId) ?? SIMULATOR_CATALOG[0];
  const groups = useMemo(() => groupCatalog(SIMULATOR_CATALOG, ''), []);
  const toc = useToc();

  useEffect(() => {
    toc.report([], () => {});
    return () => toc.report([], () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 窄屏没有左侧栏：外部资源按钮与演示选择放在正文顶部 */}
      <div className="visual-mobile-head">
        <VisualActions />
        <select
          className="visual-picker"
          aria-label="选择算法演示"
          value={active.id}
          onChange={(e) => navigate(`/ds/visual/${e.target.value}`)}
        >
          {groups.map((g) => (
            <optgroup key={g.name} label={g.name}>
              {g.items.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="visual-canvas">
        <SimulatorCanvas key={active.id} algorithmId={active.id} embedded />
      </div>
    </>
  );
}

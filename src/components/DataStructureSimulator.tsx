import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { mountSimulator } from './data-structure/runtime.js';
import template from './data-structure/template.html?raw';
import styles from './data-structure/simulator.css?raw';

/** 模拟器本体（shadow DOM 挂载）。embedded 时去掉整页高度与自带页头，交给宿主布局。 */
export function SimulatorCanvas({ algorithmId, embedded = false }: { algorithmId?: string; embedded?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    // data-deck 决定 --deck-accent（课程主题色）。课程页里由 CourseShell 持有，
    // 这里不改也不删，否则卸载/切换演示时会把整门课的主题色清掉、回落成全局红色。
    if (!embedded) document.documentElement.dataset.deck = 'ds';
    const root = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${styles}</style>${template}`;
    const stop = mountSimulator(root, algorithmId);
    return () => {
      stop();
      if (!embedded) delete document.documentElement.dataset.deck;
      root.replaceChildren();
    };
  }, [algorithmId, embedded]);

  return (
    <div
      ref={host}
      className={embedded ? 'ds-sim-embed' : undefined}
      data-embed={embedded ? '' : undefined}
      aria-label="数据结构算法可视化交互模拟器"
    />
  );
}

/** 独立整页版本（/ds/simulator） */
export default function DataStructureSimulator() {
  const { algorithmId } = useParams();
  return (
    <>
      <header className="hub-topbar">
        <nav className="hub-topbar-right" aria-label="数据结构模拟器导航">
          <Link className="hub-toplink" to="/ds">数据结构课程</Link>
          <Link className="hub-toplink" to="/ds/visual">可视化</Link>
          <a className="hub-toplink" href={`${import.meta.env.BASE_URL}guides/data-structure/数据结构可视化模拟器使用指南.pdf`} target="_blank" rel="noreferrer">使用指南</a>
          <a className="hub-toplink" href="https://github.com/softer-16/data-structure-simulator" target="_blank" rel="noreferrer">Cynthia Wang · 来源</a>
          <ThemeToggle />
        </nav>
      </header>
      <SimulatorCanvas algorithmId={algorithmId} />
    </>
  );
}

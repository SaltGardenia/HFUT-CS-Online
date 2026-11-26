// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DsCourse from '../courses/DsCourse';
import { ErrataProvider } from '../lib/errata/context';
import { TocProvider } from '../lib/toc';

beforeEach(() => {
  // jsdom 没有 ResizeObserver / matchMedia：侧栏溢出检测与平滑滚动会用到
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  Element.prototype.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  window.scrollTo = (() => {}) as typeof window.scrollTo;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const show = () =>
  render(
    <MemoryRouter initialEntries={['/ds']}>
      <TocProvider>
        <ErrataProvider>
          <Routes>
            <Route path="/ds/*" element={<DsCourse />} />
          </Routes>
        </ErrataProvider>
      </TocProvider>
    </MemoryRouter>,
  );

describe('顶栏导航指示器', () => {
  it('全场只有一枚指示器：悬停时跟到鼠标所在页签，移出后滑回当前页签', () => {
    const view = show();
    const nav = view.container.querySelector<HTMLElement>('.deck-tabs')!;
    const pills = () => [...nav.querySelectorAll('.deck-tab-pill')];
    const pillTab = () => pills()[0]?.closest('.deck-tab') ?? null;

    // 初始：指示器停在当前页签（aria-current="page"），且只有一枚
    const active = nav.querySelector<HTMLElement>('.deck-tab[aria-current="page"]');
    expect(active).not.toBeNull();
    expect(pills()).toHaveLength(1);
    expect(pillTab()).toBe(active);
    expect(active!.classList.contains('has-pill')).toBe(true);

    // 悬停另一个页签：指示器整体移过去（而不是多出一枚），当前页签同时失去高亮
    const other = [...nav.querySelectorAll<HTMLElement>('.deck-tab')].find((t) => t !== active)!;
    fireEvent.mouseEnter(other);
    expect(pills()).toHaveLength(1);
    expect(pillTab()).toBe(other);
    expect(other.classList.contains('has-pill')).toBe(true);
    expect(active!.classList.contains('has-pill')).toBe(false);
    // 悬停不再铺色底，避免「药丸 + 色块」两处指示
    expect(other.style.background).toBe('');

    // 移出导航：指示器回到当前页签
    fireEvent.mouseLeave(nav);
    expect(pills()).toHaveLength(1);
    expect(pillTab()).toBe(active);
    expect(active!.classList.contains('has-pill')).toBe(true);
  });
});

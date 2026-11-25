import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import HtmlContent from '../components/HtmlContent';

beforeEach(() => {
  // scrollToId 会读 prefers-reduced-motion；jsdom 没有 matchMedia
  vi.stubGlobal(
    'matchMedia',
    (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function PathProbe() {
  const { pathname } = useLocation();
  return <div data-testid="path">{pathname}</div>;
}

describe('HtmlContent 里的链接', () => {
  it('把 hash 路由链接交给路由，而不是当成页内锚点', async () => {
    render(
      <MemoryRouter initialEntries={['/ds']}>
        <HtmlContent html={'<p><a href="#/ds/simulator">站内交互演示</a></p>'} />
        <PathProbe />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByText('站内交互演示'));
    expect(screen.getByTestId('path').textContent).toBe('/ds/simulator');
  });

  it('普通页内锚点仍然按滚动处理，不改变路由', async () => {
    // jsdom 没有 scrollIntoView，补一个空实现
    Element.prototype.scrollIntoView = () => {};
    render(
      <MemoryRouter initialEntries={['/ds']}>
        <HtmlContent html={'<h2 id="sec-a">A</h2><p><a href="#sec-a">跳到 A</a></p>'} />
        <PathProbe />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByText('跳到 A'));
    expect(screen.getByTestId('path').textContent).toBe('/ds');
  });
});

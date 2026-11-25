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
  // 代码/插图覆盖层直接挂在 body 上，cleanup 不会带走
  document.querySelectorAll('.code-lightbox, .fig-lightbox').forEach((el) => el.remove());
  document.body.style.overflow = '';
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

describe('HtmlContent 长代码折叠与完整代码覆盖层', () => {
  // 课程内容里没有 .code-pair 包裹时，折叠态落在 .code-wrap 自身（覆盖层克隆的根节点）
  const codeLines = Array.from({ length: 12 }, (_, i) => `int v${i} = ${i};`).join('\n');
  const html = `<p>示例</p><pre class="code"><code>${codeLines}</code></pre>`;

  it('点击「查看完整代码」后覆盖层里的代码不再折叠', async () => {
    render(
      <MemoryRouter initialEntries={['/pd']}>
        <HtmlContent html={html} />
      </MemoryRouter>,
    );

    const trigger = screen.getByText(/查看完整代码/);
    // 页内仍是折叠态：长代码默认收起
    expect(trigger.closest('.code-wrap')?.classList.contains('clamped')).toBe(true);

    await userEvent.click(trigger);

    const wrap = document.querySelector('.code-lightbox-panel .code-wrap');
    expect(wrap).not.toBeNull();
    expect(wrap?.classList.contains('clamped')).toBe(false);
    const pre = wrap?.querySelector('pre.code') as HTMLElement;
    expect(pre.style.maxHeight).toBe('');

    // close 按钮能正常收掉覆盖层
    await userEvent.click(document.querySelector('.fig-lightbox-close') as HTMLElement);
    expect(document.querySelector('.code-lightbox')).toBeNull();
  });
});

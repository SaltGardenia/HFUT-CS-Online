import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAskAiController } from '../lib/askAi';

const HTML = `
  <div class="page" data-deck="deck1">
    <h1>示例章</h1>
    <section>
      <h2 id="s1"><span class="h2-no">1.</span><span class="h2-title">基本概念 ★</span></h2>
      <h3 id="s1-a">小节一</h3>
      <h4 id="s1-a-1">细节</h4>
    </section>
    <section>
      <h2 id="s2">第二节</h2>
      <p>正文</p>
    </section>
  </div>
`;

describe('章节页的问问 AI 挂载', () => {
  beforeEach(() => {
    document.body.innerHTML = HTML;
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('给每个 h2/h3/h4 挂一个按钮，提示词包含课程与标题', () => {
    const controller = createAskAiController('测试课程');
    controller.scan();

    const headings = [...document.querySelectorAll('h2, h3, h4')];
    expect(headings).toHaveLength(4);
    expect(document.querySelectorAll('.ask-ai')).toHaveLength(4);
    for (const heading of headings) {
      expect(heading.classList.contains('ask-ai-heading')).toBe(true);
      expect(heading.querySelector('.ask-ai')).not.toBeNull();
    }

    const first = headings[0].querySelector<HTMLAnchorElement>('.ask-ai-primary')!;
    expect(first.href.startsWith('https://chatgpt.com/')).toBe(true);
    const prompt = new URL(first.href).searchParams.get('q') ?? '';
    expect(prompt).toContain('请通俗地讲解测试课程');
    expect(prompt).toContain('基本概念');
    expect(prompt).not.toContain('★');

    // 再扫一次不应重复挂载
    controller.scan();
    expect(document.querySelectorAll('.ask-ai')).toHaveLength(4);

    controller.destroy();
    expect(document.querySelectorAll('.ask-ai')).toHaveLength(0);
    for (const heading of headings) expect(heading.classList.contains('ask-ai-heading')).toBe(false);
  });

  it('没有章节页时不挂载（首页 / 练习页不受影响）', () => {
    document.body.innerHTML = '<div class="page"><h1>课程首页</h1><h2>概况</h2></div>';
    const controller = createAskAiController('测试课程');
    controller.scan();
    expect(document.querySelectorAll('.ask-ai')).toHaveLength(0);
    controller.destroy();
  });

  it('切换复习模式替换 section 后，旧按钮被清理、新标题重新挂载', () => {
    const controller = createAskAiController('测试课程');
    controller.scan();
    expect(document.querySelectorAll('.ask-ai')).toHaveLength(4);

    // 模拟同一 .page 内整段 section 被替换（计网 main/supplement/extra 切换）
    const page = document.querySelector('.page')!;
    page.querySelectorAll('section').forEach((section) => section.remove());
    page.insertAdjacentHTML(
      'beforeend',
      '<section><h2 id="n1">新模式标题</h2></section>',
    );
    controller.scan();

    expect(document.querySelectorAll('.ask-ai')).toHaveLength(1);
    expect(document.querySelector('#n1 .ask-ai')).not.toBeNull();
    controller.destroy();
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NetHomework from '../pages/net/NetHomework';
import { homeworkId, loadHomeworkResults, NET_HOMEWORK_STORE_KEY } from '../pages/net/netHomeworkState';
import { netHomework } from '../content/net/homework';

beforeEach(() => localStorage.removeItem(NET_HOMEWORK_STORE_KEY));
afterEach(() => {
  cleanup();
  localStorage.removeItem(NET_HOMEWORK_STORE_KEY);
});

function show(chapterNo: number, index = 0) {
  return render(
    <MemoryRouter>
      <NetHomework chapterNo={chapterNo} questions={[netHomework[chapterNo][index]]} />
    </MemoryRouter>,
  );
}

describe('计网章末作业复用标准题卡及保存进度', () => {
  it('结构对齐共享 PracticeCard：题号、题干、知识点标签、默认热力格', () => {
    const view = show(4);
    expect(view.container.querySelector('.quiz.practice-q')).not.toBeNull();
    expect(view.container.querySelector('.quiz-q .pq-kind')?.textContent).toContain('简答');
    expect(view.container.querySelector('.pq-tags .ptag[data-deck="net"]')).not.toBeNull();
    expect(view.container.querySelector('.pq-heat-grid .pq-heat-cell')).not.toBeNull();
    expect(view.container.querySelector('.net-hw-card')).toBeNull();
    expect(view.container.querySelector('#sec-ch4-hw-1')).not.toBeNull();
    expect(screen.getByRole('button', { name: '查看参考答案与解析' })).toBeTruthy();
  });

  it('教师答案与解析沿用标准题卡两级答案样式；查看后变为重做', () => {
    const view = show(4);
    fireEvent.click(screen.getByRole('button', { name: '查看参考答案与解析' }));
    expect(view.container.querySelector('.quiz-a.pq-answer')).not.toBeNull();
    expect(view.container.querySelector('.pq-rubric')).not.toBeNull();
    expect(screen.getByText('原文件答案（文字转录）')).toBeTruthy();
    expect(screen.getByText('补充参考答案与解析')).toBeTruthy();
    expect(screen.getByRole('button', { name: '重做' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '收起答案与解析' })).toBeNull();
    expect(loadHomeworkResults()[homeworkId(4, netHomework[4][0].no)]).toBe('revealed');
  });

  it('缺教师答案时显示来源提示与单一参考解析，不伪造教师内容', () => {
    const view = show(6);
    fireEvent.click(screen.getByRole('button', { name: '查看参考答案与解析' }));
    expect(screen.getByText('参考答案与解析')).toBeTruthy();
    expect(screen.getByText(/原作业文件未附教师答案/)).toBeTruthy();
    expect(view.container.querySelector('.pq-rubric')).toBeNull();
    expect(screen.queryByText('原文件答案（文字转录）')).toBeNull();
    expect(loadHomeworkResults()[homeworkId(6, netHomework[6][0].no)]).toBe('revealed');
  });

  it('刷新后恢复已掌握、自评、答案和进度，需复习也能持久化', () => {
    const view = show(4);
    fireEvent.click(screen.getByRole('button', { name: '查看参考答案与解析' }));
    fireEvent.click(screen.getByRole('button', { name: '已掌握' }));
    const id = homeworkId(4, netHomework[4][0].no);
    expect(loadHomeworkResults()[id]).toBe('right');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('1');
    view.unmount();
    show(4);
    expect(screen.getByRole('button', { name: '重做' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '已掌握' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '需复习' }));
    expect(loadHomeworkResults()[id]).toBe('wrong');
  });

  it('单题重做清除结果并还原标准查看按钮', () => {
    show(4);
    fireEvent.click(screen.getByRole('button', { name: '查看参考答案与解析' }));
    fireEvent.click(screen.getByRole('button', { name: '重做' }));
    expect(screen.getByRole('button', { name: '查看参考答案与解析' })).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
    expect(loadHomeworkResults()[homeworkId(4, netHomework[4][0].no)]).toBeUndefined();
  });

  it('清空本章需确认、不会影响其它章节，并恢复查看按钮', async () => {
    localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify({ '4:1': 'right', '6:1': 'wrong' }));
    show(4);
    fireEvent.click(screen.getByRole('button', { name: '清空本章进度' }));
    fireEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(loadHomeworkResults()['4:1']).toBe('right');
    fireEvent.click(screen.getByRole('button', { name: '清空本章进度' }));
    fireEvent.click(screen.getByRole('button', { name: '清空' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(loadHomeworkResults()['4:1']).toBeUndefined();
    expect(loadHomeworkResults()['6:1']).toBe('wrong');
    expect(screen.getByRole('button', { name: '查看参考答案与解析' })).toBeTruthy();
  });

  it('过滤无效缓存并与计网试卷进度分隔', () => {
    localStorage.setItem(NET_HOMEWORK_STORE_KEY, JSON.stringify({ '4:1': 'right', '1:3': 'other', nope: 'wrong' }));
    expect(loadHomeworkResults()).toEqual({ '4:1': 'right' });
    expect(NET_HOMEWORK_STORE_KEY).not.toBe('net-practice-progress-v1');
  });
});

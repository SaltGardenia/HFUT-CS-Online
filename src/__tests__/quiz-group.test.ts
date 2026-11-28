/**
 * 学习通题库「每组题数」：默认值、写入收敛、读取回落与分组切片的边界。
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  GROUP_SIZE_DEFAULT,
  GROUP_SIZE_MAX,
  GROUP_SIZE_MIN,
  QUIZ_GROUP_KEY,
  normalizeGroupSize,
  readGroupSize,
  takeGroup,
  writeGroupSize,
} from '../lib/maoquiz';

beforeEach(() => localStorage.clear());

describe('每组题数设置', () => {
  it('默认 10 题，未写入时回落到默认值', () => {
    expect(GROUP_SIZE_DEFAULT).toBe(10);
    expect(readGroupSize()).toBe(10);
  });

  it('输入收敛为 1–100 的整数', () => {
    expect(normalizeGroupSize(0)).toBe(GROUP_SIZE_MIN);
    expect(normalizeGroupSize(-3)).toBe(GROUP_SIZE_MIN);
    expect(normalizeGroupSize(7.6)).toBe(8);
    expect(normalizeGroupSize(1000)).toBe(GROUP_SIZE_MAX);
    expect(normalizeGroupSize(Number.NaN)).toBe(GROUP_SIZE_DEFAULT);
    expect(normalizeGroupSize(Number.POSITIVE_INFINITY)).toBe(GROUP_SIZE_DEFAULT);
  });

  it('写入后可读回，且写入值同样收敛', () => {
    expect(writeGroupSize(12)).toBe(12);
    expect(readGroupSize()).toBe(12);
    expect(localStorage.getItem(QUIZ_GROUP_KEY)).toBe('12');

    expect(writeGroupSize(0)).toBe(GROUP_SIZE_MIN);
    expect(readGroupSize()).toBe(GROUP_SIZE_MIN);
  });

  it('存储里是脏数据时回落默认值', () => {
    localStorage.setItem(QUIZ_GROUP_KEY, 'abc');
    expect(readGroupSize()).toBe(GROUP_SIZE_DEFAULT);
  });
});

describe('takeGroup', () => {
  const items = Array.from({ length: 12 }, (_, i) => i);

  it('从队列头切出指定数量，不改原数组', () => {
    expect(takeGroup(items, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(items).toHaveLength(12);
  });

  it('剩余不足一组时全取', () => {
    expect(takeGroup([1, 2, 3], 5)).toEqual([1, 2, 3]);
    expect(takeGroup([], 5)).toEqual([]);
  });

  it('非法题数按收敛规则处理', () => {
    expect(takeGroup(items, 0)).toEqual([0]);
    expect(takeGroup(items, Number.NaN)).toEqual(items.slice(0, GROUP_SIZE_DEFAULT));
  });
});

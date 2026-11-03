import { describe, expect, it } from 'vitest';
import { buildPageItems } from './page-items';

const pagesOf = (current: number, total: number): number[] =>
  buildPageItems(current, total).map((item) => item.page);

describe('buildPageItems', () => {
  it('shows every page when there are few', () => {
    expect(pagesOf(1, 3)).toEqual([1, 2, 3]);
    expect(pagesOf(1, 1)).toEqual([1]);
  });

  it('slides a window of five pages that follows the current one', () => {
    expect(pagesOf(1, 8)).toEqual([1, 2, 3, 4, 5]);
    expect(pagesOf(4, 8)).toEqual([2, 3, 4, 5, 6]);
    expect(pagesOf(8, 8)).toEqual([4, 5, 6, 7, 8]);
  });

  it('marks the far pages so small screens can hide them', () => {
    const outer = buildPageItems(4, 8).filter((item) => item.isOuter);

    expect(outer.map((item) => item.page)).toEqual([2, 6]);
  });
});

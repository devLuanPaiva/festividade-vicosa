import { describe, expect, it } from 'vitest';
import { buildPage, lastPageOf, offsetOf } from './paginate';

describe('lastPageOf', () => {
  it('rounds up and always has at least one page', () => {
    expect(lastPageOf(45, 20)).toBe(3);
    expect(lastPageOf(40, 20)).toBe(2);
    expect(lastPageOf(0, 20)).toBe(1);
  });
});

describe('offsetOf', () => {
  it('skips the items of the pages before', () => {
    expect(offsetOf(1, 25)).toBe(0);
    expect(offsetOf(3, 25)).toBe(50);
  });
});

describe('buildPage', () => {
  it('keeps the requested page when it exists', () => {
    expect(buildPage({ items: ['a'], total: 45, page: 2, pageSize: 20 })).toEqual({
      items: ['a'],
      page: 2,
      totalPages: 3,
      total: 45,
    });
  });

  it('never points past the last page', () => {
    expect(buildPage({ items: [], total: 45, page: 9, pageSize: 20 }).page).toBe(3);
  });
});

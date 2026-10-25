import { describe, expect, it } from 'vitest';
import { paginate } from './match-list-paginate';

const ITEMS = Array.from({ length: 45 }, (_, index) => index + 1);

describe('paginate', () => {
  it('cuts the list in pages and says how many there are', () => {
    const page = paginate(ITEMS, 2, 20);

    expect(page.items[0]).toBe(21);
    expect(page.items).toHaveLength(20);
    expect(page).toMatchObject({ page: 2, totalPages: 3, total: 45 });
  });

  it('shows the short last page', () => {
    expect(paginate(ITEMS, 3, 20).items).toEqual([41, 42, 43, 44, 45]);
  });

  it('brings back to a real page when the address asks for one that does not exist', () => {
    expect(paginate(ITEMS, 99, 20).page).toBe(3);
    expect(paginate(ITEMS, 0, 20).page).toBe(1);
  });

  it('still has one empty page when nothing was found', () => {
    expect(paginate([], 1, 20)).toEqual({ items: [], page: 1, totalPages: 1, total: 0 });
  });
});

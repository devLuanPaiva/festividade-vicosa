import { describe, expect, it } from 'vitest';
import { splitIntoRows } from './split-into-rows';

const landscape = { width: 3, height: 2 };
const portrait = { width: 2, height: 3 };
const panorama = { width: 4, height: 1 };

function photos(count: number, shape = landscape): Array<typeof landscape & { id: number }> {
  return Array.from({ length: count }, (_, id) => ({ id, ...shape }));
}

describe('splitIntoRows', () => {
  it('fills exactly the requested number of rows, keeping every photo in order', () => {
    const items = photos(10);

    const rows = splitIntoRows(items, 3);

    expect(rows).toHaveLength(3);
    expect(rows.flat()).toEqual(items);
  });

  it('balances rows so the last one is as full as the others', () => {
    const rows = splitIntoRows(photos(6), 2);

    expect(rows.map((row) => row.length)).toEqual([3, 3]);
  });

  it('balances rows by total width, not by photo count', () => {
    const items = [...photos(2, panorama), ...photos(4, portrait)];

    const rows = splitIntoRows(items, 2);

    expect(rows.map((row) => row.length)).toEqual([1, 5]);
  });

  it.each([
    { name: 'never asks for more rows than photos', count: 2, rowCount: 5, expected: 2 },
    { name: 'always keeps at least one row', count: 3, rowCount: 0, expected: 1 },
    { name: 'returns nothing without photos', count: 0, rowCount: 3, expected: 0 },
  ])('$name', ({ count, rowCount, expected }) => {
    expect(splitIntoRows(photos(count), rowCount)).toHaveLength(expected);
  });
});

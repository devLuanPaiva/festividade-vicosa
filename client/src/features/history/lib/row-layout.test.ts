import { describe, expect, it } from 'vitest';
import type { HistoryPhoto } from '../types';
import { rowCountFor, targetRowHeight } from './row-layout';

function photos(count: number): HistoryPhoto[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `p${index}`,
    url: '',
    alt: '',
    width: 300,
    height: 200,
  }));
}

describe('row layout', () => {
  it.each([
    { width: 360, expected: 130 },
    { width: 800, expected: 190 },
    { width: 1200, expected: 250 },
  ])('uses a $expected px target height at $width px', ({ width, expected }) => {
    expect(targetRowHeight(width)).toBe(expected);
  });

  it('needs more rows on narrow screens', () => {
    expect(rowCountFor(photos(70), 360)).toBeGreaterThan(rowCountFor(photos(70), 1200));
  });

  it('keeps one row for a handful of photos', () => {
    expect(rowCountFor(photos(2), 1200)).toBe(1);
  });
});

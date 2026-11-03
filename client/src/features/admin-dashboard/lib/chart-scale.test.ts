import { describe, expect, it } from 'vitest';
import { niceScale } from './chart-scale';

describe('niceScale', () => {
  it.each([
    [54, 60, [0, 20, 40, 60]],
    [7, 8, [0, 2, 4, 6, 8]],
    [100, 100, [0, 50, 100]],
    [3, 3, [0, 1, 2, 3]],
    [1, 1, [0, 1]],
  ])('rounds %i up to a round maximum of %i with even ticks', (value, max, ticks) => {
    expect(niceScale(value)).toEqual({ max, ticks });
  });

  it('keeps a usable axis when there is nothing to plot', () => {
    expect(niceScale(0)).toEqual({ max: 1, ticks: [0, 1] });
  });

  it('counts matches, so the ticks are whole numbers even for tiny values', () => {
    expect(niceScale(2).ticks).toEqual([0, 1, 2]);
  });

  it('never cuts the tallest column', () => {
    for (const value of [1, 13, 39, 54, 99, 250, 1001]) {
      expect(niceScale(value).max).toBeGreaterThanOrEqual(value);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { distributePhotos } from './distribute-photos';

describe('distributePhotos', () => {
  it('spreads neighbouring photos across different groups', () => {
    expect(distributePhotos([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([
      [1, 4, 7],
      [2, 5],
      [3, 6],
    ]);
  });

  it('keeps every photo exactly once', () => {
    const photos = Array.from({ length: 70 }, (_, index) => index);

    const groups = distributePhotos(photos, 6);

    expect(groups.flat().sort((a, b) => a - b)).toEqual(photos);
  });

  it('returns empty groups when there are no photos', () => {
    expect(distributePhotos([], 2)).toEqual([[], []]);
  });
});

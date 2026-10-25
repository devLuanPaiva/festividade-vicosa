import { describe, expect, it } from 'vitest';
import { photoCountLabel } from './photo-count-label';

describe('photoCountLabel', () => {
  it.each([
    { count: 0, label: 'Sem fotos' },
    { count: 1, label: '1 foto' },
    { count: 2, label: '2 fotos' },
    { count: 120, label: '120 fotos' },
  ])('says "$label" for $count', ({ count, label }) => {
    expect(photoCountLabel(count)).toBe(label);
  });
});

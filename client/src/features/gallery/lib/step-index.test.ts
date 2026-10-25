import { describe, expect, it } from 'vitest';
import { stepIndex } from './step-index';

describe('stepIndex', () => {
  it.each([
    { name: 'goes to the next photo', index: 1, offset: 1, expected: 2 },
    { name: 'goes to the previous photo', index: 2, offset: -1, expected: 1 },
    { name: 'wraps from the last photo to the first', index: 3, offset: 1, expected: 0 },
    { name: 'wraps from the first photo to the last', index: 0, offset: -1, expected: 3 },
  ])('$name', ({ index, offset, expected }) => {
    expect(stepIndex(index, offset, 4)).toBe(expected);
  });

  it('stays at zero when there are no photos', () => {
    expect(stepIndex(0, 1, 0)).toBe(0);
  });
});

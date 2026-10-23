import { describe, expect, it } from 'vitest';
import { formatDateRange } from './format-date-range';

describe('formatDateRange', () => {
  it.each([
    { label: 'a single day', start: '2026-12-08', end: '2026-12-08', expected: '8 de dezembro' },
    {
      label: 'a range inside one month',
      start: '2026-12-04',
      end: '2026-12-06',
      expected: '4 a 6 de dezembro',
    },
    {
      label: 'a range across months',
      start: '2026-11-28',
      end: '2026-12-02',
      expected: '28 de novembro a 2 de dezembro',
    },
  ])('formats $label', ({ start, end, expected }) => {
    expect(formatDateRange(start, end)).toBe(expected);
  });
});

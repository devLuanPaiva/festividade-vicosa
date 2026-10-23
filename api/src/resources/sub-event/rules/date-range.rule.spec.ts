import { isValidDateRange } from './date-range.rule';

describe('isValidDateRange', () => {
  it.each([
    { scenario: 'a range of several days', start: '2026-12-09', end: '2026-12-19', expected: true },
    { scenario: 'a single day event', start: '2026-12-13', end: '2026-12-13', expected: true },
    {
      scenario: 'a range that crosses months',
      start: '2026-11-30',
      end: '2026-12-02',
      expected: true,
    },
    {
      scenario: 'an end before the start',
      start: '2026-12-19',
      end: '2026-12-09',
      expected: false,
    },
  ])('judges $scenario', ({ start, end, expected }) => {
    expect(isValidDateRange(start, end)).toBe(expected);
  });
});

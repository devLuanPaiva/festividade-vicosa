import { isDayWithinRange } from './day-in-range.rule';

describe('isDayWithinRange', () => {
  it.each([
    { name: 'accepts the first day', day: '2026-12-09', expected: true },
    { name: 'accepts a day in the middle', day: '2026-12-14', expected: true },
    { name: 'accepts the last day', day: '2026-12-19', expected: true },
    { name: 'refuses the day before the start', day: '2026-12-08', expected: false },
    { name: 'refuses the day after the end', day: '2026-12-20', expected: false },
  ])('$name', ({ day, expected }) => {
    expect(isDayWithinRange(day, '2026-12-09', '2026-12-19')).toBe(expected);
  });
});

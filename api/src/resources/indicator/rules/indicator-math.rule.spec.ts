import { averagePerMatch, dayRangeInFortaleza, toPercentage } from './indicator-math.rule';

describe('dayRangeInFortaleza', () => {
  it.each([
    ['midday', '2026-12-04T15:00:00.000Z', '2026-12-04T03:00:00.000Z'],
    [
      'the evening that is already the next day in UTC',
      '2026-12-05T02:00:00.000Z',
      '2026-12-04T03:00:00.000Z',
    ],
    ['just after local midnight', '2026-12-05T03:00:00.000Z', '2026-12-05T03:00:00.000Z'],
    ['just before local midnight', '2026-12-05T02:59:59.999Z', '2026-12-04T03:00:00.000Z'],
  ])('starts the local day at 03:00 UTC for %s', (_name, now, expectedStart) => {
    const { start, end } = dayRangeInFortaleza(new Date(now));

    expect(start.toISOString()).toBe(expectedStart);
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

describe('toPercentage', () => {
  it.each([
    [0, 0, 0],
    [0, 12, 0],
    [1, 3, 33],
    [2, 3, 67],
    [12, 12, 100],
  ])('turns %i of %i into %i%%', (part, total, expected) => {
    expect(toPercentage(part, total)).toBe(expected);
  });
});

describe('averagePerMatch', () => {
  it('rounds to two decimals and is zero before any played match', () => {
    expect(averagePerMatch(10, 3)).toBeCloseTo(3.33, 2);
    expect(averagePerMatch(0, 0)).toBe(0);
  });
});

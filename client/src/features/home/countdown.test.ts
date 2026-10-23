import { describe, expect, it } from 'vitest';
import { getCountdown } from './countdown';

const target = new Date('2026-12-04T08:00:00-03:00');

describe('getCountdown', () => {
  it.each([
    [
      'exactly 42 days before',
      '2026-10-23T11:00:00Z',
      { days: 42, hours: 0, minutes: 0, seconds: 0 },
    ],
    [
      '1 day, 2 hours, 3 minutes and 4 seconds before',
      '2026-12-03T08:56:56Z',
      { days: 1, hours: 2, minutes: 3, seconds: 4 },
    ],
    ['one second before', '2026-12-04T10:59:59Z', { days: 0, hours: 0, minutes: 0, seconds: 1 }],
  ])('splits the remaining time %s', (_label, now, expected) => {
    const countdown = getCountdown(target, new Date(now).getTime());

    expect(countdown).toMatchObject({ ...expected, isFinished: false });
  });

  it('is finished and never negative once the target has passed', () => {
    const countdown = getCountdown(target, new Date('2026-12-05T00:00:00Z').getTime());

    expect(countdown).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
  });
});

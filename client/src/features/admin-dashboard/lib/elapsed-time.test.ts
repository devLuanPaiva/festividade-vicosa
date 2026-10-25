import { describe, expect, it } from 'vitest';
import { describeElapsed } from './elapsed-time';

const NOW = new Date('2026-12-05T15:00:00.000Z');

describe('describeElapsed', () => {
  it.each([
    ['seconds ago', '2026-12-05T14:59:30.000Z', 'agora'],
    ['minutes ago', '2026-12-05T14:55:00.000Z', 'há 5 min'],
    ['an hour and a bit ago', '2026-12-05T13:30:00.000Z', 'há 1 h'],
    ['hours ago', '2026-12-05T04:00:00.000Z', 'há 11 h'],
  ])('says %s in words', (_name, isoDate, expected) => {
    expect(describeElapsed(isoDate, NOW)).toBe(expected);
  });

  it('switches to the local day and month after a full day', () => {
    expect(describeElapsed('2026-12-04T02:00:00.000Z', NOW)).toBe('03/12');
  });
});

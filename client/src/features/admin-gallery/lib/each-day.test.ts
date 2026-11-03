import { describe, expect, it } from 'vitest';
import { eachDay } from './each-day';

describe('eachDay', () => {
  it('lists every day of the range, both ends included', () => {
    expect(eachDay('2026-12-04', '2026-12-06')).toEqual(['2026-12-04', '2026-12-05', '2026-12-06']);
  });

  it('gives a single day for a one day event', () => {
    expect(eachDay('2026-12-13', '2026-12-13')).toEqual(['2026-12-13']);
  });

  it('crosses the end of the month', () => {
    expect(eachDay('2026-12-30', '2027-01-01')).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  });

  it('gives nothing when the end comes before the start', () => {
    expect(eachDay('2026-12-06', '2026-12-04')).toEqual([]);
  });
});

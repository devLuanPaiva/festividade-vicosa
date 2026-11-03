import { describe, expect, it } from 'vitest';
import { toDateInput, toScheduledAt, toTimeInput } from './match-schedule';

describe('match schedule', () => {
  it('sends the typed date and time as Fortaleza time', () => {
    expect(toScheduledAt('2026-12-18', '20:00')).toBe('2026-12-18T20:00:00-03:00');
  });

  it('sends nothing until both date and time are typed', () => {
    expect(toScheduledAt('2026-12-18', '')).toBe('');
    expect(toScheduledAt('', '20:00')).toBe('');
  });

  it('shows a late match on its local day, not on the UTC day', () => {
    const scheduledAt = '2026-12-19T02:30:00.000Z';

    expect(toDateInput(scheduledAt)).toBe('2026-12-18');
    expect(toTimeInput(scheduledAt)).toBe('23:30');
  });

  it('shows midnight as 00:00', () => {
    expect(toTimeInput('2026-12-18T03:00:00.000Z')).toBe('00:00');
  });
});

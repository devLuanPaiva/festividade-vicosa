import { describe, expect, it } from 'vitest';
import { buildDayColumns } from './day-columns';

describe('buildDayColumns', () => {
  it('names the day, writes it day-first and totals both states', () => {
    const [column] = buildDayColumns([{ date: '2026-12-04', finalized: 39, scheduled: 15 }]);

    expect(column).toEqual({
      date: '2026-12-04',
      weekday: 'sex',
      dayMonth: '04/12',
      finalized: 39,
      scheduled: 15,
      total: 54,
    });
  });

  it('keeps the order the API sent, which is chronological', () => {
    const columns = buildDayColumns([
      { date: '2026-12-04', finalized: 1, scheduled: 0 },
      { date: '2026-12-05', finalized: 0, scheduled: 2 },
    ]);

    expect(columns.map((column) => column.weekday)).toEqual(['sex', 'sáb']);
  });
});

import { dayWindow, normalizeSearchTerm, todayWindow } from './match-situation.rule';

describe('dayWindow', () => {
  it('covers the whole day in Fortaleza, which starts at 03:00 UTC', () => {
    const { start, end } = dayWindow('2026-12-09');

    expect(start.toISOString()).toBe('2026-12-09T03:00:00.000Z');
    expect(end.toISOString()).toBe('2026-12-10T03:00:00.000Z');
  });
});

describe('todayWindow', () => {
  it('still belongs to the previous day in Fortaleza just after midnight UTC', () => {
    const { start } = todayWindow(new Date('2026-12-09T01:30:00.000Z'));

    expect(start.toISOString()).toBe('2026-12-08T03:00:00.000Z');
  });
});

describe('normalizeSearchTerm', () => {
  it('ignores case, accents and surrounding spaces', () => {
    expect(normalizeSearchTerm('  SÃO José ')).toBe('sao jose');
  });
});

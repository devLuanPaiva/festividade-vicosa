import { describe, expect, it } from 'vitest';
import { parseSuggestionForm } from './parse-suggestion-form';
import { bracketMatchTitle, toBracketRows } from './suggestion-rows';

describe('bracketMatchTitle', () => {
  it.each([
    ['ROUND_OF_32', 2, '16 avos de final · jogo 3'],
    ['QUARTER_FINAL', 0, 'Quartas de final · jogo 1'],
    ['FINAL', 0, 'Final'],
    ['THIRD_PLACE', 0, 'Disputa de 3º lugar'],
  ] as const)('names %s #%i as %s', (round, position, title) => {
    expect(bracketMatchTitle(round, position)).toBe(title);
  });
});

describe('toBracketRows', () => {
  it('warns that confirming will update a match that already exists', () => {
    const [created, existing] = toBracketRows([
      {
        round: 'SEMI_FINAL',
        bracketPosition: 0,
        teamAId: 'a',
        teamBId: 'b',
        scheduledAt: null,
        matchId: null,
      },
      {
        round: 'SEMI_FINAL',
        bracketPosition: 1,
        teamAId: 'c',
        teamBId: 'd',
        scheduledAt: '2026-12-12T18:00:00.000Z',
        matchId: 'm',
      },
    ]);

    expect(created).toMatchObject({ matchId: '', note: '', date: '', time: '' });
    expect(existing).toMatchObject({ matchId: 'm', date: '2026-12-12', time: '15:00' });
    expect(existing?.note).toContain('atualiza');
  });
});

describe('parseSuggestionForm', () => {
  it('reads only the checked rows as included and trims the defaults', () => {
    const formData = new FormData();
    formData.set('rowCount', '2');
    formData.set('defaultDate', ' 2026-12-12 ');
    ['0', '1'].forEach((index) => {
      formData.set(`rows.${index}.stage`, 'KNOCKOUT');
      formData.set(`rows.${index}.teamAId`, `a${index}`);
    });
    formData.set('rows.1.include', 'on');

    const { rows, defaults } = parseSuggestionForm(formData);

    expect(rows.map((row) => row.isIncluded)).toEqual([false, true]);
    expect(rows[1]).toMatchObject({ stage: 'KNOCKOUT', teamAId: 'a1' });
    expect(defaults.date).toBe('2026-12-12');
  });
});

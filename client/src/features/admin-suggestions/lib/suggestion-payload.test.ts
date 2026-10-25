import { describe, expect, it } from 'vitest';
import type { SuggestionDefaults, SuggestionRow } from '../types';
import {
  findRowWithoutSchedule,
  toBatchMatch,
  toMatchUpdate,
  toRowFailure,
  type IndexedRow,
} from './suggestion-payload';

const NO_DEFAULTS: SuggestionDefaults = { date: '', time: '', location: '' };
const DEFAULTS: SuggestionDefaults = {
  date: '2026-12-12',
  time: '15:00',
  location: 'Ginásio Municipal',
};

function row(overrides: Partial<SuggestionRow> = {}): SuggestionRow {
  return {
    stage: 'KNOCKOUT',
    groupId: '',
    round: 'ROUND_OF_16',
    bracketPosition: '3',
    matchId: '',
    title: '',
    note: '',
    teamAId: 'a',
    teamBId: 'b',
    date: '',
    time: '',
    location: '',
    isIncluded: true,
    ...overrides,
  };
}

describe('toBatchMatch', () => {
  it('sends the bracket slot and falls back to the default schedule and place', () => {
    expect(toBatchMatch(row(), DEFAULTS)).toEqual({
      stage: 'KNOCKOUT',
      round: 'ROUND_OF_16',
      bracketPosition: 3,
      scheduledAt: '2026-12-12T15:00:00-03:00',
      location: 'Ginásio Municipal',
      teamAId: 'a',
      teamBId: 'b',
    });
  });

  it('prefers the schedule typed in the row and keeps position 0', () => {
    const payload = toBatchMatch(
      row({ bracketPosition: '0', date: '2026-12-13', time: '19:30', location: 'Quadra' }),
      DEFAULTS,
    );

    expect(payload).toMatchObject({
      bracketPosition: 0,
      scheduledAt: '2026-12-13T19:30:00-03:00',
      location: 'Quadra',
    });
  });

  it('sends a group match without bracket fields', () => {
    const payload = toBatchMatch(
      row({ stage: 'GROUP', groupId: 'g', round: '', bracketPosition: '' }),
      DEFAULTS,
    );

    expect(payload).toMatchObject({ stage: 'GROUP', groupId: 'g' });
    expect(payload).not.toHaveProperty('round');
    expect(payload).not.toHaveProperty('bracketPosition');
  });
});

describe('toMatchUpdate', () => {
  it('sends the reviewed teams with the resolved schedule', () => {
    expect(toMatchUpdate(row({ matchId: 'm' }), DEFAULTS)).toEqual({
      scheduledAt: '2026-12-12T15:00:00-03:00',
      location: 'Ginásio Municipal',
      teamAId: 'a',
      teamBId: 'b',
    });
  });
});

describe('findRowWithoutSchedule', () => {
  const included: IndexedRow[] = [
    { index: 0, row: row({ date: '2026-12-13', time: '19:30' }) },
    { index: 1, row: row() },
  ];

  it('points at the first included row that has no date and time anywhere', () => {
    expect(findRowWithoutSchedule(included, NO_DEFAULTS)).toMatchObject({
      errorField: 'rows.1.date',
    });
  });

  it('accepts rows that rely on the defaults', () => {
    expect(findRowWithoutSchedule(included, DEFAULTS)).toBeNull();
  });
});

describe('toRowFailure', () => {
  const creations: IndexedRow[] = [
    { index: 2, row: row() },
    { index: 5, row: row() },
  ];

  it('maps an API field of the batch back to the row the organizer sees', () => {
    const failure = { errorMessage: 'Time inválido.', errorField: 'matches.1.teamAId' };

    expect(toRowFailure(failure, creations)).toEqual({
      errorMessage: 'Time inválido.',
      errorField: 'rows.5.teamAId',
    });
  });

  it('shows a schedule error on the date field of the row', () => {
    const failure = { errorMessage: 'Data inválida.', errorField: 'matches.0.scheduledAt' };

    expect(toRowFailure(failure, creations).errorField).toBe('rows.2.date');
  });

  it('keeps errors that do not belong to a row', () => {
    const failure = { errorMessage: 'Esta categoria já tem chaveamento.', errorField: null };

    expect(toRowFailure(failure, creations)).toEqual(failure);
  });
});

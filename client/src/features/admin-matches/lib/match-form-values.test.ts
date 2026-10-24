import { describe, expect, it } from 'vitest';
import type { Match } from '@/features/games/types';
import { toMatchFormValues } from './match-form-values';

const KNOCKOUT_MATCH = {
  stage: 'KNOCKOUT',
  groupId: null,
  round: 'SEMI_FINAL',
  teamAId: 't1',
  teamBId: 't2',
  scheduledAt: '2026-12-19T02:30:00.000Z',
  location: null,
} as Match;

describe('toMatchFormValues', () => {
  it('turns a stored match into the values the edit form shows, in Fortaleza time', () => {
    expect(toMatchFormValues(KNOCKOUT_MATCH)).toEqual({
      stage: 'KNOCKOUT',
      groupId: '',
      round: 'SEMI_FINAL',
      teamAId: 't1',
      teamBId: 't2',
      date: '2026-12-18',
      time: '23:30',
      location: '',
    });
  });
});

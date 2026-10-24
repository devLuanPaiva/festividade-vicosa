import { describe, expect, it } from 'vitest';
import type { Match } from '@/features/games/types';
import type { ResultDraft } from '../types';
import { createResultDraft, needsPenalties } from './result-draft';

const SCHEDULED_MATCH = {
  teamAId: 'team-a',
  teamBId: 'team-b',
  resultType: 'PLAYED',
  scoreA: null,
  scoreB: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerId: null,
  bestPlayer: null,
} as Match;

const TIED_DRAFT: ResultDraft = {
  ...createResultDraft(SCHEDULED_MATCH),
  scoreA: '2',
  scoreB: '2',
};

describe('needsPenalties', () => {
  it('asks for penalties only when a knockout match is tied', () => {
    expect(needsPenalties('KNOCKOUT', TIED_DRAFT)).toBe(true);
    expect(needsPenalties('GROUP', TIED_DRAFT)).toBe(false);
    expect(needsPenalties('KNOCKOUT', { ...TIED_DRAFT, scoreB: '1' })).toBe(false);
  });

  it('does not ask for penalties before any score is typed', () => {
    expect(needsPenalties('KNOCKOUT', { ...TIED_DRAFT, scoreA: '', scoreB: '' })).toBe(false);
  });

  it('does not ask for penalties on a walkover', () => {
    expect(needsPenalties('KNOCKOUT', { ...TIED_DRAFT, resultType: 'WALKOVER' })).toBe(false);
  });
});

describe('createResultDraft', () => {
  it('starts empty for a match without result', () => {
    expect(createResultDraft(SCHEDULED_MATCH)).toMatchObject({
      resultType: 'PLAYED',
      scoreA: '',
      scoreB: '',
      bestPlayerName: '',
      bestPlayerTeamId: 'team-a',
    });
  });

  it('loads the recorded result so a correction starts from it', () => {
    const finalized = {
      ...SCHEDULED_MATCH,
      scoreA: 0,
      scoreB: 0,
      penaltiesA: 5,
      penaltiesB: 4,
      bestPlayer: { name: 'Carlos', photoKey: null, teamId: 'team-b' },
    } as Match;

    expect(createResultDraft(finalized)).toMatchObject({
      scoreA: '0',
      scoreB: '0',
      penaltiesA: '5',
      bestPlayerName: 'Carlos',
      bestPlayerTeamId: 'team-b',
    });
  });
});

import { describe, expect, it } from 'vitest';
import type { ResultValues } from '../types';
import { buildResultPayload } from './build-result-payload';

const PLAYED_VALUES: ResultValues = {
  resultType: 'PLAYED',
  scoreA: 2,
  scoreB: 1,
  penaltiesA: null,
  penaltiesB: null,
  walkoverWinnerId: null,
  bestPlayerName: '',
  bestPlayerTeamId: null,
  bestPlayerPhotoKey: null,
};

function valuesWith(changes: Partial<ResultValues>): ResultValues {
  return { ...PLAYED_VALUES, ...changes };
}

describe('buildResultPayload', () => {
  it('sends only the scores for a played match without extras', () => {
    expect(buildResultPayload(PLAYED_VALUES)).toEqual({
      resultType: 'PLAYED',
      scoreA: 2,
      scoreB: 1,
    });
  });

  it('sends the penalties only when they were filled in', () => {
    const payload = buildResultPayload(
      valuesWith({ scoreA: 1, scoreB: 1, penaltiesA: 4, penaltiesB: 3 }),
    );

    expect(payload).toMatchObject({ penaltiesA: 4, penaltiesB: 3 });
  });

  it('keeps the best player photo so a correction does not erase it', () => {
    const payload = buildResultPayload(
      valuesWith({
        bestPlayerName: 'Carlos',
        bestPlayerTeamId: 'team-a',
        bestPlayerPhotoKey: 'players/carlos.png',
      }),
    );

    expect(payload).toMatchObject({
      bestPlayerName: 'Carlos',
      bestPlayerTeamId: 'team-a',
      bestPlayerPhotoKey: 'players/carlos.png',
    });
  });

  it('drops the best player team when no name was informed', () => {
    const payload = buildResultPayload(valuesWith({ bestPlayerTeamId: 'team-a' }));

    expect(payload).not.toHaveProperty('bestPlayerTeamId');
  });

  it('ignores scores typed before switching to a walkover', () => {
    const payload = buildResultPayload(
      valuesWith({ resultType: 'WALKOVER', walkoverWinnerId: 'team-b', bestPlayerName: 'Carlos' }),
    );

    expect(payload).toEqual({ resultType: 'WALKOVER', walkoverWinnerId: 'team-b' });
  });

  it('sends nothing but the type for a double walkover', () => {
    const payload = buildResultPayload(valuesWith({ resultType: 'DOUBLE_WALKOVER' }));

    expect(payload).toEqual({ resultType: 'DOUBLE_WALKOVER' });
  });
});

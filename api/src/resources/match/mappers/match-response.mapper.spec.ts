import type { Match } from '../entities/match.entity';
import { MatchResultType, MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';
import { toMatchResponse } from './match-response.mapper';

const scheduled: Match = {
  id: '00000000-0000-4000-8000-0000000000d1',
  categoryId: '00000000-0000-4000-8000-000000000005',
  stage: MatchStage.KNOCKOUT,
  groupId: null,
  round: MatchRound.FINAL,
  scheduledAt: new Date('2026-12-19T22:00:00.000Z'),
  location: 'Ginásio',
  status: MatchStatus.SCHEDULED,
  teamAId: '00000000-0000-4000-8000-0000000000a1',
  teamBId: '00000000-0000-4000-8000-0000000000b2',
  resultType: MatchResultType.PLAYED,
  scoreA: null,
  scoreB: null,
  penaltiesA: null,
  penaltiesB: null,
  winnerId: null,
  finalizedById: null,
  finalizedAt: null,
  bestPlayerName: null,
  bestPlayerPhotoKey: null,
  bestPlayerTeamId: null,
};

function matchWith(overrides: Partial<Match>): Match {
  return Object.assign({}, scheduled, overrides);
}

describe('toMatchResponse', () => {
  it('formats the dates and has no best player nor result before the match is played', () => {
    expect(toMatchResponse(scheduled)).toMatchObject({
      scheduledAt: '2026-12-19T22:00:00.000Z',
      finalizedAt: null,
      scoreA: null,
      bestPlayer: null,
    });
  });

  it('shows a walkover without score and with the winner', () => {
    const response = toMatchResponse(
      matchWith({
        status: MatchStatus.FINALIZED,
        resultType: MatchResultType.WALKOVER,
        winnerId: scheduled.teamBId,
      }),
    );

    expect(response).toMatchObject({
      resultType: 'WALKOVER',
      scoreA: null,
      scoreB: null,
      winnerId: scheduled.teamBId,
    });
  });

  it('never exposes who finalized the match', () => {
    expect(toMatchResponse(matchWith({ finalizedById: 'user' }))).not.toHaveProperty(
      'finalizedById',
    );
  });

  it('groups the best player fields', () => {
    const response = toMatchResponse(
      matchWith({
        status: MatchStatus.FINALIZED,
        scoreA: 2,
        scoreB: 2,
        penaltiesA: 4,
        penaltiesB: 3,
        winnerId: scheduled.teamAId,
        finalizedAt: new Date('2026-12-19T23:30:00.000Z'),
        bestPlayerName: 'Ana',
        bestPlayerPhotoKey: 'photos/ana',
        bestPlayerTeamId: scheduled.teamAId,
      }),
    );

    expect(response).toMatchObject({
      penaltiesA: 4,
      winnerId: scheduled.teamAId,
      finalizedAt: '2026-12-19T23:30:00.000Z',
      bestPlayer: { name: 'Ana', photoKey: 'photos/ana', teamId: scheduled.teamAId },
    });
  });
});

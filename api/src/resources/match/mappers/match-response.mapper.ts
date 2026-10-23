import type { BestPlayerResponseDto, MatchResponseDto } from '../dto/match-response.dto';
import type { Match } from '../entities/match.entity';

function toBestPlayer(match: Match): BestPlayerResponseDto | null {
  if (!match.bestPlayerName || !match.bestPlayerTeamId) {
    return null;
  }
  return {
    name: match.bestPlayerName,
    photoKey: match.bestPlayerPhotoKey,
    teamId: match.bestPlayerTeamId,
  };
}

function toFixture(
  match: Match,
): Omit<
  MatchResponseDto,
  'bestPlayer' | 'scoreA' | 'scoreB' | 'penaltiesA' | 'penaltiesB' | 'winnerId' | 'finalizedAt'
> {
  return {
    id: match.id,
    categoryId: match.categoryId,
    stage: match.stage,
    groupId: match.groupId,
    round: match.round,
    scheduledAt: match.scheduledAt.toISOString(),
    location: match.location,
    status: match.status,
    teamAId: match.teamAId,
    teamBId: match.teamBId,
  };
}

export function toMatchResponse(match: Match): MatchResponseDto {
  return {
    ...toFixture(match),
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    penaltiesA: match.penaltiesA,
    penaltiesB: match.penaltiesB,
    winnerId: match.winnerId,
    finalizedAt: match.finalizedAt?.toISOString() ?? null,
    bestPlayer: toBestPlayer(match),
  };
}

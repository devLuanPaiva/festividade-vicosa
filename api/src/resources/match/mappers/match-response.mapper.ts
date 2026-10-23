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

type Identity = Pick<
  MatchResponseDto,
  'id' | 'categoryId' | 'stage' | 'groupId' | 'round' | 'bracketPosition' | 'teamAId' | 'teamBId'
>;

type Schedule = Pick<MatchResponseDto, 'scheduledAt' | 'location' | 'status'>;

function toIdentity(match: Match): Identity {
  return {
    id: match.id,
    categoryId: match.categoryId,
    stage: match.stage,
    groupId: match.groupId,
    round: match.round,
    bracketPosition: match.bracketPosition,
    teamAId: match.teamAId,
    teamBId: match.teamBId,
  };
}

function toSchedule(match: Match): Schedule {
  return {
    scheduledAt: match.scheduledAt.toISOString(),
    location: match.location,
    status: match.status,
  };
}

export function toMatchResponse(match: Match): MatchResponseDto {
  return {
    ...toIdentity(match),
    ...toSchedule(match),
    resultType: match.resultType,
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    penaltiesA: match.penaltiesA,
    penaltiesB: match.penaltiesB,
    winnerId: match.winnerId,
    finalizedAt: match.finalizedAt?.toISOString() ?? null,
    bestPlayer: toBestPlayer(match),
  };
}

import { MatchResultType } from '../../match/enums/match.enums';
import type { StandingMatch, StandingRow, StandingTeam } from './standing-tally.rule';

export const ALFA: StandingTeam = { id: 'alfa', name: 'Alfa' };
export const BETA: StandingTeam = { id: 'beta', name: 'Beta' };
export const GAMA: StandingTeam = { id: 'gama', name: 'Gama' };
export const DELTA: StandingTeam = { id: 'delta', name: 'Delta' };
export const TEAMS = [ALFA, BETA, GAMA];

interface PlayedScore {
  teamAId: string;
  scoreA: number;
  scoreB: number;
  teamBId: string;
}

function winnerOf({ teamAId, scoreA, scoreB, teamBId }: PlayedScore): string | null {
  if (scoreA === scoreB) {
    return null;
  }
  return scoreA > scoreB ? teamAId : teamBId;
}

function played(score: PlayedScore): StandingMatch {
  return {
    teamAId: score.teamAId,
    teamBId: score.teamBId,
    resultType: MatchResultType.PLAYED,
    scoreA: score.scoreA,
    scoreB: score.scoreB,
    winnerId: winnerOf(score),
  };
}

export function game(
  teamAId: string,
  [scoreA, scoreB]: [number, number],
  teamBId: string,
): StandingMatch {
  return played({ teamAId, scoreA, scoreB, teamBId });
}

export function walkover(teamAId: string, teamBId: string, winnerId: string): StandingMatch {
  return {
    teamAId,
    teamBId,
    resultType: MatchResultType.WALKOVER,
    scoreA: null,
    scoreB: null,
    winnerId,
  };
}

export function doubleWalkover(teamAId: string, teamBId: string): StandingMatch {
  return {
    teamAId,
    teamBId,
    resultType: MatchResultType.DOUBLE_WALKOVER,
    scoreA: null,
    scoreB: null,
    winnerId: null,
  };
}

export function rowOf(rows: StandingRow[], teamId: string): object {
  return rows.find((row) => row.teamId === teamId) ?? {};
}

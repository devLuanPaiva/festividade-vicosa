import { MatchResultType } from '../../match/enums/match.enums';
import { compareStandingRows } from './tie-break.rule';

export const POINTS_FOR_WIN = 3;
export const POINTS_FOR_DRAW = 1;
export const POINTS_FOR_LOSS = 0;

export interface StandingTeam {
  id: string;
  name: string;
}

export interface StandingMatch {
  teamAId: string;
  teamBId: string;
  resultType: MatchResultType;
  scoreA: number | null;
  scoreB: number | null;
  winnerId: string | null;
}

export interface StandingRow {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

type Outcome = 'WIN' | 'DRAW' | 'LOSS';

const POINTS_BY_OUTCOME: Record<Outcome, number> = {
  WIN: POINTS_FOR_WIN,
  DRAW: POINTS_FOR_DRAW,
  LOSS: POINTS_FOR_LOSS,
};

function emptyRow(team: StandingTeam): StandingRow {
  return {
    position: 0,
    teamId: team.id,
    teamName: team.name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function playedOutcome(goalsFor: number, goalsAgainst: number): Outcome {
  if (goalsFor === goalsAgainst) {
    return 'DRAW';
  }
  return goalsFor > goalsAgainst ? 'WIN' : 'LOSS';
}

function outcomeOf(match: StandingMatch, teamId: string, goals: Goals): Outcome {
  if (match.resultType === MatchResultType.PLAYED) {
    return playedOutcome(goals.for, goals.against);
  }
  return match.winnerId === teamId ? 'WIN' : 'LOSS';
}

interface Goals {
  for: number;
  against: number;
}

function goalsOf(match: StandingMatch, isTeamA: boolean): Goals {
  if (match.resultType !== MatchResultType.PLAYED) {
    return { for: 0, against: 0 };
  }
  const scoreA = match.scoreA ?? 0;
  const scoreB = match.scoreB ?? 0;
  return isTeamA ? { for: scoreA, against: scoreB } : { for: scoreB, against: scoreA };
}

const OUTCOME_COUNTER = { WIN: 'wins', DRAW: 'draws', LOSS: 'losses' } as const;

function addResult(row: StandingRow, outcome: Outcome, goals: Goals): void {
  row.played += 1;
  row[OUTCOME_COUNTER[outcome]] += 1;
  row.points += POINTS_BY_OUTCOME[outcome];
  row.goalsFor += goals.for;
  row.goalsAgainst += goals.against;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
}

function applyMatch(rows: Map<string, StandingRow>, match: StandingMatch): void {
  const sides = [
    { teamId: match.teamAId, isTeamA: true },
    { teamId: match.teamBId, isTeamA: false },
  ];
  for (const { teamId, isTeamA } of sides) {
    const row = rows.get(teamId);
    if (row) {
      const goals = goalsOf(match, isTeamA);
      addResult(row, outcomeOf(match, teamId, goals), goals);
    }
  }
}

export function calculateStandings(teams: StandingTeam[], matches: StandingMatch[]): StandingRow[] {
  const rows = new Map(teams.map((team) => [team.id, emptyRow(team)]));
  for (const match of matches) {
    applyMatch(rows, match);
  }
  return [...rows.values()]
    .sort(compareStandingRows)
    .map((row, index) => ({ ...row, position: index + 1 }));
}

import { MatchResultType } from '../../match/enums/match.enums';

export const POINTS_FOR_WIN = 3;
export const POINTS_FOR_DRAW = 1;
export const POINTS_FOR_LOSS = 0;
export const WALKOVER_GOALS = 2;

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
  walkoverLosses: number;
}

type Outcome = 'WIN' | 'DRAW' | 'LOSS';

interface Goals {
  for: number;
  against: number;
}

interface Side {
  teamId: string;
  isTeamA: boolean;
}

interface SideResult {
  outcome: Outcome;
  goals: Goals;
  missed: boolean;
}

const POINTS_BY_OUTCOME: Record<Outcome, number> = {
  WIN: POINTS_FOR_WIN,
  DRAW: POINTS_FOR_DRAW,
  LOSS: POINTS_FOR_LOSS,
};

const OUTCOME_COUNTER = { WIN: 'wins', DRAW: 'draws', LOSS: 'losses' } as const;

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
    walkoverLosses: 0,
  };
}

function playedGoals(match: StandingMatch, isTeamA: boolean): Goals {
  const scoreA = match.scoreA ?? 0;
  const scoreB = match.scoreB ?? 0;
  return isTeamA ? { for: scoreA, against: scoreB } : { for: scoreB, against: scoreA };
}

function walkoverGoals(match: StandingMatch, teamId: string): Goals {
  if (match.resultType === MatchResultType.DOUBLE_WALKOVER) {
    return { for: 0, against: 0 };
  }
  return match.winnerId === teamId
    ? { for: WALKOVER_GOALS, against: 0 }
    : { for: 0, against: WALKOVER_GOALS };
}

function goalsOf(match: StandingMatch, side: Side): Goals {
  return match.resultType === MatchResultType.PLAYED
    ? playedGoals(match, side.isTeamA)
    : walkoverGoals(match, side.teamId);
}

function outcomeOf(match: StandingMatch, teamId: string, goals: Goals): Outcome {
  if (match.resultType !== MatchResultType.PLAYED) {
    return match.winnerId === teamId ? 'WIN' : 'LOSS';
  }
  if (goals.for === goals.against) {
    return 'DRAW';
  }
  return goals.for > goals.against ? 'WIN' : 'LOSS';
}

function missedMatch(match: StandingMatch, outcome: Outcome): boolean {
  return match.resultType !== MatchResultType.PLAYED && outcome === 'LOSS';
}

function resultOf(match: StandingMatch, side: Side): SideResult {
  const goals = goalsOf(match, side);
  const outcome = outcomeOf(match, side.teamId, goals);
  return { outcome, goals, missed: missedMatch(match, outcome) };
}

function addResult(row: StandingRow, result: SideResult): void {
  row.played += 1;
  row[OUTCOME_COUNTER[result.outcome]] += 1;
  row.points += POINTS_BY_OUTCOME[result.outcome];
  row.walkoverLosses += result.missed ? 1 : 0;
  row.goalsFor += result.goals.for;
  row.goalsAgainst += result.goals.against;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
}

function applyMatch(rows: Map<string, StandingRow>, match: StandingMatch): void {
  const sides: Side[] = [
    { teamId: match.teamAId, isTeamA: true },
    { teamId: match.teamBId, isTeamA: false },
  ];
  for (const side of sides) {
    const row = rows.get(side.teamId);
    if (row) {
      addResult(row, resultOf(match, side));
    }
  }
}

export function tallyStandings(teams: StandingTeam[], matches: StandingMatch[]): StandingRow[] {
  const rows = new Map(teams.map((team) => [team.id, emptyRow(team)]));
  for (const match of matches) {
    applyMatch(rows, match);
  }
  return [...rows.values()];
}

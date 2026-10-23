import { MatchResultType } from '../../match/enums/match.enums';
import { calculateStandings, type StandingMatch, type StandingTeam } from './standings.rule';

const ALFA: StandingTeam = { id: 'alfa', name: 'Alfa' };
const BETA: StandingTeam = { id: 'beta', name: 'Beta' };
const GAMA: StandingTeam = { id: 'gama', name: 'Gama' };
const TEAMS = [ALFA, BETA, GAMA];

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

function game(teamAId: string, [scoreA, scoreB]: [number, number], teamBId: string): StandingMatch {
  return played({ teamAId, scoreA, scoreB, teamBId });
}

function walkover(teamAId: string, teamBId: string, winnerId: string): StandingMatch {
  return {
    teamAId,
    teamBId,
    resultType: MatchResultType.WALKOVER,
    scoreA: null,
    scoreB: null,
    winnerId,
  };
}

function doubleWalkover(teamAId: string, teamBId: string): StandingMatch {
  return {
    teamAId,
    teamBId,
    resultType: MatchResultType.DOUBLE_WALKOVER,
    scoreA: null,
    scoreB: null,
    winnerId: null,
  };
}

function rowOf(rows: ReturnType<typeof calculateStandings>, teamId: string): object {
  return rows.find((row) => row.teamId === teamId) ?? {};
}

describe('calculateStandings points and results (RN-19, RN-20)', () => {
  it('lists every team with zeros before any match is finalized', () => {
    const rows = calculateStandings(TEAMS, []);

    expect(rows.map((row) => row.teamName)).toEqual(['Alfa', 'Beta', 'Gama']);
    expect(rows[0]).toMatchObject({ played: 0, points: 0, goalDifference: 0, position: 1 });
  });

  it('gives 3 points to the winner and 0 to the loser, counting goals', () => {
    const rows = calculateStandings(TEAMS, [game('alfa', [3, 1], 'beta')]);

    expect(rowOf(rows, 'alfa')).toMatchObject({
      played: 1,
      wins: 1,
      points: 3,
      goalsFor: 3,
      goalsAgainst: 1,
      goalDifference: 2,
    });
    expect(rowOf(rows, 'beta')).toMatchObject({
      played: 1,
      losses: 1,
      points: 0,
      goalsFor: 1,
      goalsAgainst: 3,
      goalDifference: -2,
    });
  });

  it('gives 1 point to each team on a draw', () => {
    const rows = calculateStandings(TEAMS, [game('alfa', [2, 2], 'beta')]);

    expect(rowOf(rows, 'alfa')).toMatchObject({ draws: 1, points: 1, goalDifference: 0 });
    expect(rowOf(rows, 'beta')).toMatchObject({ draws: 1, points: 1 });
  });

  it('accumulates the matches of a team on either side', () => {
    const rows = calculateStandings(TEAMS, [
      game('alfa', [1, 0], 'beta'),
      game('gama', [0, 2], 'alfa'),
    ]);

    expect(rowOf(rows, 'alfa')).toMatchObject({
      played: 2,
      wins: 2,
      points: 6,
      goalsFor: 3,
      goalsAgainst: 0,
    });
  });

  it('ignores matches of teams that are not in the group', () => {
    const rows = calculateStandings([ALFA, BETA], [game('alfa', [1, 0], 'outsider')]);

    expect(rowOf(rows, 'alfa')).toMatchObject({ played: 1, points: 3 });
    expect(rows).toHaveLength(2);
  });
});

describe('calculateStandings walkovers', () => {
  it('gives the win to the team that showed up, without goals', () => {
    const rows = calculateStandings(TEAMS, [walkover('alfa', 'beta', 'beta')]);

    expect(rowOf(rows, 'beta')).toMatchObject({
      played: 1,
      wins: 1,
      points: 3,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    });
    expect(rowOf(rows, 'alfa')).toMatchObject({ played: 1, losses: 1, points: 0, goalsAgainst: 0 });
  });

  it('counts a loss and no points for both teams on a double walkover', () => {
    const rows = calculateStandings(TEAMS, [doubleWalkover('alfa', 'beta')]);

    expect(rowOf(rows, 'alfa')).toMatchObject({ played: 1, losses: 1, points: 0 });
    expect(rowOf(rows, 'beta')).toMatchObject({ played: 1, losses: 1, points: 0 });
  });
});

describe('calculateStandings ordering', () => {
  it('orders by points first', () => {
    const rows = calculateStandings(TEAMS, [
      game('gama', [1, 0], 'alfa'),
      game('gama', [1, 0], 'beta'),
    ]);

    expect(rows.map((row) => row.teamId)).toEqual(['gama', 'alfa', 'beta']);
    expect(rows.map((row) => row.position)).toEqual([1, 2, 3]);
  });

  it('breaks a points tie by goal difference', () => {
    const rows = calculateStandings(TEAMS, [
      game('alfa', [5, 0], 'gama'),
      game('beta', [1, 0], 'gama'),
    ]);

    expect(rows.map((row) => row.teamId)).toEqual(['alfa', 'beta', 'gama']);
  });

  it('breaks a goal difference tie by goals scored', () => {
    const rows = calculateStandings(TEAMS, [
      game('alfa', [3, 2], 'gama'),
      game('beta', [1, 0], 'gama'),
    ]);

    expect(rows.map((row) => row.teamId)).toEqual(['alfa', 'beta', 'gama']);
  });

  it('falls back to the team name when everything else is equal', () => {
    const rows = calculateStandings([GAMA, BETA, ALFA], []);

    expect(rows.map((row) => row.teamName)).toEqual(['Alfa', 'Beta', 'Gama']);
  });
});

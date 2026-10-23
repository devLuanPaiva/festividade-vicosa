import { calculateStandings } from './standings.rule';
import {
  ALFA,
  BETA,
  GAMA,
  TEAMS,
  doubleWalkover,
  game,
  rowOf,
  walkover,
} from './standing.fixtures';

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

describe('calculateStandings walkovers (edital: W.O. counts 2x0)', () => {
  it('gives the win and a 2x0 score to the team that showed up', () => {
    const rows = calculateStandings(TEAMS, [walkover('alfa', 'beta', 'beta')]);

    expect(rowOf(rows, 'beta')).toMatchObject({
      played: 1,
      wins: 1,
      points: 3,
      goalsFor: 2,
      goalsAgainst: 0,
      goalDifference: 2,
      walkoverLosses: 0,
    });
    expect(rowOf(rows, 'alfa')).toMatchObject({
      played: 1,
      losses: 1,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 2,
      goalDifference: -2,
      walkoverLosses: 1,
    });
  });

  it('counts a loss, no points and no goals for both teams on a double walkover', () => {
    const rows = calculateStandings(TEAMS, [doubleWalkover('alfa', 'beta')]);

    expect(rowOf(rows, 'alfa')).toMatchObject({
      played: 1,
      losses: 1,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      walkoverLosses: 1,
    });
    expect(rowOf(rows, 'beta')).toMatchObject({
      played: 1,
      losses: 1,
      points: 0,
      walkoverLosses: 1,
    });
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

  it('falls back to the team name when everything else is equal', () => {
    const rows = calculateStandings([GAMA, BETA, ALFA], []);

    expect(rows.map((row) => row.teamName)).toEqual(['Alfa', 'Beta', 'Gama']);
  });
});

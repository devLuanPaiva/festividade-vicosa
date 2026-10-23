import { calculateStandings } from './standings.rule';
import { ALFA, BETA, DELTA, GAMA, doubleWalkover, game, walkover } from './standing.fixtures';

const FOUR_TEAMS = [ALFA, BETA, GAMA, DELTA];

function orderOf(rows: ReturnType<typeof calculateStandings>): string[] {
  return rows.map((row) => row.teamId);
}

describe('tie break between two teams (ART. 16)', () => {
  it('prefers fewer goals conceded over a better goal difference', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      game('alfa', [6, 3], 'gama'),
      game('beta', [2, 0], 'delta'),
    ]);

    expect(orderOf(rows)).toEqual(['beta', 'alfa', 'delta', 'gama']);
  });

  it('prefers more goals scored when the goals conceded are equal', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      game('beta', [1, 0], 'delta'),
      game('alfa', [3, 0], 'gama'),
    ]);

    expect(orderOf(rows).slice(0, 2)).toEqual(['alfa', 'beta']);
  });

  it('prefers the head-to-head winner when goals conceded and scored are equal', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      game('beta', [2, 1], 'alfa'),
      game('alfa', [2, 1], 'delta'),
      game('gama', [2, 1], 'beta'),
      game('gama', [0, 0], 'delta'),
    ]);

    expect(orderOf(rows)).toEqual(['gama', 'beta', 'alfa', 'delta']);
  });

  it('keeps the team that played all its matches ahead of one that missed one (ART. 15)', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      game('beta', [5, 0], 'delta'),
      walkover('beta', 'gama', 'gama'),
      game('alfa', [1, 0], 'delta'),
      game('gama', [2, 1], 'alfa'),
    ]);

    expect(orderOf(rows)).toEqual(['gama', 'alfa', 'beta', 'delta']);
  });

  it('counts a double walkover as a missed match for both teams', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      doubleWalkover('alfa', 'beta'),
      game('alfa', [1, 0], 'gama'),
      game('delta', [0, 1], 'beta'),
    ]);

    expect(rows.map((row) => row.walkoverLosses)).toEqual([1, 1, 0, 0]);
  });
});

describe('tie break among three or more teams (ART. 16)', () => {
  it('ranks by fewer goals conceded, then restarts with the pair rules', () => {
    const rows = calculateStandings(
      [ALFA, BETA, GAMA],
      [game('alfa', [3, 0], 'beta'), game('beta', [1, 0], 'gama'), game('gama', [1, 0], 'alfa')],
    );

    expect(orderOf(rows)).toEqual(['alfa', 'gama', 'beta']);
  });

  it('ranks by goal difference among the tied teams only', () => {
    const rows = calculateStandings(FOUR_TEAMS, [
      game('alfa', [2, 0], 'beta'),
      game('beta', [1, 0], 'gama'),
      game('gama', [1, 0], 'alfa'),
      game('delta', [2, 0], 'alfa'),
      game('delta', [1, 0], 'beta'),
      game('delta', [2, 0], 'gama'),
    ]);

    expect(orderOf(rows)).toEqual(['delta', 'alfa', 'gama', 'beta']);
  });

  it('falls back to the team name while the draw is not recorded', () => {
    const rows = calculateStandings(
      [GAMA, BETA, ALFA],
      [game('alfa', [1, 0], 'beta'), game('beta', [1, 0], 'gama'), game('gama', [1, 0], 'alfa')],
    );

    expect(orderOf(rows)).toEqual(['alfa', 'beta', 'gama']);
  });
});

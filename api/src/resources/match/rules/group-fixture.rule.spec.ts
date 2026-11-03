import { buildRoundRobin, suggestMissingFixtures } from './group-fixture.rule';

function teamsOf(count: number): string[] {
  return Array.from({ length: count }, (_, index) => String.fromCharCode(97 + index));
}

function pairKeys(fixtures: { teamAId: string; teamBId: string }[]): string[] {
  return fixtures.map(({ teamAId, teamBId }) =>
    [teamAId, teamBId].sort((a, b) => a.localeCompare(b)).join(''),
  );
}

describe('buildRoundRobin', () => {
  it.each([
    [2, 1],
    [3, 3],
    [4, 6],
    [5, 10],
    [6, 15],
  ])('pairs %i teams in %i matches, each pair exactly once', (count, matches) => {
    const keys = pairKeys(buildRoundRobin(teamsOf(count)));

    expect(keys).toHaveLength(matches);
    expect(new Set(keys).size).toBe(matches);
  });

  it('never makes a team play twice in the same round', () => {
    const playersByRound = new Map<number, string[]>();
    buildRoundRobin(teamsOf(6)).forEach(({ round, teamAId, teamBId }) => {
      playersByRound.set(round, [...(playersByRound.get(round) ?? []), teamAId, teamBId]);
    });

    playersByRound.forEach((players) => {
      expect(new Set(players).size).toBe(players.length);
    });
    expect(playersByRound.size).toBe(5);
  });

  it('gives one match per round when the number of teams is odd', () => {
    expect(buildRoundRobin(teamsOf(3)).map(({ round }) => round)).toEqual([1, 2, 3]);
  });

  it('suggests nothing for a group with fewer than two teams', () => {
    expect(buildRoundRobin(teamsOf(1))).toEqual([]);
    expect(buildRoundRobin([])).toEqual([]);
  });
});

describe('suggestMissingFixtures', () => {
  it('skips the pairs that already have a match, whichever side they were on', () => {
    const suggestions = suggestMissingFixtures(teamsOf(3), [['b', 'a']]);

    expect(pairKeys(suggestions).sort((a, b) => a.localeCompare(b))).toEqual(['ac', 'bc']);
  });

  it('suggests nothing when every pair already has a match', () => {
    expect(suggestMissingFixtures(teamsOf(2), [['a', 'b']])).toEqual([]);
  });
});

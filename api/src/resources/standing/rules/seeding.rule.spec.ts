import { seedQualifiedTeams, type SeedingGroup, type SeedingRow } from './seeding.rule';

function row(teamName: string, overrides: Partial<SeedingRow>): SeedingRow {
  return {
    teamId: teamName.toLowerCase(),
    teamName,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    qualifiedPosition: null,
    ...overrides,
  };
}

function group(groupName: string, rows: SeedingRow[]): SeedingGroup {
  return { groupId: groupName.toLowerCase(), groupName, rows };
}

function namesOf(groups: SeedingGroup[]): string[] {
  return seedQualifiedTeams(groups).map((team) => team.teamName);
}

describe('seedQualifiedTeams', () => {
  it('leaves out the teams the staff did not confirm', () => {
    const seeded = seedQualifiedTeams([
      group('Grupo A', [row('Alfa', { qualifiedPosition: 1 }), row('Beta', {})]),
    ]);

    expect(seeded).toEqual([
      {
        seed: 1,
        teamId: 'alfa',
        teamName: 'Alfa',
        groupId: 'grupo a',
        groupName: 'Grupo A',
        qualifiedPosition: 1,
      },
    ]);
  });

  it('ranks every group winner before every runner-up', () => {
    const groups = [
      group('Grupo A', [
        row('Alfa', { qualifiedPosition: 1, points: 3 }),
        row('Beta', { qualifiedPosition: 2, points: 9 }),
      ]),
      group('Grupo B', [row('Gama', { qualifiedPosition: 1, points: 1 })]),
    ];

    expect(namesOf(groups)).toEqual(['Alfa', 'Gama', 'Beta']);
  });

  it('compares teams of the same position by points, goals conceded and goals scored', () => {
    const groups = [
      group('Grupo A', [row('Alfa', { qualifiedPosition: 2, points: 4, goalsAgainst: 5 })]),
      group('Grupo B', [row('Beta', { qualifiedPosition: 2, points: 6, goalsAgainst: 9 })]),
      group('Grupo C', [row('Gama', { qualifiedPosition: 2, points: 4, goalsAgainst: 3 })]),
      group('Grupo D', [
        row('Delta', { qualifiedPosition: 2, points: 4, goalsAgainst: 3, goalsFor: 7 }),
      ]),
    ];

    expect(namesOf(groups)).toEqual(['Beta', 'Delta', 'Gama', 'Alfa']);
  });

  it('numbers the seeds from 1 in ranking order', () => {
    const seeded = seedQualifiedTeams([
      group('Grupo A', [
        row('Alfa', { qualifiedPosition: 1 }),
        row('Beta', { qualifiedPosition: 2 }),
        row('Gama', { qualifiedPosition: 3 }),
      ]),
    ]);

    expect(seeded.map((team) => team.seed)).toEqual([1, 2, 3]);
  });

  it('seeds a single group in the confirmed order', () => {
    const groups = [
      group('Grupo único', [
        row('Alfa', { qualifiedPosition: 2, points: 9 }),
        row('Beta', { qualifiedPosition: 1, points: 3 }),
      ]),
    ];

    expect(namesOf(groups)).toEqual(['Beta', 'Alfa']);
  });

  it('answers with an empty list when nothing was confirmed', () => {
    expect(seedQualifiedTeams([group('Grupo A', [row('Alfa', {})])])).toEqual([]);
  });
});

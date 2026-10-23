export interface SeedingRow {
  teamId: string;
  teamName: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  qualifiedPosition: number | null;
}

export interface SeedingGroup {
  groupId: string;
  groupName: string;
  rows: SeedingRow[];
}

export interface SeededTeam {
  seed: number;
  teamId: string;
  teamName: string;
  groupId: string;
  groupName: string;
  qualifiedPosition: number;
}

interface Candidate {
  row: SeedingRow;
  group: SeedingGroup;
  qualifiedPosition: number;
}

function toCandidates(group: SeedingGroup): Candidate[] {
  return group.rows.flatMap((row) =>
    row.qualifiedPosition === null
      ? []
      : [{ row, group, qualifiedPosition: row.qualifiedPosition }],
  );
}

function compareCandidates(first: Candidate, second: Candidate): number {
  return (
    first.qualifiedPosition - second.qualifiedPosition ||
    second.row.points - first.row.points ||
    first.row.goalsAgainst - second.row.goalsAgainst ||
    second.row.goalsFor - first.row.goalsFor ||
    first.row.teamName.localeCompare(second.row.teamName, 'pt-BR')
  );
}

function toSeededTeam(candidate: Candidate, index: number): SeededTeam {
  return {
    seed: index + 1,
    teamId: candidate.row.teamId,
    teamName: candidate.row.teamName,
    groupId: candidate.group.groupId,
    groupName: candidate.group.groupName,
    qualifiedPosition: candidate.qualifiedPosition,
  };
}

export function seedQualifiedTeams(groups: SeedingGroup[]): SeededTeam[] {
  return groups.flatMap(toCandidates).sort(compareCandidates).map(toSeededTeam);
}

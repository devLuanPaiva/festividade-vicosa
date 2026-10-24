import type { Team } from '@/features/games/types';
import type { MatchGroup } from '../types';

export interface RosterSection {
  key: string;
  title: string;
  teams: Team[];
}

const UNGROUPED_KEY = 'ungrouped';

export function buildRosterSections(groups: MatchGroup[], teams: Team[]): RosterSection[] {
  const sections = groups.map((group) => ({
    key: group.id,
    title: group.name,
    teams: teams.filter((team) => team.groupId === group.id),
  }));
  const knownGroupIds = new Set(groups.map((group) => group.id));
  const ungrouped = teams.filter(
    (team) => team.groupId === null || !knownGroupIds.has(team.groupId),
  );
  return ungrouped.length > 0
    ? [...sections, { key: UNGROUPED_KEY, title: 'Sem grupo', teams: ungrouped }]
    : sections;
}

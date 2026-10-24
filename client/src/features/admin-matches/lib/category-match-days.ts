import type { MatchGroup } from '@/features/admin-teams/types';
import { formatDayHeading, formatMatchTime, toDayKey } from '@/features/games/lib/match-dates';
import { stageLabel } from '@/features/games/lib/match-labels';
import type { Match, Team } from '@/features/games/types';
import { resultSummary } from './admin-match-labels';

const REMOVED_TEAM_NAME = 'Time removido';

export interface CategoryMatchRow {
  id: string;
  teams: string;
  stage: string;
  time: string;
  scheduledAt: string;
  summary: string;
  isFinalized: boolean;
}

export interface CategoryMatchDay {
  key: string;
  heading: string;
  rows: CategoryMatchRow[];
}

function toRow(
  match: Match,
  teamNames: Map<string, string>,
  groups: MatchGroup[],
): CategoryMatchRow {
  const groupName = groups.find((group) => group.id === match.groupId)?.name;
  const teamA = teamNames.get(match.teamAId) ?? REMOVED_TEAM_NAME;
  const teamB = teamNames.get(match.teamBId) ?? REMOVED_TEAM_NAME;
  return {
    id: match.id,
    teams: `${teamA} x ${teamB}`,
    stage: stageLabel(match, groupName),
    time: formatMatchTime(match.scheduledAt),
    scheduledAt: match.scheduledAt,
    summary: resultSummary(match),
    isFinalized: match.status === 'FINALIZED',
  };
}

export function buildCategoryMatchDays(
  matches: Match[],
  teams: Team[],
  groups: MatchGroup[],
): CategoryMatchDay[] {
  const teamNames = new Map(teams.map((team) => [team.id, team.name]));
  const days = new Map<string, CategoryMatchDay>();
  for (const match of matches) {
    const key = toDayKey(match.scheduledAt);
    const day = days.get(key) ?? { key, heading: formatDayHeading(match.scheduledAt), rows: [] };
    day.rows.push(toRow(match, teamNames, groups));
    days.set(key, day);
  }
  return [...days.values()];
}

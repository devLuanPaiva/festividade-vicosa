import {
  formatDayMonth,
  formatMatchTime,
  formatShortWeekday,
} from '@/features/games/lib/match-dates';
import { categoryLabel, stageLabel } from '@/features/games/lib/match-labels';
import type { MatchListItem } from '@/features/games/types';
import { resultSummary } from './admin-match-labels';

export type RowStatus = 'finalized' | 'overdue' | 'scheduled';

export interface MatchListRow {
  id: string;
  categoryId: string;
  teamA: string;
  teamB: string;
  category: string;
  stage: string;
  when: string;
  location: string;
  status: RowStatus;
  statusLabel: string;
  result: string | null;
}

const STATUS_LABELS: Record<RowStatus, string> = {
  finalized: 'Finalizada',
  overdue: 'Sem resultado',
  scheduled: 'Agendada',
};

const NO_LOCATION_LABEL = 'A definir';

function toRowStatus(match: MatchListItem, now: Date): RowStatus {
  if (match.status === 'FINALIZED') {
    return 'finalized';
  }
  return new Date(match.scheduledAt) < now ? 'overdue' : 'scheduled';
}

export function formatWhen(scheduledAt: string): string {
  const weekday = formatShortWeekday(scheduledAt);
  return `${weekday} ${formatDayMonth(scheduledAt)} · ${formatMatchTime(scheduledAt)}`;
}

export function toMatchListRow(match: MatchListItem, now: Date): MatchListRow {
  const status = toRowStatus(match, now);
  return {
    id: match.id,
    categoryId: match.categoryId,
    teamA: match.teamA.name,
    teamB: match.teamB.name,
    category: categoryLabel(match.category),
    stage: stageLabel(match),
    when: formatWhen(match.scheduledAt),
    location: match.location ?? NO_LOCATION_LABEL,
    status,
    statusLabel: STATUS_LABELS[status],
    result: status === 'finalized' ? resultSummary(match) : null,
  };
}

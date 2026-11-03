import type { StatusCounts, StatusFilter } from './match-list-query';

export interface SituationCounts {
  total: number;
  today: number;
  overdue: number;
  scheduled: number;
  finalized: number;
}

export interface MatchScopeFilters {
  search: string;
  categoryId: string;
  stage: string;
  day: string;
}

export type MatchScopeParams = Record<string, string>;

const SITUATIONS: Record<StatusFilter, string> = {
  todas: '',
  hoje: 'today',
  atrasadas: 'overdue',
  agendadas: 'scheduled',
  finalizadas: 'finalized',
};

const STAGES: Record<string, string> = { grupos: 'GROUP', 'mata-mata': 'KNOCKOUT' };

function withoutEmpty(params: MatchScopeParams): MatchScopeParams {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''));
}

export function buildScopeParams(filters: MatchScopeFilters, subEventId = ''): MatchScopeParams {
  return withoutEmpty({
    subEventId,
    search: filters.search,
    categoryId: filters.categoryId,
    stage: STAGES[filters.stage] ?? '',
    day: filters.day,
  });
}

export function situationParam(status: StatusFilter): string {
  return SITUATIONS[status];
}

export function toStatusCounts(counts: SituationCounts): StatusCounts {
  return {
    todas: counts.total,
    hoje: counts.today,
    atrasadas: counts.overdue,
    agendadas: counts.scheduled,
    finalizadas: counts.finalized,
  };
}

export function toQueryString(params: MatchScopeParams): string {
  return new URLSearchParams(withoutEmpty(params)).toString();
}

import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';

export type StatusFilter = 'todas' | 'hoje' | 'atrasadas' | 'agendadas' | 'finalizadas';
export type StageFilter = 'todas' | 'grupos' | 'mata-mata';
export type ViewMode = 'auto' | 'tabela' | 'cards';
export type SortOrder = 'asc' | 'desc';

export interface MatchListQuery {
  search: string;
  status: StatusFilter;
  categoryId: string;
  stage: StageFilter;
  day: string;
  view: ViewMode;
  order: SortOrder;
  page: number;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const DEFAULT_MATCH_LIST_QUERY: MatchListQuery = {
  search: '',
  status: 'todas',
  categoryId: '',
  stage: 'todas',
  day: '',
  view: 'auto',
  order: 'asc',
  page: 1,
};

const STATUSES: StatusFilter[] = ['todas', 'hoje', 'atrasadas', 'agendadas', 'finalizadas'];
const STAGES: StageFilter[] = ['todas', 'grupos', 'mata-mata'];
const VIEWS: ViewMode[] = ['auto', 'tabela', 'cards'];
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_SEARCH_LENGTH = 80;

function readFirst(raw: RawSearchParams, name: string): string {
  const value = raw[name];
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

function pick<T extends string>(options: T[], value: string, fallback: T): T {
  return options.find((option) => option === value) ?? fallback;
}

function parsePage(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

export function parseMatchListQuery(raw: RawSearchParams): MatchListQuery {
  const day = readFirst(raw, 'dia');
  return {
    search: readFirst(raw, 'q').trim().slice(0, MAX_SEARCH_LENGTH),
    status: pick(STATUSES, readFirst(raw, 'situacao'), 'todas'),
    categoryId: readFirst(raw, 'categoria'),
    stage: pick(STAGES, readFirst(raw, 'fase'), 'todas'),
    day: DAY_PATTERN.test(day) ? day : '',
    view: pick(VIEWS, readFirst(raw, 'visao'), 'auto'),
    order: readFirst(raw, 'ordem') === 'desc' ? 'desc' : 'asc',
    page: parsePage(readFirst(raw, 'pagina')),
  };
}

const PARAM_NAMES: Record<keyof MatchListQuery, string> = {
  search: 'q',
  status: 'situacao',
  categoryId: 'categoria',
  stage: 'fase',
  day: 'dia',
  view: 'visao',
  order: 'ordem',
  page: 'pagina',
};

export function buildMatchListHref(
  query: MatchListQuery,
  changes: Partial<MatchListQuery> = {},
): string {
  const next: MatchListQuery = { ...query, page: 1, ...changes };
  const params = new URLSearchParams();
  for (const key of Object.keys(PARAM_NAMES) as (keyof MatchListQuery)[]) {
    if (next[key] !== DEFAULT_MATCH_LIST_QUERY[key]) {
      params.set(PARAM_NAMES[key], String(next[key]));
    }
  }
  const queryString = params.toString();
  return queryString ? `${ADMIN_MATCHES_PATH}?${queryString}` : ADMIN_MATCHES_PATH;
}

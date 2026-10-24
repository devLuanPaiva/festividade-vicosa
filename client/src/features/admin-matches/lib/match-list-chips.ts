import type { ModalityCategories } from '@/features/admin-teams/types';
import { findCategoryLabel, type DayOption } from './match-list-options';
import type { MatchListQuery } from './match-list-query';

export interface ActiveFilter {
  key: keyof MatchListQuery;
  label: string;
}

interface FilterOptions {
  modalities: ModalityCategories[];
  days: DayOption[];
}

type FilterBuilder = (query: MatchListQuery, options: FilterOptions) => ActiveFilter | null;

const STAGE_LABELS: Record<string, string> = {
  grupos: 'Fase de grupos',
  'mata-mata': 'Mata-mata',
};

const UNKNOWN_CATEGORY_LABEL = 'Desconhecida';

const searchFilter: FilterBuilder = (query) =>
  query.search ? { key: 'search', label: `Busca: ${query.search}` } : null;

const categoryFilter: FilterBuilder = (query, { modalities }) => {
  if (!query.categoryId) {
    return null;
  }
  const label = findCategoryLabel(modalities, query.categoryId) || UNKNOWN_CATEGORY_LABEL;
  return { key: 'categoryId', label: `Categoria: ${label}` };
};

const stageFilter: FilterBuilder = (query) =>
  query.stage === 'todas' ? null : { key: 'stage', label: `Fase: ${STAGE_LABELS[query.stage]}` };

const dayFilter: FilterBuilder = (query, { days }) => {
  if (!query.day) {
    return null;
  }
  const label = days.find((day) => day.value === query.day)?.label ?? query.day;
  return { key: 'day', label: `Dia: ${label}` };
};

const FILTER_BUILDERS: FilterBuilder[] = [searchFilter, categoryFilter, stageFilter, dayFilter];

export function buildActiveFilters(
  query: MatchListQuery,
  modalities: ModalityCategories[],
  days: DayOption[],
): ActiveFilter[] {
  return FILTER_BUILDERS.map((build) => build(query, { modalities, days })).filter(
    (filter): filter is ActiveFilter => filter !== null,
  );
}

import { buildDayOptions, type DayOption } from '@/features/admin-matches/lib/match-list-options';
import {
  DEFAULT_MATCH_LIST_QUERY,
  parseMatchListQuery,
  type RawSearchParams,
  type StatusFilter,
} from '@/features/admin-matches/lib/match-list-query';
import { groupMatchesByDay, type MatchDay } from '@/features/games/lib/group-matches-by-day';
import { categoryLabel } from '@/features/games/lib/match-labels';
import type { Category, MatchListItem } from '@/features/games/types';
import type { Page } from '@/lib/pagination/paginate';

export interface GalleryMatchQuery {
  categoryId: string;
  day: string;
  search: string;
  status: StatusFilter;
  page: number;
  pageSize: number;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface GalleryMatchView {
  query: GalleryMatchQuery;
  categories: CategoryOption[];
  days: DayOption[];
  groups: MatchDay[];
  total: number;
  page: number;
  totalPages: number;
}

interface GalleryMatchViewInput {
  query: GalleryMatchQuery;
  page: Page<MatchListItem>;
  categories: Category[];
  days: string[];
}

export function parseGalleryMatchQuery(raw: RawSearchParams): GalleryMatchQuery {
  const { categoryId, day, search, status, page, pageSize } = parseMatchListQuery(raw);
  return { categoryId, day, search, status, page, pageSize };
}

function buildCategoryOptions(categories: Category[]): CategoryOption[] {
  return categories
    .map((category) => ({ value: category.id, label: categoryLabel(category) }))
    .sort((first, second) => first.label.localeCompare(second.label));
}

export function buildGalleryMatchView(input: GalleryMatchViewInput): GalleryMatchView {
  const { query, page, categories, days } = input;
  return {
    query,
    categories: buildCategoryOptions(categories),
    days: buildDayOptions(days),
    groups: groupMatchesByDay(page.items),
    total: page.total,
    page: page.page,
    totalPages: page.totalPages,
  };
}

export function hasActiveMatchFilter(query: GalleryMatchQuery): boolean {
  return (
    query.categoryId !== '' ||
    query.day !== '' ||
    query.search !== '' ||
    query.status !== DEFAULT_MATCH_LIST_QUERY.status
  );
}

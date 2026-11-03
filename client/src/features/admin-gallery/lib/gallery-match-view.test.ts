import { describe, expect, it } from 'vitest';
import type { Category, MatchListItem } from '@/features/games/types';
import { buildGalleryMatchesHref } from './gallery-match-href';
import { buildGalleryMatchView, hasActiveMatchFilter } from './gallery-match-view';

const NO_FILTER = {
  categoryId: '',
  day: '',
  search: '',
  status: 'todas',
  page: 1,
  pageSize: 25,
} as const;

function match(id: string, scheduledAt: string): MatchListItem {
  return { id, scheduledAt } as MatchListItem;
}

function category(id: string, name: string): Category {
  return { id, name, gender: 'MALE', ageRange: null } as Category;
}

const PAGE = {
  items: [
    match('m1', '2026-12-09T12:00:00-03:00'),
    match('m2', '2026-12-09T15:00:00-03:00'),
    match('m3', '2026-12-10T09:00:00-03:00'),
  ],
  page: 2,
  totalPages: 4,
  total: 80,
};

describe('buildGalleryMatchView', () => {
  it('groups the matches of the page by day, keeping the page and total of the search', () => {
    const view = buildGalleryMatchView({
      query: NO_FILTER,
      page: PAGE,
      categories: [],
      days: [],
    });

    expect(view.groups.map((group) => group.matches.map((item) => item.id))).toEqual([
      ['m1', 'm2'],
      ['m3'],
    ]);
    expect(view).toMatchObject({ page: 2, totalPages: 4, total: 80 });
  });

  it('offers the categories in alphabetical order and the days the API sent', () => {
    const view = buildGalleryMatchView({
      query: NO_FILTER,
      page: PAGE,
      categories: [category('b', 'Sub-15'), category('a', 'Adulto')],
      days: ['2026-12-09', '2026-12-10'],
    });

    expect(view.categories.map((option) => option.value)).toEqual(['a', 'b']);
    expect(view.days.map((option) => option.value)).toEqual(['2026-12-09', '2026-12-10']);
  });
});

describe('hasActiveMatchFilter', () => {
  it('is true for any filter and false for the plain list', () => {
    expect(hasActiveMatchFilter(NO_FILTER)).toBe(false);
    expect(hasActiveMatchFilter({ ...NO_FILTER, status: 'hoje' })).toBe(true);
    expect(hasActiveMatchFilter({ ...NO_FILTER, search: 'x' })).toBe(true);
  });
});

describe('buildGalleryMatchesHref', () => {
  it('writes only the filters that are in use', () => {
    expect(buildGalleryMatchesHref('sub-1', { ...NO_FILTER, categoryId: 'adulto' })).toBe(
      '/admin/galeria/sub-1/partidas?categoria=adulto',
    );
    expect(buildGalleryMatchesHref('sub-1', NO_FILTER)).toBe('/admin/galeria/sub-1/partidas');
  });

  it('keeps the page and the page size in the address', () => {
    expect(buildGalleryMatchesHref('sub-1', { ...NO_FILTER, page: 3, pageSize: 50 })).toBe(
      '/admin/galeria/sub-1/partidas?pagina=3&itens=50',
    );
  });
});

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MATCH_LIST_QUERY,
  buildMatchListHref,
  parseMatchListQuery,
} from './match-list-query';

describe('parseMatchListQuery', () => {
  it('falls back to the defaults when the address has nothing', () => {
    expect(parseMatchListQuery({})).toEqual(DEFAULT_MATCH_LIST_QUERY);
  });

  it('reads every filter from the address', () => {
    const query = parseMatchListQuery({
      q: ' Santa Luzia ',
      situacao: 'atrasadas',
      categoria: 'abc',
      fase: 'mata-mata',
      dia: '2026-12-04',
      visao: 'cards',
      ordem: 'desc',
      pagina: '3',
    });

    expect(query).toEqual({
      search: 'Santa Luzia',
      status: 'atrasadas',
      categoryId: 'abc',
      stage: 'mata-mata',
      day: '2026-12-04',
      view: 'cards',
      order: 'desc',
      page: 3,
    });
  });

  it.each([
    {
      name: 'an unknown status',
      raw: { situacao: 'qualquer' },
      field: 'status',
      expected: 'todas',
    },
    { name: 'an unknown stage', raw: { fase: 'x' }, field: 'stage', expected: 'todas' },
    { name: 'a badly written day', raw: { dia: '04/12/2026' }, field: 'day', expected: '' },
    { name: 'an unknown view', raw: { visao: 'grade' }, field: 'view', expected: 'auto' },
    { name: 'a page of zero', raw: { pagina: '0' }, field: 'page', expected: 1 },
    { name: 'a page that is not a number', raw: { pagina: 'abc' }, field: 'page', expected: 1 },
  ])('ignores $name', ({ raw, field, expected }) => {
    expect(parseMatchListQuery(raw)[field as keyof typeof DEFAULT_MATCH_LIST_QUERY]).toBe(expected);
  });

  it('takes the first value when the same parameter comes twice and caps a huge search', () => {
    expect(parseMatchListQuery({ situacao: ['hoje', 'atrasadas'] }).status).toBe('hoje');
    expect(parseMatchListQuery({ q: 'a'.repeat(500) }).search).toHaveLength(80);
  });
});

describe('buildMatchListHref', () => {
  it('goes to the plain list when everything is at its default', () => {
    expect(buildMatchListHref(DEFAULT_MATCH_LIST_QUERY)).toBe('/admin/partidas');
  });

  it('keeps the other filters and goes back to the first page when one filter changes', () => {
    const query = { ...DEFAULT_MATCH_LIST_QUERY, status: 'hoje' as const, page: 4 };

    expect(buildMatchListHref(query, { categoryId: 'abc' })).toBe(
      '/admin/partidas?situacao=hoje&categoria=abc',
    );
  });

  it('keeps the page when the change is the page itself', () => {
    expect(buildMatchListHref(DEFAULT_MATCH_LIST_QUERY, { page: 2 })).toBe(
      '/admin/partidas?pagina=2',
    );
  });

  it('drops a filter that is put back to its default', () => {
    const query = { ...DEFAULT_MATCH_LIST_QUERY, categoryId: 'abc' };

    expect(buildMatchListHref(query, { categoryId: '' })).toBe('/admin/partidas');
  });
});

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_USER_LIST_QUERY,
  buildUserListHref,
  parseUserListQuery,
  toUserApiParams,
} from './user-list-query';

describe('parseUserListQuery', () => {
  it('falls back to the defaults for anything unknown or malformed', () => {
    expect(parseUserListQuery({ situacao: 'qualquer', pagina: '-3', itens: '7', q: '  ' })).toEqual(
      DEFAULT_USER_LIST_QUERY,
    );
  });

  it('reads every filter that is valid', () => {
    expect(
      parseUserListQuery({
        q: ' ana ',
        situacao: 'inativos',
        grupo: 'g-1',
        pagina: '2',
        itens: '50',
      }),
    ).toEqual({ search: 'ana', status: 'inativos', roleId: 'g-1', page: 2, pageSize: 50 });
  });
});

describe('buildUserListHref', () => {
  it('writes only what differs from the defaults', () => {
    expect(buildUserListHref(DEFAULT_USER_LIST_QUERY)).toBe('/admin/usuarios');
    expect(buildUserListHref(DEFAULT_USER_LIST_QUERY, { status: 'ativos', page: 3 })).toBe(
      '/admin/usuarios?situacao=ativos&pagina=3',
    );
  });

  it('goes back to the first page whenever a filter changes', () => {
    const query = { ...DEFAULT_USER_LIST_QUERY, page: 4 };

    expect(buildUserListHref(query, { roleId: 'g-1' })).toBe('/admin/usuarios?grupo=g-1');
  });
});

describe('toUserApiParams', () => {
  it('turns the page into offset and limit and drops the empty filters', () => {
    const params = toUserApiParams({ ...DEFAULT_USER_LIST_QUERY, page: 3, pageSize: 10 });

    expect(params.toString()).toBe('offset=20&limit=10');
  });

  it('maps the status to the active filter of the api', () => {
    const query = { ...DEFAULT_USER_LIST_QUERY, status: 'inativos' as const, search: 'ana' };

    expect(toUserApiParams(query).get('active')).toBe('false');
    expect(toUserApiParams(query).get('search')).toBe('ana');
  });
});

import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { DEFAULT_PAGE_SIZE, parsePageNumber, parsePageSize } from '@/lib/pagination/page-size';

export type UserStatusFilter = 'todos' | 'ativos' | 'inativos';

export interface UserListQuery {
  search: string;
  status: UserStatusFilter;
  roleId: string;
  page: number;
  pageSize: number;
}

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const DEFAULT_USER_LIST_QUERY: UserListQuery = {
  search: '',
  status: 'todos',
  roleId: '',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const STATUS_FILTERS: UserStatusFilter[] = ['todos', 'ativos', 'inativos'];
const MAX_SEARCH_LENGTH = 80;

const PARAM_NAMES: Record<keyof UserListQuery, string> = {
  search: 'q',
  status: 'situacao',
  roleId: 'grupo',
  page: 'pagina',
  pageSize: 'itens',
};

function readFirst(raw: RawSearchParams, name: string): string {
  const value = raw[name];
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

export function parseUserListQuery(raw: RawSearchParams): UserListQuery {
  const status = readFirst(raw, 'situacao');
  return {
    search: readFirst(raw, 'q').trim().slice(0, MAX_SEARCH_LENGTH),
    status: STATUS_FILTERS.find((filter) => filter === status) ?? 'todos',
    roleId: readFirst(raw, 'grupo'),
    page: parsePageNumber(readFirst(raw, 'pagina')),
    pageSize: parsePageSize(readFirst(raw, 'itens')),
  };
}

export function buildUserListHref(
  query: UserListQuery,
  changes: Partial<UserListQuery> = {},
): string {
  const next: UserListQuery = { ...query, page: 1, ...changes };
  const params = new URLSearchParams();
  for (const key of Object.keys(PARAM_NAMES) as (keyof UserListQuery)[]) {
    if (next[key] !== DEFAULT_USER_LIST_QUERY[key]) {
      params.set(PARAM_NAMES[key], String(next[key]));
    }
  }
  const queryString = params.toString();
  return queryString ? `${ADMIN_USERS_PATH}?${queryString}` : ADMIN_USERS_PATH;
}

const ACTIVE_BY_STATUS: Record<UserStatusFilter, string> = {
  todos: '',
  ativos: 'true',
  inativos: 'false',
};

export function toUserApiParams(query: UserListQuery): URLSearchParams {
  const params = new URLSearchParams({
    offset: String((query.page - 1) * query.pageSize),
    limit: String(query.pageSize),
  });
  const filters = {
    search: query.search,
    roleId: query.roleId,
    active: ACTIVE_BY_STATUS[query.status],
  };
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      params.set(name, value);
    }
  }
  return params;
}

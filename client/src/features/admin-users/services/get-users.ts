import { fetchApiCountedPage, fetchApiResult } from '@/lib/api/server-fetch';
import { buildPage, lastPageOf, type Page } from '@/lib/pagination/paginate';
import { toUserApiParams, type UserListQuery } from '../lib/user-list-query';
import type { AdminUser, UserPermissions } from '../types';

function pagePath(query: UserListQuery, page: number): string {
  return `/users?${toUserApiParams({ ...query, page }).toString()}`;
}

export async function getUsersPage(query: UserListQuery, token: string): Promise<Page<AdminUser>> {
  const first = await fetchApiCountedPage<AdminUser>(pagePath(query, query.page), token);
  const lastPage = lastPageOf(first.count, query.pageSize);
  const result =
    query.page <= lastPage
      ? first
      : await fetchApiCountedPage<AdminUser>(pagePath(query, lastPage), token);
  return buildPage({
    items: result.items,
    total: result.count,
    page: Math.min(query.page, lastPage),
    pageSize: query.pageSize,
  });
}

export function getUser(userId: string, token: string): Promise<AdminUser> {
  return fetchApiResult<AdminUser>(`/users/${encodeURIComponent(userId)}`, token);
}

export function getUserPermissions(userId: string, token: string): Promise<UserPermissions> {
  return fetchApiResult<UserPermissions>(`/users/${encodeURIComponent(userId)}/permissions`, token);
}

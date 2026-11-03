import { fetchApiPage, fetchApiResult } from '@/lib/api/server-fetch';
import type { AdminRole, PermissionDescription } from '../types';

export function getRoles(token: string): Promise<AdminRole[]> {
  return fetchApiPage<AdminRole>('/roles?limit=100', token);
}

export function getRole(roleId: string, token: string): Promise<AdminRole> {
  return fetchApiResult<AdminRole>(`/roles/${encodeURIComponent(roleId)}`, token);
}

export function getPermissionCatalog(token: string): Promise<PermissionDescription[]> {
  return fetchApiPage<PermissionDescription>('/permissions?limit=100', token);
}

import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';

export const NEW_USER_PATH = `${ADMIN_USERS_PATH}/novo`;
export const ROLES_PATH = `${ADMIN_USERS_PATH}/grupos`;
export const NEW_ROLE_PATH = `${ROLES_PATH}/novo`;
export const PERMISSIONS_PATH = `${ADMIN_USERS_PATH}/permissoes`;

export function userPath(userId: string): string {
  return `${ADMIN_USERS_PATH}/${userId}`;
}

export function rolePath(roleId: string): string {
  return `${ROLES_PATH}/${roleId}`;
}

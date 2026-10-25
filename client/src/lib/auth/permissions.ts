export type Permission =
  | 'match:record-score'
  | 'match:create'
  | 'team:manage'
  | 'user:manage'
  | 'photo:upload'
  | 'photo:delete';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export function hasPermission(user: AuthenticatedUser, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

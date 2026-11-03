import { requireCurrentUser, requireSessionToken } from '@/lib/auth/current-user';
import { hasPermission, type AuthenticatedUser } from '@/lib/auth/permissions';

export interface UserManagerAccess {
  user: AuthenticatedUser;
  token: string;
  canManagePermissions: boolean;
}

export async function findUserManagerAccess(): Promise<UserManagerAccess | null> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'user:manage')) {
    return null;
  }
  return {
    user,
    token: await requireSessionToken(),
    canManagePermissions: hasPermission(user, 'user:manage-permissions'),
  };
}

import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { parseUserListQuery, type RawSearchParams } from '../../lib/user-list-query';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getRoles } from '../../services/get-roles';
import { getUsersPage } from '../../services/get-users';
import { UserListView } from './UserListView';

interface UserListLoaderProps {
  searchParams: Promise<RawSearchParams>;
}

export async function UserListLoader({ searchParams }: UserListLoaderProps): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const query = parseUserListQuery(await searchParams);
  const [page, roles] = await Promise.all([
    getUsersPage(query, access.token),
    getRoles(access.token),
  ]);
  return <UserListView query={query} page={page} roles={roles} currentUserId={access.user.id} />;
}

import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { orNotFound } from '@/lib/api/missing-resource';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getPermissionCatalog, getRoles } from '../../services/get-roles';
import { getUser, getUserPermissions } from '../../services/get-users';
import { UserStatusBadge } from '../UserBadges';
import { UserProfileForm } from '../form/UserProfileForm';
import { DeleteUserSection } from './DeleteUserSection';
import { UserAccessSections } from './UserAccessSections';
import { UserStatusSection } from './UserStatusSection';

interface UserDetailLoaderProps {
  params: Promise<{ userId: string }>;
}

export async function UserDetailLoader({
  params,
}: Readonly<UserDetailLoaderProps>): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const { userId } = await params;
  const { token } = access;
  const [user, userPermissions, roles, catalog] = await orNotFound(
    Promise.all([
      getUser(userId, token),
      getUserPermissions(userId, token),
      getRoles(token),
      getPermissionCatalog(token),
    ]),
  );
  const isSelf = user.id === access.user.id;
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href={ADMIN_USERS_PATH}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700"
        >
          ← Voltar aos usuários
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <UserStatusBadge active={user.active} />
        </div>
        <p className="text-sm text-admin-muted">{user.email}</p>
      </header>
      <section aria-labelledby="profile-title" className="flex flex-col gap-4">
        <h2 id="profile-title" className="text-lg font-bold">
          Dados
        </h2>
        <UserProfileForm user={user} />
      </section>
      <UserAccessSections
        user={user}
        roles={roles}
        catalog={catalog}
        overrides={userPermissions.overrides}
        canEdit={access.canManagePermissions && !isSelf}
        isSelf={isSelf}
      />
      <UserStatusSection user={user} isSelf={isSelf} />
      {isSelf ? null : <DeleteUserSection userId={user.id} />}
    </>
  );
}

import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getPermissionCatalog, getRoles } from '../../services/get-roles';
import { UsersAreaTabs } from '../UsersAreaTabs';
import { PermissionMatrix } from './PermissionMatrix';

export async function PermissionCatalogLoader(): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const [catalog, roles] = await Promise.all([
    getPermissionCatalog(access.token),
    getRoles(access.token),
  ]);
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Permissões</h1>
        <p className="text-sm text-admin-muted">
          O que cada grupo pode fazer, ação por ação. As permissões são definidas pelo sistema; para
          mudar o pacote de um grupo, abra o grupo.
        </p>
      </header>
      <UsersAreaTabs active="permissions" />
      <PermissionMatrix catalog={catalog} roles={roles} />
    </>
  );
}

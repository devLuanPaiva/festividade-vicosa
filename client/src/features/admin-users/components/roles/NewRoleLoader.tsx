import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { createRoleAction } from '../../actions/role-actions';
import { ROLES_PATH } from '../../lib/user-paths';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getPermissionCatalog } from '../../services/get-roles';
import { EMPTY_ROLE_VALUES } from '../../types';
import { RoleForm } from './RoleForm';

export async function NewRoleLoader(): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access?.canManagePermissions) {
    return <NoPermission action="criar grupos" />;
  }
  const catalog = await getPermissionCatalog(access.token);
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href={ROLES_PATH}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700"
        >
          ← Voltar aos grupos
        </Link>
        <h1 className="text-2xl font-bold">Novo grupo</h1>
      </header>
      <RoleForm
        action={createRoleAction}
        initialValues={EMPTY_ROLE_VALUES}
        catalog={catalog}
        canChangePermissions
        submitLabel="Criar grupo"
      />
    </>
  );
}

import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { orNotFound } from '@/lib/api/missing-resource';
import { updateRoleAction } from '../../actions/role-actions';
import { ROLES_PATH } from '../../lib/user-paths';
import { findUserManagerAccess } from '../../services/find-user-manager-access';
import { getPermissionCatalog, getRole } from '../../services/get-roles';
import { getUser } from '../../services/get-users';
import { DeleteRoleSection } from './DeleteRoleSection';
import { RoleForm } from './RoleForm';

interface EditRoleLoaderProps {
  params: Promise<{ roleId: string }>;
}

export async function EditRoleLoader({ params }: EditRoleLoaderProps): Promise<ReactElement> {
  const access = await findUserManagerAccess();
  if (!access) {
    return <NoPermission action="gerenciar usuários" />;
  }
  const { roleId } = await params;
  const [role, catalog, me] = await orNotFound(
    Promise.all([
      getRole(roleId, access.token),
      getPermissionCatalog(access.token),
      getUser(access.user.id, access.token),
    ]),
  );
  const isOwnRole = me.roles.some((assigned) => assigned.id === role.id);
  const canChangePermissions = access.canManagePermissions && !isOwnRole;
  return (
    <>
      <header className="flex flex-col gap-2">
        <Link
          href={ROLES_PATH}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700"
        >
          ← Voltar aos grupos
        </Link>
        <h1 className="text-2xl font-bold">{role.name}</h1>
        {canChangePermissions ? null : (
          <p className="rounded-xl border border-admin-line bg-admin-surface p-4 text-sm text-admin-muted">
            {isOwnRole
              ? 'Você pertence a este grupo e não pode alterar as permissões dele. Peça a outra pessoa com essa permissão.'
              : 'Você pode ver as permissões do grupo, mas não alterá-las.'}
          </p>
        )}
      </header>
      <RoleForm
        action={updateRoleAction.bind(null, {
          roleId: role.id,
          currentName: role.name,
          canChangePermissions,
        })}
        initialValues={{ name: role.name, permissions: role.permissions }}
        catalog={catalog}
        canChangePermissions={canChangePermissions}
        submitLabel="Salvar grupo"
      />
      {access.canManagePermissions ? <DeleteRoleSection role={role} /> : null}
    </>
  );
}

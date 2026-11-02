import type { ReactElement } from 'react';
import type { AdminRole, AdminUser, PermissionDescription, PermissionOverride } from '../../types';
import { UserPermissionsForm } from './UserPermissionsForm';
import { UserRolesForm } from './UserRolesForm';

interface UserAccessSectionsProps {
  user: AdminUser;
  roles: AdminRole[];
  catalog: PermissionDescription[];
  overrides: PermissionOverride[];
  canEdit: boolean;
  isSelf: boolean;
}

function accessNotice(isSelf: boolean): string {
  return isSelf
    ? 'Você não pode alterar os seus próprios grupos e permissões. Peça a outra pessoa com essa permissão.'
    : 'Você pode ver os grupos e as permissões, mas não alterá-los.';
}

export function UserAccessSections({
  user,
  roles,
  catalog,
  overrides,
  canEdit,
  isSelf,
}: UserAccessSectionsProps): ReactElement {
  const userRoles = roles.filter((role) => user.roles.some((assigned) => assigned.id === role.id));
  return (
    <>
      {canEdit ? null : (
        <p className="rounded-xl border border-admin-line bg-admin-surface p-4 text-sm text-admin-muted">
          {accessNotice(isSelf)}
        </p>
      )}
      <section aria-labelledby="roles-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="roles-title" className="text-lg font-bold">
            Grupos
          </h2>
          <p className="text-sm text-admin-muted">
            As permissões dos grupos se somam. O grupo principal é o que aparece em destaque.
          </p>
        </div>
        <UserRolesForm user={user} roles={roles} canEdit={canEdit} />
      </section>
      <section aria-labelledby="permissions-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="permissions-title" className="text-lg font-bold">
            Permissões
          </h2>
          <p className="text-sm text-admin-muted">
            Cada permissão vem dos grupos. Você pode conceder uma a mais ou revogar uma só para este
            usuário; a revogação vale mesmo que o grupo tenha a permissão.
          </p>
        </div>
        <UserPermissionsForm
          userId={user.id}
          catalog={catalog}
          roles={userRoles}
          overrides={overrides}
          canEdit={canEdit}
        />
      </section>
    </>
  );
}

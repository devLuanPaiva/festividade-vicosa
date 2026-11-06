'use client';

import { useActionState, useState, type ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { assignUserRolesAction } from '../../actions/user-access-actions';
import { choosePrimaryRole, toggleRole, type RoleSelection } from '../../lib/role-selection';
import { INITIAL_ACCESS_STATE, type AdminRole, type AdminUser } from '../../types';
import { FormFeedback } from '../FormFeedback';

interface UserRolesFormProps {
  user: AdminUser;
  roles: AdminRole[];
  canEdit: boolean;
}

function initialSelection(user: AdminUser): RoleSelection {
  return {
    roleIds: user.roles.map((role) => role.id),
    primaryRoleId: user.roles.find((role) => role.primary)?.id ?? '',
  };
}

export function UserRolesForm({
  user,
  roles,
  canEdit,
}: Readonly<UserRolesFormProps>): ReactElement {
  const [state, formAction] = useActionState(
    assignUserRolesAction.bind(null, user.id),
    INITIAL_ACCESS_STATE,
  );
  const [selection, setSelection] = useState(() => initialSelection(user));
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-admin-line rounded-2xl border border-admin-line bg-admin-surface">
        {roles.map((role) => {
          const isSelected = selection.roleIds.includes(role.id);
          return (
            <li key={role.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <label className="flex min-h-11 flex-1 items-center gap-3 font-semibold">
                <input
                  type="checkbox"
                  name="roleIds"
                  value={role.id}
                  checked={isSelected}
                  disabled={!canEdit}
                  onChange={() => setSelection(toggleRole(selection, role.id))}
                  className="size-5"
                />
                {role.name}
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm text-admin-muted">
                <input
                  type="radio"
                  name="primaryRoleId"
                  value={role.id}
                  checked={selection.primaryRoleId === role.id}
                  disabled={!canEdit || !isSelected}
                  onChange={() => setSelection(choosePrimaryRole(selection, role.id))}
                  className="size-5"
                />
                Principal
              </label>
            </li>
          );
        })}
      </ul>
      <FormFeedback errorMessage={state.errorMessage} isSaved={state.isSaved} />
      {canEdit ? (
        <div>
          <SubmitButton pendingLabel="Salvando…" disabled={selection.roleIds.length === 0}>
            Salvar grupos
          </SubmitButton>
        </div>
      ) : null}
    </form>
  );
}

'use server';

import { redirectToSuccess } from '@/features/admin-shell/lib/redirect-to-success';
import { requestAdminResult, submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { parseRoleForm } from '../lib/parse-role-form';
import { refreshUsersData } from '../lib/refresh-users-data';
import { ROLES_PATH, rolePath } from '../lib/user-paths';
import type { AdminRole, RoleFormState } from '../types';

interface RoleTarget {
  roleId: string;
  currentName: string;
  canChangePermissions: boolean;
}

function roleApiPath(roleId: string): string {
  return `/roles/${encodeURIComponent(roleId)}`;
}

export async function createRoleAction(
  _previousState: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const values = parseRoleForm(formData);
  const outcome = await requestAdminResult<AdminRole>('/roles', { method: 'POST', body: values });
  if (!outcome.ok) {
    return { ...outcome.failure, values, isSaved: false };
  }
  refreshUsersData();
  redirectToSuccess('role-created', rolePath(outcome.result.id));
}

export async function updateRoleAction(
  { roleId, currentName, canChangePermissions }: RoleTarget,
  _previousState: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const values = parseRoleForm(formData);
  const renameFailure =
    values.name === currentName
      ? null
      : await submitAdminRequest(roleApiPath(roleId), {
          method: 'PATCH',
          body: { name: values.name },
        });
  const permissionsFailure =
    renameFailure || !canChangePermissions
      ? null
      : await submitAdminRequest(`${roleApiPath(roleId)}/permissions`, {
          method: 'PUT',
          body: { permissions: values.permissions },
        });
  refreshUsersData();
  const failure = renameFailure ?? permissionsFailure;
  return failure
    ? { ...failure, values, isSaved: false }
    : { errorMessage: null, errorField: null, values, isSaved: true };
}

export async function deleteRoleAction(roleId: string): Promise<FormErrorState> {
  const failure = await submitAdminRequest(roleApiPath(roleId), { method: 'DELETE' });
  if (failure) {
    return failure;
  }
  refreshUsersData();
  redirectToSuccess('role-deleted', ROLES_PATH);
}

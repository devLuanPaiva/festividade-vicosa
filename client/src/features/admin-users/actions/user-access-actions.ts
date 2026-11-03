'use server';

import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { diffOverrides, parseOverrideChoices } from '../lib/override-changes';
import { parseRoleSelection } from '../lib/role-selection';
import { refreshUsersData } from '../lib/refresh-users-data';
import type { AccessFormState, PermissionOverride } from '../types';

interface OverrideTarget {
  userId: string;
  permissionCodes: string[];
  current: PermissionOverride[];
}

const SAVED: AccessFormState = { errorMessage: null, errorField: null, isSaved: true };

function userApiPath(userId: string): string {
  return `/users/${encodeURIComponent(userId)}`;
}

export async function assignUserRolesAction(
  userId: string,
  _previousState: AccessFormState,
  formData: FormData,
): Promise<AccessFormState> {
  const failure = await submitAdminRequest(`${userApiPath(userId)}/roles`, {
    method: 'PUT',
    body: parseRoleSelection(formData),
  });
  if (failure) {
    return { ...failure, isSaved: false };
  }
  refreshUsersData();
  return SAVED;
}

export async function saveUserOverridesAction(
  { userId, permissionCodes, current }: OverrideTarget,
  _previousState: AccessFormState,
  formData: FormData,
): Promise<AccessFormState> {
  const operations = diffOverrides(current, parseOverrideChoices(formData, permissionCodes));
  for (const { permission, effect } of operations) {
    const path = `${userApiPath(userId)}/permissions/${encodeURIComponent(permission)}`;
    const failure = await submitAdminRequest(
      path,
      effect ? { method: 'PUT', body: { effect } } : { method: 'DELETE' },
    );
    if (failure) {
      refreshUsersData();
      return { ...failure, isSaved: false };
    }
  }
  refreshUsersData();
  return SAVED;
}

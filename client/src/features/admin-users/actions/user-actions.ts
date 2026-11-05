'use server';

import { redirectToSuccess } from '@/features/admin-shell/lib/redirect-to-success';
import { requestAdminResult, submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { refreshUsersData } from '../lib/refresh-users-data';
import { parseUserForm, toCreateUserPayload, toUpdateUserPayload } from '../lib/parse-user-form';
import { ADMIN_USERS_PATH } from '@/features/admin-shell/lib/admin-sections';
import { userPath } from '../lib/user-paths';
import type { AdminUser, UserFormState } from '../types';

function userApiPath(userId: string): string {
  return `/users/${encodeURIComponent(userId)}`;
}

export async function createUserAction(
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const values = parseUserForm(formData);
  const outcome = await requestAdminResult<AdminUser>('/users', {
    method: 'POST',
    body: toCreateUserPayload(values),
  });
  if (!outcome.ok) {
    return { ...outcome.failure, values, isSaved: false };
  }
  refreshUsersData();
  redirectToSuccess('user-created', userPath(outcome.result.id));
}

export async function updateUserAction(
  userId: string,
  _previousState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const values = parseUserForm(formData);
  const failure = await submitAdminRequest(userApiPath(userId), {
    method: 'PATCH',
    body: toUpdateUserPayload(values),
  });
  if (failure) {
    return { ...failure, values, isSaved: false };
  }
  refreshUsersData();
  return {
    errorMessage: null,
    errorField: null,
    values: { ...values, password: '' },
    isSaved: true,
  };
}

export async function setUserActiveAction(
  userId: string,
  isActive: boolean,
): Promise<FormErrorState> {
  const action = isActive ? 'activate' : 'deactivate';
  const failure = await submitAdminRequest(`${userApiPath(userId)}/${action}`, { method: 'PATCH' });
  if (failure) {
    return failure;
  }
  refreshUsersData();
  redirectToSuccess(isActive ? 'user-activated' : 'user-deactivated', userPath(userId));
}

export async function deleteUserAction(userId: string): Promise<FormErrorState> {
  const failure = await submitAdminRequest(userApiPath(userId), { method: 'DELETE' });
  if (failure) {
    return failure;
  }
  refreshUsersData();
  redirectToSuccess('user-deleted', ADMIN_USERS_PATH);
}

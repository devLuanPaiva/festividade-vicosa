'use server';

import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { readText } from '@/lib/forms/form-data';
import { refreshChampionshipData } from '../lib/refresh-championship-data';
import { INITIAL_GROUP_STATE, type GroupFormState } from '../types';

export async function createGroupAction(
  categoryId: string,
  _previousState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const name = readText(formData, 'name');
  const failure = await submitAdminRequest(`/categories/${encodeURIComponent(categoryId)}/groups`, {
    method: 'POST',
    body: { name },
  });
  if (failure) {
    return { ...failure, name };
  }
  refreshChampionshipData();
  return INITIAL_GROUP_STATE;
}

export async function renameGroupAction(
  groupId: string,
  _previousState: GroupFormState,
  formData: FormData,
): Promise<GroupFormState> {
  const name = readText(formData, 'name');
  const failure = await submitAdminRequest(`/groups/${encodeURIComponent(groupId)}`, {
    method: 'PATCH',
    body: { name },
  });
  if (failure) {
    return { ...failure, name };
  }
  refreshChampionshipData();
  return { ...INITIAL_GROUP_STATE, name };
}

export async function deleteGroupAction(groupId: string): Promise<FormErrorState> {
  const failure = await submitAdminRequest(`/groups/${encodeURIComponent(groupId)}`, {
    method: 'DELETE',
  });
  if (failure) {
    return failure;
  }
  refreshChampionshipData();
  return INITIAL_FORM_ERROR_STATE;
}

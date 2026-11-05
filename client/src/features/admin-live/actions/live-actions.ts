'use server';

import { revalidatePath } from 'next/cache';
import { redirectToSuccess } from '@/features/admin-shell/lib/redirect-to-success';
import { ADMIN_LIVE_PATH } from '@/features/admin-shell/lib/admin-sections';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { parseLiveForm, toLivePayload } from '../lib/parse-live-form';
import type { LiveFormState } from '../types';

function liveApiPath(liveId: string): string {
  return `/live-streams/${encodeURIComponent(liveId)}`;
}

function refreshLiveData(): void {
  revalidatePath('/admin', 'layout');
}

export async function createLiveAction(
  _previousState: LiveFormState,
  formData: FormData,
): Promise<LiveFormState> {
  const values = parseLiveForm(formData);
  const failure = await submitAdminRequest('/live-streams', {
    method: 'POST',
    body: toLivePayload(values),
  });
  if (failure) {
    return { ...failure, values };
  }
  refreshLiveData();
  redirectToSuccess('live-created', ADMIN_LIVE_PATH);
}

export async function updateLiveAction(
  liveId: string,
  _previousState: LiveFormState,
  formData: FormData,
): Promise<LiveFormState> {
  const values = parseLiveForm(formData);
  const failure = await submitAdminRequest(liveApiPath(liveId), {
    method: 'PATCH',
    body: toLivePayload(values),
  });
  if (failure) {
    return { ...failure, values };
  }
  refreshLiveData();
  redirectToSuccess('live-updated', ADMIN_LIVE_PATH);
}

export async function setLiveActiveAction(
  liveId: string,
  isActive: boolean,
): Promise<FormErrorState> {
  const action = isActive ? 'activate' : 'deactivate';
  const failure = await submitAdminRequest(`${liveApiPath(liveId)}/${action}`, {
    method: 'PATCH',
  });
  if (failure) {
    return failure;
  }
  refreshLiveData();
  return INITIAL_FORM_ERROR_STATE;
}

export async function deleteLiveAction(liveId: string): Promise<FormErrorState> {
  const failure = await submitAdminRequest(liveApiPath(liveId), { method: 'DELETE' });
  if (failure) {
    return failure;
  }
  refreshLiveData();
  redirectToSuccess('live-deleted', ADMIN_LIVE_PATH);
}

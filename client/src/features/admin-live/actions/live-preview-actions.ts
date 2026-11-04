'use server';

import { revalidatePath } from 'next/cache';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { copyFileField } from '@/lib/forms/form-data';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';

const PREVIEW_FIELD = 'file';

function previewPath(liveId: string): string {
  return `/live-streams/${encodeURIComponent(liveId)}/preview`;
}

async function sendPreviewRequest(
  liveId: string,
  request: Parameters<typeof submitAdminRequest>[1],
): Promise<FormErrorState> {
  const failure = await submitAdminRequest(previewPath(liveId), request);
  if (failure) {
    return failure;
  }
  revalidatePath('/admin', 'layout');
  return INITIAL_FORM_ERROR_STATE;
}

export async function uploadLivePreviewAction(
  liveId: string,
  _previousState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  return sendPreviewRequest(liveId, {
    method: 'PUT',
    body: copyFileField(formData, PREVIEW_FIELD),
  });
}

export async function removeLivePreviewAction(liveId: string): Promise<FormErrorState> {
  return sendPreviewRequest(liveId, { method: 'DELETE' });
}

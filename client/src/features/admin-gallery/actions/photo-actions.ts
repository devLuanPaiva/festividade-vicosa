'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';

async function finishRequest(failure: FormErrorState | null): Promise<FormErrorState> {
  if (failure) {
    return failure;
  }
  revalidatePath('/admin', 'layout');
  updateTag('gallery');
  return INITIAL_FORM_ERROR_STATE;
}

export async function refreshGalleryAction(): Promise<FormErrorState> {
  return finishRequest(null);
}

export async function deletePhotoAction(photoId: string): Promise<FormErrorState> {
  return finishRequest(
    await submitAdminRequest(`/photos/${encodeURIComponent(photoId)}`, { method: 'DELETE' }),
  );
}

export async function reorderPhotosAction(photoIds: string[]): Promise<FormErrorState> {
  return finishRequest(
    await submitAdminRequest('/photos/order', { method: 'PUT', body: { photoIds } }),
  );
}

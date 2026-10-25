'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { copyFileField } from '@/lib/forms/form-data';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { albumUploadPath } from '../lib/album-target';
import type { AlbumTarget } from '../types';

const PHOTO_FIELD = 'file';

async function finishRequest(failure: FormErrorState | null): Promise<FormErrorState> {
  if (failure) {
    return failure;
  }
  revalidatePath('/admin', 'layout');
  updateTag('gallery');
  return INITIAL_FORM_ERROR_STATE;
}

export async function uploadAlbumPhotoAction(
  target: AlbumTarget,
  formData: FormData,
): Promise<FormErrorState> {
  return finishRequest(
    await submitAdminRequest(albumUploadPath(target), {
      method: 'POST',
      body: copyFileField(formData, PHOTO_FIELD),
    }),
  );
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

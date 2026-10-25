import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { albumTargetToQuery } from './album-query';
import { messageFor } from './upload-failure';
import type { AlbumTarget } from '../types';

const UPLOAD_ROUTE = '/admin/uploads/photos';
const PHOTO_FIELD = 'file';

export async function postAlbumPhoto(target: AlbumTarget, photo: File): Promise<FormErrorState> {
  const formData = new FormData();
  formData.set(PHOTO_FIELD, photo);
  const response = await fetch(`${UPLOAD_ROUTE}?${albumTargetToQuery(target)}`, {
    method: 'POST',
    body: formData,
  });
  if (response.ok && !response.redirected) {
    return INITIAL_FORM_ERROR_STATE;
  }
  const body: unknown = await response.json().catch(() => null);
  const status = response.redirected ? 401 : response.status;
  return { errorMessage: messageFor(status, body), errorField: null };
}

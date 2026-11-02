'use server';

import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { copyFileField } from '@/lib/forms/form-data';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';

const PHOTO_FIELD = 'file';

function photoPath(matchId: string): string {
  return `/matches/${encodeURIComponent(matchId)}/best-player/photo`;
}

async function sendPhotoRequest(
  matchId: string,
  request: Parameters<typeof submitAdminRequest>[1],
): Promise<FormErrorState> {
  const failure = await submitAdminRequest(photoPath(matchId), request);
  if (failure) {
    return failure;
  }
  refreshChampionshipData();
  return INITIAL_FORM_ERROR_STATE;
}

export async function uploadBestPlayerPhotoAction(
  matchId: string,
  _previousState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  return sendPhotoRequest(matchId, {
    method: 'PUT',
    body: copyFileField(formData, PHOTO_FIELD),
  });
}

export async function removeBestPlayerPhotoAction(matchId: string): Promise<FormErrorState> {
  return sendPhotoRequest(matchId, { method: 'DELETE' });
}

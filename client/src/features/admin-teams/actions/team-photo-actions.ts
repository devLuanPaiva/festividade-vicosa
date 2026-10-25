'use server';

import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { copyFileField } from '@/lib/forms/form-data';
import { INITIAL_FORM_ERROR_STATE, type FormErrorState } from '@/lib/forms/form-errors';
import { refreshChampionshipData } from '../lib/refresh-championship-data';

const PHOTO_FIELD = 'file';

function photoPath(teamId: string): string {
  return `/teams/${encodeURIComponent(teamId)}/photo`;
}

async function sendPhotoRequest(
  teamId: string,
  request: Parameters<typeof submitAdminRequest>[1],
): Promise<FormErrorState> {
  const failure = await submitAdminRequest(photoPath(teamId), request);
  if (failure) {
    return failure;
  }
  refreshChampionshipData();
  return INITIAL_FORM_ERROR_STATE;
}

export async function uploadTeamPhotoAction(
  teamId: string,
  _previousState: FormErrorState,
  formData: FormData,
): Promise<FormErrorState> {
  const body = copyFileField(formData, PHOTO_FIELD);
  return sendPhotoRequest(teamId, { method: 'PUT', body });
}

export async function removeTeamPhotoAction(teamId: string): Promise<FormErrorState> {
  return sendPhotoRequest(teamId, { method: 'DELETE' });
}

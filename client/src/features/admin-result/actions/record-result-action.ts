'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/api-response';
import { sendApiRequest } from '@/lib/api/server-fetch';
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from '@/lib/auth/auth-paths';
import { requireSessionToken } from '@/lib/auth/current-user';
import { buildResultPayload } from '../lib/build-result-payload';
import { parseResultForm } from '../lib/parse-result-form';
import type { ResultFormState } from '../types';

const UNAUTHORIZED_STATUS = 401;

function toFailureState(error: unknown): ResultFormState {
  if (!(error instanceof ApiError)) {
    throw error;
  }
  if (error.statusCode === UNAUTHORIZED_STATUS) {
    redirect(ADMIN_LOGIN_PATH);
  }
  return { errorMessage: error.details.detail, errorField: error.details.field || null };
}

function refreshPublicPages(matchId: string): void {
  updateTag('matches');
  updateTag('standings');
  updateTag(`match-${matchId}`);
}

export async function recordResultAction(
  matchId: string,
  _previousState: ResultFormState,
  formData: FormData,
): Promise<ResultFormState> {
  const token = await requireSessionToken();
  const body = buildResultPayload(parseResultForm(formData));
  try {
    await sendApiRequest(`/matches/${encodeURIComponent(matchId)}/result`, {
      method: 'PUT',
      body,
      token,
    });
  } catch (error) {
    return toFailureState(error);
  }
  refreshPublicPages(matchId);
  redirect(ADMIN_HOME_PATH);
}

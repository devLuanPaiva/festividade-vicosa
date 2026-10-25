'use server';

import { redirect } from 'next/navigation';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import { buildResultPayload } from '../lib/build-result-payload';
import { parseResultForm } from '../lib/parse-result-form';
import type { ResultFormState } from '../types';

export async function recordResultAction(
  matchId: string,
  _previousState: ResultFormState,
  formData: FormData,
): Promise<ResultFormState> {
  const failure = await submitAdminRequest(`/matches/${encodeURIComponent(matchId)}/result`, {
    method: 'PUT',
    body: buildResultPayload(parseResultForm(formData)),
  });
  if (failure) {
    return failure;
  }
  redirect(ADMIN_HOME_PATH);
}

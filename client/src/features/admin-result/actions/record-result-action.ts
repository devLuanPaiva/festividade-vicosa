'use server';

import { redirectToSuccess } from '@/features/admin-shell/lib/redirect-to-success';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { ADMIN_MATCHES_PATH } from '@/features/admin-shell/lib/admin-sections';
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
  redirectToSuccess('result-recorded', ADMIN_MATCHES_PATH);
}

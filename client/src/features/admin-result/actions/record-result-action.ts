'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import { buildResultPayload } from '../lib/build-result-payload';
import { parseResultForm } from '../lib/parse-result-form';
import type { ResultFormState } from '../types';

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
  const failure = await submitAdminRequest(`/matches/${encodeURIComponent(matchId)}/result`, {
    method: 'PUT',
    body: buildResultPayload(parseResultForm(formData)),
  });
  if (failure) {
    return failure;
  }
  refreshPublicPages(matchId);
  redirect(ADMIN_HOME_PATH);
}

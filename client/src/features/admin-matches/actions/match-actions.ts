'use server';

import { redirect } from 'next/navigation';
import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { categoryMatchesPath } from '../lib/admin-match-paths';
import {
  parseMatchForm,
  toCreateMatchPayload,
  toUpdateMatchPayload,
} from '../lib/parse-match-form';
import type { MatchFormState, MatchTarget } from '../types';

export async function createMatchAction(
  categoryId: string,
  _previousState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const values = parseMatchForm(formData);
  const failure = await submitAdminRequest(
    `/categories/${encodeURIComponent(categoryId)}/matches`,
    { method: 'POST', body: toCreateMatchPayload(values) },
  );
  if (failure) {
    return { ...failure, values };
  }
  refreshChampionshipData();
  redirect(categoryMatchesPath(categoryId));
}

export async function updateMatchAction(
  { matchId, categoryId, canChangeTeams }: MatchTarget,
  _previousState: MatchFormState,
  formData: FormData,
): Promise<MatchFormState> {
  const values = parseMatchForm(formData);
  const failure = await submitAdminRequest(`/matches/${encodeURIComponent(matchId)}`, {
    method: 'PATCH',
    body: toUpdateMatchPayload(values, canChangeTeams),
  });
  if (failure) {
    return { ...failure, values };
  }
  refreshChampionshipData();
  redirect(categoryMatchesPath(categoryId));
}

export async function deleteMatchAction({
  matchId,
  categoryId,
}: MatchTarget): Promise<FormErrorState> {
  const failure = await submitAdminRequest(`/matches/${encodeURIComponent(matchId)}`, {
    method: 'DELETE',
  });
  if (failure) {
    return failure;
  }
  refreshChampionshipData();
  redirect(categoryMatchesPath(categoryId));
}

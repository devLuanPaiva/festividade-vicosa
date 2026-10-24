'use server';

import { redirect } from 'next/navigation';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { categoryPath } from '../lib/admin-team-paths';
import { parseTeamForm, toTeamPayload } from '../lib/parse-team-form';
import { refreshTeamData } from '../lib/refresh-team-data';
import type { TeamFormState, TeamTarget } from '../types';

export async function createTeamAction(
  categoryId: string,
  _previousState: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const values = parseTeamForm(formData);
  const failure = await submitAdminRequest(`/categories/${encodeURIComponent(categoryId)}/teams`, {
    method: 'POST',
    body: toTeamPayload(values),
  });
  if (failure) {
    return { ...failure, values };
  }
  refreshTeamData();
  redirect(categoryPath(categoryId));
}

export async function updateTeamAction(
  { teamId, categoryId }: TeamTarget,
  _previousState: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const values = parseTeamForm(formData);
  const failure = await submitAdminRequest(`/teams/${encodeURIComponent(teamId)}`, {
    method: 'PATCH',
    body: toTeamPayload(values),
  });
  if (failure) {
    return { ...failure, values };
  }
  refreshTeamData();
  redirect(categoryPath(categoryId));
}

export async function deleteTeamAction({
  teamId,
  categoryId,
}: TeamTarget): Promise<FormErrorState> {
  const failure = await submitAdminRequest(`/teams/${encodeURIComponent(teamId)}`, {
    method: 'DELETE',
  });
  if (failure) {
    return failure;
  }
  refreshTeamData();
  redirect(categoryPath(categoryId));
}

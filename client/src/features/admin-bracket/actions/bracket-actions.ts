'use server';

import { redirect } from 'next/navigation';
import { categoryMatchesPath } from '@/features/admin-matches/lib/admin-match-paths';
import {
  orderTeamsByPosition,
  readPositions,
} from '@/features/admin-qualified/lib/order-teams-by-position';
import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { readText } from '@/lib/forms/form-data';
import { toBracketPayload } from '../lib/bracket-payload';
import { BRACKET_ERROR_FIELD, type BracketFormState, type BracketFormValues } from '../types';

function readBracketForm(formData: FormData): BracketFormValues {
  return {
    positions: readPositions(formData),
    date: readText(formData, 'date'),
    time: readText(formData, 'time'),
    location: readText(formData, 'location'),
  };
}

export async function generateBracketAction(
  categoryId: string,
  _previousState: BracketFormState,
  formData: FormData,
): Promise<BracketFormState> {
  const values = readBracketForm(formData);
  const ordered = orderTeamsByPosition(values.positions);
  if (!ordered.ok) {
    return { errorMessage: ordered.message, errorField: BRACKET_ERROR_FIELD, values };
  }
  const failure = await submitAdminRequest(
    `/categories/${encodeURIComponent(categoryId)}/bracket`,
    {
      method: 'POST',
      body: toBracketPayload(ordered.teamIds, values),
    },
  );
  if (failure) {
    return { ...failure, values };
  }
  refreshChampionshipData();
  redirect(categoryMatchesPath(categoryId));
}

'use server';

import { redirect } from 'next/navigation';
import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { parseSuggestionForm } from '../lib/parse-suggestion-form';
import {
  findRowWithoutSchedule,
  toBatchMatch,
  toMatchUpdate,
  toRowFailure,
  type IndexedRow,
} from '../lib/suggestion-payload';
import {
  ROWS_ERROR_FIELD,
  type SuggestionDefaults,
  type SuggestionFormState,
  type SuggestionTarget,
} from '../types';

const NOTHING_SELECTED_MESSAGE = 'Marque pelo menos uma partida para confirmar.';

async function applyUpdates(
  updates: IndexedRow[],
  defaults: SuggestionDefaults,
): Promise<FormErrorState | null> {
  for (const { row } of updates) {
    const failure = await submitAdminRequest(`/matches/${encodeURIComponent(row.matchId)}`, {
      method: 'PATCH',
      body: toMatchUpdate(row, defaults),
    });
    if (failure) {
      return failure;
    }
  }
  return null;
}

async function createMatches(
  categoryId: string,
  creations: IndexedRow[],
  defaults: SuggestionDefaults,
): Promise<FormErrorState | null> {
  if (creations.length === 0) {
    return null;
  }
  const failure = await submitAdminRequest(
    `/categories/${encodeURIComponent(categoryId)}/matches/batch`,
    { method: 'POST', body: { matches: creations.map(({ row }) => toBatchMatch(row, defaults)) } },
  );
  return failure ? toRowFailure(failure, creations) : null;
}

export async function confirmSuggestionsAction(
  { categoryId, returnPath }: SuggestionTarget,
  _previousState: SuggestionFormState,
  formData: FormData,
): Promise<SuggestionFormState> {
  const values = parseSuggestionForm(formData);
  const included = values.rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.isIncluded);
  const failure =
    (included.length === 0
      ? { errorMessage: NOTHING_SELECTED_MESSAGE, errorField: ROWS_ERROR_FIELD }
      : null) ??
    findRowWithoutSchedule(included, values.defaults) ??
    (await applyUpdates(
      included.filter(({ row }) => row.matchId),
      values.defaults,
    )) ??
    (await createMatches(
      categoryId,
      included.filter(({ row }) => !row.matchId),
      values.defaults,
    ));
  if (failure) {
    return { ...failure, values };
  }
  refreshChampionshipData();
  redirect(returnPath);
}

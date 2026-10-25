'use server';

import {
  orderTeamsByPosition,
  readPositions,
} from '@/features/admin-qualified/lib/order-teams-by-position';
import { toBracketRows } from '@/features/admin-suggestions/lib/suggestion-rows';
import type { BracketMatchSuggestion } from '@/features/admin-suggestions/types';
import { requestAdminList } from '@/lib/api/submit-admin-request';
import { BRACKET_ERROR_FIELD, type BracketFormState } from '../types';

export async function suggestBracketAction(
  categoryId: string,
  _previousState: BracketFormState,
  formData: FormData,
): Promise<BracketFormState> {
  const values = { positions: readPositions(formData) };
  const ordered = orderTeamsByPosition(values.positions);
  if (!ordered.ok) {
    return { errorMessage: ordered.message, errorField: BRACKET_ERROR_FIELD, values, rows: null };
  }
  const outcome = await requestAdminList<BracketMatchSuggestion>(
    `/categories/${encodeURIComponent(categoryId)}/bracket/suggestion`,
    { method: 'POST', body: { teamIds: ordered.teamIds } },
  );
  if (!outcome.ok) {
    return { ...outcome.failure, values, rows: null };
  }
  return { errorMessage: null, errorField: null, values, rows: toBracketRows(outcome.result) };
}

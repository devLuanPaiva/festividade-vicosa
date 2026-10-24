'use server';

import { refreshChampionshipData } from '@/features/admin-teams/lib/refresh-championship-data';
import { submitAdminRequest } from '@/lib/api/submit-admin-request';
import { orderTeamsByPosition, readPositions } from '../lib/order-teams-by-position';
import { QUALIFIED_ERROR_FIELD, type QualifiedFormState } from '../types';

export async function confirmQualifiedAction(
  groupId: string,
  _previousState: QualifiedFormState,
  formData: FormData,
): Promise<QualifiedFormState> {
  const positions = readPositions(formData);
  const ordered = orderTeamsByPosition(positions);
  if (!ordered.ok) {
    return {
      errorMessage: ordered.message,
      errorField: QUALIFIED_ERROR_FIELD,
      positions,
      isSaved: false,
    };
  }
  const failure = await submitAdminRequest(`/groups/${encodeURIComponent(groupId)}/qualified`, {
    method: 'PUT',
    body: { teamIds: ordered.teamIds },
  });
  if (failure) {
    return { ...failure, positions, isSaved: false };
  }
  refreshChampionshipData();
  return { errorMessage: null, errorField: null, positions, isSaved: true };
}

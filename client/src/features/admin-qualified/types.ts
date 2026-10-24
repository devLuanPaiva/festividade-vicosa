import type { FormErrorState } from '@/lib/forms/form-errors';

export interface QualifiedFormState extends FormErrorState {
  positions: Record<string, string>;
  isSaved: boolean;
}

export const QUALIFIED_ERROR_FIELD = 'teamIds';

export function initialQualifiedState(positions: Record<string, string>): QualifiedFormState {
  return { errorMessage: null, errorField: null, positions, isSaved: false };
}

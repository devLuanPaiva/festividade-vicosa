export interface FormErrorState {
  errorMessage: string | null;
  errorField: string | null;
}

export const INITIAL_FORM_ERROR_STATE: FormErrorState = {
  errorMessage: null,
  errorField: null,
};

export function errorForField(state: FormErrorState, field: string): string | null {
  return state.errorField === field ? state.errorMessage : null;
}

export function generalError(state: FormErrorState, knownFields: string[]): string | null {
  const belongsToField = state.errorField !== null && knownFields.includes(state.errorField);
  return belongsToField ? null : state.errorMessage;
}

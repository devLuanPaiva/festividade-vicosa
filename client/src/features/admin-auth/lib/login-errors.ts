import type { LoginFormState } from '../types';

const LOGIN_FIELDS = ['email', 'password'];

export function errorForField(state: LoginFormState, field: string): string | null {
  return state.errorField === field ? state.errorMessage : null;
}

export function generalError(state: LoginFormState): string | null {
  const belongsToField = state.errorField !== null && LOGIN_FIELDS.includes(state.errorField);
  return belongsToField ? null : state.errorMessage;
}

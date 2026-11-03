import { describe, expect, it } from 'vitest';
import { errorForField, generalError, type FormErrorState } from './form-errors';

const KNOWN_FIELDS = ['email', 'password'];

const invalidCredentials: FormErrorState = {
  errorMessage: 'E-mail ou senha inválidos.',
  errorField: null,
};

describe('form errors', () => {
  it('shows an error without a field as a general message', () => {
    expect(generalError(invalidCredentials, KNOWN_FIELDS)).toBe('E-mail ou senha inválidos.');
    expect(errorForField(invalidCredentials, 'email')).toBeNull();
  });

  it('shows an error of a field next to that field only', () => {
    const state = { errorField: 'email', errorMessage: 'E-mail inválido.' };

    expect(errorForField(state, 'email')).toBe('E-mail inválido.');
    expect(errorForField(state, 'password')).toBeNull();
    expect(generalError(state, KNOWN_FIELDS)).toBeNull();
  });

  it('falls back to a general message when the field has no input on the screen', () => {
    const state = { errorField: 'penaltiesA', errorMessage: 'Informe os pênaltis.' };

    expect(generalError(state, KNOWN_FIELDS)).toBe('Informe os pênaltis.');
  });
});

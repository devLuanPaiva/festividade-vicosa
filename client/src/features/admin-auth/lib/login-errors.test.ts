import { describe, expect, it } from 'vitest';
import type { LoginFormState } from '../types';
import { errorForField, generalError } from './login-errors';

const invalidCredentials: LoginFormState = {
  email: 'ana@example.com',
  errorMessage: 'E-mail ou senha inválidos.',
  errorField: null,
};

describe('login errors', () => {
  it('shows an error without a field as a general message', () => {
    expect(generalError(invalidCredentials)).toBe('E-mail ou senha inválidos.');
    expect(errorForField(invalidCredentials, 'email')).toBeNull();
  });

  it('shows an error of a field next to that field only', () => {
    const state = { ...invalidCredentials, errorField: 'email', errorMessage: 'E-mail inválido.' };

    expect(errorForField(state, 'email')).toBe('E-mail inválido.');
    expect(errorForField(state, 'password')).toBeNull();
    expect(generalError(state)).toBeNull();
  });
});

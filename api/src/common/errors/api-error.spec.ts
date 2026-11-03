import { apiError } from './api-error';

describe('apiError', () => {
  it('builds the error details with the field that failed', () => {
    expect(apiError('EMAIL_TAKEN', 'Já existe um usuário com este e-mail.', 'email')).toEqual({
      code: 'EMAIL_TAKEN',
      detail: 'Já existe um usuário com este e-mail.',
      field: 'email',
    });
  });

  it('omits the field when the error is not tied to an input', () => {
    expect(apiError('DATABASE_UNAVAILABLE', 'Banco indisponível.')).toEqual({
      code: 'DATABASE_UNAVAILABLE',
      detail: 'Banco indisponível.',
    });
  });
});

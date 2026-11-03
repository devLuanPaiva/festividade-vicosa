import { ApiError, isApiErrorResponse, messageForField, toApiError } from './api-response';

const conflictBody = {
  status: 'error',
  message: 'Conflito de dados',
  data: null,
  errors: {
    code: 'EMAIL_ALREADY_EXISTS',
    field: 'email',
    detail: 'Já existe um usuário com este e-mail.',
  },
};

describe('isApiErrorResponse', () => {
  it('recognizes the standard error body', () => {
    expect(isApiErrorResponse(conflictBody)).toBe(true);
  });

  it.each([
    { scenario: 'a success body', value: { status: 'success', result: {} } },
    { scenario: 'an error without details', value: { status: 'error' } },
    {
      scenario: 'details without a detail sentence',
      value: { status: 'error', errors: { code: 'X' } },
    },
    { scenario: 'null', value: null },
    { scenario: 'a string', value: 'oops' },
  ])('rejects $scenario', ({ value }) => {
    expect(isApiErrorResponse(value)).toBe(false);
  });
});

describe('toApiError', () => {
  it('keeps the status code, the message and the details sent by the api', () => {
    const error = toApiError(409, conflictBody);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Conflito de dados');
    expect(error.details).toEqual(conflictBody.errors);
  });

  it('falls back to a friendly detail when the body is not the standard error', () => {
    const error = toApiError(502, '<html>Bad gateway</html>');

    expect(error.statusCode).toBe(502);
    expect(error.details).toEqual({
      code: 'UNEXPECTED_ERROR',
      field: '',
      detail: 'Não foi possível concluir a operação. Tente novamente.',
    });
  });
});

describe('messageForField', () => {
  it('returns the detail when the error belongs to the field', () => {
    expect(messageForField(toApiError(409, conflictBody), 'email')).toBe(
      'Já existe um usuário com este e-mail.',
    );
  });

  it('returns nothing for the other fields', () => {
    expect(messageForField(toApiError(409, conflictBody), 'password')).toBeUndefined();
  });
});

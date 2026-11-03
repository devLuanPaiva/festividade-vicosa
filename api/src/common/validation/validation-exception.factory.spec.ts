import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { createValidationException } from './validation-exception.factory';

function failure(property: string, constraints?: Record<string, string>): ValidationError {
  return { property, constraints };
}

function bodyOf(exception: BadRequestException): unknown {
  return exception.getResponse();
}

describe('createValidationException', () => {
  it('reports the first failing field with its message as the detail', () => {
    const exception = createValidationException([
      failure('email', { isEmail: 'Informe um e-mail válido.' }),
      failure('password', { minLength: 'A senha deve ter pelo menos 6 caracteres.' }),
    ]);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(bodyOf(exception)).toEqual({
      code: 'VALIDATION_ERROR',
      field: 'email',
      detail: 'Informe um e-mail válido.',
    });
  });

  it('prefixes the field of a nested failure with its parents', () => {
    const nested = {
      property: 'address',
      children: [failure('city', { isString: 'Cidade inválida.' })],
    };

    expect(bodyOf(createValidationException([nested as ValidationError]))).toMatchObject({
      field: 'address.city',
      detail: 'Cidade inválida.',
    });
  });

  it('explains in portuguese that an unexpected field is not allowed', () => {
    const exception = createValidationException([
      failure('active', { whitelistValidation: 'property active should not exist' }),
    ]);

    expect(bodyOf(exception)).toMatchObject({
      field: 'active',
      detail: 'O campo "active" não é permitido.',
    });
  });

  it('falls back to a generic detail when no constraint is available', () => {
    expect(bodyOf(createValidationException([]))).toEqual({
      code: 'VALIDATION_ERROR',
      detail: 'Valor inválido.',
    });
  });
});

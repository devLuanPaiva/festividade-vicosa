import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { buildErrorResponse, resolveStatus } from './error-response';

function respond(exception: unknown): ReturnType<typeof buildErrorResponse> {
  return buildErrorResponse(exception, resolveStatus(exception));
}

describe('buildErrorResponse', () => {
  it('uses the code, field and detail provided by the exception', () => {
    const exception = new ConflictException({
      code: 'EMAIL_ALREADY_EXISTS',
      field: 'email',
      detail: 'Já existe um usuário com este e-mail.',
    });

    expect(respond(exception)).toEqual({
      status: 'error',
      message: 'Conflito de dados',
      data: null,
      errors: {
        code: 'EMAIL_ALREADY_EXISTS',
        field: 'email',
        detail: 'Já existe um usuário com este e-mail.',
      },
    });
  });

  it('keeps the message of a structured error when one is provided', () => {
    const exception = new BadRequestException({
      message: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      detail: 'Informe um e-mail válido.',
    });

    expect(respond(exception).message).toBe('Dados inválidos');
  });

  it('answers in portuguese for framework errors that carry only an english message', () => {
    const response = respond(new NotFoundException('Cannot GET /nowhere'));

    expect(response.message).toBe('Recurso não encontrado');
    expect(response.errors).toEqual({
      code: 'NOT_FOUND',
      field: '',
      detail: 'Recurso não encontrado',
    });
  });

  it('maps the too many requests status', () => {
    const response = respond(new HttpException('ThrottlerException', HttpStatus.TOO_MANY_REQUESTS));

    expect(response.errors.code).toBe('TOO_MANY_REQUESTS');
    expect(response.message).toBe('Muitas requisições');
  });

  it('never leaks the message of an unexpected error', () => {
    const response = respond(new Error('relation "users" does not exist'));

    expect(response).toEqual({
      status: 'error',
      message: 'Erro interno do servidor',
      data: null,
      errors: {
        code: 'INTERNAL_SERVER_ERROR',
        field: '',
        detail: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
      },
    });
  });

  it('falls back to the internal error message for a status without a mapping', () => {
    const response = buildErrorResponse(new HttpException('teapot', 418), 418);

    expect(response.message).toBe('Erro interno do servidor');
    expect(response.errors.code).toBe('INTERNAL_SERVER_ERROR');
  });
});

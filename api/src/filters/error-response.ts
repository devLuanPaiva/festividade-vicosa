import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorBody {
  message?: unknown;
  detail?: unknown;
  code?: unknown;
  field?: unknown;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  data: null;
  errors: { code: string; field: string; detail: string };
}

const FALLBACK_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;
const UNEXPECTED_ERROR_DETAIL = 'Ocorreu um erro inesperado. Tente novamente em instantes.';

const MESSAGE_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'Requisição inválida',
  [HttpStatus.UNAUTHORIZED]: 'Não autorizado',
  [HttpStatus.FORBIDDEN]: 'Acesso negado',
  [HttpStatus.NOT_FOUND]: 'Recurso não encontrado',
  [HttpStatus.CONFLICT]: 'Conflito de dados',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Erro de validação',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Muitas requisições',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Serviço indisponível',
};

const CODE_BY_STATUS: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
  [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
};

const SERVER_ERROR_MIN_STATUS = 500;

const asNonEmptyString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() !== '' ? value : undefined;

function readBody(exception: unknown): ErrorBody {
  if (!(exception instanceof HttpException)) {
    return {};
  }

  const response = exception.getResponse();
  return typeof response === 'object' ? response : { message: response };
}

function resolveMessage(body: ErrorBody, fallback: string): string {
  const hasDetail = asNonEmptyString(body.detail) !== undefined;
  return (hasDetail ? asNonEmptyString(body.message) : undefined) ?? fallback;
}

function resolveDetail(body: ErrorBody, fallback: string, isHttpError: boolean): string {
  return asNonEmptyString(body.detail) ?? (isHttpError ? fallback : UNEXPECTED_ERROR_DETAIL);
}

export function resolveStatus(exception: unknown): number {
  return exception instanceof HttpException ? exception.getStatus() : FALLBACK_STATUS;
}

export function isServerError(status: number): boolean {
  return status >= SERVER_ERROR_MIN_STATUS;
}

export function buildErrorResponse(exception: unknown, status: number): ErrorResponse {
  const body = readBody(exception);
  const fallback = MESSAGE_BY_STATUS[status] ?? MESSAGE_BY_STATUS[FALLBACK_STATUS] ?? '';

  return {
    status: 'error',
    message: resolveMessage(body, fallback),
    data: null,
    errors: {
      code: asNonEmptyString(body.code) ?? CODE_BY_STATUS[status] ?? 'INTERNAL_SERVER_ERROR',
      field: asNonEmptyString(body.field) ?? '',
      detail: resolveDetail(body, fallback, exception instanceof HttpException),
    },
  };
}

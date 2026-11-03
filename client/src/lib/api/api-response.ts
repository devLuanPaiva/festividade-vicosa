export interface ApiErrorDetails {
  code: string;
  field: string;
  detail: string;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  data: null;
  errors: ApiErrorDetails;
}

export interface ApiResult<T> {
  status: 'success';
  result: T;
}

export interface ApiPage<T> {
  status: 'success';
  count: number;
  currentPage: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const UNEXPECTED_ERROR_DETAILS: ApiErrorDetails = {
  code: 'UNEXPECTED_ERROR',
  field: '',
  detail: 'Não foi possível concluir a operação. Tente novamente.',
};

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details: ApiErrorDetails;

  public constructor(statusCode: number, message: string, details: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value) || value.status !== 'error' || !isRecord(value.errors)) {
    return false;
  }
  return typeof value.errors.code === 'string' && typeof value.errors.detail === 'string';
}

export function toApiError(statusCode: number, body: unknown): ApiError {
  if (!isApiErrorResponse(body)) {
    return new ApiError(statusCode, UNEXPECTED_ERROR_DETAILS.detail, UNEXPECTED_ERROR_DETAILS);
  }

  const { field = '', code, detail } = body.errors;
  return new ApiError(statusCode, body.message, { code, field, detail });
}

export function messageForField(error: ApiError, field: string): string | undefined {
  return error.details.field === field ? error.details.detail : undefined;
}

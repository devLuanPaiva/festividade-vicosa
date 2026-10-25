import { ApiError } from '@/lib/api/api-response';
import type { FormErrorState } from '@/lib/forms/form-errors';

const BAD_GATEWAY_STATUS = 502;
const UNAUTHORIZED_STATUS = 401;
const GENERIC_MESSAGE = 'Não foi possível enviar esta foto. Tente novamente.';
const EXPIRED_SESSION_MESSAGE = 'Sua sessão expirou. Entre novamente para enviar fotos.';

export interface UploadFailure {
  status: number;
  body: FormErrorState;
}

export function messageFor(status: number, body: unknown): string {
  const message = (body as { errorMessage?: unknown } | null)?.errorMessage;
  if (typeof message === 'string') {
    return message;
  }
  return status === UNAUTHORIZED_STATUS ? EXPIRED_SESSION_MESSAGE : GENERIC_MESSAGE;
}

export function toUploadFailure(error: unknown): UploadFailure {
  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: { errorMessage: error.details.detail, errorField: error.details.field || null },
    };
  }
  return { status: BAD_GATEWAY_STATUS, body: { errorMessage: GENERIC_MESSAGE, errorField: null } };
}

export function invalidAlbumFailure(): UploadFailure {
  return {
    status: 400,
    body: { errorMessage: 'O álbum informado é inválido.', errorField: null },
  };
}

export function expiredSessionFailure(): UploadFailure {
  return {
    status: UNAUTHORIZED_STATUS,
    body: { errorMessage: EXPIRED_SESSION_MESSAGE, errorField: null },
  };
}

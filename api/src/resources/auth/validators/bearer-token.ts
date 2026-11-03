import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { apiError } from '../../../common/errors/api-error';

const BEARER_PREFIX = 'Bearer ';

export function extractBearerToken(request: Pick<Request, 'headers'>): string {
  const header = request.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedException(
      apiError('MISSING_TOKEN', 'Informe o token de acesso para continuar.'),
    );
  }

  return header.slice(BEARER_PREFIX.length).trim();
}

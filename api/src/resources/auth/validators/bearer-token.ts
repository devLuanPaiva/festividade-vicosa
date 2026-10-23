import { UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

const BEARER_PREFIX = 'Bearer ';

export function extractBearerToken(request: Pick<Request, 'headers'>): string {
  const header = request.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedException('Missing bearer token');
  }

  return header.slice(BEARER_PREFIX.length).trim();
}

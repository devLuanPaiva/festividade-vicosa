import { ApiError } from '@/lib/api/api-response';
import { sendApiRequest } from '@/lib/api/server-fetch';
import type { AuthTokens } from './auth-tokens';

const UNAUTHORIZED_STATUS = 401;

export type SessionRenewal =
  { kind: 'renewed'; tokens: AuthTokens } | { kind: 'rejected' } | { kind: 'unavailable' };

export async function renewSession(refreshToken: string): Promise<SessionRenewal> {
  try {
    const tokens = await sendApiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
    return { kind: 'renewed', tokens };
  } catch (error) {
    const wasRejected = error instanceof ApiError && error.statusCode === UNAUTHORIZED_STATUS;
    return { kind: wasRejected ? 'rejected' : 'unavailable' };
  }
}

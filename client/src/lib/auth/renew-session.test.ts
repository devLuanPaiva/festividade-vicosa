import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/lib/api/api-response';
import { renewSession } from './renew-session';

const sendApiRequest = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api/server-fetch', () => ({ sendApiRequest }));

const DETAILS = { code: 'INVALID_REFRESH_TOKEN', field: '', detail: 'Sessão expirada.' };
const TOKENS = {
  accessToken: 'access',
  accessTokenExpiresAt: '2026-12-10T12:15:00.000Z',
  refreshToken: 'refresh',
  refreshTokenExpiresAt: '2026-12-17T12:00:00.000Z',
};

describe('renewSession', () => {
  afterEach(() => {
    sendApiRequest.mockReset();
  });

  it('returns the new tokens', async () => {
    sendApiRequest.mockResolvedValue(TOKENS);

    await expect(renewSession('old')).resolves.toEqual({ kind: 'renewed', tokens: TOKENS });
  });

  it('reports a rejected session when the api refuses the refresh token', async () => {
    sendApiRequest.mockRejectedValue(new ApiError(401, 'Não autorizado', DETAILS));

    await expect(renewSession('old')).resolves.toEqual({ kind: 'rejected' });
  });

  it('keeps the user signed in when the api is down or fails', async () => {
    sendApiRequest.mockRejectedValueOnce(new ApiError(503, 'Indisponível', DETAILS));
    sendApiRequest.mockRejectedValueOnce(new TypeError('fetch failed'));

    await expect(renewSession('old')).resolves.toEqual({ kind: 'unavailable' });
    await expect(renewSession('old')).resolves.toEqual({ kind: 'unavailable' });
  });
});

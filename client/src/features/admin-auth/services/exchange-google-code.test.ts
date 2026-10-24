import { afterEach, describe, expect, it, vi } from 'vitest';
import { exchangeGoogleCode } from './exchange-google-code';

const CONFIG = {
  clientId: 'client-id',
  clientSecret: 'client-secret',
  redirectUri: 'https://site.example.com/admin/login/google/callback',
};

function stubGoogle(status: number, body: unknown): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('exchangeGoogleCode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the code with the PKCE verifier and returns the identity token', async () => {
    const fetchMock = stubGoogle(200, { id_token: 'google.id.token' });

    await expect(exchangeGoogleCode(CONFIG, 'auth-code', 'verifier')).resolves.toBe(
      'google.id.token',
    );

    const [, init] = fetchMock.mock.calls[0] as [string, { body: URLSearchParams }];
    expect(Object.fromEntries(init.body)).toMatchObject({
      code: 'auth-code',
      code_verifier: 'verifier',
      client_secret: 'client-secret',
      redirect_uri: CONFIG.redirectUri,
      grant_type: 'authorization_code',
    });
  });

  it('fails when Google refuses the code', async () => {
    stubGoogle(400, { error: 'invalid_grant' });

    await expect(exchangeGoogleCode(CONFIG, 'used-code', 'verifier')).rejects.toThrow();
  });

  it('fails when the answer carries no identity token', async () => {
    stubGoogle(200, { access_token: 'only-access' });

    await expect(exchangeGoogleCode(CONFIG, 'auth-code', 'verifier')).rejects.toThrow();
  });
});

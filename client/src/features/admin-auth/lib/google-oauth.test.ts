import { describe, expect, it } from 'vitest';
import { buildAuthorizationUrl, createCodeChallenge, createRandomToken } from './google-oauth';

describe('google oauth helpers', () => {
  it('derives the S256 code challenge defined by the PKCE specification', async () => {
    const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

    await expect(createCodeChallenge(verifier)).resolves.toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
  });

  it('creates url safe random tokens that differ on every call', () => {
    const first = createRandomToken();

    expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(createRandomToken()).not.toBe(first);
  });

  it('asks Google for the authorization code with PKCE, state and nonce', () => {
    const url = new URL(
      buildAuthorizationUrl({
        clientId: 'client-id',
        redirectUri: 'https://site.example.com/admin/login/google/callback',
        state: 'state-value',
        nonce: 'nonce-value',
        codeChallenge: 'challenge-value',
      }),
    );

    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth');
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      client_id: 'client-id',
      redirect_uri: 'https://site.example.com/admin/login/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      state: 'state-value',
      nonce: 'nonce-value',
      code_challenge: 'challenge-value',
      code_challenge_method: 'S256',
    });
  });
});

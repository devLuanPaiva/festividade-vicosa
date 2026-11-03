import { afterEach, describe, expect, it, vi } from 'vitest';
import { getGoogleOAuthConfig } from './server-env';

describe('getGoogleOAuthConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is unavailable until both the client id and the secret are set', () => {
    vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', '');

    expect(getGoogleOAuthConfig()).toBeNull();
  });

  it('builds the callback url from the public site url, ignoring a trailing slash', () => {
    vi.stubEnv('GOOGLE_CLIENT_ID', 'client-id');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'client-secret');
    vi.stubEnv('SITE_URL', 'https://festividade.example.com/');

    expect(getGoogleOAuthConfig()).toEqual({
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: 'https://festividade.example.com/admin/login/google/callback',
    });
  });
});

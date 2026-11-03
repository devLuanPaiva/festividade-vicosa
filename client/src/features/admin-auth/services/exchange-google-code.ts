import type { GoogleOAuthConfig } from '@/lib/config/server-env';

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

export async function exchangeGoogleCode(
  config: GoogleOAuthConfig,
  code: string,
  verifier: string,
): Promise<string> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      code_verifier: verifier,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });
  const body = (await response.json().catch(() => null)) as { id_token?: unknown } | null;
  if (!response.ok || typeof body?.id_token !== 'string') {
    throw new Error('Google did not return an identity token');
  }
  return body.id_token;
}

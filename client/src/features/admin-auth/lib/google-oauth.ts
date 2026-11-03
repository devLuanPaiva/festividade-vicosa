const AUTHORIZATION_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const RANDOM_BYTES = 32;

export interface AuthorizationRequest {
  clientId: string;
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
}

function toBase64Url(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').split('=')[0] ?? '';
}

export function createRandomToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(RANDOM_BYTES)));
}

export async function createCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return toBase64Url(new Uint8Array(digest));
}

export function buildAuthorizationUrl(request: AuthorizationRequest): string {
  const query = new URLSearchParams({
    client_id: request.clientId,
    redirect_uri: request.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: request.state,
    nonce: request.nonce,
    code_challenge: request.codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  });
  return `${AUTHORIZATION_ENDPOINT}?${query.toString()}`;
}

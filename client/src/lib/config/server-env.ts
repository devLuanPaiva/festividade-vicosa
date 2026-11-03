const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_SITE_URL = 'http://localhost:3001';
const DEFAULT_MEDIA_PUBLIC_URL = 'https://cdn.jocevs.com.br';
const GOOGLE_CALLBACK_PATH = '/admin/login/google/callback';

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function withoutTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function getApiBaseUrl(): string {
  return withoutTrailingSlash(process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL);
}

export function getSiteUrl(): string {
  return withoutTrailingSlash(process.env.SITE_URL ?? DEFAULT_SITE_URL);
}

export function getMediaPublicUrl(): string {
  return withoutTrailingSlash(process.env.MEDIA_PUBLIC_URL || DEFAULT_MEDIA_PUBLIC_URL);
}

export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }
  return { clientId, clientSecret, redirectUri: `${getSiteUrl()}${GOOGLE_CALLBACK_PATH}` };
}

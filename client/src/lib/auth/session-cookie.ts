import { cookies } from 'next/headers';
import type { AuthTokens } from './auth-tokens';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  expiredSessionCookieOptions,
  sessionCookieOptions,
} from './session-cookie-options';

export async function readSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value ?? null;
}

export async function storeSession(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies();
  const options = sessionCookieOptions(tokens.refreshTokenExpiresAt);
  cookieStore.set(ACCESS_COOKIE_NAME, tokens.accessToken, options);
  cookieStore.set(REFRESH_COOKIE_NAME, tokens.refreshToken, options);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const options = expiredSessionCookieOptions();
  cookieStore.set(ACCESS_COOKIE_NAME, '', options);
  cookieStore.set(REFRESH_COOKIE_NAME, '', options);
}

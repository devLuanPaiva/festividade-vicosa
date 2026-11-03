import { NextResponse, type NextRequest } from 'next/server';
import type { AuthTokens } from '@/lib/auth/auth-tokens';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/auth-paths';
import { renewSession } from '@/lib/auth/renew-session';
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  expiredSessionCookieOptions,
  sessionCookieOptions,
} from '@/lib/auth/session-cookie-options';
import { needsRenewal } from '@/lib/auth/token-expiry';

const MILLISECONDS_PER_SECOND = 1000;

function continueWithTokens(request: NextRequest, tokens: AuthTokens): NextResponse {
  request.cookies.set(ACCESS_COOKIE_NAME, tokens.accessToken);
  request.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken);
  const response = NextResponse.next({ request });
  const options = sessionCookieOptions(tokens.refreshTokenExpiresAt);
  response.cookies.set(ACCESS_COOKIE_NAME, tokens.accessToken, options);
  response.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, options);
  return response;
}

function redirectToLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  const options = expiredSessionCookieOptions();
  response.cookies.set(ACCESS_COOKIE_NAME, '', options);
  response.cookies.set(REFRESH_COOKIE_NAME, '', options);
  return response;
}

async function renewAndContinue(request: NextRequest, refreshToken: string): Promise<NextResponse> {
  const renewal = await renewSession(refreshToken);
  if (renewal.kind === 'renewed') {
    return continueWithTokens(request, renewal.tokens);
  }
  return renewal.kind === 'rejected' ? redirectToLogin(request) : NextResponse.next();
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const nowInSeconds = Date.now() / MILLISECONDS_PER_SECOND;
  if (refreshToken && needsRenewal(accessToken, nowInSeconds)) {
    return renewAndContinue(request, refreshToken);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};

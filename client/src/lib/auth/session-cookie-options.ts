export const ACCESS_COOKIE_NAME = 'festividade_access';
export const REFRESH_COOKIE_NAME = 'festividade_refresh';

const SESSION_COOKIE_PATH = '/admin';
const MILLISECONDS_PER_SECOND = 1000;

export interface SessionCookieOptions {
  httpOnly: true;
  sameSite: 'lax';
  secure: boolean;
  path: string;
  maxAge: number;
}

export function secondsUntil(isoDate: string, nowInMilliseconds: number): number {
  const remaining = new Date(isoDate).getTime() - nowInMilliseconds;
  return Math.max(0, Math.floor(remaining / MILLISECONDS_PER_SECOND));
}

export function sessionCookieOptions(
  refreshTokenExpiresAt: string,
  nowInMilliseconds: number = Date.now(),
): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: SESSION_COOKIE_PATH,
    maxAge: secondsUntil(refreshTokenExpiresAt, nowInMilliseconds),
  };
}

export function expiredSessionCookieOptions(): SessionCookieOptions {
  return { ...sessionCookieOptions(new Date(0).toISOString()), maxAge: 0 };
}

import { NextResponse } from 'next/server';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/auth-paths';
import { getSiteUrl } from '@/lib/config/server-env';

export function redirectToLogin(errorCode: string): NextResponse {
  const path = `${ADMIN_LOGIN_PATH}?error=${encodeURIComponent(errorCode)}`;
  return NextResponse.redirect(new URL(path, getSiteUrl()));
}

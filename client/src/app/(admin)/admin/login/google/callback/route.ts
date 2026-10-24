import { NextResponse, type NextRequest } from 'next/server';
import { resolveCallback } from '@/features/admin-auth/lib/google-callback';
import type { GoogleFlow } from '@/features/admin-auth/lib/google-flow';
import { googleErrorCode } from '@/features/admin-auth/lib/google-login-errors';
import { redirectToLogin } from '@/features/admin-auth/lib/login-redirect';
import { completeGoogleLogin } from '@/features/admin-auth/services/complete-google-login';
import { takeGoogleFlow } from '@/features/admin-auth/services/google-flow-cookie';
import { ApiError } from '@/lib/api/api-response';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import { getGoogleOAuthConfig, getSiteUrl } from '@/lib/config/server-env';

function failureCode(error: unknown): string {
  return error instanceof ApiError ? googleErrorCode(error.details.code) : 'google-failed';
}

async function tryCompleteLogin(code: string, flow: GoogleFlow | null): Promise<string | null> {
  const config = getGoogleOAuthConfig();
  if (!flow || !config) {
    return 'google-unavailable';
  }
  try {
    await completeGoogleLogin({ config, flow, code });
    return null;
  } catch (error) {
    return failureCode(error);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const flow = await takeGoogleFlow();
  const outcome = resolveCallback(request.nextUrl.searchParams, flow?.state ?? null);
  if (outcome.kind === 'failure') {
    return redirectToLogin(outcome.errorCode);
  }
  const errorCode = await tryCompleteLogin(outcome.code, flow);
  return errorCode
    ? redirectToLogin(errorCode)
    : NextResponse.redirect(new URL(ADMIN_HOME_PATH, getSiteUrl()));
}

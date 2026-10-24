import { NextResponse } from 'next/server';
import { createCodeChallenge, buildAuthorizationUrl } from '@/features/admin-auth/lib/google-oauth';
import { createGoogleFlow } from '@/features/admin-auth/lib/google-flow';
import { redirectToLogin } from '@/features/admin-auth/lib/login-redirect';
import { storeGoogleFlow } from '@/features/admin-auth/services/google-flow-cookie';
import { getGoogleOAuthConfig } from '@/lib/config/server-env';

export async function GET(): Promise<NextResponse> {
  const config = getGoogleOAuthConfig();
  if (!config) {
    return redirectToLogin('google-unavailable');
  }
  const flow = createGoogleFlow();
  await storeGoogleFlow(flow);
  const authorizationUrl = buildAuthorizationUrl({
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    state: flow.state,
    nonce: flow.nonce,
    codeChallenge: await createCodeChallenge(flow.verifier),
  });
  return NextResponse.redirect(authorizationUrl);
}

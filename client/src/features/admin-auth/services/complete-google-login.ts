import { sendApiRequest } from '@/lib/api/server-fetch';
import type { AuthTokens } from '@/lib/auth/auth-tokens';
import { storeSession } from '@/lib/auth/session-cookie';
import type { GoogleOAuthConfig } from '@/lib/config/server-env';
import type { GoogleFlow } from '../lib/google-flow';
import { exchangeGoogleCode } from './exchange-google-code';

interface GoogleLoginAttempt {
  config: GoogleOAuthConfig;
  flow: GoogleFlow;
  code: string;
}

export async function completeGoogleLogin({
  config,
  flow,
  code,
}: GoogleLoginAttempt): Promise<void> {
  const idToken = await exchangeGoogleCode(config, code, flow.verifier);
  const tokens = await sendApiRequest<AuthTokens>('/auth/google', {
    method: 'POST',
    body: { idToken, nonce: flow.nonce },
  });
  await storeSession(tokens);
}

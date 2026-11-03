export type CallbackOutcome =
  { kind: 'code'; code: string } | { kind: 'failure'; errorCode: string };

const GOOGLE_ACCESS_DENIED = 'access_denied';

export function resolveCallback(
  query: URLSearchParams,
  expectedState: string | null,
): CallbackOutcome {
  if (query.get('error') === GOOGLE_ACCESS_DENIED) {
    return { kind: 'failure', errorCode: 'google-cancelled' };
  }
  const state = query.get('state');
  if (!expectedState || state !== expectedState) {
    return { kind: 'failure', errorCode: 'google-state' };
  }
  const code = query.get('code');
  return code ? { kind: 'code', code } : { kind: 'failure', errorCode: 'google-failed' };
}

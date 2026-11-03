const RENEWAL_MARGIN_IN_SECONDS = 60;

function decodePayload(token: string): unknown {
  const encoded = token.split('.')[1];
  if (!encoded) {
    return null;
  }
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function readTokenExpiry(token: string): number | null {
  const payload = decodePayload(token);
  const expiry =
    typeof payload === 'object' && payload !== null ? (payload as { exp?: unknown }).exp : null;
  return typeof expiry === 'number' ? expiry : null;
}

export function needsRenewal(accessToken: string | undefined, nowInSeconds: number): boolean {
  const expiry = accessToken ? readTokenExpiry(accessToken) : null;
  return expiry === null || expiry - nowInSeconds <= RENEWAL_MARGIN_IN_SECONDS;
}

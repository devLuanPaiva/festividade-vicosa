const EMAIL_TRACKER_PREFIX = 'login-email:';

export function resolveLoginTracker(body: unknown, fallbackTracker: string): string {
  const email = (body as { email?: unknown } | null | undefined)?.email;
  if (typeof email !== 'string' || email.trim() === '') {
    return fallbackTracker;
  }
  return `${EMAIL_TRACKER_PREFIX}${email.trim().toLowerCase()}`;
}

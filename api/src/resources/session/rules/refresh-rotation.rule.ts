export const ROTATION_LEEWAY_IN_MILLISECONDS = 10_000;

export type RefreshVerdict = 'ROTATE' | 'EXPIRED' | 'REUSED';

export interface RefreshTokenState {
  expiresAt: Date;
  rotatedAt: Date | null;
}

export function judgeRefreshToken(token: RefreshTokenState, now: Date): RefreshVerdict {
  if (token.expiresAt.getTime() <= now.getTime()) {
    return 'EXPIRED';
  }
  if (token.rotatedAt === null) {
    return 'ROTATE';
  }
  const elapsed = now.getTime() - token.rotatedAt.getTime();
  return elapsed <= ROTATION_LEEWAY_IN_MILLISECONDS ? 'ROTATE' : 'REUSED';
}

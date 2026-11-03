import { describe, expect, it } from 'vitest';
import { needsRenewal, readTokenExpiry } from './token-expiry';

const NOW_IN_SECONDS = 1_800_000_000;

function tokenExpiringAt(expiry: number): string {
  const payload = btoa(JSON.stringify({ sub: 'user', exp: expiry }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .split('=')[0];
  return `header.${payload}.signature`;
}

describe('token expiry', () => {
  it('reads the expiry from a url-safe jwt payload', () => {
    expect(readTokenExpiry(tokenExpiringAt(NOW_IN_SECONDS + 900))).toBe(NOW_IN_SECONDS + 900);
  });

  it('keeps a token that is far from expiring', () => {
    expect(needsRenewal(tokenExpiringAt(NOW_IN_SECONDS + 600), NOW_IN_SECONDS)).toBe(false);
  });

  it('renews a token that expires within the margin or already expired', () => {
    expect(needsRenewal(tokenExpiringAt(NOW_IN_SECONDS + 30), NOW_IN_SECONDS)).toBe(true);
    expect(needsRenewal(tokenExpiringAt(NOW_IN_SECONDS - 5), NOW_IN_SECONDS)).toBe(true);
  });

  it('renews when there is no token or it is not a readable jwt', () => {
    expect(needsRenewal(undefined, NOW_IN_SECONDS)).toBe(true);
    expect(needsRenewal('not-a-jwt', NOW_IN_SECONDS)).toBe(true);
    expect(needsRenewal('a.%%%.c', NOW_IN_SECONDS)).toBe(true);
  });
});

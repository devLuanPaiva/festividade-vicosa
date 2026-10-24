import { describe, expect, it } from 'vitest';
import { resolveCallback } from './google-callback';

function query(values: Record<string, string>): URLSearchParams {
  return new URLSearchParams(values);
}

describe('resolveCallback', () => {
  it('accepts the authorization code when the state matches the one we issued', () => {
    expect(resolveCallback(query({ code: 'abc', state: 's1' }), 's1')).toEqual({
      kind: 'code',
      code: 'abc',
    });
  });

  it('rejects a callback whose state differs, which is how a forged login looks', () => {
    expect(resolveCallback(query({ code: 'abc', state: 'other' }), 's1')).toEqual({
      kind: 'failure',
      errorCode: 'google-state',
    });
  });

  it('rejects a callback that arrives without a pending login', () => {
    expect(resolveCallback(query({ code: 'abc', state: 's1' }), null)).toMatchObject({
      errorCode: 'google-state',
    });
  });

  it('reports when the person refused to share their account', () => {
    expect(resolveCallback(query({ error: 'access_denied', state: 's1' }), 's1')).toEqual({
      kind: 'failure',
      errorCode: 'google-cancelled',
    });
  });

  it('reports a callback that carries no code', () => {
    expect(resolveCallback(query({ state: 's1' }), 's1')).toEqual({
      kind: 'failure',
      errorCode: 'google-failed',
    });
  });
});

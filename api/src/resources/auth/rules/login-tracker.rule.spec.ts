import { resolveLoginTracker } from './login-tracker.rule';

describe('resolveLoginTracker', () => {
  const FALLBACK = 'ip-10.0.0.1';

  it('counts attempts per account, ignoring case and spaces', () => {
    const first = resolveLoginTracker({ email: 'Ana@Jocevs.com.br ' }, FALLBACK);
    const second = resolveLoginTracker({ email: 'ana@jocevs.com.br' }, FALLBACK);

    expect(first).toBe(second);
  });

  it('keeps different accounts from sharing the same limit', () => {
    const ana = resolveLoginTracker({ email: 'ana@jocevs.com.br' }, FALLBACK);
    const bruno = resolveLoginTracker({ email: 'bruno@jocevs.com.br' }, FALLBACK);

    expect(ana).not.toBe(bruno);
  });

  it.each([
    ['no body', undefined],
    ['null body', null],
    ['email missing', {}],
    ['email not a string', { email: 42 }],
    ['blank email', { email: '   ' }],
  ])('falls back to the request tracker when there is %s', (_case, body) => {
    expect(resolveLoginTracker(body, FALLBACK)).toBe(FALLBACK);
  });
});

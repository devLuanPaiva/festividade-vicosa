import {
  isGoogleIdentityProblem,
  resolveGoogleIdentity,
  type GoogleClaims,
} from './google-identity.rule';

const NONCE = 'expected-nonce';

const VERIFIED_CLAIMS: GoogleClaims = {
  email: 'Ana@Example.com',
  email_verified: true,
  name: 'Ana',
  nonce: NONCE,
};

describe('resolveGoogleIdentity', () => {
  it('returns the e-mail in lower case so it matches the stored users', () => {
    expect(resolveGoogleIdentity(VERIFIED_CLAIMS, NONCE)).toEqual({
      email: 'ana@example.com',
      name: 'Ana',
    });
  });

  it('falls back to the e-mail when Google sends no name', () => {
    const identity = resolveGoogleIdentity({ ...VERIFIED_CLAIMS, name: undefined }, NONCE);

    expect(identity).toMatchObject({ name: 'ana@example.com' });
  });

  it('rejects a token issued for another login attempt', () => {
    const result = resolveGoogleIdentity({ ...VERIFIED_CLAIMS, nonce: 'other' }, NONCE);

    expect(result).toMatchObject({ code: 'GOOGLE_NONCE_MISMATCH' });
  });

  it('rejects a token without nonce even if the expected nonce is empty', () => {
    const result = resolveGoogleIdentity({ ...VERIFIED_CLAIMS, nonce: undefined }, '');

    expect(isGoogleIdentityProblem(result)).toBe(true);
  });

  it.each([
    ['unverified e-mail', { email_verified: false }],
    ['missing verification flag', { email_verified: undefined }],
    ['missing e-mail', { email: undefined }],
  ])('rejects %s', (_name, changes) => {
    const result = resolveGoogleIdentity({ ...VERIFIED_CLAIMS, ...changes }, NONCE);

    expect(result).toMatchObject({ code: 'GOOGLE_EMAIL_UNVERIFIED' });
  });
});

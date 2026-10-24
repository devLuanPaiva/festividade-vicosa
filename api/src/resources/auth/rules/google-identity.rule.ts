export interface GoogleClaims {
  email?: string;
  email_verified?: boolean;
  name?: string;
  nonce?: string;
}

export interface GoogleIdentity {
  email: string;
  name: string;
}

export interface GoogleIdentityProblem {
  code: string;
  detail: string;
}

export function isGoogleIdentityProblem(
  result: GoogleIdentity | GoogleIdentityProblem,
): result is GoogleIdentityProblem {
  return 'code' in result;
}

export function resolveGoogleIdentity(
  claims: GoogleClaims,
  expectedNonce: string,
): GoogleIdentity | GoogleIdentityProblem {
  if (claims.nonce !== expectedNonce) {
    return {
      code: 'GOOGLE_NONCE_MISMATCH',
      detail: 'Não foi possível confirmar o login com Google.',
    };
  }
  if (!claims.email || claims.email_verified !== true) {
    return {
      code: 'GOOGLE_EMAIL_UNVERIFIED',
      detail: 'O e-mail da conta Google não foi verificado.',
    };
  }
  const email = claims.email.toLowerCase();
  return { email, name: claims.name ?? email };
}

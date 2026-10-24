import { describe, expect, it } from 'vitest';
import { googleErrorCode, googleErrorMessage } from './google-login-errors';

describe('google login errors', () => {
  it('tells an unregistered e-mail how to get access', () => {
    expect(googleErrorMessage('GOOGLE_EMAIL_NOT_AUTHORIZED')).toContain('Fale com o administrador');
  });

  it('shows nothing when the login page has no error', () => {
    expect(googleErrorMessage(undefined)).toBeNull();
  });

  it('never shows text taken from the url, even if someone crafts a link', () => {
    const crafted = 'Sua conta foi bloqueada, ligue para 0000';

    expect(googleErrorMessage(crafted)).not.toContain('bloqueada');
    expect(googleErrorCode(crafted)).toBe('google-failed');
  });

  it('keeps the code of known api errors so the right message is shown', () => {
    expect(googleErrorCode('GOOGLE_EMAIL_NOT_AUTHORIZED')).toBe('GOOGLE_EMAIL_NOT_AUTHORIZED');
  });
});

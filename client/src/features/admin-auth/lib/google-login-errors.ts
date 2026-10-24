const GENERIC_MESSAGE = 'Não foi possível entrar com o Google. Tente novamente.';

const MESSAGES: Record<string, string> = {
  'google-cancelled': 'O login com Google foi cancelado.',
  'google-state': 'A tentativa de login expirou. Tente novamente.',
  'google-failed': GENERIC_MESSAGE,
  'google-unavailable': 'O login com Google não está disponível no momento.',
  GOOGLE_EMAIL_NOT_AUTHORIZED: 'Este e-mail não tem acesso ao painel. Fale com o administrador.',
  GOOGLE_EMAIL_UNVERIFIED: 'O e-mail da conta Google não foi verificado.',
  GOOGLE_LOGIN_UNAVAILABLE: 'O login com Google não está disponível no momento.',
};

export function googleErrorCode(code: string): string {
  return code in MESSAGES ? code : 'google-failed';
}

export function googleErrorMessage(code: string | undefined): string | null {
  if (!code) {
    return null;
  }
  return MESSAGES[code] ?? GENERIC_MESSAGE;
}

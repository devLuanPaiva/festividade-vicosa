import type { ReactElement } from 'react';
import { googleErrorMessage } from '../lib/google-login-errors';

interface GoogleLoginErrorProps {
  searchParams: Promise<{ error?: string }>;
}

export async function GoogleLoginError({
  searchParams,
}: GoogleLoginErrorProps): Promise<ReactElement | null> {
  const { error } = await searchParams;
  const message = googleErrorMessage(error);
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="rounded-xl bg-danger/10 p-4 text-sm font-semibold text-danger">
      {message}
    </p>
  );
}

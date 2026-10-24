'use server';

import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/api-response';
import { sendApiRequest } from '@/lib/api/server-fetch';
import { ADMIN_HOME_PATH } from '@/lib/auth/auth-paths';
import type { AuthTokens } from '@/lib/auth/auth-tokens';
import { storeSession } from '@/lib/auth/session-cookie';
import { readText } from '@/lib/forms/form-data';
import type { LoginFormState } from '../types';

function toFailureState(email: string, error: unknown): LoginFormState {
  if (!(error instanceof ApiError)) {
    throw error;
  }
  return { email, errorMessage: error.details.detail, errorField: error.details.field || null };
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = readText(formData, 'email');
  const password = String(formData.get('password') ?? '');
  try {
    const tokens = await sendApiRequest<AuthTokens>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await storeSession(tokens);
  } catch (error) {
    return toFailureState(email, error);
  }
  redirect(ADMIN_HOME_PATH);
}

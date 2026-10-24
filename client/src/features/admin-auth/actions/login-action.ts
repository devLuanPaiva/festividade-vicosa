'use server';

import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/api-response';
import { sendApiRequest } from '@/lib/api/server-fetch';
import { storeSessionToken } from '@/lib/auth/session-cookie';
import { readText } from '@/lib/forms/form-data';
import type { LoginFormState } from '../types';

const ADMIN_HOME_PATH = '/admin';

interface AccessToken {
  accessToken: string;
}

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
    const { accessToken } = await sendApiRequest<AccessToken>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await storeSessionToken(accessToken);
  } catch (error) {
    return toFailureState(email, error);
  }
  redirect(ADMIN_HOME_PATH);
}

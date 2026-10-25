import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/api-response';
import { sendApiCommand, sendApiRequest } from '@/lib/api/server-fetch';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/auth-paths';
import { requireSessionToken } from '@/lib/auth/current-user';
import type { FormErrorState } from '@/lib/forms/form-errors';

const UNAUTHORIZED_STATUS = 401;

interface AdminRequest {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

function toFailureState(error: unknown): FormErrorState {
  if (!(error instanceof ApiError)) {
    throw error;
  }
  if (error.statusCode === UNAUTHORIZED_STATUS) {
    redirect(ADMIN_LOGIN_PATH);
  }
  return { errorMessage: error.details.detail, errorField: error.details.field || null };
}

export async function submitAdminRequest(
  path: string,
  request: AdminRequest,
): Promise<FormErrorState | null> {
  const token = await requireSessionToken();
  try {
    await sendApiCommand(path, { ...request, token });
    return null;
  } catch (error) {
    return toFailureState(error);
  }
}

export type AdminResult<T> = { ok: true; result: T } | { ok: false; failure: FormErrorState };

export async function requestAdminResult<T>(
  path: string,
  request: AdminRequest,
): Promise<AdminResult<T>> {
  const token = await requireSessionToken();
  try {
    return { ok: true, result: await sendApiRequest<T>(path, { ...request, token }) };
  } catch (error) {
    return { ok: false, failure: toFailureState(error) };
  }
}

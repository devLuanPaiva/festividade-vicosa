import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/api-response';
import { fetchApiResult } from '@/lib/api/server-fetch';
import { readSessionToken } from './session-cookie';
import type { AuthenticatedUser } from './permissions';

export const ADMIN_LOGIN_PATH = '/admin/login';

const UNAUTHORIZED_STATUS = 401;

export async function requireSessionToken(): Promise<string> {
  const token = await readSessionToken();
  if (!token) {
    redirect(ADMIN_LOGIN_PATH);
  }
  return token;
}

export async function findCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = await readSessionToken();
  if (!token) {
    return null;
  }
  try {
    return await fetchApiResult<AuthenticatedUser>('/auth/me', token);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === UNAUTHORIZED_STATUS) {
      return null;
    }
    throw error;
  }
}

export async function requireCurrentUser(): Promise<AuthenticatedUser> {
  const user = await findCurrentUser();
  if (!user) {
    redirect(ADMIN_LOGIN_PATH);
  }
  return user;
}

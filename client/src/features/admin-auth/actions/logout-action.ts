'use server';

import { redirect } from 'next/navigation';
import { sendApiRequest } from '@/lib/api/server-fetch';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/auth-paths';
import { clearSession, readRefreshToken } from '@/lib/auth/session-cookie';

async function endSessionOnApi(refreshToken: string | null): Promise<void> {
  if (!refreshToken) {
    return;
  }
  try {
    await sendApiRequest('/auth/logout', { method: 'POST', body: { refreshToken } });
  } catch {
    return;
  }
}

export async function logoutAction(): Promise<void> {
  await endSessionOnApi(await readRefreshToken());
  await clearSession();
  redirect(ADMIN_LOGIN_PATH);
}

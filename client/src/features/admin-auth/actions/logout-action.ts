'use server';

import { redirect } from 'next/navigation';
import { ADMIN_LOGIN_PATH } from '@/lib/auth/current-user';
import { clearSessionToken } from '@/lib/auth/session-cookie';

export async function logoutAction(): Promise<void> {
  await clearSessionToken();
  redirect(ADMIN_LOGIN_PATH);
}

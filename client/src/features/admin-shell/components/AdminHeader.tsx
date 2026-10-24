import type { ReactElement } from 'react';
import { logoutAction } from '@/features/admin-auth/actions/logout-action';
import { requireCurrentUser } from '@/lib/auth/current-user';

export async function AdminHeader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="truncate text-sm text-admin-muted">
        Olá, <span className="font-semibold text-admin-ink">{user.name}</span>
      </p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="min-h-11 rounded-xl border border-admin-line bg-admin-surface px-4 text-sm font-semibold hover:border-brand-500"
        >
          Sair
        </button>
      </form>
    </div>
  );
}

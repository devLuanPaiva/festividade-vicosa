import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/ui/SubmitButton';
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
        <SubmitButton variant="secondary" pendingLabel="Saindo…" className="min-h-11 px-4 text-sm">
          Sair
        </SubmitButton>
      </form>
    </div>
  );
}

import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { ADMIN_LIVE_PATH } from '@/features/admin-shell/lib/admin-sections';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { createLiveAction } from '../actions/live-actions';
import { EMPTY_LIVE_VALUES } from '../types';
import { LiveForm } from './LiveForm';

export async function NewLiveLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'live:manage')) {
    return <NoPermission action="gerir a transmissão ao vivo" />;
  }
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Nova transmissão</h1>
        <p className="text-sm text-admin-muted">
          Depois de salvar, envie a arte de preview e ligue a transmissão na página inicial.
        </p>
      </header>
      <LiveForm
        action={createLiveAction}
        initialValues={EMPTY_LIVE_VALUES}
        cancelHref={ADMIN_LIVE_PATH}
        submitLabel="Salvar transmissão"
      />
    </>
  );
}

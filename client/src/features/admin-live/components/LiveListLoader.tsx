import Link from 'next/link';
import type { ReactElement } from 'react';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { NEW_LIVE_PATH } from '../lib/live-paths';
import { getLiveStreams } from '../services/get-live-streams';
import { LiveRow } from './LiveRow';

export async function LiveListLoader(): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'live:manage')) {
    return <NoPermission action="gerir a transmissão ao vivo" />;
  }
  const liveStreams = await getLiveStreams();
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Transmissão ao vivo</h1>
          <p className="text-sm text-admin-muted">
            A transmissão ligada aparece na página inicial. Só uma fica ligada por vez.
          </p>
        </div>
        <Link
          href={NEW_LIVE_PATH}
          className="inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
        >
          Nova transmissão
        </Link>
      </header>
      <div className="overflow-hidden rounded-2xl border border-admin-line bg-admin-surface">
        {liveStreams.length === 0 ? (
          <p className="p-6 text-sm text-admin-muted">
            Nenhuma transmissão cadastrada. Crie uma com o link do YouTube e a data de início.
          </p>
        ) : (
          <ul className="divide-y divide-admin-line">
            {liveStreams.map((liveStream) => (
              <LiveRow key={liveStream.id} liveStream={liveStream} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

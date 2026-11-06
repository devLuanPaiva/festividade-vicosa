import type { ReactElement } from 'react';
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog';
import { NoPermission } from '@/features/admin-shell/components/NoPermission';
import { PhotoSection } from '@/features/admin-shell/components/PhotoSection';
import { ADMIN_LIVE_PATH } from '@/features/admin-shell/lib/admin-sections';
import { resolvePhotoUrl } from '@/features/games/lib/photo-url';
import { orNotFound } from '@/lib/api/missing-resource';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { hasPermission } from '@/lib/auth/permissions';
import { deleteLiveAction, updateLiveAction } from '../actions/live-actions';
import { removeLivePreviewAction, uploadLivePreviewAction } from '../actions/live-preview-actions';
import { toLiveFormValues } from '../lib/live-form-values';
import { getLiveStream } from '../services/get-live-streams';
import { LiveForm } from './LiveForm';

interface EditLiveLoaderProps {
  params: Promise<{ liveId: string }>;
}

export async function EditLiveLoader({
  params,
}: Readonly<EditLiveLoaderProps>): Promise<ReactElement> {
  const user = await requireCurrentUser();
  if (!hasPermission(user, 'live:manage')) {
    return <NoPermission action="gerir a transmissão ao vivo" />;
  }
  const liveStream = await orNotFound(getLiveStream((await params).liveId));
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{liveStream.title}</h1>
        <p className="text-sm text-admin-muted">
          {liveStream.active
            ? 'Esta transmissão está na página inicial.'
            : 'Esta transmissão está desligada.'}
        </p>
      </header>
      <PhotoSection
        title="Arte de preview"
        alt={`Arte de preview de ${liveStream.title}`}
        photoUrl={resolvePhotoUrl(liveStream.previewKey)}
        uploadAction={uploadLivePreviewAction.bind(null, liveStream.id)}
        removeAction={removeLivePreviewAction.bind(null, liveStream.id)}
      />
      <LiveForm
        action={updateLiveAction.bind(null, liveStream.id)}
        initialValues={toLiveFormValues(liveStream)}
        cancelHref={ADMIN_LIVE_PATH}
        submitLabel="Salvar alterações"
      />
      <section
        aria-labelledby="delete-live-title"
        className="flex items-center justify-between gap-3 border-t border-admin-line pt-5"
      >
        <div className="flex flex-col gap-1">
          <h2 id="delete-live-title" className="font-bold">
            Excluir transmissão
          </h2>
          <p className="text-sm text-admin-muted">A arte de preview também é apagada.</p>
        </div>
        <ConfirmDeleteDialog
          triggerLabel="Excluir transmissão"
          title={`Excluir a transmissão '${liveStream.title}'?`}
          description="Esta ação não pode ser desfeita."
          confirmLabel="Excluir transmissão"
          action={deleteLiveAction.bind(null, liveStream.id)}
        />
      </section>
    </>
  );
}

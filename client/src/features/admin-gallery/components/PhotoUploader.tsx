'use client';

import { MotionConfig } from 'motion/react';
import type { ReactElement } from 'react';
import { usePhotoStaging } from '../hooks/use-photo-staging';
import { summarizeStaging } from '../lib/staging-summary';
import type { AlbumTarget } from '../types';
import { PhotoDropzone } from './PhotoDropzone';
import { StagedPhotoList } from './StagedPhotoList';
import { UploadActionBar } from './UploadActionBar';
import { UploadMessages } from './UploadMessages';

interface PhotoUploaderProps {
  target: AlbumTarget;
  refresh: () => Promise<unknown>;
}

export function PhotoUploader({ target, refresh }: PhotoUploaderProps): ReactElement {
  const staging = usePhotoStaging(target, refresh);
  const hasPhotos = staging.items.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="photo-uploader-title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="photo-uploader-title" className="font-bold">
            Adicionar fotos
          </h2>
          <p className="text-sm text-admin-muted">
            Escolha as fotos, confira as prévias e envie. Elas são reduzidas no aparelho antes do
            envio e entram no fim do álbum.
          </p>
        </div>
        <PhotoDropzone onFiles={staging.add} disabled={staging.isSending} compact={hasPhotos} />
        <UploadMessages notices={staging.notices} sentCount={staging.sentCount} />
        {hasPhotos ? (
          <>
            <StagedPhotoList
              items={staging.items}
              isSending={staging.isSending}
              onRemove={staging.remove}
            />
            <UploadActionBar
              summary={summarizeStaging(staging.items)}
              isSending={staging.isSending}
              onSend={staging.send}
              onClear={staging.clear}
            />
          </>
        ) : null}
      </section>
    </MotionConfig>
  );
}

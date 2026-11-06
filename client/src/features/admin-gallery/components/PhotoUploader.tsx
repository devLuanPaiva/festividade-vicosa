'use client';

import type { ReactElement } from 'react';
import { ImageDropZone } from '@/features/admin-shell/components/ImageDropZone';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { usePhotoUploadQueue } from '../hooks/use-photo-upload-queue';
import { UploadQueueList } from './UploadQueueList';

const INPUT_ID = 'album-photos';

interface PhotoUploaderProps {
  upload: (formData: FormData) => Promise<FormErrorState>;
}

export function PhotoUploader({ upload }: Readonly<PhotoUploaderProps>): ReactElement {
  const { items, isRunning, start } = usePhotoUploadQueue(upload);

  return (
    <section aria-labelledby="photo-uploader-title" className="flex flex-col gap-3">
      <h2 id="photo-uploader-title" className="font-bold">
        Adicionar fotos
      </h2>
      <ImageDropZone
        id={INPUT_ID}
        multiple
        disabled={isRunning}
        title={isRunning ? 'Enviando as fotos…' : 'Arraste as fotos até aqui'}
        hint="Uma ou várias (JPG, PNG ou WebP). Elas são reduzidas e enviadas uma a uma, no fim do álbum."
        onFiles={start}
      />
      <UploadQueueList items={items} />
    </section>
  );
}

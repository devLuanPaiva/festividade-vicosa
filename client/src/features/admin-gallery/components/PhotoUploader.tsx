'use client';

import type { ChangeEvent, ReactElement } from 'react';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { usePhotoUploadQueue } from '../hooks/use-photo-upload-queue';
import { UploadQueueList } from './UploadQueueList';

const INPUT_ID = 'album-photos';

interface PhotoUploaderProps {
  upload: (formData: FormData) => Promise<FormErrorState>;
}

export function PhotoUploader({ upload }: PhotoUploaderProps): ReactElement {
  const { items, isRunning, start } = usePhotoUploadQueue(upload);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length > 0) {
      start(files);
    }
  };

  return (
    <section aria-labelledby="photo-uploader-title" className="flex flex-col gap-3">
      <h2 id="photo-uploader-title" className="font-bold">
        Adicionar fotos
      </h2>
      <p className="text-sm text-admin-muted">
        Escolha uma ou várias fotos (JPG, PNG ou WebP). Elas são reduzidas no aparelho e enviadas
        uma a uma, no fim do álbum.
      </p>
      <label
        htmlFor={INPUT_ID}
        aria-disabled={isRunning}
        className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700 ${isRunning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        {isRunning ? 'Enviando…' : 'Escolher fotos'}
      </label>
      <input
        id={INPUT_ID}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={isRunning}
        onChange={handleChange}
        className="sr-only"
      />
      <UploadQueueList items={items} />
    </section>
  );
}

'use client';

import { useState, type ChangeEvent, type DragEvent, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';

const INPUT_ID = 'album-photos';
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

interface PhotoDropzoneProps {
  onFiles: (files: File[]) => void;
  disabled: boolean;
  compact: boolean;
}

export function PhotoDropzone({ onFiles, disabled, compact }: PhotoDropzoneProps): ReactElement {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    onFiles(files);
  };
  const handleDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      onFiles(Array.from(event.dataTransfer.files));
    }
  };
  const handleDragOver = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(!disabled);
  };

  return (
    <>
      <input
        id={INPUT_ID}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        disabled={disabled}
        onChange={handleChange}
        className="peer sr-only"
      />
      <label
        htmlFor={INPUT_ID}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 text-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 ${compact ? 'py-5' : 'py-12'} ${isDragging ? 'scale-[1.01] border-brand-500 bg-brand-500/10' : 'border-brand-500/40 bg-brand-500/5 hover:border-brand-500 hover:bg-brand-500/10'}`}
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm">
          <Icon name="upload" className="size-6" />
        </span>
        <span className="font-semibold text-admin-ink">
          {compact ? 'Adicionar mais fotos' : 'Toque para escolher as fotos'}
        </span>
        <span className="text-sm text-admin-muted">ou arraste e solte aqui · JPG, PNG ou WebP</span>
      </label>
    </>
  );
}

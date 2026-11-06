'use client';

import { useState, type ChangeEvent, type DragEvent, type ReactElement } from 'react';
import { Icon } from '@/components/ui/Icon';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageDropZoneProps {
  id: string;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  title: string;
  hint: string;
  invalidMessageId?: string;
  onFiles: (files: File[]) => void;
}

function keepImages(files: FileList | File[], multiple: boolean): File[] {
  const images = Array.from(files).filter((file) => ACCEPTED_TYPES.includes(file.type));
  return multiple ? images : images.slice(0, 1);
}

function putFilesInInput(input: HTMLInputElement, files: File[]): void {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

interface DropHandlers {
  isDragging: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: DragEvent<HTMLLabelElement>) => void;
  onDragOver: (event: DragEvent<HTMLLabelElement>) => void;
  onDragLeave: () => void;
}

function useImageDrop({
  name,
  multiple = false,
  disabled = false,
  onFiles,
}: Readonly<Pick<ImageDropZoneProps, 'name' | 'multiple' | 'disabled' | 'onFiles'>>): DropHandlers {
  const [isDragging, setIsDragging] = useState(false);

  const deliver = (files: File[]): void => {
    if (files.length > 0) {
      onFiles(files);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    deliver(keepImages(event.target.files ?? [], multiple));
    if (!name) {
      event.target.value = '';
    }
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) {
      return;
    }
    const files = keepImages(event.dataTransfer.files, multiple);
    const input = event.currentTarget.control;
    if (name && input instanceof HTMLInputElement) {
      putFilesInInput(input, files);
    }
    deliver(files);
  };

  const onDragOver = (event: DragEvent<HTMLLabelElement>): void => {
    event.preventDefault();
    setIsDragging(!disabled);
  };

  return {
    isDragging,
    onChange,
    onDrop,
    onDragOver,
    onDragLeave: () => setIsDragging(false),
  };
}

export function ImageDropZone({
  id,
  name,
  multiple = false,
  disabled = false,
  required = false,
  title,
  hint,
  invalidMessageId,
  onFiles,
}: Readonly<ImageDropZoneProps>): ReactElement {
  const drop = useImageDrop({ name, multiple, disabled, onFiles });
  const stateClass = drop.isDragging
    ? 'border-brand-500 bg-brand-500/10'
    : 'border-admin-line bg-white hover:border-brand-500 hover:bg-brand-500/5';

  return (
    <label
      htmlFor={id}
      onDragOver={drop.onDragOver}
      onDragLeave={drop.onDragLeave}
      onDrop={drop.onDrop}
      className={`group flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-500/40 ${stateClass} ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 transition-transform group-hover:-translate-y-1">
        <Icon name="upload" className="size-7" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-admin-muted">{hint}</span>
      </span>
      <span className="rounded-full border border-admin-line bg-admin-surface px-4 py-1.5 text-sm font-semibold text-brand-700">
        Procurar no aparelho
      </span>
      <input
        id={id}
        name={name}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        disabled={disabled}
        required={required}
        aria-describedby={invalidMessageId}
        onChange={drop.onChange}
        className="sr-only"
      />
    </label>
  );
}

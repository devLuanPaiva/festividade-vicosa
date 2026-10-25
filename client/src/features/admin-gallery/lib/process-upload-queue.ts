import type { FormErrorState } from '@/lib/forms/form-errors';
import type { UploadItem } from '../types';

const PHOTO_FIELD = 'file';
const UNEXPECTED_FAILURE = 'Não foi possível enviar esta foto. Tente novamente.';

export interface UploadQueueDependencies {
  resize: (file: File) => Promise<File>;
  upload: (formData: FormData) => Promise<FormErrorState>;
  onChange: (id: number, changes: Pick<UploadItem, 'status' | 'message'>) => void;
}

async function readFailure(
  file: File,
  { resize, upload }: UploadQueueDependencies,
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.set(PHOTO_FIELD, await resize(file));
    return (await upload(formData)).errorMessage;
  } catch (error) {
    return error instanceof Error && error.name === 'ImageResizeError'
      ? error.message
      : UNEXPECTED_FAILURE;
  }
}

async function processOne(
  file: File,
  id: number,
  dependencies: UploadQueueDependencies,
): Promise<void> {
  dependencies.onChange(id, { status: 'uploading', message: null });
  const failure = await readFailure(file, dependencies);
  dependencies.onChange(
    id,
    failure ? { status: 'failed', message: failure } : { status: 'done', message: null },
  );
}

export function processUploadQueue(
  files: File[],
  firstId: number,
  dependencies: UploadQueueDependencies,
): Promise<void> {
  return files.reduce(
    (previous, file, index) => previous.then(() => processOne(file, firstId + index, dependencies)),
    Promise.resolve(),
  );
}

import type { FormErrorState } from '@/lib/forms/form-errors';

const UNEXPECTED_FAILURE = 'Não foi possível enviar esta foto. Tente novamente.';
const RESIZE_ERROR_NAME = 'ImageResizeError';

export interface SendPhotoDependencies {
  resize: (file: File) => Promise<File>;
  upload: (photo: File) => Promise<FormErrorState>;
}

export async function sendPhoto(
  file: File,
  { resize, upload }: SendPhotoDependencies,
): Promise<string | null> {
  try {
    return (await upload(await resize(file))).errorMessage;
  } catch (error) {
    return error instanceof Error && error.name === RESIZE_ERROR_NAME
      ? error.message
      : UNEXPECTED_FAILURE;
  }
}

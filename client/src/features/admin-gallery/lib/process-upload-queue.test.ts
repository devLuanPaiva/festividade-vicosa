import { describe, expect, it, vi } from 'vitest';
import { ImageResizeError } from '@/lib/images/resize-for-upload';
import { processUploadQueue } from './process-upload-queue';

const OK = { errorMessage: null, errorField: null };

function photo(name: string): File {
  return new File(['image'], name, { type: 'image/jpeg' });
}

function setup(upload: (formData: FormData) => Promise<typeof OK>): {
  history: string[];
  run: (files: File[]) => Promise<void>;
} {
  const history: string[] = [];
  const run = (files: File[]): Promise<void> =>
    processUploadQueue(files, 10, {
      resize: (file) =>
        file.name === 'broken.jpg' ? Promise.reject(new ImageResizeError()) : Promise.resolve(file),
      upload,
      onChange: (id, { status }) => history.push(`${id}:${status}`),
    });
  return { history, run };
}

describe('processUploadQueue', () => {
  it('sends the photos one after the other, in the order they were chosen', async () => {
    const { history, run } = setup(() => Promise.resolve(OK));

    await run([photo('a.jpg'), photo('b.jpg')]);

    expect(history).toEqual(['10:uploading', '10:done', '11:uploading', '11:done']);
  });

  it('shows the message of the api and still sends the photos that come after', async () => {
    const upload = vi
      .fn()
      .mockResolvedValueOnce({
        errorMessage: 'Envie a imagem em JPG, PNG ou WebP.',
        errorField: 'file',
      })
      .mockResolvedValueOnce(OK);
    const messages: (string | null)[] = [];
    await processUploadQueue([photo('a.jpg'), photo('b.jpg')], 0, {
      resize: (file) => Promise.resolve(file),
      upload,
      onChange: (_id, { message }) => messages.push(message),
    });

    expect(messages).toContain('Envie a imagem em JPG, PNG ou WebP.');
    expect(upload).toHaveBeenCalledTimes(2);
  });

  it('fails a photo that cannot be read without calling the api for it', async () => {
    const upload = vi.fn().mockResolvedValue(OK);
    const { history, run } = setup(upload);

    await run([photo('broken.jpg')]);

    expect(history).toEqual(['10:uploading', '10:failed']);
    expect(upload).not.toHaveBeenCalled();
  });

  it('fails a photo when the request breaks, with a generic message', async () => {
    const messages: (string | null)[] = [];
    await processUploadQueue([photo('a.jpg')], 0, {
      resize: (file) => Promise.resolve(file),
      upload: () => Promise.reject(new Error('network down')),
      onChange: (_id, { message }) => messages.push(message),
    });

    expect(messages.at(-1)).toBe('Não foi possível enviar esta foto. Tente novamente.');
  });
});

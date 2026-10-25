import { describe, expect, it, vi } from 'vitest';
import { ImageResizeError } from '@/lib/images/resize-for-upload';
import { sendPhoto } from './send-photo';

const OK = { errorMessage: null, errorField: null };
const PHOTO = new File(['image'], 'a.jpg', { type: 'image/jpeg' });

describe('sendPhoto', () => {
  it('sends the reduced photo and reports no failure', async () => {
    const reduced = new File(['small'], 'photo.jpg', { type: 'image/jpeg' });
    const upload = vi.fn().mockResolvedValue(OK);

    const failure = await sendPhoto(PHOTO, { resize: () => Promise.resolve(reduced), upload });

    expect(failure).toBeNull();
    expect(upload).toHaveBeenCalledWith(reduced);
  });

  it('reports the message of the api when it refuses the photo', async () => {
    const upload = vi.fn().mockResolvedValue({
      errorMessage: 'Envie a imagem em JPG, PNG ou WebP.',
      errorField: 'file',
    });

    await expect(
      sendPhoto(PHOTO, { resize: (file) => Promise.resolve(file), upload }),
    ).resolves.toBe('Envie a imagem em JPG, PNG ou WebP.');
  });

  it('fails a photo that cannot be read without calling the api', async () => {
    const upload = vi.fn();

    const failure = await sendPhoto(PHOTO, {
      resize: () => Promise.reject(new ImageResizeError()),
      upload,
    });

    expect(failure).toContain('Não foi possível ler a imagem');
    expect(upload).not.toHaveBeenCalled();
  });

  it('answers with a generic message when the request breaks', async () => {
    const failure = await sendPhoto(PHOTO, {
      resize: (file) => Promise.resolve(file),
      upload: () => Promise.reject(new Error('network down')),
    });

    expect(failure).toBe('Não foi possível enviar esta foto. Tente novamente.');
  });
});

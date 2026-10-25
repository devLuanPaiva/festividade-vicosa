import { describe, expect, it } from 'vitest';
import { ApiError } from '@/lib/api/api-response';
import { messageFor, toUploadFailure } from './upload-failure';

describe('toUploadFailure', () => {
  it('passes the status and the message of the api to the browser', () => {
    const error = new ApiError(413, 'Payload Too Large', {
      code: 'PAYLOAD_TOO_LARGE',
      field: '',
      detail: 'O arquivo enviado é grande demais. O limite é de 10 MB.',
    });

    expect(toUploadFailure(error)).toEqual({
      status: 413,
      body: {
        errorMessage: 'O arquivo enviado é grande demais. O limite é de 10 MB.',
        errorField: null,
      },
    });
  });

  it('hides unexpected errors behind a generic message', () => {
    const failure = toUploadFailure(new Error('connect ECONNREFUSED 10.0.0.5:3000'));

    expect(failure.status).toBe(502);
    expect(failure.body.errorMessage).toBe('Não foi possível enviar esta foto. Tente novamente.');
  });
});

describe('messageFor', () => {
  it('uses the message the route answered with', () => {
    expect(messageFor(400, { errorMessage: 'Envie a imagem em JPG, PNG ou WebP.' })).toBe(
      'Envie a imagem em JPG, PNG ou WebP.',
    );
  });

  it('explains an expired session when the answer has no message', () => {
    expect(messageFor(401, null)).toContain('sessão expirou');
  });

  it('falls back to a generic message for any other answer without a message', () => {
    expect(messageFor(500, '<html>')).toBe('Não foi possível enviar esta foto. Tente novamente.');
  });
});

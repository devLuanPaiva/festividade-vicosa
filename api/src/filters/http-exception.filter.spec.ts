import { ConflictException, type ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function createHost(): { host: ArgumentsHost; status: jest.Mock; json: jest.Mock } {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const http = { getResponse: (): { status: jest.Mock } => ({ status }) };
  const host = { switchToHttp: (): typeof http => http } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('HttpExceptionFilter', () => {
  it('writes the standard error body with the status of the exception', () => {
    const { host, status, json } = createHost();

    new HttpExceptionFilter().catch(
      new ConflictException({ code: 'EMAIL_ALREADY_EXISTS', field: 'email', detail: 'Duplicado.' }),
      host,
    );

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        data: null,
        errors: { code: 'EMAIL_ALREADY_EXISTS', field: 'email', detail: 'Duplicado.' },
      }),
    );
  });

  it('answers 500 with a generic detail for unexpected errors', () => {
    const { host, status, json } = createHost();
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    new HttpExceptionFilter().catch(new Error('database exploded'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.objectContaining({
          detail: 'Ocorreu um erro inesperado. Tente novamente em instantes.',
        }) as unknown,
      }),
    );
    logSpy.mockRestore();
  });
});

import { Catch, Logger, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { buildErrorResponse, isServerError, resolveStatus } from './error-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = resolveStatus(exception);

    if (isServerError(status)) {
      this.logger.error(exception);
    }

    response.status(status).json(buildErrorResponse(exception, status));
  }
}

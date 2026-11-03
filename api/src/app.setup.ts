import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { createValidationException } from './common/validation/validation-exception.factory';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

export function parseAllowedOrigins(rawOrigins: string): string[] {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function configureApp(app: INestApplication, rawAllowedOrigins: string): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: createValidationException,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({ origin: parseAllowedOrigins(rawAllowedOrigins) });
  app.enableShutdownHooks();
}

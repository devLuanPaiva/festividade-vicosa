import { ValidationPipe, type INestApplication } from '@nestjs/common';

export function parseAllowedOrigins(rawOrigins: string): string[] {
  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function configureApp(app: INestApplication, rawAllowedOrigins: string): void {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors({ origin: parseAllowedOrigins(rawAllowedOrigins) });
  app.enableShutdownHooks();
}

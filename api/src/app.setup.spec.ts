import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { configureApp, parseAllowedOrigins } from './app.setup';

describe('parseAllowedOrigins', () => {
  it('splits a comma separated list and trims each origin', () => {
    expect(parseAllowedOrigins('https://app.example.com, http://localhost:3001')).toEqual([
      'https://app.example.com',
      'http://localhost:3001',
    ]);
  });

  it('ignores empty entries', () => {
    expect(parseAllowedOrigins('https://app.example.com,, ')).toEqual(['https://app.example.com']);
  });
});

describe('configureApp', () => {
  const app = {
    useGlobalPipes: jest.fn(),
    enableCors: jest.fn(),
    enableShutdownHooks: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    configureApp(app as unknown as INestApplication, 'https://app.example.com');
  });

  it('registers a global validation pipe', () => {
    expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
  });

  it('restricts cors to the allowed origins', () => {
    expect(app.enableCors).toHaveBeenCalledWith({ origin: ['https://app.example.com'] });
  });

  it('enables shutdown hooks', () => {
    expect(app.enableShutdownHooks).toHaveBeenCalledTimes(1);
  });
});

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { configureApp } from '../src/app.setup';
import { HealthController } from '../src/resources/health/controllers/health.controller';
import { HealthService } from '../src/resources/health/services/health.service';

async function createApp(query: jest.Mock): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    controllers: [HealthController],
    providers: [HealthService, { provide: DataSource, useValue: { query } }],
  }).compile();
  const app = moduleFixture.createNestApplication();
  configureApp(app, 'http://localhost:3001');
  return app.init();
}

describe('GET /health (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    await app.close();
  });

  it('answers 200 when the database is reachable', async () => {
    app = await createApp(jest.fn().mockResolvedValue([]));

    await request(app.getHttpServer() as App)
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });

  it('answers 503 when the database is unreachable', async () => {
    app = await createApp(jest.fn().mockRejectedValue(new Error('down')));

    await request(app.getHttpServer() as App)
      .get('/health')
      .expect(503)
      .expect({ status: 'error', database: 'down' });
  });
});

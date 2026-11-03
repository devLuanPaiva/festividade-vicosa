import { ServiceUnavailableException } from '@nestjs/common';
import type { DataSource } from 'typeorm';
import { HealthService } from './health.service';

function createService(query: jest.Mock): HealthService {
  return new HealthService({ query } as unknown as DataSource);
}

describe('HealthService', () => {
  it('reports the database as up when the query succeeds', async () => {
    const service = createService(jest.fn().mockResolvedValue([{ one: 1 }]));

    await expect(service.check()).resolves.toEqual({ status: 'ok', database: 'up' });
  });

  it('throws service unavailable when the database cannot be reached', async () => {
    const service = createService(jest.fn().mockRejectedValue(new Error('connection refused')));

    await expect(service.check()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});

import { HealthController } from './health.controller';
import type { HealthService } from '../services/health.service';

describe('HealthController', () => {
  it('returns the status reported by the health service', async () => {
    const status = { status: 'ok', database: 'up' } as const;
    const healthService = { check: jest.fn().mockResolvedValue(status) };
    const controller = new HealthController(healthService as unknown as HealthService);

    await expect(controller.check()).resolves.toBe(status);
  });
});

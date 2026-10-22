import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'up' | 'down';
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  public constructor(private readonly dataSource: DataSource) {}

  public async check(): Promise<HealthStatus> {
    await this.assertDatabaseIsReachable();
    return { status: 'ok', database: 'up' };
  }

  private async assertDatabaseIsReachable(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      this.logger.error('Database health check failed', error);
      throw new ServiceUnavailableException({ status: 'error', database: 'down' });
    }
  }
}

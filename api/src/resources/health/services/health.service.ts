import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { HealthStatusDto } from '../dto/health-status.dto';
import { apiError } from '../../../common/errors/api-error';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  public constructor(private readonly dataSource: DataSource) {}

  public async check(): Promise<HealthStatusDto> {
    await this.assertDatabaseIsReachable();
    return { status: 'ok', database: 'up' };
  }

  private async assertDatabaseIsReachable(): Promise<void> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      this.logger.error('Database health check failed', error);
      throw new ServiceUnavailableException(
        apiError('DATABASE_UNAVAILABLE', 'Não foi possível conectar ao banco de dados.'),
      );
    }
  }
}

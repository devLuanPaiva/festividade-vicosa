import { Controller, Get } from '@nestjs/common';
import { HealthService, type HealthStatus } from './health.service';

@Controller('health')
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get()
  public check(): Promise<HealthStatus> {
    return this.healthService.check();
  }
}

import { Controller, Get } from '@nestjs/common';
import { Public } from '../../auth/decorators/decorators';
import type { HealthStatusDto } from '../dto/health-status.dto';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  public check(): Promise<HealthStatusDto> {
    return this.healthService.check();
  }
}

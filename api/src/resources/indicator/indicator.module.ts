import { Module } from '@nestjs/common';
import { IndicatorController } from './controllers/indicator.controller';
import { IndicatorRepository } from './repository/indicator.repository';
import { IndicatorService } from './services/indicator.service';

@Module({
  controllers: [IndicatorController],
  providers: [IndicatorService, IndicatorRepository],
})
export class IndicatorModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionModule } from '../edition/edition.module';
import { SubEventController } from './controllers/sub-event.controller';
import { SubEvent } from './entities/sub-event.entity';
import { SubEventRepository } from './repository/sub-event.repository';
import { SubEventService } from './services/sub-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubEvent]), EditionModule],
  controllers: [SubEventController],
  providers: [SubEventService, SubEventRepository],
  exports: [SubEventService],
})
export class SubEventModule {}

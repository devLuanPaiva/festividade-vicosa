import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditionController } from './controllers/edition.controller';
import { Edition } from './entities/edition.entity';
import { EditionRepository } from './repository/edition.repository';
import { EditionService } from './services/edition.service';

@Module({
  imports: [TypeOrmModule.forFeature([Edition])],
  controllers: [EditionController],
  providers: [EditionService, EditionRepository],
  exports: [EditionService],
})
export class EditionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MatchGroupController } from './controllers/match-group.controller';
import { MatchGroup } from './entities/match-group.entity';
import { MatchGroupRepository } from './repository/match-group.repository';
import { MatchGroupService } from './services/match-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchGroup]), CategoryModule],
  controllers: [MatchGroupController],
  providers: [MatchGroupService, MatchGroupRepository],
  exports: [MatchGroupService],
})
export class MatchGroupModule {}

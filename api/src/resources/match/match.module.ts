import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamModule } from '../team/team.module';
import { MatchController } from './controllers/match.controller';
import { Match } from './entities/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchFixtureValidator } from './services/match-fixture-validator.service';
import { MatchResultService } from './services/match-result.service';
import { MatchService } from './services/match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), CategoryModule, MatchGroupModule, TeamModule],
  controllers: [MatchController],
  providers: [MatchService, MatchResultService, MatchFixtureValidator, MatchRepository],
  exports: [MatchService],
})
export class MatchModule {}

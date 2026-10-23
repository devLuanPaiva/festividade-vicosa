import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamModule } from '../team/team.module';
import { MatchBracketController } from './controllers/match-bracket.controller';
import { MatchController } from './controllers/match.controller';
import { Match } from './entities/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchBracketAdvancer } from './services/match-bracket-advancer.service';
import { MatchBracketGenerator } from './services/match-bracket-generator.service';
import { MatchFixtureValidator } from './services/match-fixture-validator.service';
import { MatchResultService } from './services/match-result.service';
import { MatchService } from './services/match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), CategoryModule, MatchGroupModule, TeamModule],
  controllers: [MatchController, MatchBracketController],
  providers: [
    MatchService,
    MatchResultService,
    MatchBracketAdvancer,
    MatchBracketGenerator,
    MatchFixtureValidator,
    MatchRepository,
  ],
  exports: [MatchService],
})
export class MatchModule {}

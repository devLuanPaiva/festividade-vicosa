import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamModule } from '../team/team.module';
import { MatchBracketController } from './controllers/match-bracket.controller';
import { MatchController } from './controllers/match.controller';
import { MatchListingController } from './controllers/match-listing.controller';
import { Match } from './entities/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchBracketAdvancer } from './services/match-bracket-advancer.service';
import { MatchBracketGenerator } from './services/match-bracket-generator.service';
import { MatchFixtureValidator } from './services/match-fixture-validator.service';
import { MatchMediaService } from './services/match-media.service';
import { MatchListingService } from './services/match-listing.service';
import { MatchResultService } from './services/match-result.service';
import { MatchService } from './services/match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), CategoryModule, MatchGroupModule, TeamModule],
  controllers: [MatchController, MatchBracketController, MatchListingController],
  providers: [
    MatchService,
    MatchListingService,
    MatchResultService,
    MatchBracketAdvancer,
    MatchBracketGenerator,
    MatchFixtureValidator,
    MatchMediaService,
    MatchRepository,
  ],
  exports: [MatchService, MatchMediaService],
})
export class MatchModule {}

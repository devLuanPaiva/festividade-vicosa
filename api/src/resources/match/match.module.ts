import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { CategoryModule } from '../category/category.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamModule } from '../team/team.module';
import { BestPlayerPhotoController } from './controllers/best-player-photo.controller';
import { MatchController } from './controllers/match.controller';
import { MatchListingController } from './controllers/match-listing.controller';
import { MatchSuggestionController } from './controllers/match-suggestion.controller';
import { Match } from './entities/match.entity';
import { MatchRepository } from './repository/match.repository';
import { BestPlayerPhotoService } from './services/best-player-photo.service';
import { BracketSuggestionService } from './services/bracket-suggestion.service';
import { GroupFixtureSuggestionService } from './services/group-fixture-suggestion.service';
import { MatchBatchService } from './services/match-batch.service';
import { MatchFixtureValidator } from './services/match-fixture-validator.service';
import { MatchMediaService } from './services/match-media.service';
import { MatchListingService } from './services/match-listing.service';
import { MatchResultService } from './services/match-result.service';
import { MatchService } from './services/match.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    CategoryModule,
    MatchGroupModule,
    TeamModule,
    StorageModule,
  ],
  controllers: [
    MatchController,
    BestPlayerPhotoController,
    MatchSuggestionController,
    MatchListingController,
  ],
  providers: [
    MatchService,
    MatchListingService,
    MatchResultService,
    BestPlayerPhotoService,
    MatchBatchService,
    BracketSuggestionService,
    GroupFixtureSuggestionService,
    MatchFixtureValidator,
    MatchMediaService,
    MatchRepository,
  ],
  exports: [MatchService, MatchMediaService],
})
export class MatchModule {}

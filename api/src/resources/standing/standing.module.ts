import { Module } from '@nestjs/common';
import { MatchGroupModule } from '../match-group/match-group.module';
import { MatchModule } from '../match/match.module';
import { QualificationModule } from '../qualification/qualification.module';
import { TeamModule } from '../team/team.module';
import { StandingController } from './controllers/standing.controller';
import { StandingDataLoader } from './services/standing-data.loader';
import { StandingService } from './services/standing.service';

@Module({
  imports: [MatchGroupModule, TeamModule, MatchModule, QualificationModule],
  controllers: [StandingController],
  providers: [StandingService, StandingDataLoader],
})
export class StandingModule {}

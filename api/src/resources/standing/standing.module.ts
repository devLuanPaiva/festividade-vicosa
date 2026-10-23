import { Module } from '@nestjs/common';
import { MatchGroupModule } from '../match-group/match-group.module';
import { MatchModule } from '../match/match.module';
import { TeamModule } from '../team/team.module';
import { StandingController } from './controllers/standing.controller';
import { StandingService } from './services/standing.service';

@Module({
  imports: [MatchGroupModule, TeamModule, MatchModule],
  controllers: [StandingController],
  providers: [StandingService],
})
export class StandingModule {}

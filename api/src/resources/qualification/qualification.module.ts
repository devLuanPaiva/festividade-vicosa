import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamModule } from '../team/team.module';
import { QualificationController } from './controllers/qualification.controller';
import { QualifiedTeam } from './entities/qualified-team.entity';
import { QualifiedTeamRepository } from './repository/qualified-team.repository';
import { QualificationService } from './services/qualification.service';

@Module({
  imports: [TypeOrmModule.forFeature([QualifiedTeam]), MatchGroupModule, TeamModule],
  controllers: [QualificationController],
  providers: [QualificationService, QualifiedTeamRepository],
  exports: [QualificationService],
})
export class QualificationModule {}

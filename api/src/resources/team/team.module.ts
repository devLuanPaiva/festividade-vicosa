import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamController } from './controllers/team.controller';
import { Team } from './entities/team.entity';
import { TeamRepository } from './repository/team.repository';
import { TeamService } from './services/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), CategoryModule, MatchGroupModule],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
  exports: [TeamService],
})
export class TeamModule {}

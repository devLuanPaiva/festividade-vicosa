import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { StorageModule } from '../../storage/storage.module';
import { MatchGroupModule } from '../match-group/match-group.module';
import { TeamPhotoController } from './controllers/team-photo.controller';
import { TeamController } from './controllers/team.controller';
import { Team } from './entities/team.entity';
import { TeamRepository } from './repository/team.repository';
import { TeamPhotoService } from './services/team-photo.service';
import { TeamService } from './services/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), CategoryModule, MatchGroupModule, StorageModule],
  controllers: [TeamController, TeamPhotoController],
  providers: [TeamService, TeamPhotoService, TeamRepository],
  exports: [TeamService],
})
export class TeamModule {}

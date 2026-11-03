import { Injectable } from '@nestjs/common';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Team } from '../entities/team.entity';
import { TeamRepository } from '../repository/team.repository';
import { TeamService } from './team.service';

@Injectable()
export class TeamPhotoService {
  public constructor(
    private readonly teamService: TeamService,
    private readonly teamRepository: TeamRepository,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async replace(teamId: string, file: Buffer): Promise<Team> {
    const team = await this.teamService.findByIdOrFail(teamId);
    const photoKey = await this.mediaUploadService.upload(
      await this.teamService.photoTarget(team),
      file,
    );
    await this.saveOrDiscard(team.id, photoKey);
    await this.mediaUploadService.discard(team.photoKey);
    return this.teamService.findByIdOrFail(teamId);
  }

  public async remove(teamId: string): Promise<Team> {
    const team = await this.teamService.findByIdOrFail(teamId);
    await this.teamRepository.update(team.id, { photoKey: null });
    await this.mediaUploadService.discard(team.photoKey);
    return this.teamService.findByIdOrFail(teamId);
  }

  private async saveOrDiscard(teamId: string, photoKey: string): Promise<void> {
    try {
      await this.teamRepository.update(teamId, { photoKey });
    } catch (error) {
      await this.mediaUploadService.discard(photoKey);
      throw error;
    }
  }
}

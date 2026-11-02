import { BadRequestException, Injectable } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { MediaFolder } from '../../../storage/rules/media-key.rule';
import { MediaUploadService } from '../../../storage/services/media-upload.service';
import type { Match } from '../entities/match.entity';
import { MatchMediaService } from './match-media.service';
import { MatchService } from './match.service';

@Injectable()
export class BestPlayerPhotoService {
  public constructor(
    private readonly matchService: MatchService,
    private readonly matchMediaService: MatchMediaService,
    private readonly mediaUploadService: MediaUploadService,
  ) {}

  public async replace(matchId: string, file: Buffer): Promise<Match> {
    const match = await this.findWithBestPlayerOrFail(matchId);
    const target = await this.matchMediaService.targetFor(matchId, MediaFolder.BEST_PLAYER);
    const photoKey = await this.mediaUploadService.upload(target, file);
    await this.saveOrDiscard(matchId, photoKey);
    await this.mediaUploadService.discard(match.bestPlayerPhotoKey);
    return this.matchService.findByIdOrFail(matchId);
  }

  public async remove(matchId: string): Promise<Match> {
    const match = await this.findWithBestPlayerOrFail(matchId);
    await this.matchService.setBestPlayerPhoto(matchId, null);
    await this.mediaUploadService.discard(match.bestPlayerPhotoKey);
    return this.matchService.findByIdOrFail(matchId);
  }

  private async findWithBestPlayerOrFail(matchId: string): Promise<Match> {
    const match = await this.matchService.findByIdOrFail(matchId);
    if (!match.bestPlayerName) {
      throw new BadRequestException(
        apiError(
          'BEST_PLAYER_NAME_REQUIRED',
          'Informe o melhor jogador e salve a partida antes de enviar a foto.',
          'file',
        ),
      );
    }
    return match;
  }

  private async saveOrDiscard(matchId: string, photoKey: string): Promise<void> {
    try {
      await this.matchService.setBestPlayerPhoto(matchId, photoKey);
    } catch (error) {
      await this.mediaUploadService.discard(photoKey);
      throw error;
    }
  }
}

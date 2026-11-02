import { Controller, Delete, Param, Put, UploadedFile } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { requireUploadedImage } from '../../../storage/upload/image-upload';
import { ImageUploadEndpoint } from '../../../storage/upload/upload-decorators';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { MatchResponseDto } from '../dto/match-response.dto';
import { toMatchResponse } from '../mappers/match-response.mapper';
import { BestPlayerPhotoService } from '../services/best-player-photo.service';

@Controller('matches/:id/best-player/photo')
export class BestPlayerPhotoController {
  public constructor(private readonly bestPlayerPhotoService: BestPlayerPhotoService) {}

  @Put()
  @RequirePermission(Permission.MATCH_RECORD_SCORE)
  @ImageUploadEndpoint()
  public async replace(
    @Param('id', ParseIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<MatchResponseDto> {
    return toMatchResponse(
      await this.bestPlayerPhotoService.replace(id, requireUploadedImage(file)),
    );
  }

  @Delete()
  @RequirePermission(Permission.MATCH_RECORD_SCORE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<MatchResponseDto> {
    return toMatchResponse(await this.bestPlayerPhotoService.remove(id));
  }
}

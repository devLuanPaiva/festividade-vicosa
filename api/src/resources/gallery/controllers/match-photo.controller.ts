import { Controller, Get, Param, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { ImageUploadEndpoint } from '../../../storage/upload/upload-decorators';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { UploadedPhoto } from '../decorators/uploaded-photo.decorator';
import type { PhotoResponseDto } from '../dto/photo-response.dto';
import { toPhotoResponse } from '../mappers/photo-response.mapper';
import { GalleryService } from '../services/gallery.service';
import { PhotoUploadService, type PhotoUpload } from '../services/photo-upload.service';

@Controller('matches/:matchId/photos')
export class MatchPhotoController {
  public constructor(
    private readonly galleryService: GalleryService,
    private readonly photoUploadService: PhotoUploadService,
  ) {}

  @Public()
  @Get()
  public async list(@Param('matchId', ParseIdPipe) matchId: string): Promise<PhotoResponseDto[]> {
    return (await this.galleryService.listMatchPhotos(matchId)).map(toPhotoResponse);
  }

  @Post()
  @RequirePermission(Permission.PHOTO_UPLOAD)
  @ImageUploadEndpoint()
  public async upload(
    @Param('matchId', ParseIdPipe) matchId: string,
    @UploadedPhoto() upload: PhotoUpload,
  ): Promise<PhotoResponseDto> {
    return toPhotoResponse(await this.photoUploadService.addToMatch(matchId, upload));
  }
}

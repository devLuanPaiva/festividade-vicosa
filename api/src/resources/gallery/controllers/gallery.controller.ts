import { Controller, Get, Param, Post } from '@nestjs/common';
import { ParseDayPipe } from '../../../common/pipes/parse-day.pipe';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { ImageUploadEndpoint } from '../../../storage/upload/upload-decorators';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { UploadedPhoto } from '../decorators/uploaded-photo.decorator';
import type { GalleryDayResponseDto, PhotoResponseDto } from '../dto/photo-response.dto';
import { toGalleryDayResponse, toPhotoResponse } from '../mappers/photo-response.mapper';
import { GalleryService } from '../services/gallery.service';
import type { PhotoUpload } from '../services/photo-store.service';
import { PhotoUploadService } from '../services/photo-upload.service';

@Controller('sub-events/:subEventId/gallery')
export class GalleryController {
  public constructor(
    private readonly galleryService: GalleryService,
    private readonly photoUploadService: PhotoUploadService,
  ) {}

  @Public()
  @Get()
  public async listDays(
    @Param('subEventId', ParseIdPipe) subEventId: string,
  ): Promise<GalleryDayResponseDto[]> {
    return (await this.galleryService.listDays(subEventId)).map(toGalleryDayResponse);
  }

  @Public()
  @Get(':date')
  public async listPhotos(
    @Param('subEventId', ParseIdPipe) subEventId: string,
    @Param('date', ParseDayPipe) date: string,
  ): Promise<PhotoResponseDto[]> {
    return (await this.galleryService.listEventDayPhotos(subEventId, date)).map(toPhotoResponse);
  }

  @Post(':date/photos')
  @RequirePermission(Permission.PHOTO_UPLOAD)
  @ImageUploadEndpoint()
  public async upload(
    @Param('subEventId', ParseIdPipe) subEventId: string,
    @Param('date', ParseDayPipe) date: string,
    @UploadedPhoto() upload: PhotoUpload,
  ): Promise<PhotoResponseDto> {
    return toPhotoResponse(await this.photoUploadService.addToEventDay(subEventId, date, upload));
  }
}

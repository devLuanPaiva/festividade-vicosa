import { Controller, Delete, Param, Put, UploadedFile } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { requireUploadedImage } from '../../../storage/upload/image-upload';
import { ImageUploadEndpoint } from '../../../storage/upload/upload-decorators';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { LiveStreamResponseDto } from '../dto/live-stream-response.dto';
import { toLiveStreamResponse } from '../mappers/live-stream-response.mapper';
import { LiveStreamPreviewService } from '../services/live-stream-preview.service';

@Controller('live-streams/:id/preview')
export class LiveStreamPreviewController {
  public constructor(private readonly previewService: LiveStreamPreviewService) {}

  @Put()
  @RequirePermission(Permission.LIVE_MANAGE)
  @ImageUploadEndpoint()
  public async replace(
    @Param('id', ParseIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.previewService.replace(id, requireUploadedImage(file)));
  }

  @Delete()
  @RequirePermission(Permission.LIVE_MANAGE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.previewService.remove(id));
  }
}

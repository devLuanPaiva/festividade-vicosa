import { Body, Controller, Delete, HttpCode, Param, Put } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { PhotoResponseDto } from '../dto/photo-response.dto';
import { ReorderPhotosDto } from '../dto/reorder-photos.dto';
import { toPhotoResponse } from '../mappers/photo-response.mapper';
import { PhotoManagementService } from '../services/photo-management.service';

@Controller('photos')
export class PhotoController {
  public constructor(private readonly photoManagementService: PhotoManagementService) {}

  @Put('order')
  @RequirePermission(Permission.PHOTO_DELETE)
  public async reorder(@Body() input: ReorderPhotosDto): Promise<PhotoResponseDto[]> {
    return (await this.photoManagementService.reorder(input.photoIds)).map(toPhotoResponse);
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission(Permission.PHOTO_DELETE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    await this.photoManagementService.remove(id);
  }
}

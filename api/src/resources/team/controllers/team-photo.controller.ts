import { Controller, Delete, Param, Put, UploadedFile } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { requireUploadedImage } from '../../../storage/upload/image-upload';
import { ImageUploadEndpoint } from '../../../storage/upload/upload-decorators';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { TeamResponseDto } from '../dto/team-response.dto';
import { toTeamResponse } from '../mappers/team-response.mapper';
import { TeamPhotoService } from '../services/team-photo.service';

@Controller('teams/:id/photo')
export class TeamPhotoController {
  public constructor(private readonly teamPhotoService: TeamPhotoService) {}

  @Put()
  @RequirePermission(Permission.TEAM_MANAGE)
  @ImageUploadEndpoint()
  public async replace(
    @Param('id', ParseIdPipe) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<TeamResponseDto> {
    return toTeamResponse(await this.teamPhotoService.replace(id, requireUploadedImage(file)));
  }

  @Delete()
  @RequirePermission(Permission.TEAM_MANAGE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<TeamResponseDto> {
    return toTeamResponse(await this.teamPhotoService.remove(id));
  }
}

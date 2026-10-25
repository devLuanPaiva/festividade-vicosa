import {
  Controller,
  Delete,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { imageUploadInterceptor, requireUploadedImage } from '../../../storage/upload/image-upload';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { TeamResponseDto } from '../dto/team-response.dto';
import { toTeamResponse } from '../mappers/team-response.mapper';
import { TeamPhotoService } from '../services/team-photo.service';

const UPLOADS_PER_MINUTE = 20;
const ONE_MINUTE_IN_MILLISECONDS = 60_000;

@Controller('teams/:id/photo')
export class TeamPhotoController {
  public constructor(private readonly teamPhotoService: TeamPhotoService) {}

  @Put()
  @RequirePermission(Permission.TEAM_MANAGE)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: UPLOADS_PER_MINUTE, ttl: ONE_MINUTE_IN_MILLISECONDS } })
  @UseInterceptors(imageUploadInterceptor)
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

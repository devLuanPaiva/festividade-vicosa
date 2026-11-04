import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CreateLiveStreamDto } from '../dto/create-live-stream.dto';
import type { LiveStreamResponseDto } from '../dto/live-stream-response.dto';
import { UpdateLiveStreamDto } from '../dto/update-live-stream.dto';
import { toLiveStreamResponse } from '../mappers/live-stream-response.mapper';
import { LiveStreamService } from '../services/live-stream.service';

@Controller('live-streams')
export class LiveStreamController {
  public constructor(private readonly liveStreamService: LiveStreamService) {}

  @Public()
  @Get('active')
  public async getActive(): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.findActiveOrFail());
  }

  @Get()
  @RequirePermission(Permission.LIVE_MANAGE)
  public async list(): Promise<LiveStreamResponseDto[]> {
    return (await this.liveStreamService.list()).map(toLiveStreamResponse);
  }

  @Get(':id')
  @RequirePermission(Permission.LIVE_MANAGE)
  public async get(@Param('id', ParseIdPipe) id: string): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.findByIdOrFail(id));
  }

  @Post()
  @RequirePermission(Permission.LIVE_MANAGE)
  public async create(@Body() input: CreateLiveStreamDto): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.create(input));
  }

  @Patch(':id')
  @RequirePermission(Permission.LIVE_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: string,
    @Body() changes: UpdateLiveStreamDto,
  ): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.update(id, changes));
  }

  @Patch(':id/activate')
  @RequirePermission(Permission.LIVE_MANAGE)
  public async activate(@Param('id', ParseIdPipe) id: string): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.activate(id));
  }

  @Patch(':id/deactivate')
  @RequirePermission(Permission.LIVE_MANAGE)
  public async deactivate(@Param('id', ParseIdPipe) id: string): Promise<LiveStreamResponseDto> {
    return toLiveStreamResponse(await this.liveStreamService.deactivate(id));
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission(Permission.LIVE_MANAGE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    await this.liveStreamService.remove(id);
  }
}

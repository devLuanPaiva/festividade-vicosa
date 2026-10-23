import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CreateSubEventDto } from '../dto/create-sub-event.dto';
import type { SubEventResponseDto } from '../dto/sub-event-response.dto';
import { UpdateSubEventDto } from '../dto/update-sub-event.dto';
import { toSubEventResponse } from '../mappers/sub-event-response.mapper';
import { SubEventService } from '../services/sub-event.service';

@Controller()
export class SubEventController {
  public constructor(private readonly subEventService: SubEventService) {}

  @Public()
  @Get('editions/:editionId/sub-events')
  public async listByEdition(
    @Param('editionId', ParseIdPipe) editionId: number,
  ): Promise<SubEventResponseDto[]> {
    return (await this.subEventService.listByEdition(editionId)).map(toSubEventResponse);
  }

  @Public()
  @Get('sub-events/:id')
  public async get(@Param('id', ParseIdPipe) id: number): Promise<SubEventResponseDto> {
    return toSubEventResponse(await this.subEventService.findByIdOrFail(id));
  }

  @Post('editions/:editionId/sub-events')
  @RequirePermission(Permission.SCHEDULE_MANAGE)
  public async create(
    @Param('editionId', ParseIdPipe) editionId: number,
    @Body() input: CreateSubEventDto,
  ): Promise<SubEventResponseDto> {
    return toSubEventResponse(await this.subEventService.create(editionId, input));
  }

  @Patch('sub-events/:id')
  @RequirePermission(Permission.SCHEDULE_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() changes: UpdateSubEventDto,
  ): Promise<SubEventResponseDto> {
    return toSubEventResponse(await this.subEventService.update(id, changes));
  }
}

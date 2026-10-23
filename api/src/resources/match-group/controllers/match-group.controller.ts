import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { SearchQueryDto } from '../../../common/query/search-query.dto';
import { CreateMatchGroupDto } from '../dto/create-match-group.dto';
import type { MatchGroupResponseDto } from '../dto/match-group-response.dto';
import { UpdateMatchGroupDto } from '../dto/update-match-group.dto';
import { toMatchGroupResponse } from '../mappers/match-group-response.mapper';
import { MatchGroupService } from '../services/match-group.service';

@Controller()
export class MatchGroupController {
  public constructor(private readonly matchGroupService: MatchGroupService) {}

  @Public()
  @Get('categories/:categoryId/groups')
  public async listByCategory(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Query() filters: SearchQueryDto,
  ): Promise<MatchGroupResponseDto[]> {
    return (await this.matchGroupService.listByCategory(categoryId, filters)).map(
      toMatchGroupResponse,
    );
  }

  @Public()
  @Get('groups/:id')
  public async get(@Param('id', ParseIdPipe) id: string): Promise<MatchGroupResponseDto> {
    return toMatchGroupResponse(await this.matchGroupService.findByIdOrFail(id));
  }

  @Post('categories/:categoryId/groups')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async create(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Body() input: CreateMatchGroupDto,
  ): Promise<MatchGroupResponseDto> {
    return toMatchGroupResponse(await this.matchGroupService.create(categoryId, input));
  }

  @Patch('groups/:id')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: string,
    @Body() changes: UpdateMatchGroupDto,
  ): Promise<MatchGroupResponseDto> {
    return toMatchGroupResponse(await this.matchGroupService.update(id, changes));
  }

  @Delete('groups/:id')
  @HttpCode(204)
  @RequirePermission(Permission.TEAM_MANAGE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    await this.matchGroupService.remove(id);
  }
}

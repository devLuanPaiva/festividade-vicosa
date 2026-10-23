import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CreateTeamDto } from '../dto/create-team.dto';
import type { TeamResponseDto } from '../dto/team-response.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { toTeamResponse } from '../mappers/team-response.mapper';
import { TeamService } from '../services/team.service';

@Controller()
export class TeamController {
  public constructor(private readonly teamService: TeamService) {}

  @Public()
  @Get('categories/:categoryId/teams')
  public async listByCategory(
    @Param('categoryId', ParseIdPipe) categoryId: number,
  ): Promise<TeamResponseDto[]> {
    return (await this.teamService.listByCategory(categoryId)).map(toTeamResponse);
  }

  @Public()
  @Get('teams/:id')
  public async get(@Param('id', ParseIdPipe) id: number): Promise<TeamResponseDto> {
    return toTeamResponse(await this.teamService.findByIdOrFail(id));
  }

  @Post('categories/:categoryId/teams')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async create(
    @Param('categoryId', ParseIdPipe) categoryId: number,
    @Body() input: CreateTeamDto,
  ): Promise<TeamResponseDto> {
    return toTeamResponse(await this.teamService.create(categoryId, input));
  }

  @Patch('teams/:id')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() changes: UpdateTeamDto,
  ): Promise<TeamResponseDto> {
    return toTeamResponse(await this.teamService.update(id, changes));
  }

  @Delete('teams/:id')
  @HttpCode(204)
  @RequirePermission(Permission.TEAM_MANAGE)
  public async remove(@Param('id', ParseIdPipe) id: number): Promise<void> {
    await this.teamService.remove(id);
  }
}

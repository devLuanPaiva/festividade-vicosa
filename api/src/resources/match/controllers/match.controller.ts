import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import type { AuthenticatedUser } from '../../auth/dto/authenticated-user.dto';
import { CurrentUser, Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CreateMatchBatchDto } from '../dto/create-match-batch.dto';
import { CreateMatchDto } from '../dto/create-match.dto';
import { ListMatchesQueryDto } from '../dto/list-matches-query.dto';
import type { MatchResponseDto } from '../dto/match-response.dto';
import { RecordResultDto } from '../dto/record-result.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';
import { toMatchResponse } from '../mappers/match-response.mapper';
import { MatchBatchService } from '../services/match-batch.service';
import { MatchResultService } from '../services/match-result.service';
import { MatchService } from '../services/match.service';

@Controller()
export class MatchController {
  public constructor(
    private readonly matchService: MatchService,
    private readonly matchResultService: MatchResultService,
    private readonly matchBatchService: MatchBatchService,
  ) {}

  @Public()
  @Get('categories/:categoryId/matches')
  public async listByCategory(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Query() filters: ListMatchesQueryDto,
  ): Promise<MatchResponseDto[]> {
    return (await this.matchService.listByCategory(categoryId, filters)).map(toMatchResponse);
  }

  @Public()
  @Get('matches/:id')
  public async get(@Param('id', ParseIdPipe) id: string): Promise<MatchResponseDto> {
    return toMatchResponse(await this.matchService.findByIdOrFail(id));
  }

  @Post('categories/:categoryId/matches')
  @RequirePermission(Permission.MATCH_CREATE)
  public async create(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Body() input: CreateMatchDto,
  ): Promise<MatchResponseDto> {
    return toMatchResponse(await this.matchService.create(categoryId, input));
  }

  @Post('categories/:categoryId/matches/batch')
  @RequirePermission(Permission.MATCH_CREATE)
  public async createMany(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Body() input: CreateMatchBatchDto,
  ): Promise<MatchResponseDto[]> {
    return (await this.matchBatchService.createMany(categoryId, input)).map(toMatchResponse);
  }

  @Patch('matches/:id')
  @RequirePermission(Permission.MATCH_CREATE)
  public async update(
    @Param('id', ParseIdPipe) id: string,
    @Body() changes: UpdateMatchDto,
  ): Promise<MatchResponseDto> {
    return toMatchResponse(await this.matchService.update(id, changes));
  }

  @Put('matches/:id/result')
  @RequirePermission(Permission.MATCH_RECORD_SCORE)
  public async recordResult(
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id', ParseIdPipe) id: string,
    @Body() input: RecordResultDto,
  ): Promise<MatchResponseDto> {
    return toMatchResponse(await this.matchResultService.record(id, actor.id, input));
  }

  @Delete('matches/:id')
  @HttpCode(204)
  @RequirePermission(Permission.MATCH_CREATE)
  public async remove(@Param('id', ParseIdPipe) id: string): Promise<void> {
    await this.matchService.remove(id);
  }
}

import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { CreateEditionDto } from '../dto/create-edition.dto';
import type { EditionResponseDto } from '../dto/edition-response.dto';
import { UpdateEditionDto } from '../dto/update-edition.dto';
import { toEditionResponse } from '../mappers/edition-response.mapper';
import { EditionService } from '../services/edition.service';

@Controller('editions')
export class EditionController {
  public constructor(private readonly editionService: EditionService) {}

  @Public()
  @Get()
  public async list(): Promise<EditionResponseDto[]> {
    return (await this.editionService.list()).map(toEditionResponse);
  }

  @Public()
  @Get(':id')
  public async get(@Param('id', ParseIdPipe) id: number): Promise<EditionResponseDto> {
    return toEditionResponse(await this.editionService.findByIdOrFail(id));
  }

  @Post()
  @RequirePermission(Permission.SCHEDULE_MANAGE)
  public async create(@Body() input: CreateEditionDto): Promise<EditionResponseDto> {
    return toEditionResponse(await this.editionService.create(input));
  }

  @Patch(':id')
  @RequirePermission(Permission.SCHEDULE_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() changes: UpdateEditionDto,
  ): Promise<EditionResponseDto> {
    return toEditionResponse(await this.editionService.update(id, changes));
  }
}

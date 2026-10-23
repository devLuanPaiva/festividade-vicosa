import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public, RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { CategoryResponseDto } from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { toCategoryResponse } from '../mappers/category-response.mapper';
import { CategoryService } from '../services/category.service';

@Controller()
export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get('sub-events/:subEventId/categories')
  public async listBySubEvent(
    @Param('subEventId', ParseIdPipe) subEventId: number,
  ): Promise<CategoryResponseDto[]> {
    return (await this.categoryService.listBySubEvent(subEventId)).map(toCategoryResponse);
  }

  @Public()
  @Get('categories/:id')
  public async get(@Param('id', ParseIdPipe) id: number): Promise<CategoryResponseDto> {
    return toCategoryResponse(await this.categoryService.findByIdOrFail(id));
  }

  @Post('sub-events/:subEventId/categories')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async create(
    @Param('subEventId', ParseIdPipe) subEventId: number,
    @Body() input: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return toCategoryResponse(await this.categoryService.create(subEventId, input));
  }

  @Patch('categories/:id')
  @RequirePermission(Permission.TEAM_MANAGE)
  public async update(
    @Param('id', ParseIdPipe) id: number,
    @Body() changes: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return toCategoryResponse(await this.categoryService.update(id, changes));
  }
}

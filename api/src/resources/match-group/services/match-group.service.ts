import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import { CategoryService } from '../../category/services/category.service';
import type { CreateMatchGroupDto } from '../dto/create-match-group.dto';
import type { UpdateMatchGroupDto } from '../dto/update-match-group.dto';
import type { MatchGroup } from '../entities/match-group.entity';
import { MatchGroupRepository, type MatchGroupFilters } from '../repository/match-group.repository';

@Injectable()
export class MatchGroupService {
  public constructor(
    private readonly matchGroupRepository: MatchGroupRepository,
    private readonly categoryService: CategoryService,
  ) {}

  public async listByCategory(
    categoryId: string,
    filters: MatchGroupFilters,
  ): Promise<MatchGroup[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    return this.matchGroupRepository.findByCategory(categoryId, filters);
  }

  public async findByIdOrFail(id: string): Promise<MatchGroup> {
    const group = await this.matchGroupRepository.findById(id);
    if (!group) {
      throw new NotFoundException(apiError('GROUP_NOT_FOUND', 'Grupo não encontrado.', 'id'));
    }
    return group;
  }

  public async create(categoryId: string, input: CreateMatchGroupDto): Promise<MatchGroup> {
    await this.categoryService.findByIdOrFail(categoryId);
    await this.assertNameAvailable(categoryId, input.name);
    return this.matchGroupRepository.create({ categoryId, name: input.name });
  }

  public async update(id: string, changes: UpdateMatchGroupDto): Promise<MatchGroup> {
    const current = await this.findByIdOrFail(id);
    if (changes.name !== current.name) {
      await this.assertNameAvailable(current.categoryId, changes.name);
    }
    await this.matchGroupRepository.update(id, changes.name);
    return this.findByIdOrFail(id);
  }

  public async remove(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    await this.matchGroupRepository.remove(id);
  }

  private async assertNameAvailable(categoryId: string, name: string): Promise<void> {
    if (await this.matchGroupRepository.findByCategoryAndName(categoryId, name)) {
      throw new ConflictException(
        apiError('GROUP_NAME_TAKEN', 'Já existe um grupo com este nome na categoria.', 'name'),
      );
    }
  }
}

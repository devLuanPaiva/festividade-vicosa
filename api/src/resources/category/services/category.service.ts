import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { apiError } from '../../../common/errors/api-error';
import type { SubEventType } from '../../sub-event/enums/sub-event-type.enum';
import { SubEventService } from '../../sub-event/services/sub-event.service';
import type { CreateCategoryDto } from '../dto/create-category.dto';
import type { UpdateCategoryDto } from '../dto/update-category.dto';
import type { Category } from '../entities/category.entity';
import { CategoryRepository, type CategoryFilters } from '../repository/category.repository';
import { hasChampionship } from '../rules/championship.rule';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly subEventService: SubEventService,
  ) {}

  public async listBySubEvent(subEventId: string, filters: CategoryFilters): Promise<Category[]> {
    await this.subEventService.findByIdOrFail(subEventId);
    return this.categoryRepository.findBySubEvent(subEventId, filters);
  }

  public listByIds(ids: string[]): Promise<Category[]> {
    return this.categoryRepository.findByIds(ids);
  }

  public async findByIdOrFail(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(
        apiError('CATEGORY_NOT_FOUND', 'Categoria não encontrada.', 'id'),
      );
    }
    return category;
  }

  public async create(subEventId: string, input: CreateCategoryDto): Promise<Category> {
    const subEvent = await this.subEventService.findByIdOrFail(subEventId);
    this.assertHasChampionship(subEvent.type);
    await this.assertNameAvailable(subEventId, input.name);

    return this.categoryRepository.create({
      subEventId,
      name: input.name,
      gender: input.gender,
      ageRange: input.ageRange ?? null,
    });
  }

  public async update(id: string, changes: UpdateCategoryDto): Promise<Category> {
    const current = await this.findByIdOrFail(id);
    if (changes.name !== undefined && changes.name !== current.name) {
      await this.assertNameAvailable(current.subEventId, changes.name);
    }
    await this.categoryRepository.update(id, changes);
    return this.findByIdOrFail(id);
  }

  private assertHasChampionship(type: SubEventType): void {
    if (!hasChampionship(type)) {
      throw new BadRequestException(
        apiError(
          'SUB_EVENT_WITHOUT_CHAMPIONSHIP',
          'Somente futsal e handebol têm campeonato com categorias.',
          'subEventId',
        ),
      );
    }
  }

  private async assertNameAvailable(subEventId: string, name: string): Promise<void> {
    if (await this.categoryRepository.findBySubEventAndName(subEventId, name)) {
      throw new ConflictException(
        apiError('CATEGORY_NAME_TAKEN', 'Já existe uma categoria com este nome.', 'name'),
      );
    }
  }
}

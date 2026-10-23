import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import { Category } from '../entities/category.entity';
import type { Gender } from '../enums/gender.enum';

export interface CategoryRecord {
  subEventId: string;
  name: string;
  gender: Gender;
  ageRange: string | null;
}

export type CategoryChanges = Partial<Omit<CategoryRecord, 'subEventId'>>;

export interface CategoryFilters {
  gender?: Gender;
  search?: string;
}

function buildWhere(subEventId: string, filters: CategoryFilters): FindOptionsWhere<Category> {
  return {
    subEventId,
    ...(filters.gender && { gender: filters.gender }),
    ...(filters.search && { name: containsText(filters.search) }),
  };
}

@Injectable()
export class CategoryRepository {
  public constructor(
    @InjectRepository(Category) private readonly repository: Repository<Category>,
  ) {}

  public findBySubEvent(subEventId: string, filters: CategoryFilters): Promise<Category[]> {
    return this.repository.find({ where: buildWhere(subEventId, filters), order: { id: 'ASC' } });
  }

  public findById(id: string): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  public findBySubEventAndName(subEventId: string, name: string): Promise<Category | null> {
    return this.repository.findOneBy({ subEventId, name });
  }

  public create(record: CategoryRecord): Promise<Category> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: string, changes: CategoryChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}

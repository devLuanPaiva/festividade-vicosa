import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import type { Gender } from '../enums/gender.enum';

export interface CategoryRecord {
  subEventId: number;
  name: string;
  gender: Gender;
  ageRange: string | null;
}

export type CategoryChanges = Partial<Omit<CategoryRecord, 'subEventId'>>;

@Injectable()
export class CategoryRepository {
  public constructor(
    @InjectRepository(Category) private readonly repository: Repository<Category>,
  ) {}

  public findBySubEvent(subEventId: number): Promise<Category[]> {
    return this.repository.find({ where: { subEventId }, order: { id: 'ASC' } });
  }

  public findById(id: number): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  public findBySubEventAndName(subEventId: number, name: string): Promise<Category | null> {
    return this.repository.findOneBy({ subEventId, name });
  }

  public create(record: CategoryRecord): Promise<Category> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: number, changes: CategoryChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}

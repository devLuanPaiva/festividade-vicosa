import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import { MatchGroup } from '../entities/match-group.entity';

export interface MatchGroupRecord {
  categoryId: string;
  name: string;
}

export interface MatchGroupFilters {
  search?: string;
}

@Injectable()
export class MatchGroupRepository {
  public constructor(
    @InjectRepository(MatchGroup) private readonly repository: Repository<MatchGroup>,
  ) {}

  public findByCategory(categoryId: string, filters: MatchGroupFilters): Promise<MatchGroup[]> {
    return this.repository.find({
      where: { categoryId, ...(filters.search && { name: containsText(filters.search) }) },
      order: { name: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<MatchGroup | null> {
    return this.repository.findOneBy({ id });
  }

  public findByCategoryAndName(categoryId: string, name: string): Promise<MatchGroup | null> {
    return this.repository.findOneBy({ categoryId, name });
  }

  public create(record: MatchGroupRecord): Promise<MatchGroup> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: string, name: string): Promise<unknown> {
    return this.repository.update({ id }, { name });
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}

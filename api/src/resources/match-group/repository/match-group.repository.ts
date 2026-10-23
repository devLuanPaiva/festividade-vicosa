import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchGroup } from '../entities/match-group.entity';

export interface MatchGroupRecord {
  categoryId: number;
  name: string;
}

@Injectable()
export class MatchGroupRepository {
  public constructor(
    @InjectRepository(MatchGroup) private readonly repository: Repository<MatchGroup>,
  ) {}

  public findByCategory(categoryId: number): Promise<MatchGroup[]> {
    return this.repository.find({ where: { categoryId }, order: { name: 'ASC', id: 'ASC' } });
  }

  public findById(id: number): Promise<MatchGroup | null> {
    return this.repository.findOneBy({ id });
  }

  public findByCategoryAndName(categoryId: number, name: string): Promise<MatchGroup | null> {
    return this.repository.findOneBy({ categoryId, name });
  }

  public create(record: MatchGroupRecord): Promise<MatchGroup> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: number, name: string): Promise<unknown> {
    return this.repository.update({ id }, { name });
  }

  public remove(id: number): Promise<unknown> {
    return this.repository.delete({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import { Edition } from '../entities/edition.entity';

export interface EditionRecord {
  year: number;
  name: string;
  description: string | null;
}

export interface EditionFilters {
  year?: number;
  search?: string;
}

function buildWhere(filters: EditionFilters): FindOptionsWhere<Edition> {
  return {
    ...(filters.year !== undefined && { year: filters.year }),
    ...(filters.search && { name: containsText(filters.search) }),
  };
}

@Injectable()
export class EditionRepository {
  public constructor(@InjectRepository(Edition) private readonly repository: Repository<Edition>) {}

  public findAll(filters: EditionFilters): Promise<Edition[]> {
    return this.repository.find({ where: buildWhere(filters), order: { year: 'DESC' } });
  }

  public findById(id: string): Promise<Edition | null> {
    return this.repository.findOneBy({ id });
  }

  public findByYear(year: number): Promise<Edition | null> {
    return this.repository.findOneBy({ year });
  }

  public create(record: EditionRecord): Promise<Edition> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: string, changes: Partial<EditionRecord>): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}

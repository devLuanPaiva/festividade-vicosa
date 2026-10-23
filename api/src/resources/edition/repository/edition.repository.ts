import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edition } from '../entities/edition.entity';

export interface EditionRecord {
  year: number;
  name: string;
  description: string | null;
}

@Injectable()
export class EditionRepository {
  public constructor(@InjectRepository(Edition) private readonly repository: Repository<Edition>) {}

  public findAll(): Promise<Edition[]> {
    return this.repository.find({ order: { year: 'DESC' } });
  }

  public findById(id: number): Promise<Edition | null> {
    return this.repository.findOneBy({ id });
  }

  public findByYear(year: number): Promise<Edition | null> {
    return this.repository.findOneBy({ year });
  }

  public create(record: EditionRecord): Promise<Edition> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: number, changes: Partial<EditionRecord>): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}

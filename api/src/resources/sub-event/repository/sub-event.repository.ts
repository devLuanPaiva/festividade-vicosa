import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubEvent } from '../entities/sub-event.entity';
import type { SubEventType } from '../enums/sub-event-type.enum';

export interface SubEventRecord {
  editionId: number;
  type: SubEventType;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
}

export type SubEventChanges = Partial<Omit<SubEventRecord, 'editionId' | 'type'>>;

@Injectable()
export class SubEventRepository {
  public constructor(
    @InjectRepository(SubEvent) private readonly repository: Repository<SubEvent>,
  ) {}

  public findByEdition(editionId: number): Promise<SubEvent[]> {
    return this.repository.find({ where: { editionId }, order: { startDate: 'ASC', id: 'ASC' } });
  }

  public findById(id: number): Promise<SubEvent | null> {
    return this.repository.findOneBy({ id });
  }

  public findByEditionAndType(editionId: number, type: SubEventType): Promise<SubEvent | null> {
    return this.repository.findOneBy({ editionId, type });
  }

  public create(record: SubEventRecord): Promise<SubEvent> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: number, changes: SubEventChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

export interface TeamRecord {
  categoryId: number;
  groupId: number | null;
  name: string;
}

export type TeamChanges = Partial<Omit<TeamRecord, 'categoryId'>>;

@Injectable()
export class TeamRepository {
  public constructor(@InjectRepository(Team) private readonly repository: Repository<Team>) {}

  public findByCategory(categoryId: number): Promise<Team[]> {
    return this.repository.find({ where: { categoryId }, order: { name: 'ASC', id: 'ASC' } });
  }

  public findById(id: number): Promise<Team | null> {
    return this.repository.findOneBy({ id });
  }

  public findByCategoryAndName(categoryId: number, name: string): Promise<Team | null> {
    return this.repository.findOneBy({ categoryId, name });
  }

  public create(record: TeamRecord): Promise<Team> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: number, changes: TeamChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public remove(id: number): Promise<unknown> {
    return this.repository.delete({ id });
  }
}

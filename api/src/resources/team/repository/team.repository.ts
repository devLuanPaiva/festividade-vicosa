import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { containsText } from '../../../common/database/text-search';
import { Team } from '../entities/team.entity';

export interface TeamRecord {
  categoryId: string;
  groupId: string | null;
  name: string;
  slug: string;
  city: string;
  abbreviation: string | null;
  photoKey: string | null;
}

export type TeamChanges = Partial<Omit<TeamRecord, 'categoryId'>>;

export interface TeamFilters {
  groupId?: string;
  city?: string;
  search?: string;
}

function buildWhere(categoryId: string, filters: TeamFilters): FindOptionsWhere<Team> {
  return {
    categoryId,
    ...(filters.groupId && { groupId: filters.groupId }),
    ...(filters.city && { city: containsText(filters.city) }),
    ...(filters.search && { name: containsText(filters.search) }),
  };
}

@Injectable()
export class TeamRepository {
  public constructor(@InjectRepository(Team) private readonly repository: Repository<Team>) {}

  public findByCategory(categoryId: string, filters: TeamFilters): Promise<Team[]> {
    return this.repository.find({
      where: buildWhere(categoryId, filters),
      order: { name: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<Team | null> {
    return this.repository.findOneBy({ id });
  }

  public findByCategoryAndName(categoryId: string, name: string): Promise<Team | null> {
    return this.repository.findOneBy({ categoryId, name });
  }

  public findByCategoryAndSlug(categoryId: string, slug: string): Promise<Team | null> {
    return this.repository.findOneBy({ categoryId, slug });
  }

  public create(record: TeamRecord): Promise<Team> {
    return this.repository.save(this.repository.create(record));
  }

  public update(id: string, changes: TeamChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}

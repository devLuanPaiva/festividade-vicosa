import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { QualifiedTeam } from '../entities/qualified-team.entity';

export interface QualifiedTeamRecord {
  teamId: string;
  position: number;
}

@Injectable()
export class QualifiedTeamRepository {
  public constructor(
    @InjectRepository(QualifiedTeam) private readonly repository: Repository<QualifiedTeam>,
  ) {}

  public findByGroups(groupIds: string[]): Promise<QualifiedTeam[]> {
    return this.repository.find({
      where: { groupId: In(groupIds) },
      order: { groupId: 'ASC', position: 'ASC' },
    });
  }

  public replaceForGroup(
    groupId: string,
    records: QualifiedTeamRecord[],
  ): Promise<QualifiedTeam[]> {
    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(QualifiedTeam, { groupId });
      return manager.save(
        QualifiedTeam,
        records.map((record) => manager.create(QualifiedTeam, { groupId, ...record })),
      );
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';

export interface RoleAssignment {
  roleId: string;
  isPrimary: boolean;
}

@Injectable()
export class UserRoleRepository {
  public constructor(
    @InjectRepository(UserRole) private readonly repository: Repository<UserRole>,
  ) {}

  public findByUserIds(userIds: string[]): Promise<UserRole[]> {
    return this.repository.find({
      where: { userId: In(userIds) },
      relations: { role: true },
      order: { isPrimary: 'DESC', role: { name: 'ASC' } },
    });
  }

  public async findRoleIdsByUserId(userId: string): Promise<string[]> {
    const userRoles = await this.repository.findBy({ userId });
    return userRoles.map((userRole) => userRole.roleId);
  }

  public async findUserIdsByRoleId(roleId: string): Promise<string[]> {
    const userRoles = await this.repository.findBy({ roleId });
    return userRoles.map((userRole) => userRole.userId);
  }

  public async countUsersByRole(): Promise<Map<string, number>> {
    const rows = await this.repository
      .createQueryBuilder('userRole')
      .select('userRole.role_id', 'roleId')
      .addSelect('count(*)::int', 'total')
      .groupBy('userRole.role_id')
      .getRawMany<{ roleId: string; total: number }>();
    return new Map(rows.map(({ roleId, total }) => [roleId, total]));
  }

  public replaceAssignments(userId: string, assignments: RoleAssignment[]): Promise<void> {
    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(UserRole, { userId });
      await manager.insert(
        UserRole,
        assignments.map(({ roleId, isPrimary }) => ({ userId, roleId, isPrimary })),
      );
    });
  }
}

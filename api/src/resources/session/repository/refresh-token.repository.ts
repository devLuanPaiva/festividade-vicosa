import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

export interface NewRefreshToken {
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
}

@Injectable()
export class RefreshTokenRepository {
  public constructor(
    @InjectRepository(RefreshToken) private readonly repository: Repository<RefreshToken>,
  ) {}

  public findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repository.findOneBy({ tokenHash });
  }

  public async create(record: NewRefreshToken): Promise<void> {
    await this.repository.insert(record);
  }

  public rotate(previous: RefreshToken, next: NewRefreshToken, now: Date): Promise<void> {
    return this.repository.manager.transaction(async (manager) => {
      if (previous.rotatedAt === null) {
        await manager.update(RefreshToken, { id: previous.id }, { rotatedAt: now });
      }
      await manager.insert(RefreshToken, next);
    });
  }

  public async deleteFamily(familyId: string): Promise<void> {
    await this.repository.delete({ familyId });
  }

  public async deleteExpired(now: Date): Promise<void> {
    await this.repository.delete({ expiresAt: LessThan(now) });
  }
}

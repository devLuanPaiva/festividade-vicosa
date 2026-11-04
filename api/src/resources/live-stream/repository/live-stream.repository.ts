import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveStream } from '../entities/live-stream.entity';

export interface LiveStreamRecord {
  title: string;
  videoId: string;
  startsAt: Date;
}

export type LiveStreamChanges = Partial<LiveStreamRecord & { previewKey: string | null }>;

@Injectable()
export class LiveStreamRepository {
  public constructor(
    @InjectRepository(LiveStream) private readonly repository: Repository<LiveStream>,
  ) {}

  public findAll(): Promise<LiveStream[]> {
    return this.repository.find({ order: { startsAt: 'DESC', id: 'ASC' } });
  }

  public findById(id: string): Promise<LiveStream | null> {
    return this.repository.findOneBy({ id });
  }

  public findActive(): Promise<LiveStream | null> {
    return this.repository.findOneBy({ active: true });
  }

  public create(record: LiveStreamRecord): Promise<LiveStream> {
    return this.repository.save(
      this.repository.create({ ...record, previewKey: null, active: false }),
    );
  }

  public update(id: string, changes: LiveStreamChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public deactivate(id: string): Promise<unknown> {
    return this.repository.update({ id }, { active: false });
  }

  public activateOnly(id: string): Promise<void> {
    return this.repository.manager.transaction(async (manager) => {
      await manager.update(LiveStream, { active: true }, { active: false });
      await manager.update(LiveStream, { id }, { active: true });
    });
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}

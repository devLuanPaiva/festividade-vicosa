import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../entities/album.entity';

export interface AlbumDayRecord {
  date: string;
  photoCount: number;
  coverStorageKey: string;
}

interface AlbumDayRow {
  date: string;
  photo_count: string;
  cover_storage_key: string;
}

@Injectable()
export class AlbumRepository {
  public constructor(@InjectRepository(Album) private readonly repository: Repository<Album>) {}

  public findByEventDay(subEventId: string, eventDate: string): Promise<Album | null> {
    return this.repository.findOneBy({ subEventId, eventDate });
  }

  public findByMatch(matchId: string): Promise<Album | null> {
    return this.repository.findOneBy({ matchId });
  }

  public async ensureForEventDay(subEventId: string, eventDate: string): Promise<Album> {
    await this.repository.insert({ subEventId, eventDate }).catch(ignoreDuplicate);
    return this.repository.findOneByOrFail({ subEventId, eventDate });
  }

  public async ensureForMatch(matchId: string): Promise<Album> {
    await this.repository.insert({ matchId }).catch(ignoreDuplicate);
    return this.repository.findOneByOrFail({ matchId });
  }

  public async listEventDays(subEventId: string): Promise<AlbumDayRecord[]> {
    const rows = await this.repository
      .createQueryBuilder('album')
      .innerJoin('photo', 'photo', 'photo.album_id = album.id')
      .select(`to_char(album.event_date, 'YYYY-MM-DD')`, 'date')
      .addSelect('count(photo.id)', 'photo_count')
      .addSelect(
        `(array_agg(photo.storage_key ORDER BY photo.sort_order, photo.created_at))[1]`,
        'cover_storage_key',
      )
      .where('album.sub_event_id = :subEventId', { subEventId })
      .groupBy('album.id')
      .orderBy('album.event_date', 'ASC')
      .getRawMany<AlbumDayRow>();
    return rows.map((row) => ({
      date: row.date,
      photoCount: Number(row.photo_count),
      coverStorageKey: row.cover_storage_key,
    }));
  }
}

const UNIQUE_VIOLATION_CODE = '23505';

function ignoreDuplicate(error: unknown): void {
  const code = (error as { driverError?: { code?: string } }).driverError?.code;
  if (code !== UNIQUE_VIOLATION_CODE) {
    throw error;
  }
}

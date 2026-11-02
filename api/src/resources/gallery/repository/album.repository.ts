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

export const EVENT_TIME_ZONE = 'America/Fortaleza';

const LIST_DAYS_QUERY = `
  WITH day_photo AS (
    SELECT to_char(album.event_date, 'YYYY-MM-DD') AS day, photo.storage_key,
           0 AS source, photo.sort_order, photo.created_at
    FROM album
    JOIN photo ON photo.album_id = album.id
    WHERE album.sub_event_id = $1
    UNION ALL
    SELECT to_char((game.scheduled_at AT TIME ZONE $2)::date, 'YYYY-MM-DD') AS day,
           photo.storage_key, 1 AS source, photo.sort_order, photo.created_at
    FROM album
    JOIN photo ON photo.album_id = album.id
    JOIN match game ON game.id = album.match_id
    JOIN category ON category.id = game.category_id
    WHERE category.sub_event_id = $1
  )
  SELECT day AS date, count(*) AS photo_count,
         (array_agg(storage_key ORDER BY source, sort_order, created_at))[1] AS cover_storage_key
  FROM day_photo
  GROUP BY day
  ORDER BY day
`;

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
    const rows: AlbumDayRow[] = await this.repository.query(LIST_DAYS_QUERY, [
      subEventId,
      EVENT_TIME_ZONE,
    ]);
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';

export interface PhotoRecord {
  albumId: string;
  storageKey: string;
  uploadedById: string;
}

@Injectable()
export class PhotoRepository {
  public constructor(@InjectRepository(Photo) private readonly repository: Repository<Photo>) {}

  public findByAlbum(albumId: string): Promise<Photo[]> {
    return this.repository.find({
      where: { albumId },
      order: { sortOrder: 'ASC', createdAt: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<Photo | null> {
    return this.repository.findOneBy({ id });
  }

  public async create(record: PhotoRecord): Promise<Photo> {
    const sortOrder = await this.nextSortOrder(record.albumId);
    return this.repository.save(this.repository.create({ ...record, sortOrder }));
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }

  public reorder(orderedIds: string[]): Promise<void> {
    return this.repository.manager.transaction(async (manager) => {
      for (const [sortOrder, id] of orderedIds.entries()) {
        await manager.update(Photo, { id }, { sortOrder });
      }
    });
  }

  private async nextSortOrder(albumId: string): Promise<number> {
    const { highest } = (await this.repository
      .createQueryBuilder('photo')
      .select('max(photo.sort_order)', 'highest')
      .where('photo.album_id = :albumId', { albumId })
      .getRawOne<{ highest: number | null }>()) ?? { highest: null };
    return highest === null ? 0 : highest + 1;
  }
}

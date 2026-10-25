import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { MatchModule } from '../match/match.module';
import { SubEventModule } from '../sub-event/sub-event.module';
import { GalleryController } from './controllers/gallery.controller';
import { MatchPhotoController } from './controllers/match-photo.controller';
import { PhotoController } from './controllers/photo.controller';
import { Album } from './entities/album.entity';
import { Photo } from './entities/photo.entity';
import { AlbumRepository } from './repository/album.repository';
import { PhotoRepository } from './repository/photo.repository';
import { AlbumService } from './services/album.service';
import { GalleryService } from './services/gallery.service';
import { PhotoManagementService } from './services/photo-management.service';
import { PhotoUploadService } from './services/photo-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Photo]), SubEventModule, MatchModule, StorageModule],
  controllers: [GalleryController, MatchPhotoController, PhotoController],
  providers: [
    AlbumService,
    GalleryService,
    PhotoUploadService,
    PhotoManagementService,
    AlbumRepository,
    PhotoRepository,
  ],
})
export class GalleryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { SubEventModule } from '../sub-event/sub-event.module';
import { GalleryController } from './controllers/gallery.controller';
import { PhotoController } from './controllers/photo.controller';
import { Photo } from './entities/photo.entity';
import { PhotoRepository } from './repository/photo.repository';
import { GalleryService } from './services/gallery.service';
import { PhotoManagementService } from './services/photo-management.service';
import { PhotoStoreService } from './services/photo-store.service';
import { PhotoUploadService } from './services/photo-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), SubEventModule, StorageModule],
  controllers: [GalleryController, PhotoController],
  providers: [
    PhotoStoreService,
    GalleryService,
    PhotoUploadService,
    PhotoManagementService,
    PhotoRepository,
  ],
})
export class GalleryModule {}

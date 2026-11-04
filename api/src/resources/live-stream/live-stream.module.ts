import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../../storage/storage.module';
import { LiveStreamPreviewController } from './controllers/live-stream-preview.controller';
import { LiveStreamController } from './controllers/live-stream.controller';
import { LiveStream } from './entities/live-stream.entity';
import { LiveStreamRepository } from './repository/live-stream.repository';
import { LiveStreamPreviewService } from './services/live-stream-preview.service';
import { LiveStreamService } from './services/live-stream.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveStream]), StorageModule],
  controllers: [LiveStreamController, LiveStreamPreviewController],
  providers: [LiveStreamService, LiveStreamPreviewService, LiveStreamRepository],
})
export class LiveStreamModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './resources/auth/auth.module';
import { EditionModule } from './resources/edition/edition.module';
import { HealthModule } from './resources/health/health.module';
import { SubEventModule } from './resources/sub-event/sub-event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnvironment }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    EditionModule,
    SubEventModule,
  ],
})
export class AppModule {}

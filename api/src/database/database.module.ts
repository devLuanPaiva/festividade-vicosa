import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { EnvironmentVariables } from '../config/environment';
import { buildTypeOrmOptions } from './typeorm-options';

type TypedConfigService = ConfigService<EnvironmentVariables, true>;

function createModuleOptions(config: TypedConfigService): TypeOrmModuleOptions {
  return {
    ...buildTypeOrmOptions({
      DATABASE_HOST: config.get('DATABASE_HOST', { infer: true }),
      DATABASE_PORT: config.get('DATABASE_PORT', { infer: true }),
      DATABASE_USER: config.get('DATABASE_USER', { infer: true }),
      DATABASE_PASSWORD: config.get('DATABASE_PASSWORD', { infer: true }),
      DATABASE_NAME: config.get('DATABASE_NAME', { infer: true }),
    }),
    autoLoadEntities: true,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createModuleOptions,
    }),
  ],
})
export class DatabaseModule {}

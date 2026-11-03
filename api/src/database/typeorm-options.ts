import { join } from 'node:path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { EnvironmentVariables } from '../config/environment';

export type DatabaseEnvironment = Pick<
  EnvironmentVariables,
  'DATABASE_HOST' | 'DATABASE_PORT' | 'DATABASE_USER' | 'DATABASE_PASSWORD' | 'DATABASE_NAME'
>;

export function buildTypeOrmOptions(environment: DatabaseEnvironment): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: environment.DATABASE_HOST,
    port: environment.DATABASE_PORT,
    username: environment.DATABASE_USER,
    password: environment.DATABASE_PASSWORD,
    database: environment.DATABASE_NAME,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsRun: true,
    synchronize: false,
  };
}

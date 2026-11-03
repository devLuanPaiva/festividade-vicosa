import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { buildTypeOrmOptions } from './typeorm-options';

const environment = {
  DATABASE_HOST: 'db',
  DATABASE_PORT: 5432,
  DATABASE_USER: 'festival',
  DATABASE_PASSWORD: 'secret',
  DATABASE_NAME: 'festival_db',
};

describe('buildTypeOrmOptions', () => {
  it('never synchronizes the schema and runs migrations on startup', () => {
    expect(buildTypeOrmOptions(environment)).toMatchObject({
      synchronize: false,
      migrationsRun: true,
    });
  });

  it('uses snake case column and table names', () => {
    expect(buildTypeOrmOptions(environment).namingStrategy).toBeInstanceOf(SnakeNamingStrategy);
  });
});

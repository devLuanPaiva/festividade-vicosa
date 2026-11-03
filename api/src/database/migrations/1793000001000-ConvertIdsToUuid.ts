import type { MigrationInterface, QueryRunner } from 'typeorm';

interface Reference {
  table: string;
  column: string;
  parent: string;
  nullable?: boolean;
}

const TABLES_WITH_IDENTITY = [
  'role',
  'users',
  'edition',
  'sub_event',
  'category',
  'match_group',
  'team',
];

const REFERENCES: Reference[] = [
  { table: 'role_permissions', column: 'role_id', parent: 'role' },
  { table: 'users', column: 'role_id', parent: 'role' },
  { table: 'user_permission_overrides', column: 'user_id', parent: 'users' },
  { table: 'sub_event', column: 'edition_id', parent: 'edition' },
  { table: 'category', column: 'sub_event_id', parent: 'sub_event' },
  { table: 'match_group', column: 'category_id', parent: 'category' },
  { table: 'team', column: 'category_id', parent: 'category' },
  { table: 'team', column: 'group_id', parent: 'match_group', nullable: true },
];

const CONSTRAINTS = [
  ...TABLES_WITH_IDENTITY.map((table) => `ALTER TABLE ${table} ADD PRIMARY KEY (id)`),
  `ALTER TABLE role_permissions ADD PRIMARY KEY (role_id, permission_code)`,
  `ALTER TABLE user_permission_overrides ADD PRIMARY KEY (user_id, permission_code)`,
  `ALTER TABLE role_permissions ADD FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE`,
  `ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES role (id)`,
  `ALTER TABLE user_permission_overrides ADD FOREIGN KEY (user_id) REFERENCES users (id)`,
  `ALTER TABLE sub_event ADD FOREIGN KEY (edition_id) REFERENCES edition (id)`,
  `ALTER TABLE category ADD FOREIGN KEY (sub_event_id) REFERENCES sub_event (id)`,
  `ALTER TABLE match_group ADD FOREIGN KEY (category_id) REFERENCES category (id)`,
  `ALTER TABLE team ADD FOREIGN KEY (category_id) REFERENCES category (id)`,
  `ALTER TABLE sub_event ADD UNIQUE (edition_id, type)`,
  `ALTER TABLE category ADD UNIQUE (sub_event_id, name)`,
  `ALTER TABLE match_group ADD UNIQUE (category_id, name)`,
  `ALTER TABLE match_group ADD UNIQUE (id, category_id)`,
  `ALTER TABLE team ADD UNIQUE (category_id, name)`,
  `ALTER TABLE team ADD UNIQUE (category_id, slug)`,
  `ALTER TABLE team ADD UNIQUE (id, category_id)`,
  `ALTER TABLE team ADD FOREIGN KEY (group_id, category_id)
     REFERENCES match_group (id, category_id) ON DELETE SET NULL (group_id)`,
  `CREATE INDEX team_category_group_index ON team (category_id, group_id)`,
];

export class ConvertIdsToUuid1793000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.addNewIds(queryRunner);
    await this.copyReferences(queryRunner);
    await this.swapColumns(queryRunner);
    for (const statement of CONSTRAINTS) {
      await queryRunner.query(statement);
    }
  }

  public down(): Promise<void> {
    return Promise.reject(new Error('Converting the ids to uuid cannot be reverted.'));
  }

  private async addNewIds(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES_WITH_IDENTITY) {
      await queryRunner.query(
        `ALTER TABLE ${table} ADD COLUMN new_id uuid NOT NULL DEFAULT gen_random_uuid()`,
      );
    }
  }

  private async copyReferences(queryRunner: QueryRunner): Promise<void> {
    for (const { table, column, parent } of REFERENCES) {
      await queryRunner.query(`ALTER TABLE ${table} ADD COLUMN new_${column} uuid`);
      await queryRunner.query(
        `UPDATE ${table} SET new_${column} = ${parent}.new_id
         FROM ${parent} WHERE ${parent}.id = ${table}.${column}`,
      );
    }
  }

  private async swapColumns(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES_WITH_IDENTITY) {
      await queryRunner.query(`ALTER TABLE ${table} DROP COLUMN id CASCADE`);
      await queryRunner.query(`ALTER TABLE ${table} RENAME COLUMN new_id TO id`);
    }
    for (const { table, column, nullable } of REFERENCES) {
      await queryRunner.query(`ALTER TABLE ${table} DROP COLUMN ${column} CASCADE`);
      await queryRunner.query(`ALTER TABLE ${table} RENAME COLUMN new_${column} TO ${column}`);
      if (!nullable) {
        await queryRunner.query(`ALTER TABLE ${table} ALTER COLUMN ${column} SET NOT NULL`);
      }
    }
  }
}

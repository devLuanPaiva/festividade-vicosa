import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryGroupAndTeamTables1792900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE category (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        sub_event_id integer NOT NULL REFERENCES sub_event (id),
        name varchar NOT NULL,
        gender varchar NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
        age_range varchar,
        UNIQUE (sub_event_id, name)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE match_group (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        category_id integer NOT NULL REFERENCES category (id),
        name varchar NOT NULL,
        UNIQUE (category_id, name),
        UNIQUE (id, category_id)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE team (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        category_id integer NOT NULL REFERENCES category (id),
        group_id integer,
        name varchar NOT NULL,
        UNIQUE (category_id, name),
        UNIQUE (id, category_id),
        FOREIGN KEY (group_id, category_id) REFERENCES match_group (id, category_id)
          ON DELETE SET NULL (group_id)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX team_category_group_index ON team (category_id, group_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE team`);
    await queryRunner.query(`DROP TABLE match_group`);
    await queryRunner.query(`DROP TABLE category`);
  }
}

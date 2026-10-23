import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEditionAndSubEventTables1792800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE edition (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        year integer NOT NULL UNIQUE,
        name varchar NOT NULL,
        description varchar
      )
    `);
    await queryRunner.query(`
      CREATE TABLE sub_event (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        edition_id integer NOT NULL REFERENCES edition (id),
        type varchar NOT NULL CHECK (type IN (
          'JOCEV_HANDBALL', 'JOCEV_FUTSAL', 'JOCEV_BEACH_VOLLEYBALL', 'CULTURAL_FESTIVAL',
          'EMANCIPATION_RUN', 'ECOPEDAL', 'EMANCIPATION_PARTY'
        )),
        name varchar NOT NULL,
        description varchar,
        start_date date NOT NULL,
        end_date date NOT NULL,
        location varchar,
        UNIQUE (edition_id, type),
        CHECK (end_date >= start_date)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE sub_event`);
    await queryRunner.query(`DROP TABLE edition`);
  }
}

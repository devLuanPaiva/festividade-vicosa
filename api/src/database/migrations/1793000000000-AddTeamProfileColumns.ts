import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamProfileColumns1793000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE team
        ADD COLUMN slug varchar,
        ADD COLUMN city varchar NOT NULL DEFAULT '',
        ADD COLUMN abbreviation varchar,
        ADD COLUMN photo_key varchar
    `);
    await queryRunner.query(`UPDATE team SET slug = 'time-' || id`);
    await queryRunner.query(`ALTER TABLE team ALTER COLUMN slug SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE team ALTER COLUMN city DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE team ADD UNIQUE (category_id, slug)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE team DROP COLUMN slug, DROP COLUMN city`);
    await queryRunner.query(`ALTER TABLE team DROP COLUMN abbreviation, DROP COLUMN photo_key`);
  }
}

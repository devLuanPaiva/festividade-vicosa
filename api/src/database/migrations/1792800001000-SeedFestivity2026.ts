import type { MigrationInterface, QueryRunner } from 'typeorm';

const EDITION_YEAR = 2026;
const EDITION_NAME = 'Festividade de Emancipação Política de Viçosa 2026';

const SUB_EVENTS: [type: string, name: string, startDate: string, endDate: string][] = [
  ['JOCEV_HANDBALL', 'JOCEV - Handebol', '2026-12-04', '2026-12-06'],
  ['CULTURAL_FESTIVAL', 'JOCEV - Festival Cultural', '2026-12-08', '2026-12-08'],
  ['JOCEV_FUTSAL', 'JOCEV - Futsal', '2026-12-09', '2026-12-19'],
  ['JOCEV_BEACH_VOLLEYBALL', 'JOCEV - Vôlei de Areia', '2026-12-13', '2026-12-13'],
  ['EMANCIPATION_RUN', 'Corrida de Emancipação Política', '2026-12-13', '2026-12-13'],
  ['ECOPEDAL', 'Ecopedal', '2026-12-20', '2026-12-20'],
  ['EMANCIPATION_PARTY', 'Festa de Emancipação Política', '2026-12-27', '2026-12-28'],
];

export class SeedFestivity20261792800001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO edition (year, name) VALUES ($1, $2)`, [
      EDITION_YEAR,
      EDITION_NAME,
    ]);
    for (const [type, name, startDate, endDate] of SUB_EVENTS) {
      await queryRunner.query(
        `INSERT INTO sub_event (edition_id, type, name, start_date, end_date)
         SELECT id, $2, $3, $4, $5 FROM edition WHERE year = $1`,
        [EDITION_YEAR, type, name, startDate, endDate],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM sub_event WHERE edition_id IN (SELECT id FROM edition WHERE year = $1)`,
      [EDITION_YEAR],
    );
    await queryRunner.query(`DELETE FROM edition WHERE year = $1`, [EDITION_YEAR]);
  }
}

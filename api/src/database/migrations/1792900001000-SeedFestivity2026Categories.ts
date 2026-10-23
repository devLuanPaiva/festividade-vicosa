import type { MigrationInterface, QueryRunner } from 'typeorm';

const EDITION_YEAR = 2026;

type CategorySeed = [name: string, gender: string, ageRange: string];

const CATEGORIES_BY_SUB_EVENT_TYPE: Record<string, CategorySeed[]> = {
  JOCEV_HANDBALL: [
    ['12-14 Feminino', 'FEMALE', '12 a 14 anos'],
    ['Cadete Feminino', 'FEMALE', 'Cadete'],
    ['Cadete Masculino', 'MALE', 'Cadete'],
    ['Sub-18 Feminino', 'FEMALE', 'Sub-18'],
    ['Sub-18 Masculino', 'MALE', 'Sub-18'],
    ['Adulto Feminino', 'FEMALE', 'Adulto'],
    ['Adulto Masculino', 'MALE', 'Adulto'],
  ],
  JOCEV_FUTSAL: [
    ['Sub-13', 'MALE', 'Sub-13'],
    ['Sub-15', 'MALE', 'Sub-15'],
    ['Sub-18', 'MALE', 'Sub-18'],
    ['Adulto', 'MALE', 'Adulto'],
  ],
};

export class SeedFestivity2026Categories1792900001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [type, categories] of Object.entries(CATEGORIES_BY_SUB_EVENT_TYPE)) {
      for (const [name, gender, ageRange] of categories) {
        await queryRunner.query(
          `INSERT INTO category (sub_event_id, name, gender, age_range)
           SELECT sub_event.id, $3, $4, $5 FROM sub_event
           JOIN edition ON edition.id = sub_event.edition_id
           WHERE edition.year = $1 AND sub_event.type = $2`,
          [EDITION_YEAR, type, name, gender, ageRange],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM category WHERE sub_event_id IN (
         SELECT sub_event.id FROM sub_event
         JOIN edition ON edition.id = sub_event.edition_id
         WHERE edition.year = $1 AND sub_event.type = ANY($2)
       )`,
      [EDITION_YEAR, Object.keys(CATEGORIES_BY_SUB_EVENT_TYPE)],
    );
  }
}

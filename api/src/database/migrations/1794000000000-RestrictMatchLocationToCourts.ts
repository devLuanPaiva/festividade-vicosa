import type { MigrationInterface, QueryRunner } from 'typeorm';

const CONVERT_KNOWN_LOCATIONS = `
  UPDATE match SET location = CASE
    WHEN location ILIKE '%gin_sio%' THEN 'GYMNASIUM'
    WHEN location ILIKE '%pra_a 1%' THEN 'SQUARE_1'
    WHEN location ILIKE '%pra_a 2%' THEN 'SQUARE_2'
    ELSE NULL
  END
  WHERE location IS NOT NULL
`;

const ADD_LOCATION_CHECK = `
  ALTER TABLE match ADD CONSTRAINT match_location_check
    CHECK (location IN ('SQUARE_1', 'SQUARE_2', 'GYMNASIUM'))
`;

export class RestrictMatchLocationToCourts1794000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CONVERT_KNOWN_LOCATIONS);
    await queryRunner.query(ADD_LOCATION_CHECK);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE match DROP CONSTRAINT match_location_check');
  }
}

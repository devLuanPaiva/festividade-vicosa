import type { MigrationInterface, QueryRunner } from 'typeorm';

const STATEMENTS = [
  `ALTER TABLE match DROP CONSTRAINT match_round_check`,
  `ALTER TABLE match ADD CONSTRAINT match_round_check CHECK (round IN (
     'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL'
   ))`,
];

export class AddRoundOf321793700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const statement of STATEMENTS) {
      await queryRunner.query(statement);
    }
  }

  public down(): Promise<void> {
    return Promise.reject(new Error('Adding the round of 32 cannot be reverted.'));
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

const STATEMENTS = [
  `ALTER TABLE match ADD COLUMN bracket_position smallint CHECK (bracket_position >= 0)`,
  `ALTER TABLE match ADD CONSTRAINT match_bracket_position_knockout_check CHECK (
     bracket_position IS NULL OR stage = 'KNOCKOUT'
   )`,
  `CREATE UNIQUE INDEX match_bracket_slot_index
     ON match (category_id, round, bracket_position) WHERE bracket_position IS NOT NULL`,
];

export class AddMatchBracketPosition1793300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const statement of STATEMENTS) {
      await queryRunner.query(statement);
    }
  }

  public down(): Promise<void> {
    return Promise.reject(new Error('Adding the bracket position cannot be reverted.'));
  }
}

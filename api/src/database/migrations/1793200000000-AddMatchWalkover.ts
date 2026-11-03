import type { MigrationInterface, QueryRunner } from 'typeorm';

const DROP_SCORE_CHECKS = `
  DO $$
  DECLARE constraint_name text;
  BEGIN
    FOR constraint_name IN
      SELECT conname FROM pg_constraint
      WHERE conrelid = 'match'::regclass AND contype = 'c'
        AND (pg_get_constraintdef(oid) LIKE '%score_a IS NOT NULL%'
          OR pg_get_constraintdef(oid) LIKE '%score_a <> score_b%')
    LOOP
      EXECUTE format('ALTER TABLE match DROP CONSTRAINT %I', constraint_name);
    END LOOP;
  END $$
`;

const CONSTRAINTS = [
  `ALTER TABLE match ADD CONSTRAINT match_finalized_result_check CHECK (
     status = 'SCHEDULED'
     OR (finalized_by_id IS NOT NULL
       AND (result_type <> 'PLAYED' OR (score_a IS NOT NULL AND score_b IS NOT NULL)))
   )`,
  `ALTER TABLE match ADD CONSTRAINT match_knockout_decisive_check CHECK (
     status = 'SCHEDULED' OR stage = 'GROUP' OR result_type <> 'PLAYED'
     OR score_a <> score_b OR penalties_a IS NOT NULL
   )`,
  `ALTER TABLE match ADD CONSTRAINT match_walkover_has_no_play_check CHECK (
     result_type = 'PLAYED'
     OR (score_a IS NULL AND score_b IS NULL AND penalties_a IS NULL
       AND best_player_name IS NULL)
   )`,
  `ALTER TABLE match ADD CONSTRAINT match_walkover_winner_check CHECK (
     (result_type <> 'WALKOVER' OR winner_id IS NOT NULL)
     AND (result_type <> 'DOUBLE_WALKOVER' OR (winner_id IS NULL AND stage = 'GROUP'))
   )`,
  `ALTER TABLE match ADD CONSTRAINT match_winner_in_match_check CHECK (
     winner_id IS NULL OR winner_id IN (team_a_id, team_b_id)
   )`,
];

export class AddMatchWalkover1793200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE match ADD COLUMN result_type varchar NOT NULL DEFAULT 'PLAYED'
        CHECK (result_type IN ('PLAYED', 'WALKOVER', 'DOUBLE_WALKOVER'))
    `);
    await queryRunner.query(DROP_SCORE_CHECKS);
    for (const statement of CONSTRAINTS) {
      await queryRunner.query(statement);
    }
  }

  public down(): Promise<void> {
    return Promise.reject(new Error('Adding the walkover result cannot be reverted.'));
  }
}

import type { MigrationInterface, QueryRunner } from 'typeorm';

const CREATE_MATCH = `
  CREATE TABLE match (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL REFERENCES category (id),
    stage varchar NOT NULL CHECK (stage IN ('GROUP', 'KNOCKOUT')),
    group_id uuid,
    round varchar CHECK (round IN (
      'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL'
    )),
    scheduled_at timestamptz NOT NULL,
    location varchar,
    status varchar NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'FINALIZED')),
    team_a_id uuid NOT NULL,
    team_b_id uuid NOT NULL,
    score_a smallint CHECK (score_a >= 0),
    score_b smallint CHECK (score_b >= 0),
    penalties_a smallint CHECK (penalties_a >= 0),
    penalties_b smallint CHECK (penalties_b >= 0),
    winner_id uuid REFERENCES team (id),
    finalized_by_id uuid REFERENCES users (id),
    finalized_at timestamptz,
    best_player_name varchar,
    best_player_photo_key varchar,
    best_player_team_id uuid REFERENCES team (id),
    FOREIGN KEY (team_a_id, category_id) REFERENCES team (id, category_id),
    FOREIGN KEY (team_b_id, category_id) REFERENCES team (id, category_id),
    FOREIGN KEY (group_id, category_id) REFERENCES match_group (id, category_id),
    CHECK (team_a_id <> team_b_id),
    CHECK (
      (stage = 'GROUP' AND group_id IS NOT NULL AND round IS NULL)
      OR (stage = 'KNOCKOUT' AND group_id IS NULL AND round IS NOT NULL)
    ),
    CHECK (
      status = 'SCHEDULED'
      OR (score_a IS NOT NULL AND score_b IS NOT NULL AND finalized_by_id IS NOT NULL)
    ),
    CHECK ((penalties_a IS NULL) = (penalties_b IS NULL)),
    CHECK (
      penalties_a IS NULL
      OR (stage = 'KNOCKOUT' AND score_a = score_b AND penalties_a <> penalties_b)
    ),
    CHECK (
      status = 'SCHEDULED' OR stage = 'GROUP'
      OR score_a <> score_b OR penalties_a IS NOT NULL
    ),
    CHECK (
      best_player_name IS NULL AND best_player_photo_key IS NULL AND best_player_team_id IS NULL
      OR best_player_name IS NOT NULL AND best_player_team_id IN (team_a_id, team_b_id)
    )
  )
`;

const INDEXES = [
  `CREATE INDEX match_category_stage_schedule_index ON match (category_id, stage, scheduled_at)`,
  `CREATE INDEX match_status_schedule_index ON match (status, scheduled_at)`,
  `CREATE INDEX match_team_a_index ON match (team_a_id)`,
  `CREATE INDEX match_team_b_index ON match (team_b_id)`,
  `CREATE INDEX match_group_index ON match (group_id)`,
];

export class CreateMatchTable1793100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CREATE_MATCH);
    for (const statement of INDEXES) {
      await queryRunner.query(statement);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE match`);
  }
}

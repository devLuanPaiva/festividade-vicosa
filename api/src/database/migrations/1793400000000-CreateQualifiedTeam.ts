import type { MigrationInterface, QueryRunner } from 'typeorm';

const CREATE_QUALIFIED_TEAM = `
  CREATE TABLE qualified_team (
    group_id uuid NOT NULL REFERENCES match_group (id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES team (id) ON DELETE CASCADE,
    position smallint NOT NULL CHECK (position >= 1),
    PRIMARY KEY (group_id, team_id),
    UNIQUE (group_id, position)
  )
`;

export class CreateQualifiedTeam1793400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CREATE_QUALIFIED_TEAM);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE qualified_team`);
  }
}

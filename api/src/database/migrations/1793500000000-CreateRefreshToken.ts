import type { MigrationInterface, QueryRunner } from 'typeorm';

const CREATE_REFRESH_TOKEN = `
  CREATE TABLE refresh_token (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    family_id uuid NOT NULL,
    token_hash varchar(64) NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    rotated_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

const CREATE_FAMILY_INDEX = `CREATE INDEX refresh_token_family_id_idx ON refresh_token (family_id)`;

export class CreateRefreshToken1793500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CREATE_REFRESH_TOKEN);
    await queryRunner.query(CREATE_FAMILY_INDEX);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE refresh_token`);
  }
}

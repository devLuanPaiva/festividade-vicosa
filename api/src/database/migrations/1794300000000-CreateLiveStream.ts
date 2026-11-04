import type { MigrationInterface, QueryRunner } from 'typeorm';

const LIVE_MANAGE = 'live:manage';

const CREATE_LIVE_STREAM = `
  CREATE TABLE live_stream (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar NOT NULL,
    video_id varchar NOT NULL,
    preview_key varchar,
    starts_at timestamptz NOT NULL,
    active boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

const ONE_ACTIVE_LIVE_STREAM = `CREATE UNIQUE INDEX live_stream_one_active ON live_stream (active) WHERE active`;

const INSERT_PERMISSION = `INSERT INTO permission (code, description) VALUES ($1, $2)`;

const GRANT_TO_ADMIN = `
  INSERT INTO role_permissions (role_id, permission_code)
  SELECT role.id, $1 FROM role WHERE role.code = 'ADMIN'
`;

export class CreateLiveStream1794300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CREATE_LIVE_STREAM);
    await queryRunner.query(ONE_ACTIVE_LIVE_STREAM);
    await queryRunner.query(INSERT_PERMISSION, [
      LIVE_MANAGE,
      'Manage the live streams and the live section of the landing page',
    ]);
    await queryRunner.query(GRANT_TO_ADMIN, [LIVE_MANAGE]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permissions WHERE permission_code = $1`, [
      LIVE_MANAGE,
    ]);
    await queryRunner.query(`DELETE FROM permission WHERE code = $1`, [LIVE_MANAGE]);
    await queryRunner.query(`DROP TABLE live_stream`);
  }
}

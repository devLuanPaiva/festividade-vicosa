import type { MigrationInterface, QueryRunner } from 'typeorm';

const PHOTOGRAPHER_CODE = 'PHOTOGRAPHER';
const PHOTOGRAPHER_NAME = 'Fotógrafo';
const PHOTOGRAPHER_PERMISSIONS = ['photo:upload', 'photo:delete'];

const INSERT_ROLE = `INSERT INTO role (code, name, system) VALUES ($1, $2, true)`;

const INSERT_ROLE_PERMISSIONS = `
  INSERT INTO role_permissions (role_id, permission_code)
  SELECT role.id, unnest($2::varchar[]) FROM role WHERE role.code = $1
`;

export class AddPhotographerRole1794200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(INSERT_ROLE, [PHOTOGRAPHER_CODE, PHOTOGRAPHER_NAME]);
    await queryRunner.query(INSERT_ROLE_PERMISSIONS, [PHOTOGRAPHER_CODE, PHOTOGRAPHER_PERMISSIONS]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM role_permissions
       WHERE role_id IN (SELECT id FROM role WHERE code = $1)`,
      [PHOTOGRAPHER_CODE],
    );
    await queryRunner.query(`DELETE FROM role WHERE code = $1`, [PHOTOGRAPHER_CODE]);
  }
}

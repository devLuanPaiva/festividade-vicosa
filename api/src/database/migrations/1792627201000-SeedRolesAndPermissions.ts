import type { MigrationInterface, QueryRunner } from 'typeorm';

const PERMISSIONS: Record<string, string> = {
  'schedule:manage': 'Manage sub-events and schedule items',
  'team:manage': 'Manage categories, groups and teams',
  'match:create': 'Create, edit and delete matches',
  'match:record-score': 'Record, correct and finalize match scores',
  'photo:upload': 'Upload photos',
  'photo:delete': 'Delete and reorder photos of any album',
  'history:manage': 'Manage the history timeline',
  'user:manage': 'Create and deactivate users',
  'user:manage-permissions': 'Change permissions of roles and users',
};

const ROLES: Record<string, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  ASSISTANT: 'Assistant',
};

const ALL_PERMISSIONS = Object.keys(PERMISSIONS);

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ALL_PERMISSIONS,
  MANAGER: ALL_PERMISSIONS.filter((code) => !code.startsWith('user:')),
  ASSISTANT: ['match:record-score', 'photo:upload'],
};

export class SeedRolesAndPermissions1792627201000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [code, description] of Object.entries(PERMISSIONS)) {
      await queryRunner.query(`INSERT INTO permission (code, description) VALUES ($1, $2)`, [
        code,
        description,
      ]);
    }
    for (const [code, name] of Object.entries(ROLES)) {
      await queryRunner.query(`INSERT INTO role (code, name) VALUES ($1, $2)`, [code, name]);
    }
    for (const [roleCode, permissionCodes] of Object.entries(ROLE_PERMISSIONS)) {
      await queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_code)
         SELECT role.id, unnest($2::varchar[]) FROM role WHERE role.code = $1`,
        [roleCode, permissionCodes],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permissions`);
    await queryRunner.query(`DELETE FROM role`);
    await queryRunner.query(`DELETE FROM permission`);
  }
}

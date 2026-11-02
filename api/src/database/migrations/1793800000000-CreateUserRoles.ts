import type { MigrationInterface, QueryRunner } from 'typeorm';

const SYSTEM_ROLE_NAMES: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  ASSISTANT: 'Assistente',
};

const CREATE_USER_ROLES = `
  CREATE TABLE user_roles (
    user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES role (id),
    is_primary boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_id, role_id)
  )
`;

const ONE_PRIMARY_ROLE_PER_USER = `
  CREATE UNIQUE INDEX user_roles_one_primary_per_user ON user_roles (user_id) WHERE is_primary
`;

export class CreateUserRoles1793800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE role ADD COLUMN system boolean NOT NULL DEFAULT false`);
    await this.markSystemRoles(queryRunner);
    await queryRunner.query(CREATE_USER_ROLES);
    await queryRunner.query(ONE_PRIMARY_ROLE_PER_USER);
    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary) SELECT id, role_id, true FROM users`,
    );
    await queryRunner.query(`ALTER TABLE users DROP COLUMN role_id`);
    await this.cascadeOverridesOnUserDelete(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN role_id uuid REFERENCES role (id)`);
    await queryRunner.query(
      `UPDATE users SET role_id = user_roles.role_id
       FROM user_roles WHERE user_roles.user_id = users.id AND user_roles.is_primary`,
    );
    await queryRunner.query(`ALTER TABLE users ALTER COLUMN role_id SET NOT NULL`);
    await queryRunner.query(`DROP TABLE user_roles`);
    await queryRunner.query(`ALTER TABLE role DROP COLUMN system`);
  }

  private async markSystemRoles(queryRunner: QueryRunner): Promise<void> {
    for (const [code, name] of Object.entries(SYSTEM_ROLE_NAMES)) {
      await queryRunner.query(`UPDATE role SET system = true, name = $2 WHERE code = $1`, [
        code,
        name,
      ]);
    }
  }

  private async cascadeOverridesOnUserDelete(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_permission_overrides DROP CONSTRAINT user_permission_overrides_user_id_fkey`,
    );
    await queryRunner.query(
      `ALTER TABLE user_permission_overrides
       ADD FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE`,
    );
  }
}

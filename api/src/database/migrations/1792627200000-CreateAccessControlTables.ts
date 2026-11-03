import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccessControlTables1792627200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE permission (
        code varchar PRIMARY KEY,
        description varchar NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE role (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        code varchar NOT NULL UNIQUE,
        name varchar NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE role_permissions (
        role_id integer NOT NULL REFERENCES role (id) ON DELETE CASCADE,
        permission_code varchar NOT NULL REFERENCES permission (code),
        PRIMARY KEY (role_id, permission_code)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE users (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name varchar NOT NULL,
        email varchar NOT NULL,
        password_hash varchar NOT NULL,
        active boolean NOT NULL DEFAULT true,
        role_id integer NOT NULL REFERENCES role (id),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX users_email_unique ON users (lower(email))`);
    await queryRunner.query(`
      CREATE TABLE user_permission_overrides (
        user_id integer NOT NULL REFERENCES users (id),
        permission_code varchar NOT NULL REFERENCES permission (code),
        effect varchar NOT NULL CHECK (effect IN ('GRANTED', 'REVOKED')),
        PRIMARY KEY (user_id, permission_code)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_permission_overrides`);
    await queryRunner.query(`DROP TABLE users`);
    await queryRunner.query(`DROP TABLE role_permissions`);
    await queryRunner.query(`DROP TABLE role`);
    await queryRunner.query(`DROP TABLE permission`);
  }
}

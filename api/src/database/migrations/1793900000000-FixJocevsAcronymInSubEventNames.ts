import type { MigrationInterface, QueryRunner } from 'typeorm';

const OLD_PREFIX = 'JOCEV - ';
const NEW_PREFIX = 'JOCEV’S - ';

export class FixJocevsAcronymInSubEventNames1793900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.replacePrefix(queryRunner, OLD_PREFIX, NEW_PREFIX);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.replacePrefix(queryRunner, NEW_PREFIX, OLD_PREFIX);
  }

  private async replacePrefix(queryRunner: QueryRunner, from: string, to: string): Promise<void> {
    await queryRunner.query(
      `UPDATE sub_event SET name = $2 || substring(name FROM char_length($1) + 1)
       WHERE name LIKE $1 || '%'`,
      [from, to],
    );
  }
}

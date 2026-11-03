import type { MigrationInterface, QueryRunner } from 'typeorm';

const CREATE_ALBUM = `
  CREATE TABLE album (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_event_id uuid REFERENCES sub_event (id),
    event_date date,
    match_id uuid REFERENCES match (id),
    CHECK (
      (sub_event_id IS NOT NULL AND event_date IS NOT NULL AND match_id IS NULL)
      OR (match_id IS NOT NULL AND sub_event_id IS NULL AND event_date IS NULL)
    ),
    UNIQUE (sub_event_id, event_date),
    UNIQUE (match_id)
  )
`;

const CREATE_PHOTO = `
  CREATE TABLE photo (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id uuid NOT NULL REFERENCES album (id) ON DELETE CASCADE,
    storage_key varchar NOT NULL UNIQUE,
    sort_order integer NOT NULL CHECK (sort_order >= 0),
    uploaded_by_id uuid NOT NULL REFERENCES users (id),
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

const CREATE_PHOTO_ORDER_INDEX = `
  CREATE INDEX photo_album_order_index ON photo (album_id, sort_order)
`;

export class CreateAlbumAndPhotoTables1793600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(CREATE_ALBUM);
    await queryRunner.query(CREATE_PHOTO);
    await queryRunner.query(CREATE_PHOTO_ORDER_INDEX);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE photo`);
    await queryRunner.query(`DROP TABLE album`);
  }
}

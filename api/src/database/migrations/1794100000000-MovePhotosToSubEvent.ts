import type { MigrationInterface, QueryRunner } from 'typeorm';

const ADD_SUB_EVENT_COLUMN = `
  ALTER TABLE photo ADD COLUMN sub_event_id uuid REFERENCES sub_event (id) ON DELETE CASCADE
`;

const COPY_SUB_EVENT_FROM_ALBUM = `
  UPDATE photo SET sub_event_id = album.sub_event_id
  FROM album
  WHERE album.id = photo.album_id
`;

const DELETE_MATCH_PHOTOS = `DELETE FROM photo WHERE sub_event_id IS NULL`;

const RENUMBER_BY_EVENT_DAY = `
  UPDATE photo SET sort_order = ranked.position
  FROM (
    SELECT photo.id,
           row_number() OVER (
             PARTITION BY photo.sub_event_id
             ORDER BY album.event_date, photo.sort_order, photo.created_at
           ) - 1 AS position
    FROM photo
    JOIN album ON album.id = photo.album_id
  ) ranked
  WHERE ranked.id = photo.id
`;

const DROP_ALBUM_LINK = [
  `ALTER TABLE photo ALTER COLUMN sub_event_id SET NOT NULL`,
  `DROP INDEX photo_album_order_index`,
  `ALTER TABLE photo DROP COLUMN album_id`,
  `DROP TABLE album`,
  `CREATE INDEX photo_sub_event_order_index ON photo (sub_event_id, sort_order)`,
];

export class MovePhotosToSubEvent1794100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(ADD_SUB_EVENT_COLUMN);
    await queryRunner.query(COPY_SUB_EVENT_FROM_ALBUM);
    await queryRunner.query(DELETE_MATCH_PHOTOS);
    await queryRunner.query(RENUMBER_BY_EVENT_DAY);
    for (const statement of DROP_ALBUM_LINK) {
      await queryRunner.query(statement);
    }
  }

  public down(): Promise<void> {
    return Promise.reject(new Error('Moving the photos to the sub-event cannot be reverted.'));
  }
}

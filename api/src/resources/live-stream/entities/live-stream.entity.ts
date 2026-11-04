import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('live_stream')
export class LiveStream {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public title!: string;

  @Column({ type: 'varchar' })
  public videoId!: string;

  @Column({ type: 'varchar', nullable: true })
  public previewKey!: string | null;

  @Column({ type: 'timestamptz' })
  public startsAt!: Date;

  @Column({ type: 'boolean' })
  public active!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}

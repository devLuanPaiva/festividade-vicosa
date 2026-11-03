import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public albumId!: string;

  @Column({ type: 'varchar' })
  public storageKey!: string;

  @Column({ type: 'int' })
  public sortOrder!: number;

  @Column({ type: 'uuid' })
  public uploadedById!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}

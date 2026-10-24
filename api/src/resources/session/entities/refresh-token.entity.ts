import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public userId!: string;

  @Column({ type: 'uuid' })
  public familyId!: string;

  @Column({ type: 'varchar', length: 64 })
  public tokenHash!: string;

  @Column({ type: 'timestamptz' })
  public expiresAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  public rotatedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}

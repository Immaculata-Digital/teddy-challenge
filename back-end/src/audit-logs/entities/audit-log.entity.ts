import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column({ type: 'varchar' })
  action!: string; // CREATE, UPDATE, DELETE

  @Column({ name: 'entity_name', type: 'varchar' })
  entityName!: string;

  @Column({ name: 'entity_uuid', type: 'uuid', nullable: true })
  entityUuid!: string | null;

  @Column({ type: 'jsonb', name: 'before_data', nullable: true })
  beforeData!: any;

  @Column({ type: 'jsonb', name: 'after_data', nullable: true })
  afterData!: any;

  @Column({ name: 'user_uuid', type: 'uuid', nullable: true })
  userUuid!: string | null;

  @Column({ type: 'varchar', nullable: true })
  ip!: string | null;

  @Column({ type: 'varchar', nullable: true })
  origin!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

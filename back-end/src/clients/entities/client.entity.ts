import { Entity, Column } from 'typeorm';
import { IClient } from '@teddy/shared';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('clients')
export class Client extends BaseEntity implements Omit<IClient, 'createdAt' | 'updatedAt'> {
  @Column({ length: 100 })
  name!: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  salary!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'company_value' })
  companyValue!: number;

  @Column({ default: 0 })
  views!: number;
}

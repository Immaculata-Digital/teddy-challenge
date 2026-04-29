import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * BaseEntity — colunas de auditoria obrigatórias em todas as tabelas.
 *
 * Colunas:
 *  - uuid        : identificador único aleatório (PK)
 *  - seqid       : sequencial auto-incrementável
 *  - created_at  : data de cadastro
 *  - created_by  : quem cadastrou (uuid do usuário)
 *  - updated_at  : data da última atualização
 *  - updated_by  : quem atualizou (uuid do usuário)
 *  - deleted     : flag de exclusão lógica
 *  - deleted_at  : quando foi excluído
 *  - deleted_by  : quem excluiu (uuid do usuário)
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @PrimaryGeneratedColumn({ name: 'seqid', type: 'int' })
  seqid!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy!: string | null;

  @Column({ name: 'deleted', type: 'boolean', default: false })
  deleted!: boolean;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @Column({ name: 'deleted_by', type: 'uuid', nullable: true })
  deletedBy!: string | null;

  @BeforeInsert()
  protected setUuidOnInsert() {
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
  }

  @BeforeUpdate()
  protected setUpdatedAt() {
    this.updatedAt = new Date();
  }
}

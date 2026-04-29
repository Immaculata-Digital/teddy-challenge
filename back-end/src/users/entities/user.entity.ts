import { Entity, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'full_name', length: 200 })
  fullName!: string;

  @Column({ unique: true, length: 254 })
  email!: string;

  @Column({ name: 'password_hash', length: 72 })
  passwordHash!: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active!: boolean;

  // ----- lifecycle hooks -----

  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.passwordHash && !this.passwordHash.startsWith('$2b$')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  // ----- helpers -----

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.passwordHash);
  }

  toSafe(): Omit<User, 'passwordHash' | 'comparePassword' | 'hashPasswordOnInsert'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = this;
    return safe as ReturnType<typeof this.toSafe>;
  }
}

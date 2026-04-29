import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário criptografando a senha com bcrypt (rounds = 12).
   * Lança ConflictException se o e-mail já estiver em uso.
   */
  async create(dto: CreateUserDto, actorId?: string): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email, deleted: false },
    });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = this.usersRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      active: dto.active ?? true,
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    });

    return this.usersRepo.save(user);
  }

  /**
   * Busca usuário por e-mail (inclui hash).
   * Retorna null se não encontrado ou inativo/excluído.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email, deleted: false, active: true },
    });
  }

  /**
   * Busca usuário por UUID.
   */
  async findByUuid(uuid: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { uuid, deleted: false },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  /**
   * Valida e-mail + senha usando bcrypt.compare.
   * Retorna o usuário (sem hash) ou null se inválido.
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash' | 'comparePassword' | 'hashPasswordOnInsert'> | null> {
    const user = await this.usersRepo.findOne({
      where: { email, deleted: false, active: true },
      select: [
        'uuid', 'seqid', 'fullName', 'email', 'passwordHash',
        'active', 'createdAt', 'updatedAt',
      ],
    });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    return user.toSafe();
  }

  /**
   * Atualiza dados de um usuário.
   */
  async update(uuid: string, dto: UpdateUserDto, actorId?: string): Promise<User> {
    const user = await this.findByUuid(uuid);
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.active !== undefined) user.active = dto.active;
    user.updatedBy = actorId ?? null;
    return this.usersRepo.save(user);
  }

  /**
   * Troca a senha do usuário. Valida a senha atual antes de alterar.
   */
  async changePassword(
    uuid: string,
    currentPassword: string,
    newPassword: string,
    actorId?: string,
  ): Promise<void> {
    const user = await this.usersRepo.findOne({
      where: { uuid, deleted: false },
      select: ['uuid', 'passwordHash', 'updatedBy'],
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Senha atual incorreta.');

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.updatedBy = actorId ?? null;
    await this.usersRepo.save(user);
  }

  /**
   * Exclusão lógica (soft-delete).
   */
  async softDelete(uuid: string, actorId?: string): Promise<void> {
    const user = await this.findByUuid(uuid);
    user.deleted = true;
    user.deletedAt = new Date();
    user.deletedBy = actorId ?? null;
    await this.usersRepo.save(user);
  }
}

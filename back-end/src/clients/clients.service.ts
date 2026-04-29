import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { IPagination } from '@teddy/shared';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

export interface AuditContext {
  userUuid: string;
  ip: string;
  origin: string;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async findAll({ page, limit }: { page: number; limit: number }): Promise<IPagination<Client>> {
    const [data, total] = await this.clientsRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(uuid: string): Promise<Client> {
    const client = await this.clientsRepo.findOneBy({ uuid });
    if (!client) {
      throw new NotFoundException(`Cliente com UUID ${uuid} não encontrado`);
    }
    return client;
  }

  async create(
    data: { name: string; salary: number; companyValue: number },
    ctx: AuditContext,
  ): Promise<Client> {
    const client = this.clientsRepo.create(data);
    const saved = await this.clientsRepo.save(client);

    await this.auditLogsService.log({
      action: 'CREATE',
      entityName: 'Client',
      entityUuid: saved.uuid,
      afterData: saved,
      userUuid: ctx.userUuid,
      ip: ctx.ip,
      origin: ctx.origin,
    });

    return saved;
  }

  async update(
    uuid: string,
    data: { name?: string; salary?: number; companyValue?: number },
    ctx: AuditContext,
  ): Promise<Client> {
    const client = await this.findOne(uuid);
    const beforeData = { ...client };
    
    Object.assign(client, data);
    const saved = await this.clientsRepo.save(client);

    await this.auditLogsService.log({
      action: 'UPDATE',
      entityName: 'Client',
      entityUuid: saved.uuid,
      beforeData,
      afterData: saved,
      userUuid: ctx.userUuid,
      ip: ctx.ip,
      origin: ctx.origin,
    });

    return saved;
  }

  async remove(uuid: string, ctx: AuditContext): Promise<void> {
    const client = await this.findOne(uuid);
    const beforeData = { ...client };

    client.deleted = true;
    client.deletedAt = new Date();
    const saved = await this.clientsRepo.save(client);

    await this.auditLogsService.log({
      action: 'DELETE',
      entityName: 'Client',
      entityUuid: saved.uuid,
      beforeData,
      afterData: saved,
      userUuid: ctx.userUuid,
      ip: ctx.ip,
      origin: ctx.origin,
    });
  }

  async incrementViews(uuid: string): Promise<void> {
    await this.clientsRepo.increment({ uuid }, 'views', 1);
  }
}

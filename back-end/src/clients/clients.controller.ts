import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientsService, AuditContext } from './clients.service';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  private getAuditContext(req: Request): AuditContext {
    return {
      userUuid: (req.user as any)?.uuid || 'unknown',
      ip: req.ip || req.socket.remoteAddress || 'unknown',
      origin: req.headers.origin as string || req.headers.referer || 'unknown',
    };
  }

  @ApiOperation({ summary: 'Listar todos os clientes (paginado)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 16) {
    return this.clientsService.findAll({ page: +page, limit: +limit });
  }

  @ApiOperation({ summary: 'Buscar cliente por UUID' })
  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.clientsService.findOne(uuid);
  }

  @ApiOperation({ summary: 'Criar cliente' })
  @Post()
  create(
    @Body() body: { name: string; salary: number; companyValue: number },
    @Req() req: Request,
  ) {
    return this.clientsService.create(body, this.getAuditContext(req));
  }

  @ApiOperation({ summary: 'Atualizar cliente' })
  @Put(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() body: { name?: string; salary?: number; companyValue?: number },
    @Req() req: Request,
  ) {
    return this.clientsService.update(uuid, body, this.getAuditContext(req));
  }

  @ApiOperation({ summary: 'Deletar cliente' })
  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string, @Req() req: Request) {
    return this.clientsService.remove(uuid, this.getAuditContext(req));
  }

  @ApiOperation({ summary: 'Incrementar visualizações do cliente' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':uuid/view')
  incrementViews(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.clientsService.incrementViews(uuid);
  }
}

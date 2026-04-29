import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';
import { MetricsModule } from '../metrics/metrics.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { HealthModule } from '../health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { InitialDDL1777393021612 } from '../database/migrations/1777393021612-InitialDDL';
import { AddViewsToClient1777405278952 } from '../database/migrations/1777405278952-AddViewsToClient';
import { CreateAuditLogs1777405300000 } from '../database/migrations/1777405300000-CreateAuditLogs';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.getNumber('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: [InitialDDL1777393021612, AddViewsToClient1777405278952, CreateAuditLogs1777405300000],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    AuthModule,
    ClientsModule,
    MetricsModule,
    AuditLogsModule,
    HealthModule,
  ],
})
export class AppModule {}

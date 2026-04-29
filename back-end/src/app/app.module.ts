import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';
import { MetricsModule } from '../metrics/metrics.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { HealthModule } from '../health/health.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

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
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrationsRun: true,
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
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
